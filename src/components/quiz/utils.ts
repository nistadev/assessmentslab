import type {
  FeedbackMode,
  Question,
  QuestionDifficulty,
  QuizConfig,
  ShuffledQuestion,
} from './types';

export function splitCodeQuestion(q: string): { code: string; prompt: string } | null {
  const lines = q.trimEnd().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trimStart().startsWith('//')) {
      const code = lines.slice(0, i).join('\n').trimEnd();
      const prompt = lines[i].trim().replace(/^\/\/\s*/, '');
      return { code, prompt };
    }
  }
  return null;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleEvenlyByCategory(questions: Question[], targetCount: number): Question[] {
  const buckets = new Map<string, Question[]>();

  for (const question of shuffleArray(questions)) {
    const bucket = buckets.get(question.category);
    if (bucket) {
      bucket.push(question);
    } else {
      buckets.set(question.category, [question]);
    }
  }

  const picked: Question[] = [];

  while (picked.length < targetCount) {
    const availableCategories = shuffleArray(
      [...buckets.entries()]
        .filter(([, bucket]) => bucket.length > 0)
        .map(([category]) => category)
    );

    if (availableCategories.length === 0) break;

    for (const category of availableCategories) {
      const bucket = buckets.get(category);
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

export function buildQuizSearchParams(config: QuizConfig): URLSearchParams {
  const params = new URLSearchParams();
  params.set('categories', config.categories.join(','));
  params.set('difficulties', config.difficulties.join(','));
  params.set('timer', String(config.timerMinutes));
  params.set('max', String(config.maxQuestions));
  params.set('mode', config.feedbackMode);
  return params;
}

export function parseQuizSearchParams(
  searchParams: URLSearchParams,
  availableCategories: string[],
): QuizConfig | null {
  const rawCategories = searchParams.get('categories');
  const rawDifficulties = searchParams.get('difficulties');
  const timer = Number(searchParams.get('timer'));
  const maxQuestions = Number(searchParams.get('max'));
  const mode = searchParams.get('mode');

  if (!rawCategories || !rawDifficulties) return null;

  const allowedCategories = new Set(availableCategories);
  const categories = rawCategories
    .split(',')
    .map(category => category.trim())
    .filter(category => allowedCategories.has(category));

  const uniqueCategories = [...new Set(categories)];
  const feedbackMode: FeedbackMode = mode === 'end' ? 'end' : 'immediate';
  const difficulties = rawDifficulties
    .split(',')
    .map(difficulty => difficulty.trim())
    .filter(isQuestionDifficulty);
  const uniqueDifficulties = [...new Set(difficulties)];

  if (uniqueCategories.length === 0) return null;
  if (uniqueDifficulties.length === 0) return null;
  if (!Number.isFinite(timer) || timer < 1) return null;
  if (!Number.isFinite(maxQuestions) || maxQuestions < 1) return null;

  return {
    categories: uniqueCategories,
    difficulties: uniqueDifficulties,
    timerMinutes: Math.min(120, Math.floor(timer)),
    maxQuestions: Math.floor(maxQuestions),
    feedbackMode,
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
  'React': 'badge-info',
  'JavaScript/TypeScript': 'badge-secondary',
  'Angular': 'badge-warning',
  'SOLID Principles': 'badge-accent',
  'Design Patterns': 'badge-warning',
  'Data Structures': 'badge-success',
  'Frontend': 'badge-error',
  'Backend': 'badge-primary',
  'DevOps': 'badge-outline',
  'Data Engineering': 'badge-info',
  'Python': 'badge-secondary',
  'Node.js': 'badge-accent',
};

export function getCategoryBadge(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'badge-neutral';
}
