export interface Holiday { date: string; name: string; }

function pad(n: number) { return String(n).padStart(2, '0'); }

function easter(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(year, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1);
}

function shift(d: Date, n: number): string {
  const r = new Date(d);
  r.setDate(d.getDate() + n);
  return `${r.getFullYear()}-${pad(r.getMonth() + 1)}-${pad(r.getDate())}`;
}

function fixed(y: number, m: number, d: number) { return `${y}-${pad(m)}-${pad(d)}`; }

const cache = new Map<number, Holiday[]>();

export function getHolidays(year: number): Holiday[] {
  if (cache.has(year)) return cache.get(year)!;
  const e = easter(year);
  const list: Holiday[] = [
    { date: fixed(year, 1, 1),   name: 'Confraternização Universal' },
    { date: shift(e, -48),       name: 'Carnaval' },
    { date: shift(e, -47),       name: 'Carnaval' },
    { date: shift(e, -2),        name: 'Sexta-feira Santa' },
    { date: shift(e, 0),         name: 'Páscoa' },
    { date: fixed(year, 4, 21),  name: 'Tiradentes' },
    { date: fixed(year, 5, 1),   name: 'Dia do Trabalho' },
    { date: shift(e, 60),        name: 'Corpus Christi' },
    { date: fixed(year, 9, 7),   name: 'Independência do Brasil' },
    { date: fixed(year, 10, 12), name: 'N. Sra. Aparecida' },
    { date: fixed(year, 11, 2),  name: 'Finados' },
    { date: fixed(year, 11, 15), name: 'Proclamação da República' },
    { date: fixed(year, 11, 20), name: 'Consciência Negra' },
    { date: fixed(year, 12, 25), name: 'Natal' },
  ].sort((a, b) => a.date.localeCompare(b.date));
  cache.set(year, list);
  return list;
}

export function holidaysOn(date: string): Holiday[] {
  const year = parseInt(date.slice(0, 4), 10);
  return getHolidays(year).filter(h => h.date === date);
}
