---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: What pattern? What does a subclass that only overrides render() guarantee?
  code: "class ReportGenerator:\n    def generate(self, data: dict) -> str:\n        raw = self.fetch(data)\n        processed\
    \ = self.transform(raw)\n        return self.render(processed)\n\n    def transform(self, raw):\n        return raw  #\
    \ default: identity\n\n    def fetch(self, data): raise NotImplementedError\n    def render(self, data): raise NotImplementedError\n\
    \nclass CSVReport(ReportGenerator):\n    def fetch(self, data): return data[\"rows\"]\n    def render(self, data):\n \
    \       return \"\\n\".join(\",\".join(str(c) for c in row) for row in data)\n\nclass JSONReport(ReportGenerator):\n \
    \   def fetch(self, data): return data\n    def render(self, data):\n        import json; return json.dumps(data)"
  options:
  - text: Template Method
    correct: true
  - text: Strategy
    correct: false
  - text: Factory
    correct: false
  - text: Chain of Responsibility
    correct: false
  explanation: Template Method. generate() defines the invariant algorithm skeleton (fetch → transform → render). Subclasses
    override only the variant steps. A subclass overriding only render() gets the default identity transform and must provide
    fetch. The base class controls the flow; subclasses customize the parts. Used in Python's unittest (setUp/tearDown/test*),
    HTTP request handlers, and data pipelines where the processing sequence must stay consistent.
  difficulty: principal
- q: A pricing strategy registry is owned by one platform team, and markets implement rules. What does this pattern become at principal level?
  options:
  - text: An organizational API with ownership, contracts, and support boundaries
    correct: true
  - text: A way to avoid versioning forever
    correct: false
  - text: A reason to let every team mutate shared core state
    correct: false
  - text: Proof that the code is fully open-source
    correct: false
  explanation: Principal-level patterns are not just code shapes. They define how teams interact, who owns the extension point, and who supports failures. The study file treats the pattern as an API boundary, not only a class design.
  difficulty: principal
- q: An extension point may add behavior, but checkout must still protect payments and accounting. What is the right principal-level rule?
  options:
  - text: Keep core invariants closed and validate extension output before state changes
    correct: true
  - text: Let extensions update state directly if they are well named
    correct: false
  - text: Remove all extension points to avoid risk
    correct: false
  - text: Rely on code review alone instead of runtime checks
    correct: false
  explanation: Principal design opens extension, not invariants. Extensions can propose decisions or adjustments, but the owning core must validate them before changing money, identity, or workflow state. That keeps business correctness protected.
  difficulty: principal
- q: Why version a contract for events, commands, or adapters?
  options:
  - text: To let old and new implementations coexist during migration
    correct: true
  - text: To make the interface impossible to change later
    correct: false
  - text: To avoid writing tests for extensions
    correct: false
  - text: To keep the code local only
    correct: false
  explanation: Principal-level contracts cross team or service boundaries, so migration matters. Versioning lets producers, consumers, and adapters move safely without breaking everyone at once.
  difficulty: principal
- q: What belongs with rollout and observability when an extension point is live?
  options:
  - text: Feature flags, metrics, tracing, timeouts, and kill switches
    correct: true
  - text: Only comments in the source file
    correct: false
  - text: No monitoring until the pattern proves itself
    correct: false
  - text: More inheritance layers
    correct: false
  explanation: The principal file treats rollout and observability as part of the design. Extension points need safe release and fast diagnosis. Feature flags and kill switches are how you limit blast radius when a new strategy or subscriber misbehaves.
  difficulty: principal
- q: Why can local GoF patterns become misleading across services?
  options:
  - text: Distributed systems add latency, duplicates, retries, ordering, and partial failure
    correct: true
  - text: Because patterns stop working when code is split into files
    correct: false
  - text: Because service boundaries automatically make code simpler
    correct: false
  - text: Because only principal-level code can use patterns
    correct: false
  explanation: |
    A local Observer, Proxy, or Command has different failure modes once a process boundary appears. The principal lesson is to keep the pattern vocabulary but design for distributed reality: compatibility, observability, and recovery.
  difficulty: principal
---
