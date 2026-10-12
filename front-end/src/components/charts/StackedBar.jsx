/* Single stacked horizontal bar with legend. segments: [{ label, value, bar (bg class) }] */
export default function StackedBar({ title, segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">{total} teams</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${title}: ${segments.map((s) => `${s.value} ${s.label}`).join(', ')}`}>
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div key={s.label} className={s.bar} style={{ width: `${(s.value / total) * 100}%` }} title={`${s.label}: ${s.value}`} />
          ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${s.bar}`} aria-hidden="true" />
            {s.label} <span className="font-medium tabular-nums text-slate-900">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
