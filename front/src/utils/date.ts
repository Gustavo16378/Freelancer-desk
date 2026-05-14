export const PT_MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
export const PT_MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
export const PT_WEEKDAYS = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
export const PT_WEEKDAYS_SHORT = ['dom','seg','ter','qua','qui','sex','sáb'];

function pad(n: number): string { return String(n).padStart(2, '0'); }

export function parseDate(d: Date | string | number | null | undefined): Date {
  if (d instanceof Date) return d;
  if (!d) return new Date(NaN);
  if (typeof d === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, da] = d.split('-').map(Number);
      return new Date(y, m - 1, da);
    }
    return new Date(d);
  }
  return new Date(d);
}

export function toISODate(d: Date | string): string {
  const x = parseDate(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}

export function fmtDate(d: Date | string | null | undefined, fmt = 'dd/MM/yyyy'): string {
  const x = parseDate(d as string);
  if (!x || isNaN(x.getTime())) return '';
  const Y = x.getFullYear();
  const M = x.getMonth();
  const D = x.getDate();
  const w = x.getDay();
  const h = x.getHours();
  const min = x.getMinutes();
  const tokens: Record<string, string> = {
    yyyy: String(Y), MMMM: PT_MONTHS[M], MMM: PT_MONTHS_SHORT[M], MM: pad(M + 1),
    EEEE: PT_WEEKDAYS[w], EEE: PT_WEEKDAYS_SHORT[w],
    HH: pad(h), mm: pad(min), dd: pad(D), d: String(D),
  };
  return fmt.replace(/yyyy|MMMM|MMM|MM|EEEE|EEE|HH|mm|dd|d/g, t => tokens[t]);
}

export function startOfMonth(d: Date): Date {
  const x = parseDate(d);
  return new Date(x.getFullYear(), x.getMonth(), 1);
}
export function endOfMonth(d: Date): Date {
  const x = parseDate(d);
  return new Date(x.getFullYear(), x.getMonth() + 1, 0);
}
export function startOfWeek(d: Date): Date {
  const x = parseDate(d);
  const r = new Date(x);
  r.setDate(x.getDate() - x.getDay());
  r.setHours(0, 0, 0, 0);
  return r;
}
export function addDaysDate(d: Date, n: number): Date {
  const x = parseDate(d);
  const r = new Date(x);
  r.setDate(x.getDate() + n);
  return r;
}
export function addMonths(d: Date, n: number): Date {
  const x = parseDate(d);
  return new Date(x.getFullYear(), x.getMonth() + n, x.getDate());
}
export function isSameDay(a: Date, b: Date): boolean {
  const x = parseDate(a), y = parseDate(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}
export function isSameMonth(a: Date, b: Date): boolean {
  const x = parseDate(a), y = parseDate(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth();
}
export function daysBetween(a: Date | string, b: Date | string): number {
  const x = parseDate(a as string); x.setHours(0, 0, 0, 0);
  const y = parseDate(b as string); y.setHours(0, 0, 0, 0);
  return Math.round((y.getTime() - x.getTime()) / 86400000);
}
export function todayISO(): string { return toISODate(new Date()); }
