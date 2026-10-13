import React, { useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
    NumberInput,
} from "@mantine/core";

import MarksTable from "./marks";

const initialMarks = [
    {
        _id: "6ace50001cb9b2b76aa4ff01",
        student: {
            _id: "6acd40001cb9b2b76aa4ff01",
            student_name: "Arun Kumar",
            student_reg: "2026IT001",
        },
        team: {
            _id: "6acc30001cb9b2b76aa4ff01",
            team_name: "Team Alpha",
            team_number: "T01",
        },
        lab: {
            _id: "6ace60001cb9b2b76aa4ff01",
            lab_name: "Web Development Lab",
        },
        evaluation: {
            practical_execution: "18",
            used_html: "9",
            js_logics: "17",
            css_responsiveness: "18",
            viva: "8",
            documendation: "9",
        },
        total_marks: "79",
        maximum_marks: "100",
        project_status: "COMPLETED",
        evaluatedBy: {
            _id: "6ace70001cb9b2b76aa4ff01",
            faculty_name: "Dr. Priya",
        },
        createdAt: "2026-10-10T09:30:00.000Z",
        updatedAt: "2026-10-10T09:30:00.000Z",
    },
    {
        _id: "6ace50001cb9b2b76aa4ff02",
        student: {
            _id: "6acd40001cb9b2b76aa4ff02",
            student_name: "Priya Devi",
            student_reg: "2026IT002",
        },
        team: {
            _id: "6acc30001cb9b2b76aa4ff01",
            team_name: "Team Alpha",
            team_number: "T01",
        },
        lab: {
            _id: "6ace60001cb9b2b76aa4ff01",
            lab_name: "Web Development Lab",
        },
        evaluation: {
            practical_execution: "16",
            used_html: "8",
            js_logics: "15",
            css_responsiveness: "17",
            viva: "7",
            documendation: "8",
        },
        total_marks: "71",
        maximum_marks: "100",
        project_status: "PENDING",
        evaluatedBy: {
            _id: "6ace70001cb9b2b76aa4ff01",
            faculty_name: "Dr. Priya",
        },
        createdAt: "2026-10-10T10:00:00.000Z",
        updatedAt: "2026-10-10T10:00:00.000Z",
    },
    {
        _id: "6ace50001cb9b2b76aa4ff03",
        student: {
            _id: "6acd40001cb9b2b76aa4ff03",
            student_name: "Karthik Raj",
            student_reg: "2026EEE001",
        },
        team: {
            _id: "6acc30001cb9b2b76aa4ff02",
            team_name: "Team Beta",
            team_number: "T02",
        },
        lab: {
            _id: "6ace60001cb9b2b76aa4ff02",
            lab_name: "Electronics Lab",
        },
        evaluation: {
            practical_execution: "10",
            used_html: "5",
            js_logics: "9",
            css_responsiveness: "8",
            viva: "5",
            documendation: "6",
        },
        total_marks: "43",
        maximum_marks: "100",
        project_status: "NOT_COMPLETED",
        evaluatedBy: {
            _id: "6ace70001cb9b2b76aa4ff02",
            faculty_name: "Mr. Kumar",
        },
        createdAt: "2026-10-10T11:00:00.000Z",
        updatedAt: "2026-10-10T11:00:00.000Z",
    },
];

const emptyForm = {
    student: "",
    team: "",
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

const studentOptions = [
    { value: "6acd40001cb9b2b76aa4ff01", label: "Arun Kumar (2026IT001)" },
    { value: "6acd40001cb9b2b76aa4ff02", label: "Priya Devi (2026IT002)" },
    { value: "6acd40001cb9b2b76aa4ff03", label: "Karthik Raj (2026EEE001)" },
];

const teamOptions = [
    { value: "6acc30001cb9b2b76aa4ff01", label: "Team Alpha (T01)" },
    { value: "6acc30001cb9b2b76aa4ff02", label: "Team Beta (T02)" },
];

const labOptions = [
    { value: "6ace60001cb9b2b76aa4ff01", label: "Web Development Lab" },
    { value: "6ace60001cb9b2b76aa4ff02", label: "Electronics Lab" },
];

const facultyOptions = [
    { value: "6ace70001cb9b2b76aa4ff01", label: "Dr. Priya" },
    { value: "6ace70001cb9b2b76aa4ff02", label: "Mr. Kumar" },
];

const evaluationFields = [
    { key: "practical_execution", label: "Practical Execution" },
    { key: "used_html", label: "HTML Usage" },
    { key: "js_logics", label: "JavaScript Logic" },
    { key: "css_responsiveness", label: "CSS Responsiveness" },
    { key: "viva", label: "Viva" },
    { key: "documendation", label: "Documentation" },
];

export const MarksPage = () => {
    const [marks, setMarks] = useState(initialMarks);

    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedMark: null,
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

    const calculateTotal = (form) =>
        evaluationFields.reduce(
            (total, field) => total + (Number(form[field.key]) || 0),
            0
        );

    const resetForm = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedMark: null,
            formOpened: false,
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedMark: null,
            formOpened: true,
            error: "",
        }));
    };

    const handleEdit = (mark) => {
        setData((prev) => ({
            ...prev,
            selectedMark: mark,
            form: {
                student: mark.student?._id || "",
                team: mark.team?._id || "",
                lab: mark.lab?._id || "",
                practical_execution: Number(mark.evaluation?.practical_execution) || 0,
                used_html: Number(mark.evaluation?.used_html) || 0,
                js_logics: Number(mark.evaluation?.js_logics) || 0,
                css_responsiveness: Number(mark.evaluation?.css_responsiveness) || 0,
                viva: Number(mark.evaluation?.viva) || 0,
                documendation: Number(mark.evaluation?.documendation) || 0,
                maximum_marks: Number(mark.maximum_marks) || 100,
                project_status: mark.project_status || "PENDING",
                evaluatedBy: mark.evaluatedBy?._id || "",
            },
            formOpened: true,
            error: "",
        }));
    };

    const handleSubmit = () => {
        const { form } = data;

        if (!form.student || !form.team || !form.lab || !form.evaluatedBy) {
            updateData("error", "Please select the student, team, lab, and faculty.");
            return;
        }

        const total = calculateTotal(form);

        if (total > Number(form.maximum_marks)) {
            updateData(
                "error",
                "The total evaluation marks cannot exceed maximum marks."
            );
            return;
        }

        const student = studentOptions.find((item) => item.value === form.student);
        const team = teamOptions.find((item) => item.value === form.team);
        const lab = labOptions.find((item) => item.value === form.lab);
        const faculty = facultyOptions.find(
            (item) => item.value === form.evaluatedBy
        );

        const markRecord = {
            student: {
                _id: form.student,
                student_name: student.label.split(" (")[0],
                student_reg: student.label.match(/\((.*?)\)/)?.[1] || "",
            },
            team: {
                _id: form.team,
                team_name: team.label.split(" (")[0],
                team_number: team.label.match(/\((.*?)\)/)?.[1] || "",
            },
            lab: {
                _id: form.lab,
                lab_name: lab.label,
            },
            evaluation: {
                practical_execution: String(form.practical_execution),
                used_html: String(form.used_html),
                js_logics: String(form.js_logics),
                css_responsiveness: String(form.css_responsiveness),
                viva: String(form.viva),
                documendation: String(form.documendation),
            },
            total_marks: String(total),
            maximum_marks: String(form.maximum_marks),
            project_status: form.project_status,
            evaluatedBy: {
                _id: form.evaluatedBy,
                faculty_name: faculty.label,
            },
        };

        if (data.selectedMark) {
            setMarks((prev) =>
                prev.map((mark) =>
                    mark._id === data.selectedMark._id
                        ? {
                            ...mark,
                            ...markRecord,
                            updatedAt: new Date().toISOString(),
                        }
                        : mark
                )
            );
        } else {
            setMarks((prev) => [
                ...prev,
                {
                    _id: crypto.randomUUID(),
                    ...markRecord,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
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
        setMarks((prev) =>
            prev.filter((mark) => mark._id !== data.deleteId)
        );

        setData((prev) => ({
            ...prev,
            deleteOpened: false,
            deleteId: null,
        }));
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Student Mark Evaluation
                </h2>

                <Button onClick={handleAdd}>Add Marks</Button>
            </div>

            <MarksTable
                data={marks}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={data.selectedMark ? "Edit Marks" : "Add Marks"}
                centered
                size="lg"
            >
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
                        onChange={(value) => updateForm("student", value || "")}
                        searchable
                        required
                        mb="md"
                    />

                    <Select
                        label="Team"
                        placeholder="Select team"
                        data={teamOptions}
                        value={data.form.team}
                        onChange={(value) => updateForm("team", value || "")}
                        required
                        mb="md"
                    />

                    <Select
                        label="Lab"
                        placeholder="Select lab"
                        data={labOptions}
                        value={data.form.lab}
                        onChange={(value) => updateForm("lab", value || "")}
                        required
                        mb="md"
                    />

                    <Select
                        label="Evaluated By"
                        placeholder="Select faculty"
                        data={facultyOptions}
                        value={data.form.evaluatedBy}
                        onChange={(value) => updateForm("evaluatedBy", value || "")}
                        required
                        mb="md"
                    />

                    <h3 className="mb-3 mt-4 font-semibold">
                        Evaluation Criteria
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {evaluationFields.map((field) => (
                            <NumberInput
                                key={field.key}
                                label={field.label}
                                min={0}
                                max={Number(data.form.maximum_marks)}
                                value={data.form[field.key]}
                                onChange={(value) =>
                                    updateForm(field.key, value || 0)
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
                            updateForm("maximum_marks", value || 1)
                        }
                        required
                    />

                    <div className="my-3 rounded-md bg-gray-100 p-3">
                        <span className="font-semibold">Calculated Total: </span>
                        {calculateTotal(data.form)} / {data.form.maximum_marks}
                    </div>

                    <Select
                        label="Project Status"
                        data={[
                            { value: "COMPLETED", label: "Completed" },
                            { value: "NOT_COMPLETED", label: "Not Completed" },
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
                            {data.selectedMark ? "Update Marks" : "Save Marks"}
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