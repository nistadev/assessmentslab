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
│   └── questions/              # One .md file per topic
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
2. Create `src/content/questions/<topic>.md` with matching `defaultTopics` + `defaultDomains`.
3. No other changes — `getCollection('questions')` picks it up automatically.

## Adding Questions

Append to the `questions` array in the relevant `.md` file. `npm run build` fails with a clear error if schema is invalid.

See [`specs/content-model.md`](specs/content-model.md) for question format, tagging rules, and language conventions.
