import { UserMenu } from './UserMenu';
import type { Theme } from './types';
import type { ReactNode } from 'react';

export function NavHeader({
  leftContent,
  leftLabel,
  onLeftAction,
  theme,
  onToggleTheme,
}: {
  leftContent?: ReactNode;
  leftLabel?: string;
  onLeftAction?: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="justify-self-start">
        {leftContent ? (
          leftContent
        ) : leftLabel && onLeftAction ? (
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
        <UserMenu theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </div>
  );
}
