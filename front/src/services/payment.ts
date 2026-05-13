import { useAppStore } from '@/store';
import type { Payment } from '@/types';

export const paymentService = {
  create: (data: Omit<Payment, 'id'>) =>
    useAppStore.getState().createPayment(data),
  update: (id: string, patch: Partial<Payment>) =>
    useAppStore.getState().updatePayment(id, patch),
  markReceived: (id: string) =>
    useAppStore.getState().markPaymentReceived(id),
  markPending: (id: string) =>
    useAppStore.getState().markPaymentPending(id),
  remove: (id: string) =>
    useAppStore.getState().removePayment(id),
};
