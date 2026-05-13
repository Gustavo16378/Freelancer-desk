import Icon from './Icon';

interface KPIProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  accent?: string;
  delta?: { positive: boolean; text: string };
}

const KPI = ({ label, value, sub, icon, accent = '#00b4d8', delta }: KPIProps) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-3">
      <span className="text-[12px] uppercase tracking-wider text-dim font-semibold">{label}</span>
      {icon && (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${accent}15`, color: accent }}>
          <Icon name={icon} size={16} />
        </span>
      )}
    </div>
    <div className="display text-[16px] sm:text-[22px] md:text-[26px] font-bold leading-none num truncate">{value}</div>
    {(sub ?? delta) && (
      <div className="mt-2 flex items-center gap-2 text-[12.5px] text-dim">
        {delta && (
          <span className="num font-semibold" style={{ color: delta.positive ? '#10b981' : '#ef4444' }}>
            {delta.positive ? '↑' : '↓'} {delta.text}
          </span>
        )}
        {sub && <span>{sub}</span>}
      </div>
    )}
  </div>
);

export default KPI;
