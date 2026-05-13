import { useState } from 'react';
import { useAppStore } from '@/store';
import { paymentService } from '@/services/payment';
import { PT_MONTHS_SHORT } from '@/utils/date';
import { todayISO, parseDate, fmtDate, daysBetween } from '@/utils/date';
import { fmtBRL } from '@/utils/misc';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import Field from '@/components/Field';
import Confirm from '@/components/Confirm';
import Empty from '@/components/Empty';
import ProjectSelect from '@/components/ProjectSelect';
import type { Payment } from '@/types';

const Pagamentos = () => {
  const { payments, projects } = useAppStore();
  const [tab, setTab] = useState<'pendente' | 'recebido'>('pendente');
  const [editing, setEditing] = useState<Partial<Payment> | null>(null);

  const projectOf = (id: string) => projects.find(p => p.id === id);

  const pending = payments.filter(p => p.status === 'pendente').sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const received = payments.filter(p => p.status === 'recebido').sort((a, b) => (b.paidAt || b.dueDate).localeCompare(a.paidAt || a.dueDate));

  const totalReceived = received.reduce((s, p) => s + p.value, 0);
  const totalPending = pending.reduce((s, p) => s + p.value, 0);
  const overdueCount = pending.filter(p => daysBetween(new Date(), p.dueDate) < 0).length;

  const list = tab === 'pendente' ? pending : received;

  return (
    <div className="p-5 md:p-7 w-full max-w-[1300px] flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[12px] uppercase tracking-wider text-dim font-semibold">Total recebido</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}><Icon name="check" size={16} /></span>
          </div>
          <div className="display text-[28px] font-bold leading-none num" style={{ color: '#10b981' }}>{fmtBRL(totalReceived)}</div>
          <div className="mt-2 text-[12px] text-dim num">{received.length} pagamento{received.length !== 1 ? 's' : ''} confirmado{received.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[12px] uppercase tracking-wider text-dim font-semibold">Total pendente</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}><Icon name="clock" size={16} /></span>
          </div>
          <div className="display text-[28px] font-bold leading-none num" style={{ color: '#f59e0b' }}>{fmtBRL(totalPending)}</div>
          <div className="mt-2 text-[12px] text-dim num">
            {pending.length} pagamento{pending.length !== 1 ? 's' : ''}
            {overdueCount > 0 && <span style={{ color: '#ef4444' }}> · {overdueCount} atrasado{overdueCount !== 1 ? 's' : ''}</span>}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[12px] uppercase tracking-wider text-dim font-semibold">Total geral</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(0,180,216,0.12)', color: '#00b4d8' }}><Icon name="bolt" size={16} /></span>
          </div>
          <div className="display text-[28px] font-bold leading-none num">{fmtBRL(totalReceived + totalPending)}</div>
          <div className="mt-2 text-[12px] text-dim">contratado em projetos</div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="seg">
          <button className={tab === 'pendente' ? 'active' : ''} onClick={() => setTab('pendente')}>
            Pendente <span className="num ml-1 text-[10.5px] text-dim2">{pending.length}</span>
          </button>
          <button className={tab === 'recebido' ? 'active' : ''} onClick={() => setTab('recebido')}>
            Recebido <span className="num ml-1 text-[10.5px] text-dim2">{received.length}</span>
          </button>
        </div>
        <button onClick={() => setEditing({})} className="btn btn-primary">
          <Icon name="plus" size={15} /> Novo pagamento
        </button>
      </div>

      <div className="card overflow-hidden">
        {list.length === 0 ? (
          <Empty icon="money"
            title={tab === 'pendente' ? 'Nenhum pagamento pendente' : 'Nenhum pagamento recebido'}
            hint={tab === 'pendente' ? 'Você está em dia.' : 'Os pagamentos confirmados aparecerão aqui.'} />
        ) : (
          <div className="divide-y divide-line">
            {list.map(p => {
              const proj = projectOf(p.projectId);
              if (tab === 'pendente') {
                const diff = daysBetween(new Date(), p.dueDate);
                const overdue = diff < 0;
                return (
                  <div key={p.id} className="px-5 py-4 flex items-center gap-4 hover:bg-surf2/40 transition-colors group">
                    <div className="flex flex-col items-center justify-center w-12 flex-shrink-0 rounded-lg py-1.5"
                      style={{ background: overdue ? 'rgba(239,68,68,0.10)' : (diff <= 7 ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.04)') }}>
                      <span className="text-[9px] uppercase tracking-wider font-bold"
                        style={{ color: overdue ? '#ef4444' : (diff <= 7 ? '#f59e0b' : '#8b8b9a') }}>
                        {PT_MONTHS_SHORT[parseDate(p.dueDate).getMonth()]}
                      </span>
                      <span className="num text-[16px] font-bold leading-none mt-0.5"
                        style={{ color: overdue ? '#ef4444' : (diff <= 7 ? '#f59e0b' : '#f0f0f0') }}>
                        {parseDate(p.dueDate).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold leading-tight mb-1 truncate">{p.description}</div>
                      <div className="text-[12px] text-dim flex items-center gap-2 flex-wrap">
                        {proj && (
                          <a href={`#/projetos/${proj.id}`} className="hover:text-cyan2 inline-flex items-center gap-1">
                            <Icon name="link" size={11} /> {proj.name}
                          </a>
                        )}
                        <span className="num">· vence em {fmtDate(p.dueDate, 'dd/MM/yyyy')}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="display text-[16px] font-bold num">{fmtBRL(p.value)}</div>
                      <div className="num text-[11.5px] font-semibold mt-0.5"
                        style={{ color: overdue ? '#ef4444' : (diff <= 7 ? '#f59e0b' : '#8b8b9a') }}>
                        {overdue ? `${Math.abs(diff)} dia${Math.abs(diff) === 1 ? '' : 's'} atrasado` : diff === 0 ? 'Hoje' : `em ${diff} dia${diff === 1 ? '' : 's'}`}
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => paymentService.markReceived(p.id)} className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                        <Icon name="check" size={13} /> Marcar recebido
                      </button>
                      <button onClick={() => setEditing(p)} className="btn btn-icon-sm btn-soft"><Icon name="edit" size={13} /></button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-4 hover:bg-surf2/40 transition-colors">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" style={{ background: 'rgba(16,185,129,0.10)', color: '#10b981' }}>
                    <Icon name="check" size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold leading-tight mb-1 truncate">{p.description}</div>
                    <div className="text-[12px] text-dim flex items-center gap-2 flex-wrap">
                      {proj && (
                        <a href={`#/projetos/${proj.id}`} className="hover:text-cyan2 inline-flex items-center gap-1">
                          <Icon name="link" size={11} /> {proj.name}
                        </a>
                      )}
                      <span className="num">· recebido em {fmtDate(p.paidAt ?? p.dueDate, 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                  <div className="display text-[15px] font-bold num flex-shrink-0">{fmtBRL(p.value)}</div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => paymentService.markPending(p.id)} className="btn btn-soft btn-sm">
                      <Icon name="refresh" size={13} /> Desfazer
                    </button>
                    <button onClick={() => setEditing(p)} className="btn btn-icon-sm btn-soft"><Icon name="edit" size={13} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PaymentModal open={!!editing} onClose={() => setEditing(null)} payment={editing?.id ? editing as Payment : null} />
    </div>
  );
};

// ── Payment Modal ─────────────────────────────────────────────────────────────
type PaymentForm = Omit<Payment, 'id'>;

const PaymentModal = ({ open, onClose, payment }: { open: boolean; onClose: () => void; payment: Payment | null }) => {
  const [form, setForm] = useState<PaymentForm | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const [_open, _setOpen] = useState(false);
  if (open !== _open) {
    _setOpen(open);
    if (open) {
      setForm(payment ? { ...payment } : {
        projectId: '', description: '', value: 0, dueDate: todayISO(), status: 'pendente',
      });
    }
  }

  if (!form) return null;
  const set = <K extends keyof PaymentForm>(k: K, v: PaymentForm[K]) => setForm(f => f ? { ...f, [k]: v } : f);
  const valid = form.description.trim() && form.value > 0 && form.dueDate;

  const save = () => {
    if (!valid) return;
    const patch = { ...form };
    if (patch.status === 'recebido' && !patch.paidAt) patch.paidAt = todayISO();
    if (patch.status === 'pendente') delete patch.paidAt;
    if (payment?.id) paymentService.update(payment.id, patch);
    else paymentService.create(patch);
    onClose();
  };
  const remove = () => { if (payment?.id) paymentService.remove(payment.id); onClose(); };

  return (
    <>
      <Modal open={open} onClose={onClose} title={payment?.id ? 'Editar pagamento' : 'Novo pagamento'}
        footer={<>
          {payment?.id && <button onClick={() => setConfirmDel(true)} className="btn btn-danger btn-sm mr-auto"><Icon name="trash" size={14} /> Excluir</button>}
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancelar</button>
          <button onClick={save} disabled={!valid} className="btn btn-primary btn-sm" style={{ opacity: valid ? 1 : 0.5 }}>Salvar</button>
        </>}>
        <div className="flex flex-col gap-4">
          <Field label="Projeto">
            <ProjectSelect value={form.projectId || null} onChange={v => set('projectId', v ?? '')} allowEmpty />
          </Field>
          <Field label="Descrição">
            <input className="field" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ex: Parcela 2/4" autoFocus />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor (R$)">
              <input type="number" min="0" step="0.01" className="field num" value={form.value} onChange={e => set('value', Number(e.target.value))} />
            </Field>
            <Field label="Data de vencimento">
              <input type="date" className="field" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </Field>
          </div>
          <Field label="Status">
            <div className="grid grid-cols-2 gap-2">
              {(['pendente', 'recebido'] as const).map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors"
                  style={{
                    background: form.status === s ? (s === 'pendente' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)') : '#1a1a24',
                    color: form.status === s ? (s === 'pendente' ? '#f59e0b' : '#10b981') : '#8b8b9a',
                    boxShadow: form.status === s ? `inset 0 0 0 1px ${s === 'pendente' ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}` : 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                  }}>
                  <Icon name={s === 'pendente' ? 'clock' : 'check'} size={14} />
                  {s === 'pendente' ? 'Pendente' : 'Recebido'}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Modal>
      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={remove}
        title="Excluir pagamento" danger confirmLabel="Excluir"
        message="O pagamento será removido permanentemente." />
    </>
  );
};

export default Pagamentos;
