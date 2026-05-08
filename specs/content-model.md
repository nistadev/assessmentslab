# Content Model

## Domains

| Domain | Description |
|---|---|
| `frontend` | Browser platform, frontend frameworks (React, Angular), client-side engineering |
| `backend` | Server-side patterns: APIs, databases, DDD, file I/O, integrations |
| `computer-science` | Language-agnostic fundamentals: algorithms, data structures, design patterns, SOLID |
| `data-infra` | Data systems, pipelines, deployments, operations |

## Topics

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

Defined in `src/content/categories.ts`.

---

## Question File Format

Questions are split into one file per topic per difficulty, organised under `src/content/questions/<difficulty>/<topic>.md`. For example: `junior/react.md`, `senior/nodejs.md`. A difficulty folder is omitted for a given topic if no questions exist at that level.

Every file uses YAML frontmatter:

```yaml
---
defaultDomains: ["frontend"]
defaultTopics: ["react"]
questions:
  - q: "Plain question text."
    code: |
      // optional code snippet, rendered in <pre>
    domains: ["frontend"]         # optional — overrides defaultDomains
    topics: ["react"]             # optional — overrides defaultTopics
    options:
      - text: "Option A"
        correct: false
      - text: "Option B"
        correct: true
      - text: "Option C"
        correct: false
      - text: "Option D"
        correct: false
    explanation: "Why correct is correct. Why wrong options are wrong. Production context."
    difficulty: "junior"          # must match the file's parent folder name
---
```

### Field rules

| Field | Required | Notes |
|---|---|---|
| `q` | Yes | Plain text, rendered as `<p>`. No embedded code. |
| `code` | No | Rendered in `<pre>` above options. Keep under 15 lines. |
| `options` | Yes | Exactly one `correct: true`. Shuffled on every quiz start. |
| `explanation` | Yes | Cover: direct answer + why wrong options fail + real-world context. |
| `difficulty` | Yes | `junior` / `mid` / `senior` / `principal` |
| `domains` | No | Per-question override for `defaultDomains`. |
| `topics` | No | Per-question override for `defaultTopics`. |

---

## Tagging Rules

- Every question in a file must have a `difficulty` matching the file's parent folder.
- `defaultDomains` / `defaultTopics` must accurately reflect the file's content.
- Use per-question overrides only when a question doesn't match file defaults.
- Domain tags are exclusive — `domains: ["frontend"]` won't appear in a `computer-science` quiz.
- Use multiple domains only when the question genuinely tests both.
- `design-patterns` and `solid-principles` appear under both `computer-science` and `frontend`:
  - CS-domain questions use Python or pseudocode.
  - Frontend-domain questions use JS/TS/React.

---

## Language Conventions

| Domain | Language |
|---|---|
| `computer-science` | Python or pseudocode. No framework imports. |
| `frontend` | JavaScript, TypeScript, React, browser APIs. No server-side code. |
| `backend` | Node.js, Python, or language-agnostic server concepts. |
| `data-infra` | Tool-specific (SQL, CLI, config) or conceptual. |

---

## Known Constraints

- No persistence — quiz state in React memory only. Refresh resets progress.
- No routing — screen state via `useState` in page-level islands.
- Theme persistence uses `localStorage` + `data-theme` on `<html>`.
