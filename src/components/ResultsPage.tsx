import { useEffect, useState } from 'react';
import { NavHeader } from './shared/NavHeader';
import { ResultScreen } from './results/ResultScreen';
import type { StoredQuizResult, Theme } from './shared/types';
import { readStoredQuizResult } from './shared/utils';

export default function ResultsPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });
  const [result, setResult] = useState<StoredQuizResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const uid = new URLSearchParams(window.location.search).get('uid');
    setResult(uid ? readStoredQuizResult(uid) : null);
    setLoaded(true);
  }, []);

  function toggleTheme() {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  }

  if (!loaded) return null;

  if (!result) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <NavHeader
            leftLabel="← Back to Home"
            onLeftAction={() => window.location.assign('/')}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <div className="card brand-shell w-full">
          <div className="card-body">
            <h1 className="card-title text-2xl">Result not found</h1>
            <p className="text-base-content/70">
              No stored result for this test id. Start new test or retake from quiz link.
            </p>
            <div className="card-actions mt-2">
              <button className="btn btn-neutral" onClick={() => window.location.assign('/')}>
                Start a New Test
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <ResultScreen
      score={result.score}
      answers={result.answers}
      elapsedSeconds={result.elapsedSeconds}
      totalSeconds={result.totalSeconds}
      onRestart={() => window.location.assign(`/quiz${window.location.search}`)}
      onStartNew={() => window.location.assign('/')}
      onBackHome={() => window.location.assign('/')}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}
