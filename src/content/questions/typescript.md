---
defaultDomains:
  - frontend
  - backend
defaultTopics:
  - javascript-typescript
questions:
  - q: What do A and B evaluate to?
    code: |-
      type Flatten<T> = T extends Array<infer U> ? U : T;
      type A = Flatten<string[]>;
      type B = Flatten<number>;
    options:
      - text: A = string[], B = number
        correct: false
      - text: A = string, B = number
        correct: true
      - text: A = string, B = never
        correct: false
      - text: Compile error
        correct: false
    explanation: Conditional types with infer extract the inner type. Flatten<string[]> infers U = string and returns string. Flatten<number> does not match Array<infer U> so it returns T as-is (number). Used in tRPC to unwrap Promise<T> or Array<T> from API return types.
    difficulty: junior
  - q: What is the problem?
    code: |-
      type Config = { env: 'dev' | 'prod'; apiUrl: string; };
      const cfg = { env: 'dev', apiUrl: 'http://...' };
      function init(c: Config) {}
      init(cfg);
    options:
      - text: No problem
        correct: false
      - text: cfg.env is inferred as string not 'dev' | 'prod' -- type error on init(cfg)
        correct: true
      - text: apiUrl is missing from cfg
        correct: false
      - text: Config must be an interface not a type
        correct: false
    explanation: "TypeScript widens 'dev' to string when assigned without annotation. So cfg.env is string, not 'dev' | 'prod', causing a mismatch. Fix: const cfg = { env: 'dev' as const, apiUrl: '...' } or annotate as Config directly. Very common production bug when passing config objects to typed functions."
    difficulty: mid
  - q: What does 'satisfies' do differently than a type annotation?
    code: |-
      const palette = {
        red: [255, 0, 0],
        blue: '0000ff'
      } satisfies Record<string, string | number[]>;
    options:
      - text: Identical to annotating with Record<string, string | number[]>
        correct: false
      - text: Validates shape but preserves literal types -- palette.red stays number[], not string | number[]
        correct: true
      - text: Throws a runtime error if types mismatch
        correct: false
      - text: Makes all fields readonly
        correct: false
    explanation: satisfies validates without widening. With annotation palette.red becomes string | number[] and you lose array methods. With satisfies palette.red is still number[] and palette.blue is still string. Critical for config and theme objects where you want type safety AND precise autocomplete per field.
    difficulty: senior
  - q: Why is the first approach preferred?
    code: |-
      type Res =
        | { status: 'ok'; data: User }
        | { status: 'error'; error: string }
        | { status: 'loading' };
      // vs
      type Res2 = { data?: User; error?: string; loading?: boolean };
    options:
      - text: It is not -- Res2 is simpler and equivalent
        correct: false
      - text: Res is a discriminated union -- status narrows the type so data only exists when status === 'ok', preventing impossible states
        correct: true
      - text: Res2 causes more re-renders in React
        correct: false
      - text: Res2 is not valid TypeScript
        correct: false
    explanation: Res2 allows impossible states (data and error both set). Res is a discriminated union -- the status field narrows the type so TypeScript knows data only exists when status === 'ok'. Foundation of type-safe state machines in React. Eliminates null-check bugs at compile time.
    difficulty: principal
  - q: "What does Getters<{ name: string }> produce?"
    code: |-
      type Getters<T> = {
        [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
      };
    options:
      - text: "{ name: string }"
        correct: false
      - text: "{ getName: () => string }"
        correct: true
      - text: Compile error -- template literals cannot be used in mapped types
        correct: false
      - text: "{ getname: () => string }"
        correct: false
    explanation: Template literal types + the 'as' key remapping clause transform key names. Capitalize uppercases the first letter. Used in codegen tools, ORM query builders, and design systems that auto-generate accessor APIs from a base schema definition.
    difficulty: junior
  - q: What is the practical difference?
    code: |-
      function f<T>(x: T & { id: string }): T { return x; }
      // vs
      function g<T extends { id: string }>(x: T): T { return x; }
    options:
      - text: No difference -- both compile and behave identically
        correct: false
      - text: "f widens T to T & { id: string } losing the original shape in return type. g preserves the full shape of T via constraint"
        correct: true
      - text: g is less type-safe than f
        correct: false
      - text: f is slower at runtime
        correct: false
    explanation: "In f, the return type is T & { id: string } -- the intersection. In g, the return type is T, which already satisfies the constraint. If you pass { id: 'x', name: 'Bob' }, f returns T & { id: string }, g returns the exact type { id: string; name: string }. Matters in generic CRUD utilities where you return T not just a constraint intersection."
    difficulty: mid
  - q: Which line causes a TypeScript compile error?
    code: |-
      function parseResponse(raw: unknown) {
        console.log(raw.name); // line A
        if (typeof raw === 'object' && raw !== null && 'name' in raw) {
          console.log((raw as { name: string }).name); // line B
        }
      }
    options:
      - text: Neither -- unknown allows property access
        correct: false
      - text: Line A -- you cannot access properties on unknown without narrowing first
        correct: true
      - text: Line B -- the cast is invalid
        correct: false
      - text: Both lines
        correct: false
    explanation: unknown is the type-safe counterpart to any. You cannot access properties or call methods on unknown without first narrowing via typeof, instanceof, or a type guard. Line A compiles to a TypeScript error. Line B is correct -- the typeof + in check narrows the type before access. This is why JSON.parse should return unknown not any.
    difficulty: senior
  - q: What is Unpacked?
    code: |-
      const fn = async (): Promise<string> => "hello";
      type Unpacked = Awaited<ReturnType<typeof fn>>;
    options:
      - text: Promise<string>
        correct: false
      - text: string
        correct: true
      - text: () => Promise<string>
        correct: false
      - text: Compile error
        correct: false
    explanation: "ReturnType<typeof fn> extracts Promise<string>. Awaited<Promise<string>> unwraps the Promise to string. Awaited is the built-in utility that replaces manual infer-based unwrapping (T extends Promise<infer U> ? U : T). Common in utility types for async function return values in API layers."
    difficulty: principal
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
    explanation: Event delegation attaches a smaller number of listeners higher in DOM tree and handles events based on the target. This scales better for dynamic UIs and often reduces listener management complexity. It does not remove all propagation or cleanup concerns.
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
    explanation: Stopping propagation or default behavior too aggressively breaks composability and surprises other parts of app. Use them intentionally for actual behavior requirements. Large codebases benefit from predictable event flow, not defensive blanket cancellation.
    difficulty: mid
  - q: What are common challenges in asynchronous JavaScript code?
    options:
      - text: Callback nesting, error handling complexity, and race conditions
        correct: true
      - text: Lack of any built-in concurrency primitives whatsoever
        correct: false
      - text: Automatic deadlocks caused by `let` and `const`
        correct: false
      - text: Functions losing lexical scope by default
        correct: false
    explanation: Async JavaScript is often hard because control flow becomes indirect, failures can be missed, and operations may complete in unexpected order. Promises, async/await, and careful sequencing exist largely to manage these issues more clearly.
    difficulty: junior
  - q: Which tools most directly improve readability in complex asynchronous JavaScript?
    options:
      - text: Promises and async/await
        correct: true
      - text: Deeply nested anonymous callbacks
        correct: false
      - text: "`var` hoisting patterns"
        correct: false
      - text: Global mutable state for coordination
        correct: false
    explanation: Promises and async/await flatten async control flow, making sequencing and error handling much easier to follow. They do not solve all concurrency issues, but they are major readability improvement over nested callback chains.
    difficulty: junior
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
    explanation: Closures let functions retain access to surrounding variables without exposing them globally. That supports encapsulation and private state patterns. In mature codebases, this reduces naming conflicts and keeps implementation details hidden.
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
    explanation: Lingering listeners can keep references alive and contribute to memory leaks, especially in dynamic UIs. Cleanup is essential in vanilla JS and still matters inside frameworks. Browser tools can help detect retained listeners and nodes.
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
    explanation: Ordered workflows should encode that order directly through chained promises or sequential awaits. `Promise.all` is for parallel coordination, not dependency ordering. Timing hacks with delays are brittle and race-prone.
    difficulty: mid
  - q: What is key effect of hoisting on JavaScript scoping behavior?
    options:
      - text: Declarations are processed before execution, which can create surprising `undefined` access or shadowing issues
        correct: true
      - text: JavaScript moves runtime values to global scope automatically
        correct: false
      - text: Hoisting affects only functions, never variables
        correct: false
      - text: Hoisting removes differences between `var`, `let`, and `const`
        correct: false
    explanation: Hoisting changes when bindings become known within scope, and misunderstanding it leads to bugs around initialization, shadowing, and callback behavior. `var`, `let`, and `const` still behave differently because of function scope and temporal dead zone rules.
    difficulty: senior
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
    explanation: Callback hell is mainly readability and maintainability problem caused by deep nesting and mixed concerns. Breaking logic into composable units and using modern async abstractions makes control flow flatter and easier to debug.
    difficulty: mid
  - q: What is difference between throttling and debouncing high-frequency JavaScript events?
    domains:
      - frontend
    options:
      - text: Throttling limits handler to at most once per interval, while debouncing waits until activity stops
        correct: true
      - text: Debouncing runs continuously and throttling runs only once at end
        correct: false
      - text: They are identical terms for event delegation
        correct: false
      - text: Both are useful only for network requests, not UI events
        correct: false
    explanation: Throttling and debouncing both reduce event pressure, but they solve different timing problems. Throttle is useful for steady updates like scroll position; debounce is useful when only final settled input matters, such as search typing.
    difficulty: junior
  - q: What is advanced use of closures in asynchronous JavaScript workflows?
    options:
      - text: Preserving private state for memoization, deferred execution, or higher-order async utilities
        correct: true
      - text: Preventing promises from resolving until garbage collection runs
        correct: false
      - text: Making all asynchronous operations synchronous
        correct: false
      - text: Replacing modules as scope boundary mechanism entirely
        correct: false
    explanation: Closures are powerful in async workflows because they retain state across later execution points. That enables patterns like memoization, factories, deferred actions, and custom control-flow helpers. These patterns are common in sophisticated JS utilities.
    difficulty: senior
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
    explanation: Modern JS scope management depends heavily on module boundaries and block scoping. Using `let` and `const` intentionally keeps bindings local and predictable. Large apps become safer and easier to reason about when scope pollution is minimized.
    difficulty: mid
---

# JavaScript/TypeScript Questions

Questions covering advanced TypeScript plus core JavaScript concepts around async control flow, closures, events, scoping, and performance-oriented event handling.
