import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Icon from '../components/Icon';
import { DetailList, DetailSection } from '../components/DetailList';
import { CRITERIA, EVALUATION_STATUS, toOptions } from '../constants';
import { formatDate, formatPercent, percent, sumCriteria } from '../utils/helpers';

const STATUS_OPTIONS = toOptions(EVALUATION_STATUS);

export default function MarksPage() {
  const { labs, faculty, students, marks, maps, actions } = useAppData();

  const rows = useMemo(
    () =>
      marks.map((m) => ({
        ...m,
        studentName: maps.students[m.studentId]?.name ?? 'Unknown',
        registerNumber: maps.students[m.studentId]?.registerNumber ?? '',
        teamName: maps.teams[m.teamId]?.name ?? '',
        labName: maps.labs[m.labId]?.name ?? '-',
        evaluatorName: maps.faculty[m.evaluatedBy]?.name ?? '-',
        percentage: percent(m.totalMarks, m.maxMarks),
      })),
    [marks, maps],
  );

  const completed = rows.filter((r) => r.status === 'COMPLETED');
  const average = completed.length ? completed.reduce((s, r) => s + r.percentage, 0) / completed.length : null;

  const summary = (
    <dl className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Evaluations', value: rows.length },
        { label: 'Completed', value: completed.length },
        { label: 'Pending or incomplete', value: rows.length - completed.length },
        { label: 'Average (completed)', value: average == null ? '-' : formatPercent(Math.round(average * 10) / 10) },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <dt className="text-xs text-slate-500">{s.label}</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums text-slate-900">{s.value}</dd>
        </div>
      ))}
    </dl>
  );

  const fields = [
    { name: 'studentId', label: 'Student', type: 'select', required: true, options: students.map((s) => ({ value: s._id, label: `${s.name} (${s.registerNumber})` })) },
    { name: 'labId', label: 'Lab', type: 'select', required: true, half: true, options: labs.map((l) => ({ value: l._id, label: l.name })) },
    { name: 'evaluatedBy', label: 'Evaluated by', type: 'select', required: true, half: true, options: faculty.map((f) => ({ value: f._id, label: f.name })) },
    { type: 'section', label: 'Marks', help: 'Each criterion is scored from 0 to 10. Half marks are allowed.' },
    ...CRITERIA.map((c) => ({
      name: c.key,
      label: c.label,
      type: 'number',
      required: true,
      half: true,
      min: 0,
      max: c.max,
      step: 0.5,
      suffix: `/ ${c.max}`,
      placeholder: '0',
    })),
    { name: 'status', label: 'Status', type: 'select', required: true, half: true, options: STATUS_OPTIONS, help: 'Only completed evaluations count toward the dashboard total.' },
  ];

  // Picking a student suggests their department's lab and its faculty member.
  const deriveValues = (next, changed) => {
    if (changed === 'studentId') {
      const lab = labs.find((l) => l.departmentId === maps.students[next.studentId]?.departmentId);
      const evaluator = lab && faculty.find((f) => f.labId === lab._id);
      return { labId: lab?._id || '', evaluatedBy: evaluator?._id || '' };
    }
    if (changed === 'labId') {
      const evaluator = faculty.find((f) => f.labId === next.labId);
      return evaluator ? { evaluatedBy: evaluator._id } : {};
    }
    return {};
  };

  const validate = (record) => (values) => {
    const errors = {};
    if (values.studentId && values.labId && marks.some((m) => m._id !== record?._id && m.studentId === values.studentId && m.labId === values.labId))
      errors.labId = 'This student already has an evaluation for this lab. Edit that one instead.';
    const max = maps.labs[values.labId]?.maxMarks;
    const total = sumCriteria(values);
    if (max && total > max) errors.labId = errors.labId || `Total ${total} is higher than this lab's maximum of ${max}.`;
    return errors;
  };

  const renderSummary = (values) => {
    const entered = CRITERIA.filter((c) => values[c.key] !== '' && !Number.isNaN(Number(values[c.key]))).length;
    const total = sumCriteria(values);
    const max = maps.labs[values.labId]?.maxMarks ?? CRITERIA.reduce((s, c) => s + c.max, 0);
    const pct = percent(total, max);
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-slate-600">Total marks</p>
          <p className="text-xs text-slate-500">{entered} of {CRITERIA.length} criteria entered</p>
        </div>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">
          {total} <span className="text-lg font-normal text-slate-500">/ {max}</span>
          <span className="ml-3 text-lg font-medium text-blue-700">{formatPercent(pct)}</span>
        </p>
        <div className="mt-3"><ProgressBar value={total} max={max} label="Percentage" /></div>
      </div>
    );
  };

  return (
    <ResourcePage
      pageKey="marks"
      title="Marks & Evaluations"
      description="Lab evaluation marks by student, with the criteria breakdown behind every total."
      singular="evaluation"
      plural="evaluations"
      addLabel="Add evaluation"
      emptyIcon="clipboard"
      summary={summary}
      rows={rows}
      columns={[
        { key: 'studentName', header: 'Student', sortable: true, render: (r) => (
          <div>
            <p className="font-medium text-slate-900">{r.studentName}</p>
            <p className="text-xs tabular-nums text-slate-500">{r.registerNumber}</p>
          </div>
        ) },
        { key: 'teamName', header: 'Team', sortable: true, hideBelow: 'xl' },
        { key: 'labName', header: 'Lab', sortable: true, hideBelow: 'lg' },
        { key: 'evaluatorName', header: 'Evaluator', sortable: true, hideBelow: 'xl' },
        { key: 'totalMarks', header: 'Total', sortable: true, className: 'tabular-nums' },
        { key: 'maxMarks', header: 'Max', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
        { key: 'percentage', header: 'Percentage', sortable: true, hideBelow: 'sm', render: (r) => (
          <div className="flex min-w-[110px] items-center gap-2">
            <div className="w-16"><ProgressBar value={r.totalMarks} max={r.maxMarks} label={`${r.studentName} percentage`} /></div>
            <span className="tabular-nums">{formatPercent(r.percentage)}</span>
          </div>
        ) },
        { key: 'status', header: 'Status', sortable: true, sortValue: (r) => EVALUATION_STATUS[r.status], render: (r) => <StatusBadge status={r.status} /> },
      ]}
      initialSort={{ key: 'studentName', dir: 'asc' }}
      searchText={(r) => `${r.studentName} ${r.registerNumber} ${r.teamName} ${r.labName} ${r.evaluatorName}`}
      searchPlaceholder="Search by student, team, lab or evaluator"
      filters={[
        { id: 'lab', label: 'All labs', options: labs.map((l) => ({ value: l._id, label: l.name })), predicate: (r, v) => r.labId === v },
        { id: 'evaluator', label: 'All evaluators', options: faculty.map((f) => ({ value: f._id, label: f.name })), predicate: (r, v) => r.evaluatedBy === v },
        { id: 'status', label: 'All statuses', options: STATUS_OPTIONS, predicate: (r, v) => r.status === v },
      ]}
      rowName={(r) => `${r.studentName}'s evaluation`}
      deleteMessage={(r) => `The ${r.labName} evaluation for ${r.studentName} (${r.totalMarks}/${r.maxMarks}) will be removed.`}
      onDelete={(r) => actions.marks.remove(r._id)}
      renderRowExtra={(r) =>
        r.status !== 'COMPLETED' && (
          <button
            type="button"
            onClick={() => actions.marks.setStatus(r._id, 'COMPLETED')}
            aria-label={`Mark ${r.studentName}'s evaluation as completed`}
            title="Mark completed"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Icon name="checkCircle" size={16} />
          </button>
        )
      }
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          size="lg"
          title={mode === 'add' ? 'Add evaluation' : 'Edit evaluation'}
          description="Totals and percentage update as you type."
          fields={fields}
          initialValues={mode === 'add' ? { status: 'COMPLETED' } : { ...record, ...record.criteria }}
          deriveValues={deriveValues}
          validate={validate(record)}
          renderExtra={renderSummary}
          submitLabel={mode === 'add' ? 'Save evaluation' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => (mode === 'add' ? actions.marks.add(v) : actions.marks.update(record._id, v))}
        />
      )}
      renderDetail={(r) => ({
        title: r.studentName,
        subtitle: `${r.labName} · ${formatDate(r.evaluatedOn)}`,
        body: (
          <>
            <DetailList
              items={[
                { label: 'Register number', value: r.registerNumber },
                { label: 'Team', value: r.teamName || 'No team' },
                { label: 'Evaluated by', value: r.evaluatorName },
                { label: 'Status', value: <StatusBadge status={r.status} /> },
              ]}
            />
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-sm text-slate-600">Total marks</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">
                {r.totalMarks} <span className="text-lg font-normal text-slate-500">/ {r.maxMarks}</span>
                <span className="ml-3 text-lg font-medium text-blue-700">{formatPercent(r.percentage)}</span>
              </p>
            </div>
            <DetailSection title="Criteria breakdown">
              <ul className="space-y-3">
                {CRITERIA.map((c) => (
                  <li key={c.key}>
                    <div className="mb-1 flex items-baseline justify-between text-sm">
                      <span className="text-slate-700">{c.label}</span>
                      <span className="font-medium tabular-nums text-slate-900">{r.criteria[c.key]} / {c.max}</span>
                    </div>
                    <ProgressBar value={r.criteria[c.key]} max={c.max} label={c.label} />
                  </li>
                ))}
              </ul>
            </DetailSection>
          </>
        ),
      })}
    />
  );
}
