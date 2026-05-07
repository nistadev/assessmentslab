# Tech Stack

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Astro 6 | Static-first, islands architecture — zero JS by default, opt-in per component |
| UI | React 19 (`client:load`) | Island hydration only where interactivity needed (quiz, results) |
| Styling | Tailwind CSS 4 + daisyUI | Utility-first + pre-built theme tokens, light/dark out of the box |
| Content | Astro Content Collections | Questions authored in Markdown, validated at build time — no DB needed |
| Type safety | TypeScript + Zod | Schema enforced at build; malformed questions fail fast |
| Runtime | Node.js | Dev server + build tooling |

## Data

Questions live in `src/content/questions/*.md` — YAML frontmatter, loaded and validated by Zod schema at build time. No runtime DB for question content.

No persistence layer currently. Guest sessions are in-memory only. Auth + persistence is a future phase.

## Testing

No test suite currently. Zod schema validation on `npm run build` acts as the content integrity gate.

## Tooling

```
npm run dev       # Dev server at localhost:4321 with HMR
npm run build     # Type-check + build + Zod validation
npm run preview   # Preview production build
```

## What We Are Not Using

| Excluded | Why |
|---|---|
| Next.js / Remix | SSR overhead not needed — content is static at build time |
| Database (current) | All content is file-based; no user data in v1 |
| CSS-in-JS | Tailwind covers all styling needs |
| Testing framework | Deferred — Zod catches content errors; UI testing added in hardening phase |
