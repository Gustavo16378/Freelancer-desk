import { useAppStore } from '@/store';
import type { Project } from '@/types';

export const projectService = {
  create: (data: Omit<Project, 'id' | 'paid'>) =>
    useAppStore.getState().createProject(data),
  update: (id: string, patch: Partial<Project>) =>
    useAppStore.getState().updateProject(id, patch),
  remove: (id: string) =>
    useAppStore.getState().removeProject(id),
};
