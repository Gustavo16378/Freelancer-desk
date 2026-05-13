import { useAppStore } from '@/store';
import type { Event } from '@/types';

export const eventService = {
  create: (data: Omit<Event, 'id'>) =>
    useAppStore.getState().createEvent(data),
  update: (id: string, patch: Partial<Event>) =>
    useAppStore.getState().updateEvent(id, patch),
  remove: (id: string) =>
    useAppStore.getState().removeEvent(id),
};
