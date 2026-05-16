---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
lessons:
- title: SRP keeps transactions and policies from blurring
  explanation: |
    At senior level, Single Responsibility Principle is about controlling blast radius inside workflows that touch state, policy, and external effects.

    A service often needs to coordinate several things in one use case. Coordination is not automatically an SRP violation. The violation appears when the same module owns policy details, persistence rules, transaction shape, message publishing, retry behavior, and presentation formatting. Those concerns change for different reasons and need different tests.

    Where to apply:
    Use SRP to separate domain policy from application orchestration and infrastructure effects. Domain policy should be testable without a database or network. Application orchestration can own ordering and transaction boundaries. Infrastructure adapters own SQL, HTTP, queue, and file details.

    Do not confuse with:
    SRP does not require every use case to be event-driven or split across services. A single transaction script may be correct if the workflow is small and cohesive. The goal is not maximum decomposition. The goal is clear ownership of change.
  examples:
  - label: Policy and effects tangled
    description: Eligibility, SQL, and queue publishing are locked together in one method.
    code: |
      class PromotionService:
          def apply(self, customer_id, code):
              customer = db.query("select * from customers where id = %s", [customer_id])
              if customer["tier"] != "gold" or customer["orders"] < 5:
                  raise Exception("not eligible")
              db.execute("update customers set discount = %s", [code])
              queue.publish("promotion_applied", customer_id)
  - label: Separate policy from orchestration
    description: Eligibility can be tested without database setup, while the use case owns transaction and publishing order.
    code: |
      class PromotionPolicy:
          def can_apply(self, customer):
              return customer.tier == "gold" and customer.orders >= 5

      class ApplyPromotion:
          def __init__(self, customers, policy, events):
              self.customers = customers
              self.policy = policy
              self.events = events

          def run(self, customer_id, code):
              customer = self.customers.get(customer_id)
              if not self.policy.can_apply(customer):
                  raise Exception("not eligible")
              self.customers.apply_discount(customer_id, code)
              self.events.publish("promotion_applied", customer_id)
  - label: Keep orchestration visible
    description: Over-splitting one transaction into hidden callbacks can make ordering and rollback behavior harder to reason about.
    code: |
      def run(self, customer_id, code):
          customer = self.customers.get(customer_id)
          self.policy.require_eligible(customer)
          self.customers.apply_discount(customer_id, code)
          self.events.publish("promotion_applied", customer_id)
  difficulty: senior
- title: OCP needs stable extension contracts
  explanation: |
    At senior level, Open/Closed Principle is about designing extension points that can survive real production use.

    A registry or strategy interface only helps if the contract is stable and specific. If every new strategy needs extra context, special ordering, custom error handling, and hidden side effects, the extension point is too weak. OCP is not only about avoiding edits. It is about making future additions safe, testable, and predictable.

    Where to apply:
    Use OCP for plugin-like variation where new implementations should ship without retesting the whole core. Define input shape, output shape, allowed side effects, error semantics, ordering rules, and default behavior. Add contract tests so every implementation proves it follows the extension contract.

    Do not confuse with:
    OCP does not mean the extension contract never changes. It means contract changes are deliberate and versioned. Sometimes the correct senior decision is to modify the core because the old abstraction no longer describes the problem.
  examples:
  - label: Leaky extension point
    description: Each rule wants different context, so callers keep adding special cases.
    code: |
      def apply_rule(order, rule):
          if rule.name == "geo":
              return rule.apply(order, geo_api)
          if rule.name == "loyalty":
              return rule.apply(order, loyalty_client)
          return rule.apply(order)
  - label: Stable rule context
    description: The extension contract defines what every rule may use and what it must return.
    code: |
      class DiscountContext:
          def __init__(self, order, customer, market):
              self.order = order
              self.customer = customer
              self.market = market

      class DiscountRule:
          def apply(self, context):
              ...

      def calculate_discount(context, rules):
          return sum(rule.apply(context) for rule in rules)
  - label: Contract test
    description: Every rule can be tested against the same behavioral expectations.
    code: |
      def assert_discount_rule_contract(rule):
          result = rule.apply(sample_context())
          assert result.amount >= 0
          assert result.currency == "EUR"
  difficulty: senior
- title: LSP failures show up as broken invariants
  explanation: |
    At senior level, Liskov Substitution Principle is about invariants across implementations, not class diagrams.

    Callers build assumptions from an interface. They assume a repository returns the saved entity, a clock moves forward, a cache miss returns None, a payment charge is either accepted or clearly failed, and a stream read advances position. A subtype that breaks those assumptions can pass type checks and still break the system.

    Where to apply:
    Use LSP when multiple implementations exist behind a port or protocol. Define invariants in tests and documentation. Run the same contract tests against in-memory fakes, database adapters, API adapters, and alternative providers. Your fake must obey the same behavior as production or tests become misleading.

    Do not confuse with:
    LSP is not only an inheritance problem. It applies to duck typing, protocols, adapters, and mocks. Any object passed through the same interface must preserve the caller's behavioral expectations.
  examples:
  - label: Fake violates production contract
    description: Tests pass because the fake allows duplicate emails, but production rejects them.
    code: |
      class FakeUserRepository:
          def __init__(self):
              self.users = []

          def save(self, user):
              self.users.append(user)
              return user
  - label: Contract enforced across implementations
    description: The same test protects fake and SQL repositories from drifting apart.
    code: |
      def assert_user_repository_contract(repo):
          repo.save(User(email="ana@example.com"))

          try:
              repo.save(User(email="ana@example.com"))
              assert False
          except DuplicateEmail:
              pass
  - label: Caller should not compensate
    description: Special casing one implementation means the shared contract is not honest.
    code: |
      if isinstance(repo, FakeUserRepository):
          repo.clear_duplicates()
      user = repo.save(user)
  difficulty: senior
- title: ISP protects API consumers from churn
  explanation: |
    At senior level, Interface Segregation Principle is about reducing dependency churn across modules and services.

    A large interface becomes an unstable contract. Every added method can force new mocks, new imports, new permissions, and wider deployment coordination. Smaller consumer-facing contracts let each client depend on the role it uses, while the provider can still have a richer internal implementation.

    Where to apply:
    Use ISP when shared SDKs, service clients, repositories, or application services are used by many flows. Split read, write, admin, reporting, billing, and audit capabilities when they change independently. Pair small interfaces with clear adapters or façades so call sites stay readable.

    Do not confuse with:
    ISP is not a reason to expose internal tables or implementation details. The interface should still describe a business capability. "OrderReader" is better than "OrdersTableSelectQueryRunner" because consumers should not inherit storage concerns.
  examples:
  - label: Mega client
    description: A read-only report imports a client that can mutate orders, issue refunds, and change shipping.
    code: |
      class OrderClient:
          def get_order(self, order_id): ...
          def cancel_order(self, order_id): ...
          def issue_refund(self, order_id): ...
          def change_shipping(self, order_id, address): ...
          def export_tax_report(self, month): ...
  - label: Capability clients
    description: Each consumer depends on the narrow capability it needs.
    code: |
      class OrderReader:
          def get_order(self, order_id): ...

      class RefundIssuer:
          def issue_refund(self, order_id): ...

      class TaxReporter:
          def export_tax_report(self, month): ...

      def render_order_summary(orders: OrderReader, order_id):
          return orders.get_order(order_id)
  - label: Permission benefit
    description: Narrow contracts also map cleanly to security permissions.
    code: |
      report_job = TaxReportJob(
          tax_reporter=OrderServiceTaxReporter(api_token=read_only_token),
      )
  difficulty: senior
- title: DIP keeps adapters honest at system boundaries
  explanation: |
    At senior level, Dependency Inversion Principle is about making domain code depend on stable business ports while infrastructure handles messy outside behavior.

    A good port is not a thin copy of a vendor SDK. It describes what the domain needs. The adapter maps that need to retries, timeouts, auth, idempotency keys, pagination, rate limits, and vendor response formats. This keeps the high-level policy readable and makes provider changes possible without rewriting the domain.

    Where to apply:
    Use DIP for payment gateways, queues, storage, email, search, authentication, and analytics. Define ports in the application or domain layer. Implement them in infrastructure. Keep dependency direction pointing inward, so business rules never import framework clients or vendor SDKs directly.

    Do not confuse with:
    DIP does not remove operational complexity. It moves operational complexity to the adapter where it belongs. The adapter still needs monitoring, timeouts, retries, and tests against the real provider.
  examples:
  - label: Vendor API leaks inward
    description: Checkout code now knows vendor parameters, idempotency format, and response fields.
    code: |
      class CheckoutService:
          def pay(self, order):
              response = stripe.PaymentIntent.create(
                  amount=order.total_cents,
                  currency="eur",
                  idempotency_key=f"order:{order.id}",
              )
              return response["status"] == "succeeded"
  - label: Business port
    description: Checkout asks for payment capture. The adapter owns vendor-specific details.
    code: |
      class PaymentGateway:
          def capture(self, order_id, amount):
              ...

      class CheckoutService:
          def __init__(self, payments: PaymentGateway):
              self.payments = payments

          def pay(self, order):
              return self.payments.capture(order.id, order.total)
  - label: Adapter owns resilience
    description: Timeouts and idempotency belong near the external API, not inside the domain policy.
    code: |
      class StripePaymentGateway(PaymentGateway):
          def capture(self, order_id, amount):
              return self.client.capture(
                  amount=amount.cents,
                  currency=amount.currency,
                  idempotency_key=f"order:{order_id}",
                  timeout=3,
              )
  difficulty: senior
---
