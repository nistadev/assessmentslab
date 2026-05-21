export function todayKey(now: Date = new Date()): string {
  return formatLocalDate(now);
}

export function previousKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function compareDateKey(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
