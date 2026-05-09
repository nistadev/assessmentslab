import { ThemeToggle } from './ThemeToggle';
import type { Theme } from './types';

export function NavHeader({
  leftLabel,
  onLeftAction,
  theme,
  onToggleTheme,
}: {
  leftLabel?: string;
  onLeftAction?: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="justify-self-start">
        {leftLabel && onLeftAction ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm border border-base-content/10 bg-base-100/80 backdrop-blur"
            onClick={onLeftAction}
          >
            {leftLabel}
          </button>
        ) : (
          <div className="h-9 w-24" aria-hidden="true" />
        )}
      </div>

      <div className="justify-self-center">
        <span className="brand-chip">assessmentslab</span>
      </div>

      <div className="justify-self-end">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
