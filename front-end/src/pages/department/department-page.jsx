import { useState } from "react";
import {
    Button,
    Modal,
    TextInput,
    Group,
    Stack,
    Text,
    Loader,
    Alert,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import DepartmentTable from "./department-table";
import {
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "./department.service";

const initialFormData = {
    department_name: "",
    code: "",
};

export const DepartmentPage = () => {
    const {
        data: departments = [],
        isLoading,
        isError,
        error,
    } = getDepartment();

    const createMutation = createDepartment();
    const updateMutation = updateDepartment();
    const deleteMutation = deleteDepartment();

    const [data, setData] = useState({
        form: { ...initialFormData },
        selectedDepartment: null,
        formOpened: false,
        deleteOpened: false,
        deleteId: null,
        error: "",
    });

    const updateData = (key, value) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateForm = (key, value) => {
        setData((prev) => ({
            ...prev,
            form: {
                ...prev.form,
                [key]: value,
            },
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((prev) => ({
            ...prev,
            form: { ...initialFormData },
            selectedDepartment: null,
            formOpened: true,
            error: "",
        }));
    };

    const handleEdit = (department) => {
        setData((prev) => ({
            ...prev,
            form: {
                department_name: department.department_name || "",
                code: department.code || "",
            },
            selectedDepartment: department,
            formOpened: true,
            error: "",
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const departmentName = data.form.department_name.trim();
        const departmentCode = data.form.code.trim();

        if (!departmentName || !departmentCode) {
            updateData("error", "Department name and code are required.");
            return;
        }

        const duplicate = departments.some(
            (department) =>
                (
                    department.department_name?.toLowerCase() ===
                    departmentName.toLowerCase() ||
                    department.code?.toLowerCase() === departmentCode.toLowerCase()
                ) && department._id !== data.selectedDepartment?._id
        );

        if (duplicate) {
            updateData("error", "Department name or code already exists.");
            return;
        }

        const department = {
            department_name: departmentName,
            code: departmentCode.toUpperCase(),
        };

        try {
            if (data.selectedDepartment) {
                await updateMutation.mutateAsync({
                    id: data.selectedDepartment._id,
                    department,
                });
            } else {
                await createMutation.mutateAsync(department);
            }

            setData((prev) => ({
                ...prev,
                form: { ...initialFormData },
                selectedDepartment: null,
                formOpened: false,
                error: "",
            }));
        } catch (err) {
            updateData(
                "error",
                err.response?.data?.message ||
                err.message ||
                "Failed to save department."
            );
        }
    };

    const handleDeleteClick = (id) => {
        setData((prev) => ({
            ...prev,
            deleteId: id,
            deleteOpened: true,
            error: "",
        }));
    };

    const handleConfirmDelete = async () => {
        if (!data.deleteId) return;

        try {
            await deleteMutation.mutateAsync(data.deleteId);

            setData((prev) => ({
                ...prev,
                deleteOpened: false,
                deleteId: null,
                error: "",
            }));
        } catch (err) {
            updateData(
                "error",
                err.response?.data?.message ||
                err.message ||
                "Failed to delete department."
            );
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Department Management
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage departments and their information.
                    </p>
                </div>

                <Button
                    leftSection={<IconPlus size={18} />}
                    onClick={handleAdd}
                    color="blue"
                >
                    Add Department
                </Button>
            </div>

            {isError && (
                <Alert color="red" title="Failed to load departments">
                    {error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong."}
                </Alert>
            )}

            {data.error && (
                <Alert color="red" title="Error">
                    {data.error}
                </Alert>
            )}

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader />
                </div>
            ) : (
                !isError && (
                    <DepartmentTable
                        data={departments}
                        onEdit={handleEdit}
                        onDelete={(departmentOrId) =>
                            handleDeleteClick(
                                typeof departmentOrId === "string"
                                    ? departmentOrId
                                    : departmentOrId._id
                            )
                        }
                    />
                )
            )}

            {/* Add / Edit Department Modal */}
            <Modal
                opened={data.formOpened}
                onClose={() => updateData("formOpened", false)}
                title={
                    <Text fw={700} size="lg">
                        {data.selectedDepartment ? "Edit Department" : "Add Department"}
                    </Text>
                }
                centered
                size="md"
            >
                <form onSubmit={handleSave}>
                    <Stack gap="md">
                        <TextInput
                            label="Department Name"
                            placeholder="Enter department name"
                            value={data.form.department_name}
                            onChange={(event) =>
                                updateForm("department_name", event.currentTarget.value)
                            }
                            required
                        />

                        <TextInput
                            label="Department Code"
                            placeholder="Enter department code (e.g. CSE)"
                            value={data.form.code}
                            onChange={(event) =>
                                updateForm("code", event.currentTarget.value)
                            }
                            required
                        />

                        {data.error && (
                            <Text c="red" size="sm">
                                {data.error}
                            </Text>
                        )}

                        <Group justify="flex-end" mt="sm">
                            <Button
                                variant="default"
                                type="button"
                                onClick={() => updateData("formOpened", false)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" color="blue" loading={isSaving}>
                                {data.selectedDepartment
                                    ? "Save Changes"
                                    : "Create Department"}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={data.deleteOpened}
                onClose={() =>
                    setData((prev) => ({
                        ...prev,
                        deleteOpened: false,
                        deleteId: null,
                    }))
                }
                title={<Text fw={700} size="lg">Delete Department</Text>}
                centered
                size="sm"
            >
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Are you sure you want to delete this department? This action cannot
                        be undone.
                    </Text>

                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() =>
                                setData((prev) => ({
                                    ...prev,
                                    deleteOpened: false,
                                    deleteId: null,
                                }))
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            color="red"
                            loading={deleteMutation.isPending}
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
};

export default DepartmentPage;