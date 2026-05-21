import { getDb } from './db';
import { STORE } from './schema';
import type { DailyChallengeRecord, DailyMode } from './types';

function storeFor(mode: DailyMode) {
  return mode === 'quiz' ? STORE.dailyQuiz : STORE.dailyLesson;
}

export async function getForDate(mode: DailyMode, dateKey: string): Promise<DailyChallengeRecord | null> {
  const db = await getDb();
  return (await db.get(storeFor(mode), dateKey)) ?? null;
}

export async function put(record: DailyChallengeRecord): Promise<void> {
  const db = await getDb();
  await db.put(storeFor(record.mode), record);
}

export async function markStarted(mode: DailyMode, dateKey: string): Promise<DailyChallengeRecord | null> {
  const existing = await getForDate(mode, dateKey);
  if (!existing) return null;

  const updated: DailyChallengeRecord = { ...existing, startedAt: existing.startedAt ?? new Date().toISOString() };
  await put(updated);
  return updated;
}

export async function markCompleted(mode: DailyMode, dateKey: string, completedAt = new Date().toISOString()): Promise<DailyChallengeRecord | null> {
  const existing = await getForDate(mode, dateKey);
  if (!existing) return null;

  const updated: DailyChallengeRecord = { ...existing, completedAt };
  await put(updated);
  return updated;
}

export async function findByUid(mode: DailyMode, uid: string): Promise<DailyChallengeRecord | null> {
  const db = await getDb();
  let cursor = await db.transaction(storeFor(mode), 'readonly').store.openCursor();
  while (cursor) {
    if (cursor.value.uid === uid) return cursor.value;
    cursor = await cursor.continue();
  }
  return null;
}
