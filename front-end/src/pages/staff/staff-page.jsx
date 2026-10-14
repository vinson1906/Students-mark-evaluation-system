import React, { useMemo, useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
    Alert,
    Loader,
} from "@mantine/core";

import FacultyTable from "./staff";

import {
    getFaculty,
    createFaculty,
    deleteFaculty,
    updateFaculty,
} from "./staff.service";

import { getDepartment } from "../department/department.service";
import { getLabs } from "../lab/lab.service";

const emptyForm = {
    faculty_name: "",
    department: "",
    lab: "",
};

const getReferenceId = (value) => {
    if (value && typeof value === "object") {
        return value._id ? String(value._id) : "";
    }

    return value ? String(value) : "";
};
const getArrayFromResponse = (response) => {
    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    return [];
};

export const FacultyPage = () => {
    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedFaculty: null,
        formOpened: false,
        deleteOpened: false,
        deleteId: null,
        error: "",
        deleteError: "",
    });

    const {
        data: facultyResponse,
        isLoading: facultyLoading,
        isError: facultyIsError,
        error: facultyFetchError,
    } = getFaculty();

    const {
        data: departmentResponse,
        isLoading: departmentLoading,
        isError: departmentIsError,
    } = getDepartment();

    const {
        data: labsResponse,
        isLoading: labsLoading,
        isError: labsIsError,
    } = getLabs();

    const createFacultyMutation = createFaculty();
    const updateFacultyMutation = updateFaculty();
    const deleteFacultyMutation = deleteFaculty();

    const faculty = getArrayFromResponse(facultyResponse);
    const departmentsList = getArrayFromResponse(departmentResponse);
    const labsList = getArrayFromResponse(labsResponse);

    const departmentOptions = useMemo(
        () =>
            departmentsList.map((department) => ({
                value: String(department._id),
                label: department.department_name,
            })),
        [departmentsList]
    );

    const labOptions = useMemo(
        () =>
            labsList.map((lab) => ({
                value: String(lab._id),
                label: lab.lab_name,
                departmentId: getReferenceId(lab.department),
            })),
        [labsList]
    );

    const filteredLabs = useMemo(
        () =>
            labOptions.filter(
                (lab) => lab.departmentId === data.form.department
            ),
        [labOptions, data.form.department]
    );

    const saving =
        createFacultyMutation.isPending ||
        updateFacultyMutation.isPending;

    const updateData = (key, value) => {
        setData((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const updateForm = (key, value) => {
        setData((previous) => ({
            ...previous,
            form: {
                ...previous.form,
                [key]: value,

                ...(key === "department" ? { lab: "" } : {}),
            },
            error: "",
        }));
    };

    const resetForm = () => {
        setData((previous) => ({
            ...previous,
            form: { ...emptyForm },
            selectedFaculty: null,
            formOpened: false,
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((previous) => ({
            ...previous,
            form: { ...emptyForm },
            selectedFaculty: null,
            formOpened: true,
            error: "",
        }));
    };

    const handleEdit = (member) => {
        setData((previous) => ({
            ...previous,
            selectedFaculty: member,
            form: {
                faculty_name: member.faculty_name || "",
                department: getReferenceId(member.department),
                lab: getReferenceId(member.lab),
            },
            formOpened: true,
            error: "",
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { faculty_name, department, lab } = data.form;

        if (!faculty_name.trim() || !department || !lab) {
            updateData("error", "Please fill in all required fields.");
            return;
        }

        const selectedDepartment = departmentOptions.find(
            (item) => item.value === department
        );

        const selectedLab = labOptions.find(
            (item) => item.value === lab
        );

        if (!selectedDepartment || !selectedLab) {
            updateData(
                "error",
                "Please select a valid department and lab."
            );
            return;
        }

        if (selectedLab.departmentId !== department) {
            updateData(
                "error",
                "The selected lab must belong to the selected department."
            );
            return;
        }

        const facultyPayload = {
            faculty_name: faculty_name.trim(),
            department,
            lab,
        };

        try {
            if (data.selectedFaculty) {
               
                await updateFacultyMutation.mutateAsync({
                    id: data.selectedFaculty._id,
                    ...facultyPayload,
                });
            } else {
                await createFacultyMutation.mutateAsync(facultyPayload);
            }

            resetForm();
        } catch (error) {
            updateData(
                "error",
                error?.response?.data?.message ||
                error?.message ||
                "Unable to save faculty. Please try again."
            );
        }
    };

    const handleDeleteClick = (memberOrId) => {
        const id =
            typeof memberOrId === "object"
                ? memberOrId?._id
                : memberOrId;

        if (!id) return;

        setData((previous) => ({
            ...previous,
            deleteId: id,
            deleteOpened: true,
            deleteError: "",
        }));
    };

    const handleDeleteConfirm = async () => {
        if (!data.deleteId) return;

        try {
            await deleteFacultyMutation.mutateAsync(data.deleteId);

            setData((previous) => ({
                ...previous,
                deleteOpened: false,
                deleteId: null,
                deleteError: "",
            }));
        } catch (error) {
            updateData(
                "deleteError",
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete faculty. Please try again."
            );
        }
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Faculty Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage faculty members and their assigned laboratories.
                    </p>
                </div>

                <Button
                    onClick={handleAdd}
                    disabled={departmentIsError || labsIsError}
                >
                    Add Faculty
                </Button>
            </div>

            {facultyLoading && (
                <div className="flex items-center gap-2 py-8">
                    <Loader size="sm" />
                    <span>Loading faculty...</span>
                </div>
            )}

            {facultyIsError && (
                <Alert color="red" title="Failed to load faculty" mb="md">
                    {facultyFetchError?.message ||
                        "Please check your backend API and try again."}
                </Alert>
            )}

            {(departmentIsError || labsIsError) && (
                <Alert color="red" title="Failed to load form options" mb="md">
                    {departmentIsError && (
                        <p>Unable to load departments.</p>
                    )}
                    {labsIsError && <p>Unable to load laboratories.</p>}
                </Alert>
            )}

            {!facultyLoading && !facultyIsError && (
                <FacultyTable
                    data={faculty}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            <Modal
                opened={data.formOpened}
                onClose={() => {
                    if (!saving) resetForm();
                }}
                title={
                    data.selectedFaculty ? "Edit Faculty" : "Add Faculty"
                }
                centered
                closeOnClickOutside={!saving}
                closeOnEscape={!saving}
            >
                <form onSubmit={handleSubmit}>
                    {data.error && (
                        <Alert color="red" title="Error" mb="md">
                            {data.error}
                        </Alert>
                    )}

                    <TextInput
                        label="Faculty Name"
                        placeholder="Enter faculty name"
                        value={data.form.faculty_name}
                        onChange={(event) =>
                            updateForm(
                                "faculty_name",
                                event.currentTarget.value
                            )
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
                        data={departmentOptions}
                        value={data.form.department || null}
                        onChange={(value) =>
                            updateForm("department", value || "")
                        }
                        disabled={departmentLoading || departmentIsError}
                        searchable
                        required
                        nothingFoundMessage="No departments found"
                        mb="md"
                    />

                    <Select
                        label="Assigned Lab"
                        placeholder={
                            labsLoading
                                ? "Loading laboratories..."
                                : data.form.department
                                    ? "Select lab"
                                    : "Select department first"
                        }
                        data={filteredLabs.map((lab) => ({
                            value: lab.value,
                            label: lab.label,
                        }))}
                        value={data.form.lab || null}
                        onChange={(value) =>
                            updateForm("lab", value || "")
                        }
                        disabled={
                            !data.form.department ||
                            labsLoading ||
                            labsIsError
                        }
                        searchable
                        required
                        nothingFoundMessage="No labs found for this department"
                        mb="md"
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="default"
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" loading={saving}>
                            {data.selectedFaculty
                                ? "Update Faculty"
                                : "Create Faculty"}
                        </Button>
                    </Group>
                </form>
            </Modal>


            <Modal
                opened={data.deleteOpened}
                onClose={() => {
                    if (!deleteFacultyMutation.isPending) {
                        setData((previous) => ({
                            ...previous,
                            deleteOpened: false,
                            deleteId: null,
                            deleteError: "",
                        }));
                    }
                }}
                title="Delete Faculty"
                centered
                size="sm"
            >
                <p className="mb-4 text-sm text-gray-600">
                    Are you sure you want to delete this faculty member?
                    This action cannot be undone.
                </p>

                {data.deleteError && (
                    <Alert color="red" title="Delete failed" mb="md">
                        {data.deleteError}
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
                                deleteError: "",
                            }));
                        }}
                        disabled={deleteFacultyMutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        onClick={handleDeleteConfirm}
                        loading={deleteFacultyMutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
};