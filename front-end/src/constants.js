// Evaluation criteria. Each is scored out of `max`; six criteria x 10 = 60 marks.
export const CRITERIA = [
  { key: 'practicalExecution', label: 'Practical execution', max: 10 },
  { key: 'htmlUsage', label: 'HTML usage', max: 10 },
  { key: 'jsLogic', label: 'JavaScript logic', max: 10 },
  { key: 'cssResponsiveness', label: 'CSS responsiveness', max: 10 },
  { key: 'viva', label: 'Viva', max: 10 },
  { key: 'documentation', label: 'Documentation', max: 10 },
];

export const EVALUATION_STATUS = {
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  NOT_COMPLETED: 'Not completed',
};

export const SUBMISSION_STATUS = {
  NOT_SUBMITTED: 'Not submitted',
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const toOptions = (map) => Object.entries(map).map(([value, label]) => ({ value, label }));
