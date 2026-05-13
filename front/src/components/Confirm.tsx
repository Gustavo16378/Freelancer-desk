import { cx } from '@/utils/misc';
import Modal from './Modal';

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  danger?: boolean;
}

const Confirm = ({ open, onClose, onConfirm, title = 'Confirmar', message, confirmLabel = 'Confirmar', danger = false }: ConfirmProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    maxWidth={420}
    footer={
      <>
        <button onClick={onClose} className="btn btn-ghost btn-sm">Cancelar</button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={cx('btn btn-sm', danger ? 'btn-danger' : 'btn-primary')}
        >
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm text-dim leading-relaxed">{message}</p>
  </Modal>
);

export default Confirm;
