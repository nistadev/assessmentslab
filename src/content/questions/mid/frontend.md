---
defaultDomains:
- frontend
defaultTopics:
- frontend
questions:
- q: Why do teams adopt CSS methodologies such as BEM or SMACSS in large applications?
  options:
  - text: They provide naming and structural conventions that reduce collisions and make CSS easier to scale
    correct: true
  - text: They automatically compress CSS output better than standard CSS
    correct: false
  - text: They eliminate need for responsive design decisions
    correct: false
  - text: They replace browser testing with naming guarantees
    correct: false
  explanation: BEM and SMACSS are organizational conventions, not performance tools or browser-compat systems. Their value
    is predictable naming, lower coupling, and clearer ownership of styles. In big codebases, that discipline matters because
    many engineers touch same UI surface.
  difficulty: mid
- q: What is main reason to keep CSS specificity low in a scalable codebase?
  options:
  - text: Low specificity makes styles easier to override intentionally and reduces cascade fights
    correct: true
  - text: Low specificity guarantees smaller bundle size
    correct: false
  - text: Low specificity removes need for class names
    correct: false
  - text: Low specificity makes browser rendering faster in all cases
    correct: false
  explanation: Low specificity keeps CSS flexible and prevents override wars. Bundle size and render speed are not the main
    reason here, and class names are still essential. In production, high-specificity selectors create fragile styling where
    small changes trigger wide regressions.
  difficulty: mid
- q: Which topic is essential for understanding why Promise callbacks run after current synchronous code completes?
  options:
  - text: Event loop behavior
    correct: true
  - text: DOM tree normalization
    correct: false
  - text: CSS selector specificity
    correct: false
  - text: HTTP/1 header ordering
    correct: false
  explanation: Promise timing depends on event loop and task or microtask scheduling. DOM, CSS, and header ordering do not
    explain async sequencing. Senior frontend work often depends on knowing why code runs in specific order under load or
    race conditions.
  difficulty: mid
- q: Why is code splitting valuable in large front-end applications?
  options:
  - text: It avoids shipping all JavaScript upfront and reduces initial load cost
    correct: true
  - text: It makes browser caching impossible, which forces fresh code
    correct: false
  - text: It guarantees zero runtime errors in lazy-loaded routes
    correct: false
  - text: It removes need for performance budgets
    correct: false
  explanation: Code splitting reduces initial payload by loading code when needed. It does not remove need for caching, error
    handling, or budgets. In production, this is key for route-heavy apps and dashboards with many optional features.
  difficulty: mid
- q: What is key benefit of centralized state with predictable transitions in large JavaScript applications?
  options:
  - text: State changes become easier to trace, test, and reason about
    correct: true
  - text: It removes all need for local component state
    correct: false
  - text: It automatically makes every interaction faster
    correct: false
  - text: It guarantees fewer renders than any other architecture
    correct: false
  explanation: Centralized predictable state helps debugging, testing, and team coordination. It does not eliminate local
    state or guarantee performance by itself. In complex apps, clarity of data flow often matters more than theoretical architectural
    purity.
  difficulty: mid
- q: Which practice best modularizes JavaScript in enterprise front-end projects?
  options:
  - text: Split code into reusable modules with single responsibilities and minimal dependencies
    correct: true
  - text: Store shared utilities inside whichever feature needed them first
    correct: false
  - text: Expose internal implementation details so modules stay flexible
    correct: false
  - text: Prefer implicit globals to avoid import noise
    correct: false
  explanation: Good modularization means clear boundaries, small surfaces, and low coupling. Implicit globals and leaking
    implementation details make code harder to change safely. In enterprise teams, module design directly affects onboarding
    and refactor cost.
  difficulty: mid
---
