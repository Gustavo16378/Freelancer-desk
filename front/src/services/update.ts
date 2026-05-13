import { useAppStore } from '@/store';
import type { ProjectUpdate } from '@/types';

export const updateService = {
  create: (projectId: string, text: string) =>
    useAppStore.getState().createUpdate(projectId, text),
  update: (id: string, patch: Partial<ProjectUpdate>) =>
    useAppStore.getState().updateUpdate(id, patch),
  remove: (id: string) =>
    useAppStore.getState().removeUpdate(id),
};
