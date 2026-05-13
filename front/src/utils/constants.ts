import type { ProjectStatus, EventType, CardPriority, BoardColumn } from '@/types';

export const PROJECT_STATUSES: Record<ProjectStatus, { label: string; color: string }> = {
  em_andamento: { label: 'Em andamento', color: '#00b4d8' },
  aguardando:   { label: 'Aguardando',   color: '#f59e0b' },
  concluido:    { label: 'Concluído',    color: '#10b981' },
  pausado:      { label: 'Pausado',      color: '#8b8b9a' },
};

export const EVENT_TYPES: Record<EventType, { label: string; color: string }> = {
  reuniao:   { label: 'Reunião',   color: '#3b82f6' },
  entrega:   { label: 'Entrega',   color: '#10b981' },
  pagamento: { label: 'Pagamento', color: '#f59e0b' },
  call:      { label: 'Call',      color: '#8b5cf6' },
  pessoal:   { label: 'Pessoal',   color: '#ec4899' },
  outro:     { label: 'Outro',     color: '#8b8b9a' },
};

export const PRIORITIES: Record<CardPriority, { label: string; color: string }> = {
  baixa:   { label: 'Baixa',   color: '#8b8b9a' },
  media:   { label: 'Média',   color: '#3b82f6' },
  alta:    { label: 'Alta',    color: '#f59e0b' },
  urgente: { label: 'Urgente', color: '#ef4444' },
};

export const PROJECT_TYPES = ['Dev', 'Design', 'Consultoria', 'Outro'] as const;

export const BOARD_COLUMNS: { id: BoardColumn; label: string; icon: string }[] = [
  { id: 'backlog',  label: 'Backlog',      icon: 'list' },
  { id: 'progress', label: 'Em progresso', icon: 'refresh' },
  { id: 'done',     label: 'Feito',        icon: 'check' },
  { id: 'blocked',  label: 'Bloqueado',    icon: 'flag' },
];
