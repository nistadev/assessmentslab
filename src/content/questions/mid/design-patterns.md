---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: Adding Slack requires modifying create_notification. Which principle is violated and what is the fix?
  code: "def create_notification(channel: str, message: str):\n    if channel == \"email\":\n        return EmailNotification(message)\n\
    \    elif channel == \"sms\":\n        return SMSNotification(message)\n    elif channel == \"push\":\n        return\
    \ PushNotification(message)\n    raise ValueError(f\"Unknown channel: {channel}\")"
  options:
  - text: Open/Closed Principle (OCP)
    correct: true
  - text: Single Responsibility Principle (SRP)
    correct: false
  - text: Liskov Substitution Principle (LSP)
    correct: false
  - text: No violation
    correct: false
  explanation: 'Factory Method pattern with an OCP violation. The if/elif chain must be modified for every new type. Fix:
    REGISTRY = {''email'': EmailNotification, ''sms'': SMSNotification, ...}; then create_notification = lambda ch, msg: REGISTRY[ch](msg).
    Adding Slack = one dict entry, zero function changes. This is the registration pattern used by Django''s signal dispatch,
    Python''s codec registry, and plugin systems.'
  difficulty: mid
- q: What does this print and why?
  code: "class DatabasePool:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n         \
    \   cls._instance = super().__new__(cls)\n            cls._instance.connections = []\n        return cls._instance\n\n\
    a = DatabasePool()\nb = DatabasePool()\na.connections.append(\"conn1\")\nprint(len(b.connections))"
  options:
  - text: '1'
    correct: true
  - text: '0'
    correct: false
  - text: Error
    correct: false
  - text: '2'
    correct: false
  explanation: 'Singleton pattern. __new__ returns the same instance every time after the first call. a is b evaluates to
    True. Any mutation on a.connections is visible through b because they reference the identical list. Common for shared
    resources: DB connection pools, config singletons, logger instances. Caveat: global mutable state makes testing harder
    -- prefer dependency injection when testability matters.'
  difficulty: mid
- q: What pattern? Why does new code call processor.charge() instead of gateway.charge_card()?
  code: "class ThirdPartyGateway:\n    def charge_card(self, card_number: str, amount_cents: int) -> bool:\n        ...\n\n\
    class PaymentBridge:\n    def __init__(self, gateway: ThirdPartyGateway):\n        self._gw = gateway\n\n    def charge(self,\
    \ card: str, amount_usd: float) -> bool:\n        return self._gw.charge_card(card, int(amount_usd * 100))\n\nprocessor\
    \ = PaymentBridge(ThirdPartyGateway())\nresult = processor.charge(\"4111...\", 9.99)"
  options:
  - text: Adapter
    correct: true
  - text: Facade
    correct: false
  - text: Proxy
    correct: false
  - text: Decorator
    correct: false
  explanation: Adapter pattern. New code depends only on PaymentBridge's interface. When the legacy gateway is replaced with
    a modern API, only the bridge changes -- callers are untouched. Different from Facade (which simplifies multiple subsystems)
    and Decorator (which adds behavior to the same interface). Used whenever integrating third-party libraries, legacy systems,
    or external APIs whose interfaces you do not control.
  difficulty: mid
- q: A review asks whether repeated constructor choices, boundary leakage, or branching behavior is the issue. What is the best first step?
  options:
  - text: Classify which pattern group matches the change pressure
    correct: true
  - text: Always choose Factory because object creation is common
    correct: false
  - text: Replace every branch with inheritance
    correct: false
  - text: Move all code into one service
    correct: false
  explanation: |
    The mid-level move is to classify the pressure first: creational, structural, or behavioral. That narrows the right pattern family before naming a specific pattern. Picking Factory by default or forcing inheritance can add ceremony without solving the actual problem.
  difficulty: mid
- q: Which statement best matches Factory, Abstract Factory, Builder, Prototype, and Singleton?
  options:
  - text: Factory chooses one product, Abstract Factory chooses a family, Builder does step-by-step setup, Prototype copies a prepared object, Singleton shares one instance
    correct: true
  - text: Factory always creates families, Builder always copies objects, Singleton always hides a subsystem
    correct: false
  - text: Abstract Factory and Builder are the same pattern with different names
    correct: false
  - text: Prototype is just a fancy Factory
    correct: false
  explanation: That is the intent split the study file teaches. The others collapse distinct change pressures into one bucket and miss why each pattern exists. The distinction matters when reviewing setup-heavy code.
  difficulty: mid
- q: Which pattern difference is correct?
  options:
  - text: Adapter translates an interface, Facade simplifies a subsystem, Proxy controls access, Decorator adds behavior
    correct: true
  - text: Adapter adds logging, Facade copies objects, Proxy chooses algorithms, Decorator creates families
    correct: false
  - text: Facade is the same as Builder
    correct: false
  - text: Proxy is always a cache and nothing else
    correct: false
  explanation: Those are the wrapper intents from the study file. They can look similar in code, but their reason for existence is different. Mixing them up usually leads to wrappers that do too many jobs.
  difficulty: mid
- q: Which pattern question is being asked when behavior changes with the current status value?
  options:
  - text: State
    correct: true
  - text: Strategy
    correct: false
  - text: Template Method
    correct: false
  - text: Chain of Responsibility
    correct: false
  explanation: State fits when the same object behaves differently because its current state changed. Strategy is chosen by the caller, Template Method fixes workflow order, and Chain of Responsibility passes a request along handlers.
  difficulty: mid
- q: Which pair best matches communication patterns from the study file?
  options:
  - text: Observer for events, Mediator for coordination, Command for action objects, Memento for snapshots
    correct: true
  - text: Observer for copying, Mediator for inheritance, Command for interfaces, Memento for caching
    correct: false
  - text: Mediator and Observer are the same thing
    correct: false
  - text: Memento is the pattern for choosing algorithms
    correct: false
  explanation: |
    That is the separation the study file makes. The pairs differ by what is being managed: notification, coordination, action lifecycle, or restore state. The wrong options mix up roles that are easy to confuse in code review.
  difficulty: mid
- q: A factory keeps getting new variants and the if/elif chain keeps growing. What mid-level improvement matches the study file?
  options:
  - text: Move variant lookup into a registry-backed factory
    correct: true
  - text: Turn the factory into a singleton
    correct: false
  - text: Replace the factory with a facade
    correct: false
  - text: Hard-code every variant in callers
    correct: false
  explanation: |
    The mid study file says factories become more useful when new variants should be additive. A registry keeps lookup and validation in one place while adding new entries stays local. Singleton does not solve variant growth, and facade is the wrong intent.
  difficulty: mid
- q: A UI team needs a light theme button, dialog, and input to stay compatible. Which pattern fits best?
  options:
  - text: Abstract Factory
    correct: true
  - text: Builder
    correct: false
  - text: Strategy
    correct: false
  - text: Iterator
    correct: false
  explanation: |
    Abstract Factory creates related products that must work together. The study file uses theme families as the main example. Builder is about step-by-step construction of one object, not selecting a compatible family.
  difficulty: mid
- q: A code review says object setup is readable enough, but only one object is needed. What is the right call?
  options:
  - text: Keep a plain constructor or small factory
    correct: true
  - text: Introduce Builder immediately
    correct: false
  - text: Add Singleton to simplify construction
    correct: false
  - text: Turn the object into a decorator chain
    correct: false
  explanation: |
    The mid study file says to choose creation patterns by pressure, not by formality. If object setup is still simple, a constructor or small factory is clearer than Builder or Singleton.
  difficulty: mid
- q: A wrapper translates vendor field names and units into app-friendly calls. Which intent is this?
  options:
  - text: Adapter
    correct: true
  - text: Facade
    correct: false
  - text: Proxy
    correct: false
  - text: Decorator
    correct: false
  explanation: |
    Adapter is the mid-level wrapper that changes one interface into another expected interface. Facade simplifies a subsystem, Proxy controls access, and Decorator adds behavior.
  difficulty: mid
- q: A wrapper hides five API calls behind one export() method. Which intent is this?
  options:
  - text: Facade
    correct: true
  - text: Adapter
    correct: false
  - text: Command
    correct: false
  - text: Strategy
    correct: false
  explanation: |
    Facade fits when callers should not know too much subsystem detail. The wrapper simplifies a multi-step workflow instead of translating an incompatible interface.
  difficulty: mid
- q: A wrapper checks permissions before reaching the real document. Which intent is this?
  options:
  - text: Proxy
    correct: true
  - text: Decorator
    correct: false
  - text: Builder
    correct: false
  - text: Observer
    correct: false
  explanation: |
    Proxy controls access, lifecycle, or cost while preserving the interface. The study file calls out permission and lazy-loading style wrappers as proxy use cases.
  difficulty: mid
- q: A wrapper adds retry and timing around an HTTP client. Which intent is this?
  options:
  - text: Decorator
    correct: true
  - text: Adapter
    correct: false
  - text: Facade
    correct: false
  - text: Singleton
    correct: false
  explanation: |
    Decorator adds optional behavior around the same contract. Retry and metrics are classic cross-cutting concerns. Adapter would translate an interface, not add behavior.
  difficulty: mid
- q: The same order object behaves differently when status changes from pending to shipped. Which pattern fits?
  options:
  - text: State
    correct: true
  - text: Strategy
    correct: false
  - text: Observer
    correct: false
  - text: Prototype
    correct: false
  explanation: |
    State fits when behavior depends on current status. Strategy is chosen externally by the caller, while State is about current internal lifecycle.
  difficulty: mid
- q: An order event should notify email, inventory, and analytics independently. Which pattern fits?
  options:
  - text: Observer
    correct: true
  - text: Mediator
    correct: false
  - text: Command
    correct: false
  - text: Memento
    correct: false
  explanation: |
    Observer fits when one event has many independent reactions. Mediator coordinates peers, Command packages action intent, and Memento stores restore state.
  difficulty: mid
- q: An editor should queue an action so it can be undone later. Which pattern fits?
  options:
  - text: Command
    correct: true
  - text: Iterator
    correct: false
  - text: Visitor
    correct: false
  - text: Facade
    correct: false
  explanation: |
    Command wraps action and data into an object that can be queued, logged, or undone. The study file uses undo/redo and task queues as the main examples.
  difficulty: mid
- q: A text editor saves state before a risky change and restores it on undo. Which pattern fits?
  options:
  - text: Memento
    correct: true
  - text: Strategy
    correct: false
  - text: Proxy
    correct: false
  - text: Builder
    correct: false
  explanation: |
    Memento captures state for later restore without exposing internals. Strategy chooses algorithms, Proxy controls access, and Builder assembles objects.
  difficulty: mid
- q: A file tree needs a single interface so callers can ask both files and folders for size. Which pattern fits?
  options:
  - text: Composite
    correct: true
  - text: Bridge
    correct: false
  - text: Iterator
    correct: false
  - text: Flyweight
    correct: false
  explanation: |
    Composite is the tree pattern from the study file. One interface covers leaf and group nodes. Iterator is about traversal, Bridge splits abstraction from implementation, and Flyweight shares repeated data.
  difficulty: mid
---
