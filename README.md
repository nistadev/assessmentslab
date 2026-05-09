# AssessmentsLab

Self-paced quiz app for practising software engineering assessments. Questions authored in Markdown, validated at build time, no backend required.

## Stack

- Astro 6 + React 19
- Tailwind CSS 4 + daisyUI
- TypeScript + Zod

## Getting Started

```bash
npm install
npm run dev       # localhost:4321
npm run build     # type-check + build + Zod validation
npm run preview
```

## Project Structure

```
src/
├── content.config.ts        # Zod schema
├── content/
│   ├── categories.ts        # Domain + topic definitions
│   └── questions/           # One .md file per topic
├── components/
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
  - q: "What does this print?"
    code: |
      a = Pool()
      b = Pool()
      print(a is b)
    options:
      - text: "True"
        correct: true
      - text: "False"
        correct: false
    explanation: "Singleton — __new__ returns the same instance."
    difficulty: mid
---
```

| Field | Required | Notes |
|---|---|---|
| `q` | Yes | Plain text only — no code here |
| `code` | No | Code snippet, keep under 15 lines |
| `options` | Yes | 2–5 options, exactly one `correct: true` |
| `explanation` | Yes | Teach the concept, not just the answer |
| `difficulty` | Yes | `junior` / `mid` / `senior` / `principal` |

## Adding a Topic

1. Add entry to `TOPIC_OPTIONS` in `src/content/categories.ts`.
2. Create `src/content/questions/<slug>.md` with matching `defaultDomains` + `defaultTopics`.
3. `npm run build` to validate.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

## Deployment

Static site. Vercel default settings work out of the box.

## License

[MIT](./LICENSE)
