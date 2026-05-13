import { useEffect } from 'react';
import Icon from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

const Modal = ({ open, onClose, title, children, footer, maxWidth = 560 }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-back" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-line">
          <h3 className="display text-[17px] font-semibold">{title}</h3>
          <button onClick={onClose} className="btn btn-icon-sm btn-soft">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-line flex items-center justify-end gap-2 bg-[#0e0e16] rounded-b-[14px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
