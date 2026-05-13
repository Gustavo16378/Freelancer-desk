import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Event, Payment, BoardCard, ProjectUpdate } from '@/types';
import { uid, toISODate, addDays } from '@/utils/misc';

// ── Seed data ────────────────────────────────────────────────────────────────
function seedData() {
  const today = new Date();
  const iso = (offset: number) => toISODate(addDays(today, offset));

  const projects: Project[] = [
    {
      id: 'p_alma', name: 'Alma – App de bem-estar', client: 'Alma Health',
      type: 'Dev', status: 'em_andamento', value: 28500, paid: 14250,
      start: iso(-40), deadline: iso(7), progress: 62,
      description: 'PWA com Next.js, integração com wearables e dashboard de hábitos.',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
      isPortfolio: true, portfolioUrl: 'https://gustavo.dev/projetos/alma',
    },
    {
      id: 'p_pulse', name: 'Pulse – CRM B2B', client: 'Pulse SaaS',
      type: 'Dev', status: 'em_andamento', value: 42000, paid: 21000,
      start: iso(-22), deadline: iso(18), progress: 38,
      description: 'Reformulação do dashboard principal e fluxo de onboarding.',
      tech: ['React', 'Node', 'Postgres', 'Redis'],
      isPortfolio: false,
    },
    {
      id: 'p_arq', name: 'Estúdio Arq – Site institucional', client: 'Estúdio Arquitetos',
      type: 'Dev', status: 'aguardando', value: 9800, paid: 0,
      start: iso(-5), deadline: iso(35), progress: 12,
      description: 'Site one-page com galeria de projetos e CMS leve.',
      tech: ['Astro', 'Tailwind', 'Sanity'],
      isPortfolio: false,
    },
    {
      id: 'p_marca', name: 'Identidade marca pessoal', client: 'Camila Reis',
      type: 'Design', status: 'pausado', value: 4200, paid: 1500,
      start: iso(-60), deadline: iso(20), progress: 45,
      description: 'Logo, paleta, tipografia e aplicações para coach executiva.',
      tech: ['Figma', 'Illustrator'],
      isPortfolio: false,
    },
    {
      id: 'p_norte', name: 'Norte – Landing v2', client: 'Norte Investimentos',
      type: 'Dev', status: 'concluido', value: 12500, paid: 12500,
      start: iso(-95), deadline: iso(-10), progress: 100,
      description: 'Landing page de captação com animações e form integrado ao RD.',
      tech: ['Next.js', 'Framer Motion', 'RD Station'],
      isPortfolio: true, portfolioUrl: 'https://gustavo.dev/projetos/norte',
    },
    {
      id: 'p_consult', name: 'Consultoria arquitetura', client: 'TechFarm',
      type: 'Consultoria', status: 'em_andamento', value: 6000, paid: 3000,
      start: iso(-12), deadline: iso(2), progress: 70,
      description: 'Auditoria de stack e plano de migração para microsserviços.',
      tech: ['AWS', 'Terraform', 'Docs'],
      isPortfolio: false,
    },
  ];

  const events: Event[] = [
    { id: uid('e'), title: 'Daily Alma', date: iso(0), time: '09:30', type: 'call', projectId: 'p_alma', notes: 'Revisar PRs da semana.' },
    { id: uid('e'), title: 'Entrega Sprint Pulse', date: iso(0), time: '17:00', type: 'entrega', projectId: 'p_pulse', notes: '' },
    { id: uid('e'), title: 'Kickoff Estúdio Arq', date: iso(1), time: '14:00', type: 'reuniao', projectId: 'p_arq', notes: 'Definir escopo e cronograma.' },
    { id: uid('e'), title: 'Recebimento Alma – parcela 2', date: iso(2), time: '', type: 'pagamento', projectId: 'p_alma', notes: '' },
    { id: uid('e'), title: 'Review com cliente Pulse', date: iso(3), time: '10:00', type: 'reuniao', projectId: 'p_pulse', notes: '' },
    { id: uid('e'), title: 'Entrega Consultoria TechFarm', date: iso(2), time: '18:00', type: 'entrega', projectId: 'p_consult', notes: 'Documento final + apresentação.' },
    { id: uid('e'), title: 'Café com Camila', date: iso(5), time: '15:30', type: 'pessoal', projectId: null, notes: '' },
    { id: uid('e'), title: 'Call Alma – wearables API', date: iso(-2), time: '11:00', type: 'call', projectId: 'p_alma', notes: '' },
    { id: uid('e'), title: 'Pagamento Pulse – parcela 1', date: iso(-6), time: '', type: 'pagamento', projectId: 'p_pulse', notes: '' },
    { id: uid('e'), title: 'Sessão de foco – refactor', date: iso(7), time: '08:00', type: 'outro', projectId: 'p_pulse', notes: '' },
    { id: uid('e'), title: 'Reunião Norte – case', date: iso(10), time: '16:00', type: 'reuniao', projectId: 'p_norte', notes: '' },
  ];

  const payments: Payment[] = [
    { id: uid('pg'), projectId: 'p_alma', description: 'Alma – parcela 2/4', value: 7125, dueDate: iso(2), status: 'pendente' },
    { id: uid('pg'), projectId: 'p_pulse', description: 'Pulse – parcela 2/4', value: 10500, dueDate: iso(-3), status: 'pendente' },
    { id: uid('pg'), projectId: 'p_consult', description: 'Consultoria TechFarm – final', value: 3000, dueDate: iso(8), status: 'pendente' },
    { id: uid('pg'), projectId: 'p_arq', description: 'Estúdio Arq – entrada', value: 2940, dueDate: iso(12), status: 'pendente' },
    { id: uid('pg'), projectId: 'p_alma', description: 'Alma – parcela 1/4', value: 7125, dueDate: iso(-25), status: 'recebido', paidAt: iso(-23) },
    { id: uid('pg'), projectId: 'p_pulse', description: 'Pulse – parcela 1/4', value: 10500, dueDate: iso(-6), status: 'recebido', paidAt: iso(-6) },
    { id: uid('pg'), projectId: 'p_norte', description: 'Norte – final', value: 6250, dueDate: iso(-15), status: 'recebido', paidAt: iso(-15) },
    { id: uid('pg'), projectId: 'p_norte', description: 'Norte – parcela 1', value: 6250, dueDate: iso(-70), status: 'recebido', paidAt: iso(-68) },
    { id: uid('pg'), projectId: 'p_marca', description: 'Marca – entrada', value: 1500, dueDate: iso(-50), status: 'recebido', paidAt: iso(-48) },
    { id: uid('pg'), projectId: 'p_consult', description: 'Consultoria – entrada', value: 3000, dueDate: iso(-10), status: 'recebido', paidAt: iso(-9) },
  ];

  const boardCards: BoardCard[] = [
    { id: uid('c'), projectId: 'p_alma', column: 'progress', title: 'Integração API Garmin', desc: 'Endpoint /sync + retry exponencial', priority: 'alta', due: iso(3) },
    { id: uid('c'), projectId: 'p_alma', column: 'progress', title: 'Onboarding com 3 passos', desc: '', priority: 'media', due: iso(5) },
    { id: uid('c'), projectId: 'p_alma', column: 'done', title: 'Setup do design system', desc: 'Tokens + componentes base', priority: 'media', due: '' },
    { id: uid('c'), projectId: 'p_alma', column: 'done', title: 'Auth + flows magic link', desc: '', priority: 'alta', due: '' },
    { id: uid('c'), projectId: 'p_alma', column: 'backlog', title: 'Push notifications', desc: 'iOS + Android via Expo', priority: 'baixa', due: iso(14) },
    { id: uid('c'), projectId: 'p_alma', column: 'backlog', title: 'Tela de relatório semanal', desc: '', priority: 'media', due: iso(10) },
    { id: uid('c'), projectId: 'p_alma', column: 'blocked', title: 'Permissões HealthKit (cliente)', desc: 'Aguardando aprovação da Apple', priority: 'urgente', due: iso(7) },
    { id: uid('c'), projectId: 'p_pulse', column: 'progress', title: 'Refactor pipeline de leads', desc: '', priority: 'urgente', due: iso(4) },
    { id: uid('c'), projectId: 'p_pulse', column: 'backlog', title: 'Filtros avançados na listagem', desc: '', priority: 'media', due: iso(11) },
    { id: uid('c'), projectId: 'p_pulse', column: 'done', title: 'Login SSO Google', desc: '', priority: 'alta', due: '' },
    { id: uid('c'), projectId: 'p_arq', column: 'backlog', title: 'Briefing inicial', desc: 'Reunião + mood board', priority: 'media', due: iso(2) },
    { id: uid('c'), projectId: 'p_consult', column: 'progress', title: 'Plano de migração – escrita', desc: '', priority: 'alta', due: iso(2) },
  ];

  const updates: ProjectUpdate[] = [
    { id: uid('u'), projectId: 'p_alma', text: 'Concluí a integração com Garmin em ambiente de staging. Falta validar latência.', at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: uid('u'), projectId: 'p_alma', text: 'Reunião com PM da Alma – escopo do MVP fechado em 4 telas principais.', at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: uid('u'), projectId: 'p_alma', text: 'Iniciei o projeto. Stack: Next 14 + Supabase. Repositório criado.', at: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: uid('u'), projectId: 'p_pulse', text: 'Refactor do pipeline de leads em progresso. ETA: sexta-feira.', at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: uid('u'), projectId: 'p_consult', text: 'Draft do documento final pronto. Revisar com o time.', at: new Date(Date.now() - 1 * 86400000).toISOString() },
  ];

  return { projects, events, payments, boardCards, updates };
}

// ── Store interface ───────────────────────────────────────────────────────────
interface StoreState {
  projects: Project[];
  events: Event[];
  payments: Payment[];
  boardCards: BoardCard[];
  updates: ProjectUpdate[];

  // Project actions
  createProject: (data: Omit<Project, 'id' | 'paid'>) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Event actions
  createEvent: (data: Omit<Event, 'id'>) => Event;
  updateEvent: (id: string, patch: Partial<Event>) => void;
  removeEvent: (id: string) => void;

  // Payment actions
  createPayment: (data: Omit<Payment, 'id'>) => Payment;
  updatePayment: (id: string, patch: Partial<Payment>) => void;
  markPaymentReceived: (id: string) => void;
  markPaymentPending: (id: string) => void;
  removePayment: (id: string) => void;

  // Board actions
  createCard: (data: Omit<BoardCard, 'id'>) => BoardCard;
  updateCard: (id: string, patch: Partial<BoardCard>) => void;
  removeCard: (id: string) => void;
  moveCard: (id: string, column: BoardCard['column']) => void;

  // Update actions
  createUpdate: (projectId: string, text: string) => ProjectUpdate;
  updateUpdate: (id: string, patch: Partial<ProjectUpdate>) => void;
  removeUpdate: (id: string) => void;

  // Dev
  resetStore: () => void;
}

// ── Zustand store ─────────────────────────────────────────────────────────────
export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...seedData(),

      createProject(data) {
        const p: Project = { id: uid('p'), paid: 0, ...data };
        set(s => ({ projects: [...s.projects, p] }));
        return p;
      },
      updateProject(id, patch) {
        set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, ...patch } : p) }));
      },
      removeProject(id) {
        set(s => ({
          projects: s.projects.filter(p => p.id !== id),
          events: s.events.filter(e => e.projectId !== id),
          payments: s.payments.filter(pg => pg.projectId !== id),
          boardCards: s.boardCards.filter(c => c.projectId !== id),
          updates: s.updates.filter(u => u.projectId !== id),
        }));
      },

      createEvent(data) {
        const e: Event = { id: uid('e'), ...data };
        set(s => ({ events: [...s.events, e] }));
        return e;
      },
      updateEvent(id, patch) {
        set(s => ({ events: s.events.map(e => e.id === id ? { ...e, ...patch } : e) }));
      },
      removeEvent(id) {
        set(s => ({ events: s.events.filter(e => e.id !== id) }));
      },

      createPayment(data) {
        const p: Payment = { id: uid('pg'), ...data };
        set(s => ({ payments: [...s.payments, p] }));
        return p;
      },
      updatePayment(id, patch) {
        set(s => ({ payments: s.payments.map(p => p.id === id ? { ...p, ...patch } : p) }));
      },
      markPaymentReceived(id) {
        const today = toISODate(new Date());
        set(s => ({ payments: s.payments.map(p => p.id === id ? { ...p, status: 'recebido', paidAt: today } : p) }));
      },
      markPaymentPending(id) {
        set(s => ({
          payments: s.payments.map(p => {
            if (p.id !== id) return p;
            const { paidAt: _, ...rest } = p;
            return { ...rest, status: 'pendente' };
          }),
        }));
      },
      removePayment(id) {
        set(s => ({ payments: s.payments.filter(p => p.id !== id) }));
      },

      createCard(data) {
        const c: BoardCard = { id: uid('c'), ...data };
        set(s => ({ boardCards: [...s.boardCards, c] }));
        return c;
      },
      updateCard(id, patch) {
        set(s => ({ boardCards: s.boardCards.map(c => c.id === id ? { ...c, ...patch } : c) }));
      },
      removeCard(id) {
        set(s => ({ boardCards: s.boardCards.filter(c => c.id !== id) }));
      },
      moveCard(id, column) {
        set(s => ({ boardCards: s.boardCards.map(c => c.id === id ? { ...c, column } : c) }));
      },

      createUpdate(projectId, text) {
        const u: ProjectUpdate = { id: uid('u'), projectId, text, at: new Date().toISOString() };
        set(s => ({ updates: [u, ...s.updates] }));
        return u;
      },
      updateUpdate(id, patch) {
        set(s => ({ updates: s.updates.map(u => u.id === id ? { ...u, ...patch } : u) }));
      },
      removeUpdate(id) {
        set(s => ({ updates: s.updates.filter(u => u.id !== id) }));
      },

      resetStore() {
        set(seedData());
      },
    }),
    {
      name: 'freelancer.desk.v1',
    }
  )
);

// ── Selector hooks ────────────────────────────────────────────────────────────
export const useProjects = () => useAppStore(s => s.projects);
export const useEvents = () => useAppStore(s => s.events);
export const usePayments = () => useAppStore(s => s.payments);
export const useBoardCards = () => useAppStore(s => s.boardCards);
export const useUpdates = () => useAppStore(s => s.updates);
export const useProjectById = (id: string) =>
  useAppStore(s => s.projects.find(p => p.id === id));
