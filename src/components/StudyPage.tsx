import { useEffect, useState } from 'react';
import { StudyScreen } from './study/StudyScreen';
import type { StudyLesson, Theme } from './shared/types';
import {
  parseStudySearchParams,
  studyLessonMatchesSelection,
} from './shared/utils';

export default function StudyPage({ lessons }: { lessons: StudyLesson[] }) {
  const [filteredLessons, setFilteredLessons] = useState<StudyLesson[]>([]);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });

  const domains = [...new Set(lessons.flatMap(lesson => lesson.domains))];
  const topics = [...new Set(lessons.flatMap(lesson => lesson.topics))];
  const lesson = filteredLessons[lessonIdx];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.appMode = 'study';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parsed = parseStudySearchParams(
      new URLSearchParams(window.location.search),
      domains,
      topics,
    );

    if (!parsed) {
      window.location.assign('/');
      return;
    }

    const { config } = parsed;
    const matchingLessons = lessons.filter(
      lesson =>
        studyLessonMatchesSelection(lesson, config.domains, config.topics) &&
        config.difficulties.includes(lesson.difficulty),
    );

    if (matchingLessons.length === 0) {
      window.location.assign('/');
      return;
    }

    setFilteredLessons(matchingLessons);
    setLessonIdx(0);
    setReady(true);
  }, []);

  if (!ready || !lesson) return null;

  return (
    <StudyScreen
      lesson={lesson}
      lessonIdx={lessonIdx}
      total={filteredLessons.length}
      onPrevious={() => setLessonIdx(current => Math.max(0, current - 1))}
      onNext={() =>
        setLessonIdx(current =>
          Math.min(filteredLessons.length - 1, current + 1),
        )
      }
      onBackHome={() => window.location.assign('/')}
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
    />
  );
}
