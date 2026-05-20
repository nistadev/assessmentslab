---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: What pattern is shown, and what does the base class protect?
  code: |
    class ReportWorkflow:
        def generate(self, data):
            raw = self.fetch(data)
            checked = self.validate(raw)
            shaped = self.transform(checked)
            return self.render(shaped)

        def validate(self, raw):
            return raw

        def fetch(self, data):
            raise NotImplementedError

        def transform(self, raw):
            raise NotImplementedError

        def render(self, data):
            raise NotImplementedError
  options:
  - text: Template Method; the invariant workflow order is protected while selected steps vary
    correct: true
  - text: Strategy; every report can freely replace the whole workflow at runtime
    correct: false
  - text: Chain of Responsibility; each step may skip the rest of the workflow independently
    correct: false
  - text: Abstract Factory; the base class creates a compatible family of report objects
    correct: false
  explanation: |
    Template Method fits because the base class owns the algorithm skeleton and subclasses fill in controlled steps. Strategy would swap an algorithm from the outside, Chain would route a request through handlers, and Abstract Factory would create related products rather than protect sequence invariants.
  difficulty: principal
- q: A pricing strategy registry is owned by the platform team while markets implement their own rules. What does the pattern become at principal level?
  options:
  - text: An organizational API with owners, contracts, compatibility rules, support paths, and operational visibility
    correct: true
  - text: A local code convenience that each market can change without platform coordination
    correct: false
  - text: A one-time refactor that removes the need for versioning because all rules share one interface
    correct: false
  - text: A reason to let market rules mutate checkout state directly because they are registered extensions
    correct: false
  explanation: |
    At team scale, the pattern defines how teams ship behavior through a shared platform contract. The interface alone is not enough; ownership, compatibility, support, validation, and observability are part of the design. Registered extensions still should not bypass core invariants.
  difficulty: principal
- q: Checkout exposes an extension point before payment capture, but accounting and authorization must remain correct. Which rule is strongest?
  options:
  - text: Let extensions propose decisions, then have the owning core validate invariants before state changes
    correct: true
  - text: Let trusted extensions update checkout state directly, then audit incidents after release
    correct: false
  - text: Remove the extension point because core invariants and extension can never coexist
    correct: false
  - text: Move authorization into every extension so the platform team owns less code
    correct: false
  explanation: |
    Principal-level Open/Closed design keeps extension open while core invariants remain closed. Extensions can propose adjustments or decisions, but the checkout core must validate money, authorization, state transitions, and accounting before committing changes.
  difficulty: principal
- q: Why version a shared event, command, adapter, or extension contract before many teams depend on it?
  options:
  - text: To let old and new producers, consumers, or implementations coexist during migration
    correct: true
  - text: To guarantee the contract never needs behavior documentation
    correct: false
  - text: To avoid compatibility tests because versions make breaking changes obvious
    correct: false
  - text: To make every internal helper class part of the public platform API
    correct: false
  explanation: |
    Versioning supports safe migration across teams, services, packages, tenants, or partners. It does not replace documentation or compatibility tests, and it should be used where a contract crosses a meaningful boundary, not for every private helper.
  difficulty: principal
- q: A plugin-style extension point is live under production traffic. Which controls belong in the architecture, not as afterthoughts?
  options:
  - text: Feature flags, canaries, per-extension metrics, tracing, timeouts, circuit breakers, and kill switches
    correct: true
  - text: A larger base interface so each extension can handle every workflow phase itself
    correct: false
  - text: Synchronous execution for all extensions so failures are easier to reproduce
    correct: false
  - text: A manual runbook only, because automated rollback encourages risky extensions
    correct: false
  explanation: |
    Rollout and observability are part of extension design because independent behavior creates independent production risk. Bigger interfaces and synchronous execution can increase coupling and blast radius. Runbooks help, but they do not replace automated diagnosis and rollback controls.
  difficulty: principal
- q: Why can a local GoF pattern name be misleading when the design crosses service boundaries?
  options:
  - text: Process boundaries add latency, partial failure, retries, duplicates, ordering, schema evolution, and ownership concerns
    correct: true
  - text: GoF patterns stop applying once code is split into separate repositories
    correct: false
  - text: Service boundaries automatically turn local coupling into platform governance
    correct: false
  - text: Distributed versions of patterns need fewer contracts because messages decouple teams
    correct: false
  explanation: |
    The vocabulary can still help, but the failure model changes. A local Observer callback becomes an event delivery contract. A local Proxy becomes a latency and timeout boundary. A local Command may need idempotency, authorization, and audit. Distributed decoupling increases the need for explicit contracts.
  difficulty: principal
---
