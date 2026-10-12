export const percentOf = (total, max) => (max > 0 ? Math.round((total / max) * 1000) / 10 : 0);
export const formatPercent = (value) => `${value.toFixed(1)}%`;

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const humanize = (value = '') =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

export const countBy = (rows, getKey) =>
  rows.reduce((acc, row) => {
    const key = getKey(row);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
