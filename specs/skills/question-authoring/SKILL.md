---
name: question-authoring
description: Use when adding, expanding, rewriting, or reviewing quiz questions in src/content/questions.
---

# Question Authoring Skill

Use this skill whenever the user asks to add, generate, expand, rewrite, or improve quiz questions.

## Source Context

1. Read the target question file: `src/content/questions/<difficulty>/<topic>.md`.
2. If a matching study file exists, read it first: `src/content/study/<difficulty>/<topic>.md`.
3. Use study lessons for concepts, examples, vocabulary, and level-appropriate scope.
4. Preserve the target file's `defaultDomains`, `defaultTopics`, and `difficulty`.

## Quantity

- A default quiz benefits from at least 20 questions per topic/difficulty.
- 20 is a useful minimum pool, not a content cap.
- If the user asks for "more questions" without a number, add enough useful coverage without padding.

## Question Quality

- Test understanding, not word matching.
- Keep `q` focused on one decision, concept, bug, or tradeoff.
- Use code snippets only when they make the question more concrete.
- Keep code snippets short enough to scan, ideally under 15 lines.
- Difficulty must match the folder: `junior`, `mid`, `senior`, or `principal`.

## Option Quality

Each question must have exactly one correct option.

Wrong options must be plausible in context:

- Use neighboring concepts from the same topic.
- Use realistic-but-wrong fixes or design choices.
- Use common misconceptions a learner at that level might have.
- Use examples that solve a nearby problem but not the one being asked.

Avoid weak distractors:

- Joke answers.
- Impossible claims.
- Unrelated technologies or concepts.
- Obvious process claims such as "no tests are needed".
- Generic "do nothing", "rename it", or "make it static" choices unless the prompt truly makes them plausible.

If the correct answer is a concept, wrong answers should be related concepts that almost fit but miss the key issue. If the correct answer is an action, command, design choice, or refactor, wrong answers should also be credible actions from the same domain.

## Explanations

Explanations should:

- State the correct answer directly.
- Explain why it fits the prompt.
- Briefly distinguish the most tempting wrong options.
- Include practical production context when useful.

## Workflow

1. Count existing questions with `rg -n "^- q:" src/content/questions/<difficulty>/<topic>.md`.
2. Read related study content and existing questions to avoid duplicates.
3. Draft questions that cover different concepts or examples from the study file.
4. Append questions to the YAML frontmatter `questions` array.
5. Run `npm run build` to validate Astro content schema.
6. Report final counts by difficulty/topic.
