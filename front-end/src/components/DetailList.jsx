export function DetailList({ items }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
      {items.map((item) => (
        <div key={item.label} className={item.wide ? 'col-span-2' : ''}>
          <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
          <dd className="mt-0.5 break-words text-sm text-slate-900">{item.value || '-'}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({ title, empty = 'Nothing here yet.', children }) {
  const hasContent = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      {hasContent ? children : <p className="text-sm text-slate-500">{empty}</p>}
    </div>
  );
}

export function NameList({ items }) {
  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
      {items.map((item) => (
        <li key={item.key} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
          <span className="font-medium text-slate-800">{item.primary}</span>
          {item.secondary && <span className="text-slate-500">{item.secondary}</span>}
        </li>
      ))}
    </ul>
  );
}
