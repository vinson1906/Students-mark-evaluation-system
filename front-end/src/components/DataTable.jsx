import { useMemo, useState } from 'react';
import Icon from './Icon';
import Button from './Button';

// Full class names so Tailwind can see them.
const HIDE = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
};

/*
 * columns: [{ key, header, render(row), sortable, sortValue(row), hideBelow: 'sm'|'md'|'lg'|'xl', className }]
 * Click a sortable header to cycle ascending -> descending -> unsorted.
 */
export default function DataTable({ columns, rows, rowKey = '_id', renderActions, onRowClick, pageSize = 8, initialSort = null, caption }) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue || ((r) => r[sort.key]);
    return [...rows].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  const toggleSort = (key) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={`px-4 py-3 font-medium ${c.hideBelow ? HIDE[c.hideBelow] : ''} ${c.className || ''}`}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={`-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:text-slate-800 ${active ? 'text-blue-700' : ''}`}
                      >
                        {c.header}
                        <Icon name={active ? (sort.dir === 'asc' ? 'chevronUp' : 'chevronDown') : 'sort'} size={14} className={active ? '' : 'opacity-50'} />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
              {renderActions && (
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`hover:bg-slate-50/70 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle text-slate-700 ${c.hideBelow ? HIDE[c.hideBelow] : ''} ${c.className || ''}`}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {renderActions && <td className="px-4 py-3 align-middle">{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <p>
          Showing {sorted.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, sorted.length)} of {sorted.length}
        </p>
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button>
            <span className="tabular-nums">Page {current} of {pageCount}</span>
            <Button variant="secondary" size="sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
