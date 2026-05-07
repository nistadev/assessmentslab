# AssesLab

AssesLab is a self-paced engineering quiz app. It covers software engineering interview topics across multiple domains, loads question banks from Markdown files at build time, shuffles questions and options per run, and supports timed quiz sessions with configurable difficulty and topic filters.

## Stack

- Astro 6
- React 18 via `@astrojs/react`
- Tailwind CSS 4
- daisyUI
- TypeScript
- Astro content collections + Zod validation

## Features

- Static build — no runtime backend required
- Question banks authored in Markdown frontmatter, validated by Zod at build time
- Domain and topic filtering (Frontend, Backend, Computer Science, Data & Infrastructure)
- Difficulty filtering: `junior`, `mid`, `senior`, `principal`
- Configurable timer and max question count
- Two feedback modes: after each answer, or only at the end
- Shuffled question and option order on every run

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

App runs at `http://localhost:4321`.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```text
src/
├── content.config.ts          # Zod schema for question files
├── content/
│   ├── categories.ts          # Domain and topic definitions
│   └── questions/             # One .md file per topic
├── components/
│   ├── HomePage.tsx
│   ├── QuizPage.tsx
│   ├── ResultsPage.tsx
│   ├── home/
│   ├── quiz/
│   ├── results/
│   └── shared/
└── pages/
    ├── index.astro
    ├── quiz.astro
    └── results.astro
```

## Authoring Questions

Questions live in `src/content/questions/*.md`. Each file maps to a topic.

```yaml
---
defaultDomains: ["computer-science"]
defaultTopics: ["design-patterns"]
questions:
  - q: "What does this print and why?"
    code: |
      a = DatabasePool()
      b = DatabasePool()
      a.connections.append("conn1")
      print(len(b.connections))
    options:
      - text: "1 -- a and b are the same object"
        correct: true
      - text: "0 -- b is a fresh instance"
        correct: false
      - text: "Error -- __new__ raises on second call"
        correct: false
      - text: "1 -- b copies a's state"
        correct: false
    explanation: "Singleton pattern. __new__ returns the same instance..."
    difficulty: "mid"
---
```

### Question fields

| Field | Required | Description |
|---|---|---|
| `q` | Yes | Plain question text — always rendered as readable text |
| `code` | No | Code snippet rendered in a monospace block |
| `options` | Yes | 2–5 options, exactly one with `correct: true` |
| `explanation` | Yes | Teach the concept, not just reveal the answer |
| `difficulty` | Yes | `junior` / `mid` / `senior` / `principal` |
| `domains` | No | Per-question domain override |
| `topics` | No | Per-question topic override |

### Domain conventions

| Domain | Language used in questions |
|---|---|
| `computer-science` | Python or pseudocode |
| `frontend` | JavaScript, TypeScript, React, browser APIs |
| `backend` | Node.js, Python, or server-side concepts |
| `data-infra` | SQL, CLI tools, or conceptual |

## Adding a New Topic

1. Add an entry to `TOPIC_OPTIONS` in `src/content/categories.ts`.
2. Create `src/content/questions/<slug>.md` with matching `defaultDomains` and `defaultTopics`.
3. Run `npm run build` to validate.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

## Quiz Behavior

- `sampleEvenlyByTopic()` picks questions evenly across selected topics.
- `buildShuffled()` randomizes question order and option order independently.
- Answer correctness travels with the option object — survives shuffling.
- Quiz config is encoded in the URL so sessions can resume after a page refresh.

## Deployment

Static Astro site. Works on Vercel with default settings:

- Build command: `npm run build`
- Output directory: `dist`
