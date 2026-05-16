import { NavHeader } from '../shared/NavHeader';
import { ReviewQuestionCard } from './ReviewQuestionCard';
import type { Answer, Theme } from '../shared/types';

export function ResultScreen({
  score,
  answers,
  elapsedSeconds,
  totalSeconds,
  correctWeight = 90,
  onRestart,
  onStartNew,
  onBackHome,
  theme,
  onToggleTheme,
}: {
  score: number;
  answers: Answer[];
  elapsedSeconds: number;
  totalSeconds: number;
  correctWeight?: number;
  onRestart: () => void;
  onStartNew: () => void;
  onBackHome: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const total = answers.length;
  const accuracyRatio = total > 0 ? score / total : 0;
  const speedRatio = totalSeconds > 0 ? Math.max(0, (totalSeconds - elapsedSeconds) / totalSeconds) : 0;
  const w = correctWeight / 100;
  const performanceRatio = (accuracyRatio * w) + (speedRatio * (1 - w));
  const performancePct = Math.round(performanceRatio * 100);
  const needsMorePractice = performanceRatio <= 0.65;
  const verdict = performanceRatio >= 0.85 ? '🔥 Ready to go!' : performanceRatio >= 0.65 ? '⚡ Almost there.' : 'Need to practise more';
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const elapsedLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="relative min-h-screen flex flex-col items-center py-3  px-4">
      <div className="w-full max-w-2xl">
        <NavHeader
          leftLabel="← Back to Home"
          onLeftAction={onBackHome}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <div className="card brand-shell mb-6">
          <div className="card-body gap-3 lg:gap-5">
            <div className="space-y-1.5 lg:space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-base-content/50">Performance score</p>
              <h2 className="card-title text-3xl">
                {performancePct}%
              </h2>
              <div className="inline-flex w-fit flex-wrap items-center gap-3 text-base-content/60">
                <p>
                  {score}<span className="text-base-content/40">/{total}</span>
                  <span className="text-base-content/50"> correct</span>
                </p>
                <span className="text-base-content/30">•</span>
                <p className="text-sm text-base-content/50">Time passed: {elapsedLabel}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-base-content">{verdict}</p>
            <div className="card-actions mt-2">
              <button className={`btn ${needsMorePractice ? 'btn-neutral' : 'btn-ghost'}`} onClick={onRestart}>
                Take This Test Again
              </button>
              <button className={`btn ${needsMorePractice ? 'btn-ghost' : 'btn-neutral'}`} onClick={onStartNew}>
                Start a New Test
              </button>
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
