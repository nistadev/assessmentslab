---
defaultDomains:
  - computer-science
defaultTopics:
  - solid-principles
questions:
  - q: Three separate teams own email, invoice, and storage. What principle is violated and what is the consequence?
    code: |-
      class OrderService:
          def place_order(self, cart):
              total = sum(item.price for item in cart.items)
              order = db.insert("orders", {"total": total})
              email.send(cart.user.email, f"Order #{order.id} confirmed")
              pdf = render_invoice(order)
              storage.upload(f"invoices/{order.id}.pdf", pdf)
              return order
    options:
      - text: SRP -- four responsibilities in one class mean any team must edit this file, causing merge conflicts and regression risk across unrelated concerns
        correct: true
      - text: DRY -- total is computed in multiple places
        correct: false
      - text: No violation -- service classes should orchestrate end-to-end flows
        correct: false
      - text: OCP -- adding a new order type requires modifying this class
        correct: false
    explanation: "Single Responsibility Principle. OrderService handles order persistence, email delivery, invoice generation, and file storage. Each team touching their concern risks breaking the others. Fix: extract EmailService, InvoiceService, StorageService. OrderService becomes a thin orchestrator. Rule of thumb: if more than one team must edit this file for unrelated reasons, it violates SRP."
    difficulty: junior
  - q: Adding Pentagon requires modifying this function. What principle is violated and what is the correct fix?
    code: |-
      def calculate_area(shape: dict) -> float:
          if shape["type"] == "circle":
              return 3.14159 * shape["radius"] ** 2
          elif shape["type"] == "rectangle":
              return shape["width"] * shape["height"]
          elif shape["type"] == "triangle":
              return 0.5 * shape["base"] * shape["height"]
          raise ValueError("unknown shape")
    options:
      - text: OCP -- fix by defining a Shape protocol with area(); each shape implements it; calculate_area(s) becomes s.area()
        correct: true
      - text: SRP -- split into calculate_circle_area, calculate_rectangle_area, etc.
        correct: false
      - text: No violation -- extending the elif chain is the standard approach
        correct: false
      - text: DIP -- the function should receive an abstract Shape, not a dict
        correct: false
    explanation: "Open/Closed Principle: open for extension, closed for modification. Every new shape requires editing calculate_area, risking regressions on existing shapes. Fix: use a Protocol or ABC with area() → each shape class implements it → new shapes add a class, not a branch. The function shrinks to one line: return shape.area(). Python's typing.Protocol enables structural subtyping without inheritance."
    difficulty: mid
  - q: What happens? What principle is violated and why?
    code: |-
      class Bird:
          def fly(self) -> str:
              return "flying"

      class Penguin(Bird):
          def fly(self) -> str:
              raise NotImplementedError("Penguins cannot fly")

      def release(bird: Bird) -> str:
          return bird.fly()

      release(Penguin())
    options:
      - text: Raises NotImplementedError -- LSP violated because Penguin cannot substitute Bird without changing caller behavior
        correct: true
      - text: Returns 'flying' -- Penguin inherits the method
        correct: false
      - text: SRP violated -- Bird should not have a fly() method
        correct: false
      - text: No violation -- NotImplementedError is a valid override
        correct: false
    explanation: "Liskov Substitution Principle: a subtype must be usable wherever its base type is expected, without breaking callers. Penguin breaks the Bird contract. Fix: model the hierarchy around capabilities -- FlyingBird(Bird) has fly(), Penguin(Bird) does not inherit fly() at all. LSP violations often appear when inheritance is used for code reuse rather than true is-a relationships. Classic example from Barbara Liskov's 1987 paper."
    difficulty: mid
  - q: What principle is violated and what is the correct fix?
    code: |-
      from abc import ABC, abstractmethod

      class Vehicle(ABC):
          @abstractmethod
          def start_engine(self): ...
          @abstractmethod
          def refuel(self): ...
          @abstractmethod
          def charge_battery(self): ...

      class GasCar(Vehicle):
          def start_engine(self): print("vroom")
          def refuel(self): print("filling tank")
          def charge_battery(self): raise NotImplementedError

      class ElectricCar(Vehicle):
          def start_engine(self): print("silent start")
          def refuel(self): raise NotImplementedError
          def charge_battery(self): print("charging")
    options:
      - text: ISP -- split Vehicle into Startable, Refuelable, Chargeable; classes implement only the interfaces they support
        correct: true
      - text: LSP -- GasCar and ElectricCar are not substitutable for Vehicle
        correct: false
      - text: OCP -- adding HybridCar requires modifying Vehicle
        correct: false
      - text: SRP -- Vehicle has too many responsibilities
        correct: false
    explanation: "Interface Segregation Principle: clients should not depend on methods they don't use. Vehicle forces all subclasses to implement all energy methods. Fix: class Startable(ABC): start_engine() / class Refuelable(ABC): refuel() / class Chargeable(ABC): charge_battery(). GasCar(Startable, Refuelable), ElectricCar(Startable, Chargeable). HybridCar(Startable, Refuelable, Chargeable). No class carries NotImplementedError dead weight."
    difficulty: senior
  - q: What principle is violated? What is the fix?
    code: |-
      class UserRepository:
          def __init__(self):
              self._db = PostgreSQLDatabase(host="prod-db", port=5432)

          def find_by_id(self, user_id: int) -> dict:
              return self._db.query(
                  f"SELECT * FROM users WHERE id = {user_id}"
              )
    options:
      - text: DIP -- UserRepository is hard-wired to PostgreSQL; inject a database abstraction so any compatible DB or mock can substitute
        correct: true
      - text: SRP -- the repository both queries and manages the connection
        correct: false
      - text: LSP -- PostgreSQLDatabase cannot be substituted
        correct: false
      - text: OCP -- adding a new query requires modifying UserRepository
        correct: false
    explanation: "Dependency Inversion Principle: high-level modules should not depend on low-level modules; both should depend on abstractions. Fix: define class Database(ABC): def query(self, sql: str) -> list ... then UserRepository(db: Database). PostgreSQLDatabase and MockDatabase both implement Database. UserRepository becomes independently testable -- pass MockDatabase in tests, PostgreSQLDatabase in production. Also makes switching databases a one-line change."
    difficulty: junior
  - q: What is the key production benefit of the refactor?
    code: |-
      # Before
      class ReportService:
          def generate(self, data): ...      # builds report structure
          def export_pdf(self, report): ...  # renders to PDF
          def export_csv(self, report): ...  # renders to CSV
          def email_report(self, pdf, to): ...  # sends email
          def archive(self, pdf, path): ...  # writes to disk

      # After
      class ReportBuilder:
          def generate(self, data): ...

      class PDFExporter:
          def export(self, report): ...

      class CSVExporter:
          def export(self, report): ...

      class ReportMailer:
          def send(self, pdf, to): ...

      class ReportArchiver:
          def archive(self, pdf, path): ...
    options:
      - text: Each class can be changed, tested, and deployed independently -- a bug in PDFExporter cannot break email delivery or CSV export
        correct: true
      - text: Fewer total lines of code
        correct: false
      - text: Python requires one class per file
        correct: false
      - text: It prevents OCP violations by removing the original class
        correct: false
    explanation: "SRP applied. ReportService was a change magnet: adding a new export format, changing the email provider, and fixing an archive bug all required touching the same class. After: each class has one reason to change. Test PDFExporter independently with a mock report. Swap ReportMailer with SESMailer without touching CSVExporter. Deploy PDFExporter fix without risk to email or archive logic. This is SRP's production payoff: isolated blast radius."
    difficulty: mid
  - q: What principle does this enable and what is the concrete testing benefit?
    code: |-
      from abc import ABC, abstractmethod

      class NotificationSender(ABC):
          @abstractmethod
          def send(self, to: str, message: str) -> None: ...

      class OrderService:
          def __init__(self, sender: NotificationSender):
              self._sender = sender

          def place_order(self, order):
              # ... process order ...
              self._sender.send(order.email, f"Order {order.id} confirmed")

      class EmailSender(NotificationSender):
          def send(self, to, message): ...  # real SMTP

      class MockSender(NotificationSender):
          def __init__(self): self.sent = []
          def send(self, to, message): self.sent.append((to, message))
    options:
      - text: DIP -- OrderService depends on the abstraction; tests inject MockSender to assert behavior without sending real emails
        correct: true
      - text: SRP -- OrderService has one job
        correct: false
      - text: ISP -- NotificationSender has a single method
        correct: false
      - text: OCP -- OrderService cannot be modified
        correct: false
    explanation: "Dependency Inversion Principle. The high-level policy (OrderService) depends on the abstraction (NotificationSender), not on EmailSender directly. In tests: sender = MockSender(); service = OrderService(sender); service.place_order(order); assert sender.sent == [(order.email, ...)]. No SMTP connection, no external side effects. In production: inject EmailSender. Swapping to SMSSender or SlackSender requires zero changes to OrderService. Foundation of every testable architecture."
    difficulty: senior
  - q: How does this compare to an if/elif chain and what principle does it embody?
    code: |-
      DISCOUNT_RULES = {
          "premium":  lambda total: total * 0.20,
          "bulk":     lambda total: total * 0.10,
          "employee": lambda total: total * 0.30,
      }

      def apply_discount(order_type: str, total: float) -> float:
          rule = DISCOUNT_RULES.get(order_type)
          return rule(total) if rule else 0.0

      # Adding a "vip" discount:
      DISCOUNT_RULES["vip"] = lambda total: total * 0.25
    options:
      - text: OCP -- a new discount type adds one dict entry; apply_discount never changes and existing rules cannot be accidentally broken
        correct: true
      - text: DRY -- avoids repeating the lambda pattern
        correct: false
      - text: Strategy -- each lambda is a strategy passed to apply_discount
        correct: false
      - text: No difference -- dict lookup and elif are equivalent
        correct: false
    explanation: "Open/Closed Principle. The if/elif version requires modifying apply_discount for each new type -- risky when other discount types exist in the same function. The dict version is closed to modification: apply_discount has never changed after three new types were added. DISCOUNT_RULES is open to extension: new entries slot in without touching existing rules. This is the registration pattern -- the same technique used by Python's codecs, Django's URL router, and Flask's blueprint system."
    difficulty: principal
---

# SOLID Principles

Language-agnostic questions on SRP, OCP, LSP, ISP, and DIP using Python examples.
