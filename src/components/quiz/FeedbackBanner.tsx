export function FeedbackBanner({
  isCorrect,
  explanation,
}: {
  isCorrect: boolean;
  explanation: string;
}) {
  return (
    <div
      className={`rounded-box border p-4 ${
        isCorrect
          ? 'border-success/50 bg-success/15 text-base-content shadow-sm'
          : 'border-error/50 bg-error/15 text-base-content shadow-sm'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span className={`badge badge-sm font-bold ${isCorrect ? 'badge-success' : 'badge-error'}`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
        <p className="font-bold text-base">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-base-content/80">{explanation}</p>
    </div>
  );
}
