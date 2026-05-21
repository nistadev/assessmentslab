import { dailyChallenges, runMigrations, streaks, type DailyMode } from '../storage';
import { previousKey, todayKey } from './dateKey';

export async function recordDailyCompletion(mode: DailyMode, uid: string): Promise<void> {
  if (!uid) return;
  await runMigrations();

  const today = todayKey();
  const record = await dailyChallenges.getForDate(mode, today);
  if (!record || record.uid !== uid) return;
  if (record.completedAt) return;

  await dailyChallenges.markCompleted(mode, today);
  await streaks.apply(mode, today, previousKey(today));
}
