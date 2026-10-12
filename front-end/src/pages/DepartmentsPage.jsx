import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import { DetailList, DetailSection, NameList } from '../components/DetailList';
import { normalize, plural } from '../utils/helpers';

const FIELDS = [
  { name: 'name', label: 'Department name', required: true, placeholder: 'e.g. Mechanical Engineering' },
  { name: 'code', label: 'Short code', required: true, half: true, placeholder: 'e.g. MECH', help: 'Shown in tables and filters.' },
];

export default function DepartmentsPage() {
  const { departments, labs, faculty, sections, students, actions } = useAppData();

  const rows = useMemo(
    () =>
      departments.map((d) => ({
        ...d,
        labCount: labs.filter((l) => l.departmentId === d._id).length,
        facultyCount: faculty.filter((f) => f.departmentId === d._id).length,
        sectionCount: sections.filter((s) => s.departmentId === d._id).length,
        studentCount: students.filter((s) => s.departmentId === d._id).length,
      })),
    [departments, labs, faculty, sections, students],
  );

  const columns = [
    {
      key: 'name',
      header: 'Department',
      sortable: true,
      render: (r) => (
        <div>
          <p className="font-medium text-slate-900">{r.name}</p>
          <p className="text-xs text-slate-500 sm:hidden">{r.code}</p>
        </div>
      ),
    },
    { key: 'code', header: 'Code', sortable: true, hideBelow: 'sm', render: (r) => <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{r.code}</span> },
    { key: 'labCount', header: 'Labs', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
    { key: 'facultyCount', header: 'Faculty', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
    { key: 'sectionCount', header: 'Sections', sortable: true, hideBelow: 'lg', className: 'tabular-nums' },
    { key: 'studentCount', header: 'Students', sortable: true, className: 'tabular-nums' },
  ];

  const validate = (record) => (values) => {
    const errors = {};
    const clash = (field) => departments.find((d) => d._id !== record?._id && normalize(d[field]) === normalize(values[field]));
    if (clash('name')) errors.name = 'A department with this name already exists.';
    if (clash('code')) errors.code = `The code ${values.code.trim().toUpperCase()} is already used.`;
    return errors;
  };

  return (
    <ResourcePage
      pageKey="departments"
      title="Departments"
      description="Academic departments with their labs, faculty, sections and students."
      singular="department"
      plural="departments"
      emptyIcon="building"
      rows={rows}
      columns={columns}
      initialSort={{ key: 'name', dir: 'asc' }}
      searchText={(r) => `${r.name} ${r.code}`}
      searchPlaceholder="Search by department name or code"
      rowName={(r) => r.code}
      deleteMessage={(r) => `${r.name} (${r.code}) will be removed. Departments that still have labs, faculty, sections or students can't be deleted.`}
      onDelete={(r) => actions.departments.remove(r._id)}
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          title={mode === 'add' ? 'Add department' : 'Edit department'}
          fields={FIELDS}
          initialValues={record}
          validate={validate(record)}
          submitLabel={mode === 'add' ? 'Add department' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => {
            const data = { name: v.name, code: v.code.toUpperCase() };
            return mode === 'add' ? actions.departments.add(data) : actions.departments.update(record._id, data);
          }}
        />
      )}
      renderDetail={(r) => ({
        title: r.name,
        subtitle: r.code,
        body: (
          <>
            <DetailList
              items={[
                { label: 'Labs', value: r.labCount },
                { label: 'Faculty', value: r.facultyCount },
                { label: 'Sections', value: r.sectionCount },
                { label: 'Students', value: r.studentCount },
              ]}
            />
            <DetailSection title="Labs" empty="No labs yet.">
              {labs.filter((l) => l.departmentId === r._id).length > 0 && (
                <NameList items={labs.filter((l) => l.departmentId === r._id).map((l) => ({ key: l._id, primary: l.name, secondary: l.academicYear }))} />
              )}
            </DetailSection>
            <DetailSection title="Faculty" empty="No faculty yet.">
              {faculty.filter((f) => f.departmentId === r._id).length > 0 && (
                <NameList items={faculty.filter((f) => f.departmentId === r._id).map((f) => ({ key: f._id, primary: f.name }))} />
              )}
            </DetailSection>
            <DetailSection title="Sections" empty="No sections yet.">
              {sections.filter((s) => s.departmentId === r._id).length > 0 && (
                <NameList
                  items={sections
                    .filter((s) => s.departmentId === r._id)
                    .map((s) => ({ key: s._id, primary: s.name, secondary: `Year ${s.year}, semester ${s.semester}, ${plural(students.filter((st) => st.sectionId === s._id).length, 'student')}` }))}
                />
              )}
            </DetailSection>
          </>
        ),
      })}
    />
  );
}
