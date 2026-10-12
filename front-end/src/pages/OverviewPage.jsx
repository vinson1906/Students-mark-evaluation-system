import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useRoute } from '../context/RouterContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import MarksBarChart from '../components/charts/MarksBarChart';
import DonutChart from '../components/charts/DonutChart';
import StackedBar from '../components/charts/StackedBar';
import { EVALUATION_STATUS, SUBMISSION_STATUS } from '../constants';
import { formatDate, formatPercent, percent, shortUrl } from '../utils/helpers';

const SUBMISSION_BARS = {
  NOT_SUBMITTED: 'bg-slate-300',
  PENDING: 'bg-amber-400',
  APPROVED: 'bg-emerald-500',
  REJECTED: 'bg-rose-500',
};

export default function OverviewPage() {
  const { departments, labs, faculty, sections, students, teams, marks, maps, setPendingAction } = useAppData();
  const { navigate } = useRoute();

  const stats = useMemo(() => {
    const completed = marks.filter((m) => m.status === 'COMPLETED');
    const average = completed.length
      ? completed.reduce((sum, m) => sum + percent(m.totalMarks, m.maxMarks), 0) / completed.length
      : null;
    const byStatus = (key) => marks.filter((m) => m.status === key).length;
    const submission = (field) =>
      Object.keys(SUBMISSION_STATUS).map((key) => ({
        label: SUBMISSION_STATUS[key],
        value: teams.filter((t) => t[field] === key).length,
        bar: SUBMISSION_BARS[key],
      }));
    return {
      completed: completed.length,
      average,
      byStatus,
      reports: submission('reportStatus'),
      projects: submission('projectStatus'),
      recent: [...marks].sort((a, b) => b.evaluatedOn.localeCompare(a.evaluatedOn)).slice(0, 5),
      deptCounts: departments.map((d) => ({ ...d, count: students.filter((s) => s.departmentId === d._id).length })),
    };
  }, [marks, teams, departments, students]);

  const kpis = [
    { label: 'Departments', value: departments.length, icon: 'building', page: 'departments' },
    { label: 'Labs', value: labs.length, icon: 'flask', page: 'labs' },
    { label: 'Faculty', value: faculty.length, icon: 'faculty', page: 'faculty' },
    { label: 'Sections', value: sections.length, icon: 'layers', page: 'sections' },
    { label: 'Students', value: students.length, icon: 'student', page: 'students' },
    { label: 'Teams', value: teams.length, icon: 'users', page: 'teams' },
  ];

  const chartMax = Math.max(60, ...marks.map((m) => m.maxMarks));
  const maxStudents = Math.max(1, ...stats.deptCounts.map((d) => d.count));

  const quickActions = [
    { label: 'Add evaluation', icon: 'clipboard', run: () => { setPendingAction({ page: 'marks', action: 'add' }); navigate('marks'); } },
    { label: 'Add student', icon: 'student', run: () => { setPendingAction({ page: 'students', action: 'add' }); navigate('students'); } },
    { label: 'Add lab', icon: 'flask', run: () => { setPendingAction({ page: 'labs', action: 'add' }); navigate('labs'); } },
    { label: 'Review team submissions', icon: 'users', run: () => navigate('teams') },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Evaluation progress, project submissions and student numbers across all departments."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} icon={k.icon} onClick={() => navigate(k.page)} />
        ))}
        <StatCard
          className="col-span-2"
          label="Evaluations completed"
          value={`${stats.completed} of ${marks.length}`}
          icon="clipboard"
          onClick={() => navigate('marks')}
        >
          <div className="mt-3">
            <ProgressBar value={stats.completed} max={marks.length} label="Evaluations completed" />
          </div>
        </StatCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Marks overview"
          description={
            stats.average == null
              ? 'Total marks per evaluation'
              : `Total marks per evaluation. Average across completed evaluations: ${formatPercent(Math.round(stats.average * 10) / 10)}.`
          }
        >
          {marks.length === 0 ? (
            <EmptyState icon="clipboard" title="No evaluations yet" description="Saved evaluations appear here as bars." />
          ) : (
            <div className="grid gap-6 md:grid-cols-[1fr_190px]">
              <MarksBarChart
                max={chartMax}
                data={marks.map((m) => ({
                  id: m._id,
                  label: maps.students[m.studentId]?.name ?? 'Unknown',
                  value: m.totalMarks,
                  max: m.maxMarks,
                  status: m.status,
                }))}
              />
              <div className="border-t border-slate-100 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <DonutChart
                  centerLabel="evaluations"
                  segments={[
                    { label: EVALUATION_STATUS.COMPLETED, value: stats.byStatus('COMPLETED'), stroke: 'stroke-blue-600', dot: 'bg-blue-600' },
                    { label: EVALUATION_STATUS.PENDING, value: stats.byStatus('PENDING'), stroke: 'stroke-amber-400', dot: 'bg-amber-400' },
                    { label: EVALUATION_STATUS.NOT_COMPLETED, value: stats.byStatus('NOT_COMPLETED'), stroke: 'stroke-rose-400', dot: 'bg-rose-400' },
                  ]}
                />
              </div>
            </div>
          )}
        </Card>

        <Card title="Quick actions" description="Jump straight into common tasks.">
          <ul className="space-y-2">
            {quickActions.map((a) => (
              <li key={a.label}>
                <button
                  type="button"
                  onClick={a.run}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <Icon name={a.icon} size={16} />
                  </span>
                  {a.label}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Recent evaluations"
          bodyClassName="overflow-x-auto"
          action={<Button variant="ghost" size="sm" onClick={() => navigate('marks')}>View all</Button>}
        >
          {stats.recent.length === 0 ? (
            <div className="p-5"><EmptyState icon="clipboard" title="No evaluations yet" description="Add an evaluation to see recent activity." /></div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs font-medium text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Student</th>
                  <th scope="col" className="hidden px-3 py-3 font-medium sm:table-cell">Lab</th>
                  <th scope="col" className="px-3 py-3 font-medium">Score</th>
                  <th scope="col" className="hidden px-3 py-3 font-medium md:table-cell">Date</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recent.map((m) => (
                  <tr key={m._id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{maps.students[m.studentId]?.name}</p>
                      <p className="text-xs text-slate-500">{maps.teams[m.teamId]?.name}</p>
                    </td>
                    <td className="hidden px-3 py-3 sm:table-cell">{maps.labs[m.labId]?.name}</td>
                    <td className="px-3 py-3 tabular-nums">
                      {m.totalMarks}/{m.maxMarks} <span className="text-slate-400">({formatPercent(percent(m.totalMarks, m.maxMarks))})</span>
                    </td>
                    <td className="hidden px-3 py-3 tabular-nums text-slate-500 md:table-cell">{formatDate(m.evaluatedOn)}</td>
                    <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Students by department">
          <ul className="space-y-4">
            {stats.deptCounts.map((d) => (
              <li key={d._id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-slate-700" title={d.name}>
                    <span className="font-medium text-slate-900">{d.code}</span> <span className="hidden text-slate-500 sm:inline">{d.name}</span>
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900">{d.count}</span>
                </div>
                <ProgressBar value={d.count} max={maxStudents} label={`${d.code} students`} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        className="mt-6"
        title="Project submission status"
        description="Report and project progress for every team."
        action={<Button variant="ghost" size="sm" onClick={() => navigate('teams')}>Manage teams</Button>}
      >
        {teams.length === 0 ? (
          <EmptyState icon="users" title="No teams yet" description="Create a team to track its project and report." />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-6">
              <StackedBar title="Reports" segments={stats.reports} />
              <StackedBar title="Projects" segments={stats.projects} />
            </div>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {teams.map((t) => (
                <li key={t._id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{t.name} <span className="font-normal text-slate-500">{t.teamNumber}</span></p>
                    <a href={t.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      {shortUrl(t.githubUrl)}
                      <Icon name="external" size={12} />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500">Report</span>
                    <StatusBadge status={t.reportStatus} kind="submission" />
                    <span className="text-xs text-slate-500">Project</span>
                    <StatusBadge status={t.projectStatus} kind="submission" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </>
  );
}
