import { useId, useRef, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Field from './Field';

/*
 * Config-driven form in a modal.
 *
 * fields: [{ name, label, type: text|number|url|select|textarea|checklist|section, required, half,
 *            options (array or (values) => array), placeholder, help, suffix, min, max, step,
 *            disabled (bool or (values) => bool) }]
 * validate(values)      -> { fieldName: 'message' }   extra rules (duplicates, relationships)
 * deriveValues(next, changedName, prev) -> partial values to merge (dependent dropdowns)
 * renderExtra(values)   -> node rendered under the fields (e.g. live totals)
 * onSubmit(values)      -> called once validation passes; the modal closes afterwards
 */

function buildInitial(fields, initial) {
  const values = {};
  fields.forEach((f) => {
    if (f.type === 'section') return;
    const raw = initial?.[f.name];
    values[f.name] = f.type === 'checklist' ? [...(raw || [])] : raw == null ? '' : String(raw);
  });
  return values;
}

function runValidation(fields, values, validate) {
  const errors = {};
  fields.forEach((f) => {
    if (f.type === 'section') return;
    const v = values[f.name];
    const empty = f.type === 'checklist' ? v.length === 0 : String(v).trim() === '';
    if (empty) {
      if (f.required) errors[f.name] = f.type === 'select' ? `Select a ${f.label.toLowerCase()}.` : `${f.label} is required.`;
      return;
    }
    if (f.type === 'number') {
      const n = Number(v);
      if (Number.isNaN(n)) errors[f.name] = `${f.label} must be a number.`;
      else if ((f.min != null && n < f.min) || (f.max != null && n > f.max))
        errors[f.name] = `${f.label} must be between ${f.min ?? '-∞'} and ${f.max ?? '∞'}.`;
      else if (f.step && (n / f.step) % 1 !== 0) errors[f.name] = `${f.label} must be a multiple of ${f.step}.`;
    }
    if (f.type === 'url') {
      try {
        const url = new URL(v);
        if (!/^https?:$/.test(url.protocol)) throw new Error('protocol');
      } catch {
        errors[f.name] = 'Enter a full link starting with https://';
      }
    }
  });
  const custom = validate ? validate(values) || {} : {};
  return { ...custom, ...errors };
}

export default function FormModal({
  title,
  description,
  fields,
  initialValues,
  validate,
  deriveValues,
  renderExtra,
  onSubmit,
  onClose,
  submitLabel = 'Save changes',
  size = 'md',
}) {
  const formId = useId();
  const formRef = useRef(null);
  const [values, setValues] = useState(() => buildInitial(fields, initialValues));
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => {
      let next = { ...prev, [name]: value };
      if (deriveValues) next = { ...next, ...deriveValues(next, name, prev) };
      return next;
    });
    if (errors[name]) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== name)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = runValidation(fields, values, validate);
    if (Object.keys(found).length) {
      setErrors(found);
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    const cleaned = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    onSubmit(cleaned);
    onClose();
  };

  const errorCount = Object.keys(errors).length;

  return (
    <Modal
      title={title}
      description={description}
      size={size}
      onClose={onClose}
      closeOnBackdrop={false}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>{submitLabel}</Button>
        </>
      }
    >
      <form id={formId} ref={formRef} onSubmit={handleSubmit} noValidate>
        {errorCount > 0 && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorCount === 1 ? 'Fix 1 field to continue.' : `Fix ${errorCount} fields to continue.`}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            if (f.type === 'section') {
              return (
                <div key={f.label} className="border-t border-slate-100 pt-4 sm:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-900">{f.label}</h3>
                  {f.help && <p className="text-xs text-slate-500">{f.help}</p>}
                </div>
              );
            }
            const options = typeof f.options === 'function' ? f.options(values) : f.options || [];
            const disabled = typeof f.disabled === 'function' ? f.disabled(values) : Boolean(f.disabled);
            const placeholder = typeof f.placeholder === 'function' ? f.placeholder(values) : f.placeholder;
            return (
              <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                <Field
                  field={{ ...f, placeholder }}
                  id={`${formId}-${f.name}`}
                  value={values[f.name]}
                  error={errors[f.name]}
                  options={options}
                  disabled={disabled}
                  onChange={handleChange}
                />
              </div>
            );
          })}
        </div>
        {renderExtra && <div className="mt-5">{renderExtra(values)}</div>}
      </form>
    </Modal>
  );
}
