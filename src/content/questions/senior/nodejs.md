---
defaultDomains:
- backend
defaultTopics:
- nodejs
questions:
- q: How can race conditions be reduced in asynchronous JavaScript code?
  options:
  - text: Sequence critical operations carefully, avoid shared mutable state, and use locks or mutexes when needed
    correct: true
  - text: Use more event emitters so all operations become ordered automatically
    correct: false
  - text: Convert every promise into a timeout callback
    correct: false
  - text: Rely on single-threaded execution as full protection against races
    correct: false
  explanation: Single-threaded JavaScript can still have races because operations interleave over time. Shared state plus
    async timing creates inconsistent outcomes unless sequencing is controlled. Good design often removes shared mutable state
    entirely where possible.
  difficulty: senior
- q: What is common challenge when integrating third-party async libraries into an existing Node.js codebase?
  options:
  - text: Inconsistent async conventions, error behavior, and cleanup requirements often need adaptation
    correct: true
  - text: Third-party libraries always follow same promise and event contract
    correct: false
  - text: Node.js cannot wrap external libraries behind adapters
    correct: false
  - text: Only CPU usage matters; interface mismatch is minor
    correct: false
  explanation: External libraries vary in callback style, promise behavior, event semantics, cleanup, and resource management.
    Senior teams often build wrappers or adapters to normalize those differences. This reduces coupling and makes failures
    easier to manage.
  difficulty: senior
- q: What is main trade-off of heavy event emitter usage at scale?
  options:
  - text: Debugging flow and preventing leaks become harder if events are poorly documented or cleaned up
    correct: true
  - text: Event emitters cannot support asynchronous workloads
    correct: false
  - text: They force all modules into callback-only style
    correct: false
  - text: They eliminate modularity by design
    correct: false
  explanation: Event-driven systems can become difficult to trace because control flow is indirect. Long-lived listeners can
    also leak memory or duplicate work if not removed correctly. Good event naming, ownership, and cleanup rules reduce those
    risks.
  difficulty: senior
- q: Why should Node.js teams monitor unhandled exceptions and promise rejections closely?
  options:
  - text: They often indicate broken async flows that can leave service in unstable or partially failed state
    correct: true
  - text: They are mostly harmless if process keeps running
    correct: false
  - text: They occur only in development, not production
    correct: false
  - text: They matter only when using event emitters
    correct: false
  explanation: Unhandled failures are strong signal that error boundaries are incomplete. In production they can cause lost
    work, corrupt state assumptions, or crashes. Monitoring them is part of basic runtime safety.
  difficulty: senior
---
