---
category: "Angular"
questions:
  - q: "When is Angular two-way data binding with `ngModel` usually most appropriate?"
    options:
      - text: "For simple form inputs and straightforward user-driven state updates"
        correct: true
      - text: "For every data flow in large application regardless of complexity"
        correct: false
      - text: "Only for server responses, never for forms"
        correct: false
      - text: "Only inside services because components should stay stateless"
        correct: false
    explanation: "Two-way binding is convenient for simple form interactions, but using it everywhere in large applications can make state flow harder to reason about. Senior Angular codebases usually prefer clearer one-way data flow for more complex interactions."
    difficulty: "junior"
    isCode: false

  - q: "Why do many Angular teams prefer one-way data flow for complex application state?"
    options:
      - text: "It is easier to reason about, debug, and maintain than broad implicit two-way synchronization"
        correct: true
      - text: "Angular does not support two-way binding in large apps"
        correct: false
      - text: "One-way flow eliminates need for change detection"
        correct: false
      - text: "Two-way binding is always slower than any one-way approach"
        correct: false
    explanation: "One-way flow makes updates explicit and reduces surprising state coupling. That is especially valuable as application complexity grows. Two-way binding still has uses, but broad implicit mutation paths can become difficult to trace."
    difficulty: "mid"
    isCode: false

  - q: "How does dependency injection improve Angular testability?"
    options:
      - text: "Dependencies can be replaced with mocks or fakes instead of being hard-coded inside classes"
        correct: true
      - text: "It removes need for unit tests because services are centrally managed"
        correct: false
      - text: "It guarantees every injected dependency is singleton"
        correct: false
      - text: "It prevents runtime configuration differences between modules"
        correct: false
    explanation: "Dependency injection makes components and services easier to isolate in tests because collaborators can be swapped with test doubles. That is much harder when dependencies are created directly inside class logic. DI improves maintainability for same reason: looser coupling."
    difficulty: "junior"
    isCode: false

  - q: "What is common RxJS pitfall in Angular components?"
    options:
      - text: "Leaving subscriptions active after component destruction and causing memory leaks"
        correct: true
      - text: "Using observables instead of promises for HTTP calls"
        correct: false
      - text: "Applying any operator at all to user input streams"
        correct: false
      - text: "Sharing data through services rather than deep input chains"
        correct: false
    explanation: "Unsubscribed streams can keep work and references alive after components are gone. This is one of most common Angular RxJS mistakes. Cleanup patterns and template async handling exist largely to avoid this."
    difficulty: "junior"
    isCode: false

  - q: "Which Angular practice often helps avoid subscription leaks in templates?"
    options:
      - text: "Use the `async` pipe when practical"
        correct: true
      - text: "Convert all observables to promises immediately"
        correct: false
      - text: "Manually subscribe in every template expression"
        correct: false
      - text: "Trigger change detection after each emission"
        correct: false
    explanation: "The `async` pipe manages subscription lifecycle automatically and keeps templates declarative. It is often safer than manual subscribe/unsubscribe in components for straightforward view binding. Manual subscriptions are still useful, but they require discipline."
    difficulty: "mid"
    isCode: false

  - q: "What is main benefit of `takeUntil` in Angular components?"
    options:
      - text: "It provides a clear pattern for completing subscriptions when component is destroyed"
        correct: true
      - text: "It converts cold observables into hot observables"
        correct: false
      - text: "It replaces all need for error handling"
        correct: false
      - text: "It guarantees no duplicate emissions from source stream"
        correct: false
    explanation: "`takeUntil` is commonly used with a destroy signal to stop active subscriptions when component lifecycle ends. It is lifecycle management tool, not a general-purpose fix for stream semantics. Used well, it prevents leaks and unexpected side effects."
    difficulty: "mid"
    isCode: false

  - q: "What are advanced Angular state management patterns built around RxJS?"
    options:
      - text: "NgRx with selectors and effects, plus organized state slices and reactive services"
        correct: true
      - text: "Only local template variables, even for app-wide state"
        correct: false
      - text: "Direct mutation of services from every component without streams"
        correct: false
      - text: "Replacing observables entirely with DOM events"
        correct: false
    explanation: "Larger Angular apps often adopt structured reactive state with tools like NgRx, selectors, and effects, or carefully designed service-driven streams. The goal is predictable updates, testability, and scalability. Ad hoc global mutation does not scale well."
    difficulty: "senior"
    isCode: false

  - q: "How should deeply nested Angular components usually share data without excessive input/output chaining?"
    options:
      - text: "Use shared services with observables or centralized state when coupling becomes too deep"
        correct: true
      - text: "Pass every value through each intermediate component forever"
        correct: false
      - text: "Store all UI state on `window` for universal access"
        correct: false
      - text: "Emit DOM custom events from every child to root"
        correct: false
    explanation: "Long input/output chains create friction and brittle wiring. Shared reactive services or centralized state often give cleaner communication paths for non-local relationships. Choice should follow ownership and app complexity."
    difficulty: "mid"
    isCode: false

  - q: "What naming convention enables custom two-way binding syntax like `[(value)]` in Angular?"
    options:
      - text: "Use matching `value` input and `valueChange` output"
        correct: true
      - text: "Use any output name as long as it emits synchronously"
        correct: false
      - text: "Use `onValueChanged` because Angular maps it automatically"
        correct: false
      - text: "Use service injection instead of output events"
        correct: false
    explanation: "Angular expects property plus propertyChange naming convention for banana-in-a-box syntax. Without that pair, custom two-way binding will not wire correctly. This is standard framework contract, not just style preference."
    difficulty: "junior"
    isCode: false

  - q: "What is important consideration when designing reusable Angular services?"
    options:
      - text: "Keep services stateless unless shared state is intentional, and provide them at correct scope"
        correct: true
      - text: "Store all transient component UI state in root singleton services by default"
        correct: false
      - text: "Avoid interfaces because abstraction makes testing harder"
        correct: false
      - text: "Create new service instances manually inside components"
        correct: false
    explanation: "Reusable services should have clear scope, explicit responsibilities, and intentional statefulness. Root-scoped singleton state is powerful but should be chosen deliberately. Angular DI makes lifetime management important architectural decision."
    difficulty: "mid"
    isCode: false

  - q: "Which RxJS operators are especially useful for optimizing high-frequency input in Angular?"
    options:
      - text: "`debounceTime`, `throttleTime`, and `distinctUntilChanged`"
        correct: true
      - text: "`tap`, `shareReplay`, and `finalize` only"
        correct: false
      - text: "`map` alone, because timing control is unrelated to performance"
        correct: false
      - text: "No operators, because change detection handles frequency automatically"
        correct: false
    explanation: "These operators reduce unnecessary work from repeated rapid events such as typing, scrolling, or resize. They are common performance tools in Angular reactive UIs. Proper operator choice depends on exact interaction semantics."
    difficulty: "mid"
    isCode: false

  - q: "Why does `OnPush` change detection often improve Angular performance?"
    options:
      - text: "It reduces unnecessary checks by making update triggers more explicit"
        correct: true
      - text: "It disables RxJS subscriptions that cause extra renders"
        correct: false
      - text: "It forces all components to be stateless"
        correct: false
      - text: "It eliminates need for immutable thinking in inputs"
        correct: false
    explanation: "`OnPush` improves performance when component inputs and reactive updates are managed predictably, because Angular does less automatic checking. It works best with clear immutable-ish update patterns and controlled event flows. Misuse can hide stale UI bugs."
    difficulty: "senior"
    isCode: false

  - q: "How should a senior Angular developer approach complex asynchronous workflows with RxJS?"
    options:
      - text: "Compose observables with higher-order operators like `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap` based on required behavior"
        correct: true
      - text: "Nest subscriptions until sequence becomes explicit"
        correct: false
      - text: "Convert all streams to callbacks so timing is easier to follow"
        correct: false
      - text: "Use one operator for every async problem to keep code uniform"
        correct: false
    explanation: "Higher-order mapping operators express different concurrency and cancellation semantics. Choosing correct one is core RxJS skill in Angular apps. Nested subscriptions usually make error handling and sequencing harder, not clearer."
    difficulty: "senior"
    isCode: false

  - q: "What is good approach for combining multiple asynchronous requests in Angular with RxJS?"
    options:
      - text: "Use combinators such as `forkJoin` or `combineLatest` depending on whether you need final results or ongoing combined streams"
        correct: true
      - text: "Call each request separately and merge results through global mutable variables"
        correct: false
      - text: "Use `setTimeout` to wait for each request to probably finish"
        correct: false
      - text: "Avoid composition because independent subscriptions are always easier to debug"
        correct: false
    explanation: "RxJS combinators express parallel coordination clearly. `forkJoin` fits one-time completion, while `combineLatest` fits ongoing reactive combinations. Correct operator choice makes asynchronous code cleaner and less fragile."
    difficulty: "mid"
    isCode: false

  - q: "What helps debug Angular observable streams and detect memory leaks?"
    options:
      - text: "Use `tap` for tracing, browser DevTools, tools like `rxjs-spy`, and verify subscription cleanup"
        correct: true
      - text: "Disable logging because streams should be debugged only from final UI output"
        correct: false
      - text: "Assume async pipe prevents all possible stream leaks in app"
        correct: false
      - text: "Use more Subjects so flows become easier to inspect"
        correct: false
    explanation: "Observable debugging usually needs both instrumentation and lifecycle verification. Logging stream events, profiling, and cleanup audits reveal leaks and unexpected emissions. There is no single magic tool; good visibility and discipline matter most."
    difficulty: "senior"
    isCode: false
---

# Angular Questions

Conceptual Angular questions covering two-way binding, dependency injection, RxJS pitfalls, state management, component communication, service design, performance, and observable debugging.
