import { useEffect, useRef, useState } from 'react';
import { HomeScreen } from './quiz/HomeScreen';
import { QuizScreen } from './quiz/QuizScreen';
import { ResultScreen } from './quiz/ResultScreen';
import type {
  Answer,
  FeedbackMode,
  Question,
  QuestionDifficulty,
  ShuffledQuestion,
  Theme,
} from './quiz/types';
import {
  buildQuizSearchParams,
  buildShuffled,
  parseQuizSearchParams,
  sampleEvenlyByCategory,
} from './quiz/utils';

export default function Quiz({
  questions,
  initialPath = '/',
}: {
  questions: Question[];
  initialPath?: '/' | '/quiz';
}) {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'result'>('home');
  const [shuffled, setShuffled] = useState<ShuffledQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [totalTime, setTotalTime] = useState(600);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('end');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'business' ? 'business' : 'light';
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedFromUrlRef = useRef(false);

  const categories = [...new Set(questions.map(q => q.category))];
  const question = shuffled[qIdx];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (screen === 'quiz') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setScreen('result');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  useEffect(() => {
    if (initialPath !== '/quiz' || startedFromUrlRef.current || typeof window === 'undefined') return;

    const parsed = parseQuizSearchParams(
      new URLSearchParams(window.location.search),
      categories,
    );

    if (!parsed) return;

    startedFromUrlRef.current = true;
    startQuiz(
      parsed.categories,
      parsed.difficulties,
      parsed.timerMinutes,
      parsed.maxQuestions,
      parsed.feedbackMode,
    );
  }, [initialPath, categories]);

  function startQuiz(
    selectedCats: string[],
    selectedDifficulties: QuestionDifficulty[],
    timerMinutes: number,
    maxQuestions: number,
    mode: FeedbackMode,
  ) {
    const filtered = questions.filter(q =>
      selectedCats.includes(q.category) && selectedDifficulties.includes(q.difficulty)
    );
    const selectedQuestions = sampleEvenlyByCategory(filtered, Math.min(maxQuestions, filtered.length));

    setShuffled(buildShuffled(selectedQuestions));
    setQIdx(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(timerMinutes * 60);
    setTotalTime(timerMinutes * 60);
    setFeedbackMode(mode);
    setScreen('quiz');
  }

  function toggleTheme() {
    setTheme(current => current === 'business' ? 'light' : 'business');
  }

  function goHome() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setScreen('home');
    setShuffled([]);
    setQIdx(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(600);
    setTotalTime(600);
    setFeedbackMode('end');
  }

  function backToConfig() {
    if (typeof window !== 'undefined') {
      const ok = window.confirm('Leave quiz and lose current progress?');
      if (!ok) return;
      window.location.assign('/');
      return;
    }

    goHome();
  }

  function confirm() {
    if (selected === null || !question) return;

    const correct = question.shuffledOptions[selected].correct;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { question, selectedIndex: selected, correct }]);

    if (feedbackMode === 'immediate') {
      setConfirmed(true);
      return;
    }

    next();
  }

  function next() {
    if (qIdx + 1 < shuffled.length) {
      setQIdx(qIdx + 1);
    } else {
      clearInterval(timerRef.current!);
      setScreen('result');
      return;
    }

    setSelected(null);
    setConfirmed(false);
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        categories={categories}
        totalQ={questions.length}
        questions={questions}
        onStart={(selectedCats, timerMinutes, maxQuestions, mode, difficulties) => {
          if (typeof window !== 'undefined') {
            const search = buildQuizSearchParams({
              categories: selectedCats,
              difficulties,
              timerMinutes,
              maxQuestions,
              feedbackMode: mode,
            });
            window.location.assign(`/quiz?${search.toString()}`);
            return;
          }

          startQuiz(selectedCats, difficulties, timerMinutes, maxQuestions, mode);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        score={score}
        answers={answers}
        elapsedSeconds={Math.max(0, totalTime - timeLeft)}
        onRestart={() => {
          if (typeof window !== 'undefined') {
            window.location.assign('/');
            return;
          }

          goHome();
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (!question) return null;

  const isCorrect = confirmed && selected !== null && question.shuffledOptions[selected].correct;

  return (
    <QuizScreen
      question={question}
      qIdx={qIdx}
      total={shuffled.length}
      answeredCount={answers.length}
      timeLeft={timeLeft}
      totalTime={totalTime}
      selected={selected}
      confirmed={confirmed}
      isCorrect={isCorrect}
      onSelect={setSelected}
      onConfirm={confirm}
      onNext={next}
      onBack={backToConfig}
      theme={theme}
      onToggleTheme={toggleTheme}
      feedbackMode={feedbackMode}
    />
  );
}
