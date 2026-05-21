import type {
  Question,
  QuestionDifficulty,
  QuizConfig,
  StudyConfig,
  StudyLesson,
} from '../../components/shared/types';
import {
  hashString,
  mulberry32,
  pickOne,
  sampleSeeded,
  type SeededRandom,
} from './seededRandom';

const DAILY_QUIZ_TIMER_MINUTES = 1;
const DAILY_QUIZ_QUESTION_COUNT = 5;
const DAILY_QUIZ_CORRECT_WEIGHT = 50;

export interface PractisedPool {
  domains: string[];
  topics: string[];
  difficulties: QuestionDifficulty[];
}

export interface DailyQuizDraft {
  config: QuizConfig;
  questionIds: string[];
}

export interface DailyLessonDraft {
  config: StudyConfig;
  lessonId: string;
  lessonTitle: string;
  difficulty: QuestionDifficulty;
}

export function generateDailyQuiz(
  dateKey: string,
  pool: PractisedPool,
  questions: readonly Question[],
): DailyQuizDraft | null {
  if (pool.domains.length === 0 || pool.topics.length === 0 || pool.difficulties.length === 0) return null;

  const rng = seedFor(dateKey, 'quiz');
  const difficulty = pickOne(rng, pool.difficulties);
  if (!difficulty) return null;

  const candidates = questions.filter(question =>
    question.difficulty === difficulty
    && question.domains.some(domain => pool.domains.includes(domain))
    && question.topics.some(topic => pool.topics.includes(topic)),
  );

  if (candidates.length === 0) return null;

  const targetCount = Math.min(DAILY_QUIZ_QUESTION_COUNT, candidates.length);
  const picked = sampleSeeded(rng, candidates, targetCount);

  const config: QuizConfig = {
    domains: pool.domains,
    topics: pool.topics,
    difficulties: [difficulty],
    timerMinutes: DAILY_QUIZ_TIMER_MINUTES,
    maxQuestions: targetCount,
    feedbackMode: 'end',
    correctWeight: DAILY_QUIZ_CORRECT_WEIGHT,
  };

  return {
    config,
    questionIds: picked.map(q => q.questionId),
  };
}

export function generateDailyLesson(
  dateKey: string,
  pool: PractisedPool,
  lessons: readonly StudyLesson[],
): DailyLessonDraft | null {
  if (pool.domains.length === 0 || pool.topics.length === 0 || pool.difficulties.length === 0) return null;

  const rng = seedFor(dateKey, 'study');
  const difficulty = pickOne(rng, pool.difficulties);
  if (!difficulty) return null;

  const candidates = lessons.filter(lesson =>
    lesson.difficulty === difficulty
    && lesson.domains.some(domain => pool.domains.includes(domain))
    && lesson.topics.some(topic => pool.topics.includes(topic)),
  );

  const chosen = pickOne(rng, candidates);
  if (!chosen) return null;

  const config: StudyConfig = {
    domains: pool.domains,
    topics: pool.topics,
    difficulties: [difficulty],
  };

  return {
    config,
    lessonId: chosen.lessonId,
    lessonTitle: chosen.title,
    difficulty,
  };
}

function seedFor(dateKey: string, mode: 'quiz' | 'study'): SeededRandom {
  return mulberry32(hashString(`${dateKey}::${mode}`));
}
