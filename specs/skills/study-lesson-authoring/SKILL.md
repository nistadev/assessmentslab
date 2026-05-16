---
name: study-lesson-authoring
description: Use when adding, expanding, rewriting, or reviewing study lessons in src/content/study, especially when lessons must progress by seniority from junior through principal.
---

# Study Lesson Authoring Skill

Use this skill whenever the user asks to add, generate, expand, rewrite, or improve study lessons.

## Source Context

1. Read the target study file: `src/content/study/<difficulty>/<topic>.md`.
2. Read nearby seniority files for the same topic when they exist:
   - `src/content/study/junior/<topic>.md`
   - `src/content/study/mid/<topic>.md`
   - `src/content/study/senior/<topic>.md`
   - `src/content/study/principal/<topic>.md`
3. Read `specs/content-model.md` if unsure about domains, topics, or language conventions.
4. Preserve `defaultDomains`, `defaultTopics`, and the file's `difficulty`.

## Study File Shape

Study files use YAML frontmatter:

```yaml
---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Clear lesson title
  explanation: |
    Main explanation.
  examples:
  - label: Concrete example
    description: Why this example matters.
    code: |
      value = example()
  difficulty: junior
---
```

Each lesson must include:

- `title`
- `explanation`
- `examples` with at least one example
- `difficulty` matching parent folder

## Seniority Progression

Use seniority to change the thinking level, not only vocabulary.

### Junior

Goal: recognize concepts and basic intent.

- Define the concept plainly.
- Explain where it appears in normal code.
- Include simple examples and non-examples.
- Call out common beginner confusion.
- Prefer local code examples over architecture discussion.

### Mid

Goal: identify concepts in real code and distinguish close alternatives.

- Compare neighboring concepts.
- Explain decision pressure: creation, structure, behavior, coupling, data flow, ownership.
- Show realistic smells such as repeated branches, leaky boundaries, wide interfaces, or duplicated setup.
- Explain when not to introduce an abstraction yet.
- Keep scope mostly within one module, service, or feature.

### Senior

Goal: make design decisions based on change, contracts, and operational reality.

- Start from change axis: what changes, how often, and who owns it.
- Cover composition, contracts, tests, migration, refactoring sequence, and failure semantics.
- Discuss async behavior, idempotency, ordering, retries, and observability when relevant.
- Explain the cost of the abstraction and how to avoid ceremony.
- Use examples that look like production service code, not toy-only code.

### Principal

Goal: use concepts as cross-team architecture and governance tools.

- Discuss team ownership, platform extension points, versioned contracts, invariants, rollout, observability, and incident ownership.
- Show how local patterns change across service, package, tenant, partner, or organization boundaries.
- Emphasize core invariants and explicit compatibility rules.
- Include teaching/decision-record framing so teams can apply tradeoffs consistently.
- Avoid pretending a code pattern solves organizational or distributed-system risk by itself.

## Design Patterns Progression

For `design-patterns` specifically:

- Junior: know all 23 GoF patterns, their group, intent, simple examples, and common misuse.
- Mid: distinguish pattern groups and close patterns:
  - Creational: Factory, Abstract Factory, Builder, Prototype, Singleton.
  - Structural: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
  - Behavioral: Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor.
- Senior: choose patterns from change axis, ownership, extension contracts, refactoring path, composition, and failure semantics.
- Principal: treat patterns as organizational APIs with governance, versioning, rollout, observability, and invariant protection.

## Lesson Quality

- Teach decisions and tradeoffs, not memorized labels.
- Make the opening paragraph clearly state the level-specific point.
- Use "Where to apply" and "Do not confuse with" sections when the local file already uses that style.
- Use examples that are plausible for the topic and difficulty.
- For `computer-science` domain, use Python or pseudocode. Avoid framework imports.
- Keep code snippets short enough to scan, ideally under 20 lines.
- Avoid padding, trivia, and examples that do not clarify a decision.

## Workflow

1. Count current lessons with `rg -n "^- title:" src/content/study/<difficulty>/<topic>.md`.
2. Read all seniority files for the topic to avoid duplicate coverage and preserve progression.
3. Decide which lesson gaps belong at each seniority.
4. Append or edit lessons in the relevant `lessons` array.
5. Run `npm run build` to validate Astro content schema.
6. Report changed files, added lesson count, and validation result.
