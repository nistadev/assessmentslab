import { getDb } from './db';
import { STORE } from './schema';
import type {
  QuizConfig,
  QuizSessionRecord,
  StoredQuizResult,
  StoredStudyResult,
  StudyConfig,
  StudySessionRecord,
} from './types';
import type { QuestionDifficulty } from '../../components/shared/types';

const VALID_DIFFICULTIES: ReadonlySet<QuestionDifficulty> = new Set(['junior', 'mid', 'senior', 'principal']);

function isQuestionDifficulty(value: unknown): value is QuestionDifficulty {
  return typeof value === 'string' && VALID_DIFFICULTIES.has(value as QuestionDifficulty);
}

const QUIZ_PREFIX = 'assessmentslab.quiz.';
const STUDY_PREFIX = 'assessmentslab.study.';
const META_KEY = 'localStorageMigrated';
const MIGRATED_FLAG = 'v1';

let runOncePromise: Promise<void> | null = null;

export function runOnce(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!runOncePromise) {
    runOncePromise = doRun().catch((error) => {
      runOncePromise = null;
      throw error;
    });
  }
  return runOncePromise;
}

async function doRun(): Promise<void> {
  const db = await getDb();
  const flag = await db.get(STORE.meta, META_KEY);
  if (flag?.value === MIGRATED_FLAG) return;

  const quizRecords = collectQuizRecords();
  const studyRecords = collectStudyRecords();

  if (quizRecords.length === 0 && studyRecords.length === 0) {
    await db.put(STORE.meta, { key: META_KEY, value: MIGRATED_FLAG });
    return;
  }

  const tx = db.transaction(
    [STORE.quizSessions, STORE.studySessions, STORE.meta],
    'readwrite',
  );

  for (const record of quizRecords) {
    await tx.objectStore(STORE.quizSessions).put(record);
  }
  for (const record of studyRecords) {
    await tx.objectStore(STORE.studySessions).put(record);
  }
  await tx.objectStore(STORE.meta).put({ key: META_KEY, value: MIGRATED_FLAG });

  await tx.done;
}

function collectQuizRecords(): QuizSessionRecord[] {
  const storage = window.localStorage;
  const records: QuizSessionRecord[] = [];

  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key?.startsWith(QUIZ_PREFIX)) continue;

    const uid = key.slice(QUIZ_PREFIX.length);
    const raw = storage.getItem(key);
    if (!raw) continue;

    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      continue;
    }
    if (!parsed) continue;

    const config = parsed.config;
    if (!isValidQuizConfig(config)) continue;

    const result = isValidStoredQuizResult(parsed.result) ? (parsed.result as StoredQuizResult) : undefined;
    const questionIds = Array.isArray(parsed.questionIds)
      && parsed.questionIds.every((id) => typeof id === 'string')
        ? (parsed.questionIds as string[])
        : undefined;

    records.push({
      uid,
      config,
      result,
      questionIds,
      trialCount: Math.max(1, Number(parsed.trialCount) || 1),
      startedAt: typeof parsed.startedAt === 'string' ? parsed.startedAt : undefined,
      lastUsedAt: typeof parsed.lastUsedAt === 'string' ? parsed.lastUsedAt : undefined,
    });
  }

  return records;
}

function collectStudyRecords(): StudySessionRecord[] {
  const storage = window.localStorage;
  const records: StudySessionRecord[] = [];

  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key?.startsWith(STUDY_PREFIX)) continue;

    const uid = key.slice(STUDY_PREFIX.length);
    const raw = storage.getItem(key);
    if (!raw) continue;

    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      continue;
    }
    if (!parsed) continue;

    const config = parsed.config;
    if (!isValidStudyConfig(config)) continue;
    if (typeof parsed.startedAt !== 'string') continue;
    if (typeof parsed.lastUsedAt !== 'string') continue;

    const result = normalizeStudyResult(parsed.result);

    records.push({
      uid,
      config,
      trialCount: Math.max(1, Number(parsed.trialCount) || 1),
      startedAt: parsed.startedAt,
      lastUsedAt: parsed.lastUsedAt,
      result: result ?? undefined,
    });
  }

  return records;
}

function isValidQuizConfig(value: unknown): value is QuizConfig {
  if (!value || typeof value !== 'object') return false;
  const config = value as Partial<QuizConfig>;
  return Array.isArray(config.domains)
    && Array.isArray(config.topics)
    && Array.isArray(config.difficulties)
    && typeof config.timerMinutes === 'number'
    && typeof config.maxQuestions === 'number'
    && (config.feedbackMode === 'end' || config.feedbackMode === 'immediate');
}

function isValidStudyConfig(value: unknown): value is StudyConfig {
  if (!value || typeof value !== 'object') return false;
  const config = value as Partial<StudyConfig>;
  return Array.isArray(config.domains)
    && Array.isArray(config.topics)
    && Array.isArray(config.difficulties)
    && config.domains.every((domain) => typeof domain === 'string')
    && config.topics.every((topic) => typeof topic === 'string')
    && config.difficulties.every((difficulty) => isQuestionDifficulty(difficulty));
}

function isValidStoredQuizResult(value: unknown): value is StoredQuizResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Partial<StoredQuizResult>;
  return typeof result.score === 'number'
    && Array.isArray(result.answers)
    && typeof result.elapsedSeconds === 'number'
    && typeof result.totalSeconds === 'number'
    && typeof result.finishedAt === 'string';
}

function normalizeStudyResult(value: unknown): StoredStudyResult | null {
  if (!value || typeof value !== 'object') return null;
  const result = value as Partial<StoredStudyResult>;
  const updatedAt =
    typeof result.updatedAt === 'string'
      ? result.updatedAt
      : typeof result.finishedAt === 'string'
        ? result.finishedAt
        : null;

  if (!(typeof result.elapsedSeconds === 'number'
    && Number.isFinite(result.elapsedSeconds)
    && result.elapsedSeconds >= 0
    && typeof result.lessonCount === 'number'
    && Number.isFinite(result.lessonCount)
    && result.lessonCount >= 0
    && updatedAt
    && (typeof result.finishedAt === 'undefined' || typeof result.finishedAt === 'string'))) {
    return null;
  }

  return {
    elapsedSeconds: result.elapsedSeconds,
    lessonCount: result.lessonCount,
    updatedAt,
    finishedAt: result.finishedAt,
  };
}
