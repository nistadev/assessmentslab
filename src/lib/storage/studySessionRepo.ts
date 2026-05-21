import { getDb } from './db';
import { INDEX, STORE } from './schema';
import type { StudySessionRecord } from './types';
import type { StoredStudyResult, StudyConfig } from '../../components/shared/types';

export async function get(uid: string): Promise<StudySessionRecord | null> {
  const db = await getDb();
  return (await db.get(STORE.studySessions, uid)) ?? null;
}

export async function put(record: StudySessionRecord): Promise<void> {
  const db = await getDb();
  await db.put(STORE.studySessions, record);
}

export async function remove(uid: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE.studySessions, uid);
}

export async function listRecent(limit: number): Promise<StudySessionRecord[]> {
  if (limit <= 0) return [];

  const db = await getDb();
  const tx = db.transaction(STORE.studySessions, 'readonly');
  const index = tx.store.index(INDEX.byLastUsed);
  const results: StudySessionRecord[] = [];

  let cursor = await index.openCursor(null, 'prev');
  while (cursor && results.length < limit) {
    results.push(cursor.value);
    cursor = await cursor.continue();
  }

  await tx.done;
  return results;
}

export async function writeSession(uid: string, config: StudyConfig): Promise<void> {
  const existing = await get(uid);
  const now = new Date().toISOString();

  await put({
    uid,
    config,
    startedAt: existing?.startedAt ?? now,
    lastUsedAt: now,
    trialCount: Math.max(0, existing?.trialCount ?? 0) + 1,
    result: existing?.result,
  });
}

export async function setResult(uid: string, result: StoredStudyResult): Promise<StoredStudyResult> {
  const existing = await get(uid);
  if (!existing) return result;

  await put({
    ...existing,
    result,
    lastUsedAt: result.finishedAt ?? result.updatedAt,
  });

  return result;
}
