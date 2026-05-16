---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Factory registries make new variants additive
  explanation: |
    At mid level, Factory is less about hiding constructors and more about controlling creation decisions.

    A factory function with an if/elif chain is a useful starting point, but it still changes every time a new variant appears. When variants grow regularly, a registry moves the variation out of the factory body. The factory becomes stable lookup and validation logic. New notification channels, parsers, payment providers, or report renderers become registered entries.

    Where to apply:
    Use a registry-backed factory when creation depends on a stable external key such as "email", "sms", "csv", or "stripe". This is common in plugin systems, import pipelines, notification channels, and framework integrations. Keep validation and error handling in one place so callers do not repeat unknown-type checks.

    Do not confuse with:
    A registry is not automatically better than a branch. If only two variants exist and product changes rarely, a plain conditional is easier to read. A registry pays off when adding a variant should not risk editing existing creation logic.
  examples:
  - label: Factory that keeps changing
    description: Adding Slack means editing and retesting the same creation function again.
    code: |
      def create_notification(channel, message):
          if channel == "email":
              return EmailNotification(message)
          if channel == "sms":
              return SmsNotification(message)
          if channel == "push":
              return PushNotification(message)
          raise ValueError(f"Unknown channel: {channel}")
  - label: Registry-backed factory
    description: New channels are added by registration while the factory contract stays stable.
    code: |
      NOTIFICATIONS = {
          "email": EmailNotification,
          "sms": SmsNotification,
          "push": PushNotification,
      }

      def create_notification(channel, message):
          try:
              notification_type = NOTIFICATIONS[channel]
          except KeyError:
              raise ValueError(f"Unknown channel: {channel}")
          return notification_type(message)

      NOTIFICATIONS["slack"] = SlackNotification
  - label: Keep keys stable
    description: External keys often appear in URLs, config, queues, or saved data, so renaming them is a compatibility change.
    code: |
      # Good: stable public key
      NOTIFICATIONS["email"] = EmailNotification

      # Risky: class name leaks into persisted config
      NOTIFICATIONS["EmailNotification"] = EmailNotification
  difficulty: mid
- title: Singleton shares one instance but creates global-state pressure
  explanation: |
    At mid level, Singleton is useful to understand because it appears in logging, configuration, pools, caches, and framework containers.

    The pattern guarantees that repeated construction returns the same instance. That can protect expensive shared resources, but it also means state is global by default. Mutating the singleton through one reference changes what every other reference sees. This can make tests order-dependent and make production behavior hard to reason about.

    Where to apply:
    Use Singleton sparingly for process-wide resources that truly have one lifecycle, such as a logger facade, immutable configuration snapshot, or shared connection pool managed by application startup. Prefer passing the singleton as a dependency instead of letting deep code call the global directly.

    Do not confuse with:
    Singleton is not the same as a module-level constant. It is also not a general solution for avoiding dependency injection. If code can receive a collaborator as a parameter, that is usually more testable than reading a hidden global instance.
  examples:
  - label: Shared instance
    description: Both variables point to the same object, so mutations through one variable are visible through the other.
    code: |
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
      print(len(b.connections))  # 1
  - label: Hidden test coupling
    description: Tests can affect each other when global singleton state survives between cases.
    code: |
      def test_first_connection():
          DatabasePool().connections.append("test")

      def test_pool_starts_empty():
          assert DatabasePool().connections == []  # may fail
  - label: Prefer explicit ownership
    description: Application startup can create the shared resource once, then pass it to code that needs it.
    code: |
      pool = DatabasePool()
      users = UserRepository(pool)
      orders = OrderRepository(pool)
  difficulty: mid
- title: Adapter protects application code from foreign interfaces
  explanation: |
    At mid level, Adapter is about keeping your application contract stable while outside dependencies change.

    Third-party SDKs, legacy modules, and external APIs usually speak a different language from your application. They use different method names, units, response shapes, exceptions, and authentication rules. An adapter translates those details at the boundary so business code talks in its own terms.

    Where to apply:
    Use Adapter around payment gateways, email providers, storage APIs, analytics SDKs, legacy modules, and unstable vendor clients. The adapter should convert inputs, outputs, errors, and units. This makes replacement easier because only the adapter needs to know vendor-specific details.

    Do not confuse with:
    Adapter is not Facade. A facade simplifies several subsystems behind one easier API. An adapter makes one interface fit another expected interface. Adapter is also not the place for business policy. Keep eligibility, pricing, and permission rules outside the boundary translation.
  examples:
  - label: Vendor interface leaks inward
    description: Business code knows vendor method names and vendor units.
    code: |
      result = gateway.charge_card(
          card_number=card.number,
          amount_cents=int(order.total_usd * 100),
      )
  - label: Application-facing adapter
    description: Callers use a stable payment contract while the adapter handles vendor details.
    code: |
      class PaymentAdapter:
          def __init__(self, gateway):
              self.gateway = gateway

          def charge(self, card, amount):
              return self.gateway.charge_card(
                  card_number=card.number,
                  amount_cents=amount.cents,
              )

      processor = PaymentAdapter(ThirdPartyGateway())
      processor.charge(card, Money.usd("9.99"))
  - label: Replacement stays local
    description: A new vendor should require a new adapter, not a rewrite of checkout code.
    code: |
      payments = StripePaymentAdapter(stripe_client)
      checkout = CheckoutService(payments)
  difficulty: mid
---
