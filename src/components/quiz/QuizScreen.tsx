import { ThemeToggle } from './ThemeToggle';
import { QuestionPrompt } from './QuestionPrompt';
import { QuizOptionList } from './QuizOptionList';
import { FeedbackBanner } from './FeedbackBanner';
import { getCategoryBadge } from './utils';
import type { FeedbackMode, ShuffledQuestion, Theme } from './types';

export function QuizScreen({
  question,
  qIdx,
  total,
  answeredCount,
  timeLeft,
  totalTime,
  selected,
  confirmed,
  isCorrect,
  onSelect,
  onConfirm,
  onNext,
  onBack,
  theme,
  onToggleTheme,
  feedbackMode,
}: {
  question: ShuffledQuestion;
  qIdx: number;
  total: number;
  answeredCount: number;
  timeLeft: number;
  totalTime: number;
  selected: number | null;
  confirmed: boolean;
  isCorrect: boolean;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  onNext: () => void;
  onBack: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  feedbackMode: FeedbackMode;
}) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const timerDanger = timeLeft < 60;
  const showFeedback = confirmed && feedbackMode === 'immediate';
  const elapsedTime = Math.max(0, totalTime - timeLeft);
  const elapsedMins = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const elapsedSecs = String(elapsedTime % 60).padStart(2, '0');
  const totalMins = String(Math.floor(totalTime / 60)).padStart(2, '0');
  const totalSecs = String(totalTime % 60).padStart(2, '0');

  return (
    <div className="quiz-plain-bg relative min-h-screen flex flex-col items-center py-6 px-4">
      <button
        type="button"
        className="btn btn-ghost btn-sm fixed left-4 top-4 z-20 border border-base-content/10 bg-base-100/80 backdrop-blur"
        onClick={onBack}
        aria-label="Back to quiz setup"
      >
        &larr; Back
      </button>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <div className="w-full max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span className="brand-chip">AssesLab</span>
          <div className="flex items-center gap-4">
            <span className={`font-mono font-bold text-lg ${timerDanger ? 'text-error' : 'text-base-content'}`}>
              {mins}:{secs}
            </span>
            <span className="text-base-content/50 text-sm whitespace-nowrap">
              {qIdx + 1} / {total}
            </span>
          </div>
        </div>

        <div className="mb-5 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-base-content/60">
              <span>Time</span>
              <span>{elapsedMins}:{elapsedSecs} / {totalMins}:{totalSecs}</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={elapsedTime}
              max={totalTime}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-base-content/60">
              <span>Answered</span>
              <span>{answeredCount} / {total}</span>
            </div>
            <progress
              className="progress progress-secondary w-full"
              value={answeredCount}
              max={total}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="card brand-shell">
            <div className="card-body p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className={`badge ${getCategoryBadge(question.category)} badge-md`}>
                  {question.category}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                  Question {qIdx + 1}
                </span>
              </div>
              <QuestionPrompt q={question.q} isCode={question.isCode} />
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:sticky lg:top-6">
            <QuizOptionList
              options={question.shuffledOptions}
              selectedIndex={selected}
              confirmed={confirmed}
              onSelect={onSelect}
            />

            {showFeedback && (
              <FeedbackBanner isCorrect={isCorrect} explanation={question.explanation} />
            )}

            {!confirmed
              ? (
                <button className="btn btn-primary w-full" onClick={onConfirm} disabled={selected === null}>
                  {feedbackMode === 'immediate'
                    ? 'Check Answer'
                    : qIdx + 1 < total
                      ? 'Next Question →'
                      : 'See Results'}
                </button>
              )
              : <button className="btn btn-neutral w-full" onClick={onNext}>{qIdx + 1 < total ? 'Next Question →' : 'See Results'}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
