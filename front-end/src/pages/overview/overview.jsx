import React, { useMemo } from "react";
import { Button, Loader } from "@mantine/core";

import { getDepartment } from "../department/department.service";
import { getLabs } from "../lab/lab.service";
import { getFaculty } from "../staff/staff.service";
import { getSection } from "../section/section.service";
import { getStudents } from "../student/students.service";
import { getTeams } from "../teams/team.service";
import { getMarks } from "../marks/marks.service";

const getArray = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.results)) return response.results;
    return [];
};

const getId = (value) =>
    value && typeof value === "object"
        ? String(value._id || value.id || "")
        : String(value || "");

const getName = (value, fields, fallback = "Unknown") => {
    if (typeof value === "string") return value || fallback;

    for (const field of fields) {
        if (value?.[field]) return value[field];
    }

    return fallback;
};

const getDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
};

const getStatusColor = (status) => {
    switch (String(status || "").toUpperCase()) {
        case "COMPLETED":
        case "APPROVED":
            return "bg-emerald-100 text-emerald-700";

        case "NOT_COMPLETED":
        case "REJECTED":
            return "bg-rose-100 text-rose-700";

        case "PENDING":
            return "bg-amber-100 text-amber-700";

        default:
            return "bg-slate-100 text-slate-600";
    }
};

const StatCard = ({ icon, label, value, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
                {label}
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                {icon}
            </span>
        </div>

        <p className="mt-4 text-3xl font-bold text-slate-900">
            {value}
        </p>
    </button>
);

const Panel = ({ title, description, action, children, className = "" }) => (
    <section
        className={`min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>

        <div className="p-5">{children}</div>
    </section>
);

const EmptyMessage = ({ children = "No data available yet." }) => (
    <div className="py-8 text-center text-sm text-slate-400">
        {children}
    </div>
);

const Progress = ({ value, max, color = "bg-blue-600" }) => {
    const percentage =
        max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    return (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
                className={`h-full rounded-full transition-all ${color}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export default function OverviewPage({ onNavigate = () => { } }) {
    const departmentsQuery = getDepartment();
    const labsQuery = getLabs();
    const facultyQuery = getFaculty();
    const sectionsQuery = getSection();
    const studentsQuery = getStudents();
    const teamsQuery = getTeams();
    const marksQuery = getMarks();

    const departments = getArray(departmentsQuery.data);
    const labs = getArray(labsQuery.data);
    const faculty = getArray(facultyQuery.data);
    const sections = getArray(sectionsQuery.data);
    const students = getArray(studentsQuery.data);
    const teams = getArray(teamsQuery.data);
    const marks = getArray(marksQuery.data);

    const isLoading = [
        departmentsQuery,
        labsQuery,
        facultyQuery,
        sectionsQuery,
        studentsQuery,
        teamsQuery,
        marksQuery,
    ].some((query) => query.isLoading);

    const hasError = [
        departmentsQuery,
        labsQuery,
        facultyQuery,
        sectionsQuery,
        studentsQuery,
        teamsQuery,
        marksQuery,
    ].some((query) => query.isError);

    const stats = useMemo(() => {
        const completed = marks.filter(
            (mark) =>
                String(mark.project_status || mark.status).toUpperCase() ===
                "COMPLETED"
        );

        const average =
            completed.length > 0
                ? completed.reduce((sum, mark) => {
                    const total = Number(mark.total_marks) || 0;
                    const maximum = Number(mark.maximum_marks) || 0;

                    return (
                        sum +
                        (maximum > 0 ? (total / maximum) * 100 : 0)
                    );
                }, 0) / completed.length
                : 0;

        const statusCounts = {
            COMPLETED: completed.length,
            PENDING: marks.filter(
                (mark) =>
                    String(mark.project_status || mark.status).toUpperCase() ===
                    "PENDING"
            ).length,
            NOT_COMPLETED: marks.filter(
                (mark) =>
                    String(mark.project_status || mark.status).toUpperCase() ===
                    "NOT_COMPLETED"
            ).length,
        };

        const departmentCounts = departments.map((department) => {
            const count = students.filter(
                (student) =>
                    getId(student.student_department) ===
                    String(department._id)
            ).length;

            return {
                ...department,
                count,
                name: department.department_name || "Unnamed Department",
                code: department.code || "—",
            };
        });

        const recent = [...marks]
            .sort((a, b) => {
                const dateA = new Date(
                    a.updatedAt || a.createdAt || 0
                ).getTime();
                const dateB = new Date(
                    b.updatedAt || b.createdAt || 0
                ).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);

        return {
            completed: completed.length,
            average,
            statusCounts,
            departmentCounts,
            recent,
        };
    }, [marks, departments, students]);

    const kpis = [
        {
            label: "Departments",
            value: departments.length,
            icon: "🏢",
            page: "departments",
        },
        {
            label: "Labs",
            value: labs.length,
            icon: "🧪",
            page: "labs",
        },
        {
            label: "Faculty",
            value: faculty.length,
            icon: "👨‍🏫",
            page: "staff",
        },
        {
            label: "Sections",
            value: sections.length,
            icon: "📚",
            page: "sections",
        },
        {
            label: "Students",
            value: students.length,
            icon: "🎓",
            page: "students",
        },
        {
            label: "Teams",
            value: teams.length,
            icon: "👥",
            page: "teams",
        },
    ];

    const maxStudents = Math.max(
        1,
        ...stats.departmentCounts.map((department) => department.count)
    );

    const maxMarks = Math.max(
        1,
        ...marks.map((mark) => Number(mark.maximum_marks) || 0)
    );

    const quickActions = [
        {
            label: "Add evaluation",
            description: "Record student lab marks",
            icon: "📝",
            page: "marks",
        },
        {
            label: "Add student",
            description: "Register a student",
            icon: "🎓",
            page: "students",
        },
        {
            label: "Add lab",
            description: "Create a lab record",
            icon: "🧪",
            page: "labs",
        },
        {
            label: "Manage teams",
            description: "View and update teams",
            icon: "👥",
            page: "teams",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Overview
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Evaluation progress, student statistics and lab
                        activity across all departments.
                    </p>
                </div>

                <Button onClick={() => onNavigate("marks")}>
                    + Add Evaluation
                </Button>
            </div>

            {hasError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Some dashboard data could not be loaded. Check the
                    corresponding API endpoints and refresh the page.
                </div>
            )}

            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((item) => (
                    <StatCard
                        key={item.label}
                        {...item}
                        onClick={() => onNavigate(item.page)}
                    />
                ))}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 sm:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                Evaluations completed
                            </p>
                            <p className="mt-2 text-3xl font-bold text-blue-950">
                                {stats.completed}
                                <span className="text-lg font-medium text-blue-500">
                                    {" "}
                                    / {marks.length}
                                </span>
                            </p>
                        </div>

                        <span className="text-2xl">✅</span>
                    </div>

                    <div className="mt-4">
                        <Progress
                            value={stats.completed}
                            max={marks.length}
                        />
                    </div>

                    <p className="mt-2 text-xs text-blue-700">
                        {marks.length > 0
                            ? `${Math.round(
                                (stats.completed / marks.length) * 100
                            )}% of all evaluation records completed`
                            : "No evaluation records yet"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Panel
                    title="Marks overview"
                    description={`Average score among completed evaluations: ${stats.average.toFixed(
                        1
                    )}%`}
                    className="xl:col-span-2"
                >
                    {marks.length === 0 ? (
                        <EmptyMessage>
                            No evaluations yet. Add marks to see the overview.
                        </EmptyMessage>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[1fr_190px]">

                            <div className="space-y-4">
                                {marks.slice(0, 8).map((mark) => {
                                    const total =
                                        Number(mark.total_marks) || 0;
                                    const maximum =
                                        Number(mark.maximum_marks) || 0;
                                    const percentage =
                                        maximum > 0
                                            ? (total / maximum) * 100
                                            : 0;

                                    const studentName = getName(
                                        mark.student,
                                        ["student_name", "name"]
                                    );

                                    return (
                                        <div key={mark._id}>
                                            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                                                <span className="truncate font-medium text-slate-700">
                                                    {studentName}
                                                </span>
                                                <span className="shrink-0 font-semibold tabular-nums text-slate-900">
                                                    {total}/{maximum}
                                                </span>
                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                percentage
                                                            )
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                <p className="mb-4 text-sm font-semibold text-slate-800">
                                    Evaluation status
                                </p>

                                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
                                    style={{
                                        background: `conic-gradient(
                                            #2563eb 0% ${marks.length
                                                ? (stats.statusCounts.COMPLETED /
                                                    marks.length) *
                                                100
                                                : 0
                                            }%,
                                            #fbbf24 0% ${marks.length
                                                ? ((stats.statusCounts.COMPLETED +
                                                    stats.statusCounts.PENDING) /
                                                    marks.length) *
                                                100
                                                : 0
                                            }%,
                                            #fb7185 0% 100%
                                        )`,
                                    }}
                                >
                                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                                        <span className="text-2xl font-bold text-slate-900">
                                            {marks.length}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Records
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {[
                                        {
                                            label: "Completed",
                                            value: stats.statusCounts.COMPLETED,
                                            color: "bg-blue-600",
                                        },
                                        {
                                            label: "Pending",
                                            value: stats.statusCounts.PENDING,
                                            color: "bg-amber-400",
                                        },
                                        {
                                            label: "Not completed",
                                            value:
                                                stats.statusCounts.NOT_COMPLETED,
                                            color: "bg-rose-400",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between gap-2 text-xs"
                                        >
                                            <span className="flex items-center gap-2 text-slate-600">
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                                                />
                                                {item.label}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <Button
                            variant="light"
                            onClick={() => onNavigate("marks")}
                        >
                            View all evaluations
                        </Button>
                    </div>
                </Panel>

                <Panel
                    title="Quick actions"
                    description="Shortcuts to common tasks"
                >
                    <div className="space-y-3">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
                                onClick={() => onNavigate(action.page)}
                                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
                                    {action.icon}
                                </span>

                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-slate-800">
                                        {action.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-slate-500">
                                        {action.description}
                                    </span>
                                </span>

                                <span className="ml-auto text-slate-400">
                                    →
                                </span>
                            </button>
                        ))}
                    </div>
                </Panel>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Panel
                    title="Recent evaluations"
                    description="Latest saved evaluation records"
                    className="xl:col-span-2"
                    action={
                        <Button
                            variant="subtle"
                            size="compact-sm"
                            onClick={() => onNavigate("marks")}
                        >
                            View all
                        </Button>
                    }
                >
                    {stats.recent.length === 0 ? (
                        <EmptyMessage>
                            No evaluations to display.
                        </EmptyMessage>
                    ) : (
                        <div className="-mx-5 overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Student
                                        </th>
                                        <th className="px-3 py-3 font-medium">
                                            Lab
                                        </th>
                                        <th className="px-3 py-3 font-medium">
                                            Score
                                        </th>
                                        <th className="px-3 py-3 font-medium">
                                            Date
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {stats.recent.map((mark) => (
                                        <tr key={mark._id}>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-800">
                                                    {getName(mark.student, [
                                                        "student_name",
                                                        "name",
                                                    ])}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {getName(mark.team, [
                                                        "team_name",
                                                        "name",
                                                    ], "No team")}
                                                </p>
                                            </td>

                                            <td className="px-3 py-4 text-slate-600">
                                                {getName(mark.lab, [
                                                    "lab_name",
                                                    "name",
                                                ])}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-4 font-medium tabular-nums text-slate-800">
                                                {Number(mark.total_marks) || 0}
                                                /
                                                {Number(mark.maximum_marks) || 0}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                                                {getDate(
                                                    mark.updatedAt ||
                                                    mark.createdAt
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                                                        mark.project_status ||
                                                        mark.status
                                                    )}`}
                                                >
                                                    {mark.project_status ||
                                                        mark.status ||
                                                        "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Panel>

                <Panel
                    title="Students by department"
                    description="Student distribution"
                >
                    {stats.departmentCounts.length === 0 ? (
                        <EmptyMessage>
                            No departments available.
                        </EmptyMessage>
                    ) : (
                        <div className="space-y-5">
                            {stats.departmentCounts.map((department) => (
                                <div key={department._id}>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                        <div className="min-w-0">
                                            <span className="font-semibold text-slate-900">
                                                {department.code}
                                            </span>
                                            <span className="ml-2 truncate text-slate-500">
                                                {department.name}
                                            </span>
                                        </div>

                                        <span className="font-semibold tabular-nums text-slate-800">
                                            {department.count}
                                        </span>
                                    </div>

                                    <Progress
                                        value={department.count}
                                        max={maxStudents}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>
            </div>

            <Panel
                title="Team overview"
                description="Team counts and project information"
                action={
                    <Button
                        variant="subtle"
                        size="compact-sm"
                        onClick={() => onNavigate("teams")}
                    >
                        Manage teams
                    </Button>
                }
            >
                {teams.length === 0 ? (
                    <EmptyMessage>
                        No teams yet. Create a team to see it here.
                    </EmptyMessage>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {teams.slice(0, 9).map((team) => {
                            const members = Array.isArray(team.team_members)
                                ? team.team_members.length
                                : 0;

                            const projectName = getName(
                                team.project,
                                ["project_name", "name", "title"],
                                "Project not specified"
                            );

                            return (
                                <div
                                    key={team._id}
                                    className="rounded-lg border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {team.team_name ||
                                                    "Unnamed Team"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {team.team_number || "No team number"}
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                            {members} members
                                        </span>
                                    </div>

                                    <p className="mt-4 text-xs text-slate-500">
                                        Project
                                    </p>
                                    <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                        {projectName}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Panel>
        </div>
    );
}