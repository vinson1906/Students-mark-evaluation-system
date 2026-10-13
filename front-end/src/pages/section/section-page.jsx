import { useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
    NumberInput,
    Stack,
    Text,
    Loader,
    Alert,
} from "@mantine/core";

import SectionTable from "./section";
import {
    getSection,
    createSection,
    updateSection,
    deleteSection,
} from "./section.service";
import { getDepartment } from "../department/department.service";

const emptyForm = {
    section_name: "",
    department: "",
    year: 1,
    semester: 1,
};

const getId = (value) => {
    if (value && typeof value === "object") {
        return value._id ? String(value._id) : "";
    }
    return value ? String(value) : "";
};

export const SectionPage = () => {
    const {
        data: sections = [],
        isLoading,
        isError,
        error,
    } = getSection();

    const {
        data: departments = [],
        isLoading: departmentsLoading,
        isError: departmentsError,
    } = getDepartment();

    const createMutation = createSection();
    const updateMutation = updateSection();
    const deleteMutation = deleteSection();

    const [form, setForm] = useState({ ...emptyForm });
    const [selectedSection, setSelectedSection] = useState(null);
    const [formOpened, setFormOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formError, setFormError] = useState("");
    const [pageError, setPageError] = useState("");

    const departmentOptions = departments.map((department) => ({
        value: String(department._id),
        label: `${department.code || ""} - ${department.department_name || ""
            }`,
    }));

    const updateForm = (key, value) => {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
        setFormError("");
        setPageError("");
    };

    const resetForm = () => {
        setForm({ ...emptyForm });
        setSelectedSection(null);
        setFormOpened(false);
        setFormError("");
    };

    const handleAdd = () => {
        setForm({ ...emptyForm });
        setSelectedSection(null);
        setFormError("");
        setPageError("");
        setFormOpened(true);
    };

    // Open the edit modal with the existing section values.
    const handleEdit = (section) => {
        setSelectedSection(section);

        setForm({
            section_name: section.section_name || "",
            department: getId(section.department),
            year: Number(section.year) || 1,
            semester: Number(section.semester) || 1,
        });

        setFormError("");
        setPageError("");
        setFormOpened(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const sectionName = form.section_name.trim().toUpperCase();
        const departmentId = getId(form.department);
        const year = Number(form.year);
        const semester = Number(form.semester);

        if (!sectionName || !departmentId) {
            setFormError("Enter a section name and select a department.");
            return;
        }

        if (!Number.isInteger(year) || year < 1 || year > 4) {
            setFormError("Year must be between 1 and 4.");
            return;
        }

        if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
            setFormError("Semester must be between 1 and 8.");
            return;
        }

        const duplicate = sections.some((section) => {
            const sameDepartment =
                getId(section.department) === departmentId;

            return (
                String(section._id) !== String(selectedSection?._id) &&
                section.section_name?.trim().toUpperCase() === sectionName &&
                sameDepartment &&
                Number(section.year) === year
            );
        });

        if (duplicate) {
            setFormError(
                "This section already exists for the selected department and year."
            );
            return;
        }

        const sectionPayload = {
            section_name: sectionName,
            department: departmentId,
            year,
            semester,
        };

        console.log(sectionPayload);


        try {
            setPageError("");

            if (selectedSection) {
                console.log("Inside the update",sectionPayload);

                await updateMutation.mutateAsync({
                    id: selectedSection._id,
                    section: sectionPayload,
                });
            } else {
                await createMutation.mutateAsync(sectionPayload);
            }

            resetForm();
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                err.message ||
                "Failed to save section."
            );
        }
    };

    const handleDeleteClick = (sectionOrId) => {
        const id = getId(
            typeof sectionOrId === "object"
                ? sectionOrId?._id
                : sectionOrId
        );

        if (!id) return;

        setDeleteId(id);
        setPageError("");
        setDeleteOpened(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;

        try {
            setPageError("");
            await deleteMutation.mutateAsync(deleteId);
            setDeleteOpened(false);
            setDeleteId(null);
        } catch (err) {
            setPageError(
                err.response?.data?.message ||
                err.message ||
                "Failed to delete section."
            );
        }
    };

    const isSaving =
        createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        Section Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage sections, departments, years, and semesters.
                    </p>
                </div>

                <Button onClick={handleAdd}>Add Section</Button>
            </div>

            {isError && (
                <Alert color="red" title="Failed to load sections">
                    {error?.response?.data?.message ||
                        error?.message ||
                        "Unable to fetch sections."}
                </Alert>
            )}

            {pageError && (
                <Alert color="red" title="Error">
                    {pageError}
                </Alert>
            )}

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader />
                </div>
            ) : !isError ? (
                <SectionTable
                    data={sections}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            ) : null}

            <Modal
                opened={formOpened}
                onClose={resetForm}
                title={selectedSection ? "Edit Section" : "Add Section"}
                centered
                size="md"
            >
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <TextInput
                            label="Section Name"
                            placeholder="Enter section name (e.g. A)"
                            value={form.section_name}
                            onChange={(event) =>
                                updateForm(
                                    "section_name",
                                    event.currentTarget.value
                                )
                            }
                            required
                        />

                        <Select
                            label="Department"
                            placeholder={
                                departmentsLoading
                                    ? "Loading departments..."
                                    : "Select department"
                            }
                            data={departmentOptions}
                            value={form.department || null}
                            onChange={(value) =>
                                updateForm("department", value || "")
                            }
                            searchable
                            required
                            disabled={
                                departmentsLoading ||
                                departmentsError ||
                                departmentOptions.length === 0
                            }
                            nothingFoundMessage="No departments found"
                        />

                        <NumberInput
                            label="Year"
                            min={1}
                            max={4}
                            allowDecimal={false}
                            value={form.year}
                            onChange={(value) =>
                                updateForm("year", Number(value) || 1)
                            }
                            required
                        />

                        <Select
                            label="Semester"
                            placeholder="Select semester"
                            data={Array.from(
                                { length: 8 },
                                (_, index) => ({
                                    value: String(index + 1),
                                    label: `Semester ${index + 1}`,
                                })
                            )}
                            value={String(form.semester)}
                            onChange={(value) =>
                                updateForm(
                                    "semester",
                                    Number(value) || 1
                                )
                            }
                            required
                        />

                        {formError && (
                            <Text c="red" size="sm">
                                {formError}
                            </Text>
                        )}

                        <Group justify="flex-end" mt="sm">
                            <Button
                                variant="default"
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" loading={isSaving}>
                                {selectedSection
                                    ? "Update Section"
                                    : "Create Section"}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Delete confirmation */}
            <Modal
                opened={deleteOpened}
                onClose={() => {
                    setDeleteOpened(false);
                    setDeleteId(null);
                }}
                title="Delete Section"
                centered
                size="sm"
            >
                <Stack gap="md">
                    <Text size="sm">
                        Are you sure you want to delete this section?
                    </Text>

                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => {
                                setDeleteOpened(false);
                                setDeleteId(null);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="red"
                            loading={deleteMutation.isPending}
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
};

export default SectionPage;