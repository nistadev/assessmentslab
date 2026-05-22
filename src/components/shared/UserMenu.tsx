import type { Theme } from './types';

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
  settingsHref?: string;
}

export function UserMenu({ theme, onToggleTheme, settingsHref = '/settings' }: Props) {
  const closeMenu = () => {
    if (typeof document === 'undefined') return;
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle border border-base-content/10 bg-base-100/80 text-primary backdrop-blur"
        aria-label="Open user menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
        >
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.69-8 6v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-3.31-3.58-6-8-6Z" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm z-50 mt-2 w-52 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-lg"
      >
        <li>
          <button
            type="button"
            onClick={() => {
              onToggleTheme();
              closeMenu();
            }}
            className="flex justify-between"
          >
            <span>Theme</span>
            <span className="text-xs text-base-content/60">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </li>
        <li>
          <a href={settingsHref} className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M19.14 12.94a7.49 7.49 0 0 0 0-1.88l2-1.56a.5.5 0 0 0 .12-.65l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.36 1a7.43 7.43 0 0 0-1.63-.94l-.36-2.51A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.51a7.43 7.43 0 0 0-1.63.94l-2.36-1a.5.5 0 0 0-.6.22L2.74 8.41a.5.5 0 0 0 .12.65l2 1.56a7.49 7.49 0 0 0 0 1.88l-2 1.56a.5.5 0 0 0-.12.65l1.92 3.32a.5.5 0 0 0 .6.22l2.36-1a7.43 7.43 0 0 0 1.63.94l.36 2.51a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.51a7.43 7.43 0 0 0 1.63-.94l2.36 1a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.65ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z" />
            </svg>
            Settings
          </a>
        </li>
      </ul>
    </div>
  );
}
