---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
lessons:
- title: Single Responsibility Principle keeps change local
  explanation: |
    Single Responsibility Principle says one module should have one reason to change.

    "Responsibility" means an axis of change, not one tiny function. If billing rules, email templates, and storage paths all force edits in the same class, unrelated work becomes coupled. Good SRP design lets each concern evolve without dragging neighboring behavior into the same review.
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
  difficulty: junior
- title: Dependency Inversion makes high-level policy testable
  explanation: |
    Dependency Inversion Principle says high-level policy should depend on abstractions, not concrete infrastructure.

    The rule protects business code from details such as PostgreSQL clients, queues, file systems, or HTTP SDKs. The high-level module describes what it needs. Production code supplies a real adapter. Tests supply a fake adapter.
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
  difficulty: junior
---
