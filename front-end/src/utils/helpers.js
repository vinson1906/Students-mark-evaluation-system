import { CRITERIA } from '../constants';

export const normalize = (value) => String(value ?? '').trim().toLowerCase();

/** Percentage rounded to one decimal place. */
export const percent = (value, max) => (max > 0 ? Math.round((value / max) * 1000) / 10 : 0);

export const formatPercent = (n) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`;

export const sumCriteria = (criteria) =>
  CRITERIA.reduce((sum, c) => sum + (Number(criteria?.[c.key]) || 0), 0);

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatDate = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

export const shortUrl = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
