import { cx } from '@/utils/misc';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 group">
    <span className={cx('relative inline-block w-[38px] h-[22px] rounded-full transition-colors', checked ? 'bg-cyan' : 'bg-surf3')}>
      <span className={cx('absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white transition-all', checked ? 'left-[19px]' : 'left-[3px]')} />
    </span>
    {label && <span className="text-sm text-ink">{label}</span>}
  </button>
);

export default Toggle;
