import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/store';
import type { Payment } from '@/types';

export const paymentService = {
  async list() {
    const data = await apiFetch<Payment[]>('/api/payments');
    useAppStore.setState({ payments: data });
    return data;
  },
  async create(data: Omit<Payment, 'id'>) {
    const p = await apiFetch<Payment>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    useAppStore.setState(s => ({ payments: [...s.payments, p] }));
    return p;
  },
  async update(id: string, patch: Partial<Payment>) {
    const p = await apiFetch<Payment>(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    useAppStore.setState(s => ({ payments: s.payments.map(x => x.id === id ? p : x) }));
    return p;
  },
  async markReceived(id: string) {
    const p = await apiFetch<Payment>(`/api/payments/${id}/received`, { method: 'PUT' });
    useAppStore.setState(s => ({ payments: s.payments.map(x => x.id === id ? p : x) }));
  },
  async markPending(id: string) {
    const p = await apiFetch<Payment>(`/api/payments/${id}/pending`, { method: 'PUT' });
    useAppStore.setState(s => ({ payments: s.payments.map(x => x.id === id ? p : x) }));
  },
  async remove(id: string) {
    await apiFetch(`/api/payments/${id}`, { method: 'DELETE' });
    useAppStore.setState(s => ({ payments: s.payments.filter(x => x.id !== id) }));
  },
};
