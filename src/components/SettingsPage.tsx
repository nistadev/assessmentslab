import { useEffect, useState } from 'react';
import { NavHeader } from './shared/NavHeader';
import type { Theme } from './shared/types';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="home-root relative min-h-screen flex items-start justify-center px-4 py-2">
      <div className="w-full max-w-2xl lg:max-w-5xl space-y-6">
        <NavHeader
          leftLabel="← Back to Home"
          onLeftAction={() => window.location.assign('/')}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        />

        <div className="card brand-shell">
          <div className="card-body gap-5">
            <header>
              <h1 className="brand-heading">Settings</h1>
              <p className="text-base-content/70 mt-2 max-w-xl">
                Configure your preferences. More options will appear as features ship.
              </p>
            </header>

            <section className="rounded-xl border border-base-content/10 bg-base-200/60 px-4 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/55">
                Appearance
              </h2>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-base-content/70">Theme</span>
                <div className="join">
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    className={`btn join-item btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
