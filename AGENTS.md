# AGENTS.md

## Project Overview

`solotestskills` is a self-paced quiz app for practicing frontend engineering interview topics. Built with **Astro + React** (island architecture) and **daisyUI**. Questions are authored in Markdown files and loaded at build time via Astro content collections.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 |
| UI | React 18 (client island via `client:load`) |
| Styling | Tailwind CSS 4 + daisyUI themes (`light` / `business`) |
| Content | Astro Content Collections (YAML frontmatter in `.md`) |
| Type safety | TypeScript + Zod (schema validation on content) |
| Runtime | Node.js |

---

## Project Structure

```
src/
├── content.config.ts           # Zod schema + glob loader for all question files
├── content/
│   └── questions/
│       ├── react.md
│       ├── typescript.md
│       ├── solid-principles.md
│       ├── design-patterns.md
│       └── data-structures.md
├── components/
│   ├── Quiz.tsx                # Thin state container / screen orchestrator
│   └── quiz/                   # Reusable quiz UI pieces
│       ├── HomeScreen.tsx
│       ├── QuizScreen.tsx
│       ├── ResultScreen.tsx
│       ├── ThemeToggle.tsx
│       ├── QuestionPrompt.tsx
│       ├── QuizOptionList.tsx
│       ├── FeedbackBanner.tsx
│       ├── ReviewQuestionCard.tsx
│       ├── types.ts
│       └── utils.ts
└── pages/
    └── index.astro             # Loads all MD files, passes questions to Quiz
```

---

## Question File Format

Every file in `src/content/questions/` follows this YAML frontmatter schema:

```yaml
---
category: "React"          # Displayed as a badge. Must match CATEGORY_COLORS in src/components/quiz/utils.ts to get a color.
questions:
  - q: |                   # The question text. Use | for multiline (code snippets go here).
      function foo() {}
      // What does this return?
    options:
      - text: "Option A"
        correct: false
      - text: "Option B"   # Mark the correct answer here
        correct: true
      - text: "Option C"
        correct: false
      - text: "Option D"
        correct: false
    explanation: "Explain why the answer is correct and the production context."
    isCode: true           # true = renders question in <pre> monospace block
---
```

**Rules:**
- Exactly one option per question must have `correct: true`.
- Options are shuffled at runtime on every quiz start — the `correct` flag travels with the option, so order in the file does not matter for correctness.
- Questions across all files are also shuffled before each quiz start.
- The `isCode` flag controls whether `QuestionPrompt` splits code from the trailing prompt. It also affects result review rendering.

---

## Adding a New Category

1. Create `src/content/questions/<slug>.md` with the frontmatter schema above.
2. Add the category name to `CATEGORY_COLORS` in `src/components/quiz/utils.ts`:
   ```ts
   const CATEGORY_COLORS: Record<string, string> = {
     'Your Category': 'badge-info',
   };
   ```
3. No other changes needed — Astro's `getCollection('questions')` picks up all files automatically.

---

## Adding Questions to an Existing Category

Open the relevant `.md` file and append a new entry to the `questions` array. Zod validates the schema at build time — `npm run build` will fail with a clear error if a question is malformed.

---

## Key Components

### `src/components/Quiz.tsx`

Thin React orchestrator. Owns quiz state, timer, theme, and screen switching. UI lives in `src/components/quiz/`.

| Screen | Component | Trigger |
|---|---|---|
| Category selection + start | `HomeScreen` | Initial load |
| Active quiz | `QuizScreen` | After start |
| Results with expandable review | `ResultScreen` | Quiz complete or timer hits 0 |

**Shuffle logic:**
- `shuffleArray<T>()` — Fisher-Yates in-place shuffle, returns new array.
- `sampleEvenlyByCategory()` — picks questions across selected categories in a round-robin style so max question count stays balanced.
- `buildShuffled()` — shuffles question order AND shuffles each question's options independently. The `correct` flag is preserved on the option object so scoring never depends on position.

**Timer:** configurable on the home screen. Stored as minutes, converted to seconds in `startQuiz`.

**Quiz config on home screen:**
- Category selection
- Timer length
- Max questions
- Response mode:
  - `Show response after check`
  - `Show only at the end`

**Scoring:** `answer.correct` is derived from `shuffledOptions[selectedIndex].correct` at confirm time.

**Theme:** uses daisyUI theme names, not arbitrary strings. Light mode is `light`; dark mode is `business`. Persisted theme values should stay in sync with `document.documentElement.dataset.theme`.

### `src/components/quiz/*`

Reusable presentational pieces:
- `HomeScreen.tsx` - category/timer/max-questions/response-mode setup
- `QuizScreen.tsx` - active question view
- `ResultScreen.tsx` - score summary and review list
- `ThemeToggle.tsx` - persistent light/dark switch
- `QuestionPrompt.tsx` - renders code questions and plain questions
- `QuizOptionList.tsx` - selectable answer list
- `FeedbackBanner.tsx` - immediate feedback block
- `ReviewQuestionCard.tsx` - expandable result review item
- `types.ts` - shared quiz types
- `utils.ts` - shuffle, sampling, category badges, code splitting

### `src/content.config.ts`

Zod schema + glob loader that validates all question files at build time. If you add a new field to questions, add it here first. Uses `glob({ pattern: '**/*.md', base: './src/content/questions' })` as the collection loader (required by Astro 5+).

### `src/pages/index.astro`

Loads all question files with `getCollection('questions')`, flattens them into a single `Question[]` array, and passes to `<Quiz client:load />`. No client-side data fetching — all content is static at build time. Also boots the saved theme before React mounts.

---

## Dev Commands

```bash
npm run dev       # Start dev server at localhost:4321 with HMR
npm run build     # Type-check + build (also validates all MD schemas via Zod)
npm run preview   # Preview production build locally
```

---

## Conventions

- **Question text** should end with a clear prompt (`// What does this return?`, `// What is the bug?`, `// What is rendered?`).
- **Explanations** should include: (1) the direct answer, (2) why wrong options are wrong or what the trap is, (3) a real-world production context where relevant.
- **Code questions** use YAML block scalar `q: |` with a trailing comment as the actual question. Keep code snippets under 15 lines for readability in the quiz card.
- **Category names** are strings — keep them consistent across files. Inconsistent casing creates duplicate categories in the UI.
- Do not import anything into `.md` files. They are pure data — logic lives in `src/components/quiz/*`.

---

## Known Constraints

- `isCode` flag controls whether `QuestionPrompt` splits code from the trailing prompt. It also affects how result review renders the question.
- No persistence — quiz state is in React memory only. Refreshing resets progress.
- No routing — single page, screen state managed by `useState` in `Quiz.tsx`.
- Theme persistence uses `localStorage` and `data-theme`.
