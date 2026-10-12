import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import { DetailList, DetailSection, NameList } from '../components/DetailList';
import { normalize } from '../utils/helpers';

const YEARS = [1, 2, 3, 4].map((y) => ({ value: String(y), label: `Year ${y}` }));
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: String(s), label: `Semester ${s}` }));

export default function SectionsPage() {
  const { departments, sections, students, teams, maps, actions } = useAppData();

  const rows = useMemo(
    () =>
      sections.map((s) => ({
        ...s,
        departmentCode: maps.departments[s.departmentId]?.code ?? '-',
        studentCount: students.filter((st) => st.sectionId === s._id).length,
      })),
    [sections, students, maps],
  );

  const fields = [
    { name: 'name', label: 'Section name', required: true, half: true, placeholder: 'e.g. CSE-B' },
    { name: 'departmentId', label: 'Department', type: 'select', required: true, half: true, options: departments.map((d) => ({ value: d._id, label: `${d.code} - ${d.name}` })) },
    { name: 'year', label: 'Year', type: 'select', required: true, half: true, options: YEARS },
    { name: 'semester', label: 'Semester', type: 'select', required: true, half: true, options: SEMESTERS },
  ];

  const validate = (record) => (values) => {
    const errors = {};
    if (sections.some((s) => s._id !== record?._id && normalize(s.name) === normalize(values.name))) errors.name = 'A section with this name already exists.';
    const year = Number(values.year);
    const semester = Number(values.semester);
    if (year && semester && ![year * 2 - 1, year * 2].includes(semester))
      errors.semester = `Year ${year} covers semesters ${year * 2 - 1} and ${year * 2}.`;
    return errors;
  };

  return (
    <ResourcePage
      pageKey="sections"
      title="Sections"
      description="Class sections by department, year and semester."
      singular="section"
      plural="sections"
      emptyIcon="layers"
      rows={rows}
      columns={[
        { key: 'name', header: 'Section', sortable: true, render: (r) => (
          <div>
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-xs text-slate-500 md:hidden">{r.departmentCode} · Year {r.year}, sem {r.semester}</p>
          </div>
        ) },
        { key: 'departmentCode', header: 'Department', sortable: true, hideBelow: 'md' },
        { key: 'year', header: 'Year', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
        { key: 'semester', header: 'Semester', sortable: true, hideBelow: 'md', className: 'tabular-nums' },
        { key: 'studentCount', header: 'Students', sortable: true, className: 'tabular-nums' },
      ]}
      initialSort={{ key: 'name', dir: 'asc' }}
      searchText={(r) => `${r.name} ${r.departmentCode}`}
      searchPlaceholder="Search by section or department"
      filters={[
        { id: 'dept', label: 'All departments', options: departments.map((d) => ({ value: d._id, label: d.code })), predicate: (r, v) => r.departmentId === v },
        { id: 'year', label: 'All years', options: YEARS, predicate: (r, v) => String(r.year) === v },
      ]}
      rowName={(r) => r.name}
      deleteMessage={(r) => `${r.name} will be removed. Sections that still have students or teams can't be deleted.`}
      onDelete={(r) => actions.sections.remove(r._id)}
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          title={mode === 'add' ? 'Add section' : 'Edit section'}
          fields={fields}
          initialValues={record}
          validate={validate(record)}
          submitLabel={mode === 'add' ? 'Add section' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => {
            const data = { name: v.name, departmentId: v.departmentId, year: Number(v.year), semester: Number(v.semester) };
            return mode === 'add' ? actions.sections.add(data) : actions.sections.update(record._id, data);
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
                { label: 'Year', value: r.year },
                { label: 'Semester', value: r.semester },
                { label: 'Students', value: r.studentCount },
              ]}
            />
            <DetailSection title="Students" empty="No students in this section yet.">
              {students.filter((s) => s.sectionId === r._id).length > 0 && (
                <NameList items={students.filter((s) => s.sectionId === r._id).map((s) => ({ key: s._id, primary: s.name, secondary: s.registerNumber }))} />
              )}
            </DetailSection>
            <DetailSection title="Teams" empty="No teams in this section yet.">
              {teams.filter((t) => t.sectionId === r._id).length > 0 && (
                <NameList items={teams.filter((t) => t.sectionId === r._id).map((t) => ({ key: t._id, primary: t.name, secondary: t.teamNumber }))} />
              )}
            </DetailSection>
          </>
        ),
      })}
    />
  );
}
