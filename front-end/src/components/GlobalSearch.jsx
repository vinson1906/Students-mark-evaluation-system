import { useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { useAppData } from '../context/AppDataContext';
import { useRoute } from '../context/RouterContext';
import { useClickOutside } from '../hooks/useClickOutside';
import { normalize } from '../utils/helpers';

export default function GlobalSearch() {
  const { departments, labs, faculty, sections, students, teams, maps, setPendingAction } = useAppData();
  const { navigate } = useRoute();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    const match = (...parts) => parts.some((p) => normalize(p).includes(q));
    const out = [];
    const add = (page, type, list, label, sub, test) =>
      list.filter(test).slice(0, 3).forEach((r) => out.push({ key: `${type}-${r._id}`, page, type, id: r._id, label: label(r), sub: sub(r) }));

    add('students', 'Student', students, (s) => s.name, (s) => s.registerNumber, (s) => match(s.name, s.registerNumber));
    add('teams', 'Team', teams, (t) => t.name, (t) => t.projectTitle, (t) => match(t.name, t.teamNumber, t.projectTitle));
    add('faculty', 'Faculty', faculty, (f) => f.name, (f) => maps.labs[f.labId]?.name, (f) => match(f.name));
    add('labs', 'Lab', labs, (l) => l.name, (l) => maps.departments[l.departmentId]?.code, (l) => match(l.name));
    add('departments', 'Department', departments, (d) => d.code, (d) => d.name, (d) => match(d.name, d.code));
    add('sections', 'Section', sections, (s) => s.name, (s) => maps.departments[s.departmentId]?.code, (s) => match(s.name));
    return out;
  }, [query, departments, labs, faculty, sections, students, teams, maps]);

  const choose = (r) => {
    setPendingAction({ page: r.page, action: 'view', id: r.id });
    navigate(r.page);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <label htmlFor="global-search" className="sr-only">Search students, teams, faculty, labs and more</label>
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
        <Icon name="search" size={16} />
      </span>
      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search students, teams, labs..."
        autoComplete="off"
        className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      {open && normalize(query).length >= 2 && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-slate-500">No matches for "{query.trim()}".</p>
          ) : (
            results.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => choose(r)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900">{r.label}</span>
                  {r.sub && <span className="block truncate text-xs text-slate-500">{r.sub}</span>}
                </span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{r.type}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
