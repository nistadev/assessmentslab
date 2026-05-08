---
defaultDomains:
- frontend
defaultTopics:
- angular
questions:
- q: Why do many Angular teams prefer one-way data flow for complex application state?
  options:
  - text: It is easier to reason about, debug, and maintain than broad implicit two-way synchronization
    correct: true
  - text: Angular does not support two-way binding in large apps
    correct: false
  - text: One-way flow eliminates need for change detection
    correct: false
  - text: Two-way binding is always slower than any one-way approach
    correct: false
  explanation: One-way flow makes updates explicit and reduces surprising state coupling. That is especially valuable as application
    complexity grows. Two-way binding still has uses, but broad implicit mutation paths can become difficult to trace.
  difficulty: mid
- q: Which Angular practice often helps avoid subscription leaks in templates?
  options:
  - text: Use the `async` pipe when practical
    correct: true
  - text: Convert all observables to promises immediately
    correct: false
  - text: Manually subscribe in every template expression
    correct: false
  - text: Trigger change detection after each emission
    correct: false
  explanation: The `async` pipe manages subscription lifecycle automatically and keeps templates declarative. It is often
    safer than manual subscribe/unsubscribe in components for straightforward view binding. Manual subscriptions are still
    useful, but they require discipline.
  difficulty: mid
- q: What is main benefit of `takeUntil` in Angular components?
  options:
  - text: It provides a clear pattern for completing subscriptions when component is destroyed
    correct: true
  - text: It converts cold observables into hot observables
    correct: false
  - text: It replaces all need for error handling
    correct: false
  - text: It guarantees no duplicate emissions from source stream
    correct: false
  explanation: '`takeUntil` is commonly used with a destroy signal to stop active subscriptions when component lifecycle ends.
    It is lifecycle management tool, not a general-purpose fix for stream semantics. Used well, it prevents leaks and unexpected
    side effects.'
  difficulty: mid
- q: How should deeply nested Angular components usually share data without excessive input/output chaining?
  options:
  - text: Use shared services with observables or centralized state when coupling becomes too deep
    correct: true
  - text: Pass every value through each intermediate component forever
    correct: false
  - text: Store all UI state on `window` for universal access
    correct: false
  - text: Emit DOM custom events from every child to root
    correct: false
  explanation: Long input/output chains create friction and brittle wiring. Shared reactive services or centralized state
    often give cleaner communication paths for non-local relationships. Choice should follow ownership and app complexity.
  difficulty: mid
- q: What is important consideration when designing reusable Angular services?
  options:
  - text: Keep services stateless unless shared state is intentional, and provide them at correct scope
    correct: true
  - text: Store all transient component UI state in root singleton services by default
    correct: false
  - text: Avoid interfaces because abstraction makes testing harder
    correct: false
  - text: Create new service instances manually inside components
    correct: false
  explanation: Reusable services should have clear scope, explicit responsibilities, and intentional statefulness. Root-scoped
    singleton state is powerful but should be chosen deliberately. Angular DI makes lifetime management important architectural
    decision.
  difficulty: mid
- q: Which RxJS operators are especially useful for optimizing high-frequency input in Angular?
  options:
  - text: '`debounceTime`, `throttleTime`, and `distinctUntilChanged`'
    correct: true
  - text: '`tap`, `shareReplay`, and `finalize` only'
    correct: false
  - text: '`map` alone, because timing control is unrelated to performance'
    correct: false
  - text: No operators, because change detection handles frequency automatically
    correct: false
  explanation: These operators reduce unnecessary work from repeated rapid events such as typing, scrolling, or resize. They
    are common performance tools in Angular reactive UIs. Proper operator choice depends on exact interaction semantics.
  difficulty: mid
- q: What is good approach for combining multiple asynchronous requests in Angular with RxJS?
  options:
  - text: Use combinators such as `forkJoin` or `combineLatest` depending on whether you need final results or ongoing combined
      streams
    correct: true
  - text: Call each request separately and merge results through global mutable variables
    correct: false
  - text: Use `setTimeout` to wait for each request to probably finish
    correct: false
  - text: Avoid composition because independent subscriptions are always easier to debug
    correct: false
  explanation: RxJS combinators express parallel coordination clearly. `forkJoin` fits one-time completion, while `combineLatest`
    fits ongoing reactive combinations. Correct operator choice makes asynchronous code cleaner and less fragile.
  difficulty: mid
---
