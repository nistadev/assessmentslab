---
defaultDomains:
- frontend
defaultTopics:
- angular
questions:
- q: When is Angular two-way data binding with `ngModel` usually most appropriate?
  options:
  - text: For simple form inputs and straightforward user-driven state updates
    correct: true
  - text: For every data flow in large application regardless of complexity
    correct: false
  - text: Only for server responses, never for forms
    correct: false
  - text: Only inside services because components should stay stateless
    correct: false
  explanation: Two-way binding is convenient for simple form interactions, but using it everywhere in large applications can
    make state flow harder to reason about. Senior Angular codebases usually prefer clearer one-way data flow for more complex
    interactions.
  difficulty: junior
- q: How does dependency injection improve Angular testability?
  options:
  - text: Dependencies can be replaced with mocks or fakes instead of being hard-coded inside classes
    correct: true
  - text: It removes need for unit tests because services are centrally managed
    correct: false
  - text: It guarantees every injected dependency is singleton
    correct: false
  - text: It prevents runtime configuration differences between modules
    correct: false
  explanation: 'Dependency injection makes components and services easier to isolate in tests because collaborators can be
    swapped with test doubles. That is much harder when dependencies are created directly inside class logic. DI improves
    maintainability for same reason: looser coupling.'
  difficulty: junior
- q: What is common RxJS pitfall in Angular components?
  options:
  - text: Leaving subscriptions active after component destruction and causing memory leaks
    correct: true
  - text: Using observables instead of promises for HTTP calls
    correct: false
  - text: Applying any operator at all to user input streams
    correct: false
  - text: Sharing data through services rather than deep input chains
    correct: false
  explanation: Unsubscribed streams can keep work and references alive after components are gone. This is one of most common
    Angular RxJS mistakes. Cleanup patterns and template async handling exist largely to avoid this.
  difficulty: junior
- q: What naming convention enables custom two-way binding syntax like `[(value)]` in Angular?
  options:
  - text: Use matching `value` input and `valueChange` output
    correct: true
  - text: Use any output name as long as it emits synchronously
    correct: false
  - text: Use `onValueChanged` because Angular maps it automatically
    correct: false
  - text: Use service injection instead of output events
    correct: false
  explanation: Angular expects property plus propertyChange naming convention for banana-in-a-box syntax. Without that pair,
    custom two-way binding will not wire correctly. This is standard framework contract, not just style preference.
  difficulty: junior
---
