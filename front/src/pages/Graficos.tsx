import { useAppStore } from '@/store';
import { PROJECT_STATUSES, PROJECT_TYPES } from '@/utils/constants';
import { PT_MONTHS_SHORT, parseDate, startOfMonth, endOfMonth, addMonths } from '@/utils/date';
import { fmtBRL, cx } from '@/utils/misc';
import KPI from '@/components/KPI';
import BarChart from '@/components/BarChart';
import DonutChart from '@/components/DonutChart';
import Empty from '@/components/Empty';
import Progress from '@/components/Progress';
import { StatusChip, TypeChip } from '@/components/Chips';

const Graficos = () => {
  const { projects, payments } = useAppStore();
  const today = new Date();

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const m = addMonths(today, -5 + i);
    const ms = startOfMonth(m);
    const me = endOfMonth(m);
    const received = payments
      .filter(p => p.status === 'recebido' && p.paidAt && parseDate(p.paidAt) >= ms && parseDate(p.paidAt) <= me)
      .reduce((s, p) => s + p.value, 0);
    return { label: PT_MONTHS_SHORT[m.getMonth()], value: received };
  });

  const byStatus = (Object.entries(PROJECT_STATUSES) as [string, { label: string; color: string }][]).map(([k, s]) => ({
    label: s.label,
    value: projects.filter(p => p.status === k).length,
    color: s.color,
  })).filter(d => d.value > 0);

  const TYPE_COLORS: Record<string, string> = { Dev: '#00b4d8', Design: '#ec4899', Consultoria: '#8b5cf6', Outro: '#8b8b9a' };
  const typeRevenue = PROJECT_TYPES.map(t => ({
    label: t,
    value: projects.filter(p => p.type === t).reduce((s, p) => s + p.value, 0),
    color: TYPE_COLORS[t],
  })).filter(d => d.value > 0);

  const totalValue = projects.reduce((s, p) => s + p.value, 0);
  const totalReceived = payments.filter(p => p.status === 'recebido').reduce((s, p) => s + p.value, 0);
  const avgTicket = projects.length ? totalValue / projects.length : 0;

  return (
    <div className="p-5 md:p-7 w-full max-w-[1400px] flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Valor contratado" value={fmtBRL(totalValue)} sub="todos os projetos" icon="bolt" accent="#00b4d8" />
        <KPI label="Total recebido" value={fmtBRL(totalReceived)} sub={`${Math.round(totalValue ? totalReceived / totalValue * 100 : 0)}% do contratado`} icon="check" accent="#10b981" />
        <KPI label="Ticket médio" value={fmtBRL(avgTicket)} sub="por projeto" icon="target" accent="#8b5cf6" />
        <KPI label="Total de projetos" value={projects.length} sub={`${projects.filter(p => p.status === 'concluido').length} concluídos`} icon="folder" accent="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Receita mensal" sub="Últimos 6 meses">
          <BarChart data={monthlyRevenue} height={260} color="#00b4d8" currency />
        </ChartCard>

        <ChartCard title="Projetos por status" sub={`${projects.length} projetos no total`}>
          {byStatus.length > 0
            ? <DonutChart data={byStatus} centerLabel="Projetos" centerValue={projects.length} />
            : <Empty icon="grid" title="Sem dados" />}
        </ChartCard>

        <ChartCard title="Receita por tipo de projeto" sub="Valor contratado por categoria" className="lg:col-span-2">
          {typeRevenue.length > 0
            ? <BarChart data={typeRevenue} height={240} currency />
            : <Empty icon="chart" title="Sem dados" />}
        </ChartCard>
      </div>

      <div className="card p-5">
        <h2 className="display text-[15px] font-bold mb-4">Resumo por projeto</h2>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[10.5px] uppercase tracking-wider text-dim font-semibold">
                <th className="text-left pb-3 font-semibold">Projeto</th>
                <th className="text-left pb-3 font-semibold hidden md:table-cell">Cliente</th>
                <th className="text-left pb-3 font-semibold hidden sm:table-cell">Tipo</th>
                <th className="text-left pb-3 font-semibold">Status</th>
                <th className="text-right pb-3 font-semibold">Valor</th>
                <th className="text-right pb-3 font-semibold hidden md:table-cell">Recebido</th>
                <th className="text-right pb-3 font-semibold">% pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {projects.map(p => {
                const received = payments.filter(pg => pg.projectId === p.id && pg.status === 'recebido').reduce((s, pg) => s + pg.value, 0);
                const pct = p.value ? Math.round(received / p.value * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-surf2/30 transition-colors">
                    <td className="py-3.5 pr-3"><a href={`#/projetos/${p.id}`} className="font-medium hover:text-cyan2">{p.name}</a></td>
                    <td className="py-3.5 pr-3 text-dim hidden md:table-cell">{p.client}</td>
                    <td className="py-3.5 pr-3 hidden sm:table-cell"><TypeChip type={p.type} /></td>
                    <td className="py-3.5 pr-3"><StatusChip status={p.status} /></td>
                    <td className="py-3.5 pr-3 text-right num font-semibold">{fmtBRL(p.value)}</td>
                    <td className="py-3.5 pr-3 text-right num text-ok hidden md:table-cell">{fmtBRL(received)}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 progress hidden sm:block">
                          <div style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : '#00b4d8' }} />
                        </div>
                        <span className="num font-semibold w-9 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, sub, children, className = '' }: { title: string; sub?: string; children: React.ReactNode; className?: string }) => (
  <div className={cx('card p-5', className)}>
    <div className="mb-4">
      <h2 className="display text-[15px] font-bold leading-none">{title}</h2>
      {sub && <div className="text-[11.5px] text-dim mt-1.5">{sub}</div>}
    </div>
    {children}
  </div>
);

export default Graficos;
