import { useRef, useState, useEffect } from 'react';
import { fmtBRLcompact } from '@/utils/misc';

const CHART_GRID = 'rgba(255,255,255,0.05)';
const CHART_TEXT = '#8b8b9a';

interface BarDatum {
  label: string;
  value?: number;
  color?: string;
  [key: string]: unknown;
}

interface MultiBar {
  key: string;
  label: string;
  color: string;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  color?: string;
  currency?: boolean;
  multiBars?: MultiBar[];
}

const BarChart = ({ data, height = 240, color = '#00b4d8', currency = false, multiBars }: BarChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    ro.observe(ref.current);
    setW(ref.current.clientWidth);
    return () => ro.disconnect();
  }, []);

  const padL = 50, padR = 16, padT = 16, padB = 36;
  const innerW = Math.max(50, w - padL - padR);
  const innerH = height - padT - padB;

  const allValues = multiBars
    ? data.flatMap(d => multiBars.map(b => (d[b.key] as number) || 0))
    : data.map(d => d.value ?? 0);
  const maxV = Math.max(1, ...allValues);
  const niceMax = Math.ceil(maxV / 1000) * 1000 || maxV;
  const ticks = 4;

  const fmt = (v: number) => currency ? fmtBRLcompact(v) : String(v);

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      <svg width={w} height={height}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const y = padT + (innerH * i) / ticks;
          const v = niceMax - (niceMax * i) / ticks;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke={CHART_GRID} />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={11} fill={CHART_TEXT} fontFamily="JetBrains Mono">{fmt(v)}</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const slotW = innerW / data.length;
          const slotX = padL + i * slotW;
          if (multiBars) {
            const bw = (slotW * 0.7) / multiBars.length;
            return (
              <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                <rect x={slotX} y={padT} width={slotW} height={innerH} fill={hoverIdx === i ? 'rgba(255,255,255,0.025)' : 'transparent'} />
                {multiBars.map((b, j) => {
                  const v = (d[b.key] as number) || 0;
                  const h = (v / niceMax) * innerH;
                  const x = slotX + slotW * 0.15 + j * bw;
                  return (
                    <rect key={b.key} x={x} y={padT + innerH - h} width={bw - 4} height={h} fill={b.color || color} rx={3}
                      opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.4} />
                  );
                })}
                <text x={slotX + slotW / 2} y={padT + innerH + 20} textAnchor="middle" fontSize={11} fill={CHART_TEXT}>{d.label}</text>
              </g>
            );
          }
          const bw = slotW * 0.55;
          const x = slotX + (slotW - bw) / 2;
          const h = ((d.value ?? 0) / niceMax) * innerH;
          return (
            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
              <rect x={slotX} y={padT} width={slotW} height={innerH} fill={hoverIdx === i ? 'rgba(255,255,255,0.025)' : 'transparent'} />
              <rect x={x} y={padT + innerH - h} width={bw} height={h} fill={d.color || color} rx={4}
                opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.5} />
              <text x={slotX + slotW / 2} y={padT + innerH + 20} textAnchor="middle" fontSize={11} fill={CHART_TEXT}>{d.label}</text>
            </g>
          );
        })}

        {hoverIdx !== null && (() => {
          const d = data[hoverIdx];
          const slotW = innerW / data.length;
          const cx = padL + hoverIdx * slotW + slotW / 2;
          const tx = Math.min(w - 130, Math.max(padL, cx - 60));
          return (
            <foreignObject x={tx} y={padT} width={140} height={multiBars ? 24 + multiBars.length * 16 : 44}>
              <div className="tip">
                <div className="text-dim text-[11px] mb-0.5">{d.label}</div>
                {multiBars ? multiBars.map(b => (
                  <div key={b.key} className="flex items-center gap-1.5 text-[12px]">
                    <span className="dot" style={{ background: b.color }} />
                    <span className="text-dim">{b.label}:</span>
                    <span className="num font-semibold">{fmt((d[b.key] as number) || 0)}</span>
                  </div>
                )) : (
                  <div className="num font-semibold text-[13px]">{fmt(d.value ?? 0)}</div>
                )}
              </div>
            </foreignObject>
          );
        })()}
      </svg>
    </div>
  );
};

export default BarChart;
