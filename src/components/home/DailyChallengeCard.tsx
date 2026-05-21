import type { Question, StudyLesson } from '../shared/types';
import { useDailyChallenge, type DailyState, type DailyStreakView } from '../../lib/daily';
import type { DailyMode } from '../../lib/storage';

interface Props {
  mode: DailyMode;
  questions: Question[];
  lessons: StudyLesson[];
}

const TITLE: Record<DailyMode, string> = {
  quiz: 'Daily Quick Quiz',
  study: 'Daily Lesson',
};

const LOCKED_HINT: Record<DailyMode, string> = {
  quiz: 'Take a quiz first to unlock the daily challenge.',
  study: 'Open a study session first to unlock the daily lesson.',
};

export function DailyChallengeCard({ mode, questions, lessons }: Props) {
  const { state, preview, streak, start, resume } = useDailyChallenge({ mode, questions, lessons });
  const accent = mode === 'quiz' ? 'btn-primary' : 'btn-info';

  return (
    <section className="rounded-xl border border-base-content/10 bg-base-200/60 px-4 py-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-base-content/55">Today</p>
          <h2 className="text-base font-semibold text-base-content">{TITLE[mode]}</h2>
        </div>
        <StreakBadge streak={streak} mode={mode} state={state} />
      </header>
      <Body state={state} mode={mode} accent={accent} summary={preview?.summary ?? null} streak={streak} onStart={start} onResume={resume} />
    </section>
  );
}

function StreakBadge({ streak, mode, state }: { streak: DailyStreakView; mode: DailyMode; state: DailyState }) {
  if (state === 'loading' || state === 'locked') return null;

  const tone = mode === 'quiz' ? 'badge-primary' : 'badge-info';
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className={`badge ${tone} badge-sm`}>🔥 {streak.current}</span>
      <span className="text-base-content/45">best {streak.longest}</span>
    </div>
  );
}

interface BodyProps {
  state: DailyState;
  mode: DailyMode;
  accent: string;
  summary: string | null;
  streak: DailyStreakView;
  onStart: () => Promise<void>;
  onResume: () => void;
}

function Body({ state, mode, accent, summary, streak, onStart, onResume }: BodyProps) {
  if (state === 'loading') {
    return <div className="mt-3 skeleton h-12 w-full" />;
  }

  if (state === 'locked') {
    return <p className="mt-3 text-sm text-base-content/65">{LOCKED_HINT[mode]}</p>;
  }

  if (state === 'completed') {
    return (
      <div className="mt-3 flex flex-col gap-1 text-sm text-base-content/70">
        <p>Come back tomorrow for another.</p>
        {streak.current > 1 && (
          <p className="text-xs text-base-content/55">
            Keep it going — current streak {streak.current} days.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <p className="text-sm text-base-content/70 truncate" title={summary ?? undefined}>{summary}</p>
      {state === 'inProgress' ? (
        <button type="button" className={`btn btn-sm ${accent}`} onClick={onResume}>
          Resume
        </button>
      ) : (
        <button type="button" className={`btn btn-sm ${accent}`} onClick={() => { void onStart(); }}>
          Start
        </button>
      )}
    </div>
  );
}
