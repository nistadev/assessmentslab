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
---
