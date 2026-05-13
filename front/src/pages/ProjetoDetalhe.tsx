import { useState } from 'react';
import { useAppStore } from '@/store';
import { boardService } from '@/services/board';
import { updateService } from '@/services/update';
import { PROJECT_STATUSES, BOARD_COLUMNS, EVENT_TYPES } from '@/utils/constants';
import { fmtDate, daysBetween } from '@/utils/date';
import { fmtBRL, cx } from '@/utils/misc';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import Field from '@/components/Field';
import Confirm from '@/components/Confirm';
import Empty from '@/components/Empty';
import { StatusChip, TypeChip, PriorityChip } from '@/components/Chips';
import { ProjectModal } from './Projetos';
import type { BoardCard, ProjectUpdate, Event as EventType } from '@/types';

const ProjetoDetalhe = ({ id }: { id: string }) => {
  const { projects, events, payments, boardCards, updates } = useAppStore();
  const project = projects.find(p => p.id === id);
  const [editingProj, setEditingProj] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<BoardCard> | null>(null);

  if (!project) {
    return (
      <div className="p-7">
        <Empty icon="folder" title="Projeto não encontrado"
          hint="O link pode estar quebrado ou o projeto foi excluído."
          action={<a href="#/projetos" className="btn btn-primary"><Icon name="folder" size={14} /> Ver projetos</a>} />
      </div>
    );
  }

  const projEvents = events.filter(e => e.projectId === id).sort((a, b) => a.date.localeCompare(b.date));
  const projPayments = payments.filter(p => p.projectId === id);
  const projCards = boardCards.filter(c => c.projectId === id);
  const projUpdates = updates.filter(u => u.projectId === id).sort((a, b) => b.at.localeCompare(a.at));

  const today = new Date();
  const diff = daysBetween(today, project.deadline);
  const overdue = diff < 0 && project.status !== 'concluido';
  const totalPaid = projPayments.filter(p => p.status === 'recebido').reduce((s, p) => s + p.value, 0);
  const totalPending = project.value - totalPaid;
  const stColor = PROJECT_STATUSES[project.status]?.color ?? '#00b4d8';

  return (
    <div className="p-5 md:p-7 w-full max-w-[1400px] flex flex-col gap-6">
      <div className="flex items-center gap-2 text-[12.5px] text-dim">
        <a href="#/projetos" className="hover:text-ink inline-flex items-center gap-1.5"><Icon name="chevL" size={13} /> Projetos</a>
        <span>/</span>
        <span className="text-ink/70 truncate">{project.name}</span>
      </div>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusChip status={project.status} />
              <TypeChip type={project.type} />
              {project.isPortfolio && (
                <span className="chip" style={{ background: 'rgba(139,92,246,0.10)', color: '#8b5cf6' }}>
                  <Icon name="sparkle" size={11} /> Portfólio
                </span>
              )}
            </div>
            <h1 className="display text-[26px] font-bold leading-tight mb-1.5">{project.name}</h1>
            <div className="text-[13.5px] text-dim flex items-center gap-2"><Icon name="user" size={13} /> {project.client}</div>
            {project.description && <p className="text-[13.5px] text-dim mt-3 max-w-[640px] leading-relaxed">{project.description}</p>}
            {project.tech?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tech.map(t => (
                  <span key={t} className="num text-[11px] px-2 py-1 rounded chip" style={{ background: 'rgba(0,180,216,0.08)', color: '#00d4ff' }}>{t}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {project.isPortfolio && project.portfolioUrl && (
              <a href={project.portfolioUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Icon name="link" size={14} /> Ver no portfólio</a>
            )}
            <button onClick={() => setEditingProj(true)} className="btn btn-soft btn-sm"><Icon name="edit" size={14} /> Editar</button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11.5px] uppercase tracking-wider font-semibold text-dim">Progresso</span>
            <span className="num text-[13px] font-semibold">{project.progress}%</span>
          </div>
          <div className="progress h-[6px]">
            <div style={{ width: `${project.progress}%`, background: stColor }} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBlock label="Valor total" value={fmtBRL(project.value)} icon="money" />
          <StatBlock label="Recebido" value={fmtBRL(totalPaid)} icon="check" color="#10b981" />
          <StatBlock label="Pendente" value={fmtBRL(totalPending)} icon="clock" color={totalPending > 0 ? '#f59e0b' : '#8b8b9a'} />
          <StatBlock
            label={project.status === 'concluido' ? 'Entregue em' : 'Prazo'}
            value={project.status === 'concluido' ? fmtDate(project.deadline, 'dd/MM/yy') :
              overdue ? `${Math.abs(diff)}d atrasado` : diff === 0 ? 'Hoje' : `${diff} dia${diff === 1 ? '' : 's'}`}
            icon="flag"
            color={overdue ? '#ef4444' : (diff <= 7 && project.status !== 'concluido' ? '#f59e0b' : '#00b4d8')}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display text-[16px] font-bold flex items-center gap-2"><Icon name="grid" size={17} /> Board do projeto</h2>
          <span className="num text-[12px] text-dim">{projCards.length} {projCards.length === 1 ? 'tarefa' : 'tarefas'}</span>
        </div>
        <Kanban projectId={id} cards={projCards}
          onNew={col => setEditingCard({ column: col, projectId: id })}
          onEdit={setEditingCard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <UpdatesPanel projectId={id} updates={projUpdates} />
        <EventsPanel events={projEvents} />
      </div>

      <ProjectModal open={editingProj} onClose={() => setEditingProj(false)} project={project} />
      <CardModal
        open={!!editingCard}
        onClose={() => setEditingCard(null)}
        card={editingCard?.id ? editingCard as BoardCard : null}
        defaults={!editingCard?.id ? editingCard ?? {} : {}}
      />
    </div>
  );
};

const StatBlock = ({ label, value, icon, color = '#00b4d8' }: { label: string; value: string; icon: string; color?: string }) => (
  <div className="rounded-card p-3.5" style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
    <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-wider font-semibold text-dim mb-2">
      <Icon name={icon} size={12} className="flex-shrink-0" /> {label}
    </div>
    <div className="display text-[16px] font-bold num leading-none" style={{ color }}>{value}</div>
  </div>
);

// ── Kanban ────────────────────────────────────────────────────────────────────
const Kanban = ({ projectId: _projectId, cards, onNew, onEdit }: {
  projectId: string; cards: BoardCard[];
  onNew: (col: BoardCard['column']) => void;
  onEdit: (c: BoardCard) => void;
}) => {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropCol, setDropCol] = useState<string | null>(null);
  const byCol = (col: BoardCard['column']) => cards.filter(c => c.column === col);

  const handleDrop = (col: BoardCard['column']) => {
    if (dragId) boardService.move(dragId, col);
    setDragId(null);
    setDropCol(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {BOARD_COLUMNS.map(col => {
        const list = byCol(col.id);
        return (
          <div key={col.id}
            className={cx('kanban-col', dropCol === col.id && 'drop-target')}
            onDragOver={e => { e.preventDefault(); setDropCol(col.id); }}
            onDragLeave={() => setDropCol(c => c === col.id ? null : c)}
            onDrop={() => handleDrop(col.id)}>
            <div className="flex items-center justify-between px-1 py-1 mb-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded text-dim"><Icon name={col.icon} size={13} /></span>
                <span className="text-[13px] font-semibold">{col.label}</span>
                <span className="num text-[10.5px] text-dim2 px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>{list.length}</span>
              </div>
            </div>

            {list.length === 0 && dropCol !== col.id && (
              <div className="text-[11.5px] text-dim2 text-center py-6">Vazio</div>
            )}

            {list.map(c => {
              const dueDiff = c.due ? daysBetween(new Date(), c.due) : null;
              const isOverdue = dueDiff !== null && dueDiff < 0;
              return (
                <div key={c.id} draggable
                  onDragStart={() => setDragId(c.id)}
                  onDragEnd={() => { setDragId(null); setDropCol(null); }}
                  onClick={() => onEdit(c)}
                  className={cx('kanban-card', dragId === c.id && 'dragging')}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="text-[13px] font-semibold leading-snug flex-1">{c.title}</div>
                    <Icon name="dragHandle" size={12} className="text-dim2 flex-shrink-0 mt-0.5" />
                  </div>
                  {c.desc && <div className="text-[11.5px] text-dim mb-2 line-clamp-2 leading-snug">{c.desc}</div>}
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <PriorityChip priority={c.priority} />
                    {c.due && (
                      <span className="num text-[10.5px] flex items-center gap-1" style={{ color: isOverdue ? '#ef4444' : '#8b8b9a' }}>
                        <Icon name="clock" size={10} /> {fmtDate(c.due, 'dd/MM')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <button onClick={() => onNew(col.id)}
              className="mt-1 py-2 rounded-lg text-[12px] text-dim hover:text-cyan2 hover:bg-surf2 transition-colors flex items-center justify-center gap-1.5">
              <Icon name="plus" size={13} /> Nova tarefa
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ── Card Modal ────────────────────────────────────────────────────────────────
type CardForm = Omit<BoardCard, 'id'>;

const CardModal = ({ open, onClose, card, defaults }: {
  open: boolean; onClose: () => void;
  card: BoardCard | null; defaults: Partial<BoardCard>;
}) => {
  const [form, setForm] = useState<CardForm | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const [_open, _setOpen] = useState(false);
  if (open !== _open) {
    _setOpen(open);
    if (open) {
      setForm(card ? { ...card } : {
        title: '', desc: '', priority: 'media', column: 'backlog', due: '',
        projectId: defaults.projectId ?? '', ...defaults,
      });
    }
  }

  if (!form) return null;
  const set = <K extends keyof CardForm>(k: K, v: CardForm[K]) => setForm(f => f ? { ...f, [k]: v } : f);
  const valid = form.title.trim();

  const save = () => {
    if (!valid) return;
    if (card?.id) boardService.update(card.id, form);
    else boardService.create(form);
    onClose();
  };
  const remove = () => { if (card?.id) boardService.remove(card.id); onClose(); };

  return (
    <>
      <Modal open={open} onClose={onClose} title={card?.id ? 'Editar tarefa' : 'Nova tarefa'}
        footer={<>
          {card?.id && <button onClick={() => setConfirmDel(true)} className="btn btn-danger btn-sm mr-auto"><Icon name="trash" size={14} /> Excluir</button>}
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancelar</button>
          <button onClick={save} disabled={!valid} className="btn btn-primary btn-sm" style={{ opacity: valid ? 1 : 0.5 }}>Salvar</button>
        </>}>
        <div className="flex flex-col gap-4">
          <Field label="Título">
            <input className="field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Integrar API Garmin" autoFocus />
          </Field>
          <Field label="Descrição">
            <textarea className="field" value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Detalhes da tarefa (opcional)" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Coluna">
              <select className="field" value={form.column} onChange={e => set('column', e.target.value as BoardCard['column'])}>
                {BOARD_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Prioridade">
              <select className="field" value={form.priority} onChange={e => set('priority', e.target.value as BoardCard['priority'])}>
                {(Object.entries(PRIORITIES) as [BoardCard['priority'], { label: string }][]).map(([k, p]) =>
                  <option key={k} value={k}>{p.label}</option>
                )}
              </select>
            </Field>
            <Field label="Data de entrega (opcional)" className="col-span-2">
              <input type="date" className="field" value={form.due} onChange={e => set('due', e.target.value)} />
            </Field>
          </div>
        </div>
      </Modal>
      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={remove}
        title="Excluir tarefa" danger confirmLabel="Excluir"
        message="A tarefa será removida permanentemente do board." />
    </>
  );
};

// ── Updates Panel ─────────────────────────────────────────────────────────────
const UpdatesPanel = ({ projectId, updates }: { projectId: string; updates: ProjectUpdate[] }) => {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const register = () => {
    if (!text.trim()) return;
    updateService.create(projectId, text.trim());
    setText('');
  };

  return (
    <div className="card p-5">
      <h2 className="display text-[15px] font-bold flex items-center gap-2 mb-4"><Icon name="edit" size={15} /> Atualizações</h2>

      <div className="rounded-card p-3 mb-5" style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Como está o projeto hoje? Descreva o que avançou, bloqueios, próximos passos..."
          className="w-full bg-transparent outline-none text-sm placeholder:text-dim2 resize-y min-h-[64px] leading-relaxed" />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-line">
          <span className="text-[11px] text-dim2">{new Date().toLocaleString('pt-BR')}</span>
          <button onClick={register} disabled={!text.trim()} className="btn btn-primary btn-sm" style={{ opacity: text.trim() ? 1 : 0.5 }}>Registrar</button>
        </div>
      </div>

      {updates.length === 0 ? (
        <Empty icon="edit" title="Nenhuma atualização" hint="Registre o que está acontecendo no projeto para manter um histórico." />
      ) : (
        <ol className="flex flex-col gap-4 relative">
          {updates.map((u, i) => {
            const isEditing = editingId === u.id;
            return (
              <li key={u.id} className="flex gap-3 relative">
                <div className="flex flex-col items-center flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ background: '#00b4d8', boxShadow: '0 0 0 3px rgba(0,180,216,0.15)' }} />
                  {i < updates.length - 1 && <span className="flex-1 w-px bg-line mt-1" />}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="num text-[11px] text-dim font-medium">
                      {new Date(u.at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {isEditing ? (
                    <div>
                      <textarea className="field text-sm" value={editingText} onChange={e => setEditingText(e.target.value)} />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { updateService.update(u.id, { text: editingText }); setEditingId(null); }} className="btn btn-primary btn-sm">Salvar</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[13.5px] leading-relaxed text-ink/90 group flex items-start gap-2">
                      <span className="flex-1">{u.text}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 flex-shrink-0">
                        <button onClick={() => { setEditingId(u.id); setEditingText(u.text); }} className="btn btn-icon-sm btn-soft" style={{ width: 24, height: 24 }}>
                          <Icon name="edit" size={11} />
                        </button>
                        <button onClick={() => updateService.remove(u.id)} className="btn btn-icon-sm btn-soft" style={{ width: 24, height: 24 }}>
                          <Icon name="trash" size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

// ── Events Panel ──────────────────────────────────────────────────────────────
const EventsPanel = ({ events }: { events: EventType[] }) => (
  <div className="card p-5 h-fit">
    <h2 className="display text-[15px] font-bold flex items-center gap-2 mb-4"><Icon name="calendar" size={15} /> Eventos do projeto</h2>
    {events.length === 0 ? (
      <Empty icon="calendar" title="Sem eventos" hint="Cadastre eventos na agenda e vincule-os a este projeto." />
    ) : (
      <div className="flex flex-col gap-2">
        {events.map(e => {
          const t = EVENT_TYPES[e.type] ?? EVENT_TYPES.outro;
          const diff = daysBetween(new Date(), e.date);
          return (
            <a key={e.id} href="#/agenda" className="rounded-card p-3 flex gap-3 hover:bg-surf2 transition-colors"
              style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
              <span className="w-1 rounded-full flex-shrink-0" style={{ background: t.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="num text-[11px] text-dim font-medium">{fmtDate(e.date, 'dd/MM')}</span>
                  {e.time && <span className="num text-[11px] text-cyan2 font-semibold">· {e.time}</span>}
                </div>
                <div className="text-[13px] font-medium leading-snug">{e.title}</div>
                <div className="text-[10.5px] text-dim mt-0.5">{diff < 0 ? `há ${Math.abs(diff)}d` : diff === 0 ? 'hoje' : `em ${diff}d`}</div>
              </div>
            </a>
          );
        })}
      </div>
    )}
  </div>
);

export default ProjetoDetalhe;
