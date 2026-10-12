// The six evaluation criteria. Keys match the `criteria` object on each marks record.
export const CRITERIA = [
  { key: 'practicalExecution', label: 'Practical execution', max: 10 },
  { key: 'htmlUsage', label: 'HTML usage', max: 10 },
  { key: 'jsLogic', label: 'JavaScript logic', max: 10 },
  { key: 'cssResponsiveness', label: 'CSS responsiveness', max: 10 },
  { key: 'viva', label: 'Viva', max: 10 },
  { key: 'documentation', label: 'Documentation', max: 10 },
];

export const EVALUATION_STATUSES = ['COMPLETED', 'PENDING', 'NOT_COMPLETED'];
export const SUBMISSION_STATUSES = ['NOT_SUBMITTED', 'PENDING', 'SUBMITTED', 'APPROVED'];
