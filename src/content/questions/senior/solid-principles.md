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
- q: |
    PromotionService owns eligibility policy, SQL, and queue publishing in one method.
    What is the senior-level SRP concern?
  options:
  - text: "Policy, persistence, and external effects now change and test for different reasons"
    correct: true
  - text: "The database dependency should be injected through a port, but policy and effects can remain together"
    correct: false
  - text: "Promotion rules should be registered as extensions so future promotions avoid editing core code"
    correct: false
  - text: "The customer repository interface should be split into read and write capabilities"
    correct: false
  explanation: "At senior level SRP controls blast radius. Domain policy should be testable without database or network setup, while orchestration owns ordering and transaction boundaries."
  difficulty: senior
- q: |
    Which split best respects SRP in an application workflow?
  options:
  - text: "Domain policy decides eligibility; application orchestration owns order and effects; adapters own SQL/HTTP/queue details"
    correct: true
  - text: "A promotion plugin registry owns every eligibility rule and publishes events directly"
    correct: false
  - text: "The service depends on injected SQL and queue clients while keeping eligibility in the transaction method"
    correct: false
  - text: "The customer client exposes only read methods to the promotion use case"
    correct: false
  explanation: "SRP does not require maximum decomposition. It asks that policy, orchestration, and infrastructure details have clear ownership."
  difficulty: senior
- q: |
    A single transaction script is small, cohesive, and easy to reason about.
    What is the correct SRP stance?
  options:
  - text: "It can be acceptable if ownership and change reasons are clear"
    correct: true
  - text: "It should still use a strategy registry because every transaction may grow variants"
    correct: false
  - text: "It should be split into read and write interfaces even if one use case owns both"
    correct: false
  - text: "It should inject every line as a separate port to satisfy DIP"
    correct: false
  explanation: "SRP is not maximum decomposition. Over-splitting can hide ordering and rollback behavior."
  difficulty: senior
- q: |
    A discount rule interface exists, but each new rule needs special context and caller branches.
    What does this suggest?
  options:
  - text: "The OCP extension contract is too weak or leaky"
    correct: true
  - text: "The rule interface is too wide and should be segregated by consumer role"
    correct: false
  - text: "The rule implementations fail substitutability because each returns a different concrete type"
    correct: false
  - text: "The domain should depend on an injected rule provider rather than concrete rules"
    correct: false
  explanation: "A registry or strategy only helps when the contract is stable and specific. Hidden side effects and special context mean the extension point needs redesign."
  difficulty: senior
- q: |
    Which detail belongs in a senior-level OCP extension contract?
  options:
  - text: "Input shape, output shape, allowed side effects, error semantics, ordering, and defaults"
    correct: true
  - text: "Only the consumer-facing methods each caller usually uses together"
    correct: false
  - text: "Only which infrastructure adapter implements the rule"
    correct: false
  - text: "Only whether each implementation preserves repository invariants"
    correct: false
  explanation: "OCP is about making additions safe and predictable, not just avoiding edits. The contract must describe behavior."
  difficulty: senior
- q: |
    Every DiscountRule must return a non-negative EUR amount in a contract test.
    What purpose does this serve?
  options:
  - text: "It proves each implementation follows the extension contract"
    correct: true
  - text: "It proves each implementation can replace every other implementation in all contexts"
    correct: false
  - text: "It proves each rule has only one reason to change"
    correct: false
  - text: "It proves callers depend on the smallest possible rule interface"
    correct: false
  explanation: "Contract tests let every implementation prove the same behavioral expectations, which keeps OCP extension points safe."
  difficulty: senior
- q: |
    Sometimes the correct senior decision is to change core code instead of preserving an old extension point. Why?
  options:
  - text: "The old abstraction may no longer describe the problem"
    correct: true
  - text: "The old abstraction has too many client-facing methods and violates ISP"
    correct: false
  - text: "The old abstraction points outward to infrastructure and violates DIP"
    correct: false
  - text: "The old implementations are not substitutable and violate LSP"
    correct: false
  explanation: "OCP contracts can change deliberately. If the contract is wrong, forcing additions through it creates hidden complexity."
  difficulty: senior
- q: |
    An in-memory fake user repository allows duplicate emails, while SQL production rejects them.
    Which principle is being violated?
  options:
  - text: "Liskov Substitution Principle (LSP)"
    correct: true
  - text: "Dependency Inversion Principle (DIP), because the fake and SQL adapters are infrastructure details"
    correct: false
  - text: "Interface Segregation Principle (ISP), because repository clients should depend on narrower roles"
    correct: false
  - text: "Single Responsibility Principle (SRP), because save and uniqueness policy could change separately"
    correct: false
  explanation: "LSP applies to ports, fakes, adapters, and mocks. Objects behind the same interface must preserve the caller's behavioral expectations."
  difficulty: senior
- q: |
    What should a repository contract test check if production rejects duplicate emails?
  options:
  - text: "Both fake and SQL repositories reject the second save with DuplicateEmail"
    correct: true
  - text: "Both repositories expose only the read methods needed by the caller"
    correct: false
  - text: "The SQL repository is injected through a domain-owned port"
    correct: false
  - text: "A new repository implementation can be registered without editing the use case"
    correct: false
  explanation: "Run the same contract tests against fakes and real adapters so tests do not become misleading."
  difficulty: senior
- q: |
    Which assumption is part of an LSP invariant for a cache API?
  options:
  - text: "A cache miss has the documented result, such as None or a specific error"
    correct: true
  - text: "The cache client exposes separate read and write interfaces"
    correct: false
  - text: "The cache implementation is injected instead of created by the policy"
    correct: false
  - text: "A new cache provider can be added by registering an adapter"
    correct: false
  explanation: "LSP concerns behavior: return values, errors, side effects, consistency, and invariants that callers rely on."
  difficulty: senior
- q: |
    A caller clears duplicates only when the repository is FakeUserRepository before calling save.
    What is this smell?
  options:
  - text: "Caller compensation for an implementation that breaks the shared contract"
    correct: true
  - text: "A useful ISP split because fake repositories need a separate maintenance role"
    correct: false
  - text: "A useful OCP extension because fake-specific cleanup is added beside core save"
    correct: false
  - text: "A useful DIP boundary because test code now knows the concrete adapter"
    correct: false
  explanation: "Special casing one implementation means the shared contract is not honest or not enforced."
  difficulty: senior
- q: |
    A read-only report imports OrderClient with cancel_order, issue_refund, change_shipping, and export_tax_report.
    Which principle is most relevant?
  options:
  - text: "Interface Segregation Principle (ISP)"
    correct: true
  - text: "Single Responsibility Principle (SRP), because read, refund, shipping, and tax rules change independently"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because the report should depend on an order abstraction"
    correct: false
  - text: "Liskov Substitution Principle (LSP), because client implementations must preserve order behavior"
    correct: false
  explanation: "A mega client forces consumers to depend on capabilities they do not use, increasing dependency churn."
  difficulty: senior
- q: |
    What is a senior-level benefit of splitting OrderReader, RefundIssuer, and TaxReporter?
  options:
  - text: "Each consumer depends on a narrow capability with clearer permissions and churn"
    correct: true
  - text: "Each capability can be added as a plugin without changing the shared order core"
    correct: false
  - text: "Each adapter can be injected into policy code instead of constructed directly"
    correct: false
  - text: "Each implementation is guaranteed to preserve all order invariants"
    correct: false
  explanation: "ISP reduces dependency churn across modules and maps better to permissions, support expectations, and deployment coordination."
  difficulty: senior
- q: |
    Which name better describes a business-facing ISP contract?
  options:
  - text: "OrderReader"
    correct: true
  - text: "OrderReadAndRefundClient"
    correct: false
  - text: "OrderServicePortForAllUseCases"
    correct: false
  - text: "OrderProviderAdapter"
    correct: false
  explanation: "Small interfaces should still describe business capability, not expose internal storage concerns."
  difficulty: senior
- q: |
    CheckoutService directly imports Stripe response fields and idempotency parameters.
    What is the DIP issue?
  options:
  - text: "Vendor API details leak into high-level checkout policy"
    correct: true
  - text: "Checkout has too many responsibilities because payment, ledger, and messaging are together"
    correct: false
  - text: "The Stripe implementation cannot substitute for another PaymentGateway"
    correct: false
  - text: "The payment interface exposes capture, refund, disputes, and settlement to every caller"
    correct: false
  explanation: "DIP keeps domain code depending on stable business ports. Vendor details belong in adapters."
  difficulty: senior
- q: |
    Which port is better for checkout domain code?
  options:
  - text: "PaymentGateway.capture(order_id, amount)"
    correct: true
  - text: "PaymentGateway.capture(order_id, amount, stripe_response_fields)"
    correct: false
  - text: "StripePaymentIntentRepository.save_and_capture(order)"
    correct: false
  - text: "CheckoutPluginRegistry.run_payment_hooks(order)"
    correct: false
  explanation: "A good port describes what the domain needs. The adapter maps it to retries, timeouts, auth, idempotency, and vendor response formats."
  difficulty: senior
- q: |
    Where should payment timeout and idempotency handling usually live?
  options:
  - text: "In the external payment adapter"
    correct: true
  - text: "In the PaymentGateway port signature so every domain caller handles timeout details"
    correct: false
  - text: "In a checkout extension hook before every payment"
    correct: false
  - text: "In a separate PaymentTimeoutReader interface consumed by checkout"
    correct: false
  explanation: "DIP moves operational complexity to the adapter where the external API is handled, while keeping policy readable."
  difficulty: senior
- q: |
    DIP does not remove operational complexity. What does it do with that complexity?
  options:
  - text: "Moves it to infrastructure adapters with monitoring, retries, timeouts, and provider tests"
    correct: true
  - text: "Moves it to the domain entity so invariants stay close to payment state"
    correct: false
  - text: "Moves it to contract tests so adapters no longer need resilience logic"
    correct: false
  - text: "Moves it to consumer-facing interfaces so callers choose timeout behavior"
    correct: false
  explanation: "DIP protects the high-level policy from messy outside behavior; it does not make outside behavior disappear."
  difficulty: senior
---
