import type {
  QuizConfig,
  StoredQuizHistoryEntry,
  StoredQuizResult,
  StoredStudyHistoryEntry,
  StoredStudyResult,
  StudyConfig,
} from '../../components/shared/types';

export type DailyMode = 'quiz' | 'study';

export interface QuizSessionRecord extends StoredQuizHistoryEntry {
  questionIds?: string[];
}

export type StudySessionRecord = StoredStudyHistoryEntry;

export interface DailyChallengeRecord {
  dateKey: string;
  mode: DailyMode;
  uid: string;
  generatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface StreakRecord {
  mode: DailyMode;
  current: number;
  longest: number;
  lastCompletedDate: string | null;
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

export type { QuizConfig, StoredQuizResult, StudyConfig, StoredStudyResult };
