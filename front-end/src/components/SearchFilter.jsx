import Icon from './Icon';
import Button from './Button';

/*
 * filters: [{ id, label, value, options: [{ value, label }], onChange(value) }]
 */
export default function SearchFilter({ search, onSearchChange, placeholder = 'Search', filters = [], onReset, hasActive, resultCount, total }) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <label htmlFor="table-search" className="sr-only">{placeholder}</label>
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Icon name="search" size={16} />
          </span>
          <input
            id="table-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        {filters.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            {filters.map((f) => (
              <div key={f.id}>
                <label htmlFor={`filter-${f.id}`} className="sr-only">{f.label}</label>
                <select
                  id={`filter-${f.id}`}
                  value={f.value || ''}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-auto"
                >
                  <option value="">{f.label}</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <p className="text-xs text-slate-500" aria-live="polite">
            {resultCount === total ? `${total} total` : `${resultCount} of ${total}`}
          </p>
          <Button variant="secondary" size="sm" icon="reset" onClick={onReset} disabled={!hasActive}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
