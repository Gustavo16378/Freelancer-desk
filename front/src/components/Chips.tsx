import { PROJECT_STATUSES, EVENT_TYPES, PRIORITIES } from '@/utils/constants';
import type { ProjectStatus, EventType, CardPriority } from '@/types';

export const StatusChip = ({ status }: { status: ProjectStatus }) => {
  const s = PROJECT_STATUSES[status] ?? PROJECT_STATUSES.aguardando;
  return (
    <span className="chip" style={{ background: `${s.color}1A`, color: s.color }}>
      <span className="dot" style={{ background: s.color }} />{s.label}
    </span>
  );
};

export const TypeChip = ({ type }: { type: string }) => (
  <span className="chip" style={{ background: 'rgba(255,255,255,0.05)', color: '#8b8b9a' }}>
    {type}
  </span>
);

export const EventChip = ({ type }: { type: EventType }) => {
  const t = EVENT_TYPES[type] ?? EVENT_TYPES.outro;
  return (
    <span className="chip" style={{ background: `${t.color}1A`, color: t.color }}>
      <span className="dot" style={{ background: t.color }} />{t.label}
    </span>
  );
};

export const PriorityChip = ({ priority }: { priority: CardPriority }) => {
  const p = PRIORITIES[priority] ?? PRIORITIES.media;
  return (
    <span className="chip" style={{ background: `${p.color}1A`, color: p.color }}>
      {p.label}
    </span>
  );
};
