---
defaultDomains:
- frontend
- backend
defaultTopics:
- javascript-typescript
questions:
- q: What is the problem?
  code: 'type Config = { env: ''dev'' | ''prod''; apiUrl: string; };

    const cfg = { env: ''dev'', apiUrl: ''http://...'' };

    function init(c: Config) {}

    init(cfg);'
  options:
  - text: No problem
    correct: false
  - text: cfg.env is inferred as string not 'dev' | 'prod'
    correct: true
  - text: apiUrl is missing from cfg
    correct: false
  - text: Config must be an interface not a type
    correct: false
  explanation: 'TypeScript widens ''dev'' to string when assigned without annotation. So cfg.env is string, not ''dev'' |
    ''prod'', causing a mismatch. Fix: const cfg = { env: ''dev'' as const, apiUrl: ''...'' } or annotate as Config directly.
    Very common production bug when passing config objects to typed functions.'
  difficulty: mid
- q: What is the practical difference?
  code: 'function f<T>(x: T & { id: string }): T { return x; }

    // vs

    function g<T extends { id: string }>(x: T): T { return x; }'
  options:
  - text: No difference
    correct: false
  - text: 'f widens T to T & { id: string } losing the original shape in return type. g preserves the full shape of T via
      constraint'
    correct: true
  - text: g is less type-safe than f
    correct: false
  - text: f is slower at runtime
    correct: false
  explanation: 'In f, the return type is T & { id: string } -- the intersection. In g, the return type is T, which already
    satisfies the constraint. If you pass { id: ''x'', name: ''Bob'' }, f returns T & { id: string }, g returns the exact
    type { id: string; name: string }. Matters in generic CRUD utilities where you return T not just a constraint intersection.'
  difficulty: mid
- q: Why is event delegation often preferred in large JavaScript applications?
  domains:
  - frontend
  options:
  - text: It reduces many direct DOM bindings and works well for dynamically added elements
    correct: true
  - text: It guarantees every event skips bubbling automatically
    correct: false
  - text: It makes memory leaks impossible
    correct: false
  - text: It is useful only for keyboard events
    correct: false
  explanation: Event delegation attaches a smaller number of listeners higher in DOM tree and handles events based on the
    target. This scales better for dynamic UIs and often reduces listener management complexity. It does not remove all propagation
    or cleanup concerns.
  difficulty: mid
- q: When should `stopPropagation` or `preventDefault` be used in JavaScript event handling?
  domains:
  - frontend
  options:
  - text: Only when specific behavior must be prevented, not as blanket default
    correct: true
  - text: On every event handler so parent components stay isolated
    correct: false
  - text: Only in TypeScript projects because plain JavaScript cannot control propagation
    correct: false
  - text: Never, because browser defaults are always correct
    correct: false
  explanation: Stopping propagation or default behavior too aggressively breaks composability and surprises other parts of
    app. Use them intentionally for actual behavior requirements. Large codebases benefit from predictable event flow, not
    defensive blanket cancellation.
  difficulty: mid
- q: How do closures improve modularity in JavaScript codebases?
  options:
  - text: They preserve lexical scope, enabling private state and encapsulated helper logic
    correct: true
  - text: They expose all local variables globally for reuse
    correct: false
  - text: They eliminate need for modules or imports
    correct: false
  - text: They prevent asynchronous code from sharing data
    correct: false
  explanation: Closures let functions retain access to surrounding variables without exposing them globally. That supports
    encapsulation and private state patterns. In mature codebases, this reduces naming conflicts and keeps implementation
    details hidden.
  difficulty: mid
- q: What is important practice when attaching DOM event listeners to elements that may later be removed?
  domains:
  - frontend
  options:
  - text: Detach listeners during cleanup so removed nodes are not kept alive unnecessarily
    correct: true
  - text: Rely on browser to always clean every listener immediately with no exceptions
    correct: false
  - text: Reattach listeners on every render whether needed or not
    correct: false
  - text: Store listeners in global array for easier reuse
    correct: false
  explanation: Lingering listeners can keep references alive and contribute to memory leaks, especially in dynamic UIs. Cleanup
    is essential in vanilla JS and still matters inside frameworks. Browser tools can help detect retained listeners and nodes.
  difficulty: mid
- q: Which approach is best when asynchronous tasks must run in a strict order?
  options:
  - text: Use promise chaining or async/await to express sequencing explicitly
    correct: true
  - text: Trigger all tasks with `Promise.all` and assume execution order matches array order
    correct: false
  - text: Rely on `setTimeout` delays to force stable ordering
    correct: false
  - text: Use event delegation because it serializes all async work
    correct: false
  explanation: Ordered workflows should encode that order directly through chained promises or sequential awaits. `Promise.all`
    is for parallel coordination, not dependency ordering. Timing hacks with delays are brittle and race-prone.
  difficulty: mid
- q: Which strategy helps prevent callback hell in complex asynchronous JavaScript?
  options:
  - text: Refactor nested callbacks into named units and move to promises or async/await where practical
    correct: true
  - text: Keep all callbacks inline so execution order stays visually compact
    correct: false
  - text: Use one enormous try/catch around entire application
    correct: false
  - text: Prefer more shared mutable state so callbacks can coordinate implicitly
    correct: false
  explanation: Callback hell is mainly readability and maintainability problem caused by deep nesting and mixed concerns.
    Breaking logic into composable units and using modern async abstractions makes control flow flatter and easier to debug.
  difficulty: mid
- q: What most influences scope management in modern JavaScript applications?
  options:
  - text: Module isolation, correct use of block scope with `let` and `const`, and avoiding unnecessary lexical pollution
    correct: true
  - text: Using `var` everywhere so all scopes behave consistently
    correct: false
  - text: Keeping as many values as possible on `window` for discoverability
    correct: false
  - text: Avoiding bundlers because they interfere with closure semantics
    correct: false
  explanation: Modern JS scope management depends heavily on module boundaries and block scoping. Using `let` and `const`
    intentionally keeps bindings local and predictable. Large apps become safer and easier to reason about when scope pollution
    is minimized.
  difficulty: mid
---
