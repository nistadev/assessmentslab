export function QuestionPrompt({ q, code }: { q: string; code?: string }) {
  if (code) {
    return (
      <>
        <p className="font-semibold text-base mb-3">{q}</p>
        <pre className="bg-base-300 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">{code}</pre>
      </>
    );
  }

  return <p className="font-semibold text-base">{q}</p>;
}
