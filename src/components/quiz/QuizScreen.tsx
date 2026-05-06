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
  timeLeft,
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
  timeLeft: number;
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

  return (
    <div className="relative min-h-screen flex flex-col items-center py-6 px-4">
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
        <div className="flex items-center justify-between mb-3 gap-4">
          <span className={`badge ${getCategoryBadge(question.category)} badge-md`}>
            {question.category}
          </span>
          <span className={`font-mono font-bold text-lg ${timerDanger ? 'text-error' : 'text-base-content'}`}>
            {mins}:{secs}
          </span>
          <span className="text-base-content/50 text-sm whitespace-nowrap">
            {qIdx + 1} / {total}
          </span>
        </div>

        <progress
          className="progress progress-primary w-full mb-5"
          value={qIdx}
          max={total}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body p-5">
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
