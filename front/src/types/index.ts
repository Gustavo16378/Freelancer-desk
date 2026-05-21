export interface Project {
  id: string;
  name: string;
  client: string;
  type: 'Dev' | 'Design' | 'Consultoria' | 'Outro';
  status: 'em_andamento' | 'aguardando' | 'concluido' | 'pausado';
  value: number;
  paid: number;
  start: string;
  deadline: string;
  progress: number;
  description: string;
  tech: string[];
  isPortfolio: boolean;
  portfolioUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'reuniao' | 'entrega' | 'pagamento' | 'call' | 'pessoal' | 'outro';
  projectId: string | null;
  notes: string;
}

export interface Payment {
  id: string;
  projectId?: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'pendente' | 'recebido';
  paidAt?: string;
  category: 'projeto' | 'suporte' | 'outro';
}

export interface BoardCard {
  id: string;
  projectId: string;
  column: 'backlog' | 'progress' | 'done' | 'blocked';
  title: string;
  desc: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  due: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  text: string;
  at: string;
}

export interface AppState {
  projects: Project[];
  events: Event[];
  payments: Payment[];
  boardCards: BoardCard[];
  updates: ProjectUpdate[];
}

export interface Alert {
  id: string;
  title: string;
  sub: string;
  color: string;
  icon: string;
  href: string;
}

export type ProjectStatus = Project['status'];
export type EventType = Event['type'];
export type CardPriority = BoardCard['priority'];
export type BoardColumn = BoardCard['column'];
