---
defaultDomains:
- backend
defaultTopics:
- nodejs
questions:
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
  explanation: Promises and async/await often improve readability and reduce callback hell, especially in multi-step workflows.
    They do not change fundamental async behavior or eliminate operational concerns. Clearer structure usually means fewer
    bugs.
  difficulty: mid
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
  explanation: Node.js scales well on I/O-bound workloads because the event loop can keep accepting and coordinating work
    while async operations wait on external systems. CPU-bound tasks still need separate treatment. Scalability gains come
    from avoiding blocked execution.
  difficulty: mid
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
  explanation: Centralized error middleware improves consistency, observability, and API behavior by standardizing how failures
    are surfaced. It does not replace validation or make every error safe to reveal externally. Good error boundaries are
    key service hygiene.
  difficulty: mid
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
  explanation: Good async APIs are predictable in style, surface useful failures, and avoid blocking the event loop. Mixing
    patterns inside one interface usually increases confusion and bug risk. Clarity and consistency matter a lot in shared
    backend APIs.
  difficulty: mid
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
  explanation: Async systems interleave work from many requests, so correlation IDs help reconstruct one logical flow through
    logs and services. Without them, debugging high-concurrency issues gets much harder. They are core observability practice.
  difficulty: mid
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
  explanation: CPU-heavy work competes with request handling if done on main thread. Worker threads or external processing
    keep service responsive. Non-blocking architecture depends on isolating expensive computation from event loop.
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
  explanation: Event emitters help separate concerns and allow multiple consumers to react without tight direct dependencies.
    That flexibility is useful, but it needs conventions and observability. Loose coupling without discipline can become opaque
    coupling.
  difficulty: mid
---
