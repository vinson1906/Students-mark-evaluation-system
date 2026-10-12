import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import ResourcePage from '../components/ResourcePage';
import FormModal from '../components/FormModal';
import StatusBadge from '../components/StatusBadge';
import Icon from '../components/Icon';
import { DetailList, DetailSection, NameList } from '../components/DetailList';
import { SUBMISSION_STATUS, toOptions } from '../constants';
import { normalize, shortUrl } from '../utils/helpers';

function GithubLink({ url }) {
  if (!url) return <span className="text-slate-400">No link</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
    >
      <Icon name="github" size={14} />
      <span className="max-w-[180px] truncate">{shortUrl(url)}</span>
      <Icon name="external" size={12} />
    </a>
  );
}

export default function TeamsPage() {
  const { sections, students, teams, maps, actions } = useAppData();

  const rows = useMemo(
    () =>
      teams.map((t) => ({
        ...t,
        sectionName: maps.sections[t.sectionId]?.name ?? '-',
        memberNames: t.members.map((id) => maps.students[id]?.name).filter(Boolean).join(', '),
      })),
    [teams, maps],
  );

  const statusOptions = toOptions(SUBMISSION_STATUS);

  const fields = [
    { name: 'name', label: 'Team name', required: true, half: true, placeholder: 'e.g. Byte Builders' },
    { name: 'teamNumber', label: 'Team number', required: true, half: true, placeholder: 'e.g. TEAM-04' },
    { name: 'sectionId', label: 'Section', type: 'select', required: true, options: sections.map((s) => ({ value: s._id, label: s.name })) },
    {
      name: 'members',
      label: 'Members',
      type: 'checklist',
      emptyText: 'Select a section to see its students.',
      options: (v) =>
        students
          .filter((s) => s.sectionId === v.sectionId)
          .map((s) => ({ value: s._id, label: `${s.name} (${s.registerNumber})` })),
      help: 'Students already in another team move to this one when saved.',
    },
    { type: 'section', label: 'Project' },
    { name: 'projectTitle', label: 'Project title', required: true, placeholder: 'e.g. Library Management System' },
    { name: 'githubUrl', label: 'GitHub link', type: 'url', placeholder: 'https://github.com/your-team/project' },
    { name: 'reportStatus', label: 'Report status', type: 'select', required: true, half: true, options: statusOptions },
    { name: 'projectStatus', label: 'Project status', type: 'select', required: true, half: true, options: statusOptions },
  ];

  const deriveValues = (next, changed) =>
    changed === 'sectionId' ? { members: next.members.filter((id) => maps.students[id]?.sectionId === next.sectionId) } : {};

  const validate = (record) => (values) => {
    const errors = {};
    const clash = (field) => teams.find((t) => t._id !== record?._id && normalize(t[field]) === normalize(values[field]));
    if (clash('name')) errors.name = 'A team with this name already exists.';
    if (clash('teamNumber')) errors.teamNumber = `${values.teamNumber.trim().toUpperCase()} is already used.`;
    return errors;
  };

  return (
    <ResourcePage
      pageKey="teams"
      title="Teams & Projects"
      description="Project teams, their members and where each report and project stands."
      singular="team"
      plural="teams"
      emptyIcon="users"
      rows={rows}
      columns={[
        { key: 'name', header: 'Team', sortable: true, render: (r) => (
          <div>
            <p className="font-medium text-slate-900">{r.name}</p>
            <p className="text-xs text-slate-500">{r.teamNumber} · {r.sectionName}</p>
          </div>
        ) },
        { key: 'memberNames', header: 'Members', hideBelow: 'lg', render: (r) => <span className="text-slate-600">{r.memberNames || 'No members'}</span> },
        { key: 'projectTitle', header: 'Project', sortable: true, hideBelow: 'md', render: (r) => (
          <div>
            <p className="text-slate-900">{r.projectTitle}</p>
            <div className="text-xs"><GithubLink url={r.githubUrl} /></div>
          </div>
        ) },
        { key: 'reportStatus', header: 'Report', sortable: true, sortValue: (r) => SUBMISSION_STATUS[r.reportStatus], hideBelow: 'sm', render: (r) => <StatusBadge status={r.reportStatus} kind="submission" /> },
        { key: 'projectStatus', header: 'Project status', sortable: true, sortValue: (r) => SUBMISSION_STATUS[r.projectStatus], render: (r) => <StatusBadge status={r.projectStatus} kind="submission" /> },
      ]}
      initialSort={{ key: 'name', dir: 'asc' }}
      searchText={(r) => `${r.name} ${r.teamNumber} ${r.projectTitle} ${r.memberNames} ${r.sectionName}`}
      searchPlaceholder="Search by team, member or project"
      filters={[
        { id: 'section', label: 'All sections', options: sections.map((s) => ({ value: s._id, label: s.name })), predicate: (r, v) => r.sectionId === v },
        { id: 'report', label: 'Any report status', options: statusOptions, predicate: (r, v) => r.reportStatus === v },
        { id: 'project', label: 'Any project status', options: statusOptions, predicate: (r, v) => r.projectStatus === v },
      ]}
      rowName={(r) => r.name}
      deleteMessage={(r) => `${r.name} will be removed and its ${r.members.length} member${r.members.length === 1 ? '' : 's'} will be left without a team.`}
      onDelete={(r) => actions.teams.remove(r._id)}
      renderForm={({ mode, record, onClose }) => (
        <FormModal
          size="lg"
          title={mode === 'add' ? 'Add team' : 'Edit team'}
          fields={fields}
          initialValues={mode === 'add' ? { reportStatus: 'NOT_SUBMITTED', projectStatus: 'NOT_SUBMITTED' } : record}
          deriveValues={deriveValues}
          validate={validate(record)}
          submitLabel={mode === 'add' ? 'Add team' : 'Save changes'}
          onClose={onClose}
          onSubmit={(v) => {
            const data = {
              name: v.name,
              teamNumber: v.teamNumber.toUpperCase(),
              sectionId: v.sectionId,
              members: v.members,
              projectTitle: v.projectTitle,
              githubUrl: v.githubUrl,
              reportStatus: v.reportStatus,
              projectStatus: v.projectStatus,
            };
            return mode === 'add' ? actions.teams.add(data) : actions.teams.update(record._id, data);
          }}
        />
      )}
      renderDetail={(r) => ({
        title: r.name,
        subtitle: `${r.teamNumber} · ${r.sectionName}`,
        body: (
          <>
            <DetailList
              items={[
                { label: 'Project title', value: r.projectTitle, wide: true },
                { label: 'GitHub', value: <GithubLink url={r.githubUrl} />, wide: true },
                { label: 'Report status', value: <StatusBadge status={r.reportStatus} kind="submission" /> },
                { label: 'Project status', value: <StatusBadge status={r.projectStatus} kind="submission" /> },
              ]}
            />
            <DetailSection title={`Members (${r.members.length})`} empty="No members yet.">
              {r.members.length > 0 && (
                <NameList items={r.members.map((id) => ({ key: id, primary: maps.students[id]?.name, secondary: maps.students[id]?.registerNumber }))} />
              )}
            </DetailSection>
          </>
        ),
      })}
    />
  );
}
