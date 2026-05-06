import { useEffect, useState } from 'react';
import type { FeedbackMode, Question, QuestionDifficulty, QuizConfig, Theme } from './types';
import { ThemeToggle } from './ThemeToggle';
import { DIFFICULTY_LABELS, DIFFICULTY_OPTIONS, matchesDifficulty } from './utils';

function getAvailableCount(questions: Question[], selected: string[], difficulties: QuestionDifficulty[]) {
  return questions.filter(q => selected.includes(q.category) && matchesDifficulty(q, difficulties)).length;
}

export function HomeScreen({
  categories,
  totalQ,
  questions,
  onStart,
  initialConfig,
  theme,
  onToggleTheme,
}: {
  categories: string[];
  totalQ: number;
  questions: Question[];
  onStart: (
    selected: string[],
    timerMinutes: number,
    maxQuestions: number,
    feedbackMode: FeedbackMode,
    difficulties: QuestionDifficulty[],
  ) => void;
  initialConfig?: QuizConfig | null;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(initialConfig?.categories ?? categories);
  const [difficulties, setDifficulties] = useState<QuestionDifficulty[]>(
    initialConfig?.difficulties ?? DIFFICULTY_OPTIONS
  );
  const [timerMinutes, setTimerMinutes] = useState(initialConfig?.timerMinutes ?? 10);
  const [maxQuestions, setMaxQuestions] = useState(initialConfig?.maxQuestions ?? totalQ);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>(initialConfig?.feedbackMode ?? 'end');

  useEffect(() => {
    if (!initialConfig) return;

    setSelected(initialConfig.categories);
    setDifficulties(initialConfig.difficulties);
    setTimerMinutes(initialConfig.timerMinutes);
    setMaxQuestions(initialConfig.maxQuestions);
    setFeedbackMode(initialConfig.feedbackMode);
  }, [initialConfig]);

  const toggle = (cat: string) =>
    setSelected(s => s.includes(cat) ? s.filter(c => c !== cat) : [...s, cat]);
  const toggleDifficulty = (difficulty: QuestionDifficulty) =>
    setDifficulties(current =>
      current.includes(difficulty)
        ? current.filter(level => level !== difficulty)
        : [...current, difficulty]
    );

  const availableCount = getAvailableCount(questions, selected, difficulties);

  useEffect(() => {
    setMaxQuestions(availableCount || 1);
  }, [availableCount]);

  return (
    <div className="relative min-h-screen flex items-start justify-center px-4 py-10">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <div className="card bg-base-200 shadow-xl w-full max-w-2xl">
        <div className="card-body gap-5">
          <div>
            <h1 className="text-3xl font-bold">SoloTestSkills</h1>
            <p className="text-base-content/60 mt-1">{totalQ} questions · shuffled every run</p>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3 text-base-content/70 uppercase tracking-wide">Response Mode</p>
            <div className="join w-full">
              <button
                type="button"
                className={`join-item btn btn-sm flex-1 ${feedbackMode === 'end' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFeedbackMode('end')}
                aria-pressed={feedbackMode === 'end'}
              >
                Show only at the end
              </button>
              <button
                type="button"
                className={`join-item btn btn-sm flex-1 ${feedbackMode === 'immediate' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFeedbackMode('immediate')}
                aria-pressed={feedbackMode === 'immediate'}
              >
                Show response after check
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3 text-base-content/70 uppercase tracking-wide">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <label
                  key={cat}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors select-none ${
                    selected.includes(cat)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-base-content/20 text-base-content/50 hover:border-base-content/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selected.includes(cat)}
                    onChange={() => toggle(cat)}
                  />
                  <span className="text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="form-control sm:col-span-2">
              <div className="label pb-1">
                <span className="label-text text-sm font-semibold text-base-content/70 uppercase tracking-wide">Difficulty</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_OPTIONS.map(option => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors select-none ${
                      difficulties.includes(option)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-base-content/20 text-base-content/50 hover:border-base-content/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={difficulties.includes(option)}
                      onChange={() => toggleDifficulty(option)}
                    />
                    <span className="text-sm font-medium">{DIFFICULTY_LABELS[option]}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-sm font-semibold text-base-content/70 uppercase tracking-wide">Timer (min)</span>
              </div>
              <input
                type="number"
                min={1}
                max={120}
                step={1}
                className="input input-bordered w-full"
                value={timerMinutes}
                onChange={e => setTimerMinutes(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>

            <label className="form-control">
              <div className="label pb-1">
                <span className="label-text text-sm font-semibold text-base-content/70 uppercase tracking-wide">Max Questions</span>
              </div>
              <input
                type="number"
                min={1}
                max={availableCount || 1}
                step={1}
                className="input input-bordered w-full"
                value={maxQuestions}
                onChange={e => setMaxQuestions(Math.max(1, Number(e.target.value) || 1))}
              />
              <div className="label pt-1">
                <span className="label-text-alt text-base-content/50">
                  Up to {availableCount} available
                </span>
              </div>
            </label>
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={() => selected.length > 0 && difficulties.length > 0 && availableCount > 0 && onStart(selected, timerMinutes, maxQuestions, feedbackMode, difficulties)}
            disabled={selected.length === 0 || difficulties.length === 0 || availableCount === 0}
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}
