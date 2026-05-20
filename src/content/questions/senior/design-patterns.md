---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: What pattern is being used, and what must stay true for this wrapper to be healthy?
  code: |
    def retry(max_attempts: int):
        def decorate(func):
            def wrapper(*args, **kwargs):
                for attempt in range(max_attempts):
                    try:
                        return func(*args, **kwargs)
                    except TimeoutError:
                        if attempt == max_attempts - 1:
                            raise
            return wrapper
        return decorate

    @retry(3)
    def call_payment_api(order_id: str):
        return gateway.capture(order_id)
  options:
  - text: Decorator, as long as it preserves the payment call contract and only adds retry behavior around it
    correct: true
  - text: Proxy, because any wrapper in front of a remote service should own payment authorization
    correct: false
  - text: Strategy, because changing max_attempts means the whole payment algorithm is interchangeable
    correct: false
  - text: Template Method, because the retry loop fixes every step of the checkout workflow
    correct: false
  explanation: |
    Decorator is the right fit because retry is added around a stable operation without changing the operation's meaning. Proxy is tempting for remote access, but the wrapper is not deciding whether the real subject may be reached. Strategy would swap an algorithm, and Template Method would define a fixed workflow skeleton with overridable steps.
  difficulty: senior
- q: What is printed, and which contract does the design rely on?
  code: |
    class TextEditor:
        def __init__(self):
            self.content = ""
            self._history = []

        def execute(self, command):
            command.do(self)
            self._history.append(command)

        def undo(self):
            self._history.pop().undo(self)

    class Insert:
        def __init__(self, text):
            self.text = text

        def do(self, editor):
            editor.content += self.text

        def undo(self, editor):
            editor.content = editor.content[:-len(self.text)]

    editor = TextEditor()
    editor.execute(Insert("Hello"))
    editor.execute(Insert(" World"))
    editor.undo()
    print(editor.content)
  options:
  - text: '"Hello", because each command knows how to reverse its own action'
    correct: true
  - text: '"", because undo should restore the editor to the initial snapshot'
    correct: false
  - text: '"Hello World", because commands are only audit records and cannot mutate state'
    correct: false
  - text: '" World", because undo removes the first command in the history'
    correct: false
  explanation: |
    It prints "Hello". This is Command: the editor stores action objects and calls the inverse of the last action. A snapshot-based undo could involve Memento, but this code relies on each command carrying its own undo behavior.
  difficulty: senior
- q: A team asks what should drive pattern choice during a refactor. Which senior-level answer is strongest?
  options:
  - text: Expected change axis, ownership boundaries, contracts, tests, and what must stay stable
    correct: true
  - text: The pattern category that creates the smallest number of classes
    correct: false
  - text: The pattern name most reviewers already recognize in the codebase
    correct: false
  - text: The framework convention, even when it hides the actual ownership boundary
    correct: false
  explanation: |
    Senior design starts from forces: what changes, who owns it, and what callers can rely on. Class count, familiar names, and framework convention can inform the implementation, but they do not justify a pattern when they do not match the change pressure.
  difficulty: senior
- q: A payment boundary uses a provider selector, a provider-facing translator, and a retry wrapper. What makes this composition defensible?
  options:
  - text: "Each layer owns a different pressure: selection, translation, or cross-cutting reliability"
    correct: true
  - text: All payment policy can now live in the outer wrapper because callers see one object
    correct: false
  - text: Three named patterns reduce the need to document failure behavior
    correct: false
  - text: The selector can double as the adapter if both use the same provider key
    correct: false
  explanation: |
    Pattern composition is healthy when each layer has one clear job. The selector chooses a provider, the adapter translates the provider contract, and the decorator adds retry or metrics. Mixing policy, selection, translation, and reliability into one wrapper makes the boundary harder to reason about.
  difficulty: senior
- q: Why add contract tests before many callers depend on a strategy, adapter, handler, or subscriber extension point?
  options:
  - text: To pin down inputs, outputs, side effects, failure behavior, ordering, and compatibility
    correct: true
  - text: To prove every implementation uses the same inheritance hierarchy
    correct: false
  - text: To let implementations ignore documentation as long as tests pass locally
    correct: false
  - text: To freeze the extension point so future variants cannot require migration
    correct: false
  explanation: |
    Extension points are contracts, not just class names. Contract tests make the shared behavior explicit, including errors and side effects. Inheritance is optional, tests do not replace documentation, and future migration still needs versioning or compatibility planning.
  difficulty: senior
- q: A queued payment command may be delivered twice after a timeout. What design concern matters most?
  options:
  - text: Idempotency and duplicate-safe failure semantics
    correct: true
  - text: Whether execute returns None or a response object
    correct: false
  - text: Whether the command inherits from a base command class
    correct: false
  - text: Whether the queue worker is implemented with a factory
    correct: false
  explanation: |
    Async command design must define what happens under retry and duplicate delivery. Return type and inheritance may matter locally, but they do not prevent double charging. The queue worker's construction pattern is separate from the command's delivery semantics.
  difficulty: senior
- q: When is introducing a pattern probably ceremony instead of design?
  options:
  - text: When it does not localize expected change, clarify ownership, or improve the contract
    correct: true
  - text: When there is only one current implementation, even if multiple teams own future variants
    correct: false
  - text: When the abstraction needs tests because callers will depend on it
    correct: false
  - text: When the pattern is implemented with functions instead of classes
    correct: false
  explanation: |
    A pattern earns its keep by managing real change pressure. One implementation can still justify an abstraction if future variants and ownership boundaries are real. Tests are a sign the contract matters, not a smell by themselves. Functions can implement patterns cleanly in Python.
  difficulty: senior
- q: A branch-heavy exporter is being refactored toward strategies. What is the safest senior-level starting move?
  options:
  - text: Add tests around current behavior, extract one stable callable contract, and move one variant at a time
    correct: true
  - text: Replace all branches with subclasses in one change so the final shape is visible
    correct: false
  - text: Rename each branch to a pattern name first, then test after the structure stabilizes
    correct: false
  - text: Move exporter selection into every caller so the central function gets smaller
    correct: false
  explanation: |
    Senior refactoring keeps public behavior stable while moving structure in small steps. A single large rewrite mixes behavior risk with design change. Renaming first does not prove behavior, and pushing selection into callers spreads the change pressure.
  difficulty: senior
- q: A provider adapter starts translating fields, retrying requests, checking risk, changing prices, and emitting analytics. What is the senior-level smell?
  options:
  - text: One wrapper now owns too many different jobs and change reasons
    correct: true
  - text: It has become a complete facade, so the extra responsibilities are expected
    correct: false
  - text: It should be converted to a singleton because the wrapper is important
    correct: false
  - text: It proves the adapter contract is broad enough for all payment behavior
    correct: false
  explanation: |
    The wrapper is mixing boundary translation, reliability, business policy, and side effects. A facade can simplify a subsystem, but it should not become a grab bag for unrelated change pressures. Singleton does not fix responsibility boundaries.
  difficulty: senior
- q: A new notification subscriber fails under production traffic. What should have been designed around the extension point?
  options:
  - text: Per-subscriber metrics, tracing, timeouts, retry limits, feature flags, and kill switches
    correct: true
  - text: A larger event object so each subscriber can infer every possible workflow state
    correct: false
  - text: A rule that subscribers must never fail, enforced only by code review
    correct: false
  - text: A mediator that makes the event bus synchronously call every subscriber in order
    correct: false
  explanation: |
    Production extension points need observability and rollback controls. A larger payload can make coupling worse. Code review cannot handle runtime failure alone, and making all subscribers synchronous can increase blast radius unless the workflow truly requires it.
  difficulty: senior
- q: A remote inventory proxy preserves the local available(sku) method but calls another service. What senior concern must be explicit?
  options:
  - text: Timeout, retry, error, and stale-data behavior at the boundary
    correct: true
  - text: The proxy should hide all remote failures so callers always think inventory is local
    correct: false
  - text: The proxy should also decide pricing because it already calls inventory
    correct: false
  - text: The proxy no longer needs a contract because the method name stayed the same
    correct: false
  explanation: |
    A remote proxy keeps the surface familiar but adds distributed failure modes. The contract must say how latency, errors, retries, and stale data behave. Hiding all failure or adding pricing policy makes the abstraction dishonest.
  difficulty: senior
- q: A strategy contract says discount rules return a total and must not mutate the order. What should the shared tests prove?
  options:
  - text: Each implementation returns valid money and leaves the input order unchanged
    correct: true
  - text: Each implementation uses the same private helper names
    correct: false
  - text: Each implementation has the same number of methods
    correct: false
  - text: Each implementation reaches the database in the same way
    correct: false
  explanation: |
    Contract tests should protect externally meaningful behavior: inputs, outputs, side effects, and failure cases. Private helper names and method counts are implementation details. Database access may be forbidden or allowed by the contract, but it is not implied by Strategy itself.
  difficulty: senior
- q: What should a senior review comment explain instead of only naming a pattern?
  options:
  - text: The force behind the pattern, the tradeoff it accepts, and the contract callers can rely on
    correct: true
  - text: The GoF category and a class diagram, even if the change pressure is obvious
    correct: false
  - text: The shortest possible pattern label so the team can infer the rest
    correct: false
  - text: The number of variants the design might have someday, without naming owners or stability needs
    correct: false
  explanation: |
    Naming the pattern is shorthand, not justification. A useful senior review names the force, explains why the abstraction is worth its cost, and states what remains stable. Future variant count matters only when tied to ownership and real change.
  difficulty: senior
- q: Why is an adapter contract different from a facade contract at senior level?
  options:
  - text: Adapter protects callers from a foreign interface; Facade protects callers from subsystem complexity
    correct: true
  - text: Adapter owns retries and timeouts; Facade owns authorization and pricing
    correct: false
  - text: Adapter is for local code only; Facade is for remote services only
    correct: false
  - text: Adapter and Facade are equivalent once callers see one method
    correct: false
  explanation: |
    The contract differs because the job differs. Adapter translation focuses on names, shapes, units, errors, and vendor details. Facade simplification focuses on hiding a workflow or subsystem. Retries, authorization, and pricing are separate design concerns unless explicitly assigned.
  difficulty: senior
- q: When does a command need more than a simple execute method?
  options:
  - text: When it may be queued, retried, audited, authorized, compensated, or undone
    correct: true
  - text: When it has more than one constructor argument
    correct: false
  - text: When execute returns a value that the caller reads
    correct: false
  - text: When the command object is created by a factory
    correct: false
  explanation: |
    Command becomes valuable when actions have lifecycle concerns. Queueing, retries, auditing, authorization, compensation, and undo all need explicit contract decisions. Constructor shape, return value, and factory creation can matter, but they are not the reason to expand the command contract.
  difficulty: senior
- q: A chain of request handlers runs auth, rate limiting, validation, and controller dispatch. What contract should each handler respect?
  options:
  - text: Return a response or call the next handler exactly once, with defined failure and timeout behavior
    correct: true
  - text: Always call every remaining handler so each one can record metrics
    correct: false
  - text: Mutate the request freely because later handlers can correct it
    correct: false
  - text: Catch every exception and continue to the controller by default
    correct: false
  explanation: |
    Chain of Responsibility needs a clear handler contract. A handler either handles the request or passes it forward in a controlled way. Always continuing, free mutation, or swallowing failures can break security and make behavior unpredictable.
  difficulty: senior
- q: A regulated import pipeline requires authorize, parse, validate, persist, and audit to happen in that exact order, while file-specific parsing varies. Which pattern choice is most defensible?
  options:
  - text: Template Method if the base workflow owns the invariant order and parsing is a controlled hook
    correct: true
  - text: Strategy for every step so each file type can reorder the workflow freely
    correct: false
  - text: Observer so validation and persistence happen as independent reactions
    correct: false
  - text: Factory because constructing the importer is the whole design problem
    correct: false
  explanation: |
    Template Method fits when the workflow order is an invariant and selected steps vary. Strategy is useful for interchangeable algorithms, but allowing each file type to reorder a regulated workflow breaks the invariant. Observer and Factory answer different pressures.
  difficulty: senior
- q: An event-based workflow publishes order_placed before the database transaction commits. Which senior-level concern is being missed?
  options:
  - text: Subscribers may observe or act on state that is not durable yet
    correct: true
  - text: Observer cannot be used with databases at all
    correct: false
  - text: The event should be a Command instead because all events are actions
    correct: false
  - text: The publisher should synchronously wait for every analytics subscriber
    correct: false
  explanation: |
    Event timing is part of the contract. Publishing before commit can let subscribers see inconsistent or rolled-back state. Observer can be used with databases, but the design needs after-commit publishing, outbox behavior, or another explicit reliability rule.
  difficulty: senior
---
