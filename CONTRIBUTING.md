# Contributing

## Scope

This project is content-heavy and behavior-sensitive. Small UI changes are easy to make, but content schema, quiz flow, and shuffle behavior should stay predictable.

## Setup

```bash
npm install
npm run dev
```

Before opening a PR or handing off changes, run:

```bash
npm run build
```

`npm run build` is required because it validates question content through Astro content collections and Zod.

## Contribution Rules

### 1. Preserve content schema

Question files in `src/content/questions/` must match `src/content.config.ts`.

Current required question fields:

- `q: string`
- `options: { text: string; correct: boolean }[]`
- `explanation: string`
- `isCode: boolean`
- `difficulty: 'junior' | 'mid' | 'senior' | 'principal'`

Collection-level required field:

- `category: string`

If you change schema, update both:

- `src/content.config.ts`
- all affected Markdown content

### 2. Keep question quality high

Each question should:

- test one clear concept
- avoid ambiguous wording
- include exactly one correct option
- include an explanation that teaches, not only reveals answer

For code questions:

- keep snippets short and readable
- use YAML block scalar `q: |`
- end with a trailing `// ...` prompt line when possible

### 3. Keep category names stable

Category names are plain strings. Inconsistent spelling or casing creates duplicate categories in UI.

If you add a new category, also update `CATEGORY_COLORS` in `src/components/quiz/utils.ts`.

### 4. Respect quiz behavior

Do not accidentally break:

- category-balanced sampling in `sampleEvenlyByCategory()`
- per-run shuffling in `buildShuffled()`
- answer correctness after option shuffling
- URL-based quiz config parsing in `buildQuizSearchParams()` / `parseQuizSearchParams()`

If you change quiz flow, test both:

- start from home page
- start from `/quiz?...` URL params

### 5. UI changes should avoid distractions

This app is study-first. Styling should support readability over novelty, especially on active quiz screens.

Prefer:

- clean card layout
- clear hierarchy
- strong contrast
- restrained motion and decoration

### 6. Theme changes must support both modes

Theme values are daisyUI theme names:

- `light`
- `business`

If you update theme logic or styles:

- verify both modes
- keep `localStorage` key behavior intact
- keep `document.documentElement.dataset.theme` in sync

### 7. Keep docs in sync

If you change:

- commands
- question schema
- category process
- deployment assumptions

update:

- `README.md`
- `CONTRIBUTING.md`
- `AGENTS.md` when project guidance changes materially

## Suggested Workflow

1. Make focused change.
2. Run `npm run build`.
3. Verify affected quiz flow manually.
4. Update docs if behavior or authoring rules changed.

## PR Guidelines

Good PRs are:

- small
- behaviorally clear
- easy to verify
- explicit about content/schema/UI impact

Include:

- what changed
- why it changed
- how you verified it

## Content Checklist

Before adding or editing questions, check:

- category name is correct
- difficulty is valid
- one answer is correct
- explanation is useful
- code question prompt is readable
- build passes
