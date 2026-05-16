---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
lessons:
- title: SRP becomes ownership design at scale
  explanation: |
    At principal level, Single Responsibility Principle is about aligning software boundaries with durable ownership and change streams.

    A module has one responsibility when one accountable group can change it for one coherent reason. If fraud policy, pricing policy, ledger posting, customer messaging, and compliance reporting all live in one service, the problem is not just class size. The problem is competing owners and release risks. SRP becomes a tool for reducing coordination cost.

    Where to apply:
    Use SRP when a platform or service becomes a shared bottleneck. Look at incident ownership, pull-request reviewers, deployment blockers, and roadmap conflicts. If unrelated teams must modify the same module for unrelated outcomes, split by policy ownership or create clear extension points.

    Do not confuse with:
    SRP is not the same as microservices. A bad service split can increase coupling through distributed transactions and duplicated data. A principal-level SRP split should reduce coordination and clarify authority, not just move code into another repository.
  examples:
  - label: Shared ownership bottleneck
    description: One service owns policies that change under different teams and risk models.
    code: |
      class CommerceService:
          def price_order(self, order): ...
          def score_fraud(self, order): ...
          def post_ledger_entry(self, order): ...
          def send_customer_message(self, order): ...
          def export_compliance_report(self, month): ...
  - label: Ownership-oriented modules
    description: Each module owns a coherent policy area and exposes explicit contracts to the workflow.
    code: |
      price = pricing.quote(order)
      fraud.require_allowed(order, price)
      ledger.post_sale(order, price)
      messaging.send_order_confirmation(order)
  - label: Split must reduce coordination
    description: Moving code out while keeping synchronous back-and-forth for every decision creates a distributed bottleneck.
    code: |
      price = pricing_service.quote(order)
      fraud_service.check(order, price)
      pricing_service.recalculate_after_fraud(order)
  difficulty: principal
- title: OCP becomes controlled extensibility
  explanation: |
    At principal level, Open/Closed Principle is about creating extension mechanisms that many teams can use without destabilizing the core.

    The challenge is not adding one strategy class. The challenge is deciding which parts of the platform are allowed to vary, who can register extensions, how conflicts are resolved, how extensions are tested, and how the core remains observable. Uncontrolled extension points become hidden coupling. Controlled extension points let teams move independently.

    Where to apply:
    Use OCP when a core workflow must support many product variants, markets, tenants, or partner integrations. Define registration rules, versioned contracts, safety limits, ordering semantics, rollout controls, and contract tests. Make extension behavior visible in logs and metrics so production incidents can be traced.

    Do not confuse with:
    OCP is not a reason to make everything configurable. Too much configuration creates a programming language with weak tooling. Keep the core closed around invariants that must never vary, such as ledger correctness, authorization, and audit requirements.
  examples:
  - label: Uncontrolled extension
    description: Extensions can change core behavior in invisible ways.
    code: |
      PLUGINS = []

      def run_checkout(order):
          for plugin in PLUGINS:
              plugin(order)
          complete_order(order)
  - label: Controlled extension contract
    description: Extensions receive limited context, return explicit decisions, and run under platform rules.
    code: |
      class CheckoutExtension:
          version = "2026-01"

          def evaluate(self, context):
              return ExtensionDecision(
                  adjustments=[],
                  messages=[],
              )

      registry.register(
          phase="before_payment",
          extension=MarketTaxExtension(),
          owner="tax-platform",
      )
  - label: Core invariants stay closed
    description: Extension points should not allow plugins to bypass non-negotiable platform rules.
    code: |
      decision = extension.evaluate(context)
      authorization.require_allowed(context.user, "checkout")
      ledger.validate_balanced(decision.adjustments)
  difficulty: principal
- title: LSP becomes compatibility governance
  explanation: |
    At principal level, Liskov Substitution Principle is about preserving trust in contracts across versions, teams, and providers.

    When many consumers depend on an interface, substitutability is a governance problem. A new implementation, provider, or API version must preserve behavior that existing consumers rely on. Breaking return semantics, error semantics, ordering, idempotency, or consistency guarantees can create incidents even when types still compile.

    Where to apply:
    Use LSP when replacing infrastructure, versioning APIs, shipping SDKs, or allowing teams to implement shared interfaces. Write compatibility suites that run against every implementation. Document behavioral guarantees and forbidden changes. Treat fake implementations as production-like contracts, not shortcuts.

    Do not confuse with:
    LSP is not only about object-oriented inheritance. It applies to REST APIs, message schemas, SDK clients, event consumers, database adapters, and feature-flag providers. Anything advertised as replaceable must behave like the thing it replaces.
  examples:
  - label: Compatible type, incompatible behavior
    description: New search provider returns partial results on timeout while old provider failed loudly.
    code: |
      class SearchProvider:
          def search(self, query):
              ...

      class NewSearchProvider(SearchProvider):
          def search(self, query):
              try:
                  return vendor.search(query)
              except Timeout:
                  return []
  - label: Contract states failure semantics
    description: Consumers can substitute providers because timeout behavior is explicit and tested.
    code: |
      class SearchProvider:
          def search(self, query):
              """Returns complete results or raises SearchUnavailable."""

      def assert_search_contract(provider):
          with force_timeout(provider):
              expect_raises(SearchUnavailable, lambda: provider.search("ssd"))
  - label: Versioned migration
    description: New behavior belongs behind a new contract version when old consumers rely on old semantics.
    code: |
      search_v1 = StrictSearchProvider()
      search_v2 = PartialSearchProvider(allow_partial=True)
  difficulty: principal
- title: ISP becomes capability surface design
  explanation: |
    At principal level, Interface Segregation Principle is about exposing platform capabilities without forcing every consumer into one oversized contract.

    Shared platforms often drift toward a universal SDK or mega API. That looks efficient for the provider but expensive for consumers. Teams must understand permissions, dependencies, payloads, and failure modes they do not use. Smaller capability surfaces make adoption safer and let the platform evolve without breaking unrelated clients.

    Where to apply:
    Use ISP when designing SDKs, internal platforms, service APIs, admin tools, and integration contracts. Split surfaces by consumer intent: read models, command APIs, reporting, admin operations, webhooks, and bulk exports. Align each surface with permissions, rate limits, support expectations, and compatibility promises.

    Do not confuse with:
    ISP does not mean each team gets a custom one-off API. That creates maintenance debt. The goal is a small set of stable, named capabilities that map to real use cases.
  examples:
  - label: Universal SDK
    description: A simple status page imports billing, mutation, admin, and export capabilities it does not need.
    code: |
      client = CommercePlatformClient(token)
      order = client.orders.get(order_id)
  - label: Capability SDKs
    description: Consumers choose the smallest surface that matches their job.
    code: |
      orders = OrderReadClient(read_token)
      refunds = RefundCommandClient(refund_token)
      reports = SettlementReportClient(report_token)

      order = orders.get(order_id)
  - label: Capability surface includes policy
    description: Each surface can have separate permissions, limits, and compatibility rules.
    code: |
      capabilities:
        order-read:
          permissions: ["orders:read"]
          rateLimit: "1000/min"
        refund-command:
          permissions: ["refunds:write"]
          approvalRequired: true
  difficulty: principal
- title: DIP becomes dependency direction strategy
  explanation: |
    At principal level, Dependency Inversion Principle is about protecting core business policy from frameworks, vendors, and organizational churn.

    Core domains should not point outward to volatile details. Frameworks, databases, SaaS vendors, queues, and UI shells change faster than business invariants. DIP sets dependency direction so the core defines ports and outer layers implement adapters. That allows migrations, tests, parallel implementations, and vendor exits without rewriting the policy model.

    Where to apply:
    Use DIP when deciding architecture boundaries for a system that will live through migrations. Put domain language and ports near the core. Put framework controllers, ORM models, vendor SDKs, queue handlers, and HTTP clients at the edge. Use anti-corruption adapters when external models do not match domain language.

    Do not confuse with:
    DIP is not a ban on frameworks. Frameworks are useful at the edge. The principal decision is whether framework concepts become the language of the domain. If business rules depend on ORM sessions, HTTP requests, or vendor response shapes, migrations become rewrites.
  examples:
  - label: Framework owns domain language
    description: Business policy depends on ORM and request objects directly.
    code: |
      def approve_order(request, session):
          order = session.query(OrderModel).get(request.path_params["id"])
          if order.total_cents > request.user.limit_cents:
              raise HttpError(403)
          order.status = "approved"
          session.commit()
  - label: Core owns port and policy
    description: Framework code adapts requests into domain calls. Domain code depends on ports.
    code: |
      class ApproveOrder:
          def __init__(self, orders, limits):
              self.orders = orders
              self.limits = limits

          def run(self, order_id, user_id):
              order = self.orders.get(order_id)
              limit = self.limits.for_user(user_id)
              order.approve_with_limit(limit)
              self.orders.save(order)
  - label: Edge owns framework details
    description: Controller, ORM adapter, and HTTP errors stay outside the core policy.
    code: |
      def approve_order_handler(request):
          command.run(
              order_id=request.path_params["id"],
              user_id=request.user.id,
          )
          return JsonResponse({"ok": True})
  difficulty: principal
---
