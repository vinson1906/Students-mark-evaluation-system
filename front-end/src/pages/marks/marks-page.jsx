import React, { useMemo, useState } from "react";
import {
    Modal,
    Select,
    Button,
    Group,
    NumberInput,
    Loader,
} from "@mantine/core";

import { useQueryClient } from "@tanstack/react-query";

import MarksTable from "./marks";

import {
    getMarks,
    createMarks,
    updateMarks,
    deleteMarks,
} from "./marks.service";

import { getFaculty } from "../staff/staff.service";
import { getStudents } from "../student/students.service";
import { getLabs } from "../lab/lab.service";
import { getSection } from "../section/section.service";

const emptyForm = {
    student: "",
    section: "",
    lab: "",
    practical_execution: 0,
    used_html: 0,
    js_logics: 0,
    css_responsiveness: 0,
    viva: 0,
    documendation: 0,
    maximum_marks: 100,
    project_status: "PENDING",
    evaluatedBy: "",
};

const evaluationFields = [
    { key: "practical_execution", label: "Practical Execution" },
    { key: "used_html", label: "HTML Usage" },
    { key: "js_logics", label: "JavaScript Logic" },
    { key: "css_responsiveness", label: "CSS Responsiveness" },
    { key: "viva", label: "Viva" },
    { key: "documendation", label: "Documentation" },
];

// Supports APIs returning either an array or { data: [...] }.
const getArrayFromResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.results)) return response.results;
    return [];
};

// Handles populated documents and plain MongoDB ObjectId references.
const getReferenceId = (reference) => {
    if (!reference) return "";

    if (typeof reference === "object") {
        return String(reference._id || reference.id || "");
    }

    return String(reference);
};

const getReferenceName = (reference, fields = []) => {
    if (!reference || typeof reference !== "object") return "";

    for (const field of fields) {
        if (reference[field]) return String(reference[field]);
    }

    return "";
};

const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

export const MarksPage = () => {
    const queryClient = useQueryClient();

    // Queries
    const {
        data: marksResponse,
        isLoading: marksLoading,
        isError: marksIsError,
        error: marksError,
    } = getMarks();

    const {
        data: studentsResponse,
        isLoading: studentsLoading,
    } = getStudents();

    const {
        data: facultyResponse,
        isLoading: facultyLoading,
    } = getFaculty();

    const {
        data: labsResponse,
        isLoading: labsLoading,
    } = getLabs();

    const {
        data: sectionsResponse,
        isLoading: sectionsLoading,
    } = getSection();

    // Mutations
    const createMarksMutation = createMarks();
    const updateMarksMutation = updateMarks();
    const deleteMarksMutation = deleteMarks();

    const marks = useMemo(
        () => getArrayFromResponse(marksResponse),
        [marksResponse]
    );

    const students = useMemo(
        () => getArrayFromResponse(studentsResponse),
        [studentsResponse]
    );

    const faculty = useMemo(
        () => getArrayFromResponse(facultyResponse),
        [facultyResponse]
    );

    const labs = useMemo(
        () => getArrayFromResponse(labsResponse),
        [labsResponse]
    );

    const sections = useMemo(
        () => getArrayFromResponse(sectionsResponse),
        [sectionsResponse]
    );

    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedMark: null,
        formOpened: false,
        deleteOpened: false,
        deleteId: null,
        error: "",
    });

    const [submitError, setSubmitError] = useState("");

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
            },
            error: "",
        }));
    };

    const calculateTotal = (form) =>
        evaluationFields.reduce(
            (total, field) => total + (Number(form[field.key]) || 0),
            0
        );

    // Dropdown options are sourced from their respective APIs.
    const studentOptions = useMemo(
        () =>
            students.map((student) => ({
                value: String(student._id),
                label: `${student.student_name || "Unnamed Student"}${student.student_reg ? ` (${student.student_reg})` : ""
                    }`,
            })),
        [students]
    );

    const facultyOptions = useMemo(
        () =>
            faculty.map((member) => ({
                value: String(member._id),
                label: member.faculty_name || "Unnamed Faculty",
            })),
        [faculty]
    );

    const labOptions = useMemo(
        () =>
            labs.map((lab) => ({
                value: String(lab._id),
                label: lab.lab_name || "Unnamed Lab",
            })),
        [labs]
    );

    const sectionOptions = useMemo(
        () =>
            sections.map((section) => ({
                value: String(section._id),
                label: [
                    section.section_name || "Unnamed Section",
                    section.year ? `Year ${section.year}` : "",
                    section.semester ? `Semester ${section.semester}` : "",
                ]
                    .filter(Boolean)
                    .join(" - "),
            })),
        [sections]
    );

    // Find the selected student. Their team is derived from their Student document.
    const selectedStudent = students.find(
        (student) => String(student._id) === data.form.student
    );

    const selectedTeamId = getReferenceId(selectedStudent?.team);

    const resetForm = () => {
        setData((previous) => ({
            ...previous,
            form: { ...emptyForm },
            selectedMark: null,
            formOpened: false,
            error: "",
        }));
        setSubmitError("");
    };

    const handleAdd = () => {
        setData((previous) => ({
            ...previous,
            form: { ...emptyForm },
            selectedMark: null,
            formOpened: true,
            error: "",
        }));
        setSubmitError("");
    };

    const handleEdit = (mark) => {
        const studentId = getReferenceId(mark.student);
        const sectionId = getReferenceId(mark.section);

        // Older mark records may not have a section field.
        const student = students.find(
            (item) => String(item._id) === studentId
        );

        setData((previous) => ({
            ...previous,
            selectedMark: mark,
            form: {
                student: studentId,
                section:
                    sectionId ||
                    getReferenceId(student?.section),
                lab: getReferenceId(mark.lab),
                practical_execution:
                    Number(mark.evaluation?.practical_execution) || 0,
                used_html: Number(mark.evaluation?.used_html) || 0,
                js_logics: Number(mark.evaluation?.js_logics) || 0,
                css_responsiveness:
                    Number(mark.evaluation?.css_responsiveness) || 0,
                viva: Number(mark.evaluation?.viva) || 0,
                documendation:
                    Number(mark.evaluation?.documendation) || 0,
                maximum_marks: Number(mark.maximum_marks) || 100,
                project_status: mark.project_status || "PENDING",
                evaluatedBy: getReferenceId(mark.evaluatedBy),
            },
            formOpened: true,
            error: "",
        }));

        setSubmitError("");
    };

    const handleSubmit = async () => {
        const { form, selectedMark } = data;

        if (
            !form.student ||
            !form.section ||
            !form.lab ||
            !form.evaluatedBy
        ) {
            updateData(
                "error",
                "Please select the student, section, lab, and faculty."
            );
            return;
        }

        const total = calculateTotal(form);
        const maximumMarks = Number(form.maximum_marks);

        if (!Number.isFinite(maximumMarks) || maximumMarks <= 0) {
            updateData("error", "Maximum marks must be greater than zero.");
            return;
        }

        const invalidScore = evaluationFields.some((field) => {
            const score = Number(form[field.key]);
            return !Number.isFinite(score) || score < 0;
        });

        if (invalidScore) {
            updateData("error", "Evaluation marks cannot be negative.");
            return;
        }

        if (total > maximumMarks) {
            updateData(
                "error",
                "The total evaluation marks cannot exceed maximum marks."
            );
            return;
        }

        const student = students.find(
            (item) => String(item._id) === form.student
        );

        if (!student) {
            updateData("error", "Selected student was not found.");
            return;
        }

        const teamId = getReferenceId(student.team);

        if (!teamId) {
            updateData(
                "error",
                "The selected student has no team assigned. Assign the student to a team first."
            );
            return;
        }

        // Send IDs, not populated objects, to the backend.
        const payload = {
            student: form.student,
            team: teamId,
            section: form.section,
            lab: form.lab,
            evaluation: {
                practical_execution: Number(form.practical_execution) || 0,
                used_html: Number(form.used_html) || 0,
                js_logics: Number(form.js_logics) || 0,
                css_responsiveness:
                    Number(form.css_responsiveness) || 0,
                viva: Number(form.viva) || 0,
                documendation: Number(form.documendation) || 0,
            },
            total_marks: total,
            maximum_marks: maximumMarks,
            project_status: form.project_status,
            evaluatedBy: form.evaluatedBy,
        };

        try {
            setSubmitError("");

            if (selectedMark) {
                await updateMarksMutation.mutateAsync({
                    id: selectedMark._id,
                    ...payload,
                });
            } else {
                await createMarksMutation.mutateAsync(payload);
            }

            await queryClient.invalidateQueries({ queryKey: ["marks"] });
            resetForm();
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        }
    };

    const handleDeleteClick = (markOrId) => {
        const id =
            typeof markOrId === "object"
                ? markOrId?._id
                : markOrId;

        if (!id) return;

        setData((previous) => ({
            ...previous,
            deleteId: id,
            deleteOpened: true,
        }));
    };

    const handleDeleteConfirm = async () => {
        if (!data.deleteId) return;

        try {
            setSubmitError("");

            await deleteMarksMutation.mutateAsync(data.deleteId);

            await queryClient.invalidateQueries({ queryKey: ["marks"] });

            setData((previous) => ({
                ...previous,
                deleteOpened: false,
                deleteId: null,
            }));
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        }
    };

    const isSubmitting =
        createMarksMutation.isPending ||
        updateMarksMutation.isPending;

    const isDeleting = deleteMarksMutation.isPending;

    const isOptionsLoading =
        studentsLoading ||
        facultyLoading ||
        labsLoading ||
        sectionsLoading;

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Student Mark Evaluation
                </h2>

                <Button onClick={handleAdd}>Add Marks</Button>
            </div>

            {submitError && (
                <p className="mb-3 text-sm text-red-600">
                    {submitError}
                </p>
            )}

            {marksLoading ? (
                <div className="flex justify-center py-10">
                    <Loader />
                </div>
            ) : marksIsError ? (
                <p className="py-5 text-red-600">
                    {getErrorMessage(marksError)}
                </p>
            ) : (
                <MarksTable
                    data={marks}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* Add / Edit Marks */}
            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={data.selectedMark ? "Edit Marks" : "Add Marks"}
                centered
                size="lg"
            >
                {isOptionsLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader />
                    </div>
                ) : (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <Select
                            label="Student"
                            placeholder="Select student"
                            data={studentOptions}
                            value={data.form.student}
                            onChange={(value) => {
                                updateForm("student", value || "");

                                // Keep section in sync with the selected student.
                                const student = students.find(
                                    (item) => String(item._id) === value
                                );

                                const studentSectionId = getReferenceId(
                                    student?.section
                                );

                                updateForm("section", studentSectionId);
                            }}
                            searchable
                            required
                            mb="md"
                        />

                        <Select
                            label="Section"
                            placeholder="Select section"
                            data={sectionOptions}
                            value={data.form.section}
                            onChange={(value) =>
                                updateForm("section", value || "")
                            }
                            searchable
                            required
                            mb="md"
                        />

                        <Select
                            label="Lab"
                            placeholder="Select lab"
                            data={labOptions}
                            value={data.form.lab}
                            onChange={(value) =>
                                updateForm("lab", value || "")
                            }
                            searchable
                            required
                            mb="md"
                        />

                        <Select
                            label="Evaluated By"
                            placeholder="Select faculty"
                            data={facultyOptions}
                            value={data.form.evaluatedBy}
                            onChange={(value) =>
                                updateForm("evaluatedBy", value || "")
                            }
                            searchable
                            required
                            mb="md"
                        />

                        <div className="mb-3 rounded-md bg-gray-50 p-3">
                            <p className="text-sm text-gray-600">
                                Team is taken automatically from the selected
                                student's team assignment.
                            </p>

                            <p className="mt-1 font-medium">
                                {getReferenceName(selectedStudent?.team, [
                                    "team_name",
                                ]) || (selectedTeamId ? "Team assigned" : "No team assigned")}
                            </p>
                        </div>

                        <h3 className="mb-3 mt-4 font-semibold">
                            Evaluation Criteria
                        </h3>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {evaluationFields.map((field) => (
                                <NumberInput
                                    key={field.key}
                                    label={field.label}
                                    min={0}
                                    value={data.form[field.key]}
                                    onChange={(value) =>
                                        updateForm(field.key, value ?? 0)
                                    }
                                    required
                                />
                            ))}
                        </div>

                        <NumberInput
                            className="mt-4"
                            label="Maximum Marks"
                            min={1}
                            value={data.form.maximum_marks}
                            onChange={(value) =>
                                updateForm("maximum_marks", value ?? 1)
                            }
                            required
                        />

                        <div className="my-3 rounded-md bg-gray-100 p-3">
                            <span className="font-semibold">
                                Calculated Total:{" "}
                            </span>
                            {calculateTotal(data.form)} /{" "}
                            {data.form.maximum_marks}
                        </div>

                        <Select
                            label="Project Status"
                            data={[
                                { value: "COMPLETED", label: "Completed" },
                                {
                                    value: "NOT_COMPLETED",
                                    label: "Not Completed",
                                },
                                { value: "PENDING", label: "Pending" },
                            ]}
                            value={data.form.project_status}
                            onChange={(value) =>
                                updateForm(
                                    "project_status",
                                    value || "PENDING"
                                )
                            }
                            required
                            mb="md"
                        />

                        {data.error && (
                            <p className="mb-3 text-sm text-red-600">
                                {data.error}
                            </p>
                        )}

                        {submitError && (
                            <p className="mb-3 text-sm text-red-600">
                                {submitError}
                            </p>
                        )}

                        <Group justify="flex-end" mt="md">
                            <Button
                                variant="default"
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                loading={isSubmitting}
                                disabled={isOptionsLoading}
                            >
                                {data.selectedMark
                                    ? "Update Marks"
                                    : "Save Marks"}
                            </Button>
                        </Group>
                    </form>
                )}
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                opened={data.deleteOpened}
                onClose={() =>
                    setData((previous) => ({
                        ...previous,
                        deleteOpened: false,
                        deleteId: null,
                    }))
                }
                title="Delete Marks"
                centered
                size="sm"
            >
                <p className="mb-4">
                    Are you sure you want to delete this mark record?
                </p>

                <Group justify="flex-end">
                    <Button
                        variant="default"
                        disabled={isDeleting}
                        onClick={() =>
                            setData((previous) => ({
                                ...previous,
                                deleteOpened: false,
                                deleteId: null,
                            }))
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        loading={isDeleting}
                        onClick={handleDeleteConfirm}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

export default MarksPage;