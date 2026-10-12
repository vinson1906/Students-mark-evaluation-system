import Icon from './Icon';

const BASE = 'rounded-md p-1.5 text-slate-500 transition-colors';

export default function RowActions({ label, onView, onEdit, onDelete, extra }) {
  return (
    <div className="flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
      {extra}
      {onView && (
        <button type="button" onClick={onView} aria-label={`View ${label}`} title="View" className={`${BASE} hover:bg-blue-50 hover:text-blue-600`}>
          <Icon name="eye" size={16} />
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} aria-label={`Edit ${label}`} title="Edit" className={`${BASE} hover:bg-blue-50 hover:text-blue-600`}>
          <Icon name="pencil" size={16} />
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} aria-label={`Delete ${label}`} title="Delete" className={`${BASE} hover:bg-red-50 hover:text-red-600`}>
          <Icon name="trash" size={16} />
        </button>
      )}
    </div>
  );
}
