import { cx } from '@/utils/misc';
import { useAlertsCount } from '@/hooks/useAlerts';
import Icon from '@/components/Icon';
import Logo from './Logo';

export const NAV = [
  { id: 'agenda',     route: '/agenda',     label: 'Agenda',     icon: 'calendar' },
  { id: 'dashboard',  route: '/dashboard',  label: 'Dashboard',  icon: 'grid' },
  { id: 'projetos',   route: '/projetos',   label: 'Projetos',   icon: 'folder' },
  { id: 'pagamentos', route: '/pagamentos', label: 'Pagamentos', icon: 'money' },
  { id: 'graficos',   route: '/graficos',   label: 'Gráficos',   icon: 'chart' },
] as const;

interface SidebarProps {
  activeRoute: string;
  onNav?: () => void;
  onClose?: () => void;
  mobile?: boolean;
}

const Sidebar = ({ activeRoute, onNav, onClose, mobile = false }: SidebarProps) => {
  const alertsCount = useAlertsCount();

  return (
    <aside
      className={cx('flex flex-col bg-surf h-full', mobile ? 'w-[260px]' : 'w-[244px] desktop-only')}
      style={{ boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.06)' }}
    >
      <div className="px-5 pt-5 pb-6 flex items-center justify-between">
        <Logo />
        {mobile && (
          <button onClick={onClose} className="btn btn-icon-sm btn-soft">
            <Icon name="x" size={15} />
          </button>
        )}
      </div>

      <nav className="px-3 flex flex-col gap-0.5 flex-1">
        {NAV.map(n => {
          const active = activeRoute.startsWith(n.route);
          return (
            <a
              key={n.id}
              href={`#${n.route}`}
              onClick={() => onNav?.()}
              className={cx('nav-item', active && 'active')}
            >
              <Icon name={n.icon} size={17} />
              <span className="flex-1">{n.label}</span>
              {n.id === 'agenda' && alertsCount > 0 && (
                <span className="num text-[10.5px] font-bold px-1.5 h-[18px] rounded-full flex items-center justify-center"
                  style={{ background: '#ef4444', color: '#fff' }}>
                  {alertsCount}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="px-3 pb-4 mt-2">
        <a href="#/agenda" className="nav-item">
          <Icon name="bell" size={17} />
          <span className="flex-1">Notificações</span>
          {alertsCount > 0 && (
            <span className="num text-[10.5px] font-bold px-1.5 h-[18px] rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.18)', color: '#ef4444' }}>
              {alertsCount}
            </span>
          )}
        </a>
      </div>

      <div className="px-3 pb-4">
        <div className="card-hover p-3 rounded-card flex items-center gap-3"
          style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
          <div className="relative">
            <div className="w-9 h-9 rounded-full flex items-center justify-center display font-bold text-[14px]"
              style={{ background: 'linear-gradient(135deg, #00b4d8, #8b5cf6)' }}>
              GD
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0e0e16]"
              style={{ background: '#10b981' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold leading-tight truncate">Gustavo Dev</div>
            <div className="text-[11px] text-ok flex items-center gap-1.5 mt-0.5">
              <span className="dot" style={{ background: '#10b981', width: 6, height: 6 }} />
              Disponível para projetos
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
