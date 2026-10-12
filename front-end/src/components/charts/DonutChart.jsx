/* SVG donut. segments: [{ label, value, stroke (tailwind stroke class), dot (tailwind bg class) }] */
export default function DonutChart({ segments, centerLabel }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 25; // start at 12 o'clock
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 42 42" className="h-full w-full" role="img" aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}>
          <circle cx="21" cy="21" r="15.915" fill="none" strokeWidth="5" className="stroke-slate-100" />
          {total > 0 &&
            segments
              .filter((s) => s.value > 0)
              .map((s) => {
                const length = (s.value / total) * 100;
                const el = (
                  <circle
                    key={s.label}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="none"
                    strokeWidth="5"
                    strokeDasharray={`${length} ${100 - length}`}
                    strokeDashoffset={offset}
                    className={s.stroke}
                  />
                );
                offset -= length;
                return el;
              })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-slate-600">
              <span className={`h-2.5 w-2.5 rounded-sm ${s.dot}`} aria-hidden="true" />
              {s.label}
            </span>
            <span className="font-medium tabular-nums text-slate-900">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
