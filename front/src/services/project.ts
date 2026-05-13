import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/store';
import type { Project } from '@/types';

type ApiProject = Omit<Project, 'start'> & { startDate: string };

function fromApi(raw: ApiProject): Project {
  return {
    ...raw,
    start: raw.startDate,
    value: Number(raw.value),
    paid: Number(raw.paid),
    tech: (raw as any).tech ?? [],
    isPortfolio: Boolean((raw as any).isPortfolio ?? (raw as any).portfolio),
  };
}

function toApi(data: Partial<Project>) {
  const { start, ...rest } = data as any;
  return { ...rest, startDate: start };
}

export const projectService = {
  async list() {
    const data = await apiFetch<ApiProject[]>('/api/projects');
    const projects = data.map(fromApi);
    useAppStore.setState({ projects });
    return projects;
  },
  async create(data: Omit<Project, 'id'>) {
    const raw = await apiFetch<ApiProject>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(toApi(data)),
    });
    const p = fromApi(raw);
    useAppStore.setState(s => ({ projects: [...s.projects, p] }));
    return p;
  },
  async update(id: string, patch: Partial<Project>) {
    const raw = await apiFetch<ApiProject>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApi(patch)),
    });
    const p = fromApi(raw);
    useAppStore.setState(s => ({ projects: s.projects.map(x => x.id === id ? p : x) }));
    return p;
  },
  async remove(id: string) {
    await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
    useAppStore.setState(s => ({
      projects:   s.projects.filter(x => x.id !== id),
      events:     s.events.filter(e => e.projectId !== id),
      payments:   s.payments.filter(p => p.projectId !== id),
      boardCards: s.boardCards.filter(c => c.projectId !== id),
      updates:    s.updates.filter(u => u.projectId !== id),
    }));
  },
};
