import type { Theme } from './types';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm fixed right-4 top-4 z-20 border border-base-content/10 bg-base-100/80 backdrop-blur"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'business' ? 'light' : 'business'} theme`}
    >
      {theme === 'business' ? 'Light' : 'Dark'} mode
    </button>
  );
}
