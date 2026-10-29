
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
import { getTeamsMeta } from "../teams/team.service";
import { getDepartment } from "../department/department.service";

// Initial form values
const emptyForm = {
    department: "",
    section: "",
    team: "",
    student: "",
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

// Normalize different API response formats
const getArrayFromResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }
    if (Array.isArray(response?.results)) {
        return response.results;
    }
    return [];
};

// Get MongoDB ObjectId from populated or unpopulated references
const getReferenceId = (reference) => {
    if (!reference) return "";

    if (typeof reference === "object") {
        return String(reference._id || reference.id || "");
    }

    return String(reference);
};

// Get a display name from a populated reference
const getReferenceName = (reference, fields = []) => {
    if (!reference || typeof reference !== "object") {
        return "";
    }

    for (const field of fields) {
        if (reference[field]) {
            return String(reference[field]);
        }
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

    const {
        data: teamMetaResponse,
        isLoading: teamIsLoading,
    } = getTeamsMeta();

    const {
        data: departmentResponse,
        isLoading: departmentsLoading,
    } = getDepartment();

    // Mutations
    const createMarksMutation = createMarks();
    const updateMarksMutation = updateMarks();
    const deleteMarksMutation = deleteMarks();

    // Normalize API data
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

    const Teams = useMemo(
        () => getArrayFromResponse(teamMetaResponse),
        [teamMetaResponse]
    );

    const departments = useMemo(
        () => getArrayFromResponse(departmentResponse),
        [departmentResponse]
    );

    // Form and modal state
    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedMark: null,
        formOpened: false,
        deleteOpened: false,
        deleteId: null,
        error: "",
    });

    const [submitError, setSubmitError] = useState("");

    const isOptionsLoading =
        studentsLoading ||
        facultyLoading ||
        labsLoading ||
        sectionsLoading ||
        teamIsLoading ||
        departmentsLoading;

    // Update general state
    const updateData = (key, value) => {
        setData((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    // Update an individual form field
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

    // Calculate total evaluation marks
    const calculateTotal = (form) =>
        evaluationFields.reduce(
            (total, field) =>
                total + (Number(form[field.key]) || 0),
            0
        );

    // Department options
    const departmentOptions = useMemo(
        () =>
            departments.map((department) => ({
                value: String(department._id),
                label:
                    department.department_name ||
                    department.name ||
                    "Unnamed Department",
            })),
        [departments]
    );

    // Sections belonging to the selected department
    const filteredSections = useMemo(() => {
        if (!data.form.department) return [];

        return sections.filter(
            (section) =>
                getReferenceId(section.department) ===
                data.form.department
        );
    }, [sections, data.form.department]);

    const sectionOptions = useMemo(
        () =>
            filteredSections.map((section) => ({
                value: String(section._id),
                label: [
                    section.section_name || "Unnamed Section",
                    section.year ? `Year ${section.year}` : "",
                    section.semester
                        ? `Semester ${section.semester}`
                        : "",
                ]
                    .filter(Boolean)
                    .join(" - "),
            })),
        [filteredSections]
    );

    // Teams belonging to the selected section
    const filteredTeams = useMemo(() => {
        if (!data.form.section) return [];

        return Teams.filter(
            (team) =>
                getReferenceId(team.section) === data.form.section
        );
    }, [Teams, data.form.section]);

    const teamOptions = useMemo(
        () =>
            filteredTeams.map((team) => ({
                value: String(team._id),
                label: team.team_name || "Unnamed Team",
            })),
        [filteredTeams]
    );

    // Students belonging to the selected team
    const filteredStudents = useMemo(() => {
        if (!data.form.team) return [];

        const selectedTeam = Teams.find(
            (team) => String(team._id) === data.form.team
        );

        if (!selectedTeam) return [];

        const memberIds = new Set(
            (selectedTeam.team_members || []).map(
                getReferenceId
            )
        );

        return students.filter((student) =>
            memberIds.has(String(student._id))
        );
    }, [students, Teams, data.form.team]);

    // Students already marked for the selected lab should not be available
    // when creating a new marks record. Exclude the current record while editing.
    const existingMarkedStudentIds = useMemo(() => {
        if (!data.form.lab) return new Set();

        return new Set(
            marks
                .filter((mark) => {
                    const sameLab =
                        getReferenceId(mark.lab) === data.form.lab;

                    const isCurrentRecord =
                        data.selectedMark &&
                        String(mark._id) === String(data.selectedMark._id);

                    return sameLab && !isCurrentRecord;
                })
                .map((mark) => getReferenceId(mark.student))
                .filter(Boolean)
                .map(String)
        );
    }, [marks, data.form.lab, data.selectedMark]);

    const availableStudents = useMemo(
        () =>
            filteredStudents.filter((student) => {
                const studentId = String(student._id);
                const isCurrentStudent =
                    data.selectedMark &&
                    studentId === getReferenceId(data.selectedMark.student);

                // Keep the current student's option available when editing.
                return (
                    isCurrentStudent ||
                    !existingMarkedStudentIds.has(studentId)
                );
            }),
        [
            filteredStudents,
            existingMarkedStudentIds,
            data.selectedMark,
        ]
    );

    const studentOptions = useMemo(
        () =>
            availableStudents.map((student) => ({
                value: String(student._id),
                label: `${student.student_name || "Unnamed Student"
                    }${student.student_reg
                        ? ` (${student.student_reg})`
                        : ""
                    }`,
            })),
        [availableStudents]
    );

    // Faculty options
    const facultyOptions = useMemo(
        () =>
            faculty.map((member) => ({
                value: String(member._id),
                label: member.faculty_name || "Unnamed Faculty",
            })),
        [faculty]
    );

    // Lab options
    const labOptions = useMemo(
        () =>
            labs.map((lab) => ({
                value: String(lab._id),
                label: lab.lab_name || "Unnamed Lab",
            })),
        [labs]
    );

    // Selected student and team
    const selectedStudent = students.find(
        (student) =>
            String(student._id) === data.form.student
    );

    const selectedTeam = Teams.find(
        (team) => String(team._id) === data.form.team
    );

    // Reset form and close modal
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

    // Open Create Marks modal
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

    // Open Update Marks modal and restore saved values
    const handleEdit = (mark) => {
        const studentId = getReferenceId(mark.student);
        const savedSectionId = getReferenceId(mark.section);

        const student = students.find(
            (item) => String(item._id) === studentId
        );

        const sectionId =
            savedSectionId ||
            getReferenceId(student?.section);

        const section = sections.find(
            (item) => String(item._id) === sectionId
        );

        // Prefer the student's saved team reference.
        // Otherwise find a team containing the student.
        const studentTeamId = getReferenceId(student?.team);

        const matchedTeam = Teams.find(
            (team) =>
                String(team._id) === studentTeamId ||
                (team.team_members || []).some(
                    (member) =>
                        getReferenceId(member) === studentId
                )
        );

        const teamId = matchedTeam
            ? String(matchedTeam._id)
            : "";

        const departmentId = getReferenceId(
            section?.department
        );

        setData((previous) => ({
            ...previous,
            selectedMark: mark,
            form: {
                ...emptyForm,
                department: departmentId,
                section: sectionId,
                team: teamId,
                student: studentId,
                lab: getReferenceId(mark.lab),
                practical_execution:
                    Number(
                        mark.evaluation?.practical_execution
                    ) || 0,
                used_html:
                    Number(mark.evaluation?.used_html) || 0,
                js_logics:
                    Number(mark.evaluation?.js_logics) || 0,
                css_responsiveness:
                    Number(
                        mark.evaluation?.css_responsiveness
                    ) || 0,
                viva: Number(mark.evaluation?.viva) || 0,
                documendation:
                    Number(
                        mark.evaluation?.documendation
                    ) || 0,
                maximum_marks:
                    Number(mark.maximum_marks) || 100,
                project_status:
                    mark.project_status || "PENDING",
                evaluatedBy: getReferenceId(mark.evaluatedBy),
            },
            formOpened: true,
            error: "",
        }));

        setSubmitError("");
    };

    // Create or update marks
    const handleSubmit = async () => {
        const { form, selectedMark } = data;

        if (
            !form.department ||
            !form.section ||
            !form.team ||
            !form.student ||
            !form.lab ||
            !form.evaluatedBy
        ) {
            updateData(
                "error",
                "Please select department, section, team, student, lab, and faculty."
            );
            return;
        }

        const total = calculateTotal(form);
        const maximumMarks = Number(form.maximum_marks);

        if (
            !Number.isFinite(maximumMarks) ||
            maximumMarks <= 0
        ) {
            updateData(
                "error",
                "Maximum marks must be greater than zero."
            );
            return;
        }

        const invalidScore = evaluationFields.some(
            (field) => {
                const score = Number(form[field.key]);

                return (
                    !Number.isFinite(score) ||
                    score < 0
                );
            }
        );

        if (invalidScore) {
            updateData(
                "error",
                "Evaluation marks cannot be negative."
            );
            return;
        }

        if (total > maximumMarks) {
            updateData(
                "error",
                "The total evaluation marks cannot exceed maximum marks."
            );
            return;
        }

        // Validate the selected department and section
        const selectedSection = sections.find(
            (section) =>
                String(section._id) === form.section
        );

        if (
            !selectedSection ||
            getReferenceId(selectedSection.department) !==
            form.department
        ) {
            updateData(
                "error",
                "The selected section does not belong to the selected department."
            );
            return;
        }

        // Validate the selected team
        const team = Teams.find(
            (item) => String(item._id) === form.team
        );

        if (
            !team ||
            getReferenceId(team.section) !== form.section
        ) {
            updateData(
                "error",
                "The selected team does not belong to the selected section."
            );
            return;
        }

        // Validate the selected student
        const student = students.find(
            (item) => String(item._id) === form.student
        );

        if (!student) {
            updateData(
                "error",
                "Selected student was not found."
            );
            return;
        }

        const isTeamMember = (
            team.team_members || []
        ).some(
            (member) =>
                getReferenceId(member) === form.student
        );

        if (!isTeamMember) {
            updateData(
                "error",
                "The selected student does not belong to this team."
            );
            return;
        }

        // Prevent a student from receiving duplicate marks for the same lab.
        // When editing, ignore the record currently being updated.
        const duplicateMark = marks.some((mark) => {
            const sameStudent =
                getReferenceId(mark.student) === form.student;
            const sameLab =
                getReferenceId(mark.lab) === form.lab;
            const isCurrentRecord =
                selectedMark &&
                String(mark._id) === String(selectedMark._id);

            return sameStudent && sameLab && !isCurrentRecord;
        });

        if (duplicateMark) {
            updateData(
                "error",
                "This student already has marks recorded for the selected lab."
            );
            return;
        }

        // Send IDs to the backend
        const payload = {
            student: form.student,
            team: form.team,
            section: form.section,
            lab: form.lab,
            evaluation: {
                practical_execution:
                    Number(form.practical_execution) || 0,
                used_html: Number(form.used_html) || 0,
                js_logics: Number(form.js_logics) || 0,
                css_responsiveness:
                    Number(form.css_responsiveness) || 0,
                viva: Number(form.viva) || 0,
                documendation:
                    Number(form.documendation) || 0,
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
                await createMarksMutation.mutateAsync(
                    payload
                );
            }

            await queryClient.invalidateQueries({
                queryKey: ["marks"],
            });

            resetForm();
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        }
    };

    // Open delete confirmation
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

    // Delete a marks record
    const handleDeleteConfirm = async () => {
        if (!data.deleteId) return;

        try {
            setSubmitError("");

            await deleteMarksMutation.mutateAsync(
                data.deleteId
            );

            await queryClient.invalidateQueries({
                queryKey: ["marks"],
            });

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

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Student Mark Evaluation
                </h2>

                <Button onClick={handleAdd}>
                    Add Marks
                </Button>
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

            {/* Create / Update Marks Modal */}
            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={
                    data.selectedMark
                        ? "Edit Marks"
                        : "Add Marks"
                }
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
                        {/* Department */}
                        <Select
                            label="Department"
                            placeholder="Select department"
                            data={departmentOptions}
                            value={data.form.department}
                            onChange={(value) => {
                                setData((previous) => ({
                                    ...previous,
                                    form: {
                                        ...previous.form,
                                        department: value || "",
                                        section: "",
                                        team: "",
                                        student: "",
                                    },
                                    error: "",
                                }));
                            }}
                            searchable
                            required
                            mb="md"
                        />

                        {/* Section */}
                        <Select
                            label="Section"
                            placeholder={
                                data.form.department
                                    ? "Select section"
                                    : "Select department first"
                            }
                            data={sectionOptions}
                            value={data.form.section}
                            onChange={(value) => {
                                setData((previous) => ({
                                    ...previous,
                                    form: {
                                        ...previous.form,
                                        section: value || "",
                                        team: "",
                                        student: "",
                                    },
                                    error: "",
                                }));
                            }}
                            disabled={!data.form.department}
                            searchable
                            required
                            mb="md"
                        />

                        {/* Team */}
                        <Select
                            label="Team"
                            placeholder={
                                data.form.section
                                    ? "Select team"
                                    : "Select section first"
                            }
                            data={teamOptions}
                            value={data.form.team}
                            onChange={(value) => {
                                setData((previous) => ({
                                    ...previous,
                                    form: {
                                        ...previous.form,
                                        team: value || "",
                                        student: "",
                                    },
                                    error: "",
                                }));
                            }}
                            disabled={!data.form.section}
                            searchable
                            required
                            mb="md"
                        />

                        {/* Lab */}
                        <Select
                            label="Lab"
                            placeholder="Select lab"
                            data={labOptions}
                            value={data.form.lab}
                            onChange={(value) => {
                                setData((previous) => ({
                                    ...previous,
                                    form: {
                                        ...previous.form,
                                        lab: value || "",
                                        student: "",
                                    },
                                    error: "",
                                }));
                            }}
                            searchable
                            required
                            mb="md"
                        />

                        {/* Student */}
                        <Select
                            label="Student"
                            placeholder={
                                !data.form.team
                                    ? "Select team first"
                                    : !data.form.lab
                                        ? "Select lab first"
                                        : studentOptions.length === 0
                                            ? "All students already marked for this lab"
                                            : "Select student"
                            }
                            data={studentOptions}
                            value={data.form.student}
                            onChange={(value) =>
                                updateForm(
                                    "student",
                                    value || ""
                                )
                            }
                            disabled={!data.form.team || !data.form.lab}
                            searchable
                            required
                            mb="md"
                        />

                        {data.form.team &&
                            data.form.lab &&
                            studentOptions.length === 0 && (
                                <p className="mb-3 text-sm text-orange-600">
                                    All students in this team already have marks
                                    for the selected lab.
                                </p>
                            )}

                        {/* Selected team information */}
                        {selectedTeam && (
                            <div className="mb-3 rounded-md bg-gray-50 p-3">
                                <p className="text-sm text-gray-600">
                                    Selected Team
                                </p>
                                <p className="font-medium">
                                    {selectedTeam.team_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {(
                                        selectedTeam.team_members ||
                                        []
                                    ).length}{" "}
                                    team member(s)
                                </p>
                            </div>
                        )}

                        {/* Evaluated By */}
                        <Select
                            label="Evaluated By"
                            placeholder="Select faculty"
                            data={facultyOptions}
                            value={data.form.evaluatedBy}
                            onChange={(value) =>
                                updateForm(
                                    "evaluatedBy",
                                    value || ""
                                )
                            }
                            searchable
                            required
                            mb="md"
                        />

                        {/* Evaluation criteria */}
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
                                        updateForm(
                                            field.key,
                                            value ?? 0
                                        )
                                    }
                                    required
                                />
                            ))}
                        </div>

                        {/* Maximum marks */}
                        <NumberInput
                            className="mt-4"
                            label="Maximum Marks"
                            min={1}
                            value={data.form.maximum_marks}
                            onChange={(value) =>
                                updateForm(
                                    "maximum_marks",
                                    value ?? 1
                                )
                            }
                            required
                        />

                        {/* Calculated total */}
                        <div className="my-3 rounded-md bg-gray-100 p-3">
                            <span className="font-semibold">
                                Calculated Total:{" "}
                            </span>

                            {calculateTotal(data.form)} /{" "}
                            {data.form.maximum_marks}
                        </div>

                        {/* Project status */}
                        <Select
                            label="Project Status"
                            data={[
                                {
                                    value: "COMPLETED",
                                    label: "Completed",
                                },
                                {
                                    value: "NOT_COMPLETED",
                                    label: "Not Completed",
                                },
                                {
                                    value: "PENDING",
                                    label: "Pending",
                                },
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

            {/* Delete Confirmation Modal */}
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
                    Are you sure you want to delete this mark
                    record?
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
