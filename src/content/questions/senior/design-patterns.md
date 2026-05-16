---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: What pattern? What does @retry(3) do to call_payment_api?
  code: "def retry(max_attempts: int):\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            for attempt\
    \ in range(max_attempts):\n                try:\n                    return func(*args, **kwargs)\n                except\
    \ Exception:\n                    if attempt == max_attempts - 1:\n                        raise\n        return wrapper\n\
    \    return decorator\n\n@retry(3)\ndef call_payment_api(order_id: str):\n    # may raise on transient network errors\n\
    \    ..."
  options:
  - text: Decorator pattern
    correct: true
  - text: Strategy
    correct: false
  - text: Template Method
    correct: false
  - text: Proxy
    correct: false
  explanation: Decorator pattern. @retry(3) replaces call_payment_api with wrapper, which transparently adds retry behavior.
    The original function is unchanged and unaware of the wrapping. Python's @ syntax is syntactic sugar for call_payment_api
    = retry(3)(call_payment_api). Used in production for rate limiting, caching (@functools.lru_cache), authentication, and
    logging -- any cross-cutting concern that should not pollute business logic.
  difficulty: senior
- q: What is printed?
  code: "class TextEditor:\n    def __init__(self):\n        self.content = \"\"\n        self._history = []\n\n    def execute(self,\
    \ command):\n        command.do(self)\n        self._history.append(command)\n\n    def undo(self):\n        if self._history:\n\
    \            self._history.pop().undo(self)\n\nclass Insert:\n    def __init__(self, text): self.text = text\n    def\
    \ do(self, ed): ed.content += self.text\n    def undo(self, ed): ed.content = ed.content[:-len(self.text)]\n\ned = TextEditor()\n\
    ed.execute(Insert(\"Hello\"))\ned.execute(Insert(\" World\"))\ned.undo()\nprint(ed.content)"
  options:
  - text: '"Hello"'
    correct: true
  - text: '""'
    correct: false
  - text: '"Hello World"'
    correct: false
  - text: '" World"'
    correct: false
  explanation: Command pattern. Each command encapsulates an action and its inverse. undo() pops the last command and calls
    its undo(), removing ' World'. ed.content is 'Hello'. The history stack enables unlimited undo/redo without the editor
    knowing how to reverse any specific action. Used in text editors, game engines, financial transaction logs, and any system
    requiring auditability or rollback.
  difficulty: senior
- q: A team asks what should drive pattern choice in a refactor. What is the senior-level answer?
  options:
  - text: The change axis, ownership, contracts, and what must stay stable
    correct: true
  - text: The pattern name that sounds most advanced
    correct: false
  - text: The number of classes in the file
    correct: false
  - text: Whether a pattern is in the GoF book
    correct: false
  explanation: Senior design starts from what changes, who owns it, and what should remain stable. Pattern names are secondary. The wrong answers focus on appearance rather than the forces that make the design worth having.
  difficulty: senior
- q: A boundary needs a provider adapter, retry wrapper, and maybe a factory to select the provider. Why is that okay?
  options:
  - text: Each layer owns a different change pressure and job
    correct: true
  - text: Stacking patterns is always better than one function
    correct: false
  - text: It guarantees no future refactors
    correct: false
  - text: It removes the need for tests
    correct: false
  explanation: The study file treats composition as healthy when each layer has a clear reason to exist. The factory selects, the adapter translates, and the decorator adds cross-cutting behavior. If one wrapper does all three, the design is getting tangled.
  difficulty: senior
- q: Why add contract tests before many callers depend on a strategy or handler?
  options:
  - text: To lock down inputs, outputs, side effects, and failure behavior
    correct: true
  - text: To prove all implementations use inheritance
    correct: false
  - text: To remove the need for interfaces
    correct: false
  - text: To make the code shorter
    correct: false
  explanation: Senior extension points need explicit contracts, not just class names. Tests should prove the shared behavior so new implementations can be added safely. Inheritance is optional, and shorter code is not the goal.
  difficulty: senior
- q: A command may run twice in a queue and must not double-charge. What property matters most?
  options:
  - text: Idempotency and failure semantics
    correct: true
  - text: The exact class name of the command
    correct: false
  - text: Whether the command has a private field
    correct: false
  - text: Whether the command uses a decorator
    correct: false
  explanation: Async behavior patterns need retry and duplicate-safety thinking. Idempotency tells you whether a replay is safe. The other choices do not solve distributed execution or retry behavior.
  difficulty: senior
- q: When is a pattern probably too much ceremony?
  options:
  - text: When there is no real change pressure and a local function is clearer
    correct: true
  - text: When the pattern is mentioned in the study file
    correct: false
  - text: When the code has one branch
    correct: false
  - text: When the module has tests
    correct: false
  explanation: The senior lesson says to avoid pattern ceremony when a local design is enough. If the abstraction does not localize expected change or improve ownership, it is overhead. A simple function can be the right answer.
  difficulty: senior
- q: A refactor must stay driven by what changes, who owns it, and what stays stable. What is the senior-level starting point?
  options:
  - text: Change axis and ownership
    correct: true
  - text: Class count and file count
    correct: false
  - text: The GoF category only
    correct: false
  - text: Which pattern has the most examples online
    correct: false
  explanation: |
    The senior study file says pattern choice starts from change axis and ownership. That is what makes a pattern worth having. Category names alone do not explain why the abstraction exists.
  difficulty: senior
- q: Why is it okay to stack a factory, adapter, and decorator around a boundary?
  options:
  - text: Each layer has a different job and change pressure
    correct: true
  - text: More layers always make design better
    correct: false
  - text: Stacking patterns removes the need for contracts
    correct: false
  - text: A wrapper can safely own every business rule
    correct: false
  explanation: |
    Senior composition is healthy only when each layer can be explained in one sentence. The factory selects, the adapter translates, and the decorator adds cross-cutting behavior. If a layer starts doing all three, responsibilities are tangled.
  difficulty: senior
- q: Why add contract tests before many callers depend on an extension point?
  options:
  - text: To pin down inputs, outputs, side effects, and failure behavior
    correct: true
  - text: To prove inheritance is required
    correct: false
  - text: To make the code impossible to change
    correct: false
  - text: To remove the need for documentation
    correct: false
  explanation: |
    The senior file treats extension points as contracts, not just class names. Tests should prove the shared behavior so new implementations can be added safely. That includes failure and side-effect behavior, not just return values.
  difficulty: senior
- q: A queue may execute the same command twice. Which design concern matters most?
  options:
  - text: Idempotency and duplicate-safe failure semantics
    correct: true
  - text: Whether the command has one method or two
    correct: false
  - text: Whether it inherits from a base command class
    correct: false
  - text: Whether it uses a facade
    correct: false
  explanation: |
    Senior async behavior needs duplicate-safety thinking. Idempotency answers whether replay is safe. Inheritance and facade shape do not solve retries or duplicate delivery.
  difficulty: senior
- q: A new strategy, handler, or subscriber misbehaves in production. What belongs in the design?
  options:
  - text: Feature flags, metrics, tracing, timeouts, and kill switches
    correct: true
  - text: Only a longer class name
    correct: false
  - text: More nesting in the object graph
    correct: false
  - text: No rollout controls because tests passed
    correct: false
  explanation: |
    The senior file says async and extension behavior needs observability and rollback controls. Tests are not enough once a behavior ships under traffic. Feature flags and kill switches limit blast radius.
  difficulty: senior
- q: A pattern helps only when the abstraction reduces repeated change. When should it be avoided?
  options:
  - text: When a local function is clearer and there is no real change pressure
    correct: true
  - text: When the code has any conditional
    correct: false
  - text: When the file is short
    correct: false
  - text: When the team uses tests
    correct: false
  explanation: |
    Senior restraint matters. If the abstraction does not localize expected change or improve ownership, it is ceremony. Small direct code can be the correct choice.
  difficulty: senior
- q: A payment flow uses a provider factory, a provider adapter, and a retry decorator. What makes that composition healthy?
  options:
  - text: Each piece owns selection, translation, or cross-cutting behavior separately
    correct: true
  - text: The flow now uses three patterns, so it is automatically better
    correct: false
  - text: Each wrapper can decide business policy independently
    correct: false
  - text: The adapter can replace the tests
    correct: false
  explanation: |
    The senior study file says composition is healthy when each layer has a clear job. Pattern stacking is only useful when the responsibilities stay separated. Otherwise the wrapper becomes a grab bag.
  difficulty: senior
- q: What should a senior engineer explain in review instead of just naming a pattern?
  options:
  - text: The force behind the pattern and the tradeoff it solves
    correct: true
  - text: The pattern's popularity
    correct: false
  - text: The longest possible class diagram
    correct: false
  - text: The number of GoF categories the pattern appears in
    correct: false
  explanation: |
    The senior study file says the important part is the change being managed, not the label. A pattern without a clear force becomes ceremony. Review comments should explain why the design exists.
  difficulty: senior
- q: Why is an adapter contract different from a facade contract at senior level?
  options:
  - text: Adapter translates a foreign interface, facade hides subsystem complexity
    correct: true
  - text: Adapter always owns retries, facade always owns permissions
    correct: false
  - text: Facade and adapter are the same thing in every codebase
    correct: false
  - text: Facade only applies to inheritance
    correct: false
  explanation: |
    The senior file keeps wrapper intents distinct. Adapter protects the app from vendor-specific details, while facade simplifies a workflow. The contract differs because the job differs.
  difficulty: senior
- q: When does a command need more than just an execute() method?
  options:
  - text: When it may be retried, audited, or undone
    correct: true
  - text: When it has a private field
    correct: false
  - text: When it returns a value
    correct: false
  - text: When it is written in Python
    correct: false
  explanation: |
    Senior command design cares about lifecycle. Queueing, retries, auditability, and undo all change the contract. That is why idempotency and failure semantics matter.
  difficulty: senior
- q: What is the senior-level smell when a wrapper translates, retries, checks risk, and changes pricing?
  options:
  - text: Too many jobs in one wrapper
    correct: true
  - text: A perfect example of facade
    correct: false
  - text: A good singleton
    correct: false
  - text: A mandatory bridge
    correct: false
  explanation: |
    The study file calls out that layering is only healthy when each layer has one clear job. If one wrapper handles vendor translation, retry, risk, and pricing policy, responsibilities are tangled and change gets harder.
  difficulty: senior
- q: A branch-based export refactor starts with one extracted mapping and later becomes objects. What is the senior-level refactor rule?
  options:
  - text: Keep public behavior stable while moving structure in small steps
    correct: true
  - text: Rewrite everything in one change
    correct: false
  - text: Change behavior and structure together so it is faster
    correct: false
  - text: Avoid tests until the refactor is done
    correct: false
  explanation: |
    The senior study file recommends incremental refactors. Add tests around current behavior, extract one piece, and keep moving without changing the public contract all at once.
  difficulty: senior
---
