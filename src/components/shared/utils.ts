import type {
  FeedbackMode,
  Question,
  QuestionDifficulty,
  QuizConfig,
  ShuffledQuestion,
  StudyConfig,
  StudyLesson,
  StoredQuizHistoryEntry,
  StoredQuizResult,
  StoredStudyHistoryEntry,
  StoredStudyResult,
} from './types';
import { getTopicLabel } from '../../content/categories';
import {
  quizSessions,
  studySessions,
  runMigrations,
} from '../../lib/storage';

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleEvenlyByTopic(questions: Question[], targetCount: number): Question[] {
  const buckets = new Map<string, Question[]>();

  for (const question of shuffleArray(questions)) {
    const topic = question.topics?.[0] ?? question.category ?? 'uncategorized';
    const bucket = buckets.get(topic);
    if (bucket) {
      bucket.push(question);
    } else {
      buckets.set(topic, [question]);
    }
  }

  const picked: Question[] = [];

  while (picked.length < targetCount) {
    const availableTopics = shuffleArray(
      [...buckets.entries()]
        .filter(([, bucket]) => bucket.length > 0)
        .map(([topic]) => topic)
    );

    if (availableTopics.length === 0) break;

    for (const topic of availableTopics) {
      const bucket = buckets.get(topic);
      if (!bucket || bucket.length === 0) continue;

      picked.push(bucket.pop()!);

      if (picked.length >= targetCount) break;
    }
  }

  return shuffleArray(picked);
}

export function buildShuffled(questions: Question[]): ShuffledQuestion[] {
  return shuffleArray(questions).map(q => ({
    ...q,
    shuffledOptions: shuffleArray(
      q.options.map((opt, i) => ({ ...opt, originalIndex: i }))
    ),
  }));
}

export function buildQuizSearchParams(config: QuizConfig, uid: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set('q', encodeQuizConfig(config));
  params.set('uid', uid);
  return params;
}

export function buildStudySearchParams(config: StudyConfig, uid: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set('s', encodeStudyConfig(config));
  params.set('uid', uid);
  return params;
}

export interface ParsedQuizParams {
  config: QuizConfig;
  uid: string;
}

export interface ParsedStudyParams {
  config: StudyConfig;
  uid: string;
}

export function parseQuizSearchParams(
  searchParams: URLSearchParams,
  availableDomains: string[],
  availableTopics: string[],
): ParsedQuizParams | null {
  const encodedConfig = searchParams.get('q');
  const uid = searchParams.get('uid');

  if (!encodedConfig || !uid || !/^[a-z0-9]{6}$/i.test(uid)) return null;

  const rawConfig = decodeQuizConfig(encodedConfig);

  if (!rawConfig) return null;

  const legacyCategories = Array.isArray((rawConfig as QuizConfig & { categories?: unknown[] }).categories)
    ? (rawConfig as QuizConfig & { categories?: unknown[] }).categories
    : [];
  const rawDomains = Array.isArray(rawConfig.domains) ? rawConfig.domains : legacyCategories;
  const rawTopics = Array.isArray(rawConfig.topics) ? rawConfig.topics : legacyCategories;
  const rawDifficulties = Array.isArray(rawConfig.difficulties) ? rawConfig.difficulties : [];
  const timer = Number(rawConfig.timerMinutes);
  const maxQuestions = Number(rawConfig.maxQuestions);
  const mode = rawConfig.feedbackMode;
  const rawCorrectWeight = Number(rawConfig.correctWeight);
  const correctWeight = Number.isFinite(rawCorrectWeight) && rawCorrectWeight >= 0 && rawCorrectWeight <= 100
    ? Math.round(rawCorrectWeight)
    : 90;

  const allowedDomains = new Set(availableDomains);
  const domains = rawDomains
    .filter((domain): domain is string => typeof domain === 'string')
    .map(domain => domain.trim())
    .filter(domain => allowedDomains.has(domain));

  const allowedTopics = new Set(availableTopics);
  const topics = rawTopics
    .filter((topic): topic is string => typeof topic === 'string')
    .map(topic => topic.trim())
    .filter(topic => allowedTopics.has(topic));

  const uniqueDomains = [...new Set(domains)];
  const uniqueTopics = [...new Set(topics)];
  const feedbackMode: FeedbackMode = mode === 'end' ? 'end' : 'immediate';
  const difficulties = rawDifficulties
    .filter((difficulty): difficulty is string => typeof difficulty === 'string')
    .map(difficulty => difficulty.trim())
    .filter(isQuestionDifficulty);
  const uniqueDifficulties = [...new Set(difficulties)];

  if (uniqueDomains.length === 0) return null;
  if (uniqueTopics.length === 0) return null;
  if (uniqueDifficulties.length === 0) return null;
  if (!Number.isFinite(timer) || timer < 1) return null;
  if (!Number.isFinite(maxQuestions) || maxQuestions < 1) return null;

  return {
    uid,
    config: {
      domains: uniqueDomains,
      topics: uniqueTopics,
      difficulties: uniqueDifficulties,
      timerMinutes: Math.min(120, Math.floor(timer)),
      maxQuestions: Math.floor(maxQuestions),
      feedbackMode,
      correctWeight,
    },
  };
}

export function parseStudySearchParams(
  searchParams: URLSearchParams,
  availableDomains: string[],
  availableTopics: string[],
): ParsedStudyParams | null {
  const encodedConfig = searchParams.get('s');
  const uid = searchParams.get('uid');

  if (!encodedConfig || !uid || !/^[a-z0-9]{6}$/i.test(uid)) return null;

  const rawConfig = decodeStudyConfig(encodedConfig);

  if (!rawConfig) return null;

  const rawDomains = Array.isArray(rawConfig.domains) ? rawConfig.domains : [];
  const rawTopics = Array.isArray(rawConfig.topics) ? rawConfig.topics : [];
  const rawDifficulties = Array.isArray(rawConfig.difficulties) ? rawConfig.difficulties : [];

  const allowedDomains = new Set(availableDomains);
  const domains = rawDomains
    .filter((domain): domain is string => typeof domain === 'string')
    .map(domain => domain.trim())
    .filter(domain => allowedDomains.has(domain));

  const allowedTopics = new Set(availableTopics);
  const topics = rawTopics
    .filter((topic): topic is string => typeof topic === 'string')
    .map(topic => topic.trim())
    .filter(topic => allowedTopics.has(topic));

  const difficulties = rawDifficulties
    .filter((difficulty): difficulty is string => typeof difficulty === 'string')
    .map(difficulty => difficulty.trim())
    .filter(isQuestionDifficulty);

  const uniqueDomains = [...new Set(domains)];
  const uniqueTopics = [...new Set(topics)];
  const uniqueDifficulties = [...new Set(difficulties)];

  if (uniqueDomains.length === 0) return null;
  if (uniqueTopics.length === 0) return null;
  if (uniqueDifficulties.length === 0) return null;

  return {
    uid,
    config: {
      domains: uniqueDomains,
      topics: uniqueTopics,
      difficulties: uniqueDifficulties,
    },
  };
}

export const DIFFICULTY_OPTIONS: QuestionDifficulty[] = ['junior', 'mid', 'senior', 'principal'];

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  principal: 'Principal',
};

export function isQuestionDifficulty(value: string): value is QuestionDifficulty {
  return DIFFICULTY_OPTIONS.includes(value as QuestionDifficulty);
}

export function matchesDifficulty(question: Question, difficulties: QuestionDifficulty[]) {
  return difficulties.includes(question.difficulty);
}

export function getDifficultyLabel(difficulty: QuestionDifficulty) {
  return DIFFICULTY_LABELS[difficulty];
}

export const CATEGORY_COLORS: Record<string, string> = {
  react: 'badge-info',
  'javascript-typescript': 'badge-secondary',
  angular: 'badge-warning',
  'solid-principles': 'badge-accent',
  'design-patterns': 'badge-warning',
  algorithms: 'badge-primary',
  'data-structures': 'badge-success',
  frontend: 'badge-error',
  backend: 'badge-primary',
  devops: 'badge-outline',
  'data-engineering': 'badge-info',
  python: 'badge-secondary',
  nodejs: 'badge-accent',
};

export function getTopicBadge(topic: string) {
  return CATEGORY_COLORS[topic] ?? 'badge-neutral';
}

export function getQuestionPrimaryTopic(question: Question) {
  return question.topics?.[0] ?? question.category ?? 'uncategorized';
}

export function getQuestionTopicLabel(question: Question) {
  const topic = getQuestionPrimaryTopic(question);
  return question.topics?.length > 0 ? getTopicLabel(topic) : topic;
}

export function questionMatchesSelection(
  question: Question,
  domains: string[],
  topics: string[],
) {
  return question.domains.some(domain => domains.includes(domain))
    && question.topics.some(topic => topics.includes(topic));
}

export function studyLessonMatchesSelection(
  lesson: StudyLesson,
  domains: string[],
  topics: string[],
) {
  return lesson.domains.some(domain => domains.includes(domain))
    && lesson.topics.some(topic => topics.includes(topic));
}

export function generateQuizUid(length = 6) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let uid = '';

  for (let i = 0; i < length; i += 1) {
    uid += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return uid;
}

export const generateStudyUid = generateQuizUid;

export async function readStoredQuizQuestionIds(uid: string): Promise<string[] | null> {
  await runMigrations();
  const record = await quizSessions.get(uid);
  if (!Array.isArray(record?.questionIds)) return null;
  if (!record.questionIds.every((id) => typeof id === 'string')) return null;
  return record.questionIds;
}

export async function writeStoredQuizQuestionIds(uid: string, questionIds: string[]): Promise<void> {
  await runMigrations();
  await quizSessions.setQuestionIds(uid, questionIds);
}

export async function writeStoredQuizConfig(uid: string, config: QuizConfig): Promise<void> {
  await runMigrations();
  await quizSessions.setConfig(uid, config);
}

export async function readStoredQuizConfig(uid: string): Promise<QuizConfig | null> {
  await runMigrations();
  const record = await quizSessions.get(uid);
  return record?.config ?? null;
}

export async function readStoredQuizResult(uid: string): Promise<StoredQuizResult | null> {
  await runMigrations();
  const record = await quizSessions.get(uid);
  return record?.result ?? null;
}

export async function writeStoredQuizResult(uid: string, result: StoredQuizResult): Promise<void> {
  await runMigrations();
  await quizSessions.setResult(uid, result);
}

export async function readStoredQuizHistory(limit = 8): Promise<StoredQuizHistoryEntry[]> {
  if (typeof window === 'undefined') return [];
  await runMigrations();
  const records = await quizSessions.listRecent(limit);
  return records.map(({ questionIds: _ignored, ...entry }) => entry);
}

export async function deleteStoredQuizSession(uid: string): Promise<void> {
  await runMigrations();
  await quizSessions.remove(uid);
}

export async function writeStoredStudySession(uid: string, config: StudyConfig): Promise<void> {
  await runMigrations();
  await studySessions.writeSession(uid, config);
}

export async function readStoredStudyResult(uid: string): Promise<StoredStudyResult | null> {
  await runMigrations();
  const record = await studySessions.get(uid);
  return record?.result ?? null;
}

export async function writeStoredStudyResult(uid: string, result: StoredStudyResult): Promise<StoredStudyResult> {
  await runMigrations();
  return studySessions.setResult(uid, result);
}

export async function readStoredStudyHistory(limit = 8): Promise<StoredStudyHistoryEntry[]> {
  if (typeof window === 'undefined') return [];
  await runMigrations();
  return studySessions.listRecent(limit);
}

export async function deleteStoredStudySession(uid: string): Promise<void> {
  await runMigrations();
  await studySessions.remove(uid);
}

function encodeQuizConfig(config: QuizConfig) {
  return toBase64Url(JSON.stringify(config));
}

function decodeQuizConfig(value: string): QuizConfig | null {
  try {
    return JSON.parse(fromBase64Url(value)) as QuizConfig;
  } catch {
    return null;
  }
}

function encodeStudyConfig(config: StudyConfig) {
  return toBase64Url(JSON.stringify(config));
}

function decodeStudyConfig(value: string): StudyConfig | null {
  try {
    return JSON.parse(fromBase64Url(value)) as StudyConfig;
  } catch {
    return null;
  }
}

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
