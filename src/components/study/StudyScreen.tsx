import { useEffect, useRef } from 'react';
import { getDomainLabel, getTopicLabel } from '../../content/categories';
import { NavHeader } from '../shared/NavHeader';
import type { StudyLesson, Theme } from '../shared/types';
import { getDifficultyLabel } from '../shared/utils';

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function StudyScreen({
  lesson,
  lessonIdx,
  total,
  elapsedSeconds,
  totalStudiedSeconds,
  finished,
  canTakeQuiz,
  onPrevious,
  onNext,
  onFinish,
  onStudyAgain,
  onTakeQuiz,
  onBackHome,
  theme,
  onToggleTheme,
}: {
  lesson: StudyLesson;
  lessonIdx: number;
  total: number;
  elapsedSeconds: number;
  totalStudiedSeconds: number;
  finished: boolean;
  canTakeQuiz: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  onStudyAgain: () => void;
  onTakeQuiz: () => void;
  onBackHome: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const didMountRef = useRef(false);
  const progressValue = lessonIdx + 1;
  const isFirst = lessonIdx === 0;
  const isLast = lessonIdx + 1 === total;
  const displayedStudySeconds = finished
    ? totalStudiedSeconds
    : totalStudiedSeconds + elapsedSeconds;

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [lessonIdx]);

  return (
    <div
      className="study-page relative min-h-screen flex flex-col items-center py-3 px-4"
      data-mode="study"
    >
      <div className="w-full max-w-5xl">
        <NavHeader
          leftLabel="Back Home"
          onLeftAction={onBackHome}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-base-content/60">
            <span>Lesson</span>
            <span>
              {progressValue} / {total}
            </span>
          </div>
          <progress
            className="progress progress-info h-2 w-full"
            value={progressValue}
            max={total}
          />
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-base-content/60">
            <span>Time Studied</span>
            <span className="font-mono text-[12px] font-bold normal-case tracking-normal text-base-content">
              {formatDuration(displayedStudySeconds)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <section className="card brand-shell study-shell">
            <div className="card-body p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {lesson.topics.map(topic => (
                  <span
                    key={topic}
                    className="badge border-info/25 bg-info/10 text-info"
                  >
                    {getTopicLabel(topic)}
                  </span>
                ))}
                <span className="badge badge-outline">
                  {getDifficultyLabel(lesson.difficulty)}
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight">
                {lesson.title}
              </h1>

              <h2 className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-info">
                Explanation
              </h2>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-base-content/78">
                {lesson.explanation}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {lesson.domains.map(domain => (
                  <span
                    key={domain}
                    className="badge border-base-content/10 bg-base-200/80 text-base-content/65"
                  >
                    {getDomainLabel(domain)}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-info">
              Examples
            </h2>

            <div className="space-y-3">
              {lesson.examples.map((example, index) => (
                <article
                  key={`${example.label}:${index}`}
                  className="study-example rounded-xl border border-info/18 bg-base-100/80 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-info">
                      {example.label}
                    </h3>
                    <span className="text-xs font-semibold text-base-content/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {example.description && (
                    <p className="mt-2 text-sm leading-6 text-base-content/68">
                      {example.description}
                    </p>
                  )}

                  {example.code && (
                    <pre className="mt-3 overflow-x-auto rounded-xl border border-base-content/10 bg-base-200/85 p-3 text-xs leading-5 text-base-content">
                      <code>{example.code}</code>
                    </pre>
                  )}
                </article>
              ))}
            </div>
          </section>

          {finished ? (
            <section className="rounded-xl border border-info/20 bg-info/8 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-info">
                    Session Finished
                  </p>
                  <p className="mt-1 text-sm text-base-content/65">
                    {total} lessons completed. Total study time: {formatDuration(totalStudiedSeconds)}.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    className="btn btn-outline border-info/30 text-info"
                    onClick={onStudyAgain}
                  >
                    Study Again
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={onTakeQuiz}
                    disabled={!canTakeQuiz}
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn btn-ghost border border-base-content/20"
                onClick={onPrevious}
                disabled={isFirst}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-info"
                onClick={isLast ? onFinish : onNext}
              >
                {isLast ? 'Finish' : 'Next'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
