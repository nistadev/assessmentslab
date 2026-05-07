# Contributing

## Setup

```bash
npm install
npm run dev
```

Always run before opening a PR:

```bash
npm run build
```

`npm run build` validates all question content through Zod schema checks. If a question field is wrong, the build fails with a clear error.

---

## Question Schema

Question files live in `src/content/questions/*.md`. The schema is enforced by `src/content.config.ts`.

### Required file-level fields

```yaml
defaultDomains: ["frontend"]    # domain(s) applied to all questions in this file
defaultTopics: ["react"]        # topic(s) applied to all questions in this file
```

### Required question fields

```yaml
- q: "Plain question text here."
  options:
    - text: "Option A"
      correct: false
    - text: "Correct answer"
      correct: true
    - text: "Option C"
      correct: false
    - text: "Option D"
      correct: false
  explanation: "Why this is correct and why the others are wrong."
  difficulty: junior            # junior | mid | senior | principal
```

### Optional question fields

```yaml
  code: |                       # Code snippet shown in a monospace block above options.
    def foo():
        return 42
  domains: ["computer-science"] # Overrides defaultDomains for this question only.
  topics: ["algorithms"]        # Overrides defaultTopics for this question only.
```

### Key rules

- `q` is plain text — the actual question sentence. Never embed code here.
- `code` is the optional code block. Keep it under 15 lines for readability.
- Exactly one option must have `correct: true`.
- `difficulty` must be one of: `junior`, `mid`, `senior`, `principal`.
- Run `npm run build` after adding questions — Zod reports malformed entries clearly.

---

## Domain and Topic Tagging

Domains and topics determine which quiz filters surface a question.

### Domains

| Key | Used for |
|---|---|
| `frontend` | Browser platform, JS/TS, React, Angular |
| `backend` | APIs, databases, Node.js, Python, server-side patterns |
| `computer-science` | Algorithms, data structures, design patterns, SOLID |
| `data-infra` | Data pipelines, DevOps, infrastructure |

### Language conventions

| Domain | Write code examples in |
|---|---|
| `computer-science` | Python or pseudocode — no framework imports |
| `frontend` | JavaScript, TypeScript, React, or browser APIs |
| `backend` | Node.js, Python, or server-side concepts |
| `data-infra` | SQL, CLI, or conceptual |

### Tagging rules

- `defaultDomains` must match what's actually in the file. A file of React HOC questions belongs in `["frontend"]`.
- Add per-question `domains` / `topics` overrides only when a question differs from the file default.
- Tags are exclusive: `domains: ["frontend"]` means the question will NOT appear in a `computer-science` domain quiz.
- Use multiple domains only when the question genuinely tests both (e.g. TypeScript generics apply to both frontend and backend).
- `design-patterns` and `solid-principles` topics appear under both `computer-science` (Python examples) and `frontend` (React examples). Use per-question `topics` overrides in `react.md` to tag React-specific variants.

To add a new topic, add an entry to `TOPIC_OPTIONS` in `src/content/categories.ts` then create the corresponding `.md` file.

---

## Content Quality

Each question should:

- Test one clear concept
- Have unambiguous wording
- Have exactly one correct answer
- Have an explanation that teaches, not just reveals

Good explanations include:
1. The direct answer
2. Why the wrong options are wrong (or what the trap is)
3. A real-world production context where the concept matters

---

## Quiz Behavior — Do Not Break

Do not accidentally break:

- `sampleEvenlyByTopic()` — balanced question sampling across topics
- `buildShuffled()` — per-run shuffling of question and option order
- `questionMatchesSelection()` — domain + topic filter logic
- URL-based quiz config: `buildQuizSearchParams()` / `parseQuizSearchParams()`

If you change quiz flow, test both:
- Start fresh from the home page
- Resume from a `/quiz?...` URL

---

## UI Changes

This app is study-first. Prefer:

- Clean card layout
- Clear visual hierarchy
- Strong contrast
- Restrained motion and decoration

Avoid changes that add distraction during active quiz sessions.

---

## Theme

daisyUI theme names are used directly:

- Light mode: `light`
- Dark mode: `dark`

If you update theme logic:
- Verify both modes render correctly
- Keep `localStorage` key behavior intact
- Keep `document.documentElement.dataset.theme` in sync

---

## Keeping Docs in Sync

If you change the question schema, domain list, topic list, quiz behavior, or component structure, update:

- `README.md`
- `CONTRIBUTING.md`
- `AGENTS.md`

---

## PR Checklist

- [ ] `npm run build` passes
- [ ] Questions manually verified in the UI
- [ ] Exactly one `correct: true` per question
- [ ] `q` is plain text (no code embedded)
- [ ] `code` field used for code snippets
- [ ] `defaultDomains` and `defaultTopics` match actual content
- [ ] Language matches domain convention (Python for CS, JS/React for frontend)
- [ ] Explanation teaches the concept with production context
- [ ] Docs updated if schema, domains, or behavior changed
