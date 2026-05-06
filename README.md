# AssesLab

AssesLab is a self-paced engineering quiz app built with Astro and React. It loads question banks from Markdown files at build time, shuffles both questions and options per run, and supports timed quiz sessions across multiple categories and difficulty levels.

## Stack

- Astro 6
- React 18 via `@astrojs/react`
- Tailwind CSS 4
- daisyUI
- TypeScript
- Astro content collections + Zod validation

## Features

- Static build, no runtime backend required
- Question banks authored in Markdown frontmatter
- Category filtering
- Difficulty filtering: `junior`, `mid`, `senior`, `principal`
- Configurable timer
- Configurable max question count
- Two feedback modes:
  - `Show response after check`
  - `Show only at the end`
- Shuffled question order and shuffled option order on every run

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

App runs on Astro dev server, usually at `http://localhost:4321`.

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
├── components/
│   ├── Quiz.tsx
│   └── quiz/
│       ├── HomeScreen.tsx
│       ├── QuizScreen.tsx
│       ├── ResultScreen.tsx
│       ├── QuestionPrompt.tsx
│       ├── ReviewQuestionCard.tsx
│       ├── ThemeToggle.tsx
│       ├── types.ts
│       └── utils.ts
├── content/
│   └── questions/
├── content.config.ts
├── pages/
│   ├── index.astro
│   └── quiz.astro
└── styles/
    └── global.css
```

## Authoring Questions

Questions live in `src/content/questions/*.md`.

Each file contains frontmatter shaped like:

```yaml
---
category: "React"
questions:
  - q: |
      const x = 1;
      // What is logged?
    options:
      - text: "1"
        correct: true
      - text: "2"
        correct: false
      - text: "undefined"
        correct: false
      - text: "null"
        correct: false
    explanation: "Explain why."
    isCode: true
    difficulty: "junior"
---
```

### Rules

- Exactly one option must use `correct: true`.
- `difficulty` must be one of:
  - `junior`
  - `mid`
  - `senior`
  - `principal`
- `isCode: true` enables code-question rendering.
- For code questions, trailing `// ...` line is treated as prompt text and displayed before code.
- Category strings should stay consistent across files.

## Adding a New Category

1. Create a new Markdown file in `src/content/questions/`.
2. Use a new `category` name in frontmatter.
3. Add category badge mapping in `src/components/quiz/utils.ts` under `CATEGORY_COLORS`.
4. Run `npm run build` to validate schema and output.

If no badge mapping exists, category falls back to `badge-neutral`.

## Quiz Behavior

- Questions are loaded at build time through Astro content collections.
- `sampleEvenlyByCategory()` attempts balanced picks across selected categories.
- `buildShuffled()` randomizes question order and option order.
- Answer correctness is attached to option objects, so correctness survives shuffling.
- Theme is stored in `localStorage` and synced to `document.documentElement.dataset.theme`.

## Deployment

This project builds as a static Astro site and works well on Vercel with standard settings:

- Build command: `npm run build`
- Output directory: `dist`

## Scripts

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
