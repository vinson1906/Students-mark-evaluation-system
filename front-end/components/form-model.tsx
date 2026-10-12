"use client"
import { useState } from "react";
import { Button } from "./labwise";
import { allDepartments, allFaculty, allLabs, allSections, allTeams, criteria, dataTitles, defaultForm, fieldsByKey, makeId, percentage, students } from "./util/util";


export default function FormModal({ keyName, item, onClose, onSave }: any) {
    const [form, setForm] = useState({
        ...defaultForm(keyName),
        ...item,
    });

    const [error, setError] = useState("");

    const fields: any = fieldsByKey[keyName];

    const set = (field: string, value: string) => {
        setForm((current: Record<string, any>) => ({
            ...current,
            [field]: [
                "year",
                "semester",
                "max",
                ...criteria.map(([key]) => key),
            ].includes(field)
                ? Number(value)
                : value,
        }));
    };

    const save = () => {
        if (
            fields.some(
                (field: any) =>
                    ["name", "code", "reg", "student", "project"].includes(
                        field
                    ) && !String(form[field] ?? "").trim()
            )
        ) {
            return setError("Please complete all required fields.");
        }

        if (
            keyName === "students" &&
            !item &&
            students.some((student) => student.reg === form.reg)
        ) {
            return setError("Register number already exists.");
        }

        onSave({
            ...form,
            id: form.id || makeId(),
            total:
                keyName === "marks"
                    ? criteria.reduce(
                        (sum, [field]) => sum + Number(form[field] || 0),
                        0
                    )
                    : form.total,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {item ? "Edit" : "Add"}{" "}
                            {dataTitles[keyName as DataKey]}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update this record in the local workspace.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Close modal"
                        onClick={onClose}
                        className="text-2xl text-slate-400 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {/* Form Fields */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {fields.map((field: any) => (
                        <label
                            key={field}
                            className={
                                ["members", "project", "github"].includes(field)
                                    ? "sm:col-span-2"
                                    : ""
                            }
                        >
                            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {field === "student"
                                    ? "Student"
                                    : field.replaceAll("_", " ")}
                            </span>

                            {[
                                "dept",
                                "section",
                                "team",
                                "lab",
                                "evaluator",
                                "faculty",
                                "report",
                                "status",
                            ].includes(field) ? (
                                <select
                                    value={form[field] ?? ""}
                                    onChange={(event) =>
                                        set(field, event.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                >
                                    {(
                                        field === "dept"
                                            ? allDepartments
                                            : field === "section"
                                                ? allSections
                                                : field === "team"
                                                    ? allTeams
                                                    : field === "lab"
                                                        ? allLabs
                                                        : field === "evaluator" ||
                                                            field === "faculty"
                                                            ? allFaculty
                                                            : [
                                                                "PENDING",
                                                                "COMPLETED",
                                                                "NOT_SUBMITTED",
                                                                "NOT_COMPLETED",
                                                            ]
                                    ).map((option) => (
                                        <option
                                            key={option}
                                            value={option}
                                        >
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={
                                        [
                                            "practical",
                                            "html",
                                            "js",
                                            "css",
                                            "viva",
                                            "docs",
                                            "max",
                                            "semester",
                                            "year",
                                        ].includes(field) && field !== "year"
                                            ? "number"
                                            : "text"
                                    }
                                    value={form[field] ?? ""}
                                    onChange={(event) =>
                                        set(field, event.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                />
                            )}
                        </label>
                    ))}
                </div>

                {/* Marks Summary */}
                {keyName === "marks" && (
                    <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-800">
                        Total:{" "}
                        {criteria.reduce(
                            (sum, [field]) =>
                                sum + Number(form[field] || 0),
                            0
                        )}{" "}
                        / 60 ·{" "}
                        {percentage(
                            criteria.reduce(
                                (sum, [field]) =>
                                    sum + Number(form[field] || 0),
                                0
                            )
                        )}
                        %
                    </p>
                )}

                {/* Modal Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button secondary onClick={onClose}>
                        Cancel
                    </Button>

                    <Button onClick={save}>
                        Save changes
                    </Button>
                </div>
            </div>
        </div>
    );
}