import { getDomainLabel, getTopicLabel } from '../../content/categories';
import { NavHeader } from '../shared/NavHeader';
import type { StudyLesson, Theme } from '../shared/types';
import { getDifficultyLabel } from '../shared/utils';

export function StudyScreen({
  lesson,
  lessonIdx,
  total,
  onPrevious,
  onNext,
  onBackHome,
  theme,
  onToggleTheme,
}: {
  lesson: StudyLesson;
  lessonIdx: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onBackHome: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const progressValue = lessonIdx + 1;
  const isFirst = lessonIdx === 0;
  const isLast = lessonIdx + 1 === total;

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
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
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
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-base-content/78">
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

          <section className="space-y-3 lg:sticky lg:top-6">
            {lesson.examples.map((example, index) => (
              <article
                key={`${example.label}:${index}`}
                className="study-example rounded-xl border border-info/18 bg-base-100/80 p-4 shadow-sm backdrop-blur"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-info">
                    {example.label}
                  </h2>
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
                onClick={onNext}
                disabled={isLast}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
