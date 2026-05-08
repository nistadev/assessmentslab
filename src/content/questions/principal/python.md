---
defaultDomains:
- backend
defaultTopics:
- python
questions:
- q: What is `objgraph` most useful for when diagnosing Python memory issues?
  options:
  - text: Visualizing object relationships and unexpectedly retained references
    correct: true
  - text: Benchmarking CPU-intensive loops
    correct: false
  - text: Linting unused imports
    correct: false
  - text: Building pandas pivot tables
    correct: false
  explanation: '`objgraph` helps inspect object growth and reference chains, which is valuable when leak cause is retained
    objects rather than raw allocation volume. It is a diagnostic graphing tool, not general profiler. Reference visibility
    is often what unlocks leak debugging.'
  difficulty: principal
---
