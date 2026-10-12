import { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { normalize } from '../utils/helpers';
import PageHeader from './PageHeader';
import Button from './Button';
import SearchFilter from './SearchFilter';
import DataTable from './DataTable';
import RowActions from './RowActions';
import EmptyState from './EmptyState';
import Drawer from './Drawer';
import ConfirmDialog from './ConfirmDialog';

/*
 * Shared list page used by every CRUD screen: header, search + filters, sortable table,
 * view drawer, add/edit form (supplied by the page) and delete confirmation.
 *
 * Props
 *  pageKey, title, description, singular, plural
 *  rows                      array of records (may be enriched with derived fields)
 *  columns                   DataTable columns
 *  searchText(row)           string searched by the search box
 *  filters                   [{ id, label, options, predicate(row, value) }]
 *  renderForm({mode, record, onClose})
 *  renderDetail(record)      -> { title, subtitle, body }
 *  onDelete(record)
 *  deleteMessage(record)
 *  rowName(record)           accessible label for row buttons
 *  renderRowExtra(row)       extra action buttons
 *  summary                   node shown above the filters
 */
export default function ResourcePage({
  pageKey,
  title,
  description,
  singular,
  plural,
  rows,
  columns,
  searchText,
  searchPlaceholder,
  filters = [],
  allowAdd = true,
  allowEdit = true,
  allowDelete = true,
  addLabel,
  renderForm,
  renderDetail,
  onDelete,
  deleteMessage,
  rowName,
  renderRowExtra,
  summary,
  initialSort,
  emptyIcon = 'inbox',
}) {
  const { pendingAction, setPendingAction } = useAppData();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [form, setForm] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // One-shot actions requested from elsewhere (quick actions, global search).
  useEffect(() => {
    if (pendingAction?.page !== pageKey) return;
    if (pendingAction.action === 'add' && allowAdd) setForm({ mode: 'add' });
    if (pendingAction.action === 'view') setViewingId(pendingAction.id);
    setPendingAction(null);
  }, [pendingAction, pageKey, allowAdd, setPendingAction]);

  const query = normalize(search);
  const filtered = rows.filter(
    (row) =>
      (!query || normalize(searchText(row)).includes(query)) &&
      filters.every((f) => {
        const value = filterValues[f.id];
        return !value || f.predicate(row, value);
      }),
  );
  const hasActive = Boolean(query) || Object.values(filterValues).some(Boolean);
  const reset = () => {
    setSearch('');
    setFilterValues({});
  };

  const viewing = viewingId ? rows.find((r) => r._id === viewingId) : null;
  const detail = viewing ? renderDetail(viewing) : null;

  const openEdit = (record) => {
    setViewingId(null);
    setForm({ mode: 'edit', record });
  };
  const openDelete = (record) => {
    setViewingId(null);
    setDeleting(record);
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          allowAdd && (
            <Button icon="plus" onClick={() => setForm({ mode: 'add' })}>
              {addLabel || `Add ${singular}`}
            </Button>
          )
        }
      />

      {summary}

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder={searchPlaceholder || `Search ${plural}`}
        filters={filters.map((f) => ({
          id: f.id,
          label: f.label,
          options: f.options,
          value: filterValues[f.id] || '',
          onChange: (value) => setFilterValues((prev) => ({ ...prev, [f.id]: value })),
        }))}
        hasActive={hasActive}
        onReset={reset}
        resultCount={filtered.length}
        total={rows.length}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={`No ${plural} yet`}
          description={`Add your first ${singular} to see it here.`}
          action={allowAdd && <Button icon="plus" onClick={() => setForm({ mode: 'add' })}>{addLabel || `Add ${singular}`}</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title={`No ${plural} match your search`}
          description="Try a different search term or clear the filters."
          action={<Button variant="secondary" icon="reset" onClick={reset}>Reset search and filters</Button>}
        />
      ) : (
        <DataTable
          caption={title}
          columns={columns}
          rows={filtered}
          initialSort={initialSort}
          onRowClick={(row) => setViewingId(row._id)}
          renderActions={(row) => (
            <RowActions
              label={rowName(row)}
              extra={renderRowExtra?.(row)}
              onView={() => setViewingId(row._id)}
              onEdit={allowEdit ? () => openEdit(row) : undefined}
              onDelete={allowDelete ? () => openDelete(row) : undefined}
            />
          )}
        />
      )}

      {form && renderForm({ mode: form.mode, record: form.record, onClose: () => setForm(null) })}

      {detail && (
        <Drawer
          title={detail.title}
          subtitle={detail.subtitle}
          onClose={() => setViewingId(null)}
          footer={
            <>
              {allowDelete && <Button variant="secondary" icon="trash" onClick={() => openDelete(viewing)}>Delete</Button>}
              {allowEdit && <Button icon="pencil" onClick={() => openEdit(viewing)}>Edit {singular}</Button>}
            </>
          }
        >
          {detail.body}
        </Drawer>
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${singular}?`}
          message={deleteMessage(deleting)}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onDelete(deleting);
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
