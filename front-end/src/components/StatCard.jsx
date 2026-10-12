import Icon from './Icon';

export default function StatCard({ label, value, icon, hint, onClick, className = '', children }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon name={icon} size={20} />
        </span>
      </div>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
      {children}
    </>
  );
  const base = `rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm ${className}`;
  return onClick ? (
    <button type="button" onClick={onClick} className={`${base} transition-colors hover:border-blue-300`}>
      {body}
    </button>
  ) : (
    <div className={base}>{body}</div>
  );
}
