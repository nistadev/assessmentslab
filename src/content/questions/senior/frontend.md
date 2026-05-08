---
defaultDomains:
- frontend
defaultTopics:
- frontend
questions:
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
  explanation: Feature detection checks capabilities, not browser brand, then lets code branch safely. It does not replace
    bundlers, polyfills, or CSS normalization tools. In production, capability-based decisions age better than user-agent
    assumptions.
  difficulty: senior
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
  explanation: Component-scoped styles plus mobile-first queries and shared abstractions scale better than one giant override
    file. Fixed-width desktop-first approaches become brittle on diverse devices. In large codebases, modular responsiveness
    keeps ownership clear.
  difficulty: senior
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
  explanation: Effective debugging combines runtime inspection, execution control, instrumentation, and reproducible tests.
    Guessing or using only logs misses many classes of bugs. In production, disciplined isolation beats intuition alone.
  difficulty: senior
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
  explanation: Graceful degradation begins with modern capabilities and then preserves acceptable function when features are
    missing. Progressive enhancement starts from baseline and layers upward. Both aim for resilience, but they approach compatibility
    from opposite directions.
  difficulty: senior
---
