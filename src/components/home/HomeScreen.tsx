import { useEffect, useState } from "react";
import {
  DOMAIN_OPTIONS,
  TOPIC_OPTIONS,
  getDomainLabel,
  getTopicLabel,
} from "../../content/categories";
import type {
  AppMode,
  FeedbackMode,
  Question,
  QuestionDifficulty,
  QuizConfig,
  StoredQuizHistoryEntry,
  StoredStudyHistoryEntry,
  StudyLesson,
  Theme,
} from "../shared/types";
import { NavHeader } from "../shared/NavHeader";
import {
  buildQuizSearchParams,
  buildStudySearchParams,
  deleteStoredQuizSession,
  deleteStoredStudySession,
  DIFFICULTY_LABELS,
  DIFFICULTY_OPTIONS,
  matchesDifficulty,
  questionMatchesSelection,
  readStoredQuizHistory,
  readStoredStudyHistory,
  studyLessonMatchesSelection,
} from "../shared/utils";

function getAvailableQuizCount(
  questions: Question[],
  domains: string[],
  topics: string[],
  difficulties: QuestionDifficulty[],
) {
  return questions.filter(
    (q) =>
      questionMatchesSelection(q, domains, topics) &&
      matchesDifficulty(q, difficulties),
  ).length;
}

function getAvailableStudyCount(
  lessons: StudyLesson[],
  domains: string[],
  topics: string[],
  difficulties: QuestionDifficulty[],
) {
  return lessons.filter(
    (lesson) =>
      studyLessonMatchesSelection(lesson, domains, topics) &&
      difficulties.includes(lesson.difficulty),
  ).length;
}

function getInitialDomainSelection(
  domains: string[],
  initialConfig?: QuizConfig | null,
) {
  if (initialConfig?.domains.length) return initialConfig.domains;
  if (domains.length === 0) return [];
  return [];
}

function getInitialTopicSelection(
  topics: string[],
  domains: string[],
  initialConfig?: QuizConfig | null,
) {
  if (initialConfig?.topics.length) return initialConfig.topics;
  return getTopicsForDomains(topics, domains);
}

function getTopicsForDomains(topics: string[], domains: string[]) {
  const selectedDomains = new Set(domains);
  return topics.filter((topic) => {
    const option = TOPIC_OPTIONS.find((item) => item.topic === topic);
    return option
      ? option.domains.some((domain) => selectedDomains.has(domain))
      : true;
  });
}

function syncTopicsForDomains(
  current: string[],
  visibleTopics: string[],
) {
  const visibleTopicSet = new Set(visibleTopics);
  const next = current.filter((topic) => visibleTopicSet.has(topic));
  return [...new Set([...next, ...visibleTopics])];
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function HomeScreen({
  mode,
  onModeChange,
  quizDomains,
  quizTopics,
  studyDomains,
  studyTopics,
  totalQ,
  questions,
  studyLessons,
  onStartQuiz,
  onStartStudy,
  initialConfig,
  theme,
  onToggleTheme,
}: {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  quizDomains: string[];
  quizTopics: string[];
  studyDomains: string[];
  studyTopics: string[];
  totalQ: number;
  questions: Question[];
  studyLessons: StudyLesson[];
  onStartQuiz: (
    selectedDomains: string[],
    selectedTopics: string[],
    timerMinutes: number,
    maxQuestions: number,
    feedbackMode: FeedbackMode,
    difficulties: QuestionDifficulty[],
  ) => void;
  onStartStudy: (
    selectedDomains: string[],
    selectedTopics: string[],
    difficulties: QuestionDifficulty[],
  ) => void;
  initialConfig?: QuizConfig | null;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const initialQuizDomains = getInitialDomainSelection(
    quizDomains,
    initialConfig,
  );
  const [quizSelectedDomains, setQuizSelectedDomains] = useState<string[]>(
    () => initialQuizDomains,
  );
  const [quizSelectedTopics, setQuizSelectedTopics] = useState<string[]>(() =>
    getInitialTopicSelection(quizTopics, initialQuizDomains, initialConfig),
  );
  const [quizDifficulties, setQuizDifficulties] = useState<QuestionDifficulty[]>(
    initialConfig?.difficulties ?? DIFFICULTY_OPTIONS,
  );
  const [timerMinutes, setTimerMinutes] = useState(
    initialConfig?.timerMinutes ?? 10,
  );
  const [maxQuestions, setMaxQuestions] = useState(
    initialConfig?.maxQuestions ?? 20,
  );
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>(
    initialConfig?.feedbackMode ?? "end",
  );

  const [studySelectedDomains, setStudySelectedDomains] = useState<string[]>(
    [],
  );
  const [studySelectedTopics, setStudySelectedTopics] = useState<string[]>([]);
  const [studyDifficulties, setStudyDifficulties] =
    useState<QuestionDifficulty[]>(DIFFICULTY_OPTIONS);

  const [quizHistory, setQuizHistory] = useState<StoredQuizHistoryEntry[]>([]);
  const [studyHistory, setStudyHistory] = useState<StoredStudyHistoryEntry[]>([]);

  const isStudyMode = mode === "study";
  const domains = isStudyMode ? studyDomains : quizDomains;
  const topics = isStudyMode ? studyTopics : quizTopics;
  const selectedDomains = isStudyMode
    ? studySelectedDomains
    : quizSelectedDomains;
  const selectedTopics = isStudyMode ? studySelectedTopics : quizSelectedTopics;
  const difficulties = isStudyMode ? studyDifficulties : quizDifficulties;
  const setSelectedDomains = isStudyMode
    ? setStudySelectedDomains
    : setQuizSelectedDomains;
  const setSelectedTopics = isStudyMode
    ? setStudySelectedTopics
    : setQuizSelectedTopics;
  const setDifficulties = isStudyMode
    ? setStudyDifficulties
    : setQuizDifficulties;

  const visibleTopics = getTopicsForDomains(topics, selectedDomains);
  const domainOptions = domains.map(
    (domain) =>
      DOMAIN_OPTIONS.find((option) => option.domain === domain) ?? {
        domain,
        name: getDomainLabel(domain),
        description: "Custom practice domain.",
      },
  );
  const quizAvailableCount = getAvailableQuizCount(
    questions,
    quizSelectedDomains,
    quizSelectedTopics,
    quizDifficulties,
  );
  const studyAvailableCount = getAvailableStudyCount(
    studyLessons,
    studySelectedDomains,
    studySelectedTopics,
    studyDifficulties,
  );
  const availableCount = isStudyMode ? studyAvailableCount : quizAvailableCount;
  const activeChoiceClass = isStudyMode
    ? "border-info/40 bg-info/10 text-info"
    : "border-primary/30 bg-primary/8 text-primary/80";
  const inactiveChoiceClass =
    "border-base-content/20 text-base-content/50 hover:border-base-content/40";
  const checkboxClass = isStudyMode ? "checkbox-info" : "checkbox-primary";
  const activeButtonClass = isStudyMode
    ? "btn-info btn-soft border-info/30"
    : "btn-primary btn-soft border-primary/30";

  useEffect(() => {
    if (!initialConfig) return;

    setQuizSelectedDomains(initialConfig.domains);
    setQuizSelectedTopics(initialConfig.topics);
    setQuizDifficulties(initialConfig.difficulties);
    setTimerMinutes(initialConfig.timerMinutes);
    setMaxQuestions(initialConfig.maxQuestions);
    setFeedbackMode(initialConfig.feedbackMode);
  }, [initialConfig]);

  useEffect(() => {
    setQuizHistory(readStoredQuizHistory());
    setStudyHistory(readStoredStudyHistory());
  }, []);

  useEffect(() => {
    const nextVisibleTopics = getTopicsForDomains(
      quizTopics,
      quizSelectedDomains,
    );
    setQuizSelectedTopics((current) =>
      syncTopicsForDomains(current, nextVisibleTopics),
    );
  }, [quizSelectedDomains, quizTopics]);

  useEffect(() => {
    const nextVisibleTopics = getTopicsForDomains(
      studyTopics,
      studySelectedDomains,
    );
    setStudySelectedTopics((current) =>
      syncTopicsForDomains(current, nextVisibleTopics),
    );
  }, [studySelectedDomains, studyTopics]);

  useEffect(() => {
    setMaxQuestions(Math.min(20, quizAvailableCount || 1));
  }, [quizAvailableCount]);

  const toggleDomain = (domain: string) =>
    setSelectedDomains((current) =>
      current.includes(domain)
        ? current.filter((item) => item !== domain)
        : [...current, domain],
    );
  const toggleAllDomains = () =>
    setSelectedDomains((current) =>
      current.length === domains.length ? [] : domains,
    );
  const toggleTopic = (topic: string) =>
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  const toggleAllVisibleTopics = () =>
    setSelectedTopics((current) => {
      const allSelected = visibleTopics.every((topic) =>
        current.includes(topic),
      );

      if (allSelected) {
        return current.filter((topic) => !visibleTopics.includes(topic));
      }

      return [...new Set([...current, ...visibleTopics])];
    });
  const toggleDifficulty = (difficulty: QuestionDifficulty) =>
    setDifficulties((current) =>
      current.includes(difficulty)
        ? current.filter((level) => level !== difficulty)
        : [...current, difficulty],
    );
  const changeMode = (nextMode: AppMode) => {
    if (mode !== nextMode) onModeChange(nextMode);
  };
  const removeQuizHistoryEntry = (uid: string) => {
    deleteStoredQuizSession(uid);
    setQuizHistory(readStoredQuizHistory());
  };
  const removeStudyHistoryEntry = (uid: string) => {
    deleteStoredStudySession(uid);
    setStudyHistory(readStoredStudyHistory());
  };
  const start = () => {
    if (
      selectedDomains.length === 0 ||
      selectedTopics.length === 0 ||
      difficulties.length === 0 ||
      availableCount === 0
    ) {
      return;
    }

    if (isStudyMode) {
      onStartStudy(selectedDomains, selectedTopics, difficulties);
      return;
    }

    onStartQuiz(
      selectedDomains,
      selectedTopics,
      timerMinutes,
      maxQuestions,
      feedbackMode,
      difficulties,
    );
  };
  const modeButtonClass = (targetMode: AppMode) => {
    if (mode !== targetMode) {
      return "text-base-content/55 hover:bg-base-200/80 hover:text-base-content";
    }

    return targetMode === "study"
      ? "border-info/30 bg-info/12 text-info"
      : "border-primary/30 bg-primary/10 text-primary";
  };

  const startDisabled =
    selectedDomains.length === 0 ||
    selectedTopics.length === 0 ||
    difficulties.length === 0 ||
    availableCount === 0;

  return (
    <div
      className="home-root relative min-h-screen flex items-start justify-center px-4 py-2"
      data-mode={mode}
    >
      <div className="w-full max-w-2xl lg:max-w-5xl space-y-6">
        <NavHeader
          leftContent={
            <div className="mode-switch inline-flex rounded-full border border-base-content/10 bg-base-100/80 p-1 backdrop-blur">
              <button
                type="button"
                className={`rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${modeButtonClass("quiz")}`}
                onClick={() => changeMode("quiz")}
                aria-pressed={mode === "quiz"}
              >
                Quiz
              </button>
              <button
                type="button"
                className={`rounded-full border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${modeButtonClass("study")}`}
                onClick={() => changeMode("study")}
                aria-pressed={mode === "study"}
              >
                Study
              </button>
            </div>
          }
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <div className="card brand-shell">
          <div className="card-body gap-5 lg:grid lg:grid-cols-2">
            <div className="col-span-2">
              <h1 className="brand-heading">
                {isStudyMode
                  ? "Study engineering concepts step by step."
                  : "Stress-test your engineering instincts."}
              </h1>
              <p className="text-base-content/70 mt-2 max-w-xl">
                {isStudyMode
                  ? "Read focused lessons across development disciplines with concept-first explanations and implementation examples."
                  : "assessmentslab drills interview-grade questions across development disciplines with shuffled runs, timed rounds, and tight feedback loops."}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
                {isStudyMode
                  ? `${studyLessons.length} lessons available`
                  : `${totalQ} questions available`}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-base-content uppercase tracking-wide">
                      Domains
                    </p>
                    <p className="text-xs text-base-content/50">
                      Pick where {isStudyMode ? "lessons" : "questions"} should
                      apply. {selectedDomains.length}/{domains.length} selected.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={toggleAllDomains}
                  >
                    {selectedDomains.length === domains.length
                      ? "Clear All"
                      : "Select All"}
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {domainOptions.map((option) => (
                    <label
                      key={option.domain}
                      className={`flex min-h-24 cursor-pointer gap-3 rounded-xl border p-3 transition-colors select-none ${
                        selectedDomains.includes(option.domain)
                          ? activeChoiceClass
                          : "border-base-content/20 text-base-content hover:border-base-content/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className={`checkbox ${checkboxClass} checkbox-xs mt-1`}
                        checked={selectedDomains.includes(option.domain)}
                        onChange={() => toggleDomain(option.domain)}
                      />
                      <span>
                        <span className="block text-sm font-semibold">
                          {option.name}
                        </span>
                        <span className="mt-1 block text-xs opacity-70">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-base-content uppercase tracking-wide">
                      Topics
                    </p>
                    <p className="text-xs text-base-content/50">
                      Shared topics only include {isStudyMode ? "lessons" : "questions"} tagged
                      for selected domains. {selectedTopics.length} selected.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={toggleAllVisibleTopics}
                    disabled={visibleTopics.length === 0}
                  >
                    {visibleTopics.length > 0 &&
                    visibleTopics.every((topic) =>
                      selectedTopics.includes(topic),
                    )
                      ? "Clear All"
                      : "Select All"}
                  </button>
                </div>
                {visibleTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {visibleTopics.map((topic) => (
                      <label
                        key={topic}
                        className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors select-none ${
                          selectedTopics.includes(topic)
                            ? activeChoiceClass
                            : inactiveChoiceClass
                        }`}
                      >
                        <input
                          type="checkbox"
                          className={`checkbox ${checkboxClass} checkbox-xs`}
                          checked={selectedTopics.includes(topic)}
                          onChange={() => toggleTopic(topic)}
                        />
                        <span className="text-sm font-medium">
                          {getTopicLabel(topic)}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-base-content/20 bg-base-200/40 px-4 py-3 text-sm text-base-content/55">
                    Pick domain first to reveal topics.
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="form-control sm:col-span-2">
                  <div className="label pb-1">
                    <span className="label-text text-sm font-semibold text-base-content/70 uppercase tracking-wide">
                      Difficulty
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors select-none ${
                          difficulties.includes(option)
                            ? activeChoiceClass
                            : inactiveChoiceClass
                        }`}
                      >
                        <input
                          type="checkbox"
                          className={`checkbox ${checkboxClass} checkbox-sm`}
                          checked={difficulties.includes(option)}
                          onChange={() => toggleDifficulty(option)}
                        />
                        <span className="text-sm font-medium">
                          {DIFFICULTY_LABELS[option]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {!isStudyMode && (
                  <>
                    <div className="form-control">
                      <div className="label pb-1">
                        <span className="label-text text-sm font-semibold text-base-content/70 uppercase tracking-wide">
                          Timer (min)
                        </span>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        step={1}
                        className="input input-bordered w-full"
                        value={timerMinutes}
                        onChange={(e) =>
                          setTimerMinutes(
                            Math.max(1, Number(e.target.value) || 1),
                          )
                        }
                      />
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {[1, 5, 10, 20].map((min) => (
                          <button
                            key={min}
                            type="button"
                            className={`btn btn-sm sm:btn-xs ${
                              timerMinutes === min
                                ? activeButtonClass
                                : "btn-ghost border border-base-content/20"
                            }`}
                            onClick={() => setTimerMinutes(min)}
                          >
                            {min}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-control">
                      <div className="label items-center justify-between pb-1">
                        <span className="label-text text-sm font-semibold text-base-content/70 uppercase tracking-wide">
                          Max Questions
                        </span>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={availableCount || 1}
                        step={1}
                        className="input input-bordered w-full"
                        value={maxQuestions}
                        onChange={(e) =>
                          setMaxQuestions(
                            Math.max(1, Number(e.target.value) || 1),
                          )
                        }
                      />
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {[5, 10, 20, 40].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`btn btn-sm sm:btn-xs ${
                              maxQuestions === n
                                ? activeButtonClass
                                : "btn-ghost border border-base-content/20"
                            }`}
                            onClick={() =>
                              setMaxQuestions(Math.min(n, availableCount || 1))
                            }
                            disabled={(availableCount || 0) < n}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`btn btn-sm sm:btn-xs ${
                            maxQuestions === availableCount
                              ? activeButtonClass
                              : "btn-ghost border border-base-content/20"
                          }`}
                          onClick={() => setMaxQuestions(availableCount || 1)}
                        >
                          Max
                        </button>
                      </div>
                      <div className="label pt-1">
                        <span className="label-text-alt text-base-content/50">
                          Up to {availableCount} available
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isStudyMode && (
                <div>
                  <p className="text-sm font-semibold mb-3 text-base-content/70 uppercase tracking-wide">
                    Response Mode
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        feedbackMode === "end"
                          ? activeButtonClass
                          : "btn-ghost border border-base-content/20"
                      }`}
                      onClick={() => setFeedbackMode("end")}
                      aria-pressed={feedbackMode === "end"}
                    >
                      Show only at the end
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        feedbackMode === "immediate"
                          ? activeButtonClass
                          : "btn-ghost border border-base-content/20"
                      }`}
                      onClick={() => setFeedbackMode("immediate")}
                      aria-pressed={feedbackMode === "immediate"}
                    >
                      Show response after check
                    </button>
                  </div>
                </div>
              )}

              {isStudyMode && (
                <div className="rounded-xl border border-info/20 bg-info/8 px-4 py-3 text-sm text-base-content/70">
                  {availableCount} matching lessons. Lessons keep authored order
                  and use linear navigation.
                </div>
              )}

              <button
                className={`btn w-full mt-auto ${isStudyMode ? "btn-info" : "btn-primary"}`}
                onClick={start}
                disabled={startDisabled}
              >
                {isStudyMode ? "Start Study" : "Start Test"}
              </button>
            </div>
          </div>
        </div>

        {!isStudyMode && quizHistory.length > 0 && (
          <div className="card brand-shell">
            <div className="card-body gap-4">
              <div>
                <p className="text-sm font-semibold text-base-content/70 uppercase tracking-wide">
                  Latest Assessments
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {quizHistory.map((entry) => {
                  const params = buildQuizSearchParams(entry.config, entry.uid);
                  const quizUrl = `/quiz?${params.toString()}`;
                  const resultUrl = `/results?${params.toString()}`;
                  const targetUrl = entry.result ? resultUrl : quizUrl;
                  const performancePct = entry.result
                    ? Math.round(
                        (
                          (entry.result.score /
                            Math.max(entry.result.answers.length, 1)) *
                            0.9 +
                          Math.max(
                            0,
                            (entry.result.totalSeconds -
                              entry.result.elapsedSeconds) /
                              Math.max(entry.result.totalSeconds, 1),
                          ) *
                            0.1
                        ) *
                          100,
                      )
                    : null;
                  const minutes = entry.result
                    ? Math.floor(entry.result.elapsedSeconds / 60)
                    : 0;
                  const seconds = entry.result
                    ? String(entry.result.elapsedSeconds % 60).padStart(2, "0")
                    : "00";
                  const openedAt = entry.result?.finishedAt
                    ? new Date(entry.result.finishedAt).toLocaleString()
                    : entry.lastUsedAt
                      ? new Date(entry.lastUsedAt).toLocaleString()
                      : entry.startedAt
                        ? new Date(entry.startedAt).toLocaleString()
                        : null;

                  return (
                    <article
                      key={entry.uid}
                      className="cursor-pointer text-left rounded-xl border border-base-content/10 bg-base-200/80 px-3 py-3 transition-all hover:bg-base-200 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_20%,transparent),0_0_18px_-6px_color-mix(in_oklab,var(--color-primary)_38%,transparent)]"
                      role="button"
                      tabIndex={0}
                      onClick={() => window.location.assign(targetUrl)}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          window.location.assign(targetUrl);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-base-content">
                            {entry.config.domains
                              .map(getDomainLabel)
                              .join(", ")}{" "}
                            ·{" "}
                            {entry.config.topics.map(getTopicLabel).join(", ")}
                          </p>
                          <p className="mt-1 text-[11px] text-base-content/50">
                            {entry.result ? "Latest taken" : "Started"}:{" "}
                            {openedAt ?? "unknown time"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-start gap-2">
                          {performancePct !== null && (
                            <span className="badge badge-primary badge-md">
                              {performancePct}%
                            </span>
                          )}
                          <div className="text-right">
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs border border-base-content/15 text-base-content/55"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeQuizHistoryEntry(entry.uid);
                              }}
                            >
                              Remove
                            </button>
                            <p className="mt-1 text-[11px] text-base-content/50">
                              {entry.trialCount}{" "}
                              {entry.result
                                ? entry.trialCount === 1 ? "trial" : "trials"
                                : entry.trialCount === 1 ? "intent" : "intents"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-base-content/65">
                        {entry.result && (
                          <>
                            <span className="badge badge-outline badge-sm">
                              {entry.result.score}/{entry.result.answers.length}{" "}
                              correct
                            </span>
                            <span className="badge badge-outline badge-sm">
                              {minutes}:{seconds}
                            </span>
                          </>
                        )}
                        <span className="badge badge-outline badge-sm">
                          {entry.config.maxQuestions} max
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isStudyMode && studyHistory.length > 0 && (
          <div className="card brand-shell">
            <div className="card-body gap-4">
              <div>
                <p className="text-sm font-semibold text-base-content/70 uppercase tracking-wide">
                  Latest Study Sessions
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {studyHistory.map((entry) => {
                  const params = buildStudySearchParams(entry.config, entry.uid);
                  const studyUrl = `/study?${params.toString()}`;
                  const startedAt = new Date(entry.lastUsedAt).toLocaleString();
                  const finishedAt = entry.result
                    ? entry.result.finishedAt
                      ? new Date(entry.result.finishedAt).toLocaleString()
                      : new Date(entry.result.updatedAt).toLocaleString()
                    : null;

                  return (
                    <article
                      key={entry.uid}
                      className="cursor-pointer text-left rounded-xl border border-base-content/10 bg-base-200/80 px-3 py-3 transition-all hover:bg-base-200 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-info)_20%,transparent),0_0_18px_-6px_color-mix(in_oklab,var(--color-info)_38%,transparent)]"
                      role="button"
                      tabIndex={0}
                      onClick={() => window.location.assign(studyUrl)}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          window.location.assign(studyUrl);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-base-content">
                            {entry.config.domains
                              .map(getDomainLabel)
                              .join(", ")}{" "}
                            ·{" "}
                            {entry.config.topics.map(getTopicLabel).join(", ")}
                          </p>
                          <p className="mt-1 text-[11px] text-base-content/50">
                            {finishedAt
                              ? `${entry.result?.finishedAt ? "Finished" : "Last studied"}: ${finishedAt}`
                              : `Last opened: ${startedAt}`}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-start gap-2">
                          <div className="text-right">
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs border border-base-content/15 text-base-content/55"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeStudyHistoryEntry(entry.uid);
                              }}
                            >
                              Remove
                            </button>
                            <p className="mt-1 text-[11px] text-base-content/50">
                              {entry.trialCount}{" "}
                              {entry.trialCount === 1 ? "session" : "sessions"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-base-content/65">
                        {entry.result && (
                          <span className="badge badge-outline badge-sm">
                            {formatDuration(entry.result.elapsedSeconds)} studied
                          </span>
                        )}
                        <span className="badge badge-outline badge-sm">
                          {entry.config.difficulties.length} difficulty levels
                        </span>
                        <span className="badge badge-outline badge-sm">
                          Started {new Date(entry.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
