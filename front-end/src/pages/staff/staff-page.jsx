import React, { useState } from "react";
import {
    Modal,
    TextInput,
    Select,
    Button,
    Group,
} from "@mantine/core";

import FacultyTable from "./staff";

const initialFaculty = [
    {
        _id: "6ace10001cb9b2b76aa4ff01",
        faculty_name: "Dr. Priya Kumar",
        department: {
            _id: "6ac9fbb31cb9b2b76aa4ff3d",
            department_name: "Computer Science Engineering",
        },
        lab: {
            _id: "6acd10001cb9b2b76aa4ff01",
            lab_name: "Web Development Lab",
        },
    },
    {
        _id: "6ace10001cb9b2b76aa4ff02",
        faculty_name: "Mr. Arun Prakash",
        department: {
            _id: "6ac9fbb31cb9b2b76aa4ff3d",
            department_name: "Computer Science Engineering",
        },
        lab: {
            _id: "6acd10001cb9b2b76aa4ff02",
            lab_name: "Database Management Systems Lab",
        },
    },
    {
        _id: "6ace10001cb9b2b76aa4ff03",
        faculty_name: "Mrs. Divya Raj",
        department: {
            _id: "6ac9fbb31cb9b2b76aa4ff3d",
            department_name: "Computer Science Engineering",
        },
        lab: {
            _id: "6acd10001cb9b2b76aa4ff03",
            lab_name: "Java Programming Lab",
        },
    },
    {
        _id: "6ace10001cb9b2b76aa4ff04",
        faculty_name: "Mr. Karthik Raman",
        department: {
            _id: "6ac9fc571cb9b2b76aa4ff3e",
            department_name: "Electrical and Electronics Engineering",
        },
        lab: {
            _id: "6acd10001cb9b2b76aa4ff04",
            lab_name: "Electrical Machines Lab",
        },
    },
    {
        _id: "6ace10001cb9b2b76aa4ff05",
        faculty_name: "Mrs. Meena Devi",
        department: {
            _id: "6ac9fc571cb9b2b76aa4ff3e",
            department_name: "Electrical and Electronics Engineering",
        },
        lab: {
            _id: "6acd10001cb9b2b76aa4ff05",
            lab_name: "Power Electronics Lab",
        },
    },
];

const departmentOptions = [
    {
        value: "6ac9fbb31cb9b2b76aa4ff3d",
        label: "Computer Science Engineering",
    },
    {
        value: "6ac9fc571cb9b2b76aa4ff3e",
        label: "Electrical and Electronics Engineering",
    },
];

const labOptions = [
    {
        value: "6acd10001cb9b2b76aa4ff01",
        label: "Web Development Lab",
        departmentId: "6ac9fbb31cb9b2b76aa4ff3d",
    },
    {
        value: "6acd10001cb9b2b76aa4ff02",
        label: "Database Management Systems Lab",
        departmentId: "6ac9fbb31cb9b2b76aa4ff3d",
    },
    {
        value: "6acd10001cb9b2b76aa4ff03",
        label: "Java Programming Lab",
        departmentId: "6ac9fbb31cb9b2b76aa4ff3d",
    },
    {
        value: "6acd10001cb9b2b76aa4ff04",
        label: "Electrical Machines Lab",
        departmentId: "6ac9fc571cb9b2b76aa4ff3e",
    },
    {
        value: "6acd10001cb9b2b76aa4ff05",
        label: "Power Electronics Lab",
        departmentId: "6ac9fc571cb9b2b76aa4ff3e",
    },
];

const emptyForm = {
    faculty_name: "",
    department: "",
    lab: "",
};

export const FacultyPage = () => {
    const [faculty, setFaculty] = useState(initialFaculty);

    const [data, setData] = useState({
        form: { ...emptyForm },
        selectedFaculty: null,
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
                ...(key === "department" ? { lab: "" } : {}),
            },
            error: "",
        }));
    };

    const resetForm = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedFaculty: null,
            formOpened: false,
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((prev) => ({
            ...prev,
            form: { ...emptyForm },
            selectedFaculty: null,
            formOpened: true,
            error: "",
        }));
    };

    const handleEdit = (member) => {
        setData((prev) => ({
            ...prev,
            selectedFaculty: member,
            form: {
                faculty_name: member.faculty_name || "",
                department: member.department?._id || "",
                lab: member.lab?._id || "",
            },
            formOpened: true,
            error: "",
        }));
    };

    const handleSubmit = () => {
        const { form } = data;

        if (
            !form.faculty_name.trim() ||
            !form.department ||
            !form.lab
        ) {
            updateData("error", "Please fill in all required fields.");
            return;
        }

        const selectedDepartment = departmentOptions.find(
            (item) => item.value === form.department
        );

        const selectedLab = labOptions.find(
            (item) => item.value === form.lab
        );

        if (!selectedDepartment || !selectedLab) {
            updateData("error", "Please select a valid department and lab.");
            return;
        }

        if (selectedLab.departmentId !== form.department) {
            updateData(
                "error",
                "The selected lab must belong to the selected department."
            );
            return;
        }

        const facultyRecord = {
            faculty_name: form.faculty_name.trim(),
            department: {
                _id: selectedDepartment.value,
                department_name: selectedDepartment.label,
            },
            lab: {
                _id: selectedLab.value,
                lab_name: selectedLab.label,
            },
        };

        if (data.selectedFaculty) {
            setFaculty((prev) =>
                prev.map((member) =>
                    member._id === data.selectedFaculty._id
                        ? { ...member, ...facultyRecord }
                        : member
                )
            );
        } else {
            setFaculty((prev) => [
                ...prev,
                {
                    _id: crypto.randomUUID(),
                    ...facultyRecord,
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
        setFaculty((prev) =>
            prev.filter((member) => member._id !== data.deleteId)
        );

        setData((prev) => ({
            ...prev,
            deleteOpened: false,
            deleteId: null,
        }));
    };

    const filteredLabs = labOptions.filter(
        (lab) => lab.departmentId === data.form.department
    );

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Faculty Management</h2>

                <Button onClick={handleAdd}>Add Faculty</Button>
            </div>

            <FacultyTable
                data={faculty}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />


            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={
                    data.selectedFaculty
                        ? "Edit Faculty"
                        : "Add Faculty"
                }
                centered
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                >
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
                        placeholder="Select department"
                        data={departmentOptions}
                        value={data.form.department}
                        onChange={(value) =>
                            updateForm("department", value || "")
                        }
                        searchable
                        required
                        mb="md"
                    />

                    <Select
                        label="Assigned Lab"
                        placeholder={
                            data.form.department
                                ? "Select lab"
                                : "Select a department first"
                        }
                        data={filteredLabs.map((lab) => ({
                            value: lab.value,
                            label: lab.label,
                        }))}
                        value={data.form.lab}
                        onChange={(value) =>
                            updateForm("lab", value || "")
                        }
                        disabled={!data.form.department}
                        searchable
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
                            {data.selectedFaculty
                                ? "Update Faculty"
                                : "Add Faculty"}
                        </Button>
                    </Group>
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
                title="Delete Faculty"
                centered
                size="sm"
            >
                <p className="mb-4">
                    Are you sure you want to delete this faculty member?
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