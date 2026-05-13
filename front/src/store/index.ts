import { create } from 'zustand';
import type { Project, Event, Payment, BoardCard, ProjectUpdate } from '@/types';

interface StoreState {
  projects: Project[];
  events: Event[];
  payments: Payment[];
  boardCards: BoardCard[];
  updates: ProjectUpdate[];
  loading: boolean;
}

export const useAppStore = create<StoreState>()(() => ({
  projects: [],
  events: [],
  payments: [],
  boardCards: [],
  updates: [],
  loading: true,
}));

export const useProjects    = () => useAppStore(s => s.projects);
export const useEvents      = () => useAppStore(s => s.events);
export const usePayments    = () => useAppStore(s => s.payments);
export const useBoardCards  = () => useAppStore(s => s.boardCards);
export const useUpdates     = () => useAppStore(s => s.updates);
export const useProjectById = (id: string) =>
  useAppStore(s => s.projects.find(p => p.id === id));
