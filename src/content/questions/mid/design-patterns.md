---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: Adding Slack should not require editing the creation function every time a new notification channel appears. What refactor best matches the pressure?
  code: |
    def create_notification(channel: str, message: str):
        if channel == "email":
            return EmailNotification(message)
        if channel == "sms":
            return SmsNotification(message)
        if channel == "push":
            return PushNotification(message)
        raise ValueError(f"Unknown channel: {channel}")
  options:
  - text: Keep lookup and validation in a registry-backed factory, then register Slack as a new entry
    correct: true
  - text: Move the if/elif chain into each caller so callers can choose faster
    correct: false
  - text: Wrap every notification in a facade so construction no longer matters
    correct: false
  - text: Make notifications singletons so the branch is executed only once
    correct: false
  explanation: |
    A registry-backed factory keeps the creation contract stable while new variants become additive entries. Moving the branch into callers spreads the same change pressure. A facade hides subsystem complexity but does not solve variant lookup. Singleton changes lifecycle, not how new notification types are added.
  difficulty: mid
- q: What does this print, and what design tradeoff does it show?
  code: |
    class ConnectionPool:
        _shared = None

        def __new__(cls):
            if cls._shared is None:
                cls._shared = super().__new__(cls)
                cls._shared.connections = []
            return cls._shared

    a = ConnectionPool()
    b = ConnectionPool()
    a.connections.append("conn1")
    print(len(b.connections))
  options:
  - text: It prints 1 because both names reference the same shared instance
    correct: true
  - text: It prints 0 because b gets a fresh connections list
    correct: false
  - text: It raises because connections is private to a
    correct: false
  - text: It prints 2 because constructing b appends another connection
    correct: false
  explanation: |
    Singleton construction returns the same object after the first call, so mutation through a is visible through b. The tradeoff is global-state pressure: useful for one process-wide resource, but risky for tests and hidden coupling.
  difficulty: mid
- q: Checkout code now calls processor.charge(card, money) instead of the vendor's charge_card(card_number, amount_cents). What pattern and boundary rule fit?
  code: |
    class PaymentPort:
        def __init__(self, gateway):
            self.gateway = gateway

        def charge(self, card, amount):
            return self.gateway.charge_card(
                card_number=card.number,
                amount_cents=amount.cents,
            )
  options:
  - text: Adapter, because vendor names and units are translated at the boundary
    correct: true
  - text: Facade, because every wrapper around an SDK is mainly a subsystem shortcut
    correct: false
  - text: Proxy, because the wrapper decides whether a card is allowed to charge
    correct: false
  - text: Decorator, because the wrapper adds optional retry behavior
    correct: false
  explanation: |
    Adapter is the best fit because it protects application code from the vendor's method names, units, and response shape. Facade would simplify several subsystem calls, Proxy would control access or lifecycle, and Decorator would add behavior around the same contract.
  difficulty: mid
- q: A review is unsure whether the issue is repeated construction choices, vendor boundary leakage, or branching behavior. What should the first review move be?
  options:
  - text: Identify the change pressure first, then narrow to creational, structural, or behavioral patterns
    correct: true
  - text: Start by extracting an interface from the largest class, then pick a pattern later
    correct: false
  - text: Prefer Factory first because object creation appears in most designs
    correct: false
  - text: Prefer Mediator first because it reduces direct calls between objects
    correct: false
  explanation: |
    Mid-level pattern choice starts by naming the pressure: creation, structure, or behavior. Extracting an interface or choosing Factory/Mediator can be right later, but those moves are premature if the underlying pressure is not known.
  difficulty: mid
- q: Which creation-pattern mapping would you defend in a design review?
  options:
  - text: Factory selects one product, Abstract Factory selects a compatible family, Builder names setup steps, Prototype copies a prepared object, Singleton shares one lifecycle
    correct: true
  - text: Factory and Abstract Factory both mainly hide optional fields; Builder chooses related UI families
    correct: false
  - text: Prototype is for one process-wide instance; Singleton copies expensive configured objects
    correct: false
  - text: Builder is the right default whenever a constructor has two arguments; Factory is only for inheritance
    correct: false
  explanation: |
    The correct mapping separates selection, family consistency, setup readability, copying, and shared lifecycle. The distractors mix nearby creation problems, which is exactly where these patterns are often confused.
  difficulty: mid
- q: Which wrapper distinction is correct when reviewing SDK, repository, or API wrappers?
  options:
  - text: Adapter translates a foreign interface, Facade simplifies a subsystem, Proxy controls access or lifecycle, Decorator adds behavior while preserving the contract
    correct: true
  - text: Adapter and Facade both mean any class with one public method; Proxy and Decorator are interchangeable names for logging wrappers
    correct: false
  - text: Facade translates vendor units, Adapter coordinates several services, Proxy builds object families, Decorator owns construction
    correct: false
  - text: Decorator controls whether the real object may be reached; Proxy adds optional behavior after the call succeeds
    correct: false
  explanation: |
    These wrappers can look alike in code, so intent matters. Adapter translates, Facade simplifies, Proxy controls access/lifecycle/cost, and Decorator adds optional behavior around the same contract.
  difficulty: mid
- q: The same order object treats cancel differently when its current status is pending, paid, or shipped. Which pattern question is being asked?
  options:
  - text: State, because behavior follows the object's current lifecycle state
    correct: true
  - text: Strategy, because the caller should choose a cancel algorithm on every call
    correct: false
  - text: Template Method, because every order operation should inherit the same workflow
    correct: false
  - text: Chain of Responsibility, because every status should pass the cancel request to the next status
    correct: false
  explanation: |
    State fits when behavior changes because the object's internal lifecycle changes. Strategy is close, but it is usually selected externally as an interchangeable algorithm. Template Method fixes workflow order, and Chain routes a request through handlers.
  difficulty: mid
- q: Which communication-pattern mapping is the strongest?
  options:
  - text: Observer publishes independent reactions, Mediator coordinates peers, Command stores an action, Memento stores restorable state
    correct: true
  - text: Observer coordinates peer widgets, Mediator records undo snapshots, Command broadcasts events, Memento selects algorithms
    correct: false
  - text: Command and Memento are the same whenever undo exists; Observer is just Chain of Responsibility with events
    correct: false
  - text: Mediator is the default for any one-to-many event, while Observer is mainly for dialog fields
    correct: false
  explanation: |
    The correct mapping separates notification, coordination, action lifecycle, and state restoration. Command and Memento can work together for undo, but one stores the action and the other stores state.
  difficulty: mid
- q: A parser factory keeps getting new variants and the if/elif chain is retested with every import format. What improvement best matches the study guidance?
  options:
  - text: Move stable lookup and unknown-type validation into a registry-backed factory
    correct: true
  - text: Move parser selection into each import job so each caller owns its own branch
    correct: false
  - text: Replace every parser with a single parser that checks file content dynamically
    correct: false
  - text: Convert the factory into a facade around the import subsystem
    correct: false
  explanation: |
    A registry-backed factory helps when variants should be additive and lookup rules should stay consistent. Per-caller branches duplicate risk. One dynamic parser may be possible for a different problem, but it does not preserve distinct parser ownership. Facade is the wrong intent.
  difficulty: mid
- q: A UI kit needs light and dark versions of button, dialog, and input, and pieces from different themes should not be mixed accidentally. Which pattern fits best?
  options:
  - text: Abstract Factory
    correct: true
  - text: Builder
    correct: false
  - text: Strategy
    correct: false
  - text: Prototype
    correct: false
  explanation: |
    Abstract Factory fits because the factory creates compatible families of related products. Builder would configure one object, Strategy would vary behavior, and Prototype would copy a prepared instance.
  difficulty: mid
- q: A code review says construction is readable, there is one concrete object, and no expected variant growth. What is the right call?
  options:
  - text: Keep a plain constructor or small factory until real creation pressure appears
    correct: true
  - text: Introduce Builder now so future optional fields are always covered
    correct: false
  - text: Introduce Singleton so every caller avoids constructor details
    correct: false
  - text: Introduce Abstract Factory so one object can become a family later
    correct: false
  explanation: |
    Creation patterns should match pressure. If setup is clear and variants are not expected, a constructor or small factory is better than ceremony. Builder, Singleton, and Abstract Factory each solve a more specific problem.
  difficulty: mid
- q: A wrapper converts vendor field names, money units, and error codes into application-friendly values. Which intent is primary?
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
    Adapter is primary because the wrapper translates a foreign interface into the app's contract. Facade simplifies several subsystem calls, Proxy controls access or lifecycle, and Decorator adds behavior such as retry, timing, or caching around the same contract.
  difficulty: mid
- q: A service hides video reading, codec lookup, compression, and writing behind export(input, output). Which wrapper intent is primary?
  options:
  - text: Facade
    correct: true
  - text: Adapter
    correct: false
  - text: Command
    correct: false
  - text: Template Method
    correct: false
  explanation: |
    Facade fits because the wrapper simplifies a multi-step subsystem for callers. Adapter would mainly translate an incompatible interface, Command would package the export request as an action object, and Template Method would fix workflow order through inheritance hooks.
  difficulty: mid
- q: A document wrapper checks permissions and lazy-loads the real document only when read is called. Which wrapper intent is primary?
  options:
  - text: Proxy
    correct: true
  - text: Decorator
    correct: false
  - text: Adapter
    correct: false
  - text: Facade
    correct: false
  explanation: |
    Proxy fits because the wrapper controls access and lifecycle before reaching the real subject. Decorator may add behavior around a call, but this scenario is mainly about whether and when the real object is reached.
  difficulty: mid
- q: An HTTP client wrapper adds retry, timing metrics, and logging while preserving the client's request method. Which wrapper intent is primary?
  options:
  - text: Decorator
    correct: true
  - text: Proxy
    correct: false
  - text: Adapter
    correct: false
  - text: Facade
    correct: false
  explanation: |
    Decorator fits because optional cross-cutting behavior is added around the same contract. Proxy is tempting because it also wraps, but its primary job is access, lifecycle, or cost control. Adapter translates; Facade simplifies.
  difficulty: mid
- q: A checkout flow is stable, but the discount rule changes by market and campaign. Which behavioral pattern fits better than State?
  options:
  - text: Strategy
    correct: true
  - text: State
    correct: false
  - text: Chain of Responsibility
    correct: false
  - text: Memento
    correct: false
  explanation: |
    Strategy fits because the variable part is an interchangeable algorithm chosen for the checkout. State would fit if the same object changed behavior because its lifecycle status changed. Chain routes requests through handlers, and Memento stores state for restore.
  difficulty: mid
- q: An order event should trigger email, inventory, analytics, and fraud checks owned by different teams. The order service should not call each one directly. Which pattern fits?
  options:
  - text: Observer
    correct: true
  - text: Mediator
    correct: false
  - text: Chain of Responsibility
    correct: false
  - text: Template Method
    correct: false
  explanation: |
    Observer fits because one event can have many independent subscribers. Mediator coordinates peer communication, Chain passes one request along handlers, and Template Method fixes the sequence of steps in a workflow.
  difficulty: mid
- q: An editor stores save, format, and insert actions so they can be queued, logged, and undone. Which pattern is the best fit?
  options:
  - text: Command
    correct: true
  - text: Strategy
    correct: false
  - text: Memento
    correct: false
  - text: State
    correct: false
  explanation: |
    Command fits because the action and needed data are packaged as an object with a lifecycle. Memento is related to undo, but it stores state snapshots rather than the action itself. Strategy swaps algorithms, and State changes behavior with lifecycle status.
  difficulty: mid
- q: A text editor captures content and cursor position before a risky operation, then restores those values if the operation is undone. Which pattern is the best fit?
  options:
  - text: Memento
    correct: true
  - text: Command
    correct: false
  - text: Prototype
    correct: false
  - text: Observer
    correct: false
  explanation: |
    Memento fits because state is captured for later restoration without exposing editor internals. Command could trigger undo, but the saved snapshot itself is Memento. Prototype copies configured objects, and Observer publishes events.
  difficulty: mid
- q: A file tree needs a shared interface so callers can ask both files and folders for size, while folders sum their children. Which pattern fits?
  options:
  - text: Composite
    correct: true
  - text: Iterator
    correct: false
  - text: Visitor
    correct: false
  - text: Bridge
    correct: false
  explanation: |
    Composite fits because leaf and group objects share one interface in a tree. Iterator can help traverse the tree, Visitor can add operations to stable nodes, and Bridge separates two dimensions of variation rather than modeling part-whole structure.
  difficulty: mid
- q: A report type and output renderer both vary, and the team wants to avoid SalesCsvReport, SalesPdfReport, AuditCsvReport, and AuditPdfReport classes. Which pattern fits?
  options:
  - text: Bridge
    correct: true
  - text: Strategy
    correct: false
  - text: Abstract Factory
    correct: false
  - text: Adapter
    correct: false
  explanation: |
    Bridge fits because it separates two dimensions that can vary independently: report abstraction and rendering implementation. Strategy is close because a renderer can be injected, but the main pressure is avoiding a class explosion across two axes. Abstract Factory creates compatible families, and Adapter translates an incompatible interface.
  difficulty: mid
---
