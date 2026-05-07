# AGENTS.md

## Project Overview

`solotestskills` is a self-paced quiz app for practicing software engineering interview topics. Built with **Astro + React** (island architecture) and **daisyUI**. Questions are authored in Markdown files and loaded at build time via Astro content collections.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 |
| UI | React 18 (client island via `client:load`) |
| Styling | Tailwind CSS 4 + daisyUI themes (`light` / `dark`) |
| Content | Astro Content Collections (YAML frontmatter in `.md`) |
| Type safety | TypeScript + Zod (schema validation on content) |
| Runtime | Node.js |

---

## Project Structure

```
src/
├── content.config.ts           # Zod schema + glob loader for all question files
├── content/
│   ├── categories.ts           # Domain and topic definitions
│   └── questions/
│       ├── algorithms.md
│       ├── angular.md
│       ├── backend.md
│       ├── data-engineering.md
│       ├── data-structures.md
│       ├── design-patterns.md
│       ├── devops.md
│       ├── frontend.md
│       ├── nodejs.md
│       ├── python.md
│       ├── react.md
│       ├── solid-principles.md
│       └── typescript.md
├── components/
│   ├── HomePage.tsx            # Home page island
│   ├── QuizPage.tsx            # Quiz session island
│   ├── ResultsPage.tsx         # Results island
│   ├── FooterBar.astro
│   ├── home/
│   │   └── HomeScreen.tsx      # Domain/topic/config selection UI
│   ├── quiz/
│   │   ├── QuizScreen.tsx
│   │   ├── QuestionPrompt.tsx
│   │   ├── QuizOptionList.tsx
│   │   └── FeedbackBanner.tsx
│   ├── results/
│   │   ├── ResultScreen.tsx
│   │   └── ReviewQuestionCard.tsx
│   └── shared/
│       ├── types.ts            # Shared TypeScript types
│       └── utils.ts            # Shuffle, sampling, URL params, scoring
└── pages/
    ├── index.astro             # Loads all MD files, passes questions to HomePage
    ├── quiz.astro              # Loads all MD files, passes questions to QuizPage
    └── results.astro           # Results page
```

---

## Domain and Topic System

Domains and topics are defined in `src/content/categories.ts`. Questions are filtered by both.

### Domains

| Domain | Description |
|---|---|
| `frontend` | Browser platform, frontend frameworks (React, Angular), and client-side engineering |
| `backend` | Server-side patterns: APIs, databases, DDD, file I/O, integrations |
| `computer-science` | Language-agnostic fundamentals: algorithms, data structures, design patterns, SOLID |
| `data-infra` | Data systems, pipelines, deployments, and operations |

### Topics and their domains

| Topic key | Display name | Domains |
|---|---|---|
| `frontend` | Web Platform | `frontend` |
| `javascript-typescript` | JavaScript / TypeScript | `frontend`, `backend` |
| `react` | React | `frontend` |
| `angular` | Angular | `frontend` |
| `backend` | Backend | `backend` |
| `nodejs` | Node.js | `backend` |
| `python` | Python | `backend` |
| `algorithms` | Algorithms | `computer-science` |
| `data-structures` | Data Structures | `computer-science` |
| `design-patterns` | Design Patterns | `computer-science`, `frontend` |
| `solid-principles` | SOLID Principles | `computer-science`, `frontend` |
| `data-engineering` | Data Engineering | `data-infra` |
| `devops` | DevOps | `data-infra` |

### Language conventions per domain

- **`computer-science`** — Python or pseudocode. No framework imports.
- **`frontend`** — JavaScript, TypeScript, React, browser APIs. No server-side code.
- **`backend`** — Node.js, Python, or language-agnostic server concepts.
- **`data-infra`** — Tool-specific (SQL, CLI, config snippets) or conceptual.

---

## Question File Format

Every file in `src/content/questions/` uses this YAML frontmatter schema:

```yaml
---
defaultDomains: ["frontend"]           # Domains for ALL questions in this file unless overridden.
defaultTopics: ["react"]               # Topics for ALL questions in this file unless overridden.
questions:
  - q: "What does Button receive?"     # Plain question text. Always rendered as text.
    code: |                            # Optional. Code snippet rendered in a monospace block.
      function withLogger(Component) {
        return function Logged(props) {
          return <Component {...props} />;
        };
      }
    domains: ["frontend"]              # Optional. Overrides defaultDomains for this question only.
    topics: ["react", "design-patterns"] # Optional. Overrides defaultTopics for this question only.
    options:
      - text: "Option A"
        correct: false
      - text: "Option B"
        correct: true
      - text: "Option C"
        correct: false
      - text: "Option D"
        correct: false
    explanation: "Explain why the answer is correct and the production context."
    difficulty: "junior"               # Required. One of: junior | mid | senior | principal
---
```

### Field rules

| Field | Required | Notes |
|---|---|---|
| `q` | Yes | Plain question text. Always rendered as a `<p>`. |
| `code` | No | Code snippet. Rendered in a `<pre>` monospace block above the options. |
| `options` | Yes | Exactly one must have `correct: true`. |
| `explanation` | Yes | Teach the concept, not just reveal the answer. |
| `difficulty` | Yes | `junior` / `mid` / `senior` / `principal` |
| `domains` | No | Per-question override for `defaultDomains`. |
| `topics` | No | Per-question override for `defaultTopics`. |

- Options are shuffled on every quiz start — `correct` flag travels with the option.
- Questions across all files are also shuffled before each quiz start.

---

## Domain and Topic Tagging Rules

- `defaultDomains` / `defaultTopics` must accurately reflect the content in the file. A file of React HOC questions belongs in `["frontend"]`, not `["computer-science"]`.
- Use per-question `domains` / `topics` overrides when a question doesn't match the file's defaults.
- Tags are exclusive by domain: a question tagged `domains: ["frontend"]` will NOT appear in a `computer-science` quiz.
- Use multiple domains only when the question genuinely tests both (e.g., a TypeScript generics question is legitimately `["frontend", "backend"]`).
- `design-patterns` and `solid-principles` topics appear under both `computer-science` and `frontend`. CS-domain questions use Python; frontend-domain questions use React. This is enforced by the per-file `defaultDomains` and per-question overrides in `react.md`.

---

## Adding a New Topic

1. Add an entry to `TOPIC_OPTIONS` in `src/content/categories.ts`:
   ```ts
   { topic: 'your-topic', name: 'Your Topic', domains: ['frontend'] }
   ```
2. Create `src/content/questions/<your-topic>.md` with matching `defaultTopics` and `defaultDomains`.
3. No other changes — `getCollection('questions')` picks up all files automatically.

---

## Adding Questions to an Existing File

Append a new entry to the `questions` array. Zod validates schema at build time — `npm run build` fails with a clear error if a question is malformed.

---

## Key Components

### `QuestionPrompt.tsx`

Renders a question. If `code` is present, shows `q` as a heading above a `<pre>` code block. If no `code`, shows `q` as a plain paragraph. No parsing, no flags.

### `src/components/shared/utils.ts`

- `shuffleArray<T>()` — Fisher-Yates shuffle.
- `sampleEvenlyByTopic()` — balanced picks across topics.
- `buildShuffled()` — shuffles question order and each question's options independently.
- `questionMatchesSelection()` — domain + topic filter used at quiz start.
- URL param helpers: `buildQuizSearchParams()` / `parseQuizSearchParams()`.

### `src/content.config.ts`

Zod schema + glob loader. Validates all question files at build time. If you add a new field to questions, add it here first.

---

## Dev Commands

```bash
npm run dev       # Start dev server at localhost:4321 with HMR
npm run build     # Type-check + build (validates all MD schemas via Zod)
npm run preview   # Preview production build locally
```

---

## Conventions

- `q` is always a plain, complete question sentence — no embedded code, no comment markers.
- Put code in the `code` field. Keep snippets under 15 lines for readability.
- Explanations should cover: (1) the direct answer, (2) why wrong options are wrong, (3) a real-world production context.
- Do not import anything into `.md` files — they are pure data.
- CS-domain questions use Python or pseudocode. Frontend-domain questions use JS/TS/React.

---

## Known Constraints

- No persistence — quiz state is in React memory only. Refreshing resets progress.
- No routing — screen state managed by `useState` in page-level island components.
- Theme persistence uses `localStorage` and `data-theme` on `<html>`.
