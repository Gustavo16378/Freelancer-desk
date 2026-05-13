import Icon from './Icon';

interface EmptyProps {
  icon?: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}

const Empty = ({ icon = 'sparkle', title, hint, action }: EmptyProps) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-surf2 text-dim mb-3">
      <Icon name={icon} size={22} />
    </span>
    <div className="display text-[15px] font-semibold mb-1">{title}</div>
    {hint && <p className="text-[13px] text-dim max-w-[280px] leading-relaxed">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default Empty;
