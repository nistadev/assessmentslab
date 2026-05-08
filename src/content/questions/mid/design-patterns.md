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
---
