import { useEffect, useRef, useState } from 'react';
import { QuizScreen } from './quiz/QuizScreen';
import type {
  Answer,
  FeedbackMode,
  Question,
  ShuffledQuestion,
  StoredQuizResult,
  Theme,
} from './shared/types';
import {
  buildShuffled,
  parseQuizSearchParams,
  questionMatchesSelection,
  readStoredQuizQuestionIds,
  sampleEvenlyByTopic,
  writeStoredQuizConfig,
  writeStoredQuizQuestionIds,
  writeStoredQuizResult,
} from './shared/utils';

export default function QuizPage({ questions }: { questions: Question[] }) {
  const [shuffled, setShuffled] = useState<ShuffledQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('end');
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<Answer[]>([]);
  const scoreRef = useRef(0);
  const totalTimeRef = useRef(0);

  const domains = [...new Set(questions.flatMap(q => q.domains))];
  const topics = [...new Set(questions.flatMap(q => q.topics))];
  const question = shuffled[qIdx];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => {
    totalTimeRef.current = totalTime;
    document.documentElement.dataset.quizTotalSeconds = String(totalTime);
  }, [totalTime]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parsed = parseQuizSearchParams(new URLSearchParams(window.location.search), domains, topics);
    if (!parsed) {
      window.location.assign('/');
      return;
    }

    const { config, uid } = parsed;
    const filtered = questions.filter(q =>
      questionMatchesSelection(q, config.domains, config.topics) && config.difficulties.includes(q.difficulty)
    );
    const targetCount = Math.min(config.maxQuestions, filtered.length);
    writeStoredQuizConfig(uid, config);

    const storedIds = readStoredQuizQuestionIds(uid);
    const selected = resolveQuestions(filtered, targetCount, uid, storedIds);

    const seconds = config.timerMinutes * 60;
    setShuffled(buildShuffled(selected));
    setTimeLeft(seconds);
    setTotalTime(seconds);
    totalTimeRef.current = seconds;
    setFeedbackMode(config.feedbackMode);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          finishQuiz(answersRef.current, scoreRef.current, 0, totalTimeRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [ready]);

  function confirm() {
    if (selected === null || !question) return;

    const correct = question.shuffledOptions[selected].correct;
    const nextScore = correct ? score + 1 : score;
    const nextAnswers = [...answers, { question, selectedIndex: selected, correct }];

    setScore(nextScore);
    scoreRef.current = nextScore;
    setAnswers(nextAnswers);
    answersRef.current = nextAnswers;

    if (feedbackMode === 'immediate') {
      setConfirmed(true);
      return;
    }

    advance(nextAnswers, nextScore);
  }

  function advance(nextAnswers = answersRef.current, nextScore = scoreRef.current) {
    if (qIdx + 1 < shuffled.length) {
      setQIdx(qIdx + 1);
    } else {
      clearInterval(timerRef.current!);
      finishQuiz(nextAnswers, nextScore, timeLeft, totalTimeRef.current);
      return;
    }

    setSelected(null);
    setConfirmed(false);
  }

  if (!ready || !question) return null;

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
      onNext={advance}
      onBack={() => {
        if (window.confirm('Leave quiz and lose current progress?')) {
          window.location.assign('/');
        }
      }}
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      feedbackMode={feedbackMode}
    />
  );
}

function finishQuiz(answers: Answer[], score: number, timeLeft: number, totalSeconds: number) {
  if (typeof window === 'undefined') return;

  const search = window.location.search;
  const uid = new URLSearchParams(search).get('uid');

  if (uid) {
    const result: StoredQuizResult = {
      score,
      answers,
      elapsedSeconds: Math.max(0, totalSeconds - timeLeft),
      totalSeconds,
      finishedAt: new Date().toISOString(),
    };
    writeStoredQuizResult(uid, result);
  }

  window.location.assign(`/results${search}`);
}

function resolveQuestions(
  filtered: Question[],
  targetCount: number,
  uid: string,
  storedIds: string[] | null,
): Question[] {
  if (storedIds && storedIds.length === targetCount) {
    const byId = new Map(filtered.map(q => [q.questionId, q]));
    const restored = storedIds.map(id => byId.get(id)).filter((q): q is Question => Boolean(q));
    if (restored.length === targetCount) return restored;
  }

  const sampled = sampleEvenlyByTopic(filtered, targetCount);
  writeStoredQuizQuestionIds(uid, sampled.map(q => q.questionId));
  return sampled;
}
