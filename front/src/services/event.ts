import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/store';
import type { Event } from '@/types';

export const eventService = {
  async list() {
    const data = await apiFetch<Event[]>('/api/events');
    useAppStore.setState({ events: data });
    return data;
  },
  async create(data: Omit<Event, 'id'>) {
    const e = await apiFetch<Event>('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    useAppStore.setState(s => ({ events: [...s.events, e] }));
    return e;
  },
  async update(id: string, patch: Partial<Event>) {
    const e = await apiFetch<Event>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    useAppStore.setState(s => ({ events: s.events.map(x => x.id === id ? e : x) }));
    return e;
  },
  async remove(id: string) {
    await apiFetch(`/api/events/${id}`, { method: 'DELETE' });
    useAppStore.setState(s => ({ events: s.events.filter(x => x.id !== id) }));
  },
};
