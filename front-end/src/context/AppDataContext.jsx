import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { dataService, generateObjectId } from '../services/dataService';
import { useToast } from './ToastContext';
import { CRITERIA } from '../constants';
import { plural, sumCriteria, todayISO } from '../utils/helpers';

const AppDataContext = createContext(null);

const indexById = (list) => Object.fromEntries(list.map((item) => [item._id, item]));

/** Make `members` the exact member list of a team, keeping students, other teams and marks in sync. */
function applyTeamMembers(db, teamId, members) {
  const memberSet = new Set(members);
  return {
    ...db,
    teams: db.teams.map((t) =>
      t._id === teamId ? { ...t, members: [...members] } : { ...t, members: t.members.filter((m) => !memberSet.has(m)) },
    ),
    students: db.students.map((s) => (memberSet.has(s._id) ? { ...s, teamId } : s.teamId === teamId ? { ...s, teamId: '' } : s)),
    marks: db.marks.map((m) => (memberSet.has(m.studentId) ? { ...m, teamId } : m.teamId === teamId ? { ...m, teamId: '' } : m)),
  };
}

/** Move one student into a team (or out of all teams when teamId is empty). */
function applyStudentTeam(db, studentId, teamId) {
  return {
    ...db,
    teams: db.teams.map((t) => {
      const others = t.members.filter((m) => m !== studentId);
      return t._id === teamId ? { ...t, members: [...others, studentId] } : { ...t, members: others };
    }),
    students: db.students.map((s) => (s._id === studentId ? { ...s, teamId: teamId || '' } : s)),
    marks: db.marks.map((m) => (m.studentId === studentId ? { ...m, teamId: teamId || '' } : m)),
  };
}

/** Turn flat form values into an evaluation record (criteria nested, total derived). */
function buildEvaluation(db, values) {
  const criteria = Object.fromEntries(CRITERIA.map((c) => [c.key, Number(values[c.key])]));
  const student = db.students.find((s) => s._id === values.studentId);
  const lab = db.labs.find((l) => l._id === values.labId);
  return {
    studentId: values.studentId,
    teamId: student?.teamId || '',
    labId: values.labId,
    evaluatedBy: values.evaluatedBy,
    criteria,
    totalMarks: sumCriteria(criteria),
    maxMarks: lab?.maxMarks ?? 60,
    status: values.status,
    evaluatedOn: todayISO(),
  };
}

export function AppDataProvider({ children }) {
  const toast = useToast();
  const [db, setDb] = useState(() => dataService.loadAll());
  const [pendingAction, setPendingAction] = useState(null);

  const dbRef = useRef(db);
  dbRef.current = db;

  const maps = useMemo(
    () => ({
      departments: indexById(db.departments),
      labs: indexById(db.labs),
      faculty: indexById(db.faculty),
      sections: indexById(db.sections),
      students: indexById(db.students),
      teams: indexById(db.teams),
      marks: indexById(db.marks),
    }),
    [db],
  );

  const actions = useMemo(() => {
    const current = () => dbRef.current;

    // Generic local-state helpers. Replace these with API calls when the backend exists.
    const insert = (collection, values) => {
      const record = { _id: generateObjectId(), ...values };
      setDb((p) => ({ ...p, [collection]: [...p[collection], record] }));
      return record;
    };
    const patch = (collection, id, values) =>
      setDb((p) => ({ ...p, [collection]: p[collection].map((r) => (r._id === id ? { ...r, ...values } : r)) }));
    const drop = (collection, id) => setDb((p) => ({ ...p, [collection]: p[collection].filter((r) => r._id !== id) }));

    const crud = (collection, singular, nameOf, dependents) => ({
      add: (values) => {
        const record = insert(collection, values);
        toast.success(`${singular} "${nameOf(record)}" added.`);
        return record;
      },
      update: (id, values) => {
        patch(collection, id, values);
        toast.success(`${singular} "${nameOf(values)}" updated.`);
      },
      remove: (id) => {
        const record = current()[collection].find((r) => r._id === id);
        if (!record) return;
        if (dependents) {
          const blockers = dependents(current(), id).filter(([, n]) => n > 0);
          if (blockers.length) {
            toast.error(
              `Can't delete ${singular.toLowerCase()} "${nameOf(record)}" yet. It still has ${blockers
                .map(([word, n]) => plural(n, word))
                .join(', ')}. Remove or reassign them first.`,
            );
            return;
          }
        }
        drop(collection, id);
        toast.success(`${singular} "${nameOf(record)}" deleted.`);
      },
    });

    return {
      departments: crud('departments', 'Department', (r) => r.code, (db, id) => [
        ['lab', db.labs.filter((l) => l.departmentId === id).length],
        ['faculty member', db.faculty.filter((f) => f.departmentId === id).length],
        ['section', db.sections.filter((s) => s.departmentId === id).length],
        ['student', db.students.filter((s) => s.departmentId === id).length],
      ]),

      labs: crud('labs', 'Lab', (r) => r.name, (db, id) => [
        ['faculty member', db.faculty.filter((f) => f.labId === id).length],
        ['evaluation', db.marks.filter((m) => m.labId === id).length],
      ]),

      faculty: crud('faculty', 'Faculty member', (r) => r.name, (db, id) => [
        ['evaluation', db.marks.filter((m) => m.evaluatedBy === id).length],
      ]),

      sections: crud('sections', 'Section', (r) => r.name, (db, id) => [
        ['student', db.students.filter((s) => s.sectionId === id).length],
        ['team', db.teams.filter((t) => t.sectionId === id).length],
      ]),

      students: {
        add: (values) => {
          const { teamId, ...rest } = values;
          const record = { _id: generateObjectId(), ...rest, teamId: teamId || '' };
          setDb((p) => applyStudentTeam({ ...p, students: [...p.students, record] }, record._id, record.teamId));
          toast.success(`Student "${record.name}" added.`);
        },
        update: (id, values) => {
          const { teamId, ...rest } = values;
          setDb((p) =>
            applyStudentTeam({ ...p, students: p.students.map((s) => (s._id === id ? { ...s, ...rest } : s)) }, id, teamId || ''),
          );
          toast.success(`Student "${values.name}" updated.`);
        },
        remove: (id) => {
          const student = current().students.find((s) => s._id === id);
          if (!student) return;
          const evaluations = current().marks.filter((m) => m.studentId === id).length;
          setDb((p) => ({
            ...p,
            students: p.students.filter((s) => s._id !== id),
            marks: p.marks.filter((m) => m.studentId !== id),
            teams: p.teams.map((t) => ({ ...t, members: t.members.filter((m) => m !== id) })),
          }));
          toast.success(
            `Student "${student.name}" deleted${evaluations ? ` along with ${plural(evaluations, 'evaluation')}` : ''}.`,
          );
        },
      },

      teams: {
        add: (values) => {
          const { members, ...rest } = values;
          const record = { _id: generateObjectId(), ...rest, members: [] };
          setDb((p) => applyTeamMembers({ ...p, teams: [...p.teams, record] }, record._id, members));
          toast.success(`Team "${record.name}" added.`);
        },
        update: (id, values) => {
          const { members, ...rest } = values;
          setDb((p) => applyTeamMembers({ ...p, teams: p.teams.map((t) => (t._id === id ? { ...t, ...rest } : t)) }, id, members));
          toast.success(`Team "${values.name}" updated.`);
        },
        remove: (id) => {
          const team = current().teams.find((t) => t._id === id);
          if (!team) return;
          setDb((p) => ({
            ...p,
            teams: p.teams.filter((t) => t._id !== id),
            students: p.students.map((s) => (s.teamId === id ? { ...s, teamId: '' } : s)),
            marks: p.marks.map((m) => (m.teamId === id ? { ...m, teamId: '' } : m)),
          }));
          toast.success(`Team "${team.name}" deleted. Its members are now unassigned.`);
        },
      },

      marks: {
        add: (values) => {
          const id = generateObjectId();
          setDb((p) => ({ ...p, marks: [...p.marks, { _id: id, ...buildEvaluation(p, values) }] }));
          const student = current().students.find((s) => s._id === values.studentId);
          toast.success(`Evaluation saved for ${student?.name ?? 'student'}.`);
        },
        update: (id, values) => {
          setDb((p) => ({ ...p, marks: p.marks.map((m) => (m._id === id ? { ...m, ...buildEvaluation(p, values) } : m)) }));
          const student = current().students.find((s) => s._id === values.studentId);
          toast.success(`Evaluation for ${student?.name ?? 'student'} updated.`);
        },
        setStatus: (id, status) => {
          patch('marks', id, { status });
          toast.success('Evaluation marked as completed.');
        },
        remove: (id) => {
          drop('marks', id);
          toast.success('Evaluation deleted.');
        },
      },
    };
  }, [toast]);

  const value = useMemo(
    () => ({ ...db, maps, actions, pendingAction, setPendingAction }),
    [db, maps, actions, pendingAction],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useAppData = () => useContext(AppDataContext);
