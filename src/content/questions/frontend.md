---
defaultDomains:
  - frontend
defaultTopics:
  - frontend
questions:
  - q: Which practice most directly improves long-term maintainability in a large HTML/CSS codebase?
    options:
      - text: Use semantic HTML and consistent naming conventions with a modular CSS methodology
        correct: true
      - text: Prefer deeply nested selectors so styles stay close to the DOM structure
        correct: false
      - text: Rely on inline styles to make component intent obvious
        correct: false
      - text: Keep all shared styles in one very large stylesheet to reduce files
        correct: false
    explanation: Semantic HTML plus consistent naming and modular CSS make code easier to reason about, reuse, and refactor. Deep selector chains and giant global files increase coupling, while inline styles hurt reuse and reviewability. In production, teams need predictable structure more than short-term speed.
    difficulty: junior
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
    explanation: BEM and SMACSS are organizational conventions, not performance tools or browser-compat systems. Their value is predictable naming, lower coupling, and clearer ownership of styles. In big codebases, that discipline matters because many engineers touch same UI surface.
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
    explanation: Low specificity keeps CSS flexible and prevents override wars. Bundle size and render speed are not the main reason here, and class names are still essential. In production, high-specificity selectors create fragile styling where small changes trigger wide regressions.
    difficulty: mid
  - q: Which approach best supports cross-browser compatibility for modern front-end features?
    options:
      - text: Use standards-compliant HTML/CSS, test on target browsers, and add polyfills or fallbacks where needed
        correct: true
      - text: Target Chrome first and assume other evergreen browsers match behavior
        correct: false
      - text: Use vendor-prefixed CSS only and skip browser testing
        correct: false
      - text: Avoid all modern features regardless of support data
        correct: false
    explanation: Cross-browser compatibility comes from standards-first implementation plus verification and selective fallbacks. Prefixes alone are insufficient, and avoiding all modern features is unnecessary. Real teams balance progress with support matrix requirements.
    difficulty: junior
  - q: What is correct role of feature detection tools such as Modernizr?
    options:
      - text: Detect whether browser supports specific features so app can choose enhancements or fallbacks
        correct: true
      - text: Replace all polyfills automatically at runtime
        correct: false
      - text: Normalize every CSS difference between browsers
        correct: false
      - text: Compile JavaScript down to older syntax for legacy browsers
        correct: false
    explanation: Feature detection checks capabilities, not browser brand, then lets code branch safely. It does not replace bundlers, polyfills, or CSS normalization tools. In production, capability-based decisions age better than user-agent assumptions.
    difficulty: senior
  - q: Which JavaScript concept is most closely tied to understanding why asynchronous callbacks can still access outer variables later?
    options:
      - text: Closures
        correct: true
      - text: Prototype chains
        correct: false
      - text: Tree shaking
        correct: false
      - text: CSSOM parsing
        correct: false
    explanation: Closures allow functions to retain access to lexical scope after outer function execution completes. Prototype chains deal with inheritance, not async variable access. This matters constantly in event handlers, timers, and data-fetch callbacks.
    difficulty: junior
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
    explanation: Promise timing depends on event loop and task or microtask scheduling. DOM, CSS, and header ordering do not explain async sequencing. Senior frontend work often depends on knowing why code runs in specific order under load or race conditions.
    difficulty: mid
  - q: Which front-end change usually improves performance without changing user-facing behavior?
    options:
      - text: Minify assets and defer non-critical JavaScript
        correct: true
      - text: Increase image resolution for retina displays on all devices
        correct: false
      - text: Move all code into one bundle to avoid imports
        correct: false
      - text: Replace caching with frequent polling
        correct: false
    explanation: Minification and deferring non-critical JS reduce transfer and main-thread cost. Higher-resolution assets everywhere, single giant bundles, and frequent polling usually hurt performance. Production optimization means cutting unnecessary work while preserving UX.
    difficulty: junior
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
    explanation: Code splitting reduces initial payload by loading code when needed. It does not remove need for caching, error handling, or budgets. In production, this is key for route-heavy apps and dashboards with many optional features.
    difficulty: mid
  - q: Which CSS strategy scales best for responsive applications with many components?
    options:
      - text: Component-driven styles with mobile-first media queries and shared variables or mixins
        correct: true
      - text: One breakpoint file with overrides for every component in source order
        correct: false
      - text: Desktop-first fixed-width layouts with pixel-only sizing
        correct: false
      - text: Inline media queries inside HTML attributes
        correct: false
    explanation: Component-scoped styles plus mobile-first queries and shared abstractions scale better than one giant override file. Fixed-width desktop-first approaches become brittle on diverse devices. In large codebases, modular responsiveness keeps ownership clear.
    difficulty: senior
  - q: Which set of tools is most appropriate for building responsive layouts?
    options:
      - text: CSS Grid or Flexbox with relative units and responsive media assets
        correct: true
      - text: Floats with fixed pixel widths and bitmap-only icons
        correct: false
      - text: Absolute positioning for every major section
        correct: false
      - text: Table-based layout with hidden overflow
        correct: false
    explanation: Modern responsive layout relies on Grid or Flexbox, fluid sizing, and scalable media. Floats, fixed widths, and table layouts are usually legacy compromises. In production, flexibility across screen sizes matters more than exact static positioning.
    difficulty: junior
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
    explanation: Centralized predictable state helps debugging, testing, and team coordination. It does not eliminate local state or guarantee performance by itself. In complex apps, clarity of data flow often matters more than theoretical architectural purity.
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
    explanation: Good modularization means clear boundaries, small surfaces, and low coupling. Implicit globals and leaking implementation details make code harder to change safely. In enterprise teams, module design directly affects onboarding and refactor cost.
    difficulty: mid
  - q: Which debugging workflow is strongest for complex front-end issues?
    options:
      - text: Use DevTools, breakpoints, targeted logging, and tests to isolate behavior step by step
        correct: true
      - text: Refresh repeatedly until bug reproduces less often
        correct: false
      - text: Rely on console.log only and skip network or DOM inspection
        correct: false
      - text: Disable linting because it can distract from runtime bugs
        correct: false
    explanation: Effective debugging combines runtime inspection, execution control, instrumentation, and reproducible tests. Guessing or using only logs misses many classes of bugs. In production, disciplined isolation beats intuition alone.
    difficulty: senior
  - q: What best describes progressive enhancement?
    options:
      - text: Build baseline functionality first, then layer advanced features for browsers that support them
        correct: true
      - text: Build only for newest browsers and ignore older environments entirely
        correct: false
      - text: Ship separate applications for each browser engine
        correct: false
      - text: Hide unsupported features with CSS while keeping same code path
        correct: false
    explanation: Progressive enhancement starts from reliable baseline access, then adds richer features where supported. It is different from ignoring weaker environments or maintaining separate apps. This is especially useful for forms, navigation, and core content delivery.
    difficulty: junior
  - q: How does graceful degradation differ from progressive enhancement?
    options:
      - text: Graceful degradation starts with full modern experience, then ensures older browsers still get usable fallback behavior
        correct: true
      - text: Graceful degradation means removing all JavaScript from application
        correct: false
      - text: Graceful degradation and progressive enhancement are identical implementation strategies
        correct: false
      - text: Graceful degradation applies only to CSS, not behavior
        correct: false
    explanation: Graceful degradation begins with modern capabilities and then preserves acceptable function when features are missing. Progressive enhancement starts from baseline and layers upward. Both aim for resilience, but they approach compatibility from opposite directions.
    difficulty: senior
---

# Frontend Questions

Conceptual frontend questions covering maintainable HTML/CSS, browser compatibility, JavaScript fundamentals, performance, responsive design, state management, modularity, debugging, and resilience strategies.
