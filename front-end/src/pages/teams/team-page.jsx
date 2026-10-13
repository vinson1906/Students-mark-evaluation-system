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

const initialTeams = [
    {
        _id: "6acc30001cb9b2b76aa4ff01",
        team_name: "Team Alpha",
        team_number: "T01",
        section: {
            _id: "6acb10001cb9b2b76aa4ff01",
            section_name: "A",
        },
        team_members: [
            { _id: "6acd40001cb9b2b76aa4ff01", student_name: "Arun Kumar" },
            { _id: "6acd40001cb9b2b76aa4ff02", student_name: "Priya Devi" },
        ],
        project: {
            title: "Student Management System",
            github_url: "https://github.com/example/student-management",
            report_status: "PENDING",
            project_status: "PENDING",
        },
    },
    {
        _id: "6acc30001cb9b2b76aa4ff02",
        team_name: "Team Beta",
        team_number: "T02",
        section: {
            _id: "6acb10001cb9b2b76aa4ff03",
            section_name: "A",
        },
        team_members: [
            { _id: "6acd40001cb9b2b76aa4ff03", student_name: "Karthik Raj" },
        ],
        project: {
            title: "Online Lab Evaluation System",
            github_url: "https://github.com/example/lab-evaluation",
            report_status: "NOT_SUBMITTED",
            project_status: "NOT_SUBMITTED",
        },
    },
];

const sectionOptions = [
    { value: "6acb10001cb9b2b76aa4ff01", label: "Section A - CSE" },
    { value: "6acb10001cb9b2b76aa4ff02", label: "Section B - CSE" },
    { value: "6acb10001cb9b2b76aa4ff03", label: "Section A - EEE" },
];

const studentOptions = [
    {
        value: "6acd40001cb9b2b76aa4ff01",
        label: "Arun Kumar",
        sectionId: "6acb10001cb9b2b76aa4ff01",
    },
    {
        value: "6acd40001cb9b2b76aa4ff02",
        label: "Priya Devi",
        sectionId: "6acb10001cb9b2b76aa4ff01",
    },
    {
        value: "6acd40001cb9b2b76aa4ff03",
        label: "Karthik Raj",
        sectionId: "6acb10001cb9b2b76aa4ff03",
    },
    {
        value: "6acd40001cb9b2b76aa4ff04",
        label: "Divya Sri",
        sectionId: "6acb10001cb9b2b76aa4ff03",
    },
];

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

export const TeamPage = () => {
    const [teams, setTeams] = useState(initialTeams);

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

    const handleEdit = (team) => {
        setData((prev) => ({
            ...prev,
            selectedTeam: team,
            form: {
                team_name: team.team_name || "",
                team_number: team.team_number || "",
                section: team.section?._id || "",
                team_members: team.team_members?.map((member) => member._id) || [],
                title: team.project?.title || "",
                github_url: team.project?.github_url || "",
                report_status: team.project?.report_status || "PENDING",
                project_status: team.project?.project_status || "PENDING",
            },
            formOpened: true,
            error: "",
        }));
    };

    const handleSubmit = () => {
        const { form } = data;

        if (
            !form.team_name.trim() ||
            !form.team_number.trim() ||
            !form.section ||
            form.team_members.length === 0
        ) {
            updateData("error", "Please fill in the team name, number, section, and members.");
            return;
        }

        const duplicateNumber = teams.some(
            (team) =>
                team._id !== data.selectedTeam?._id &&
                team.team_number.toLowerCase() ===
                    form.team_number.trim().toLowerCase()
        );

        if (duplicateNumber) {
            updateData("error", "This team number already exists.");
            return;
        }

        const section = sectionOptions.find(
            (item) => item.value === form.section
        );

        const members = form.team_members.map((id) =>
            studentOptions.find((student) => student.value === id)
        );

        if (!section || members.some((member) => !member)) {
            updateData("error", "Please select a valid section and team members.");
            return;
        }

        if (members.some((member) => member.sectionId !== form.section)) {
            updateData("error", "All team members must belong to the selected section.");
            return;
        }

        const alreadyAssigned = teams.some(
            (team) =>
                team._id !== data.selectedTeam?._id &&
                team.team_members?.some((member) =>
                    form.team_members.includes(member._id)
                )
        );

        if (alreadyAssigned) {
            updateData("error", "One or more students already belong to another team.");
            return;
        }

        const teamRecord = {
            team_name: form.team_name.trim(),
            team_number: form.team_number.trim(),
            section: {
                _id: section.value,
                section_name: section.label.split(" - ")[0].replace("Section ", ""),
            },
            team_members: members.map((member) => ({
                _id: member.value,
                student_name: member.label,
            })),
            project: {
                title: form.title.trim(),
                github_url: form.github_url.trim(),
                report_status: form.report_status,
                project_status: form.project_status,
            },
        };

        if (data.selectedTeam) {
            setTeams((prev) =>
                prev.map((team) =>
                    team._id === data.selectedTeam._id
                        ? { ...team, ...teamRecord }
                        : team
                )
            );
        } else {
            setTeams((prev) => [
                ...prev,
                {
                    _id: crypto.randomUUID(),
                    ...teamRecord,
                },
            ]);
        }

        resetForm();
    };

    const handleDeleteClick = (id) => {
        setData((prev) => ({
            ...prev,
            deleteId: id,
            deleteOpened: true,
        }));
    };

    const handleDeleteConfirm = () => {
        setTeams((prev) =>
            prev.filter((team) => team._id !== data.deleteId)
        );

        setData((prev) => ({
            ...prev,
            deleteOpened: false,
            deleteId: null,
        }));
    };

    const filteredStudents = studentOptions.filter(
        (student) => student.sectionId === data.form.section
    );

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Team Management</h2>
                <Button onClick={handleAdd}>Add Team</Button>
            </div>

            <TeamTable
                data={teams}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={data.selectedTeam ? "Edit Team" : "Add Team"}
                centered
                size="lg"
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                >
                    <TextInput
                        label="Team Name"
                        placeholder="Enter team name"
                        value={data.form.team_name}
                        onChange={(event) =>
                            updateForm("team_name", event.currentTarget.value)
                        }
                        required
                        mb="md"
                    />

                    <TextInput
                        label="Team Number"
                        placeholder="e.g. T01"
                        value={data.form.team_number}
                        onChange={(event) =>
                            updateForm("team_number", event.currentTarget.value)
                        }
                        required
                        mb="md"
                    />

                    <Select
                        label="Section"
                        placeholder="Select section"
                        data={sectionOptions}
                        value={data.form.section}
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
                        mb="md"
                    />

                    <MultiSelect
                        label="Team Members"
                        placeholder="Select students"
                        data={filteredStudents.map((student) => ({
                            value: student.value,
                            label: student.label,
                        }))}
                        value={data.form.team_members}
                        onChange={(value) => updateForm("team_members", value)}
                        disabled={!data.form.section}
                        searchable
                        required
                        mb="md"
                    />

                    <TextInput
                        label="Project Title"
                        placeholder="Enter project title"
                        value={data.form.title}
                        onChange={(event) =>
                            updateForm("title", event.currentTarget.value)
                        }
                        mb="md"
                    />

                    <TextInput
                        label="GitHub URL"
                        placeholder="https://github.com/username/repository"
                        value={data.form.github_url}
                        onChange={(event) =>
                            updateForm("github_url", event.currentTarget.value)
                        }
                        mb="md"
                    />

                    <Select
                        label="Report Status"
                        data={[
                            { value: "NOT_SUBMITTED", label: "Not Submitted" },
                            { value: "PENDING", label: "Pending" },
                        ]}
                        value={data.form.report_status}
                        onChange={(value) =>
                            updateForm("report_status", value || "PENDING")
                        }
                        required
                        mb="md"
                    />

                    <Select
                        label="Project Status"
                        data={[
                            { value: "NOT_SUBMITTED", label: "Not Submitted" },
                            { value: "PENDING", label: "Pending" },
                        ]}
                        value={data.form.project_status}
                        onChange={(value) =>
                            updateForm("project_status", value || "PENDING")
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
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {data.selectedTeam ? "Update Team" : "Add Team"}
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Modal
                opened={data.deleteOpened}
                onClose={() =>
                    setData((prev) => ({
                        ...prev,
                        deleteOpened: false,
                        deleteId: null,
                    }))
                }
                title="Delete Team"
                centered
                size="sm"
            >
                <p className="mb-4">
                    Are you sure you want to delete this team?
                </p>

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
                    <Button color="red" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
};