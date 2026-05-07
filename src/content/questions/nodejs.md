---
defaultDomains:
  - backend
defaultTopics:
  - nodejs
questions:
  - q: Which asynchronous patterns are most important to understand in Node.js codebases?
    options:
      - text: Callbacks, promises, async/await, and event emitters
        correct: true
      - text: Only callbacks, because promises replace event emitters
        correct: false
      - text: Only async/await, because callbacks and promises no longer exist
        correct: false
      - text: Threads, locks, and coroutines as primary Node.js defaults
        correct: false
    explanation: "Real Node.js systems often contain multiple async styles at once: legacy callbacks, promise-based APIs, async/await syntax, and event-driven flows. Senior developers need to understand all of them to read, debug, and modernize code safely."
    difficulty: junior
  - q: Why do many senior Node.js developers prefer promises and async/await over nested callbacks?
    options:
      - text: They usually produce clearer control flow and make error handling easier to reason about
        correct: true
      - text: They make event loop unnecessary
        correct: false
      - text: They guarantee faster execution for every async operation
        correct: false
      - text: They remove need for monitoring rejected operations
        correct: false
    explanation: Promises and async/await often improve readability and reduce callback hell, especially in multi-step workflows. They do not change fundamental async behavior or eliminate operational concerns. Clearer structure usually means fewer bugs.
    difficulty: mid
  - q: What is event-driven architecture in Node.js?
    options:
      - text: Components communicate by emitting and reacting to events, allowing decoupled asynchronous behavior
        correct: true
      - text: All logic runs in one synchronous request pipeline
        correct: false
      - text: Every module shares one mutable global state object
        correct: false
      - text: Each request is mapped to dedicated OS thread by default
        correct: false
    explanation: Node.js often uses events and listeners to decouple producers from consumers. That style fits non-blocking I/O and flexible workflows well. It improves modularity, but requires discipline around tracing and cleanup.
    difficulty: junior
  - q: Why can event-driven design improve scalability in Node.js?
    options:
      - text: It supports non-blocking I/O and lets one process manage many concurrent operations efficiently
        correct: true
      - text: It makes CPU-heavy work free because listeners run outside JavaScript thread
        correct: false
      - text: It removes all latency from network and disk operations
        correct: false
      - text: It guarantees linear scaling without architecture changes
        correct: false
    explanation: Node.js scales well on I/O-bound workloads because the event loop can keep accepting and coordinating work while async operations wait on external systems. CPU-bound tasks still need separate treatment. Scalability gains come from avoiding blocked execution.
    difficulty: mid
  - q: Which error-handling pattern is standard for async/await in Node.js?
    options:
      - text: Wrap awaited operations in try/catch and propagate or centralize errors consistently
        correct: true
      - text: Ignore rejected promises because framework middleware catches everything automatically
        correct: false
      - text: Use synchronous throw only outside async functions
        correct: false
      - text: Convert all async code back to callbacks so errors are visible
        correct: false
    explanation: Async/await code should handle failures with try/catch where recovery or translation is needed, and then route errors through consistent application-level handling. Assuming errors will surface correctly on their own often leads to unstable services.
    difficulty: junior
  - q: What is role of centralized error middleware in frameworks like Express?
    options:
      - text: It provides one consistent place to transform, log, and return application errors
        correct: true
      - text: It prevents errors from happening inside route handlers
        correct: false
      - text: It makes validation unnecessary in handlers
        correct: false
      - text: It guarantees stack traces are safe to expose to clients
        correct: false
    explanation: Centralized error middleware improves consistency, observability, and API behavior by standardizing how failures are surfaced. It does not replace validation or make every error safe to reveal externally. Good error boundaries are key service hygiene.
    difficulty: mid
  - q: What does the Node.js event loop do?
    options:
      - text: It coordinates callbacks, timers, and asynchronous completions so one thread can keep serving work
        correct: true
      - text: It parallelizes all JavaScript execution across CPU cores automatically
        correct: false
      - text: It stores pending HTTP responses on disk until handlers complete
        correct: false
      - text: It converts blocking APIs into non-blocking ones without code changes
        correct: false
    explanation: The event loop is central Node.js runtime mechanism for scheduling and processing asynchronous work. It enables efficient I/O concurrency in a single-threaded JavaScript environment. Understanding it is essential for diagnosing throughput and latency problems.
    difficulty: junior
  - q: What is best practice when designing asynchronous APIs in Node.js?
    options:
      - text: Choose one async style consistently, return meaningful errors, and keep APIs non-blocking
        correct: true
      - text: Mix callbacks and promises within same method so callers can choose dynamically
        correct: false
      - text: Use synchronous file and network APIs when simpler to code
        correct: false
      - text: Hide failures by resolving null for every error
        correct: false
    explanation: Good async APIs are predictable in style, surface useful failures, and avoid blocking the event loop. Mixing patterns inside one interface usually increases confusion and bug risk. Clarity and consistency matter a lot in shared backend APIs.
    difficulty: mid
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
    explanation: Single-threaded JavaScript can still have races because operations interleave over time. Shared state plus async timing creates inconsistent outcomes unless sequencing is controlled. Good design often removes shared mutable state entirely where possible.
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
    explanation: External libraries vary in callback style, promise behavior, event semantics, cleanup, and resource management. Senior teams often build wrappers or adapters to normalize those differences. This reduces coupling and makes failures easier to manage.
    difficulty: senior
  - q: Why are correlation IDs useful when debugging asynchronous Node.js flows?
    options:
      - text: They connect related logs and events across async boundaries so one request path can be traced
        correct: true
      - text: They make stack traces unnecessary
        correct: false
      - text: They prevent promise rejections from occurring
        correct: false
      - text: They replace need for structured logging formats
        correct: false
    explanation: Async systems interleave work from many requests, so correlation IDs help reconstruct one logical flow through logs and services. Without them, debugging high-concurrency issues gets much harder. They are core observability practice.
    difficulty: mid
  - q: What is impact of blocking code on the Node.js event loop?
    options:
      - text: It prevents loop from handling more events, which hurts latency and throughput for other requests
        correct: true
      - text: It affects only current request because Node isolates each request in separate thread
        correct: false
      - text: It is harmless if code blocks for file I/O instead of CPU work
        correct: false
      - text: It improves consistency by forcing strict ordering
        correct: false
    explanation: Blocking JavaScript or synchronous I/O stalls progress for other work sharing same event loop. That means slower responses and reduced concurrency. This is one of most important operational hazards in Node.js services.
    difficulty: junior
  - q: How should CPU-intensive tasks usually be handled in Node.js services?
    options:
      - text: Offload them to worker threads, queues, or separate services instead of blocking main event loop
        correct: true
      - text: Run them inline so fewer processes are needed
        correct: false
      - text: Replace them with synchronous APIs for predictability
        correct: false
      - text: Emit more events around them so they become non-blocking
        correct: false
    explanation: CPU-heavy work competes with request handling if done on main thread. Worker threads or external processing keep service responsive. Non-blocking architecture depends on isolating expensive computation from event loop.
    difficulty: mid
  - q: What is major benefit of using event emitters in large Node.js applications?
    options:
      - text: They decouple components and enable flexible asynchronous communication
        correct: true
      - text: They guarantee event flow is always easier to debug than direct calls
        correct: false
      - text: They remove need for documentation because listeners are self-discoverable
        correct: false
      - text: They ensure no memory management concerns in long-lived processes
        correct: false
    explanation: Event emitters help separate concerns and allow multiple consumers to react without tight direct dependencies. That flexibility is useful, but it needs conventions and observability. Loose coupling without discipline can become opaque coupling.
    difficulty: mid
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
    explanation: Event-driven systems can become difficult to trace because control flow is indirect. Long-lived listeners can also leak memory or duplicate work if not removed correctly. Good event naming, ownership, and cleanup rules reduce those risks.
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
    explanation: Unhandled failures are strong signal that error boundaries are incomplete. In production they can cause lost work, corrupt state assumptions, or crashes. Monitoring them is part of basic runtime safety.
    difficulty: senior
---

# Node.js Questions

Conceptual Node.js questions covering async patterns, event-driven architecture, error handling, event loop behavior, race conditions, observability, blocking code, and event emitter tradeoffs.
