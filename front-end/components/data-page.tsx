"use client"
import { useMemo, useState } from "react";
import { Button } from "./labwise";
import { badgeClass, DataKey, dataTitles, matches, PageName, pageToKey, percentage, statusLabel, statusTone } from "./util/util";



export default function DataPage({
    page,
    data,
    onAdd,
    onEdit,
    onDelete,
}: any) {
    const key = pageToKey[page as PageName] as DataKey;

    const [query, setQuery] = useState("");

    const rows = useMemo(
        () =>
            data[key].filter((row: any) =>
                matches(row, query)
            ),
        [data, key, query]
    );

    const columns =
        key === "marks"
            ? [
                  "student",
                  "team",
                  "lab",
                  "evaluator",
                  "total",
                  "percentage",
                  "status",
              ]
            : key === "departments"
              ? ["name", "code", "students", "faculty", "labs"]
              : key === "labs"
                ? ["name", "dept", "year", "max", "faculty"]
                : key === "faculty"
                  ? ["name", "dept", "lab"]
                  : key === "sections"
                    ? [
                          "name",
                          "dept",
                          "year",
                          "semester",
                          "students",
                      ]
                    : key === "students"
                      ? ["name", "reg", "dept", "section", "team"]
                      : [
                            "name",
                            "section",
                            "members",
                            "project",
                            "report",
                            "status",
                        ];

    const display = (row: any, column: string) => {
        if (column === "students") {
            return key === "departments"
                ? data.students.filter(
                      (student: any) => student.dept === row.code
                  ).length
                : data.students.filter(
                      (student: any) => student.section === row.name
                  ).length;
        }

        if (column === "faculty") {
            return key === "departments"
                ? data.faculty.filter(
                      (faculty: any) => faculty.dept === row.code
                  ).length
                : row.faculty;
        }

        if (column === "labs") {
            return data.labs.filter(
                (lab: any) => lab.dept === row.code
            ).length;
        }

        if (column === "percentage") {
            return `${percentage(row.total)}%`;
        }

        if (column === "total") {
            return `${row.total}/60`;
        }

        return row[column] ?? "—";
    };

    return (
        <div className="space-y-5">
            {/* Search and Actions */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                        ⌕
                    </span>

                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={`Search ${dataTitles[key].toLowerCase()}...`}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        secondary
                        onClick={() => setQuery("")}
                    >
                        Reset
                    </Button>

                    <Button onClick={onAdd}>
                        + Add{" "}
                        {key === "marks"
                            ? "evaluation"
                            : key.slice(0, -1)}
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column}
                                        className="px-5 py-3.5 font-semibold"
                                    >
                                        {column
                                            .replace(
                                                "name",
                                                key === "teams"
                                                    ? "Team"
                                                    : key.slice(0, -1)
                                            )
                                            .replace("dept", "Department")
                                            .replace("reg", "Register number")
                                            .replace("max", "Max marks")
                                            .replace(
                                                "percentage",
                                                "Percentage"
                                            )}
                                    </th>
                                ))}

                                <th className="px-5 py-3.5">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row: any) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-slate-50/70"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column}
                                            className="max-w-[220px] px-5 py-4 text-slate-600"
                                        >
                                            {["status", "report"].includes(
                                                column
                                            ) ? (
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(
                                                        statusTone(
                                                            row[column]
                                                        )
                                                    )}`}
                                                >
                                                    {statusLabel(row[column])}
                                                </span>
                                            ) : (
                                                <span
                                                    className={
                                                        ["name", "student"].includes(
                                                            column
                                                        )
                                                            ? "font-semibold text-slate-900"
                                                            : ""
                                                    }
                                                >
                                                    {display(row, column)}
                                                </span>
                                            )}
                                        </td>
                                    ))}

                                    {/* Row Actions */}
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(row)}
                                            className="mr-3 text-xs font-semibold text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(row)}
                                            className="text-xs font-semibold text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {!rows.length && (
                    <div className="p-10 text-center text-sm text-slate-500">
                        No records match your search.
                    </div>
                )}

                {/* Record Count */}
                <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
                    Showing {rows.length} of {data[key].length} records
                </div>
            </div>
        </div>
    );
}