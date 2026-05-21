import { useCallback, useEffect, useState } from 'react';
import type { Question, StudyLesson, QuestionDifficulty } from '../../components/shared/types';
import {
  buildQuizSearchParams,
  buildStudySearchParams,
  generateQuizUid,
  generateStudyUid,
  readStoredQuizHistory,
  readStoredStudyHistory,
  writeStoredQuizConfig,
  writeStoredQuizQuestionIds,
  writeStoredStudySession,
} from '../../components/shared/utils';
import {
  dailyChallenges,
  runMigrations,
  streaks,
  type DailyChallengeRecord,
  type DailyMode,
  type StreakRecord,
} from '../storage';
import { previousKey, todayKey } from './dateKey';
import {
  generateDailyLesson,
  generateDailyQuiz,
  type DailyLessonDraft,
  type DailyQuizDraft,
  type PractisedPool,
} from './factory';

export type DailyState = 'loading' | 'locked' | 'ready' | 'inProgress' | 'completed';

export interface DailyChallengePreview {
  mode: DailyMode;
  dateKey: string;
  difficulty: QuestionDifficulty;
  summary: string;
}

export interface DailyStreakView {
  current: number;
  longest: number;
  staleDisplay: boolean;
}

export interface UseDailyChallengeResult {
  state: DailyState;
  preview: DailyChallengePreview | null;
  streak: DailyStreakView;
  start: () => Promise<void>;
  resume: () => void;
}

interface UseDailyChallengeArgs {
  mode: DailyMode;
  questions: Question[];
  lessons: StudyLesson[];
}

export function useDailyChallenge({ mode, questions, lessons }: UseDailyChallengeArgs): UseDailyChallengeResult {
  const [state, setState] = useState<DailyState>('loading');
  const [preview, setPreview] = useState<DailyChallengePreview | null>(null);
  const [streak, setStreak] = useState<DailyStreakView>({ current: 0, longest: 0, staleDisplay: false });
  const [activeRecord, setActiveRecord] = useState<DailyChallengeRecord | null>(null);
  const [draft, setDraft] = useState<DailyQuizDraft | DailyLessonDraft | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await runMigrations();
      const dateKey = todayKey();
      const prev = previousKey(dateKey);

      const [record, streakRecord, pool] = await Promise.all([
        dailyChallenges.getForDate(mode, dateKey),
        streaks.get(mode),
        loadPractisedPool(mode),
      ]);

      if (cancelled) return;

      setStreak(toStreakView(streakRecord, dateKey, prev));

      if (record?.completedAt) {
        setState('completed');
        setActiveRecord(record);
        setPreview(null);
        return;
      }

      const generated = mode === 'quiz'
        ? generateDailyQuiz(dateKey, pool, questions)
        : generateDailyLesson(dateKey, pool, lessons);

      if (!generated) {
        setState('locked');
        setPreview(null);
        setDraft(null);
        return;
      }

      setDraft(generated);
      setPreview(toPreview(mode, dateKey, generated));

      if (record?.startedAt) {
        setActiveRecord(record);
        setState('inProgress');
      } else {
        setActiveRecord(null);
        setState('ready');
      }
    })().catch((error) => {
      console.error('useDailyChallenge: failed to initialize', error);
      if (!cancelled) setState('locked');
    });

    return () => { cancelled = true; };
  }, [mode, questions, lessons]);

  const start = useCallback(async () => {
    if (!draft) return;
    const dateKey = todayKey();
    const uid = mode === 'quiz' ? generateQuizUid() : generateStudyUid();
    const generatedAt = activeRecord?.generatedAt ?? new Date().toISOString();
    const startedAt = new Date().toISOString();

    const record: DailyChallengeRecord = {
      dateKey,
      mode,
      uid,
      generatedAt,
      startedAt,
      completedAt: activeRecord?.completedAt,
    };
    await dailyChallenges.put(record);

    if (mode === 'quiz') {
      const quizDraft = draft as DailyQuizDraft;
      await writeStoredQuizConfig(uid, quizDraft.config);
      await writeStoredQuizQuestionIds(uid, quizDraft.questionIds);
      const params = buildQuizSearchParams(quizDraft.config, uid);
      window.location.assign(`/quiz?${params.toString()}`);
    } else {
      const lessonDraft = draft as DailyLessonDraft;
      await writeStoredStudySession(uid, lessonDraft.config);
      const params = buildStudySearchParams(lessonDraft.config, uid);
      params.set('lessonId', lessonDraft.lessonId);
      window.location.assign(`/study?${params.toString()}`);
    }
  }, [draft, mode, activeRecord]);

  const resume = useCallback(() => {
    if (!activeRecord || !draft) return;
    if (mode === 'quiz') {
      const quizDraft = draft as DailyQuizDraft;
      const params = buildQuizSearchParams(quizDraft.config, activeRecord.uid);
      window.location.assign(`/quiz?${params.toString()}`);
    } else {
      const lessonDraft = draft as DailyLessonDraft;
      const params = buildStudySearchParams(lessonDraft.config, activeRecord.uid);
      params.set('lessonId', lessonDraft.lessonId);
      window.location.assign(`/study?${params.toString()}`);
    }
  }, [activeRecord, draft, mode]);

  return { state, preview, streak, start, resume };
}

async function loadPractisedPool(mode: DailyMode): Promise<PractisedPool> {
  if (mode === 'quiz') {
    const history = await readStoredQuizHistory(200);
    return collectPool(history.map(entry => entry.config));
  }
  const history = await readStoredStudyHistory(200);
  return collectPool(history.map(entry => entry.config));
}

function collectPool(configs: Array<{ domains: string[]; topics: string[]; difficulties: QuestionDifficulty[] }>): PractisedPool {
  const domains = new Set<string>();
  const topics = new Set<string>();
  const difficulties = new Set<QuestionDifficulty>();

  for (const config of configs) {
    for (const domain of config.domains) domains.add(domain);
    for (const topic of config.topics) topics.add(topic);
    for (const difficulty of config.difficulties) difficulties.add(difficulty);
  }

  return {
    domains: [...domains],
    topics: [...topics],
    difficulties: [...difficulties],
  };
}

function toPreview(mode: DailyMode, dateKey: string, draft: DailyQuizDraft | DailyLessonDraft): DailyChallengePreview {
  if (mode === 'quiz') {
    const quiz = draft as DailyQuizDraft;
    const difficulty = quiz.config.difficulties[0];
    return {
      mode,
      dateKey,
      difficulty,
      summary: `${quiz.questionIds.length} questions · 1 min · ${difficulty}`,
    };
  }
  const lesson = draft as DailyLessonDraft;
  return {
    mode,
    dateKey,
    difficulty: lesson.difficulty,
    summary: `${lesson.lessonTitle} · ${lesson.difficulty}`,
  };
}

function toStreakView(record: StreakRecord, today: string, prev: string): DailyStreakView {
  const staleDisplay = record.lastCompletedDate !== null
    && record.lastCompletedDate !== today
    && record.lastCompletedDate !== prev;

  return {
    current: staleDisplay ? 0 : record.current,
    longest: record.longest,
    staleDisplay,
  };
}
