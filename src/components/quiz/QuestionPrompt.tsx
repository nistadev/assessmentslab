import { splitCodeQuestion } from './utils';

export function QuestionPrompt({ q, isCode }: { q: string; isCode: boolean }) {
  const split = isCode ? splitCodeQuestion(q) : null;

  if (split) {
    return (
      <>
        <pre className="bg-base-300 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">{split.code}</pre>
        <p className="font-semibold text-base mt-3">{split.prompt}</p>
      </>
    );
  }

  return (
    <pre className="bg-base-300 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">{q}</pre>
  );
}
