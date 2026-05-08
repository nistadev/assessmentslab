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
---
