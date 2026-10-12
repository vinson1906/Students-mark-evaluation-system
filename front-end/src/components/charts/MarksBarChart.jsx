import { EVALUATION_STATUS } from '../../constants';

const BAR_COLOR = { COMPLETED: 'bg-blue-600', PENDING: 'bg-amber-400', NOT_COMPLETED: 'bg-rose-400' };

/* CSS bar chart. data: [{ id, label, value, max, status }] */
export default function MarksBarChart({ data, max }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f * 10) / 10);
  const minWidth = Math.max(data.length * 72, 240);

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative mt-6 h-52 w-7 shrink-0 text-right text-xs tabular-nums text-slate-400" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(t / max) * 100}%` }}>{t}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <div style={{ minWidth }}>
            <div className="relative mt-6 h-52">
              {ticks.map((t) => (
                <div key={t} className="absolute inset-x-0 border-t border-dashed border-slate-200" style={{ bottom: `${(t / max) * 100}%` }} aria-hidden="true" />
              ))}
              <div className="absolute inset-0 flex items-end justify-around gap-3 px-2">
                {data.map((d) => (
                  <div key={d.id} className="flex h-full min-w-0 flex-1 items-end justify-center">
                    <div
                      className={`relative w-full max-w-[44px] rounded-t-md ${BAR_COLOR[d.status] || 'bg-slate-300'}`}
                      style={{ height: `${Math.max((d.value / max) * 100, 1)}%` }}
                      role="img"
                      aria-label={`${d.label}: ${d.value} out of ${d.max}, ${EVALUATION_STATUS[d.status]}`}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium tabular-nums text-slate-700">{d.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-around gap-3 px-2">
              {data.map((d) => (
                <p key={d.id} className="min-w-0 flex-1 truncate text-center text-xs text-slate-600" title={d.label}>{d.label}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {Object.entries(EVALUATION_STATUS).map(([key, label]) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${BAR_COLOR[key]}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
