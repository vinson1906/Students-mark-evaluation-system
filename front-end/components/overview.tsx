
import { Icon } from "./icon";
import { Button } from "./labwise";
import { chartData, completedEvaluations, initials, statusLabel } from "./util/util";


export default function Overview({
    data,
    onNavigate,
}: {
    data: any;
    onNavigate: (page: any) => void;
}) {
    const totalMarks = data.marks.reduce(
        (sum: any, mark: any) => sum + mark.total,
        0
    );

    const stats = [
        [
            "Departments",
            data.departments.length,
            "Building2",
            "blue",
        ],
        ["Labs", data.labs.length, "FlaskConical", "violet"],
        [
            "Faculty",
            data.faculty.length,
            "GraduationCap",
            "orange",
        ],
        ["Sections", data.sections.length, "Layers3", "green"],
        ["Students", data.students.length, "Users", "blue"],
        ["Teams", data.teams.length, "FolderKanban", "violet"],
        [
            "Completed evaluations",
            completedEvaluations(data),
            "ClipboardCheck",
            "green",
        ],
    ] as const;

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([label, value, icon, tone]) => (
                    <div
                        key={label}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    {label}
                                </p>

                                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                    {value}
                                </p>
                            </div>

                            <span
                                className={`rounded-lg p-2 ${tone === "blue"
                                        ? "bg-blue-50 text-blue-600"
                                        : tone === "violet"
                                            ? "bg-violet-50 text-violet-600"
                                            : tone === "orange"
                                                ? "bg-orange-50 text-orange-600"
                                                : "bg-emerald-50 text-emerald-600"
                                    }`}
                            >
                                <Icon name={icon} />
                            </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            Current academic year
                        </p>
                    </div>
                ))}
            </div>

            {/* Marks Overview and Project Submissions */}
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                {/* Marks Overview */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Marks overview
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Average evaluation activity over the year
                            </p>
                        </div>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {totalMarks} total marks
                        </span>
                    </div>

                    <div className="mt-6 h-48">
                        <svg
                            viewBox="0 0 360 150"
                            className="h-full w-full"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label="Marks overview line chart"
                        >
                            <path
                                d="M0 130H360M0 90H360M0 50H360M0 10H360"
                                stroke="#e2e8f0"
                                strokeDasharray="3 4"
                            />

                            <polyline
                                points={chartData
                                    .map(
                                        (value, index) =>
                                            `${index * 32},${140 - value * 1.9}`
                                    )
                                    .join(" ")}
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <polygon
                                points={`0,140 ${chartData
                                    .map(
                                        (value, index) =>
                                            `${index * 32},${140 - value * 1.9}`
                                    )
                                    .join(" ")} 352,140`}
                                fill="#dbeafe"
                                opacity=".65"
                            />
                        </svg>
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>Nov</span>
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                    </div>
                </section>

                {/* Project Submissions */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="font-semibold text-slate-900">
                        Project submissions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current team submission status
                    </p>

                    <div className="mt-7 space-y-5">
                        {[
                            [
                                "Submitted",
                                data.teams.filter(
                                    (team: any) => team.report === "COMPLETED"
                                ).length,
                                "bg-emerald-500",
                            ],
                            [
                                "Pending review",
                                data.teams.filter(
                                    (team: any) => team.report === "PENDING"
                                ).length,
                                "bg-amber-400",
                            ],
                            [
                                "Not submitted",
                                data.teams.filter(
                                    (team: any) => team.report === "NOT_SUBMITTED"
                                ).length,
                                "bg-slate-300",
                            ],
                        ].map(([label, count, color]) => (
                            <div key={String(label)}>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-slate-600">
                                        {label}
                                    </span>

                                    <strong className="text-slate-900">
                                        {count}
                                    </strong>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${color}`}
                                        style={{
                                            width: `${Math.max(
                                                (Number(count) /
                                                    data.teams.length) *
                                                100,
                                                Number(count) ? 18 : 0
                                            )
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        secondary
                        onClick={() => onNavigate("Teams & Projects")}
                    >
                        View projects
                    </Button>
                </section>
            </div>

            {/* Recent Evaluations and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                {/* Recent Evaluations */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Recent evaluations
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Latest activity across all labs
                            </p>
                        </div>

                        <Button
                            secondary
                            onClick={() =>
                                onNavigate("Marks & Evaluations")
                            }
                        >
                            View all
                        </Button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {data.marks.slice(0, 4).map((mark: any) => (
                            <div
                                key={mark.id}
                                className="flex items-center justify-between gap-3 p-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                                        {initials(mark.student)}
                                    </span>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {mark.student}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {mark.lab} · {mark.evaluator}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">
                                        {mark.total}/60
                                    </p>

                                    <span
                                        className={`text-[11px] font-semibold ${mark.status === "COMPLETED"
                                                ? "text-emerald-600"
                                                : "text-amber-600"
                                            }`}
                                    >
                                        {statusLabel(mark.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="font-semibold text-slate-900">
                        Quick actions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Common tasks for today
                    </p>

                    <div className="mt-5 space-y-3">
                        {[
                            [
                                "Add student",
                                "Create a new student record",
                                "Students",
                            ],
                            [
                                "Record evaluation",
                                "Enter marks for a student",
                                "Marks & Evaluations",
                            ],
                            [
                                "Create team",
                                "Set up a project team",
                                "Teams & Projects",
                            ],
                        ].map(([title, description, target]) => (
                            <button
                                type="button"
                                key={title}
                                onClick={() =>
                                    onNavigate(target as any)
                                }
                                className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left hover:border-blue-300 hover:bg-blue-50/40"
                            >
                                <span>
                                    <span className="block text-sm font-semibold text-slate-800">
                                        {title}
                                    </span>

                                    <span className="mt-1 block text-xs text-slate-500">
                                        {description}
                                    </span>
                                </span>

                                <span className="text-blue-600">→</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}