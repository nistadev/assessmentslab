# AGENTS.md

Self-paced quiz app for practising software engineering assessments. Astro + React islands, questions in Markdown. See [`specs/`](specs/) for product, tech, and content decisions.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 |
| UI | React 19 (`client:load` islands) |
| Styling | Tailwind CSS 4 + daisyUI (`light` / `dark`) |
| Content | Astro Content Collections — YAML frontmatter in `.md` |
| Type safety | TypeScript + Zod (validated at build time) |
| Runtime | Node.js |

---

## Project Structure

```
src/
├── content.config.ts           # Zod schema + glob loader
├── content/
│   ├── categories.ts           # Domain and topic definitions
│   └── questions/              # One .md file per topic per difficulty
│       ├── junior/
│       ├── mid/
│       ├── senior/
│       └── principal/
├── components/
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   ├── ResultsPage.tsx
│   ├── FooterBar.astro
│   ├── home/HomeScreen.tsx
│   ├── quiz/
│   │   ├── QuizScreen.tsx
│   │   ├── QuestionPrompt.tsx
│   │   ├── QuizOptionList.tsx
│   │   └── FeedbackBanner.tsx
│   ├── results/
│   │   ├── ResultScreen.tsx
│   │   └── ReviewQuestionCard.tsx
│   └── shared/
│       ├── types.ts
│       └── utils.ts            # shuffle, sampling, URL params, scoring
└── pages/
    ├── index.astro
    ├── quiz.astro
    └── results.astro
```

---

## Dev Commands

```bash
npm run dev       # localhost:4321 with HMR
npm run build     # type-check + build + Zod content validation
npm run preview   # preview production build
```

---

## Adding a Topic

1. Add entry to `TOPIC_OPTIONS` in `src/content/categories.ts`.
2. Create `src/content/questions/<difficulty>/<topic>.md` for each difficulty level, with matching `defaultTopics` + `defaultDomains`.
3. No other changes — `getCollection('questions')` picks up all files via `**/*.md` automatically.

## Adding Questions

When the user asks to add, generate, expand, rewrite, or improve quiz questions, first read and follow [`specs/skills/question-authoring/SKILL.md`](specs/skills/question-authoring/SKILL.md).

Append to the `questions` array in the relevant `<difficulty>/<topic>.md` file. All questions in a file must match its folder's difficulty level. `npm run build` fails with a clear error if schema is invalid.

When generating questions from study content, treat `src/content/study/<difficulty>/<topic>.md` as the source of concepts, examples, and level-appropriate language. A study topic may have 20 or more questions per difficulty; 20 is a useful minimum pool for a default quiz, not a hard content cap.

Question options must not make the correct answer obvious. Avoid filler distractors such as impossible statements, joke answers, unrelated concepts, or obviously wrong process claims. Each question should have at least two plausible distractors that a learner could reasonably confuse with the correct answer.

Distractors must be selected from the same context as the question: neighboring concepts, realistic-but-wrong fixes, common misconceptions, or examples that solve a nearby problem but not the one asked. If the answer is a concept, wrong options should be related concepts that almost fit the scenario. If the answer is an action or refactor, wrong options should also be credible actions or refactors with a clear reason they are not best for this prompt.

Explanations should identify the correct principle, explain why it fits the prompt, and briefly clarify why the most plausible wrong options do not fit.

See [`specs/content-model.md`](specs/content-model.md) for question format, tagging rules, and language conventions.

## Adding Study Lessons

When the user asks to add, generate, expand, rewrite, or improve study lessons, first read and follow [`specs/skills/study-lesson-authoring/SKILL.md`](specs/skills/study-lesson-authoring/SKILL.md).

Study lessons live in `src/content/study/<difficulty>/<topic>.md`. Keep the lesson difficulty aligned with the parent folder and preserve the existing `defaultDomains` and `defaultTopics`.

Use seniority as a progression of thinking:

- Junior: recognize concepts, vocabulary, basic intent, and simple misuse.
- Mid: distinguish similar concepts and choose based on local code pressure.
- Senior: make design decisions using change axis, ownership, contracts, tests, refactoring path, and operational behavior.
- Principal: treat concepts as cross-team architecture with governance, versioning, rollout, observability, and invariant protection.
