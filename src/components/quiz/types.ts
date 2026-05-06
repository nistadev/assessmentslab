export interface Option {
  text: string;
  correct: boolean;
}

export interface Question {
  q: string;
  options: Option[];
  explanation: string;
  isCode: boolean;
  category: string;
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

export type Theme = 'light' | 'business';

export type FeedbackMode = 'immediate' | 'end';

export type QuestionDifficulty = 'junior' | 'mid' | 'senior' | 'principal';

export interface QuizConfig {
  categories: string[];
  difficulties: QuestionDifficulty[];
  timerMinutes: number;
  maxQuestions: number;
  feedbackMode: FeedbackMode;
}
