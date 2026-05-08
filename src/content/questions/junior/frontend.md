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
  explanation: Semantic HTML plus consistent naming and modular CSS make code easier to reason about, reuse, and refactor.
    Deep selector chains and giant global files increase coupling, while inline styles hurt reuse and reviewability. In production,
    teams need predictable structure more than short-term speed.
  difficulty: junior
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
  explanation: Cross-browser compatibility comes from standards-first implementation plus verification and selective fallbacks.
    Prefixes alone are insufficient, and avoiding all modern features is unnecessary. Real teams balance progress with support
    matrix requirements.
  difficulty: junior
- q: Which JavaScript concept is most closely tied to understanding why asynchronous callbacks can still access outer variables
    later?
  options:
  - text: Closures
    correct: true
  - text: Prototype chains
    correct: false
  - text: Tree shaking
    correct: false
  - text: CSSOM parsing
    correct: false
  explanation: Closures allow functions to retain access to lexical scope after outer function execution completes. Prototype
    chains deal with inheritance, not async variable access. This matters constantly in event handlers, timers, and data-fetch
    callbacks.
  difficulty: junior
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
  explanation: Minification and deferring non-critical JS reduce transfer and main-thread cost. Higher-resolution assets everywhere,
    single giant bundles, and frequent polling usually hurt performance. Production optimization means cutting unnecessary
    work while preserving UX.
  difficulty: junior
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
  explanation: Modern responsive layout relies on Grid or Flexbox, fluid sizing, and scalable media. Floats, fixed widths,
    and table layouts are usually legacy compromises. In production, flexibility across screen sizes matters more than exact
    static positioning.
  difficulty: junior
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
  explanation: Progressive enhancement starts from reliable baseline access, then adds richer features where supported. It
    is different from ignoring weaker environments or maintaining separate apps. This is especially useful for forms, navigation,
    and core content delivery.
  difficulty: junior
---
