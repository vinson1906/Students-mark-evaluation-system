import React, { useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
    MultiSelect,
} from "@mantine/core";

import TeamTable from "./teams";

import {
    getTeams,
    deleteTeams,
    createTeams,
    updateTeams,
} from "./team.service";

import { getSection } from "../section/section.service";
import { getStudents } from "../student/students.service";

const emptyForm = {
    team_name: "",
    team_number: "",
    section: "",
    team_members: [],
    title: "",
    github_url: "",
    report_status: "PENDING",
    project_status: "PENDING",
};

// Supports MongoDB references represented as either IDs or populated objects.
const getReferenceId = (value) => {
    if (value && typeof value === "object") {
        return value._id ? String(value._id) : "";
    }

    return value ? String(value) : "";
};

// Supports responses shaped as { data: [...] } or [...].
const getArrayFromResponse = (response) => {
    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    return [];
};

const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.message ||
    fallback;

export const TeamPage = () => {
    // GET teams
    const {
        data: teamsResponse,
        isLoading: teamsLoading,
        isError: teamsError,
        error: teamsErrorDetails,
    } = getTeams();

    // GET sections
    const {
        data: sectionsResponse,
        isLoading: sectionsLoading,
        isError: sectionsError,
    } = getSection();

    // GET students
    const {
        data: studentsResponse,
        isLoading: studentsLoading,
        isError: studentsError,
    } = getStudents();

    // CREATE, UPDATE, DELETE mutations
    const createMutation = createTeams();
    const updateMutation = updateTeams();
    const deleteMutation = deleteTeams();

    const teams = getArrayFromResponse(teamsResponse);
    const sections = getArrayFromResponse(sectionsResponse);
    const students = getArrayFromResponse(studentsResponse);

    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedTeam: null,
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

    const resetForm = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedTeam: null,
            formOpened: false,
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedTeam: null,
            formOpened: true,
            error: "",
        }));
    };

    // Live section options
    const sectionOptions = sections.map((section) => {
        const departmentName =
            typeof section.department === "object"
                ? section.department?.department_name
                : "";

        return {
            value: String(section._id),
            label: departmentName
                ? `${section.section_name} - ${departmentName}`
                : `Section ${section.section_name}`,
        };
    });

    // Live student options
    const studentOptions = students.map((student) => ({
        value: String(student._id),
        label: `${student.student_name || "Unnamed Student"}${student.student_reg
            ? ` (${student.student_reg})`
            : ""
            }`,
        sectionId: getReferenceId(student.section),
        teamId: getReferenceId(student.team),
    }));

    // EDIT team
    const handleEdit = (team) => {
        const sectionId = getReferenceId(team.section);

        // Resolve members whether team_members contains IDs or objects.
        const memberIds = (team.team_members || [])
            .map((member) => getReferenceId(member))
            .filter(Boolean);

        setData((prev) => ({
            ...prev,
            selectedTeam: team,
            form: {
                team_name: team.team_name || "",
                team_number: team.team_number || "",
                section: sectionId,
                team_members: memberIds,
                title: team.project?.title || "",
                github_url: team.project?.github_url || "",
                report_status:
                    team.project?.report_status || "PENDING",
                project_status:
                    team.project?.project_status || "PENDING",
            },
            formOpened: true,
            error: "",
        }));
    };

    // CREATE / UPDATE team
    const handleSubmit = (event) => {
        event.preventDefault();

        const { form, selectedTeam } = data;

        if (
            !form.team_name.trim() ||
            !form.team_number.trim() ||
            !form.section ||
            form.team_members.length === 0
        ) {
            updateData(
                "error",
                "Please fill in the team name, number, section, and members."
            );
            return;
        }

        // Validate that the selected section exists in the API response.
        const selectedSection = sections.find(
            (section) =>
                String(section._id) === form.section
        );

        if (!selectedSection) {
            updateData("error", "Please select a valid section.");
            return;
        }

        // Validate the team number against the live team list.
        const duplicateNumber = teams.some(
            (team) =>
                String(team._id) !== String(selectedTeam?._id) &&
                team.team_number?.trim().toLowerCase() ===
                form.team_number.trim().toLowerCase()
        );

        if (duplicateNumber) {
            updateData(
                "error",
                "This team number already exists."
            );
            return;
        }

        // Validate selected students against the live student list.
        const selectedStudents = form.team_members.map((studentId) =>
            students.find(
                (student) => String(student._id) === studentId
            )
        );

        if (selectedStudents.some((student) => !student)) {
            updateData(
                "error",
                "One or more selected students could not be found."
            );
            return;
        }

        // All team members must belong to the selected section.
        const invalidSectionMember = selectedStudents.some(
            (student) =>
                getReferenceId(student.section) !== form.section
        );

        if (invalidSectionMember) {
            updateData(
                "error",
                "All team members must belong to the selected section."
            );
            return;
        }

        // Prevent assigning students who already belong to another team.
        const alreadyAssigned = selectedStudents.some((student) => {
            const assignedTeamId = getReferenceId(student.team);

            if (
                assignedTeamId &&
                assignedTeamId !== String(selectedTeam?._id || "")
            ) {
                return true;
            }

            // Also check the teams list in case team references on students
            // are not populated in the students API response.
            return teams.some((team) => {
                if (
                    String(team._id) ===
                    String(selectedTeam?._id || "")
                ) {
                    return false;
                }

                return (team.team_members || []).some(
                    (member) =>
                        getReferenceId(member) ===
                        String(student._id)
                );
            });
        });

        if (alreadyAssigned) {
            updateData(
                "error",
                "One or more students already belong to another team."
            );
            return;
        }

        // Send MongoDB IDs, not populated display objects.
        const teamPayload = {
            team_name: form.team_name.trim(),
            team_number: form.team_number.trim(),
            section: form.section,
            team_members: form.team_members,
            project: {
                title: form.title.trim(),
                github_url: form.github_url.trim(),
                report_status: form.report_status,
                project_status: form.project_status,
            },
        };

        if (selectedTeam) {
            // UPDATE
            updateMutation.mutate(
                {
                    id: selectedTeam._id,
                    team: teamPayload,
                },
                {
                    onSuccess: () => {
                        resetForm();
                    },
                    onError: (error) => {
                        updateData(
                            "error",
                            getErrorMessage(
                                error,
                                "Failed to update team."
                            )
                        );
                    },
                }
            );
        } else {
            // CREATE
            createMutation.mutate(teamPayload, {
                onSuccess: () => {
                    resetForm();
                },
                onError: (error) => {
                    updateData(
                        "error",
                        getErrorMessage(
                            error,
                            "Failed to create team."
                        )
                    );
                },
            });
        }
    };

    // Open delete confirmation
    const handleDeleteClick = (id) => {
        setData((prev) => ({
            ...prev,
            deleteId: id,
            deleteOpened: true,
            error: "",
        }));
    };

    // DELETE team
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
            onError: (error) => {
                updateData(
                    "error",
                    getErrorMessage(error, "Failed to delete team.")
                );
            },
        });
    };

    // Filter students based on the selected section.
    const filteredStudents = studentOptions.filter(
        (student) => student.sectionId === data.form.section
    );

    const isSaving =
        createMutation.isPending || updateMutation.isPending;

    const isReferenceDataLoading =
        sectionsLoading || studentsLoading;

    const isReferenceDataError =
        sectionsError || studentsError;

    return (
        <>
            {/* PAGE HEADER */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Team Management
                </h2>

                <Button
                    onClick={handleAdd}
                    disabled={isReferenceDataError}
                >
                    Add Team
                </Button>
            </div>

            {teamsLoading ? (
                <p className="py-4">Loading teams...</p>
            ) : teamsError ? (
                <p className="py-4 text-red-600">
                    {getErrorMessage(
                        teamsErrorDetails,
                        "Failed to load teams."
                    )}
                </p>
            ) : (
                <TeamTable
                    data={teams}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* ADD / UPDATE MODAL */}
            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={
                    data.selectedTeam ? "Edit Team" : "Add Team"
                }
                centered
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Team Name"
                        placeholder="Enter team name"
                        value={data.form.team_name}
                        onChange={(event) =>
                            updateForm(
                                "team_name",
                                event.currentTarget.value
                            )
                        }
                        required
                        mb="md"
                    />

                    <TextInput
                        label="Team Number"
                        placeholder="e.g. T01"
                        value={data.form.team_number}
                        onChange={(event) =>
                            updateForm(
                                "team_number",
                                event.currentTarget.value
                            )
                        }
                        required
                        mb="md"
                    />

                    {/* LIVE SECTION DROPDOWN */}
                    <Select
                        label="Section"
                        placeholder={
                            sectionsLoading
                                ? "Loading sections..."
                                : "Select section"
                        }
                        data={sectionOptions}
                        value={data.form.section || null}
                        onChange={(value) => {
                            setData((prev) => ({
                                ...prev,
                                form: {
                                    ...prev.form,
                                    section: value || "",
                                    team_members: [],
                                },
                                error: "",
                            }));
                        }}
                        searchable
                        required
                        disabled={
                            sectionsLoading || sectionsError
                        }
                        nothingFoundMessage="No sections found"
                        mb="md"
                    />

                    {/* LIVE STUDENT MULTISELECT */}
                    <MultiSelect
                        label="Team Members"
                        placeholder={
                            studentsLoading
                                ? "Loading students..."
                                : "Select students"
                        }
                        data={filteredStudents.map((student) => ({
                            value: student.value,
                            label: student.label,
                        }))}
                        value={data.form.team_members}
                        onChange={(value) =>
                            updateForm("team_members", value)
                        }
                        disabled={
                            !data.form.section ||
                            studentsLoading ||
                            studentsError
                        }
                        searchable
                        required
                        nothingFoundMessage={
                            data.form.section
                                ? "No students found in this section"
                                : "Select a section first"
                        }
                        mb="md"
                    />

                    {isReferenceDataError && (
                        <p className="mb-3 text-sm text-red-600">
                            Failed to load sections or students. Please
                            refresh and try again.
                        </p>
                    )}

                    <TextInput
                        label="Project Title"
                        placeholder="Enter project title"
                        value={data.form.title}
                        onChange={(event) =>
                            updateForm(
                                "title",
                                event.currentTarget.value
                            )
                        }
                        mb="md"
                    />

                    <TextInput
                        label="GitHub URL"
                        placeholder="https://github.com/username/repository"
                        value={data.form.github_url}
                        onChange={(event) =>
                            updateForm(
                                "github_url",
                                event.currentTarget.value
                            )
                        }
                        mb="md"
                    />

                    <Select
                        label="Report Status"
                        data={[
                            {
                                value: "NOT_SUBMITTED",
                                label: "Not Submitted",
                            },
                            {
                                value: "PENDING",
                                label: "Pending",
                            },
                        ]}
                        value={data.form.report_status}
                        onChange={(value) =>
                            updateForm(
                                "report_status",
                                value || "PENDING"
                            )
                        }
                        required
                        mb="md"
                    />

                    <Select
                        label="Project Status"
                        data={[
                            {
                                value: "NOT_SUBMITTED",
                                label: "Not Submitted",
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

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="default"
                            type="button"
                            onClick={resetForm}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            loading={isSaving}
                            disabled={isReferenceDataLoading || isReferenceDataError}
                        >
                            {data.selectedTeam
                                ? "Update Team"
                                : "Add Team"}
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
                title="Delete Team"
                centered
                size="sm"
            >
                <p className="mb-4">
                    Are you sure you want to delete this team?
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

export default TeamPage;