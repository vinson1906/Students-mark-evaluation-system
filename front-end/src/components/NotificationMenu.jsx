import { useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { useAppData } from '../context/AppDataContext';
import { useRoute } from '../context/RouterContext';
import { useClickOutside } from '../hooks/useClickOutside';
import { plural } from '../utils/helpers';

export default function NotificationMenu() {
  const { marks, teams } = useAppData();
  const { navigate } = useRoute();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const items = useMemo(() => {
    const open_ = marks.filter((m) => m.status !== 'COMPLETED').length;
    const noReport = teams.filter((t) => t.reportStatus === 'NOT_SUBMITTED').length;
    const noProject = teams.filter((t) => t.projectStatus === 'NOT_SUBMITTED').length;
    return [
      { key: 'evals', count: open_, page: 'marks', text: `${plural(open_, 'evaluation')} still pending or incomplete` },
      { key: 'reports', count: noReport, page: 'teams', text: `${plural(noReport, 'team')} ${noReport === 1 ? 'has' : 'have'} not submitted a report` },
      { key: 'projects', count: noProject, page: 'teams', text: `${plural(noProject, 'team')} ${noProject === 1 ? 'has' : 'have'} not submitted a project` },
    ].filter((i) => i.count > 0);
  }, [marks, teams]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${items.length ? `, ${items.length} new` : ''}`}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Icon name="bell" size={20} />
        {items.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <p className="px-3 py-2 text-sm font-semibold text-slate-900">Needs attention</p>
          {items.length === 0 ? (
            <p className="px-3 pb-3 text-sm text-slate-500">You're all caught up.</p>
          ) : (
            items.map((i) => (
              <button
                key={i.key}
                type="button"
                onClick={() => {
                  navigate(i.page);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="mt-0.5 text-amber-600"><Icon name="alert" size={16} /></span>
                {i.text}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
