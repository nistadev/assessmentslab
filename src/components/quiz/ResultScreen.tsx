import { ThemeToggle } from './ThemeToggle';
import { ReviewQuestionCard } from './ReviewQuestionCard';
import type { Answer, Theme } from './types';

export function ResultScreen({
  score,
  answers,
  elapsedSeconds,
  onRestart,
  theme,
  onToggleTheme,
}: {
  score: number;
  answers: Answer[];
  elapsedSeconds: number;
  onRestart: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const total = answers.length;
  const pct = score / total;
  const verdict = pct >= 0.85 ? '🔥 Ready to go!' : pct >= 0.65 ? '⚡ Almost there.' : '📚 Keep practicing.';
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const elapsedLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="relative min-h-screen flex flex-col items-center py-10 px-4">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <div className="w-full max-w-2xl">
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-3xl">
              {score}<span className="text-base-content/40">/{total}</span>
            </h2>
            <p className="text-base-content/60">{verdict}</p>
            <p className="text-sm text-base-content/50">Time passed: {elapsedLabel}</p>
            <div className="card-actions mt-2">
              <button className="btn btn-neutral" onClick={onRestart}>Try Again</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {answers.map((answer, i) => <ReviewQuestionCard key={i} answer={answer} />)}
        </div>
      </div>
    </div>
  );
}
