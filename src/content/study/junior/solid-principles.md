---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
lessons:
- title: Single Responsibility Principle keeps change local
  explanation: |
    Single Responsibility Principle says one module should have one reason to change.

    The useful question is not "does this class have one function?" The useful question is "what kind of future change will force me to edit this file?" If billing rules, email copy, invoice layout, and storage paths all force edits in the same class, unrelated work becomes coupled. Good SRP design keeps each reason to change near the people, policy, or system that owns it.

    Where to apply:
    Use SRP when one class or component is edited for different business reasons. A common example is checkout code that calculates totals, saves orders, sends email, renders invoices, and uploads files. Each part may change on a different schedule. Extracting collaborators lets checkout coordinate the work while pricing, email, invoice, and storage behavior change independently.

    Do not confuse with:
    SRP is not "every class must be tiny." A class can have several methods if they all serve the same reason to change. It is also not the same as DRY. Duplicated code may be ugly, but SRP is about mixing unrelated responsibilities. A coordinator can still call several services as long as it does not own their detailed rules.
  examples:
  - label: Mixed responsibilities
    description: OrderService owns persistence, notification, invoice rendering, and storage. Each concern changes for a different reason.
    code: |
      class OrderService:
          def place_order(self, cart):
              order = db.insert("orders", {"total": cart.total})
              email.send(cart.user.email, "Order confirmed")
              pdf = render_invoice(order)
              storage.upload(f"invoices/{order.id}.pdf", pdf)
              return order
  - label: Localized change
    description: The order service coordinates collaborators. Email, invoice, and storage behavior can change independently.
    code: |
      class OrderService:
          def __init__(self, orders, notifications, invoices):
              self.orders = orders
              self.notifications = notifications
              self.invoices = invoices

          def place_order(self, cart):
              order = self.orders.create(cart)
              self.notifications.send_confirmation(order)
              self.invoices.create_for(order)
              return order
  - label: Not a good SRP split
    description: Splitting one clear calculation into many tiny classes can make code harder to read without reducing real change risk.
    code: |
      class AddTaxStep:
          def run(self, subtotal):
              return subtotal * 1.2

      class RoundMoneyStep:
          def run(self, total):
              return round(total, 2)
  difficulty: junior
- title: Open/Closed Principle adds behavior without rewriting stable code
  explanation: |
    Open/Closed Principle says code should be open for extension but closed for modification.

    This does not mean you never edit existing files. It means stable decision-making code should not need a new branch every time the business adds a variant. If adding a payment method, discount type, shipping carrier, report format, or notification channel means changing the same if/else chain again and again, the design is telling you where OCP can help.

    Where to apply:
    Use OCP around repeated "type code" branching. A common example is discounts. At first, one if statement is fine. Later, marketing adds student, loyalty, seasonal, and first-order discounts. Editing the same function for every campaign makes regressions likely. Moving each discount rule behind the same interface lets new rules be added beside old rules.

    Do not confuse with:
    OCP is not "build a plugin system for every if statement." If there are only two cases and they rarely change, simple branching is clearer. OCP is also not a ban on refactoring. You may change existing code to create the extension point, then future changes become additive.
  examples:
  - label: Modification-heavy branching
    description: Every new discount type requires editing this function and retesting existing cases.
    code: |
      def apply_discount(order, discount_type):
          if discount_type == "student":
              return order.total * 0.9
          if discount_type == "loyalty":
              return order.total * 0.85
          if discount_type == "seasonal":
              return order.total * 0.8
          return order.total
  - label: Extension through strategy
    description: New discount rules are added as new classes or functions with the same contract.
    code: |
      class StudentDiscount:
          def apply(self, order):
              return order.total * 0.9

      class LoyaltyDiscount:
          def apply(self, order):
              return order.total * 0.85

      def checkout(order, discount_rule):
          total = discount_rule.apply(order)
          return charge_customer(order.customer, total)
  - label: Apply only after change pressure appears
    description: One simple branch is often cheaper than an abstraction. OCP becomes valuable when variants are expected to grow.
    code: |
      def delivery_fee(country):
          if country == "local":
              return 5
          return 15
  difficulty: junior
- title: Liskov Substitution Principle keeps contracts honest
  explanation: |
    Liskov Substitution Principle says a subtype must be usable anywhere its parent type is expected without breaking expected behavior.

    The important part is behavior, not names. If code accepts a PaymentMethod, then any card, wallet, or bank transfer implementation should follow the same promise. It should accept the same kind of input, return the same kind of result, and fail in expected ways. If callers need special checks such as "if this is BankTransfer, do something else," the contract is probably lying.

    Where to apply:
    Use LSP when you use inheritance or shared interfaces. A common example is refunds. If a CheckoutService depends on a RefundablePayment interface, every implementation must truly support refunds. A gift card that throws "refund not supported" violates the promise. Better design uses a smaller interface for charge-only methods or separates refundable payments from non-refundable payments.

    Do not confuse with:
    LSP is not "all child classes must have the same method names." Method names can match while behavior still violates the contract. It is also not a reason to force inheritance. If objects do not share a real behavioral promise, prefer separate interfaces or composition.
  examples:
  - label: Broken substitution
    description: GiftCardPayment claims to be refundable, but callers get a runtime surprise.
    code: |
      class RefundablePayment:
          def refund(self, payment_id, amount):
              raise NotImplementedError

      class CardPayment(RefundablePayment):
          def refund(self, payment_id, amount):
              return card_api.refund(payment_id, amount)

      class GiftCardPayment(RefundablePayment):
          def refund(self, payment_id, amount):
              raise Exception("Gift cards cannot be refunded")
  - label: Honest contract
    description: Charge-only and refundable behavior are modeled separately, so callers depend on the promise they need.
    code: |
      class PaymentMethod:
          def charge(self, order):
              raise NotImplementedError

      class RefundablePayment(PaymentMethod):
          def refund(self, payment_id, amount):
              raise NotImplementedError

      def issue_refund(payment: RefundablePayment, payment_id, amount):
          return payment.refund(payment_id, amount)
  - label: Easy smell to spot
    description: Type checks in caller code often reveal an interface that does not describe a reliable shared behavior.
    code: |
      if isinstance(payment, GiftCardPayment):
          show_support_message()
      else:
          payment.refund(payment_id, amount)
  difficulty: junior
- title: Interface Segregation Principle keeps clients from depending on unused methods
  explanation: |
    Interface Segregation Principle says clients should not be forced to depend on methods they do not use.

    A large interface looks convenient for the author, but it pushes extra obligations onto every implementer and extra knowledge onto every caller. When a class must implement fake methods, throw "not supported," or import dependencies it never needs, the interface is too wide.

    Where to apply:
    Use ISP around APIs, service interfaces, SDK wrappers, and UI component props. A common example is office devices. A basic printer can print but cannot scan or fax. If every device must implement print, scan, and fax, simple printers end up with fake methods. Split the contract into Printer, Scanner, and FaxMachine so each client asks only for the capability it uses.

    Do not confuse with:
    ISP is not SRP. SRP is about reasons a module changes. ISP is about what a consumer is forced to depend on. ISP also does not mean every method needs its own interface. Group methods that are used together by the same clients.
  examples:
  - label: Fat interface
    description: BasicPrinter must pretend to support scan and fax even though callers only need printing.
    code: |
      class OfficeMachine:
          def print(self, document):
              raise NotImplementedError

          def scan(self, document):
              raise NotImplementedError

          def fax(self, document):
              raise NotImplementedError

      class BasicPrinter(OfficeMachine):
          def print(self, document):
              printer_api.print(document)

          def scan(self, document):
              raise Exception("Scan not supported")

          def fax(self, document):
              raise Exception("Fax not supported")
  - label: Segregated interfaces
    description: Clients depend on the capability they need, and devices implement only real behavior.
    code: |
      class Printer:
          def print(self, document):
              raise NotImplementedError

      class Scanner:
          def scan(self, document):
              raise NotImplementedError

      class BasicPrinter(Printer):
          def print(self, document):
              printer_api.print(document)

      def print_report(printer: Printer, report):
          printer.print(report)
  - label: UI example
    description: A read-only table should not receive edit callbacks, save handlers, and validation props it never uses.
    code: |
      ReadOnlyTable(rows=rows)
      EditableTable(rows=rows, on_save=save_row, validate=validate_row)
  difficulty: junior
- title: Dependency Inversion makes high-level policy testable
  explanation: |
    Dependency Inversion Principle says high-level policy should depend on abstractions, not concrete infrastructure.

    High-level policy is the business decision: when to approve an order, whether a user can log in, or how to calculate eligibility. Low-level details are tools: PostgreSQL clients, queues, file systems, HTTP SDKs, email providers, and payment gateways. DIP protects important policy from details that change often or are hard to run in tests.

    Where to apply:
    Use DIP when business logic directly creates infrastructure objects. A common example is a user repository or order service that creates its own production database client. Tests then need a real database, and switching providers means editing business code. Instead, the high-level module says what it needs, production code passes a real adapter, and tests pass a fake adapter.

    Do not confuse with:
    DIP is not the same as dependency injection frameworks. Constructor parameters can be enough. DIP is also not "depend on an interface for everything." Use it where concrete details are volatile, slow, external, or difficult to test. A stable standard-library value object does not need an abstraction.
  examples:
  - label: Concrete dependency
    description: UserRepository creates its own database client, so tests and production must use the same low-level dependency.
    code: |
      class UserRepository:
          def __init__(self):
              self.db = PostgreSQLDatabase("prod-db")

          def find_by_id(self, user_id):
              return self.db.query("select * from users where id = %s", [user_id])
  - label: Abstraction boundary
    description: The repository accepts any object with the needed query behavior.
    code: |
      class UserRepository:
          def __init__(self, db):
              self.db = db

          def find_by_id(self, user_id):
              return self.db.query("select * from users where id = %s", [user_id])

      repo = UserRepository(PostgreSQLDatabase("prod-db"))
      test_repo = UserRepository(FakeDatabase(rows=[{"id": 1}]))
  - label: Not worth abstracting
    description: Wrapping a stable language feature with a new interface adds ceremony without reducing useful risk.
    code: |
      class StringLengthProvider:
          def length(self, value):
              return len(value)
  difficulty: junior
---
