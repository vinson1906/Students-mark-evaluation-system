import React, { useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
} from "@mantine/core";

import StudentsTable from "./student";

import {
    getStudents,
    createStudents,
    deleteStudents,
    updateStudent,
} from "./students.service";

import { getDepartment } from "../department/department.service";
import { getSection } from "../section/section.service";

// Team demo data — unchanged until the Team API is ready.
const teamOptions = [
    {
        value: "6acc30001cb9b2b76aa4ff01",
        label: "Team Alpha",
        sectionId: "6acb10001cb9b2b76aa4ff01",
    },
    {
        value: "6acc30001cb9b2b76aa4ff02",
        label: "Team Beta",
        sectionId: "6acb10001cb9b2b76aa4ff03",
    },
];

const emptyForm = {
    student_name: "",
    student_reg: "",
    student_department: "",
    section: "",
    team: "",
};

// Supports populated MongoDB references and plain IDs.
const getReferenceId = (value) => {
    if (value && typeof value === "object") {
        return value._id ? String(value._id) : "";
    }

    return value ? String(value) : "";
};

// Supports API responses shaped as { data: [...] } or [...]
const getArrayFromResponse = (response) => {
    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    return [];
};

export const StudentPage = () => {
    // GET students
    const {
        data: studentsResponse,
        isLoading,
        isError,
        error,
    } = getStudents();

    // GET departments
    const {
        data: departmentsResponse,
        isLoading: departmentsLoading,
        isError: departmentsError,
    } = getDepartment();

    // GET sections
    const {
        data: sectionsResponse,
        isLoading: sectionsLoading,
        isError: sectionsError,
    } = getSection();

    // CREATE, UPDATE, DELETE mutations
    const createMutation = createStudents();
    const updateMutation = updateStudent();
    const deleteMutation = deleteStudents();

    const students = getArrayFromResponse(studentsResponse);
    const departments = getArrayFromResponse(departmentsResponse);
    const sections = getArrayFromResponse(sectionsResponse);

    // Dynamic department options from API
    const departmentOptions = departments.map((department) => ({
        value: String(department._id),
        label: department.department_name,
    }));

    // Dynamic section options from API
    // Supports section.department as an ID or populated object.
    const sectionOptions = sections.map((section) => {
        const departmentId = getReferenceId(section.department);

        const departmentName =
            section.department &&
                typeof section.department === "object"
                ? section.department.department_name
                : departments.find(
                    (department) =>
                        String(department._id) === departmentId
                )?.department_name;

        return {
            value: String(section._id),
            label: `${section.section_name} - ${departmentName || "Department"
                }`,
            departmentId,
        };
    });

    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedStudent: null,
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

                // Changing department resets section and team.
                ...(key === "student_department"
                    ? { section: "", team: "" }
                    : {}),

                // Changing section resets team.
                ...(key === "section" ? { team: "" } : {}),
            },
            error: "",
        }));
    };

    const resetForm = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedStudent: null,
            formOpened: false,
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedStudent: null,
            formOpened: true,
            error: "",
        }));
    };

    // EDIT student
    const handleEdit = (student) => {
        setData((prev) => ({
            ...prev,
            selectedStudent: student,
            form: {
                student_name: student.student_name || "",
                student_reg: student.student_reg || "",
                student_department: getReferenceId(
                    student.student_department
                ),
                section: getReferenceId(student.section),
                team: getReferenceId(student.team),
            },
            formOpened: true,
            error: "",
        }));
    };

    // CREATE / UPDATE student
    const handleSubmit = (event) => {
        event.preventDefault();

        const { form, selectedStudent } = data;

        if (
            !form.student_name.trim() ||
            !form.student_reg.trim() ||
            !form.student_department ||
            !form.section
        ) {
            updateData(
                "error",
                "Please fill in all required fields."
            );
            return;
        }

        // Check duplicate registration number.
        const duplicateReg = students.some(
            (student) =>
                String(student._id) !==
                String(selectedStudent?._id) &&
                student.student_reg?.trim().toLowerCase() ===
                form.student_reg.trim().toLowerCase()
        );

        if (duplicateReg) {
            updateData(
                "error",
                "This register number already exists."
            );
            return;
        }

        // Validate against live department and section options.
        const department = departmentOptions.find(
            (item) => item.value === form.student_department
        );

        const section = sectionOptions.find(
            (item) => item.value === form.section
        );

        if (
            !department ||
            !section ||
            section.departmentId !== form.student_department
        ) {
            updateData(
                "error",
                "Please select a valid department and section."
            );
            return;
        }

        // Existing team validation — unchanged.
        const team = teamOptions.find(
            (item) => item.value === form.team
        );

        if (
            form.team &&
            (!team || team.sectionId !== form.section)
        ) {
            updateData(
                "error",
                "The selected team must belong to this section."
            );
            return;
        }

        // Send MongoDB IDs to the backend.
        const studentPayload = {
            student_name: form.student_name.trim(),
            student_reg: form.student_reg.trim(),
            student_department: form.student_department,
            section: form.section,
            team: form.team || null,
        };

        if (selectedStudent) {
            // UPDATE
            updateMutation.mutate(
                {
                    id: selectedStudent._id,
                    student: studentPayload,
                },
                {
                    onSuccess: () => {
                        resetForm();
                    },
                    onError: (err) => {
                        updateData(
                            "error",
                            err?.response?.data?.message ||
                            err?.message ||
                            "Failed to update student."
                        );
                    },
                }
            );
        } else {
            // CREATE
            createMutation.mutate(studentPayload, {
                onSuccess: () => {
                    resetForm();
                },
                onError: (err) => {
                    updateData(
                        "error",
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to create student."
                    );
                },
            });
        }
    };

    // Open delete confirmation.
    const handleDeleteClick = (id) => {
        setData((prev) => ({
            ...prev,
            deleteId: id,
            deleteOpened: true,
            error: "",
        }));
    };

    // DELETE student
    const handleDeleteConfirm = () => {
        if (!data.deleteId) return;

        deleteMutation.mutate(data.deleteId, {
            onSuccess: () => {
                setData((prev) => ({
                    ...prev,
                    deleteOpened: false,
                    deleteId: null,
                    error: "",
                }));
            },
            onError: (err) => {
                setData((prev) => ({
                    ...prev,
                    error:
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to delete student.",
                }));
            },
        });
    };

    // Filter sections by selected department.
    const filteredSections = sectionOptions.filter(
        (section) =>
            section.departmentId === data.form.student_department
    );

    // Existing team filtering — unchanged.
    const filteredTeams = teamOptions.filter(
        (team) => team.sectionId === data.form.section
    );

    const isSaving =
        createMutation.isPending || updateMutation.isPending;

    return (
        <>
            {/* PAGE HEADER */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Student Management
                </h2>

                <Button
                    onClick={handleAdd}
                    disabled={departmentsError || sectionsError}
                >
                    Add Student
                </Button>
            </div>

            {/* STUDENTS TABLE */}
            {isLoading ? (
                <p className="py-4">Loading students...</p>
            ) : isError ? (
                <p className="py-4 text-red-600">
                    {error?.message || "Failed to load students."}
                </p>
            ) : (
                <StudentsTable
                    data={students}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* ADD / UPDATE MODAL */}
            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={
                    data.selectedStudent
                        ? "Edit Student"
                        : "Add Student"
                }
                centered
            >
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Student Name"
                        placeholder="Enter student name"
                        value={data.form.student_name}
                        onChange={(event) =>
                            updateForm(
                                "student_name",
                                event.currentTarget.value
                            )
                        }
                        required
                        mb="md"
                    />

                    <TextInput
                        label="Register Number"
                        placeholder="Enter register number"
                        value={data.form.student_reg}
                        onChange={(event) =>
                            updateForm(
                                "student_reg",
                                event.currentTarget.value
                            )
                        }
                        required
                        mb="md"
                    />

                    {/* LIVE DEPARTMENT DROPDOWN */}
                    <Select
                        label="Department"
                        placeholder={
                            departmentsLoading
                                ? "Loading departments..."
                                : "Select department"
                        }
                        data={departmentOptions}
                        value={
                            data.form.student_department || null
                        }
                        onChange={(value) =>
                            updateForm(
                                "student_department",
                                value || ""
                            )
                        }
                        searchable
                        required
                        disabled={
                            departmentsLoading ||
                            departmentsError
                        }
                        nothingFoundMessage="No departments found"
                        mb="md"
                    />

                    {departmentsError && (
                        <p className="mb-3 text-sm text-red-600">
                            Failed to load departments. Please refresh
                            and try again.
                        </p>
                    )}

                    {/* LIVE SECTION DROPDOWN */}
                    <Select
                        label="Section"
                        placeholder={
                            sectionsLoading
                                ? "Loading sections..."
                                : "Select section"
                        }
                        data={filteredSections.map((section) => ({
                            value: section.value,
                            label: section.label,
                        }))}
                        value={data.form.section || null}
                        onChange={(value) =>
                            updateForm("section", value || "")
                        }
                        disabled={
                            !data.form.student_department ||
                            sectionsLoading ||
                            sectionsError
                        }
                        searchable
                        required
                        nothingFoundMessage="No sections found for this department"
                        mb="md"
                    />

                    {sectionsError && (
                        <p className="mb-3 text-sm text-red-600">
                            Failed to load sections. Please refresh
                            and try again.
                        </p>
                    )}

                    {/* TEAM DROPDOWN — STILL USING DEMO DATA */}
                    <Select
                        label="Team"
                        placeholder="Select team (optional)"
                        data={filteredTeams.map((team) => ({
                            value: team.value,
                            label: team.label,
                        }))}
                        value={data.form.team || null}
                        onChange={(value) =>
                            updateForm("team", value || "")
                        }
                        disabled={!data.form.section}
                        clearable
                        searchable
                        nothingFoundMessage="No teams available for this section"
                        mb="md"
                    />

                    {/* FORM ERROR */}
                    {data.error && (
                        <p className="mb-3 text-sm text-red-600">
                            {data.error}
                        </p>
                    )}

                    {/* FORM ACTIONS */}
                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="default"
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            loading={isSaving}
                            disabled={
                                departmentsLoading ||
                                sectionsLoading ||
                                departmentsError ||
                                sectionsError
                            }
                        >
                            {data.selectedStudent
                                ? "Update Student"
                                : "Add Student"}
                        </Button>
                    </Group>
                </form>
            </Modal>

            {/* DELETE CONFIRMATION */}
            <Modal
                opened={data.deleteOpened}
                onClose={() =>
                    setData((prev) => ({
                        ...prev,
                        deleteOpened: false,
                        deleteId: null,
                        error: "",
                    }))
                }
                title="Delete Student"
                centered
                size="sm"
            >
                <p className="mb-4">
                    Are you sure you want to delete this student?
                </p>

                {data.error && (
                    <p className="mb-3 text-sm text-red-600">
                        {data.error}
                    </p>
                )}

                <Group justify="flex-end">
                    <Button
                        variant="default"
                        disabled={deleteMutation.isPending}
                        onClick={() =>
                            setData((prev) => ({
                                ...prev,
                                deleteOpened: false,
                                deleteId: null,
                                error: "",
                            }))
                        }
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
            </Modal>
        </>
    );
};

export default StudentPage;