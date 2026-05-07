import type { ShuffledOption } from '../shared/types';

export function QuizOptionList({
  options,
  selectedIndex,
  confirmed,
  onSelect,
}: {
  options: ShuffledOption[];
  selectedIndex: number | null;
  confirmed: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, i) => {
        let cls = 'flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-colors cursor-pointer ';
        if (confirmed) {
          if (opt.correct) {
            cls += 'border-success/50 bg-success/15 text-base-content font-semibold cursor-default shadow-sm';
          } else if (i === selectedIndex) {
            cls += 'border-error/50 bg-error/15 text-base-content font-semibold cursor-default shadow-sm';
          } else {
            cls += 'border-base-content/10 bg-base-100/40 opacity-50 cursor-default';
          }
        } else if (i === selectedIndex) {
          cls += 'border-primary bg-primary/10 text-base-content ring-1 ring-primary/20';
        } else {
          cls += 'border-base-content/20 hover:border-primary/60 hover:bg-primary/5';
        }

        return (
          <button
            key={i}
            className={cls}
            onClick={() => !confirmed && onSelect(i)}
            disabled={confirmed}
          >
            <span className="font-bold text-sm opacity-60 w-5 shrink-0">{String.fromCharCode(65 + i)}</span>
            <span className="text-sm leading-snug flex-1">{opt.text}</span>
            {confirmed && opt.correct && (
              <span className="shrink-0 w-6 h-6 rounded-full bg-success text-success-content text-xs flex items-center justify-center font-bold">✓</span>
            )}
            {confirmed && i === selectedIndex && !opt.correct && (
              <span className="shrink-0 w-6 h-6 rounded-full bg-error text-error-content text-xs flex items-center justify-center font-bold">✗</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
