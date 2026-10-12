import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import StatusBadge from '../components/StatusBadge';
import { DetailList, DetailSection, NameList } from '../components/DetailList';
import { formatPercent, normalize, percent } from '../utils/helpers';

export default function StudentsPage() {
  const { departments, sections, students, teams, marks, maps, actions } = useAppData();

  const rows = useMemo(
    () =>
      students.map((s) => ({
        ...s,
        departmentCode: maps.departments[s.departmentId]?.code ?? '-',
        sectionName: maps.sections[s.sectionId]?.name ?? '-',
        teamName: maps.teams[s.teamId]?.name ?? '',
      })),
    [students, maps],
  );

  const fields = [
    { name: 'name', label: 'Student name', required: true, placeholder: 'e.g. Vignesh' },
    { name: 'registerNumber', label: 'Register number', required: true, placeholder: 'e.g. 261CS004', help: 'Must be unique across all students.' },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, options: departments.map((d) => ({ value: d._id, label: `${d.code} - ${d.name}` })) },
    {
      name: 'sectionId',
      label: 'Section',
      type: 'select',
      required: true,
      half: true,
      disabled: (v) => !v.departmentId,
      placeholder: (v) => (v.departmentId ? 'Select section' : 'Select a department first'),
      options: (v) => sections.filter((s) => s.departmentId === v.departmentId).map((s) => ({ value: s._id, label: s.name })),
    },
    {
      name: 'teamId',
      label: 'Team',
      type: 'select',
      disabled: (v) => !v.sectionId,
      placeholder: 'No team',
      options: (v) => teams.filter((t) => t.sectionId === v.sectionId).map((t) => ({ value: t._id, label: `${t.name} (${t.teamNumber})` })),
      help: 'Optional. Only teams in the selected section are listed.',
    },
  ];

  const deriveValues = (next, changed) => {
    const out = {};
    if (changed === 'departmentId' && next.sectionId && maps.sections[next.sectionId]?.departmentId !== next.departmentId) {
      out.sectionId = '';
      out.teamId = '';
    }
    if (changed === 'sectionId' && next.teamId && maps.teams[next.teamId]?.sectionId !== next.sectionId) out.teamId = '';
    return out;
  };

  const validate = (record) => (values) => {
    const errors = {};
    const reg = normalize(values.registerNumber);
    const clash = reg && students.find((s) => s._id !== record?._id && normalize(s.registerNumber) === reg);
    if (clash) errors.registerNumber = `${values.registerNumber.trim().toUpperCase()} is already assigned to ${clash.name}.`;
    if (values.sectionId && maps.sections[values.sectionId]?.departmentId !== values.departmentId)
      errors.sectionId = 'This section belongs to a different department.';
    if (values.teamId && maps.teams[values.teamId]?.sectionId !== values.sectionId)
      errors.teamId = 'This team belongs to a different section.';
    return errors;
  };

  return (
    <ResourcePage
      pageKey="students"
      title="Students"
      description="Every student with their department, section and project team."
      singular="student"
      plural="students"
      emptyIcon="student"
      rows={rows}
      columns={[
        { key: 'name', header: 'Student', sortable: true, render: (r) => (
          <div>
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-xs tabular-nums text-slate-500 md:hidden">{r.registerNumber} · {r.sectionName}</p>
          </div>
        ) },
        { key: 'registerNumber', header: 'Register number', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
        { key: 'departmentCode', header: 'Department', sortable: true, hideBelow: 'lg' },
        { key: 'sectionName', header: 'Section', sortable: true, hideBelow: 'md' },
        { key: 'teamName', header: 'Team', sortable: true, hideBelow: 'sm', render: (r) => r.teamName || <span className="text-slate-400">No team</span> },
      ]}
      initialSort={{ key: 'registerNumber', dir: 'asc' }}
      searchText={(r) => `${r.name} ${r.registerNumber} ${r.teamName}`}
      searchPlaceholder="Search by name, register number or team"
      filters={[
        { id: 'dept', label: 'All departments', options: departments.map((d) => ({ value: d._id, label: d.code })), predicate: (r, v) => r.departmentId === v },
        { id: 'section', label: 'All sections', options: sections.map((s) => ({ value: s._id, label: s.name })), predicate: (r, v) => r.sectionId === v },
        { id: 'team', label: 'All teams', options: [{ value: 'none', label: 'No team' }, ...teams.map((t) => ({ value: t._id, label: t.name }))], predicate: (r, v) => (v === 'none' ? !r.teamId : r.teamId === v) },
      ]}
      rowName={(r) => r.name}
      deleteMessage={(r) => {
        const n = marks.filter((m) => m.studentId === r._id).length;
        return `${r.name} (${r.registerNumber}) will be removed from their team${n ? ` and ${n} evaluation${n === 1 ? '' : 's'} will be deleted with them` : ''}.`;
      }}
      onDelete={(r) => actions.students.remove(r._id)}
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          title={mode === 'add' ? 'Add student' : 'Edit student'}
          fields={fields}
          initialValues={record}
          deriveValues={deriveValues}
          validate={validate(record)}
          submitLabel={mode === 'add' ? 'Add student' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => {
            const data = { name: v.name, registerNumber: v.registerNumber.toUpperCase(), departmentId: v.departmentId, sectionId: v.sectionId, teamId: v.teamId };
            return mode === 'add' ? actions.students.add(data) : actions.students.update(record._id, data);
          }}
        />
      )}
      renderDetail={(r) => {
        const evals = marks.filter((m) => m.studentId === r._id);
        return {
          title: r.name,
          subtitle: r.registerNumber,
          body: (
            <>
              <DetailList
                items={[
                  { label: 'Department', value: maps.departments[r.departmentId]?.name, wide: true },
                  { label: 'Section', value: r.sectionName },
                  { label: 'Team', value: r.teamName || 'No team' },
                ]}
              />
              <DetailSection title="Evaluations" empty="No evaluations recorded yet.">
                {evals.length > 0 && (
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {evals.map((m) => (
                      <li key={m._id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                        <span>
                          <span className="block font-medium text-slate-800">{maps.labs[m.labId]?.name}</span>
                          <span className="text-xs tabular-nums text-slate-500">{m.totalMarks}/{m.maxMarks} ({formatPercent(percent(m.totalMarks, m.maxMarks))})</span>
                        </span>
                        <StatusBadge status={m.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </DetailSection>
            </>
          ),
        };
      }}
    />
  );
}
