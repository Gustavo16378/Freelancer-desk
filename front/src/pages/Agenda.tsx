import { useState, useEffect } from 'react';
import { useEvents, useAppStore } from '@/store';
import { eventService } from '@/services/event';
import { EVENT_TYPES } from '@/utils/constants';
import { PT_MONTHS, PT_WEEKDAYS_SHORT, todayISO, parseDate, toISODate, fmtDate, startOfMonth, endOfMonth, startOfWeek, addDaysDate, addMonths, isSameDay, isSameMonth, daysBetween } from '@/utils/date';
import { holidaysOn } from '@/utils/holidays';
import { cx } from '@/utils/misc';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import Field from '@/components/Field';
import Confirm from '@/components/Confirm';
import Empty from '@/components/Empty';
import ProjectSelect from '@/components/ProjectSelect';
import { EventChip } from '@/components/Chips';
import type { Event } from '@/types';

type AgendaMode = 'mes' | 'semana' | 'lista';

const Agenda = () => {
  const events = useEvents();
  const [mode, setMode] = useState<AgendaMode>('mes');
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(todayISO());
  const [editing, setEditing] = useState<Partial<Event> | null>(null);

  useEffect(() => {
    if (window.innerWidth < 720 && mode === 'mes') setMode('lista');
  }, []);

  const eventsForDay = (iso: string) =>
    events.filter(e => e.date === iso).sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

  return (
    <div className="p-5 md:p-7 w-full max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="seg">
          <button className={mode === 'mes' ? 'active' : ''} onClick={() => setMode('mes')}>Mês</button>
          <button className={mode === 'semana' ? 'active' : ''} onClick={() => setMode('semana')}>Semana</button>
          <button className={mode === 'lista' ? 'active' : ''} onClick={() => setMode('lista')}>Lista</button>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({ date: selected })}>
          <Icon name="plus" size={15} /> Novo evento
        </button>
      </div>

      {mode === 'mes' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <MonthView cursor={cursor} onCursor={setCursor} selected={selected} onSelect={setSelected} eventsForDay={eventsForDay} />
          <DayPanel date={selected} eventsForDay={eventsForDay} onEdit={setEditing} onNew={() => setEditing({ date: selected })} />
        </div>
      )}
      {mode === 'semana' && (
        <WeekView cursor={cursor} onCursor={setCursor} selected={selected} onSelect={setSelected} eventsForDay={eventsForDay} onEdit={setEditing} />
      )}
      {mode === 'lista' && (
        <ListView events={events} onEdit={setEditing} />
      )}

      <EventModal
        open={!!editing}
        onClose={() => setEditing(null)}
        event={editing?.id ? editing as Event : null}
        defaultDate={!editing?.id ? (editing?.date ?? todayISO()) : todayISO()}
      />
    </div>
  );
};

// ── Month view ────────────────────────────────────────────────────────────────
const MonthView = ({ cursor, onCursor, selected, onSelect, eventsForDay }: {
  cursor: Date; onCursor: (d: Date) => void;
  selected: string; onSelect: (s: string) => void;
  eventsForDay: (iso: string) => Event[];
}) => {
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const cells: Date[] = [];
  let d = gridStart;
  while (d <= monthEnd || cells.length < 42) {
    cells.push(new Date(d));
    d = addDaysDate(d, 1);
    if (cells.length > 41) break;
  }
  const today = new Date();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="display text-[18px] font-bold leading-none">
          <span className="capitalize">{PT_MONTHS[cursor.getMonth()]}</span>{' '}
          <span className="num text-dim font-normal">{cursor.getFullYear()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn btn-icon-sm btn-soft" onClick={() => onCursor(addMonths(cursor, -1))}><Icon name="chevL" size={15} /></button>
          <button className="btn btn-soft btn-sm" onClick={() => { onCursor(new Date()); onSelect(todayISO()); }}>Hoje</button>
          <button className="btn btn-icon-sm btn-soft" onClick={() => onCursor(addMonths(cursor, 1))}><Icon name="chevR" size={15} /></button>
        </div>
      </div>

      <div className="grid-cal mb-1.5">
        {PT_WEEKDAYS_SHORT.map((w, i) => (
          <div key={i} className="text-[11px] uppercase tracking-wider text-dim2 font-semibold text-center py-1.5">{w}</div>
        ))}
      </div>

      <div className="grid-cal">
        {cells.map((c, i) => {
          const iso = toISODate(c);
          const isToday = isSameDay(c, today);
          const isSelected = iso === selected;
          const inMonth = isSameMonth(c, cursor);
          const evs = eventsForDay(iso);
          const hols = holidaysOn(iso);
          return (
            <div key={i} onClick={() => onSelect(iso)}
              className={cx('cal-cell', isToday && 'today', isSelected && 'selected', !inMonth && 'muted')}>
              <div className="flex items-center justify-between">
                <span className="day-num">{c.getDate()}</span>
                <div className="flex items-center gap-1">
                  {hols.length > 0 && <span className="dot" style={{ background: '#f59e0b', width: 5, height: 5 }} />}
                  {isToday && <span className="dot" style={{ background: '#00b4d8', width: 5, height: 5 }} />}
                </div>
              </div>
              {evs.length > 0 && (
                <div className="flex flex-col gap-1 mt-auto">
                  {evs.slice(0, 2).map(e => (
                    <div key={e.id} className="flex items-center gap-1 text-[10.5px] truncate">
                      <span className="dot" style={{ background: EVENT_TYPES[e.type]?.color, width: 5, height: 5, flexShrink: 0 }} />
                      <span className="truncate text-ink/80">{e.title}</span>
                    </div>
                  ))}
                  {evs.length > 2 && <div className="text-[10px] text-dim num">+{evs.length - 2}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Day panel ─────────────────────────────────────────────────────────────────
const DayPanel = ({ date, eventsForDay, onEdit, onNew }: {
  date: string; eventsForDay: (iso: string) => Event[];
  onEdit: (e: Event) => void; onNew: () => void;
}) => {
  const evs = eventsForDay(date);
  const dObj = parseDate(date);
  const projects = useAppStore(s => s.projects);
  const hols = holidaysOn(date);

  return (
    <div className="card p-5 h-fit lg:sticky lg:top-[80px]">
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wider text-dim font-semibold mb-1">Dia selecionado</div>
        <div className="display text-[20px] font-bold leading-tight capitalize">{fmtDate(dObj, 'EEEE')}</div>
        <div className="text-sm text-dim num">
          {fmtDate(dObj, 'dd')} de <span className="lowercase">{PT_MONTHS[dObj.getMonth()]}</span> de {dObj.getFullYear()}
        </div>
      </div>

      {hols.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {hols.map(h => (
            <div key={h.name} className="rounded-card px-3 py-2 flex items-center gap-2.5"
              style={{ background: 'rgba(245,158,11,0.08)', boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.2)' }}>
              <Icon name="flag" size={13} style={{ color: '#f59e0b', flexShrink: 0 } as React.CSSProperties} />
              <div>
                <div className="text-[12.5px] font-semibold" style={{ color: '#f59e0b' }}>{h.name}</div>
                <div className="text-[11px] text-dim">Feriado nacional</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5 mb-4 max-h-[420px] overflow-auto -mr-2 pr-2">
        {evs.length === 0 ? (
          <div className="py-8 text-center"><div className="text-sm text-dim">Sem eventos neste dia.</div></div>
        ) : evs.map(e => {
          const t = EVENT_TYPES[e.type] ?? EVENT_TYPES.outro;
          const proj = e.projectId ? projects.find(p => p.id === e.projectId) : null;
          return (
            <button key={e.id} onClick={() => onEdit(e)}
              className="text-left rounded-card p-3 flex gap-3 transition-colors hover:bg-surf2"
              style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
              <span className="w-1 rounded-full flex-shrink-0" style={{ background: t.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {e.time && <span className="num text-[12px] font-semibold text-cyan2">{e.time}</span>}
                  <EventChip type={e.type} />
                </div>
                <div className="text-[13.5px] font-medium leading-snug mb-1">{e.title}</div>
                {proj && (
                  <a href={`#/projetos/${proj.id}`} onClick={ev => ev.stopPropagation()}
                    className="text-[11.5px] text-dim hover:text-cyan2 inline-flex items-center gap-1">
                    <Icon name="link" size={11} /> {proj.name}
                  </a>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button onClick={onNew} className="btn btn-ghost w-full justify-center">
        <Icon name="plus" size={15} /> Evento
      </button>
    </div>
  );
};

// ── Week view ─────────────────────────────────────────────────────────────────
const WeekView = ({ cursor, onCursor, onSelect, eventsForDay, onEdit }: {
  cursor: Date; onCursor: (d: Date) => void;
  selected: string; onSelect: (s: string) => void;
  eventsForDay: (iso: string) => Event[];
  onEdit: (e: Event) => void;
}) => {
  const weekStart = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDaysDate(weekStart, i));
  const today = new Date();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="display text-[16px] font-semibold">
          Semana de <span className="num">{fmtDate(weekStart, 'dd/MM')}</span> a{' '}
          <span className="num">{fmtDate(days[6], 'dd/MM')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn btn-icon-sm btn-soft" onClick={() => onCursor(addDaysDate(cursor, -7))}><Icon name="chevL" size={15} /></button>
          <button className="btn btn-soft btn-sm" onClick={() => { onCursor(new Date()); onSelect(todayISO()); }}>Hoje</button>
          <button className="btn btn-icon-sm btn-soft" onClick={() => onCursor(addDaysDate(cursor, 7))}><Icon name="chevR" size={15} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map(d => {
          const iso = toISODate(d);
          const evs = eventsForDay(iso);
          const isToday = isSameDay(d, today);
          return (
            <div key={iso} className="flex flex-col gap-2">
              <div className={cx('rounded-card px-3 py-2 flex md:block items-center justify-between',
                isToday ? 'bg-cyan/10' : 'bg-surf2')}
                style={{ boxShadow: isToday ? 'inset 0 0 0 1px rgba(0,180,216,0.3)' : 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2 md:gap-0 md:flex-col md:items-start">
                  <div className="text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: isToday ? '#00d4ff' : '#8b8b9a' }}>
                    {PT_WEEKDAYS_SHORT[d.getDay()]}
                  </div>
                  <div className={cx('display text-[18px] font-bold num leading-none mt-0.5', isToday && 'text-cyan2')}>{d.getDate()}</div>
                </div>
                <span className="num text-[10.5px] text-dim md:mt-1.5 md:block">{evs.length} ev.</span>
              </div>
              <div className="flex flex-col gap-1.5 min-h-[60px]">
                {evs.map(e => {
                  const t = EVENT_TYPES[e.type] ?? EVENT_TYPES.outro;
                  return (
                    <button key={e.id} onClick={() => onEdit(e)} className="text-left rounded-lg p-2 hover:bg-surf3 transition-colors"
                      style={{ background: '#0e0e16', borderLeft: `3px solid ${t.color}` }}>
                      {e.time && <div className="num text-[10.5px] text-cyan2 font-semibold">{e.time}</div>}
                      <div className="text-[12px] font-medium leading-snug">{e.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── List view ─────────────────────────────────────────────────────────────────
const ListView = ({ events, onEdit }: { events: Event[]; onEdit: (e: Event) => void }) => {
  const projects = useAppStore(s => s.projects);
  const [filter, setFilter] = useState<'todos' | 'futuros' | 'passados'>('todos');
  const today = todayISO();
  let filtered = events;
  if (filter === 'futuros') filtered = events.filter(e => e.date >= today);
  if (filter === 'passados') filtered = events.filter(e => e.date < today);
  filtered = [...filtered].sort((a, b) =>
    a.date === b.date ? (a.time || '99:99').localeCompare(b.time || '99:99') : a.date.localeCompare(b.date)
  );

  const groups: Record<string, Event[]> = {};
  filtered.forEach(e => { (groups[e.date] = groups[e.date] || []).push(e); });
  const dates = Object.keys(groups).sort();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="seg">
          <button className={filter === 'todos' ? 'active' : ''} onClick={() => setFilter('todos')}>Todos</button>
          <button className={filter === 'futuros' ? 'active' : ''} onClick={() => setFilter('futuros')}>Futuros</button>
          <button className={filter === 'passados' ? 'active' : ''} onClick={() => setFilter('passados')}>Passados</button>
        </div>
        <div className="num text-[12px] text-dim">{filtered.length} evento{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      {dates.length === 0 ? (
        <Empty icon="calendar" title="Sem eventos" hint="Cadastre eventos para acompanhar reuniões, entregas e pagamentos." />
      ) : (
        <div className="flex flex-col gap-6">
          {dates.map(date => {
            const dObj = parseDate(date);
            const diff = daysBetween(new Date(), date);
            let dateLabel: string;
            if (diff === 0) dateLabel = 'Hoje';
            else if (diff === 1) dateLabel = 'Amanhã';
            else if (diff === -1) dateLabel = 'Ontem';
            else dateLabel = fmtDate(dObj, 'EEEE, dd/MM');
            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="display text-[13px] font-bold capitalize">{dateLabel}</div>
                  <div className="flex-1 h-px bg-line" />
                  <div className="num text-[11px] text-dim">{fmtDate(dObj, 'dd/MM/yyyy')}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {groups[date].map(e => {
                    const t = EVENT_TYPES[e.type] ?? EVENT_TYPES.outro;
                    const proj = e.projectId ? projects.find(p => p.id === e.projectId) : null;
                    return (
                      <button key={e.id} onClick={() => onEdit(e)}
                        className="text-left rounded-card p-3 flex gap-3 hover:bg-surf2 transition-colors"
                        style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
                        <span className="w-1 rounded-full flex-shrink-0" style={{ background: t.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {e.time && <span className="num text-[12px] font-semibold text-cyan2">{e.time}</span>}
                            <EventChip type={e.type} />
                            {proj && (
                              <span className="text-[11.5px] text-dim inline-flex items-center gap-1">
                                <Icon name="link" size={11} /> {proj.name}
                              </span>
                            )}
                          </div>
                          <div className="text-[13.5px] font-medium leading-snug">{e.title}</div>
                          {e.notes && <div className="text-[12px] text-dim mt-1 line-clamp-1">{e.notes}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Event Modal ───────────────────────────────────────────────────────────────
interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  defaultDate: string;
}

type EventForm = Omit<Event, 'id'>;

const EventModal = ({ open, onClose, event, defaultDate }: EventModalProps) => {
  const [form, setForm] = useState<EventForm | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(event
      ? { ...event }
      : { title: '', date: defaultDate || todayISO(), time: '', type: 'reuniao', projectId: null, notes: '' }
    );
  }, [open, event?.id]);

  if (!form) return null;
  const set = <K extends keyof EventForm>(k: K, v: EventForm[K]) => setForm(f => f ? { ...f, [k]: v } : f);
  const valid = form.title.trim() && form.date;

  const save = async () => {
    if (!valid) return;
    if (event?.id) await eventService.update(event.id, form);
    else await eventService.create(form);
    onClose();
  };
  const remove = async () => { if (event?.id) await eventService.remove(event.id); onClose(); };

  return (
    <>
      <Modal open={open} onClose={onClose} title={event?.id ? 'Editar evento' : 'Novo evento'}
        footer={<>
          {event?.id && <button onClick={() => setConfirmDel(true)} className="btn btn-danger btn-sm mr-auto"><Icon name="trash" size={14} /> Excluir</button>}
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancelar</button>
          <button onClick={save} disabled={!valid} className="btn btn-primary btn-sm" style={{ opacity: valid ? 1 : 0.5 }}>Salvar</button>
        </>}>
        <div className="flex flex-col gap-4">
          <Field label="Título">
            <input className="field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Reunião com cliente" autoFocus />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data">
              <input type="date" className="field" value={form.date} onChange={e => set('date', e.target.value)} />
            </Field>
            <Field label="Horário (opcional)">
              <input type="time" className="field" value={form.time} onChange={e => set('time', e.target.value)} />
            </Field>
          </div>
          <Field label="Tipo">
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(EVENT_TYPES) as [Event['type'], { label: string; color: string }][]).map(([k, t]) => {
                const active = form.type === k;
                return (
                  <button key={k} type="button" onClick={() => set('type', k)}
                    className="flex items-center gap-2 px-3 py-2 rounded-btn transition-colors text-sm font-medium"
                    style={{
                      background: active ? `${t.color}1A` : '#1a1a24',
                      color: active ? t.color : '#8b8b9a',
                      boxShadow: active ? `inset 0 0 0 1px ${t.color}55` : 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                    }}>
                    <span className="dot" style={{ background: t.color }} /> {t.label}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Projeto vinculado">
            <ProjectSelect value={form.projectId} onChange={v => set('projectId', v)} />
          </Field>
          <Field label="Observações">
            <textarea className="field" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anotações ou pauta do evento..." />
          </Field>
        </div>
      </Modal>
      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={remove}
        title="Excluir evento" danger confirmLabel="Excluir"
        message="Tem certeza? Esta ação não pode ser desfeita." />
    </>
  );
};

export default Agenda;
