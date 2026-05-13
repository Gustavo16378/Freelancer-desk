interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const Sparkline = ({ data, width = 120, height = 40, color = '#00b4d8' }: SparklineProps) => {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2] as [number, number]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const fill = `M0,${height} ${pts.map(p => `L${p[0]},${p[1]}`).join(' ')} L${width},${height} Z`;
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="sparkfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sparkfade)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export default Sparkline;
