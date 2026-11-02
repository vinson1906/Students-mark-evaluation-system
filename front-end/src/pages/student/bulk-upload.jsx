
import React, { useRef, useState } from "react";
import {
    Modal,
    Select,
    Button,
    Group,
} from "@mantine/core";
import * as XLSX from "xlsx";
import { bulkUploadStudents } from "./students.service"

const BulkStudentUploadModal = ({
    opened,
    onClose,
    departments,
    sections,
    students
}) => {
    const fileInputRef = useRef(null);

    const createMutation = bulkUploadStudents();

    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [department, setDepartment] = useState("");
    const [section, setSection] = useState("");
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState("");

    const sectionOptions = sections
        .filter((item) => {
            const departmentId =
                typeof item.department === "object"
                    ? item.department?._id
                    : item.department;

            return String(departmentId) === department;
        })
        .map((item) => ({
            value: String(item._id),
            label: item.section_name,
        }));

    const reset = () => {
        setFile(null);
        setRows([]);
        setDepartment("");
        setSection("");
        setError("");
        setResult("");
        setDragging(false);
        setUploading(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Read Excel file
    const handleFile = async (selectedFile) => {
        if (!selectedFile) return;

        setError("");
        setResult("");

        const extension = selectedFile.name
            .split(".")
            .pop()
            .toLowerCase();

        if (!["xlsx", "xls"].includes(extension)) {
            setError("Please upload a valid Excel file (.xlsx or .xls).");
            return;
        }

        try {
            const buffer = await selectedFile.arrayBuffer();

            const workbook = XLSX.read(buffer, {
                type: "array",
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const excelData = XLSX.utils.sheet_to_json(sheet, {
                defval: "",
            });

            if (!excelData.length) {
                setError("The Excel file is empty.");
                return;
            }

            const parsedRows = excelData.map((item, index) => {
                const normalized = {};

                Object.entries(item).forEach(([key, value]) => {
                    normalized[key.trim().toLowerCase().replace(/\s+/g, "_")] = value;
                });

                const name =
                    normalized.student_name ||
                    normalized.name ||
                    "";

                const reg =
                    normalized.reg_no ||
                    normalized.student_reg ||
                    normalized.register_number ||
                    normalized.regno ||
                    "";

                return {
                    id: index + 1,
                    student_name: String(name).trim(),
                    student_reg: String(reg).trim(),
                };
            }).filter((item) => item.student_name || item.student_reg);

            if (!parsedRows.length) {
                setError("No valid student records found.");
                return;
            }

            setFile(selectedFile);
            setRows(parsedRows);

        } catch (err) {
            setError("Unable to read Excel file. Please check its format.");
        }
    };

    // Validate Excel data
    const getValidationError = () => {
        if (!rows.length) return "Please upload an Excel file.";

        if (!department) return "Please select a department.";

        if (!section) return "Please select a section.";

        const sectionExists = sectionOptions.some(
            (item) => item.value === section
        );

        if (!sectionExists) return "Invalid section selected.";

        const existingRegs = new Set(
            students.map((student) =>
                String(student.student_reg || "").trim().toLowerCase()
            )
        );

        const uploadedRegs = new Set();

        for (const student of rows) {
            if (!student.student_name || !student.student_reg) {
                return `Missing name or register number in Excel row ${student.id + 1}.`;
            }

            const reg = student.student_reg.toLowerCase();

            if (existingRegs.has(reg)) {
                return `Register number ${student.student_reg} already exists.`;
            }

            if (uploadedRegs.has(reg)) {
                return `Duplicate register number ${student.student_reg} in Excel file.`;
            }

            uploadedRegs.add(reg);
        }

        return "";
    };


    const handleBulkUpload = () => {
        const validationError = getValidationError();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setResult("");

        const payload = {
            students: rows.map((student) => ({
                student_name: student.student_name,
                student_reg: student.student_reg,
                student_department: department,
                section: section,
                team: null,
            })),
        };

        createMutation.mutate(payload, {
            onSuccess: (response) => {
                setResult(
                    response?.message ||
                    `Successfully uploaded ${rows.length} students!`
                );

                setTimeout(() => {
                    handleClose();
                }, 1000);
            },

            onError: (err) => {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to upload students."
                );
            },
        });
    };


    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const droppedFile = event.dataTransfer.files?.[0];

        if (droppedFile) handleFile(droppedFile);
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Bulk Upload Students"
            centered
            size="xl"
        >
            <div className="space-y-4">

                {/* DRAG AND DROP */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition
                        ${dragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        hidden
                        onChange={(e) => {
                            handleFile(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                    />

                    <div className="mb-3 text-4xl">📊</div>

                    <p className="font-semibold text-gray-800">
                        Drag and drop your Excel file here
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        or click to browse files
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                        Supported formats: .xlsx, .xls
                    </p>
                </div>

                {file && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <div>
                            <p className="text-sm font-medium">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {rows.length} student records found
                            </p>
                        </div>

                        <Button
                            color="red"
                            variant="subtle"
                            size="xs"
                            onClick={() => {
                                setFile(null);
                                setRows([]);
                                setError("");
                                setResult("");
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                )}

                {/* COMMON DEPARTMENT */}
                <Select
                    label="Department"
                    placeholder="Select department"
                    data={departments.map((item) => ({
                        value: String(item._id),
                        label: item.department_name,
                    }))}
                    value={department || null}
                    onChange={(value) => {
                        setDepartment(value || "");
                        setSection("");
                        setError("");
                    }}
                    searchable
                    required
                />

                {/* COMMON SECTION */}
                <Select
                    label="Section"
                    placeholder="Select section"
                    data={sectionOptions}
                    value={section || null}
                    onChange={(value) => {
                        setSection(value || "");
                        setError("");
                    }}
                    searchable
                    disabled={!department}
                    required
                />

                {/* EXCEL PREVIEW */}
                {rows.length > 0 && (
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-semibold">
                                Student Preview
                            </h4>

                            <span className="text-sm text-gray-500">
                                {rows.length} records
                            </span>
                        </div>

                        <div className="max-h-64 overflow-auto rounded-lg border">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        <th className="p-3">#</th>
                                        <th className="p-3">Student Name</th>
                                        <th className="p-3">Register Number</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {rows.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="border-t"
                                        >
                                            <td className="p-3">
                                                {student.id}
                                            </td>
                                            <td className="p-3">
                                                {student.student_name}
                                            </td>
                                            <td className="p-3">
                                                {student.student_reg}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* SUCCESS */}
                {result && (
                    <p className="whitespace-pre-line rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {result}
                    </p>
                )}

                {/* ERROR */}
                {error && (
                    <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <Group justify="flex-end">
                    <Button
                        variant="default"
                        onClick={handleClose}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleBulkUpload}
                        loading={createMutation.isPending}
                        disabled={!rows.length || !department || !section}
                    >
                        Upload {rows.length} Students
                    </Button>
                </Group>
            </div>
        </Modal>
    );
};

export default BulkStudentUploadModal;
