import { useState } from 'react';

interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: number;
}

const DonutChart = ({ data, size = 220, thickness = 22, centerLabel, centerValue }: DonutChartProps) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2;
  const ri = r - thickness;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  let acc = 0;
  const arcs = data.map((d) => {
    const start = (acc / total) * Math.PI * 2;
    const end = ((acc + d.value) / total) * Math.PI * 2;
    acc += d.value;
    const large = (end - start) > Math.PI ? 1 : 0;
    const x1 = r + r * Math.sin(start),  y1 = r - r * Math.cos(start);
    const x2 = r + r * Math.sin(end),    y2 = r - r * Math.cos(end);
    const xi1 = r + ri * Math.sin(end),  yi1 = r - ri * Math.cos(end);
    const xi2 = r + ri * Math.sin(start),yi2 = r - ri * Math.cos(start);
    const path = `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${xi1},${yi1} A${ri},${ri} 0 ${large} 0 ${xi2},${yi2} Z`;
    return { ...d, path, pct: d.value / total };
  });

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {arcs.map((a, i) => (
            <path key={i} d={a.path} fill={a.color}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.35}
              style={{ transition: 'opacity .15s', cursor: 'pointer' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[11px] uppercase tracking-wider text-dim font-semibold">
            {hoverIdx !== null ? data[hoverIdx].label : (centerLabel ?? 'Total')}
          </div>
          <div className="display text-[22px] font-bold num">
            {hoverIdx !== null ? data[hoverIdx].value : (centerValue ?? total)}
          </div>
          {hoverIdx !== null && (
            <div className="text-[11px] text-dim num mt-0.5">{Math.round(arcs[hoverIdx].pct * 100)}%</div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-[180px] flex flex-col gap-2.5">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-3 text-sm cursor-pointer"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{ opacity: hoverIdx === null || hoverIdx === i ? 1 : 0.5, transition: 'opacity .15s' }}
          >
            <span className="dot" style={{ background: a.color, width: 10, height: 10 }} />
            <span className="flex-1 text-ink">{a.label}</span>
            <span className="num text-dim text-[12.5px]">{Math.round(a.pct * 100)}%</span>
            <span className="num font-semibold w-9 text-right">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
