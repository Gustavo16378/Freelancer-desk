import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/store';
import type { BoardCard } from '@/types';

export const boardService = {
  async list() {
    const data = await apiFetch<BoardCard[]>('/api/board-cards');
    useAppStore.setState({ boardCards: data });
    return data;
  },
  async create(data: Omit<BoardCard, 'id'>) {
    const c = await apiFetch<BoardCard>('/api/board-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    useAppStore.setState(s => ({ boardCards: [...s.boardCards, c] }));
    return c;
  },
  async update(id: string, patch: Partial<BoardCard>) {
    const c = await apiFetch<BoardCard>(`/api/board-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    useAppStore.setState(s => ({ boardCards: s.boardCards.map(x => x.id === id ? c : x) }));
    return c;
  },
  async move(id: string, column: BoardCard['column']) {
    const c = await apiFetch<BoardCard>(`/api/board-cards/${id}/move`, {
      method: 'PUT',
      body: JSON.stringify({ column }),
    });
    useAppStore.setState(s => ({ boardCards: s.boardCards.map(x => x.id === id ? c : x) }));
    return c;
  },
  async remove(id: string) {
    await apiFetch(`/api/board-cards/${id}`, { method: 'DELETE' });
    useAppStore.setState(s => ({ boardCards: s.boardCards.filter(x => x.id !== id) }));
  },
};
