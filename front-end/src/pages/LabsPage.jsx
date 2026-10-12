import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import { DetailList, DetailSection, NameList } from '../components/DetailList';
import { normalize, plural } from '../utils/helpers';

export default function LabsPage() {
  const { departments, labs, faculty, marks, maps, actions } = useAppData();

  const rows = useMemo(
    () =>
      labs.map((l) => {
        const staff = faculty.filter((f) => f.labId === l._id);
        return {
          ...l,
          departmentCode: maps.departments[l.departmentId]?.code ?? '-',
          facultyNames: staff.map((f) => f.name).join(', '),
          evaluationCount: marks.filter((m) => m.labId === l._id).length,
        };
      }),
    [labs, faculty, marks, maps],
  );

  const deptOptions = departments.map((d) => ({ value: d._id, label: `${d.code} - ${d.name}` }));
  const years = [...new Set(labs.map((l) => l.academicYear))].sort().map((y) => ({ value: y, label: y }));

  const fields = [
    { name: 'name', label: 'Lab name', required: true, placeholder: 'e.g. Database Systems Lab' },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, options: deptOptions },
    { name: 'academicYear', label: 'Academic year', required: true, half: true, placeholder: '2026-2027' },
    { name: 'maxMarks', label: 'Maximum marks', type: 'number', required: true, half: true, min: 1, max: 100, step: 1, placeholder: '60' },
  ];

  const validate = (record) => (values) => {
    const errors = {};
    const match = /^(\d{4})-(\d{4})$/.exec(values.academicYear.trim());
    if (values.academicYear.trim() && (!match || Number(match[2]) !== Number(match[1]) + 1))
      errors.academicYear = 'Use the format 2026-2027 (consecutive years).';
    const clash = labs.some(
      (l) => l._id !== record?._id && l.departmentId === values.departmentId && normalize(l.name) === normalize(values.name),
    );
    if (clash) errors.name = 'This department already has a lab with that name.';
    return errors;
  };

  return (
    <ResourcePage
      pageKey="labs"
      title="Labs"
      description="Lab courses by department and academic year, with the faculty assigned to each."
      singular="lab"
      plural="labs"
      emptyIcon="flask"
      rows={rows}
      columns={[
        { key: 'name', header: 'Lab', sortable: true, render: (r) => (
          <div>
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-xs text-slate-500 md:hidden">{r.departmentCode} · {r.academicYear}</p>
          </div>
        ) },
        { key: 'departmentCode', header: 'Department', sortable: true, hideBelow: 'md' },
        { key: 'academicYear', header: 'Academic year', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
        { key: 'maxMarks', header: 'Max marks', sortable: true, className: 'tabular-nums' },
        { key: 'facultyNames', header: 'Faculty', sortable: true, hideBelow: 'lg', render: (r) => r.facultyNames || <span className="text-slate-400">Unassigned</span> },
      ]}
      initialSort={{ key: 'name', dir: 'asc' }}
      searchText={(r) => `${r.name} ${r.departmentCode} ${r.academicYear} ${r.facultyNames}`}
      searchPlaceholder="Search by lab, department or faculty"
      filters={[
        { id: 'dept', label: 'All departments', options: departments.map((d) => ({ value: d._id, label: d.code })), predicate: (r, v) => r.departmentId === v },
        { id: 'year', label: 'All academic years', options: years, predicate: (r, v) => r.academicYear === v },
      ]}
      rowName={(r) => r.name}
      deleteMessage={(r) => `${r.name} will be removed. Labs that still have faculty assigned or evaluations recorded can't be deleted.`}
      onDelete={(r) => actions.labs.remove(r._id)}
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          title={mode === 'add' ? 'Add lab' : 'Edit lab'}
          fields={fields}
          initialValues={mode === 'add' ? { academicYear: years[years.length - 1]?.value || '', maxMarks: 60 } : record}
          validate={validate(record)}
          submitLabel={mode === 'add' ? 'Add lab' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => {
            const data = { name: v.name, departmentId: v.departmentId, academicYear: v.academicYear, maxMarks: Number(v.maxMarks) };
            return mode === 'add' ? actions.labs.add(data) : actions.labs.update(record._id, data);
          }}
        />
      )}
      renderDetail={(r) => ({
        title: r.name,
        subtitle: maps.departments[r.departmentId]?.name,
        body: (
          <>
            <DetailList
              items={[
                { label: 'Department', value: r.departmentCode },
                { label: 'Academic year', value: r.academicYear },
                { label: 'Maximum marks', value: r.maxMarks },
                { label: 'Evaluations recorded', value: r.evaluationCount },
              ]}
            />
            <DetailSection title="Faculty" empty="No faculty assigned yet.">
              {faculty.filter((f) => f.labId === r._id).length > 0 && (
                <NameList items={faculty.filter((f) => f.labId === r._id).map((f) => ({ key: f._id, primary: f.name, secondary: plural(marks.filter((m) => m.evaluatedBy === f._id).length, 'evaluation') }))} />
              )}
            </DetailSection>
          </>
        ),
      })}
    />
  );
}
