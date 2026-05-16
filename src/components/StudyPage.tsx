import { useEffect, useRef, useState } from 'react';
import { StudyScreen } from './study/StudyScreen';
import type { Question, QuizConfig, StudyConfig, StudyLesson, Theme } from './shared/types';
import {
  buildQuizSearchParams,
  buildStudySearchParams,
  generateQuizUid,
  parseStudySearchParams,
  questionMatchesSelection,
  readStoredStudyResult,
  studyLessonMatchesSelection,
  writeStoredStudyResult,
  writeStoredStudySession,
} from './shared/utils';

export default function StudyPage({
  lessons,
  questions,
}: {
  lessons: StudyLesson[];
  questions: Question[];
}) {
  const [filteredLessons, setFilteredLessons] = useState<StudyLesson[]>([]);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [studyConfig, setStudyConfig] = useState<StudyConfig | null>(null);
  const [studyUid, setStudyUid] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalStudiedSeconds, setTotalStudiedSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [ready, setReady] = useState(false);
  const sessionStartedAtRef = useRef(0);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
  });

  const domains = [...new Set(lessons.flatMap(lesson => lesson.domains))];
  const topics = [...new Set(lessons.flatMap(lesson => lesson.topics))];
  const lesson = filteredLessons[lessonIdx];
  const quizQuestionCount = studyConfig
    ? questions.filter(
      question =>
        questionMatchesSelection(question, studyConfig.domains, studyConfig.topics) &&
        studyConfig.difficulties.includes(question.difficulty),
    ).length
    : 0;

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
    setStudyConfig(config);
    setStudyUid(parsed.uid);
    setElapsedSeconds(0);
    setTotalStudiedSeconds(readStoredStudyResult(parsed.uid)?.elapsedSeconds ?? 0);
    setFinished(false);
    sessionStartedAtRef.current = Date.now();
    writeStoredStudySession(parsed.uid, config);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || finished) return undefined;

    const writeProgress = (finishedAt?: string) => {
      if (!studyUid) return;

      const nextElapsedSeconds = Math.floor((Date.now() - sessionStartedAtRef.current) / 1000);
      const now = new Date().toISOString();

      setElapsedSeconds(nextElapsedSeconds);
      writeStoredStudyResult(studyUid, {
        elapsedSeconds: totalStudiedSeconds + nextElapsedSeconds,
        lessonCount: filteredLessons.length,
        updatedAt: now,
        finishedAt,
      });
    };
    const intervalId = window.setInterval(() => {
      writeProgress();
    }, 1000);
    const handlePageHide = () => writeProgress();

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [ready, finished, studyUid, totalStudiedSeconds, filteredLessons.length]);

  function finishStudy() {
    if (!studyUid || !studyConfig) return;

    const finalElapsedSeconds = Math.floor((Date.now() - sessionStartedAtRef.current) / 1000);
    const now = new Date().toISOString();
    const result = {
      elapsedSeconds: totalStudiedSeconds + finalElapsedSeconds,
      lessonCount: filteredLessons.length,
      updatedAt: now,
      finishedAt: now,
    };

    const nextResult = writeStoredStudyResult(studyUid, result);
    setElapsedSeconds(finalElapsedSeconds);
    setTotalStudiedSeconds(nextResult.elapsedSeconds);
    setFinished(true);
  }

  function studyAgain() {
    if (!studyConfig || !studyUid) return;

    const search = buildStudySearchParams(studyConfig, studyUid);
    window.location.assign(`/study?${search.toString()}`);
  }

  function takeQuiz() {
    if (!studyConfig || quizQuestionCount === 0) return;

    const config: QuizConfig = {
      domains: studyConfig.domains,
      topics: studyConfig.topics,
      difficulties: studyConfig.difficulties,
      timerMinutes: 10,
      maxQuestions: Math.min(20, quizQuestionCount),
      feedbackMode: 'end',
    };
    const search = buildQuizSearchParams(config, generateQuizUid());

    window.location.assign(`/quiz?${search.toString()}`);
  }

  if (!ready || !lesson) return null;

  return (
    <StudyScreen
      lesson={lesson}
      lessonIdx={lessonIdx}
      total={filteredLessons.length}
      elapsedSeconds={elapsedSeconds}
      totalStudiedSeconds={totalStudiedSeconds}
      finished={finished}
      canTakeQuiz={quizQuestionCount > 0}
      onPrevious={() => setLessonIdx(current => Math.max(0, current - 1))}
      onNext={() =>
        setLessonIdx(current =>
          Math.min(filteredLessons.length - 1, current + 1),
        )
      }
      onFinish={finishStudy}
      onStudyAgain={studyAgain}
      onTakeQuiz={takeQuiz}
      onBackHome={() => {
        if (studyUid) {
          const finalElapsedSeconds = Math.floor((Date.now() - sessionStartedAtRef.current) / 1000);
          writeStoredStudyResult(studyUid, {
            elapsedSeconds: totalStudiedSeconds + finalElapsedSeconds,
            lessonCount: filteredLessons.length,
            updatedAt: new Date().toISOString(),
          });
        }

        window.location.assign('/');
      }}
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
    />
  );
}
