---
defaultDomains:
- frontend
defaultTopics:
- angular
questions:
- q: What are advanced Angular state management patterns built around RxJS?
  options:
  - text: NgRx with selectors and effects, plus organized state slices and reactive services
    correct: true
  - text: Only local template variables, even for app-wide state
    correct: false
  - text: Direct mutation of services from every component without streams
    correct: false
  - text: Replacing observables entirely with DOM events
    correct: false
  explanation: Larger Angular apps often adopt structured reactive state with tools like NgRx, selectors, and effects, or
    carefully designed service-driven streams. The goal is predictable updates, testability, and scalability. Ad hoc global
    mutation does not scale well.
  difficulty: senior
- q: Why does `OnPush` change detection often improve Angular performance?
  options:
  - text: It reduces unnecessary checks by making update triggers more explicit
    correct: true
  - text: It disables RxJS subscriptions that cause extra renders
    correct: false
  - text: It forces all components to be stateless
    correct: false
  - text: It eliminates need for immutable thinking in inputs
    correct: false
  explanation: '`OnPush` improves performance when component inputs and reactive updates are managed predictably, because
    Angular does less automatic checking. It works best with clear immutable-ish update patterns and controlled event flows.
    Misuse can hide stale UI bugs.'
  difficulty: senior
- q: How should a senior Angular developer approach complex asynchronous workflows with RxJS?
  options:
  - text: Compose observables with higher-order operators like `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap` based
      on required behavior
    correct: true
  - text: Nest subscriptions until sequence becomes explicit
    correct: false
  - text: Convert all streams to callbacks so timing is easier to follow
    correct: false
  - text: Use one operator for every async problem to keep code uniform
    correct: false
  explanation: Higher-order mapping operators express different concurrency and cancellation semantics. Choosing correct one
    is core RxJS skill in Angular apps. Nested subscriptions usually make error handling and sequencing harder, not clearer.
  difficulty: senior
- q: What helps debug Angular observable streams and detect memory leaks?
  options:
  - text: Use `tap` for tracing, browser DevTools, tools like `rxjs-spy`, and verify subscription cleanup
    correct: true
  - text: Disable logging because streams should be debugged only from final UI output
    correct: false
  - text: Assume async pipe prevents all possible stream leaks in app
    correct: false
  - text: Use more Subjects so flows become easier to inspect
    correct: false
  explanation: Observable debugging usually needs both instrumentation and lifecycle verification. Logging stream events,
    profiling, and cleanup audits reveal leaks and unexpected emissions. There is no single magic tool; good visibility and
    discipline matter most.
  difficulty: senior
---
