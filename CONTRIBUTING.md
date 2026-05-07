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

Build validates all question content via Zod. Malformed fields fail with a clear error.

---

## Adding Questions

Append to the relevant `src/content/questions/*.md` file.

```yaml
- q: "Plain question text."
  code: |
    def example():
        return 42
  options:
    - text: "Option A"
      correct: false
    - text: "Correct answer"
      correct: true
  explanation: "Why this is correct and why the others are wrong."
  difficulty: mid
  domains: ["computer-science"]   # optional — overrides file default
  topics: ["algorithms"]          # optional — overrides file default
```

Rules:
- `q` is plain text — never embed code here
- Exactly one option must have `correct: true`
- `difficulty`: `junior` | `mid` | `senior` | `principal`
- `code` should stay under 15 lines

---

## Domains

| Key | Used for |
|---|---|
| `frontend` | JS/TS, React, browser APIs |
| `backend` | Node.js, Python, APIs, server-side patterns |
| `computer-science` | Algorithms, data structures, design patterns |
| `data-infra` | SQL, DevOps, infrastructure |

Code language follows domain: Python for `computer-science`, JS/React for `frontend`.

---

## Content Quality

Each question should test one concept, have unambiguous wording, and one clearly correct answer.

Good explanation: direct answer + why wrong options are wrong + real-world context.

---

## Adding a Topic

1. Add entry to `TOPIC_OPTIONS` in `src/content/categories.ts`.
2. Create `src/content/questions/<slug>.md` with matching `defaultDomains` + `defaultTopics`.

---

## PR Checklist

- [ ] `npm run build` passes
- [ ] Questions verified in the UI
- [ ] Exactly one `correct: true` per question
- [ ] `q` is plain text, code in `code` field
- [ ] Explanation teaches with production context
- [ ] Docs updated if schema, domains, or behavior changed
