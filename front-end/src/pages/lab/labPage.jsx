import React, { useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
    NumberInput,
    Alert,
    Loader,
} from "@mantine/core";

import LabTable from "./lab";

import {
    getLabs,
    createLabs,
    upadteLabs,
    deletelabs,
} from "./lab.service";

import { getDepartment } from "../department/department.service";

const initialForm = {
    lab_name: "",
    department: "",
    acadamic_year: "",
    maximum_mark: 100,
};

export const LabPage = () => {
    const [data, setData] = useState({
        form: { ...initialForm },
        selectedLab: null,
        formOpened: false,
        deleteOpened: false,
        deleteId: null,
        error: "",
    });

    // Fetch labs
    const {
        data: labsResponse,
        isLoading: labsLoading,
        isError: labsError,
        error: labsErrorDetails,
    } = getLabs();

    // Fetch departments
    const {
        data: departmentResponse,
        isLoading: departmentLoading,
        isError: departmentError,
    } = getDepartment();

    // Mutations
    const createLabsMutation = createLabs();
    const updateLabsMutation = upadteLabs();
    const deleteLabsMutation = deletelabs();

    // Safely extract arrays from API responses
    const getArrayFromResponse = (response) => {
        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response)) {
            return response;
        }

        return [];
    };

    const labs = getArrayFromResponse(labsResponse);
    const departmentsList = getArrayFromResponse(departmentResponse);

    const departments = departmentsList.map((department) => ({
        value: String(department._id),
        label: department.department_name,
    }));

    const saving =
        createLabsMutation.isPending || updateLabsMutation.isPending;

    // Update modal state
    const updateData = (key, value) => {
        setData((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    // Update form fields
    const updateForm = (key, value) => {
        setData((previous) => ({
            ...previous,
            form: {
                ...previous.form,
                [key]: value,
            },
            error: "",
        }));
    };

    // Reset form and close modal
    const resetForm = () => {
        setData((previous) => ({
            ...previous,
            form: { ...initialForm },
            selectedLab: null,
            formOpened: false,
            error: "",
        }));
    };

    // Open create modal
    const handleAdd = () => {
        setData((previous) => ({
            ...previous,
            form: { ...initialForm },
            selectedLab: null,
            formOpened: true,
            error: "",
        }));
    };

    // Open edit modal
    const handleEdit = (lab) => {
        const departmentId =
            lab.department && typeof lab.department === "object"
                ? String(lab.department._id || "")
                : String(lab.department || "");

        setData((previous) => ({
            ...previous,
            selectedLab: lab,
            form: {
                lab_name: lab.lab_name || "",
                department: departmentId,
                acadamic_year: lab.acadamic_year || "",
                maximum_mark: Number(lab.maximum_mark) || 100,
            },
            formOpened: true,
            error: "",
        }));
    };

    // Create or update lab using backend mutations
    const handleSubmit = async (event) => {
        event.preventDefault();

        const {
            lab_name,
            department,
            acadamic_year,
            maximum_mark,
        } = data.form;

        if (
            !lab_name.trim() ||
            !department ||
            !acadamic_year.trim()
        ) {
            updateData("error", "Please fill in all required fields.");
            return;
        }

        if (
            maximum_mark === "" ||
            maximum_mark === null ||
            maximum_mark === undefined ||
            Number(maximum_mark) <= 0
        ) {
            updateData("error", "Maximum marks must be greater than zero.");
            return;
        }

        const labPayload = {
            lab_name: lab_name.trim(),

            // Send the MongoDB ObjectId, not a department object
            department,

            acadamic_year: acadamic_year.trim(),
            maximum_mark: Number(maximum_mark),
        };

        try {
            if (data.selectedLab) {
                // UPDATE
                await updateLabsMutation.mutateAsync({
                    id: data.selectedLab._id,
                    ...labPayload,
                });
            } else {
                // CREATE
                await createLabsMutation.mutateAsync(labPayload);
            }

            resetForm();
        } catch (error) {
            updateData(
                "error",
                error?.response?.data?.message ||
                error?.message ||
                "Unable to save the lab. Please try again."
            );
        }
    };

    // Open delete confirmation modal
    const handleDeleteClick = (id) => {
        updateData("deleteId", id);
        updateData("deleteOpened", true);
    };

    // Delete lab using backend mutation
    const handleDeleteConfirm = async () => {
        if (!data.deleteId) return;

        try {
            await deleteLabsMutation.mutateAsync(data.deleteId);

            setData((previous) => ({
                ...previous,
                deleteOpened: false,
                deleteId: null,
                error: "",
            }));
        } catch (error) {
            setData((previous) => ({
                ...previous,
                error:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to delete the lab. Please try again.",
            }));
        }
    };

    return (
        <>
            {/* Page header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Lab Management</h2>
                    <p className="text-sm text-gray-500">
                        Manage laboratories and their academic details.
                    </p>
                </div>

                <Button onClick={handleAdd}>Add Lab</Button>
            </div>

            {/* Lab list */}
            {labsLoading ? (
                <div className="flex items-center gap-2 py-8">
                    <Loader size="sm" />
                    <span>Loading labs...</span>
                </div>
            ) : labsError ? (
                <Alert color="red" title="Failed to load labs">
                    {labsErrorDetails?.message || "Please check your backend API."}
                </Alert>
            ) : (
                <LabTable
                    data={labs}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* Add / Edit modal */}
            <Modal
                opened={data.formOpened}
                onClose={() => {
                    if (!saving) resetForm();
                }}
                title={data.selectedLab ? "Edit Lab" : "Add Lab"}
                centered
                closeOnClickOutside={!saving}
                closeOnEscape={!saving}
            >
                <form onSubmit={handleSubmit}>
                    {data.error && (
                        <Alert color="red" mb="md" title="Error">
                            {data.error}
                        </Alert>
                    )}

                    <TextInput
                        label="Lab Name"
                        placeholder="Enter lab name"
                        value={data.form.lab_name}
                        onChange={(event) =>
                            updateForm("lab_name", event.currentTarget.value)
                        }
                        required
                        mb="md"
                    />

                    <Select
                        label="Department"
                        placeholder={
                            departmentLoading
                                ? "Loading departments..."
                                : "Select department"
                        }
                        data={departments}
                        value={data.form.department || null}
                        onChange={(value) =>
                            updateForm("department", value || "")
                        }
                        disabled={departmentLoading || departmentError}
                        searchable
                        required
                        nothingFoundMessage="No departments found"
                        mb="md"
                    />

                    {departmentError && (
                        <Alert color="red" mb="md">
                            Failed to load departments. Please refresh and try again.
                        </Alert>
                    )}

                    <TextInput
                        label="Academic Year"
                        placeholder="2026-2027"
                        value={data.form.acadamic_year}
                        onChange={(event) =>
                            updateForm("acadamic_year", event.currentTarget.value)
                        }
                        required
                        mb="md"
                    />

                    <NumberInput
                        label="Maximum Marks"
                        placeholder="Enter maximum marks"
                        min={1}
                        value={data.form.maximum_mark}
                        onChange={(value) =>
                            updateForm("maximum_mark", value)
                        }
                        required
                        mb="md"
                    />

                    <Group justify="flex-end" mt="lg">
                        <Button
                            variant="default"
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" loading={saving}>
                            {data.selectedLab ? "Update Lab" : "Create Lab"}
                        </Button>
                    </Group>
                </form>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal
                opened={data.deleteOpened}
                onClose={() => {
                    if (!deleteLabsMutation.isPending) {
                        setData((previous) => ({
                            ...previous,
                            deleteOpened: false,
                            deleteId: null,
                        }));
                    }
                }}
                title="Delete Lab"
                centered
                size="sm"
            >
                <p className="mb-4 text-sm text-gray-600">
                    Are you sure you want to delete this lab? This action cannot be
                    undone.
                </p>

                {data.error && (
                    <Alert color="red" mb="md">
                        {data.error}
                    </Alert>
                )}

                <Group justify="flex-end">
                    <Button
                        variant="default"
                        onClick={() => {
                            setData((previous) => ({
                                ...previous,
                                deleteOpened: false,
                                deleteId: null,
                            }));
                        }}
                        disabled={deleteLabsMutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        onClick={handleDeleteConfirm}
                        loading={deleteLabsMutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
};