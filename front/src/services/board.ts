import { useAppStore } from '@/store';
import type { BoardCard } from '@/types';

export const boardService = {
  create: (data: Omit<BoardCard, 'id'>) =>
    useAppStore.getState().createCard(data),
  update: (id: string, patch: Partial<BoardCard>) =>
    useAppStore.getState().updateCard(id, patch),
  remove: (id: string) =>
    useAppStore.getState().removeCard(id),
  move: (id: string, column: BoardCard['column']) =>
    useAppStore.getState().moveCard(id, column),
};
