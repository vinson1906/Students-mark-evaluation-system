import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import { DetailList, DetailSection, NameList } from '../components/DetailList';
import { formatPercent, percent } from '../utils/helpers';

export default function FacultyPage() {
  const { departments, labs, faculty, marks, maps, actions } = useAppData();

  const rows = useMemo(
    () =>
      faculty.map((f) => ({
        ...f,
        departmentCode: maps.departments[f.departmentId]?.code ?? '-',
        labName: maps.labs[f.labId]?.name ?? '',
        evaluationCount: marks.filter((m) => m.evaluatedBy === f._id).length,
      })),
    [faculty, marks, maps],
  );

  const fields = [
    { name: 'name', label: 'Faculty name', required: true, placeholder: 'e.g. Meena' },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, options: departments.map((d) => ({ value: d._id, label: `${d.code} - ${d.name}` })) },
    {
      name: 'labId',
      label: 'Assigned lab',
      type: 'select',
      required: true,
      half: true,
      disabled: (v) => !v.departmentId,
      placeholder: (v) => (v.departmentId ? 'Select lab' : 'Select a department first'),
      options: (v) => labs.filter((l) => l.departmentId === v.departmentId).map((l) => ({ value: l._id, label: l.name })),
      help: 'Only labs in the selected department are listed.',
    },
  ];

  const deriveValues = (next, changed) => {
    if (changed === 'departmentId' && next.labId && maps.labs[next.labId]?.departmentId !== next.departmentId) return { labId: '' };
    return {};
  };

  const validate = (values) =>
    values.labId && maps.labs[values.labId]?.departmentId !== values.departmentId
      ? { labId: 'This lab belongs to a different department.' }
      : {};

  return (
    <ResourcePage
      pageKey="faculty"
      title="Faculty"
      description="Faculty members, their departments and the labs they evaluate."
      singular="faculty member"
      plural="faculty"
      addLabel="Add faculty"
      emptyIcon="faculty"
      rows={rows}
      columns={[
        { key: 'name', header: 'Name', sortable: true, render: (r) => (
          <div>
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-xs text-slate-500 md:hidden">{r.departmentCode} · {r.labName}</p>
          </div>
        ) },
        { key: 'departmentCode', header: 'Department', sortable: true, hideBelow: 'md' },
        { key: 'labName', header: 'Assigned lab', sortable: true, hideBelow: 'md' },
        { key: 'evaluationCount', header: 'Evaluations', sortable: true, hideBelow: 'sm', className: 'tabular-nums' },
      ]}
      initialSort={{ key: 'name', dir: 'asc' }}
      searchText={(r) => `${r.name} ${r.departmentCode} ${r.labName}`}
      searchPlaceholder="Search by name, department or lab"
      filters={[
        { id: 'dept', label: 'All departments', options: departments.map((d) => ({ value: d._id, label: d.code })), predicate: (r, v) => r.departmentId === v },
        { id: 'lab', label: 'All labs', options: labs.map((l) => ({ value: l._id, label: l.name })), predicate: (r, v) => r.labId === v },
      ]}
      rowName={(r) => r.name}
      deleteMessage={(r) => `${r.name} will be removed. Faculty who have recorded evaluations can't be deleted.`}
      onDelete={(r) => actions.faculty.remove(r._id)}
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          title={mode === 'add' ? 'Add faculty member' : 'Edit faculty member'}
          fields={fields}
          initialValues={record}
          deriveValues={deriveValues}
          validate={validate}
          submitLabel={mode === 'add' ? 'Add faculty' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => {
            const data = { name: v.name, departmentId: v.departmentId, labId: v.labId };
            return mode === 'add' ? actions.faculty.add(data) : actions.faculty.update(record._id, data);
          }}
        />
      )}
      renderDetail={(r) => {
        const evals = marks.filter((m) => m.evaluatedBy === r._id);
        return {
          title: r.name,
          subtitle: maps.departments[r.departmentId]?.name,
          body: (
            <>
              <DetailList
                items={[
                  { label: 'Department', value: r.departmentCode },
                  { label: 'Assigned lab', value: r.labName },
                  { label: 'Evaluations recorded', value: r.evaluationCount },
                ]}
              />
              <DetailSection title="Evaluations" empty="No evaluations recorded yet.">
                {evals.length > 0 && (
                  <NameList items={evals.map((m) => ({ key: m._id, primary: maps.students[m.studentId]?.name, secondary: `${m.totalMarks}/${m.maxMarks} (${formatPercent(percent(m.totalMarks, m.maxMarks))})` }))} />
                )}
              </DetailSection>
            </>
          ),
        };
      }}
    />
  );
}
