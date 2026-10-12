import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal
      size="sm"
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Icon name="alert" size={20} />
        </span>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </Modal>
  );
}
