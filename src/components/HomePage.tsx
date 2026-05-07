import { useEffect, useState } from 'react';
import { HomeScreen } from './home/HomeScreen';
import type { Question, Theme } from './shared/types';
import { buildQuizSearchParams, generateQuizUid } from './shared/utils';

export default function HomePage({ questions }: { questions: Question[] }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });

  const domains = [...new Set(questions.flatMap(q => q.domains))];
  const topics = [...new Set(questions.flatMap(q => q.topics))];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <HomeScreen
      domains={domains}
      topics={topics}
      totalQ={questions.length}
      questions={questions}
      onStart={(selectedDomains, selectedTopics, timerMinutes, maxQuestions, feedbackMode, difficulties) => {
        const search = buildQuizSearchParams(
          { domains: selectedDomains, topics: selectedTopics, difficulties, timerMinutes, maxQuestions, feedbackMode },
          generateQuizUid(),
        );
        window.location.assign(`/quiz?${search.toString()}`);
      }}
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
    />
  );
}
