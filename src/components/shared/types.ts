export interface Option {
  text: string;
  correct: boolean;
}

export interface Question {
  questionId: string;
  q: string;
  options: Option[];
  explanation: string;
  code?: string;
  domains: string[];
  topics: string[];
  category?: string;
  difficulty: QuestionDifficulty;
}

export interface ShuffledOption extends Option {
  originalIndex: number;
}

export interface ShuffledQuestion extends Question {
  shuffledOptions: ShuffledOption[];
}

export interface Answer {
  question: ShuffledQuestion;
  selectedIndex: number;
  correct: boolean;
}

export interface StoredQuizResult {
  score: number;
  answers: Answer[];
  elapsedSeconds: number;
  totalSeconds: number;
  finishedAt: string;
}

export interface StoredQuizHistoryEntry {
  uid: string;
  config: QuizConfig;
  result: StoredQuizResult;
  trialCount: number;
}

export interface StoredStudyHistoryEntry {
  uid: string;
  config: StudyConfig;
  trialCount: number;
  startedAt: string;
  lastUsedAt: string;
}

export type Theme = 'light' | 'dark';

export type AppMode = 'quiz' | 'study';

export type FeedbackMode = 'immediate' | 'end';

export type QuestionDifficulty = 'junior' | 'mid' | 'senior' | 'principal';

export interface QuizConfig {
  domains: string[];
  topics: string[];
  difficulties: QuestionDifficulty[];
  timerMinutes: number;
  maxQuestions: number;
  feedbackMode: FeedbackMode;
}

export interface StudyExample {
  label: string;
  description?: string;
  code?: string;
}

export interface StudyLesson {
  lessonId: string;
  title: string;
  explanation: string;
  examples: StudyExample[];
  difficulty: QuestionDifficulty;
  domains: string[];
  topics: string[];
}

export interface StudyConfig {
  domains: string[];
  topics: string[];
  difficulties: QuestionDifficulty[];
}
