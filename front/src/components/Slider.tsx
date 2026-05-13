interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

const Slider = ({ value, onChange, min = 0, max = 100, step = 1, suffix = '%' }: SliderProps) => (
  <div className="flex items-center gap-3">
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="flex-1"
      style={{ accentColor: '#00b4d8' }}
    />
    <span className="num text-sm w-[52px] text-right">{value}{suffix}</span>
  </div>
);

export default Slider;
