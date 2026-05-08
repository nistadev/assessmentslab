---
defaultDomains:
  - computer-science
defaultTopics:
  - design-patterns
questions:
  - q: A fourth subscriber (fraud_check) is needed. What changes?
    code: |-
      class EventEmitter:
          def __init__(self):
              self._listeners = {}

          def on(self, event: str, handler):
              self._listeners.setdefault(event, []).append(handler)

          def emit(self, event: str, *args):
              for h in self._listeners.get(event, []):
                  h(*args)

      bus = EventEmitter()
      bus.on("order_placed", send_confirmation_email)
      bus.on("order_placed", update_inventory)
      bus.on("order_placed", notify_warehouse)
      bus.emit("order_placed", order)
    options:
      - text: Add bus.on('order_placed', fraud_check) -- emitter is unchanged
        correct: true
      - text: Modify emit() to call fraud_check explicitly
        correct: false
      - text: Subclass EventEmitter and override emit
        correct: false
      - text: Replace all three existing handlers with a single combined handler
        correct: false
    explanation: Observer/Pub-Sub pattern. Publishers (emit) are decoupled from subscribers (on). Adding a new subscriber requires zero changes to EventEmitter or existing handlers -- just register. This is how Django signals, Node.js EventEmitter, and most message brokers work. The pattern breaks tight coupling between producers and consumers.
    difficulty: junior
  - q: What pattern is this? What is added without touching DataExporter?
    code: |-
      class DataExporter:
          def __init__(self, formatter):
              self._formatter = formatter

          def export(self, data):
              return self._formatter(data)

      import json

      json_export = DataExporter(json.dumps)
      csv_export  = DataExporter(
          lambda rows: "\n".join(",".join(str(c) for c in row) for row in rows)
      )
      xml_export  = DataExporter(to_xml)
    options:
      - text: Strategy -- a new export format adds one callable, DataExporter stays unchanged
        correct: true
      - text: Template Method -- DataExporter defines the skeleton; subclasses override the format step
        correct: false
      - text: Decorator -- each formatter wraps the previous one
        correct: false
      - text: Dependency Injection -- DataExporter receives its collaborator at construction time
        correct: false
    explanation: "Strategy pattern: the algorithm (formatting) is extracted into an interchangeable object (callable). DataExporter is the context; it delegates the format decision to the injected strategy. Adding XML support means passing to_xml -- no subclass, no conditional. Python functions as first-class objects make this trivial. Used in Python's sort(key=...) and many ORMs."
    difficulty: junior
  - q: Adding Slack requires modifying create_notification. Which principle is violated and what is the fix?
    code: |-
      def create_notification(channel: str, message: str):
          if channel == "email":
              return EmailNotification(message)
          elif channel == "sms":
              return SMSNotification(message)
          elif channel == "push":
              return PushNotification(message)
          raise ValueError(f"Unknown channel: {channel}")
    options:
      - text: "OCP -- fix by registering handlers in a dict: REGISTRY['slack'] = SlackNotification"
        correct: true
      - text: SRP -- split into create_email, create_sms, create_push functions
        correct: false
      - text: LSP -- SlackNotification must not inherit from Notification
        correct: false
      - text: No violation -- an extra elif is the correct approach
        correct: false
    explanation: "Factory Method pattern with an OCP violation. The if/elif chain must be modified for every new type. Fix: REGISTRY = {'email': EmailNotification, 'sms': SMSNotification, ...}; then create_notification = lambda ch, msg: REGISTRY[ch](msg). Adding Slack = one dict entry, zero function changes. This is the registration pattern used by Django's signal dispatch, Python's codec registry, and plugin systems."
    difficulty: mid
  - q: What does this print and why?
    code: |-
      class DatabasePool:
          _instance = None

          def __new__(cls):
              if cls._instance is None:
                  cls._instance = super().__new__(cls)
                  cls._instance.connections = []
              return cls._instance

      a = DatabasePool()
      b = DatabasePool()
      a.connections.append("conn1")
      print(len(b.connections))
    options:
      - text: 1 -- a and b are the same object; mutations on a are visible via b
        correct: true
      - text: 0 -- b is a fresh instance with its own connections list
        correct: false
      - text: Error -- __new__ raises on the second call
        correct: false
      - text: 1 -- b copies a's state on creation
        correct: false
    explanation: "Singleton pattern. __new__ returns the same instance every time after the first call. a is b evaluates to True. Any mutation on a.connections is visible through b because they reference the identical list. Common for shared resources: DB connection pools, config singletons, logger instances. Caveat: global mutable state makes testing harder -- prefer dependency injection when testability matters."
    difficulty: mid
  - q: What pattern? What does @retry(3) do to call_payment_api?
    code: |-
      def retry(max_attempts: int):
          def decorator(func):
              def wrapper(*args, **kwargs):
                  for attempt in range(max_attempts):
                      try:
                          return func(*args, **kwargs)
                      except Exception:
                          if attempt == max_attempts - 1:
                              raise
              return wrapper
          return decorator

      @retry(3)
      def call_payment_api(order_id: str):
          # may raise on transient network errors
          ...
    options:
      - text: Decorator pattern -- wraps call_payment_api in retry logic without modifying its source; the function retries up to 3 times before re-raising
        correct: true
      - text: Strategy -- retry is a strategy passed to call_payment_api
        correct: false
      - text: Template Method -- retry defines the skeleton, call_payment_api fills in steps
        correct: false
      - text: Proxy -- retry intercepts the return value only, not exceptions
        correct: false
    explanation: Decorator pattern. @retry(3) replaces call_payment_api with wrapper, which transparently adds retry behavior. The original function is unchanged and unaware of the wrapping. Python's @ syntax is syntactic sugar for call_payment_api = retry(3)(call_payment_api). Used in production for rate limiting, caching (@functools.lru_cache), authentication, and logging -- any cross-cutting concern that should not pollute business logic.
    difficulty: senior
  - q: What is printed?
    code: |-
      class TextEditor:
          def __init__(self):
              self.content = ""
              self._history = []

          def execute(self, command):
              command.do(self)
              self._history.append(command)

          def undo(self):
              if self._history:
                  self._history.pop().undo(self)

      class Insert:
          def __init__(self, text): self.text = text
          def do(self, ed): ed.content += self.text
          def undo(self, ed): ed.content = ed.content[:-len(self.text)]

      ed = TextEditor()
      ed.execute(Insert("Hello"))
      ed.execute(Insert(" World"))
      ed.undo()
      print(ed.content)
    options:
      - text: "\"Hello\""
        correct: true
      - text: "\"\""
        correct: false
      - text: "\"Hello World\""
        correct: false
      - text: "\" World\""
        correct: false
    explanation: Command pattern. Each command encapsulates an action and its inverse. undo() pops the last command and calls its undo(), removing ' World'. ed.content is 'Hello'. The history stack enables unlimited undo/redo without the editor knowing how to reverse any specific action. Used in text editors, game engines, financial transaction logs, and any system requiring auditability or rollback.
    difficulty: senior
  - q: What pattern? Why does new code call processor.charge() instead of gateway.charge_card()?
    code: |-
      class ThirdPartyGateway:
          def charge_card(self, card_number: str, amount_cents: int) -> bool:
              ...

      class PaymentBridge:
          def __init__(self, gateway: ThirdPartyGateway):
              self._gw = gateway

          def charge(self, card: str, amount_usd: float) -> bool:
              return self._gw.charge_card(card, int(amount_usd * 100))

      processor = PaymentBridge(ThirdPartyGateway())
      result = processor.charge("4111...", 9.99)
    options:
      - text: Adapter -- translates the new interface (charge with dollars) to the legacy interface (charge_card with cents) so new code never depends on legacy field signatures
        correct: true
      - text: Facade -- simplifies a complex subsystem behind a single entry point
        correct: false
      - text: Proxy -- controls access to the gateway with added security
        correct: false
      - text: Decorator -- adds unit conversion on top of existing behavior
        correct: false
    explanation: Adapter pattern. New code depends only on PaymentBridge's interface. When the legacy gateway is replaced with a modern API, only the bridge changes -- callers are untouched. Different from Facade (which simplifies multiple subsystems) and Decorator (which adds behavior to the same interface). Used whenever integrating third-party libraries, legacy systems, or external APIs whose interfaces you do not control.
    difficulty: mid
  - q: What pattern? What does a subclass that only overrides render() guarantee?
    code: |-
      class ReportGenerator:
          def generate(self, data: dict) -> str:
              raw = self.fetch(data)
              processed = self.transform(raw)
              return self.render(processed)

          def transform(self, raw):
              return raw  # default: identity

          def fetch(self, data): raise NotImplementedError
          def render(self, data): raise NotImplementedError

      class CSVReport(ReportGenerator):
          def fetch(self, data): return data["rows"]
          def render(self, data):
              return "\n".join(",".join(str(c) for c in row) for row in data)

      class JSONReport(ReportGenerator):
          def fetch(self, data): return data
          def render(self, data):
              import json; return json.dumps(data)
    options:
      - text: Template Method -- the generate() sequence is fixed; the subclass fills in only the steps it needs to change, inheriting the rest
        correct: true
      - text: Strategy -- CSVReport and JSONReport are interchangeable strategies passed to generate()
        correct: false
      - text: Factory -- ReportGenerator instantiates the right subclass based on data type
        correct: false
      - text: Chain of Responsibility -- fetch, transform, and render pass data down the chain
        correct: false
    explanation: Template Method. generate() defines the invariant algorithm skeleton (fetch → transform → render). Subclasses override only the variant steps. A subclass overriding only render() gets the default identity transform and must provide fetch. The base class controls the flow; subclasses customize the parts. Used in Python's unittest (setUp/tearDown/test*), HTTP request handlers, and data pipelines where the processing sequence must stay consistent.
    difficulty: principal
---

# Design Patterns

Language-agnostic questions on GOF patterns using Python examples: Observer, Strategy, Factory, Singleton, Decorator, Command, Adapter, and Template Method.
