const INPUT =
  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

export default function Field({ field, id, value, error, options = [], disabled = false, onChange }) {
  const helpId = field.help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;
  const border = error ? 'border-red-400' : 'border-slate-300';
  const common = { id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': describedBy, disabled };

  let control;
  if (field.type === 'select') {
    control = (
      <select {...common} value={value} onChange={(e) => onChange(field.name, e.target.value)} className={`${INPUT} ${border}`}>
        <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = (
      <textarea {...common} rows={3} value={value} placeholder={field.placeholder} onChange={(e) => onChange(field.name, e.target.value)} className={`${INPUT} ${border}`} />
    );
  } else if (field.type === 'checklist') {
    control = (
      <div
        id={id}
        tabIndex={-1}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`max-h-44 divide-y divide-slate-100 overflow-y-auto rounded-lg border ${border}`}
      >
        {options.length === 0 && <p className="px-3 py-3 text-sm text-slate-500">{field.emptyText || 'No options available.'}</p>}
        {options.map((o) => {
          const checked = value.includes(o.value);
          return (
            <label key={o.value} className="flex cursor-pointer items-start gap-3 px-3 py-2 text-sm hover:bg-slate-50">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(field.name, checked ? value.filter((v) => v !== o.value) : [...value, o.value])}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="text-slate-800">{o.label}</span>
                {o.hint && <span className="block text-xs text-amber-700">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    );
  } else {
    const isNumber = field.type === 'number';
    control = (
      <div className="relative">
        <input
          {...common}
          type={field.type === 'url' ? 'url' : isNumber ? 'number' : 'text'}
          inputMode={isNumber ? 'decimal' : undefined}
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          placeholder={field.placeholder}
          autoComplete="off"
          onChange={(e) => onChange(field.name, e.target.value)}
          className={`${INPUT} ${border} ${field.suffix ? 'pr-12' : ''}`}
        />
        {field.suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">{field.suffix}</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500" aria-hidden="true"> *</span>}
      </label>
      {control}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">{error}</p>
      )}
      {field.help && !error && <p id={helpId} className="mt-1 text-xs text-slate-500">{field.help}</p>}
    </div>
  );
}
