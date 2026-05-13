import Icon from '@/components/Icon';
import { NAV } from './Sidebar';

interface BottomNavProps {
  activeRoute: string;
}

const BottomNav = ({ activeRoute }: BottomNavProps) => (
  <nav
    className="mobile-only fixed bottom-0 left-0 right-0 z-30 bg-surf"
    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)', paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div className="grid grid-cols-5">
      {NAV.map(n => {
        const active = activeRoute.startsWith(n.route);
        return (
          <a
            key={n.id}
            href={`#${n.route}`}
            className="flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
            style={{ color: active ? '#00d4ff' : '#8b8b9a' }}
          >
            <Icon name={n.icon} size={20} />
            <span className="text-[10px] font-medium">{n.label}</span>
          </a>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
