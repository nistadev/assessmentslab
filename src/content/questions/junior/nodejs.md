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
  explanation: 'Real Node.js systems often contain multiple async styles at once: legacy callbacks, promise-based APIs, async/await
    syntax, and event-driven flows. Senior developers need to understand all of them to read, debug, and modernize code safely.'
  difficulty: junior
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
  explanation: Node.js often uses events and listeners to decouple producers from consumers. That style fits non-blocking
    I/O and flexible workflows well. It improves modularity, but requires discipline around tracing and cleanup.
  difficulty: junior
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
  explanation: Async/await code should handle failures with try/catch where recovery or translation is needed, and then route
    errors through consistent application-level handling. Assuming errors will surface correctly on their own often leads
    to unstable services.
  difficulty: junior
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
  explanation: The event loop is central Node.js runtime mechanism for scheduling and processing asynchronous work. It enables
    efficient I/O concurrency in a single-threaded JavaScript environment. Understanding it is essential for diagnosing throughput
    and latency problems.
  difficulty: junior
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
  explanation: Blocking JavaScript or synchronous I/O stalls progress for other work sharing same event loop. That means slower
    responses and reduced concurrency. This is one of most important operational hazards in Node.js services.
  difficulty: junior
---
