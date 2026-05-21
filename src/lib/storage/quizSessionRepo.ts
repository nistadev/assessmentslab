import { getDb } from './db';
import { INDEX, STORE } from './schema';
import type { QuizSessionRecord } from './types';
import type { QuizConfig, StoredQuizResult } from '../../components/shared/types';

export async function get(uid: string): Promise<QuizSessionRecord | null> {
  const db = await getDb();
  return (await db.get(STORE.quizSessions, uid)) ?? null;
}

export async function put(record: QuizSessionRecord): Promise<void> {
  const db = await getDb();
  await db.put(STORE.quizSessions, record);
}

export async function remove(uid: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE.quizSessions, uid);
}

export async function listRecent(limit: number): Promise<QuizSessionRecord[]> {
  if (limit <= 0) return [];

  const db = await getDb();
  const tx = db.transaction(STORE.quizSessions, 'readonly');
  const index = tx.store.index(INDEX.byLastUsed);
  const results: QuizSessionRecord[] = [];

  let cursor = await index.openCursor(null, 'prev');
  while (cursor && results.length < limit) {
    results.push(cursor.value);
    cursor = await cursor.continue();
  }

  await tx.done;
  return results;
}

export async function setQuestionIds(uid: string, questionIds: string[]): Promise<void> {
  const existing = (await get(uid)) ?? createStub(uid);
  await put({ ...existing, questionIds });
}

export async function setConfig(uid: string, config: QuizConfig): Promise<void> {
  const existing = await get(uid);
  const now = new Date().toISOString();

  await put({
    uid,
    trialCount: existing?.trialCount ?? 0,
    questionIds: existing?.questionIds,
    result: existing?.result,
    startedAt: existing?.startedAt ?? now,
    lastUsedAt: now,
    config,
  });
}

export async function setResult(uid: string, result: StoredQuizResult): Promise<void> {
  const existing = await get(uid);
  if (!existing?.config) return;

  await put({
    ...existing,
    result,
    lastUsedAt: result.finishedAt,
    trialCount: Math.max(0, existing.trialCount ?? 0) + 1,
  });
}

function createStub(uid: string): QuizSessionRecord {
  return {
    uid,
    config: {
      domains: [],
      topics: [],
      difficulties: [],
      timerMinutes: 0,
      maxQuestions: 0,
      feedbackMode: 'immediate',
      correctWeight: 0,
    },
    trialCount: 0,
  };
}
