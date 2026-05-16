---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
questions:
- q: Three separate teams own email, invoice, and storage. What principle is violated and what is the consequence?
  code: "class OrderService:\n    def place_order(self, cart):\n        total = sum(item.price for item in cart.items)\n \
    \       order = db.insert(\"orders\", {\"total\": total})\n        email.send(cart.user.email, f\"Order #{order.id} confirmed\"\
    )\n        pdf = render_invoice(order)\n        storage.upload(f\"invoices/{order.id}.pdf\", pdf)\n        return order"
  options:
  - text: Single Responsibility Principle (SRP)
    correct: true
  - text: Don't Repeat Yourself (DRY)
    correct: false
  - text: No violation
    correct: false
  - text: Open/Closed Principle (OCP)
    correct: false
  explanation: 'Single Responsibility Principle. OrderService handles order persistence, email delivery, invoice generation,
    and file storage. Each team touching their concern risks breaking the others. Fix: extract EmailService, InvoiceService,
    StorageService. OrderService becomes a thin orchestrator. Rule of thumb: if more than one team must edit this file for
    unrelated reasons, it violates SRP.'
  difficulty: junior
- q: What principle is violated? What is the fix?
  code: "class UserRepository:\n    def __init__(self):\n        self._db = PostgreSQLDatabase(host=\"prod-db\", port=5432)\n\
    \n    def find_by_id(self, user_id: int) -> dict:\n        return self._db.query(\n            f\"SELECT * FROM users\
    \ WHERE id = {user_id}\"\n        )"
  options:
  - text: Dependency Inversion Principle (DIP)
    correct: true
  - text: Single Responsibility Principle (SRP)
    correct: false
  - text: Liskov Substitution Principle (LSP)
    correct: false
  - text: Open/Closed Principle (OCP)
    correct: false
  explanation: 'Dependency Inversion Principle: high-level modules should not depend on low-level modules; both should depend
    on abstractions. Fix: define class Database(ABC): def query(self, sql: str) -> list ... then UserRepository(db: Database).
    PostgreSQLDatabase and MockDatabase both implement Database. UserRepository becomes independently testable -- pass MockDatabase
    in tests, PostgreSQLDatabase in production. Also makes switching databases a one-line change.'
  difficulty: junior
- q: |
    CheckoutService calculates totals, saves orders, sends receipts, renders invoices, and uploads files.
    Which principle is most directly violated?
  options:
  - text: "Single Responsibility Principle (SRP)"
    correct: true
  - text: "Open/Closed Principle (OCP), because new order variants may require editing checkout"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because checkout calls concrete database, email, and storage tools"
    correct: false
  - text: "Interface Segregation Principle (ISP), because clients may depend on checkout operations they do not need"
    correct: false
  explanation: "SRP is about reasons to change, not number of methods. Pricing, persistence, email copy, invoice layout, and file storage can change for different business reasons. The service should coordinate smaller collaborators instead of owning every detail."
  difficulty: junior
- q: |
    Which refactor best applies SRP to this service?
  code: |
    class CheckoutService:
        def checkout(self, cart):
            total = calculate_total(cart)
            order = db.save(cart, total)
            email.send(order.user, "Order confirmed")
            invoice_pdf = render_invoice(order)
            storage.upload(invoice_pdf)
            return order
  options:
  - text: "Extract order storage, notification, invoice, and storage collaborators"
    correct: true
  - text: "Register each checkout step in a plugin map so new order steps are only added to the registry"
    correct: false
  - text: "Inject db, email, and storage clients but keep all pricing, messaging, and invoice rules in checkout"
    correct: false
  - text: "Split checkout into ReadOnlyCheckout and EditableCheckout interfaces for different UI clients"
    correct: false
  explanation: "Good SRP extraction follows real change reasons. Storage, notifications, invoice rendering, and file upload can change independently. A coordinator may still call multiple collaborators without owning their rules."
  difficulty: junior
- q: |
    A MoneyCalculator has add_tax, apply_coupon, and round_total. The pricing team owns all three rules and they change together.
    Is this automatically an SRP violation?
  options:
  - text: "No, several methods can still share one reason to change"
    correct: true
  - text: "Yes, tax, coupons, and rounding should be separate classes when each rule has a different owner"
    correct: false
  - text: "Yes, because adding a new coupon type should be done through an OCP strategy instead"
    correct: false
  - text: "No, but only because constructor injection would make any mixed pricing rules acceptable"
    correct: false
  explanation: "SRP does not mean every class must be tiny. A class can have several methods when they all serve the same policy and change for the same reason."
  difficulty: junior
- q: |
    Which situation is the clearest SRP smell?
  options:
  - text: "One file is edited by billing, email, reporting, and storage teams for unrelated changes"
    correct: true
  - text: "A discount function gets a new branch for every new campaign"
    correct: false
  - text: "Callers check for GiftCardPayment before calling refund"
    correct: false
  - text: "A repository creates its own PostgreSQL client instead of accepting a database dependency"
    correct: false
  explanation: "SRP asks what kind of future change forces edits. Multiple unrelated owners changing one file is a strong sign that responsibilities are mixed."
  difficulty: junior
- q: |
    Every new discount type requires adding another branch to this function. Which principle points to a better design?
  code: |
    def apply_discount(order, discount_type):
        if discount_type == "student":
            return order.total * 0.9
        if discount_type == "loyalty":
            return order.total * 0.85
        if discount_type == "seasonal":
            return order.total * 0.8
        return order.total
  options:
  - text: "Open/Closed Principle (OCP)"
    correct: true
  - text: "Single Responsibility Principle (SRP), because pricing and charging should be owned separately"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because checkout should depend on a discount abstraction"
    correct: false
  - text: "Liskov Substitution Principle (LSP), because each discount implementation must preserve the same result shape"
    correct: false
  explanation: "OCP says stable decision code should be open for extension but closed for modification. Repeated type-code branching is a good place to add a shared discount contract or strategy."
  difficulty: junior
- q: |
    What is the main benefit of passing a discount_rule with an apply method into checkout?
  code: |
    def checkout(order, discount_rule):
        total = discount_rule.apply(order)
        return charge_customer(order.customer, total)
  options:
  - text: "New discount rules can be added without rewriting checkout"
    correct: true
  - text: "Checkout no longer depends directly on one concrete discount implementation"
    correct: false
  - text: "Each discount rule can own its own calculation reason to change"
    correct: false
  - text: "Callers can depend on a smaller checkout interface with fewer unused methods"
    correct: false
  explanation: "The checkout function depends on a stable contract. New rules can be added beside existing rules as long as they implement apply."
  difficulty: junior
- q: |
    There are only two delivery fee cases and the rule almost never changes. What is the most pragmatic junior-level choice?
  code: |
    def delivery_fee(country):
        if country == "local":
            return 5
        return 15
  options:
  - text: "Keep the simple branch until real change pressure appears"
    correct: true
  - text: "Introduce a ShippingFeeStrategy interface now because future countries might need separate behavior"
    correct: false
  - text: "Inject a DeliveryFeeProvider so the function no longer chooses a concrete implementation"
    correct: false
  - text: "Split local and international fees into two modules because each branch could become a reason to change"
    correct: false
  explanation: "OCP is not a ban on simple branching. Abstractions pay off when variants are expected to grow or when the same decision point keeps changing."
  difficulty: junior
- q: |
    Which change best follows OCP?
  options:
  - text: "Add a new ShippingCarrier class that implements the same calculate_fee contract"
    correct: true
  - text: "Inject the current shipping API client into the long shipping function"
    correct: false
  - text: "Split the public shipping interface into ShippingReader and ShippingWriter"
    correct: false
  - text: "Move all carrier-specific branches into one renamed ShippingManager"
    correct: false
  explanation: "OCP favors additive changes around stable contracts. A new carrier can be added as a new implementation instead of editing a growing branch chain."
  difficulty: junior
- q: |
    What is wrong with this inheritance design?
  code: |
    class RefundablePayment:
        def refund(self, payment_id, amount):
            raise NotImplementedError

    class GiftCardPayment(RefundablePayment):
        def refund(self, payment_id, amount):
            raise Exception("Gift cards cannot be refunded")
  options:
  - text: "GiftCardPayment breaks the RefundablePayment contract"
    correct: true
  - text: "GiftCardPayment should be moved into a separate payment module to isolate its reason to change"
    correct: false
  - text: "Refund behavior should be selected through a registry so new payment methods are additive"
    correct: false
  - text: "Payment code should depend on an injected payment gateway instead of a concrete gateway"
    correct: false
  explanation: "LSP is about behavior, not matching method names. If callers accept RefundablePayment, each implementation must actually support refund in the expected way."
  difficulty: junior
- q: |
    A caller receives a PaymentMethod but must check if it is GiftCardPayment before calling refund.
    What does this usually reveal?
  options:
  - text: "The shared contract is probably too broad or dishonest"
    correct: true
  - text: "The caller should depend on a smaller read-only payment interface"
    correct: false
  - text: "The payment module mixes charging and refunding responsibilities"
    correct: false
  - text: "The payment provider should be injected through a gateway port"
    correct: false
  explanation: "Special type checks in caller code often reveal an LSP problem. The caller cannot trust the parent type or interface to describe behavior correctly."
  difficulty: junior
- q: |
    Which interface split best avoids an LSP violation for payments?
  options:
  - text: "PaymentMethod for charge behavior and RefundablePayment only for payments that can refund"
    correct: true
  - text: "PaymentMethod with charge and refund, plus caller checks for non-refundable implementations"
    correct: false
  - text: "A payment strategy registry where every strategy exposes the same refund method"
    correct: false
  - text: "An injected PaymentGateway that still makes every payment type promise refund"
    correct: false
  explanation: "Model the promise callers need. Charge-only payments should not pretend to be refundable. Refund callers can depend on RefundablePayment and avoid runtime surprises."
  difficulty: junior
- q: |
    BasicPrinter must implement scan and fax by raising errors, even though it can only print. Which principle is violated?
  code: |
    class OfficeMachine:
        def print(self, document): ...
        def scan(self, document): ...
        def fax(self, document): ...

    class BasicPrinter(OfficeMachine):
        def print(self, document): printer_api.print(document)
        def scan(self, document): raise Exception("Scan not supported")
        def fax(self, document): raise Exception("Fax not supported")
  options:
  - text: "Interface Segregation Principle (ISP)"
    correct: true
  - text: "Liskov Substitution Principle (LSP), because BasicPrinter cannot safely replace a full OfficeMachine"
    correct: false
  - text: "Open/Closed Principle (OCP), because new device capabilities should be additive"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because callers should depend on device abstractions"
    correct: false
  explanation: "ISP says clients should not depend on methods they do not use. A basic printer should implement a Printer capability, not fake scanner and fax behavior."
  difficulty: junior
- q: |
    Which design best follows ISP for office devices?
  options:
  - text: "Split Printer, Scanner, and FaxMachine into separate capabilities"
    correct: true
  - text: "Keep OfficeMachine but make unsupported methods return a typed NotSupported result"
    correct: false
  - text: "Use a device registry so new devices can be added without editing printing code"
    correct: false
  - text: "Inject an OfficeMachine dependency into every client instead of constructing it directly"
    correct: false
  explanation: "Interfaces should match capabilities clients actually need. Separate small contracts let each device implement only real behavior."
  difficulty: junior
- q: |
    A read-only table component receives on_save, validate, and edit_mode props it never uses.
    Which SOLID principle is most relevant?
  options:
  - text: "Interface Segregation Principle (ISP)"
    correct: true
  - text: "Single Responsibility Principle (SRP), because read and edit behavior may change for different owners"
    correct: false
  - text: "Open/Closed Principle (OCP), because editable behavior should be added through variants"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because the table should depend on callback abstractions"
    correct: false
  explanation: "ISP applies to component props too. A read-only component should not depend on editing callbacks or validation rules it never uses."
  difficulty: junior
- q: |
    UserRepository creates its own production database client. Why is this hard to test?
  code: |
    class UserRepository:
        def __init__(self):
            self.db = PostgreSQLDatabase("prod-db")

        def find_by_id(self, user_id):
            return self.db.query("select * from users where id = %s", [user_id])
  options:
  - text: "Tests are forced toward the real low-level database dependency"
    correct: true
  - text: "New database providers cannot be added without editing the repository"
    correct: false
  - text: "The repository mixes read and write methods in one client-facing interface"
    correct: false
  - text: "PostgreSQLDatabase may not substitute for a fake database with the same behavior"
    correct: false
  explanation: "DIP says high-level policy should depend on abstractions, not concrete infrastructure. If the repository creates PostgreSQLDatabase itself, tests cannot easily pass a fake database."
  difficulty: junior
- q: |
    Which change best applies DIP?
  code: |
    class UserRepository:
        def __init__(self, db):
            self.db = db

        def find_by_id(self, user_id):
            return self.db.query("select * from users where id = %s", [user_id])
  options:
  - text: "Pass the database dependency in, so production can use PostgreSQL and tests can use FakeDatabase"
    correct: true
  - text: "Add a repository registry so new database engines can register themselves"
    correct: false
  - text: "Split the repository into UserReader and UserWriter interfaces but still create PostgreSQL inside both"
    correct: false
  - text: "Keep PostgreSQLDatabase hard-coded but add a MockDatabase class with the same methods"
    correct: false
  explanation: "Constructor injection is enough here. The high-level repository code asks for query behavior, while production and test code choose the concrete adapter."
  difficulty: junior
- q: |
    Which dependency is usually worth abstracting behind a boundary?
  options:
  - text: "An external payment gateway that is slow, volatile, and hard to run in tests"
    correct: true
  - text: "A pure pricing formula owned by one team and tested without I/O"
    correct: false
  - text: "A two-case branch that has not changed in several releases"
    correct: false
  - text: "A small interface used only to avoid importing one stable value object"
    correct: false
  explanation: "DIP is useful when concrete details are external, volatile, slow, or difficult to test. Wrapping stable language features adds ceremony without reducing meaningful risk."
  difficulty: junior
- q: |
    Dependency Inversion Principle is not the same as which idea?
  options:
  - text: "A dependency injection framework is required for every dependency"
    correct: true
  - text: "A constructor parameter can pass the dependency a policy needs"
    correct: false
  - text: "High-level policy should describe needed behavior in business terms"
    correct: false
  - text: "Tests can pass fake adapters while production passes real adapters"
    correct: false
  explanation: "DIP is about dependency direction. A framework is optional. Passing dependencies through constructors or function parameters often gives the same boundary with less ceremony."
  difficulty: junior
---
