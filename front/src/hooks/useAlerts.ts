import { useAppStore } from '@/store';
import type { Alert } from '@/types';
import { EVENT_TYPES } from '@/utils/constants';
import { daysBetween } from '@/utils/date';

export const useAlertsList = (): Alert[] => {
  const { events, payments, projects } = useAppStore();
  const today = new Date();
  const alerts: Alert[] = [];

  events.forEach(e => {
    const diff = daysBetween(today, e.date);
    if (diff === 0) {
      alerts.push({ id: 'e_' + e.id, title: e.title, sub: `Hoje${e.time ? ` às ${e.time}` : ''}`, color: EVENT_TYPES[e.type]?.color ?? '#3b82f6', icon: 'calendar', href: '#/agenda' });
    } else if (diff === 1) {
      alerts.push({ id: 'e_' + e.id, title: e.title, sub: `Amanhã${e.time ? ` às ${e.time}` : ''}`, color: '#3b82f6', icon: 'calendar', href: '#/agenda' });
    }
  });

  payments.filter(p => p.status === 'pendente').forEach(p => {
    const diff = daysBetween(today, p.dueDate);
    if (diff < 0) {
      alerts.push({ id: 'p_' + p.id, title: p.description, sub: `Atrasado em ${Math.abs(diff)} ${Math.abs(diff) === 1 ? 'dia' : 'dias'}`, color: '#ef4444', icon: 'money', href: '#/pagamentos' });
    } else if (diff <= 7) {
      alerts.push({ id: 'p_' + p.id, title: p.description, sub: `Vence em ${diff} ${diff === 1 ? 'dia' : 'dias'}`, color: '#f59e0b', icon: 'money', href: '#/pagamentos' });
    }
  });

  projects.filter(p => p.status === 'em_andamento' || p.status === 'aguardando').forEach(p => {
    const diff = daysBetween(today, p.deadline);
    if (diff < 0) {
      alerts.push({ id: 'd_' + p.id, title: `Prazo de "${p.name}" atrasado`, sub: `${Math.abs(diff)} ${Math.abs(diff) === 1 ? 'dia' : 'dias'} de atraso`, color: '#ef4444', icon: 'flag', href: `#/projetos/${p.id}` });
    } else if (diff <= 3) {
      alerts.push({ id: 'd_' + p.id, title: `Prazo próximo: "${p.name}"`, sub: `${diff} ${diff === 1 ? 'dia' : 'dias'} restantes`, color: '#ef4444', icon: 'flag', href: `#/projetos/${p.id}` });
    } else if (diff <= 7) {
      alerts.push({ id: 'd_' + p.id, title: `Prazo: "${p.name}"`, sub: `${diff} dias restantes`, color: '#f59e0b', icon: 'flag', href: `#/projetos/${p.id}` });
    }
  });

  return alerts.slice(0, 12);
};

export const useAlertsCount = (): number => useAlertsList().length;
