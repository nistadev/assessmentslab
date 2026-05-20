---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: A new fraud check should react when an order is placed. The order service should not learn about that new reaction. What changes?
  code: |
    hub = EventHub()
    hub.on("order_placed", send_confirmation_email)
    hub.on("order_placed", update_inventory)
    hub.on("order_placed", notify_warehouse)

    hub.emit("order_placed", order)
  options:
  - text: Register fraud_check as another listener for order_placed
    correct: true
  - text: Add fraud_check directly inside emit so every event runs it
    correct: false
  - text: Replace the listeners with one combined order handler
    correct: false
  - text: Make the order service call fraud_check before publishing
    correct: false
  explanation: |
    Observer fits because the publisher emits an event and independent listeners react to it. Registering another listener keeps the publisher stable. Editing emit or the order service couples the event source to a specific reaction, while combining handlers removes the independent ownership Observer is meant to provide.
  difficulty: junior
- q: A new XML export is added by passing another formatter into the exporter. Which pattern is being used?
  code: |
    class DataExporter:
        def __init__(self, formatter):
            self.formatter = formatter

        def export(self, data):
            return self.formatter(data)

    csv_exporter = DataExporter(to_csv)
    json_exporter = DataExporter(to_json)
    xml_exporter = DataExporter(to_xml)
  options:
  - text: Strategy
    correct: true
  - text: Template Method
    correct: false
  - text: Factory
    correct: false
  - text: Dependency injection alone
    correct: false
  explanation: |
    Strategy fits because the formatting algorithm changes while the exporter workflow stays stable. Dependency injection is how the formatter is passed in, but the design idea is the interchangeable algorithm. Template Method would put fixed workflow steps in a base class, and Factory would choose which exporter or formatter to create.
  difficulty: junior
- q: Which pattern fits when repeated construction should return one shared settings object?
  code: |
    class Settings:
        _shared = None

        def __new__(cls):
            if cls._shared is None:
                cls._shared = super().__new__(cls)
                cls._shared.values = {}
            return cls._shared

    first = Settings()
    second = Settings()
    first.values["theme"] = "dark"
    print(second.values["theme"])
  options:
  - text: Singleton
    correct: true
  - text: Flyweight
    correct: false
  - text: Prototype
    correct: false
  - text: Factory
    correct: false
  explanation: |
    Singleton fits because construction returns the same instance, so mutation through first is visible through second. Flyweight shares repeated immutable data across many objects, Prototype copies a prepared object, and Factory centralizes a creation decision without requiring one shared instance.
  difficulty: junior
- q: Which pattern fits when one theme object creates a compatible button and dialog?
  code: |
    theme = light_theme()
    button = theme.create_button()
    dialog = theme.create_dialog()
  options:
  - text: Abstract Factory
    correct: true
  - text: Factory Method
    correct: false
  - text: Builder
    correct: false
  - text: Prototype
    correct: false
  explanation: |
    Abstract Factory fits because one creator returns a family of related objects that should work together. A regular factory usually chooses one product, Builder assembles one complex object step by step, and Prototype starts from an existing object copy.
  difficulty: junior
- q: Which pattern fits when many optional fields are named step by step before the final request is created?
  code: |
    request = (
        RequestPlan()
        .to("/reports")
        .with_timeout(5)
        .with_retry(3)
        .build()
    )
  options:
  - text: Builder
    correct: true
  - text: Abstract Factory
    correct: false
  - text: Prototype
    correct: false
  - text: Facade
    correct: false
  explanation: |
    Builder fits because the object is assembled through readable named steps before build creates the final result. Abstract Factory creates related families, Prototype copies an existing setup, and Facade hides a multi-step subsystem behind one simpler operation.
  difficulty: junior
- q: Which pattern fits when callers can ask both files and folders for size using the same method?
  code: |
    total = item.size()
  options:
  - text: Composite
    correct: true
  - text: Iterator
    correct: false
  - text: Visitor
    correct: false
  - text: Flyweight
    correct: false
  explanation: |
    Composite fits because leaf objects and groups share one interface in a tree. Iterator is about traversing a collection, Visitor adds operations to stable nodes, and Flyweight shares repeated data rather than modeling whole-part structure.
  difficulty: junior
- q: Which pattern fits when one function chooses the right parser from a file type?
  code: |
    def parser_for(file_type):
        if file_type == "json":
            return JsonParser()
        if file_type == "csv":
            return CsvParser()
        return XmlParser()
  options:
  - text: Factory
    correct: true
  - text: Strategy
    correct: false
  - text: Adapter
    correct: false
  - text: Template Method
    correct: false
  explanation: |
    Factory fits because object creation depends on a key and callers do not choose concrete parser classes themselves. Strategy would swap an algorithm after an object exists, Adapter would translate a foreign interface, and Template Method would fix workflow order in a base class.
  difficulty: junior
- q: Which pattern fits when the app keeps calling send_template even though the vendor uses different names and fields?
  code: |
    class EmailPort:
        def __init__(self, client):
            self.client = client

        def send_template(self, to, template):
            result = self.client.messages.create(
                recipient=to,
                template_id=template,
            )
            return result["message_id"]
  options:
  - text: Adapter
    correct: true
  - text: Facade
    correct: false
  - text: Decorator
    correct: false
  - text: Proxy
    correct: false
  explanation: |
    Adapter fits because the wrapper translates vendor names into the interface the app expects. Facade would mainly simplify several subsystem steps, Decorator would add behavior around the same contract, and Proxy would control access or lifecycle before reaching the real object.
  difficulty: junior
- q: Which pattern fits when a wrapper adds timestamps but still behaves like a logger?
  code: |
    class WithTimestamp:
        def __init__(self, logger):
            self.logger = logger

        def log(self, message):
            return self.logger.log(f"[{now()}] {message}")
  options:
  - text: Decorator
    correct: true
  - text: Proxy
    correct: false
  - text: Adapter
    correct: false
  - text: Strategy
    correct: false
  explanation: |
    Decorator fits because the wrapper preserves the logger call while adding behavior around it. Proxy would decide whether or when the real logger is reached, Adapter would change an incompatible interface, and Strategy would swap an algorithm used by a context.
  difficulty: junior
- q: Which pattern fits when a prepared notification is copied and then slightly changed?
  code: |
    welcome = Notification("Welcome", tags=["new"])
    reminder = welcome.copy()
    reminder.title = "Payment reminder"
  options:
  - text: Prototype
    correct: true
  - text: Builder
    correct: false
  - text: Singleton
    correct: false
  - text: Factory
    correct: false
  explanation: |
    Prototype fits because the new object starts from an already configured object. Builder would name construction steps, Singleton would share exactly one instance, and Factory would choose what to create from a key or rule.
  difficulty: junior
- q: Which pattern fits when reports and renderers should vary without creating one class for every combination?
  code: |
    class Report:
        def __init__(self, renderer):
            self.renderer = renderer

        def export(self, data):
            return self.renderer.render(data)
  options:
  - text: Bridge
    correct: true
  - text: Strategy
    correct: false
  - text: Adapter
    correct: false
  - text: Abstract Factory
    correct: false
  explanation: |
    Bridge fits because the abstraction and implementation can vary independently. Strategy is tempting because a renderer is injected, but the point here is separating two dimensions that can both grow. Adapter translates an incompatible interface, and Abstract Factory creates compatible product families.
  difficulty: junior
- q: Which pattern fits when one method hides a multi-step video export workflow behind a simple call?
  code: |
    class VideoExportService:
        def export(self, path, output):
            codec = CodecRegistry().find("mp4")
            frames = VideoReader(path).frames()
            compressed = Compressor(codec).compress(frames)
            VideoWriter(output).write(compressed)
  options:
  - text: Facade
    correct: true
  - text: Adapter
    correct: false
  - text: Command
    correct: false
  - text: Builder
    correct: false
  explanation: |
    Facade fits because the class hides a complex subsystem behind one simpler operation. Adapter would translate one interface to another expected interface, Command would package the export as an executable action object, and Builder would construct one object through named steps.
  difficulty: junior
- q: Which pattern fits when many map markers share the same icon data instead of copying it?
  code: |
    hotel_icon = icons.shared("hotel")
    markers = [
        Marker(10, 20, hotel_icon),
        Marker(12, 25, hotel_icon),
    ]
  options:
  - text: Flyweight
    correct: true
  - text: Singleton
    correct: false
  - text: Prototype
    correct: false
  - text: Composite
    correct: false
  explanation: |
    Flyweight fits because repeated intrinsic data is shared across many objects. Singleton is about one process-wide instance, Prototype copies a prepared object, and Composite models part-whole trees.
  difficulty: junior
- q: Which pattern fits when access is checked before read reaches the real document?
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
  - text: Adapter
    correct: false
  - text: Facade
    correct: false
  explanation: |
    Proxy fits because the wrapper controls access to the real object while keeping the read call. Decorator adds optional behavior as a feature, Adapter translates interfaces, and Facade simplifies a larger workflow.
  difficulty: junior
- q: Which pattern fits when one object publishes and many subscribers react independently?
  code: |
    hub.on("order_placed", send_email)
    hub.on("order_placed", update_inventory)
    hub.emit("order_placed", order)
  options:
  - text: Observer
    correct: true
  - text: Mediator
    correct: false
  - text: Chain of Responsibility
    correct: false
  - text: Command
    correct: false
  explanation: |
    Observer fits because one event has many independent reactions and the publisher does not call each one directly. Mediator coordinates peers, Chain of Responsibility passes one request through handlers, and Command packages an action for later execution.
  difficulty: junior
- q: Which pattern fits when each handler can process a support ticket or pass it to the next handler?
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
  explanation: |
    Chain of Responsibility fits because a request moves through handlers until one handles it. Iterator traverses items, Mediator coordinates peer communication, and Composite gives leaves and groups a shared interface.
  difficulty: junior
- q: Which pattern fits when a button receives an executable save action object?
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
  - text: State
    correct: false
  - text: Template Method
    correct: false
  explanation: |
    Command fits because the action is packaged as an object that can be triggered, queued, logged, or undone later. Strategy swaps algorithms, State changes behavior based on current lifecycle, and Template Method fixes workflow order with overridable steps.
  difficulty: junior
- q: Which pattern fits when small rule objects combine to evaluate a business rule?
  code: |
    rule = And(CountryIs("ES"), TotalOver(100))
    if rule.evaluate(order):
        apply_free_shipping(order)
  options:
  - text: Interpreter
    correct: true
  - text: Specification by itself
    correct: false
  - text: Visitor
    correct: false
  - text: Strategy
    correct: false
  explanation: |
    Interpreter fits because small objects represent a simple language and evaluate expressions. A Specification-style rule is related, but the grammar-like composition is the key signal here. Visitor adds operations to nodes, and Strategy chooses one interchangeable algorithm.
  difficulty: junior
- q: Which pattern fits when code loops over a playlist without knowing how songs are stored?
  code: |
    for song in playlist:
        play(song)
  options:
  - text: Iterator
    correct: true
  - text: Composite
    correct: false
  - text: State
    correct: false
  - text: Adapter
    correct: false
  explanation: |
    Iterator fits because traversal is exposed without revealing internal storage. Composite models trees, State changes behavior based on current status, and Adapter translates one interface into another.
  difficulty: junior
- q: Which pattern fits when a dialog coordinates fields that would otherwise call each other directly?
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
  - text: Facade
    correct: false
  - text: Proxy
    correct: false
  explanation: |
    Mediator fits because one coordinator manages communication between related objects. Observer publishes events to independent subscribers, Facade simplifies a subsystem for callers, and Proxy controls access to a real object.
  difficulty: junior
- q: Which pattern fits when an editor stores a snapshot before a risky change and can restore it later?
  code: |
    snapshot = editor.save()
    editor.replace_selection("new text")
    editor.restore(snapshot)
  options:
  - text: Memento
    correct: true
  - text: Command
    correct: false
  - text: Prototype
    correct: false
  - text: State
    correct: false
  explanation: |
    Memento fits because it captures state for later restoration without exposing internals. Command would package the action itself, Prototype would copy a configured object, and State would move behavior into lifecycle state objects.
  difficulty: junior
- q: Which pattern fits when order status changes what cancel means?
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
  - text: Template Method
    correct: false
  explanation: |
    State fits because the same action behaves differently based on the object's current lifecycle state. Strategy is usually selected from outside, Chain of Responsibility routes a request through handlers, and Template Method fixes workflow order.
  difficulty: junior
- q: Which pattern fits when a base class controls generate and subclasses fill in selected steps?
  code: |
    class ReportGenerator:
        def generate(self, data):
            raw = self.fetch(data)
            rows = self.transform(raw)
            return self.render(rows)
  options:
  - text: Template Method
    correct: true
  - text: Strategy
    correct: false
  - text: Builder
    correct: false
  - text: Factory
    correct: false
  explanation: |
    Template Method fits because the base class controls the workflow order while subclasses provide steps. Strategy swaps a whole algorithm, Builder constructs one object step by step, and Factory chooses which object to create.
  difficulty: junior
- q: Which pattern fits when new operations should be added to a stable tree of nodes?
  code: |
    output = number_node.accept(PrintOperation())
  options:
  - text: Visitor
    correct: true
  - text: Composite
    correct: false
  - text: Interpreter
    correct: false
  - text: Iterator
    correct: false
  explanation: |
    Visitor fits because the operation is moved outside stable node classes. Composite is the tree structure itself, Interpreter evaluates a small language, and Iterator traverses items without exposing storage.
  difficulty: junior
---
