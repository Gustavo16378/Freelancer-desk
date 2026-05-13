import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/Icon';
import { useAlertsList, useAlertsCount } from '@/hooks/useAlerts';
import { fmtDate } from '@/utils/date';
import { PT_MONTHS } from '@/utils/date';

interface TopbarProps {
  title: string;
  onMenu: () => void;
  installable: boolean;
  onShowInstall: () => void;
}

const NotificationsPopover = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const alerts = useAlertsList();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', h), 0);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-[44px] w-[340px] card overflow-hidden z-30"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 16px 40px rgba(0,0,0,0.5)' }}>
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <span className="display text-[14px] font-semibold">Notificações</span>
        <span className="num text-[11px] text-dim">{alerts.length} {alerts.length === 1 ? 'aviso' : 'avisos'}</span>
      </div>
      <div className="max-h-[360px] overflow-auto">
        {alerts.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-dim">Sem alertas no momento.</div>
        ) : alerts.map(a => (
          <a key={a.id} href={a.href} onClick={onClose} className="flex items-start gap-3 px-4 py-3 hover:bg-surf2 transition-colors">
            <span className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
              style={{ background: `${a.color}1A`, color: a.color }}>
              <Icon name={a.icon} size={14} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-snug">{a.title}</div>
              <div className="text-[11.5px] text-dim mt-0.5">{a.sub}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const Topbar = ({ title, onMenu, installable, onShowInstall }: TopbarProps) => {
  const today = new Date();
  const alertsCount = useAlertsCount();
  const [bellOpen, setBellOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-bg/85 backdrop-blur-md"
      style={{ boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 px-5 md:px-7 h-[64px]">
        <button onClick={onMenu} className="btn btn-icon-sm btn-soft mobile-only">
          <Icon name="menu" size={16} />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="display text-[19px] md:text-[22px] font-bold leading-none truncate">{title}</h1>
          <div className="text-[12px] text-dim mt-1 num">
            {fmtDate(today, 'EEEE, d')} de <span className="lowercase">{PT_MONTHS[today.getMonth()]}</span> de {today.getFullYear()}
          </div>
        </div>

        {installable && (
          <button onClick={onShowInstall} className="btn btn-ghost btn-sm desktop-only">
            <Icon name="install" size={15} /> Instalar app
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setBellOpen(o => !o)}
            className="btn btn-icon-sm btn-soft relative"
            aria-label="Notificações"
          >
            <Icon name="bell" size={16} />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 num text-[9.5px] font-bold rounded-full px-1 min-w-[16px] h-[16px] flex items-center justify-center"
                style={{ background: '#ef4444', color: '#fff' }}>
                {alertsCount}
              </span>
            )}
          </button>
          {bellOpen && <NotificationsPopover onClose={() => setBellOpen(false)} />}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
