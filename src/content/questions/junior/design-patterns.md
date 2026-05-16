---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: A fourth subscriber (fraud_check) is needed. What changes?
  code: "class EventEmitter:\n    def __init__(self):\n        self._listeners = {}\n\n    def on(self, event: str, handler):\n\
    \        self._listeners.setdefault(event, []).append(handler)\n\n    def emit(self, event: str, *args):\n        for\
    \ h in self._listeners.get(event, []):\n            h(*args)\n\nbus = EventEmitter()\nbus.on(\"order_placed\", send_confirmation_email)\n\
    bus.on(\"order_placed\", update_inventory)\nbus.on(\"order_placed\", notify_warehouse)\nbus.emit(\"order_placed\", order)"
  options:
  - text: Add bus.on('order_placed', fraud_check)
    correct: true
  - text: Modify emit() to call fraud_check explicitly
    correct: false
  - text: Subclass EventEmitter and override emit
    correct: false
  - text: Replace all three existing handlers with a single combined handler
    correct: false
  explanation: Observer/Pub-Sub pattern. Publishers (emit) are decoupled from subscribers (on). Adding a new subscriber requires
    zero changes to EventEmitter or existing handlers -- just register. This is how Django signals, Node.js EventEmitter,
    and most message brokers work. The pattern breaks tight coupling between producers and consumers.
  difficulty: junior
- q: What pattern is this? What is added without touching DataExporter?
  code: "class DataExporter:\n    def __init__(self, formatter):\n        self._formatter = formatter\n\n    def export(self,\
    \ data):\n        return self._formatter(data)\n\nimport json\n\njson_export = DataExporter(json.dumps)\ncsv_export  =\
    \ DataExporter(\n    lambda rows: \"\\n\".join(\",\".join(str(c) for c in row) for row in rows)\n)\nxml_export  = DataExporter(to_xml)"
  options:
  - text: Strategy
    correct: true
  - text: Template Method
    correct: false
  - text: Decorator
    correct: false
  - text: Dependency Injection
    correct: false
  explanation: 'Strategy pattern: the algorithm (formatting) is extracted into an interchangeable object (callable). DataExporter
    is the context; it delegates the format decision to the injected strategy. Adding XML support means passing to_xml --
    no subclass, no conditional. Python functions as first-class objects make this trivial. Used in Python''s sort(key=...)
    and many ORMs.'
  difficulty: junior
- q: Which pattern fits when repeated construction should return the same shared object?
  code: |
    class Config:
        _instance = None

        def __new__(cls):
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance.values = {}
            return cls._instance

    a = Config()
    b = Config()
    a.values["theme"] = "dark"
    print(b.values["theme"])
  options:
  - text: Singleton
    correct: true
  - text: Prototype
    correct: false
  - text: Factory
    correct: false
  - text: Decorator
    correct: false
  explanation: Singleton fits because every construction returns the same instance, so mutation through one reference is visible through the other. Prototype copies an object, Factory chooses what to create, and Decorator wraps behavior without enforcing one shared instance.
  difficulty: junior
- q: Which pattern fits when one factory creates a matching button and dialog?
  code: |
    theme = LightThemeFactory()
    button = theme.create_button()
    dialog = theme.create_dialog()
  options:
  - text: Abstract Factory
    correct: true
  - text: Builder
    correct: false
  - text: Strategy
    correct: false
  - text: Adapter
    correct: false
  explanation: Abstract Factory fits because one factory creates a family of related objects that should work together. Builder focuses on step-by-step creation of one object. Strategy swaps algorithms, and Adapter translates one interface into another.
  difficulty: junior
- q: Which pattern fits when many optional fields are named step by step before build()?
  code: |
    request = (
        RequestBuilder()
        .to("/reports")
        .with_timeout(5)
        .with_retry(3)
        .build()
    )
  options:
  - text: Builder
    correct: true
  - text: Prototype
    correct: false
  - text: Facade
    correct: false
  - text: Command
    correct: false
  explanation: Builder fits because the object is assembled through a readable sequence of configuration steps. Prototype would clone an existing object. Facade would simplify a subsystem, and Command would package an action as an object.
  difficulty: junior
- q: Which pattern fits when files and folders both answer size()?
  code: |
    total = item.size()
  options:
  - text: Composite
    correct: true
  - text: Iterator
    correct: false
  - text: Bridge
    correct: false
  - text: Flyweight
    correct: false
  explanation: Composite fits because single objects and groups share the same interface in a tree. Iterator is about traversal, Bridge separates abstraction from implementation, and Flyweight shares repeated immutable data.
  difficulty: junior
- q: Which pattern fits when one function chooses a parser by file type?
  code: |
    def create_parser(file_type):
        if file_type == "json":
            return JsonParser()
        if file_type == "csv":
            return CsvParser()
        return XmlParser()
  options:
  - text: Factory
    correct: true
  - text: Bridge
    correct: false
  - text: Proxy
    correct: false
  - text: Memento
    correct: false
  explanation: Factory fits because one place makes the creation decision based on input. Bridge separates two dimensions of variation, Proxy controls access, and Memento stores state for restore.
  difficulty: junior
- q: Which pattern fits when code should still call send_template() even if vendor names differ?
  code: |
    class MailAdapter:
        def __init__(self, client):
            self.client = client

        def send_template(self, to, template):
            return self.client.messages.create(recipient=to, template_id=template)
  options:
  - text: Adapter
    correct: true
  - text: Facade
    correct: false
  - text: Strategy
    correct: false
  - text: Singleton
    correct: false
  explanation: Adapter fits because it translates one interface into another the app already expects. Facade would simplify a subsystem, Strategy swaps algorithms, and Singleton shares one instance.
  difficulty: junior
- q: Which pattern fits when a logger wrapper adds timestamps before calling the real logger?
  code: |
    class TimestampLogger:
        def __init__(self, logger):
            self.logger = logger

        def log(self, message):
            return self.logger.log(f"[{now()}] {message}")
  options:
  - text: Decorator
    correct: true
  - text: Proxy
    correct: false
  - text: Builder
    correct: false
  - text: Abstract Factory
    correct: false
  explanation: Decorator fits because the wrapper keeps the same kind of call and adds behavior around it. Proxy is mainly about controlling access, Builder assembles objects step by step, and Abstract Factory creates families of related products.
  difficulty: junior
- q: Which pattern fits when a prepared notification is cloned and slightly changed?
  code: |
    welcome = Notification("Welcome", tags=["new"])
    reminder = welcome.copy()
    reminder.title = "Payment reminder"
  options:
  - text: Prototype
    correct: true
  - text: Singleton
    correct: false
  - text: Builder
    correct: false
  - text: Facade
    correct: false
  explanation: Prototype fits because the new object starts from an existing configured object. Singleton would force one shared instance, Builder would assemble step by step, and Facade would hide a subsystem.
  difficulty: junior
- q: Which pattern fits when a report and its renderer vary independently?
  code: |
    class Report:
        def __init__(self, renderer):
            self.renderer = renderer

        def export(self, data):
            return self.renderer.render(data)
  options:
  - text: Bridge
    correct: true
  - text: Composite
    correct: false
  - text: Observer
    correct: false
  - text: Factory
    correct: false
  explanation: Bridge fits because abstraction and implementation are split so both can change separately. Composite is for trees, Observer is for publish/subscribe, and Factory creates objects.
  difficulty: junior
- q: Which pattern fits when one method hides a multi-step export workflow behind a simple API?
  code: |
    class VideoFacade:
        def export(self, path, output):
            codec = CodecRegistry().find("mp4")
            frames = VideoReader(path).frames()
            VideoWriter(output).write(Compressor(codec).compress(frames))
  options:
  - text: Facade
    correct: true
  - text: Adapter
    correct: false
  - text: Proxy
    correct: false
  - text: Command
    correct: false
  explanation: Facade fits because it simplifies a complex subsystem into one easy entry point. Adapter changes an interface, Proxy controls access, and Command packages an action.
  difficulty: junior
- q: Which pattern fits when many markers share the same icon data?
  code: |
    hotel_icon = IconFactory.get("hotel")
    markers = [Marker(10, 20, hotel_icon), Marker(12, 25, hotel_icon)]
  options:
  - text: Flyweight
    correct: true
  - text: Visitor
    correct: false
  - text: Mediator
    correct: false
  - text: Template Method
    correct: false
  explanation: Flyweight fits because repeated immutable data is shared instead of copied into every object. Visitor adds operations to a stable structure, Mediator coordinates peers, and Template Method fixes workflow order.
  difficulty: junior
- q: Which pattern fits when access to a document is checked before read() reaches the real object?
  code: |
    class ProtectedDocument:
        def __init__(self, document, permissions):
            self.document = document
            self.permissions = permissions

        def read(self, user):
            self.permissions.require(user, "read")
            return self.document.read()
  options:
  - text: Proxy
    correct: true
  - text: Decorator
    correct: false
  - text: Strategy
    correct: false
  - text: Builder
    correct: false
  explanation: Proxy fits because it controls access to the real object. Decorator adds behavior as a feature, Strategy swaps algorithms, and Builder constructs objects step by step.
  difficulty: junior
- q: Which pattern fits when one object publishes and many subscribers react?
  code: |
    bus.on("order_placed", send_email)
    bus.on("order_placed", update_inventory)
    bus.emit("order_placed", order)
  options:
  - text: Observer
    correct: true
  - text: Singleton
    correct: false
  - text: Bridge
    correct: false
  - text: Prototype
    correct: false
  explanation: Observer fits because the publisher does not know who listens. Singleton shares one instance, Bridge splits abstraction from implementation, and Prototype copies an existing object.
  difficulty: junior
- q: Which pattern fits when each handler can process or pass along a support ticket?
  code: |
    billing.set_next(technical).set_next(general)
    result = billing.handle(ticket)
  options:
  - text: Chain of Responsibility
    correct: true
  - text: Iterator
    correct: false
  - text: Mediator
    correct: false
  - text: Composite
    correct: false
  explanation: Chain of Responsibility fits because a request moves through handlers until one handles it. Iterator walks through a collection, Mediator coordinates peers, and Composite models trees.
  difficulty: junior
- q: Which pattern fits when a button gets an executable save action object?
  code: |
    class SaveDocument:
        def __init__(self, document):
            self.document = document

        def execute(self):
            self.document.save()
  options:
  - text: Command
    correct: true
  - text: Strategy
    correct: false
  - text: Factory
    correct: false
  - text: State
    correct: false
  explanation: Command fits because the action is wrapped as an object that can be queued or triggered later. Strategy chooses an algorithm, Factory creates objects, and State changes behavior with current status.
  difficulty: junior
- q: Which pattern fits when small grammar objects evaluate a rule like country and amount?
  code: |
    rule = And(CountryIs("ES"), TotalOver(100))
    if rule.evaluate(order):
        apply_free_shipping(order)
  options:
  - text: Interpreter
    correct: true
  - text: Visitor
    correct: false
  - text: Template Method
    correct: false
  - text: Facade
    correct: false
  explanation: Interpreter fits because a small language or grammar is represented by objects that evaluate the rule. Visitor adds new operations to stable nodes, Template Method fixes workflow order, and Facade hides subsystem steps.
  difficulty: junior
- q: Which pattern fits when code loops over a playlist without knowing storage details?
  code: |
    for song in playlist:
        play(song)
  options:
  - text: Iterator
    correct: true
  - text: State
    correct: false
  - text: Builder
    correct: false
  - text: Adapter
    correct: false
  explanation: Iterator fits because traversal is exposed without revealing internal storage. State changes behavior based on current status, Builder assembles objects, and Adapter translates interfaces.
  difficulty: junior
- q: Which pattern fits when a dialog object coordinates fields that would otherwise call each other directly?
  code: |
    class CheckoutDialog:
        def country_changed(self, country):
            self.tax_field.update(country)
            self.shipping_field.update(country)
  options:
  - text: Mediator
    correct: true
  - text: Observer
    correct: false
  - text: Proxy
    correct: false
  - text: Singleton
    correct: false
  explanation: Mediator fits because one coordinator manages communication between related objects. Observer is one-to-many event publication, Proxy controls access, and Singleton shares one instance.
  difficulty: junior
- q: Which pattern fits when an editor stores a snapshot before a risky change?
  code: |
    snapshot = editor.save()
    editor.replace_selection("new text")
    editor.restore(snapshot)
  options:
  - text: Memento
    correct: true
  - text: Factory
    correct: false
  - text: Composite
    correct: false
  - text: Bridge
    correct: false
  explanation: Memento fits because state is captured for later restore without exposing internals. Factory creates objects, Composite handles trees, and Bridge separates abstraction from implementation.
  difficulty: junior
- q: Which pattern fits when order state changes what cancel() means?
  code: |
    if order.status == "shipped":
        raise Exception("Too late")
    if order.status == "pending":
        order.status = "cancelled"
  options:
  - text: State
    correct: true
  - text: Strategy
    correct: false
  - text: Chain of Responsibility
    correct: false
  - text: Prototype
    correct: false
  explanation: State fits because behavior depends on current status. Strategy is chosen by the caller, Chain of Responsibility routes requests, and Prototype copies an existing object.
  difficulty: junior
- q: Which pattern fits when a base class controls generate() and subclasses override steps?
  code: |
    class ReportGenerator:
        def generate(self, data):
            raw = self.fetch(data)
            rows = self.transform(raw)
            return self.render(rows)
  options:
  - text: Template Method
    correct: true
  - text: Builder
    correct: false
  - text: Observer
    correct: false
  - text: Proxy
    correct: false
  explanation: Template Method fits because the workflow order stays fixed while subclasses fill in the steps. Builder is step-by-step construction, Observer is pub/sub, and Proxy controls access.
  difficulty: junior
- q: Which pattern fits when new operations should be added to a stable tree of nodes?
  code: |
    output = number_node.accept(PrintVisitor())
  options:
  - text: Visitor
    correct: true
  - text: Composite
    correct: false
  - text: Mediator
    correct: false
  - text: Singleton
    correct: false
  explanation: Visitor fits because operations live outside the node classes, which stay stable. Composite is about tree structure itself, Mediator coordinates peers, and Singleton shares one instance.
  difficulty: junior
---
