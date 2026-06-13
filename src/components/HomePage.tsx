import { useEffect, useState } from 'react';
import { HomeScreen } from './home/HomeScreen';
import type { AppMode, Question, StudyLesson, Theme } from './shared/types';
import { buildQuizSearchParams, buildStudySearchParams, generateQuizUid, generateStudyUid } from './shared/utils';

const MODE_STORAGE_KEY = 'assessmentslab.mode';

function getStoredMode(): AppMode {
  if (typeof window === 'undefined') return 'quiz';
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
  return stored === 'study' ? 'study' : 'quiz';
}

export default function HomePage({
  questions,
  studyLessons,
}: {
  questions: Question[];
  studyLessons: StudyLesson[];
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });
  const [mode, setMode] = useState<AppMode>(getStoredMode);

  const quizDomains = [...new Set(questions.flatMap(q => q.domains))];
  const quizTopics = [...new Set(questions.flatMap(q => q.topics))];
  const studyDomains = [...new Set(studyLessons.flatMap(lesson => lesson.domains))];
  const studyTopics = [...new Set(studyLessons.flatMap(lesson => lesson.topics))];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.appMode = mode;
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  return (
    <>
    <HomeScreen
      mode={mode}
      onModeChange={setMode}
      quizDomains={quizDomains}
      quizTopics={quizTopics}
      studyDomains={studyDomains}
      studyTopics={studyTopics}
      totalQ={questions.length}
      questions={questions}
      studyLessons={studyLessons}
      onStartQuiz={(selectedDomains, selectedTopics, timerMinutes, maxQuestions, feedbackMode, difficulties, correctWeight) => {
        const search = buildQuizSearchParams(
          { domains: selectedDomains, topics: selectedTopics, difficulties, timerMinutes, maxQuestions, feedbackMode, correctWeight },
          generateQuizUid(),
        );
        window.location.assign(`/quiz?${search.toString()}`);
      }}
      onStartStudy={(selectedDomains, selectedTopics, difficulties) => {
        const search = buildStudySearchParams(
          { domains: selectedDomains, topics: selectedTopics, difficulties },
          generateStudyUid(),
        );
        window.location.assign(`/study?${search.toString()}`);
      }}
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
    />
    </>
  );
}
