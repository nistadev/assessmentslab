---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
questions:
- q: What principle is violated and what is the correct fix?
  code: "from abc import ABC, abstractmethod\n\nclass Vehicle(ABC):\n    @abstractmethod\n    def start_engine(self): ...\n\
    \    @abstractmethod\n    def refuel(self): ...\n    @abstractmethod\n    def charge_battery(self): ...\n\nclass GasCar(Vehicle):\n\
    \    def start_engine(self): print(\"vroom\")\n    def refuel(self): print(\"filling tank\")\n    def charge_battery(self):\
    \ raise NotImplementedError\n\nclass ElectricCar(Vehicle):\n    def start_engine(self): print(\"silent start\")\n    def\
    \ refuel(self): raise NotImplementedError\n    def charge_battery(self): print(\"charging\")"
  options:
  - text: Interface Segregation Principle (ISP)
    correct: true
  - text: Liskov Substitution Principle (LSP)
    correct: false
  - text: Open/Closed Principle (OCP)
    correct: false
  - text: Single Responsibility Principle (SRP)
    correct: false
  explanation: 'Interface Segregation Principle: clients should not depend on methods they don''t use. Vehicle forces all
    subclasses to implement all energy methods. Fix: class Startable(ABC): start_engine() / class Refuelable(ABC): refuel()
    / class Chargeable(ABC): charge_battery(). GasCar(Startable, Refuelable), ElectricCar(Startable, Chargeable). HybridCar(Startable,
    Refuelable, Chargeable). No class carries NotImplementedError dead weight.'
  difficulty: senior
- q: What principle does this enable and what is the concrete testing benefit?
  code: "from abc import ABC, abstractmethod\n\nclass NotificationSender(ABC):\n    @abstractmethod\n    def send(self, to:\
    \ str, message: str) -> None: ...\n\nclass OrderService:\n    def __init__(self, sender: NotificationSender):\n      \
    \  self._sender = sender\n\n    def place_order(self, order):\n        # ... process order ...\n        self._sender.send(order.email,\
    \ f\"Order {order.id} confirmed\")\n\nclass EmailSender(NotificationSender):\n    def send(self, to, message): ...  #\
    \ real SMTP\n\nclass MockSender(NotificationSender):\n    def __init__(self): self.sent = []\n    def send(self, to, message):\
    \ self.sent.append((to, message))"
  options:
  - text: Dependency Inversion Principle (DIP)
    correct: true
  - text: Single Responsibility Principle (SRP)
    correct: false
  - text: Interface Segregation Principle (ISP)
    correct: false
  - text: Open/Closed Principle (OCP)
    correct: false
  explanation: 'Dependency Inversion Principle. The high-level policy (OrderService) depends on the abstraction (NotificationSender),
    not on EmailSender directly. In tests: sender = MockSender(); service = OrderService(sender); service.place_order(order);
    assert sender.sent == [(order.email, ...)]. No SMTP connection, no external side effects. In production: inject EmailSender.
    Swapping to SMSSender or SlackSender requires zero changes to OrderService. Foundation of every testable architecture.'
  difficulty: senior
---
