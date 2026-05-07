import type { Answer } from '../shared/types';
import { getDifficultyLabel, getQuestionPrimaryTopic, getQuestionTopicLabel, getTopicBadge } from '../shared/utils';
import { QuestionPrompt } from '../quiz/QuestionPrompt';
import { FeedbackBanner } from '../quiz/FeedbackBanner';

export function ReviewQuestionCard({ answer }: { answer: Answer }) {
  return (
    <div className="collapse collapse-arrow brand-shell">
      <input type="checkbox" />
      <div className="collapse-title flex items-center gap-2 text-sm">
        {answer.correct
          ? <span className="text-success font-bold text-base">✓</span>
          : <span className="text-error font-bold text-base">✗</span>
        }
        <span className={`badge badge-sm ${getTopicBadge(getQuestionPrimaryTopic(answer.question))}`}>
          {getQuestionTopicLabel(answer.question)}
        </span>
        <span className="badge badge-outline badge-sm">
          {getDifficultyLabel(answer.question.difficulty)}
        </span>
        <span className="truncate text-base-content/70">{answer.question.q.split('\n')[0]}</span>
      </div>
      <div className="collapse-content">
        <QuestionPrompt q={answer.question.q} code={answer.question.code} />

        <div className="flex flex-col gap-1.5 mb-4 mt-3">
          {answer.question.shuffledOptions.map((opt, oi) => {
            const isCorrect = opt.correct;
            const isWrongPick = oi === answer.selectedIndex && !answer.correct;
            return (
              <div
                key={oi}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  isCorrect
                    ? 'border-success/40 bg-success/15 text-base-content font-semibold'
                    : isWrongPick
                    ? 'border-error/40 bg-error/15 text-base-content'
                    : 'border-base-content/10 opacity-50'
                }`}
              >
                <span className="font-bold w-5 shrink-0">{String.fromCharCode(65 + oi)}</span>
                <span className="flex-1">{opt.text}</span>
                {isCorrect && <span className="badge badge-success badge-sm">correct</span>}
                {isWrongPick && <span className="badge badge-error badge-sm">your answer</span>}
              </div>
            );
          })}
        </div>

        <FeedbackBanner isCorrect={answer.correct} explanation={answer.question.explanation} />
      </div>
    </div>
  );
}
