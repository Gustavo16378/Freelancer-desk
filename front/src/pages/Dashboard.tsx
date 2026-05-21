import { useAppStore } from '@/store';
import { useAlertsList } from '@/hooks/useAlerts';
import { EVENT_TYPES, PROJECT_STATUSES } from '@/utils/constants';
import { todayISO, parseDate, fmtDate, startOfMonth, endOfMonth, addMonths, daysBetween } from '@/utils/date';
import { PT_MONTHS_SHORT } from '@/utils/date';
import { fmtBRL } from '@/utils/misc';
import Icon from '@/components/Icon';
import KPI from '@/components/KPI';
import Sparkline from '@/components/Sparkline';
import { StatusChip, EventChip } from '@/components/Chips';
import Progress from '@/components/Progress';
import Empty from '@/components/Empty';

const Dashboard = () => {
  const { projects, events, payments } = useAppStore();
  const today = new Date();
  const todayIso = todayISO();
  const monthStart = startOfMonth(today);

  const receivedThisMonth = payments
    .filter(p => p.status === 'recebido' && p.paidAt && parseDate(p.paidAt) >= monthStart)
    .reduce((s, p) => s + p.value, 0);
  const pending = payments.filter(p => p.status === 'pendente').reduce((s, p) => s + p.value, 0);
  const suporteThisMonth = payments
    .filter(p => p.category === 'suporte' && p.status === 'recebido' && p.paidAt && parseDate(p.paidAt) >= monthStart)
    .reduce((s, p) => s + p.value, 0);
  const suportePending = payments
    .filter(p => p.category === 'suporte' && p.status === 'pendente')
    .reduce((s, p) => s + p.value, 0);
  const activeProjects = projects.filter(p => p.status === 'em_andamento').length;
  const eventsToday = events.filter(e => e.date === todayIso).length;

  const sparks = Array.from({ length: 6 }, (_, i) => {
    const m = addMonths(today, -5 + i);
    const ms = startOfMonth(m);
    const me = endOfMonth(m);
    return payments
      .filter(p => p.status === 'recebido' && p.paidAt && parseDate(p.paidAt) >= ms && parseDate(p.paidAt) <= me)
      .reduce((s, p) => s + p.value, 0);
  });

  const alerts = useAlertsList();
  const alertGroups = {
    overdue: alerts.filter(a => a.color === '#ef4444'),
    soon: alerts.filter(a => a.color === '#f59e0b'),
    info: alerts.filter(a => a.color === '#3b82f6'),
  };

  const urgentProjects = [...projects]
    .filter(p => p.status === 'em_andamento' || p.status === 'aguardando')
    .sort((a, b) => daysBetween(today, a.deadline) - daysBetween(today, b.deadline))
    .slice(0, 3);

  const upcomingEvents = [...events]
    .filter(e => e.date >= todayIso)
    .sort((a, b) => a.date === b.date ? (a.time || '99:99').localeCompare(b.time || '99:99') : a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="p-5 md:p-7 w-full max-w-[1400px] flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[12px] uppercase tracking-wider text-dim font-semibold">Receita do mês</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(0,180,216,0.12)', color: '#00b4d8' }}>
              <Icon name="bolt" size={16} />
            </span>
          </div>
          <div className="display text-[16px] sm:text-[22px] md:text-[26px] font-bold leading-none num truncate">{fmtBRL(receivedThisMonth)}</div>
          <div className="mt-3 flex items-center gap-3">
            <Sparkline data={sparks} width={90} height={28} color="#00b4d8" />
            <span className="text-[11.5px] text-dim">últimos 6 meses</span>
          </div>
        </div>
        <KPI label="A receber" value={fmtBRL(pending)} sub={`${payments.filter(p => p.status === 'pendente').length} pagamento(s)`} icon="money" accent="#f59e0b" />
        <KPI label="Suporte/mês" value={fmtBRL(suporteThisMonth || suportePending)} sub={suporteThisMonth > 0 ? 'recebido este mês' : `${fmtBRL(suportePending)} a receber`} icon="bolt" accent="#8b5cf6" />
        <KPI label="Projetos ativos" value={activeProjects} sub={`${projects.length} no total`} icon="folder" accent="#00b4d8" />
        <KPI label="Eventos hoje" value={eventsToday} sub={fmtDate(today, 'EEEE')} icon="calendar" accent="#10b981" />
      </div>

      {/* Alertas */}
      {(alertGroups.overdue.length + alertGroups.soon.length + alertGroups.info.length) > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="display text-[15px] font-bold flex items-center gap-2">
              <Icon name="bell" size={16} /> Alertas
            </h2>
            <span className="num text-[12px] text-dim">
              {alertGroups.overdue.length + alertGroups.soon.length + alertGroups.info.length} ativos
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertGroups.overdue.map(a => (
              <a key={a.id} href={a.href} className="chip px-3 py-1.5 h-auto text-[12px]" style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }}>
                <Icon name={a.icon} size={12} /> {a.title}
              </a>
            ))}
            {alertGroups.soon.map(a => (
              <a key={a.id} href={a.href} className="chip px-3 py-1.5 h-auto text-[12px]" style={{ background: 'rgba(245,158,11,0.10)', color: '#f59e0b' }}>
                <Icon name={a.icon} size={12} /> {a.title}
              </a>
            ))}
            {alertGroups.info.map(a => (
              <a key={a.id} href={a.href} className="chip px-3 py-1.5 h-auto text-[12px]" style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6' }}>
                <Icon name={a.icon} size={12} /> {a.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Grid 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Projetos urgentes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="display text-[15px] font-bold flex items-center gap-2"><Icon name="target" size={16} /> Projetos urgentes</h2>
            <a href="#/projetos" className="text-[12px] text-cyan2 hover:underline inline-flex items-center gap-1">Ver todos <Icon name="arrowR" size={11} /></a>
          </div>
          {urgentProjects.length === 0 ? <Empty icon="folder" title="Sem projetos ativos" /> : (
            <div className="flex flex-col gap-3">
              {urgentProjects.map(p => {
                const diff = daysBetween(today, p.deadline);
                const overdue = diff < 0;
                return (
                  <a key={p.id} href={`#/projetos/${p.id}`}
                    className="rounded-card p-4 hover:bg-surf2 transition-colors block"
                    style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold leading-tight mb-1 truncate">{p.name}</div>
                        <div className="text-[11.5px] text-dim">{p.client}</div>
                      </div>
                      <StatusChip status={p.status} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Progress value={p.progress} color={PROJECT_STATUSES[p.status]?.color ?? '#00b4d8'} />
                      <span className="num text-[11px] text-dim flex-shrink-0">{p.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-dim num">{fmtBRL(p.value)}</span>
                      <span className="num font-medium" style={{ color: overdue ? '#ef4444' : (diff <= 7 ? '#f59e0b' : '#8b8b9a') }}>
                        {overdue ? `${Math.abs(diff)} dia${Math.abs(diff) === 1 ? '' : 's'} atrasado` : `${diff} dia${diff === 1 ? '' : 's'} restante${diff === 1 ? '' : 's'}`}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Próximos eventos */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="display text-[15px] font-bold flex items-center gap-2"><Icon name="calendar" size={16} /> Próximos eventos</h2>
            <a href="#/agenda" className="text-[12px] text-cyan2 hover:underline inline-flex items-center gap-1">Ver agenda <Icon name="arrowR" size={11} /></a>
          </div>
          {upcomingEvents.length === 0 ? <Empty icon="calendar" title="Sem eventos próximos" /> : (
            <div className="flex flex-col gap-2.5">
              {upcomingEvents.map(e => {
                const t = EVENT_TYPES[e.type] ?? EVENT_TYPES.outro;
                const proj = e.projectId ? projects.find(p => p.id === e.projectId) : null;
                const diff = daysBetween(today, e.date);
                const dateLabel = diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : fmtDate(e.date, 'EEE, dd/MM');
                return (
                  <div key={e.id} className="rounded-card p-3 flex gap-3"
                    style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
                    <div className="flex flex-col items-center justify-center w-12 flex-shrink-0 rounded-lg py-1.5"
                      style={{ background: `${t.color}1A` }}>
                      <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: t.color }}>
                        {PT_MONTHS_SHORT[parseDate(e.date).getMonth()]}
                      </span>
                      <span className="num text-[18px] font-bold leading-none mt-0.5" style={{ color: t.color }}>
                        {parseDate(e.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-medium capitalize text-dim">{dateLabel}</span>
                        {e.time && <span className="num text-[11px] font-semibold text-cyan2">· {e.time}</span>}
                      </div>
                      <div className="text-[13.5px] font-medium leading-snug capitalize">{e.title}</div>
                      {proj && <div className="text-[11px] text-dim mt-0.5">{proj.name}</div>}
                    </div>
                    <EventChip type={e.type} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
