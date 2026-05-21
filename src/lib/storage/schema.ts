import type { DBSchema } from 'idb';
import type {
  DailyChallengeRecord,
  MetaRecord,
  QuizSessionRecord,
  StreakRecord,
  StudySessionRecord,
} from './types';

export const DB_NAME = 'assessmentslab';
export const DB_VERSION = 1;

export const STORE = {
  quizSessions: 'quizSessions',
  studySessions: 'studySessions',
  dailyQuiz: 'dailyQuiz',
  dailyLesson: 'dailyLesson',
  streaks: 'streaks',
  meta: 'meta',
} as const;

export const INDEX = {
  byLastUsed: 'byLastUsed',
} as const;

export interface AssesLabSchema extends DBSchema {
  quizSessions: {
    key: string;
    value: QuizSessionRecord;
    indexes: { byLastUsed: string };
  };
  studySessions: {
    key: string;
    value: StudySessionRecord;
    indexes: { byLastUsed: string };
  };
  dailyQuiz: {
    key: string;
    value: DailyChallengeRecord;
  };
  dailyLesson: {
    key: string;
    value: DailyChallengeRecord;
  };
  streaks: {
    key: string;
    value: StreakRecord;
  };
  meta: {
    key: string;
    value: MetaRecord;
  };
}
