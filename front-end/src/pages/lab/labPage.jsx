import React, { useState } from "react";
import { Modal, TextInput, Select, Button, Group, NumberInput } from "@mantine/core";

import LabTable from "./lab";

export const labMockData = [
    {
        _id: "6acd10001cb9b2b76aa4ff01",
        lab_name: "Web Development Lab",
        department: {
            _id: "6ac9fbb31cb9b2b76aa4ff3d",
            department_name: "Computer Science Engineering",
        },
        acadamic_year: "2026-2027",
        maximum_mark: "100",
    },
    {
        _id: "6acd10001cb9b2b76aa4ff02",
        lab_name: "Database Management Systems Lab",
        department: {
            _id: "6ac9fbb31cb9b2b76aa4ff3d",
            department_name: "Computer Science Engineering",
        },
        acadamic_year: "2026-2027",
        maximum_mark: "100",
    },
    {
        _id: "6acd10001cb9b2b76aa4ff03",
        lab_name: "Java Programming Lab",
        department: {
            _id: "6ac9fbb31cb9b2b76aa4ff3d",
            department_name: "Computer Science Engineering",
        },
        acadamic_year: "2026-2027",
        maximum_mark: "100",
    },
    {
        _id: "6acd10001cb9b2b76aa4ff04",
        lab_name: "Electrical Machines Lab",
        department: {
            _id: "6ac9fc571cb9b2b76aa4ff3e",
            department_name: "Electrical and Electronics Engineering",
        },
        acadamic_year: "2026-2027",
        maximum_mark: "100",
    },
    {
        _id: "6acd10001cb9b2b76aa4ff05",
        lab_name: "Power Electronics Lab",
        department: {
            _id: "6ac9fc571cb9b2b76aa4ff3e",
            department_name: "Electrical and Electronics Engineering",
        },
        acadamic_year: "2026-2027",
        maximum_mark: "100",
    },
];


export const LabPage = () => {
    const [labs, setLabs] = useState(labMockData);

    const [data, setData] = useState({
        form: {
            lab_name: "",
            department: "",
            acadamic_year: "",
            maximum_mark: 100,
        },
        selectedLab: null,
        formOpened: false,
        deleteOpened: false,
        deleteId: null,
        error: "",
    });

    const departments = [
        {
            value: "6ac9fbb31cb9b2b76aa4ff3d",
            label: "Computer Science Engineering",
        },
        {
            value: "6ac9fc571cb9b2b76aa4ff3e",
            label: "Electrical and Electronics Engineering",
        },
    ];

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
            form: {
                lab_name: "",
                department: "",
                acadamic_year: "",
                maximum_mark: 100,
            },
            selectedLab: null,
            formOpened: false,
            error: "",
        }));
    };

    const handleAdd = () => {
        setData((prev) => ({
            ...prev,
            form: {
                lab_name: "",
                department: "",
                acadamic_year: "",
                maximum_mark: 100,
            },
            selectedLab: null,
            formOpened: true,
            error: "",
        }));
    };

    const handleEdit = (lab) => {
        setData((prev) => ({
            ...prev,
            selectedLab: lab,
            form: {
                lab_name: lab.lab_name,
                department: lab.department?._id || "",
                acadamic_year: lab.acadamic_year,
                maximum_mark: Number(lab.maximum_mark) || 100,
            },
            formOpened: true,
            error: "",
        }));
    };

    const handleSubmit = () => {
        const { lab_name, department, acadamic_year, maximum_mark } = data.form;

        if (!lab_name.trim() || !department || !acadamic_year.trim()) {
            updateData("error", "Please fill in all required fields.");
            return;
        }

        if (!maximum_mark || maximum_mark <= 0) {
            updateData("error", "Maximum marks must be greater than zero.");
            return;
        }

        const selectedDepartment = departments.find(
            (item) => item.value === department
        );

        const labData = {
            lab_name: lab_name.trim(),
            department: {
                _id: selectedDepartment.value,
                department_name: selectedDepartment.label,
            },
            acadamic_year: acadamic_year.trim(),
            maximum_mark: String(maximum_mark),
        };

        if (data.selectedLab) {
            setLabs((prev) =>
                prev.map((lab) =>
                    lab._id === data.selectedLab._id
                        ? { ...lab, ...labData }
                        : lab
                )
            );
        } else {
            setLabs((prev) => [
                ...prev,
                {
                    _id: crypto.randomUUID(),
                    ...labData,
                },
            ]);
        }

        resetForm();
    };

    const handleDeleteClick = (id) => {
        updateData("deleteId", id);
        updateData("deleteOpened", true);
    };

    const handleDeleteConfirm = () => {
        setLabs((prev) => prev.filter((lab) => lab._id !== data.deleteId));

        setData((prev) => ({
            ...prev,
            deleteOpened: false,
            deleteId: null,
        }));
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Lab Management</h2>

                <Button onClick={handleAdd}>
                    Add Lab
                </Button>
            </div>

            <LabTable
                data={labs}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            {/* Add / Edit Lab Modal */}
            <Modal
                opened={data.formOpened}
                onClose={resetForm}
                title={data.selectedLab ? "Edit Lab" : "Add Lab"}
                centered
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                >
                    <TextInput
                        label="Lab Name"
                        placeholder="Enter lab name"
                        value={data.form.lab_name}
                        onChange={(event) =>
                            updateForm("lab_name", event.currentTarget.value)
                        }
                        required
                        mb="md"
                    />

                    <Select
                        label="Department"
                        placeholder="Select department"
                        data={departments}
                        value={data.form.department}
                        onChange={(value) =>
                            updateForm("department", value || "")
                        }
                        required
                        mb="md"
                    />

                    <TextInput
                        label="Academic Year"
                        placeholder="2026-2027"
                        value={data.form.acadamic_year}
                        onChange={(event) =>
                            updateForm("acadamic_year", event.currentTarget.value)
                        }
                        required
                        mb="md"
                    />

                    <NumberInput
                        label="Maximum Marks"
                        placeholder="Enter maximum marks"
                        min={1}
                        value={data.form.maximum_mark}
                        onChange={(value) =>
                            updateForm("maximum_mark", value)
                        }
                        required
                        mb="md"
                    />

                    {data.error && (
                        <p className="mb-3 text-sm text-red-600">
                            {data.error}
                        </p>
                    )}

                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={resetForm}
                            type="button"
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            {data.selectedLab ? "Update Lab" : "Add Lab"}
                        </Button>
                    </Group>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={data.deleteOpened}
                onClose={() => {
                    setData((prev) => ({
                        ...prev,
                        deleteOpened: false,
                        deleteId: null,
                    }));
                }}
                title="Delete Lab"
                centered
                size="sm"
            >
                <p className="mb-4">
                    Are you sure you want to delete this lab?
                </p>

                <Group justify="flex-end">
                    <Button
                        variant="default"
                        onClick={() => {
                            setData((prev) => ({
                                ...prev,
                                deleteOpened: false,
                                deleteId: null,
                            }));
                        }}
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