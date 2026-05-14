import { useState } from 'react';
import { useProjects } from '@/store';
import { projectService } from '@/services/project';
import { PROJECT_STATUSES, PROJECT_TYPES } from '@/utils/constants';
import { todayISO, toISODate, addDaysDate, fmtDate, daysBetween } from '@/utils/date';
import { cx, fmtBRL } from '@/utils/misc';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import Field from '@/components/Field';
import Toggle from '@/components/Toggle';
import Slider from '@/components/Slider';
import TagInput from '@/components/TagInput';
import Confirm from '@/components/Confirm';
import Empty from '@/components/Empty';
import Progress from '@/components/Progress';
import { StatusChip, TypeChip } from '@/components/Chips';
import type { Project } from '@/types';

const Projetos = () => {
  const projects = useProjects();
  const [filter, setFilter] = useState<'todos' | Project['status']>('todos');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  const filtered = projects
    .filter(p => filter === 'todos' || p.status === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    todos: projects.length,
    em_andamento: projects.filter(p => p.status === 'em_andamento').length,
    aguardando: projects.filter(p => p.status === 'aguardando').length,
    concluido: projects.filter(p => p.status === 'concluido').length,
    pausado: projects.filter(p => p.status === 'pausado').length,
  };

  return (
    <div className="p-5 md:p-7 w-full max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip active={filter === 'todos'} onClick={() => setFilter('todos')} label="Todos" count={counts.todos} />
          <FilterChip active={filter === 'em_andamento'} onClick={() => setFilter('em_andamento')} label="Em andamento" count={counts.em_andamento} dot="#00b4d8" />
          <FilterChip active={filter === 'aguardando'} onClick={() => setFilter('aguardando')} label="Aguardando" count={counts.aguardando} dot="#f59e0b" />
          <FilterChip active={filter === 'concluido'} onClick={() => setFilter('concluido')} label="Concluído" count={counts.concluido} dot="#10b981" />
          <FilterChip active={filter === 'pausado'} onClick={() => setFilter('pausado')} label="Pausado" count={counts.pausado} dot="#8b8b9a" />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
            <input className="field pl-9 w-full sm:w-[200px]" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setEditing({})} className="btn btn-primary flex-shrink-0">
            <Icon name="plus" size={15} /> Novo projeto
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <Empty icon="folder" title="Nenhum projeto"
            hint="Cadastre seu primeiro projeto para começar a organizar prazos, pagamentos e tarefas."
            action={<button onClick={() => setEditing({})} className="btn btn-primary"><Icon name="plus" size={15} /> Novo projeto</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => <ProjectCard key={p.id} project={p} onEdit={setEditing} />)}
        </div>
      )}

      <ProjectModal open={!!editing} onClose={() => setEditing(null)} project={editing?.id ? editing as Project : null} />
    </div>
  );
};

const FilterChip = ({ active, onClick, label, count, dot }: { active: boolean; onClick: () => void; label: string; count: number; dot?: string }) => (
  <button onClick={onClick}
    className={cx('inline-flex items-center gap-2 px-3 py-1.5 rounded-btn text-[13px] font-medium transition-all', active ? 'bg-surf2 text-ink' : 'text-dim hover:text-ink')}
    style={active ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' } : {}}>
    {dot && <span className="dot" style={{ background: dot }} />}
    {label}
    <span className="num text-[11px] text-dim2">{count}</span>
  </button>
);

const ProjectCard = ({ project, onEdit }: { project: Project; onEdit: (p: Project) => void }) => {
  const today = new Date();
  const diff = daysBetween(today, project.deadline);
  const overdue = diff < 0 && project.status !== 'concluido';
  const stColor = PROJECT_STATUSES[project.status]?.color ?? '#00b4d8';

  return (
    <a href={`#/projetos/${project.id}`} className="card card-hover p-5 flex flex-col gap-4 group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="display text-[15px] font-bold leading-snug mb-1 line-clamp-2 group-hover:text-cyan2 transition-colors">{project.name}</div>
          <div className="text-[12px] text-dim flex items-center gap-2"><Icon name="user" size={12} /> {project.client}</div>
        </div>
        <button onClick={e => { e.preventDefault(); onEdit(project); }} className="btn btn-icon-sm btn-soft opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="edit" size={13} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TypeChip type={project.type} />
        <StatusChip status={project.status} />
        {project.isPortfolio && (
          <span className="chip" style={{ background: 'rgba(139,92,246,0.10)', color: '#8b5cf6' }}>
            <Icon name="sparkle" size={11} /> Portfólio
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between text-[11.5px] mb-1.5">
          <span className="text-dim uppercase tracking-wider font-semibold">Progresso</span>
          <span className="num font-semibold">{project.progress}%</span>
        </div>
        <Progress value={project.progress} color={stColor} />
      </div>

      {project.tech?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tech.slice(0, 4).map(t => (
            <span key={t} className="num text-[10.5px] px-1.5 py-0.5 rounded text-dim" style={{ background: 'rgba(255,255,255,0.03)' }}>{t}</span>
          ))}
          {project.tech.length > 4 && <span className="num text-[10.5px] text-dim2">+{project.tech.length - 4}</span>}
        </div>
      )}

      <div className="flex items-end justify-between pt-3 border-t border-line">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-dim2 font-semibold mb-0.5">Valor total</div>
          <div className="display text-[16px] font-bold num">{fmtBRL(project.value)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10.5px] uppercase tracking-wider text-dim2 font-semibold mb-0.5">
            {project.status === 'concluido' ? 'Entregue' : 'Prazo'}
          </div>
          <div className="num text-[12.5px] font-medium"
            style={{ color: overdue ? '#ef4444' : (diff <= 7 && project.status !== 'concluido' ? '#f59e0b' : '#f0f0f0') }}>
            {project.status === 'concluido' ? fmtDate(project.deadline, 'dd/MM/yyyy') :
              overdue ? `${Math.abs(diff)} dias atrasado` :
              diff === 0 ? 'Hoje' : `${diff} dia${diff === 1 ? '' : 's'}`}
          </div>
        </div>
      </div>
    </a>
  );
};

// ── Project Modal ─────────────────────────────────────────────────────────────
type ProjectForm = Omit<Project, 'id'>;

export const ProjectModal = ({ open, onClose, project }: { open: boolean; onClose: () => void; project: Project | null }) => {
  const [form, setForm] = useState<ProjectForm | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  useState(() => {
    if (!open) return;
    setForm(project ? { ...project } : {
      name: '', client: '', type: 'Dev', status: 'aguardando', value: 0,
      start: todayISO(), deadline: toISODate(addDaysDate(new Date(), 30)),
      progress: 0, description: '', tech: [], isPortfolio: false, portfolioUrl: '', paid: 0,
    });
  });

  // Reset form when open/project changes
  const [_open, _setOpen] = useState(false);
  if (open !== _open) {
    _setOpen(open);
    if (open) {
      setForm(project ? { ...project } : {
        name: '', client: '', type: 'Dev', status: 'aguardando', value: 0,
        start: todayISO(), deadline: toISODate(addDaysDate(new Date(), 30)),
        progress: 0, description: '', tech: [], isPortfolio: false, portfolioUrl: '', paid: 0,
      });
    }
  }

  if (!form) return null;
  const set = <K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) => setForm(f => f ? { ...f, [k]: v } : f);
  const valid = form.name.trim() && form.client.trim();

  const save = async () => {
    if (!valid) return;
    if (project?.id) await projectService.update(project.id, form);
    else await projectService.create(form);
    onClose();
  };
  const remove = async () => { if (project?.id) await projectService.remove(project.id); onClose(); };

  return (
    <>
      <Modal open={open} onClose={onClose} title={project?.id ? 'Editar projeto' : 'Novo projeto'} maxWidth={620}
        footer={<>
          {project?.id && <button onClick={() => setConfirmDel(true)} className="btn btn-danger btn-sm mr-auto"><Icon name="trash" size={14} /> Excluir</button>}
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancelar</button>
          <button onClick={save} disabled={!valid} className="btn btn-primary btn-sm" style={{ opacity: valid ? 1 : 0.5 }}>Salvar</button>
        </>}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome do projeto" className="col-span-2">
              <input className="field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Alma – App de bem-estar" autoFocus />
            </Field>
            <Field label="Cliente">
              <input className="field" value={form.client} onChange={e => set('client', e.target.value)} placeholder="Nome do cliente" />
            </Field>
            <Field label="Tipo">
              <select className="field" value={form.type} onChange={e => set('type', e.target.value as Project['type'])}>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="field" value={form.status} onChange={e => set('status', e.target.value as Project['status'])}>
                {(Object.entries(PROJECT_STATUSES) as [Project['status'], { label: string }][]).map(([k, s]) =>
                  <option key={k} value={k}>{s.label}</option>
                )}
              </select>
            </Field>
            <Field label="Valor total (R$)">
              <input type="number" min="0" step="0.01" className="field num" value={form.value}
                onChange={e => set('value', Number(e.target.value))} />
            </Field>
            <Field label="Data de início">
              <input type="date" className="field" value={form.start} onChange={e => set('start', e.target.value)} />
            </Field>
            <Field label="Prazo de entrega">
              <input type="date" className="field" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </Field>
          </div>

          <Field label={`Progresso (${form.progress}%)`}>
            <Slider value={form.progress} onChange={v => set('progress', v)} />
          </Field>
          <Field label="Briefing / descrição">
            <textarea className="field" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Resumo, escopo, observações..." />
          </Field>
          <Field label="Tecnologias">
            <TagInput value={form.tech || []} onChange={v => set('tech', v)} placeholder="React, Node, Postgres..." />
          </Field>

          <div className="rounded-card p-4 flex flex-col gap-3" style={{ background: '#0e0e16', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-semibold flex items-center gap-2">
                  <Icon name="sparkle" size={14} className="text-purp" /> Projeto do portfólio?
                </div>
                <div className="text-[11.5px] text-dim mt-0.5">Aparece na vitrine do site pessoal.</div>
              </div>
              <Toggle checked={form.isPortfolio} onChange={v => set('isPortfolio', v)} />
            </div>
            {form.isPortfolio && (
              <Field label="URL no portfólio">
                <input className="field" value={form.portfolioUrl ?? ''} onChange={e => set('portfolioUrl', e.target.value)} placeholder="https://gustavo.dev/projetos/..." />
              </Field>
            )}
          </div>
        </div>
      </Modal>
      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={remove}
        title="Excluir projeto" danger confirmLabel="Excluir"
        message="Isso remove o projeto, suas tarefas do board, eventos vinculados, pagamentos e atualizações. Não pode ser desfeito." />
    </>
  );
};

export default Projetos;
