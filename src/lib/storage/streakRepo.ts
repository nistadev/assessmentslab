import { getDb } from './db';
import { STORE } from './schema';
import type { DailyMode, StreakRecord } from './types';

export async function get(mode: DailyMode): Promise<StreakRecord> {
  const db = await getDb();
  const existing = await db.get(STORE.streaks, mode);
  return existing ?? { mode, current: 0, longest: 0, lastCompletedDate: null };
}

export async function put(record: StreakRecord): Promise<void> {
  const db = await getDb();
  await db.put(STORE.streaks, record);
}

export async function apply(mode: DailyMode, todayKey: string, prevKey: string): Promise<StreakRecord> {
  const existing = await get(mode);

  if (existing.lastCompletedDate === todayKey) {
    return existing;
  }

  const nextCurrent = existing.lastCompletedDate === prevKey ? existing.current + 1 : 1;
  const next: StreakRecord = {
    mode,
    current: nextCurrent,
    longest: Math.max(existing.longest, nextCurrent),
    lastCompletedDate: todayKey,
  };

  await put(next);
  return next;
}
