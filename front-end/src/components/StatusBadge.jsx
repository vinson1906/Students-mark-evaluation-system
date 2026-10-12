import { EVALUATION_STATUS, SUBMISSION_STATUS } from '../constants';

const STYLES = {
  COMPLETED: ['bg-emerald-50 text-emerald-700 ring-emerald-600/20', 'bg-emerald-500'],
  APPROVED: ['bg-emerald-50 text-emerald-700 ring-emerald-600/20', 'bg-emerald-500'],
  PENDING: ['bg-amber-50 text-amber-800 ring-amber-600/20', 'bg-amber-500'],
  NOT_COMPLETED: ['bg-rose-50 text-rose-700 ring-rose-600/20', 'bg-rose-500'],
  REJECTED: ['bg-rose-50 text-rose-700 ring-rose-600/20', 'bg-rose-500'],
  NOT_SUBMITTED: ['bg-slate-100 text-slate-600 ring-slate-500/20', 'bg-slate-400'],
};

/** kind: 'evaluation' (default) or 'submission' (report / project status) */
export default function StatusBadge({ status, kind = 'evaluation' }) {
  const labels = kind === 'submission' ? SUBMISSION_STATUS : EVALUATION_STATUS;
  const [tone, dot] = STYLES[status] || STYLES.NOT_SUBMITTED;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {labels[status] || status}
    </span>
  );
}
