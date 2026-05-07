import { NavHeader } from '../shared/NavHeader';
import { QuestionPrompt } from './QuestionPrompt';
import { QuizOptionList } from './QuizOptionList';
import { FeedbackBanner } from './FeedbackBanner';
import { getQuestionPrimaryTopic, getQuestionTopicLabel, getTopicBadge } from '../shared/utils';
import type { FeedbackMode, ShuffledQuestion, Theme } from '../shared/types';

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
    <div className="quiz-plain-bg relative min-h-screen flex flex-col items-center py-3 px-4">
      <div className="w-full max-w-5xl">
        <NavHeader
          leftLabel="← Back"
          onLeftAction={onBack}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <div className="mb-4 space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-base-content/60">
              <span>Time</span>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-[12px] font-bold normal-case tracking-normal ${timerDanger ? 'text-error' : 'text-base-content'}`}>
                  {mins}:{secs}
                </span>
                <span>{elapsedMins}:{elapsedSecs} / {totalMins}:{totalSecs}</span>
              </div>
            </div>
            <progress
              className="progress progress-primary h-2 w-full"
              value={elapsedTime}
              max={totalTime}
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-base-content/60">
              <span>Answered</span>
              <span>{answeredCount} / {total}</span>
            </div>
            <progress
              className="progress progress-secondary h-2 w-full"
              value={answeredCount}
              max={total}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="card brand-shell">
            <div className="card-body p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className={`badge ${getTopicBadge(getQuestionPrimaryTopic(question))} badge-md`}>
                  {getQuestionTopicLabel(question)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                  Question {qIdx + 1}
                </span>
              </div>
              <QuestionPrompt q={question.q} code={question.code} />
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
