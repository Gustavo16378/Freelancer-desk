interface ProgressProps {
  value: number;
  color?: string;
}

const Progress = ({ value, color = '#00b4d8' }: ProgressProps) => (
  <div className="progress">
    <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
  </div>
);

export default Progress;
