import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/store';
import type { ProjectUpdate } from '@/types';

type ApiUpdate = Omit<ProjectUpdate, 'at'> & { createdAt: string };

function fromApi(raw: ApiUpdate): ProjectUpdate {
  return { id: raw.id, projectId: raw.projectId, text: raw.text, at: raw.createdAt };
}

export const updateService = {
  async list() {
    const data = await apiFetch<ApiUpdate[]>('/api/updates');
    const updates = data.map(fromApi);
    useAppStore.setState({ updates });
    return updates;
  },
  async create(projectId: string, text: string) {
    const raw = await apiFetch<ApiUpdate>('/api/updates', {
      method: 'POST',
      body: JSON.stringify({ projectId, text }),
    });
    const u = fromApi(raw);
    useAppStore.setState(s => ({ updates: [u, ...s.updates] }));
    return u;
  },
  async update(id: string, patch: Partial<ProjectUpdate>) {
    const raw = await apiFetch<ApiUpdate>(`/api/updates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    const u = fromApi(raw);
    useAppStore.setState(s => ({ updates: s.updates.map(x => x.id === id ? u : x) }));
    return u;
  },
  async remove(id: string) {
    await apiFetch(`/api/updates/${id}`, { method: 'DELETE' });
    useAppStore.setState(s => ({ updates: s.updates.filter(x => x.id !== id) }));
  },
};
