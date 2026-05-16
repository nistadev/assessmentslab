---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Decorator handles cross-cutting behavior without polluting core code
  explanation: |
    At senior level, Decorator is about placing optional behavior around a stable operation without changing the operation itself.

    Retry, caching, authorization, tracing, rate limiting, metrics, validation, and logging often surround business actions. If each concern is mixed into the action directly, the action gains many reasons to change. A decorator keeps the core behavior focused and makes wrappers composable.

    Where to apply:
    Use Decorator when the added behavior can run before or after the wrapped operation while preserving the same call contract. This is common around HTTP clients, repositories, command handlers, background jobs, and framework route handlers. Stack decorators in an intentional order because retrying before logging is not the same as logging before retrying.

    Do not confuse with:
    Decorator should not secretly change the meaning of the operation. If a wrapper turns "charge payment" into "maybe enqueue payment later," callers need a different contract. Also avoid hiding critical business decisions inside generic-looking decorators.
  examples:
  - label: Retry decorator
    description: The original function stays focused on payment. Retry behavior surrounds it.
    code: |
      def retry(max_attempts):
          def decorate(func):
              def wrapper(*args, **kwargs):
                  for attempt in range(max_attempts):
                      try:
                          return func(*args, **kwargs)
                      except TimeoutError:
                          if attempt == max_attempts - 1:
                              raise
              return wrapper
          return decorate

      @retry(3)
      def call_payment_api(order_id):
          return gateway.capture(order_id)
  - label: Object decorator
    description: The wrapper keeps the same interface as the wrapped repository.
    code: |
      class CachedProductRepository:
          def __init__(self, repository, cache):
              self.repository = repository
              self.cache = cache

          def find_by_id(self, product_id):
              cached = self.cache.get(product_id)
              if cached is not None:
                  return cached
              product = self.repository.find_by_id(product_id)
              self.cache.set(product_id, product)
              return product
  - label: Order matters
    description: Observability wrappers should be ordered deliberately so metrics describe the intended behavior.
    code: |
      client = PaymentClient()
      client = RetryingPaymentClient(client, attempts=3)
      client = MeteredPaymentClient(client, metrics)
  difficulty: senior
- title: Command turns actions into objects that can be queued, audited, and undone
  explanation: |
    At senior level, Command is about separating "what should happen" from "when and how it runs."

    A command object packages an action and the data needed to perform it. That makes actions storable, queueable, retryable, loggable, permission-checkable, and reversible when an undo operation exists. The receiver can execute commands without knowing each concrete action's internal details.

    Where to apply:
    Use Command for undo/redo stacks, transactional workflows, background jobs, task queues, UI actions, game input, audit logs, and financial operations. Keep command contracts explicit: what inputs are captured, whether execution is idempotent, what failure means, and whether undo is guaranteed.

    Do not confuse with:
    Command is not required for every function call. If an action is immediate, local, and never needs queueing, auditing, retry, or undo, a direct method call is clearer. Command becomes valuable when actions need lifecycle management.
  examples:
  - label: Undoable text command
    description: Editor history stores commands and reverses the last action without knowing insert details.
    code: |
      class InsertText:
          def __init__(self, text):
              self.text = text

          def do(self, editor):
              editor.content += self.text

          def undo(self, editor):
              editor.content = editor.content[:-len(self.text)]

      editor.execute(InsertText("Hello"))
      editor.execute(InsertText(" World"))
      editor.undo()
  - label: Queueable command
    description: The command can be serialized or scheduled because it carries action intent.
    code: |
      class SendReceipt:
          def __init__(self, order_id):
              self.order_id = order_id

          def execute(self, receipts):
              receipts.send_for_order(self.order_id)

      queue.enqueue(SendReceipt(order.id))
  - label: Explicit failure semantics
    description: Commands that may be retried should define idempotency keys or duplicate handling.
    code: |
      class CapturePayment:
          def __init__(self, order_id, amount):
              self.order_id = order_id
              self.amount = amount
              self.idempotency_key = f"capture:{order_id}"
  difficulty: senior
- title: Proxy controls access to another object while preserving its interface
  explanation: |
    At senior level, Proxy is about standing in front of an object to control access, lifecycle, or cost while keeping the same surface.

    A proxy may lazy-load an expensive dependency, enforce authorization, cache remote results, add network boundaries, or protect a resource from invalid access. Callers still use the expected interface, but the proxy decides when and how the real subject is reached.

    Where to apply:
    Use Proxy when access itself has rules: remote service clients, lazy ORM relationships, protected documents, cached read models, expensive file loaders, and API clients with rate limits. Keep the proxy narrow and honest; callers should not need to know whether the real subject is local, remote, lazy, or protected.

    Do not confuse with:
    Proxy and Decorator both wrap objects. Decorator adds behavior around an operation as a feature. Proxy controls access to the underlying object. If the wrapper's main job is "should this call reach the real object and when?", it is probably a proxy.
  examples:
  - label: Lazy proxy
    description: The expensive report loads only when a caller actually asks for data.
    code: |
      class ReportProxy:
          def __init__(self, report_id, loader):
              self.report_id = report_id
              self.loader = loader
              self._report = None

          def rows(self):
              if self._report is None:
                  self._report = self.loader.load(self.report_id)
              return self._report.rows()
  - label: Protection proxy
    description: Access checks happen before the real document is returned.
    code: |
      class ProtectedDocument:
          def __init__(self, document, permissions):
              self.document = document
              self.permissions = permissions

          def read(self, user):
              self.permissions.require(user, "document:read")
              return self.document.read()
  - label: Do not surprise callers
    description: A remote proxy should preserve expected error and timeout behavior through a clear contract.
    code: |
      class InventoryClientProxy:
          def available(self, sku):
              return remote_inventory.available(sku, timeout=2)
  difficulty: senior
- title: Pattern choice starts from change axis and ownership
  explanation: |
    At senior level, design patterns are a way to make expected change explicit.

    Before choosing a pattern, ask what changes, how often it changes, who owns the change, and what should stay stable. Strategy may fit market-specific tax rules because markets change independently. Adapter may fit a payment SDK because vendor details should not leak into checkout. Template Method may fit a regulated workflow because the sequence must stay fixed.

    Where to apply:
    Use this reasoning during design reviews and refactors. A senior engineer should be able to explain the force behind the pattern, not only name it. The right pattern localizes future change and makes tests easier to target.

    Do not confuse with:
    "This is a design pattern" is not a justification. If no expected change or ownership boundary exists, the pattern may only add ceremony.
  examples:
  - label: Good strategy force
    description: Tax rules vary by market and each market can change independently.
    code: |
      tax_rule = tax_rules.for_market(order.market)
      total = tax_rule.apply(order)
  - label: Good adapter force
    description: Checkout should not know gateway-specific field names.
    code: |
      payments.charge(order.payment_method, order.total)
  - label: Weak force
    description: One implementation behind a generic strategy name hides simple behavior.
    code: |
      class StringTrimStrategy:
          def apply(self, value):
              return value.strip()
  difficulty: senior
- title: Patterns compose around boundaries when each has a clear job
  explanation: |
    At senior level, patterns often work together, but each pattern should still have one clear reason to exist.

    A factory can select a provider adapter. The adapter can translate vendor fields. A decorator can add retry or metrics around the adapter. A strategy can choose a business rule before the adapter is called. This composition is healthy when each layer owns a different type of change.

    Where to apply:
    Use composition at integration boundaries, payment flows, export pipelines, notification systems, and repositories. Keep business policy separate from vendor translation and keep cross-cutting behavior separate from core operations.

    Do not confuse with:
    Stacking patterns is not automatically architecture. If layers cannot be explained in one sentence each, they may be hiding tangled responsibilities instead of separating them.
  examples:
  - label: Clear composition
    description: Factory selects provider, adapter translates provider, decorator adds retry.
    code: |
      provider = PaymentFactory.create("stripe")
      payments = RetryingPayments(StripeAdapter(provider), attempts=3)
      payments.charge(card, amount)
  - label: Policy outside adapter
    description: Eligibility is decided before the boundary adapter is called.
    code: |
      if risk_policy.can_charge(order):
          payments.charge(order.card, order.total)
  - label: "Smell: all jobs in one wrapper"
    description: This wrapper translates, retries, checks risk, and changes pricing.
    code: |
      result = SmartPaymentWrapper().maybe_discount_retry_and_charge(order)
  difficulty: senior
- title: Extension contracts need tests before many callers depend on them
  explanation: |
    At senior level, Strategy, Factory, Observer, Template Method, and Chain of Responsibility often become extension points inside a service.

    Once other code depends on an extension point, the hard part is the contract. You need to define inputs, outputs, allowed side effects, ordering, errors, and compatibility. Tests should verify the shared contract so new implementations can be added without breaking existing behavior.

    Where to apply:
    Use contract tests for pricing strategies, import handlers, notification subscribers, workflow hooks, and provider adapters. Document what implementers may assume and what callers may rely on.

    Do not confuse with:
    A base class or interface is not a complete contract. The real contract includes failure behavior, timing, idempotency, side effects, and data ownership.
  examples:
  - label: Strategy contract test
    description: Every discount rule must return a non-negative money value and must not mutate the order.
    code: |
      def assert_discount_contract(rule, order):
          before = order.copy()
          total = rule.apply(order)
          assert total.amount >= 0
          assert order == before
  - label: Observer contract
    description: Subscribers may fail without blocking the committed order.
    code: |
      bus.emit_after_commit("order_placed", order)
  - label: Handler contract
    description: A chain handler must either return a response or call the next handler once.
    code: |
      response = handler.handle(request, next_handler)
  difficulty: senior
- title: Refactor toward a pattern in small safe steps
  explanation: |
    At senior level, patterns often appear during refactoring, not greenfield design.

    Start by finding duplicated branches, boundary leakage, or repeated setup. Extract one clear interface or function. Move one variant behind it. Add tests around the old behavior. Then move the remaining variants. This keeps the refactor reviewable and avoids a big rewrite that changes design and behavior at the same time.

    Where to apply:
    Use incremental refactors when turning a branch into Strategy, vendor calls into Adapter, setup logic into Builder or Factory, or side effects into Observer subscribers. Keep the public behavior stable while the structure changes.

    Do not confuse with:
    Refactoring toward a pattern is not an excuse to rename everything. The goal is localizing change, not making code look like a textbook.
  examples:
  - label: Branch before refactor
    description: Each new export format edits the same function.
    code: |
      def export(data, format):
          if format == "csv":
              return to_csv(data)
          if format == "json":
              return to_json(data)
  - label: First extraction
    description: Move one variant behind a common callable contract.
    code: |
      exporters = {
          "csv": to_csv,
          "json": to_json,
      }

      def export(data, format):
          return exporters[format](data)
  - label: Later growth
    description: If exporters need state, move from functions to objects without changing callers.
    code: |
      exporters["pdf"] = PdfExporter(fonts, templates)
  difficulty: senior
- title: Async behavior patterns need ordering and failure semantics
  explanation: |
    At senior level, Observer, Command, Chain of Responsibility, and Mediator become risky when work is asynchronous or distributed.

    Events can arrive twice. Commands can be retried. Handlers may time out after doing partial work. Mediators can become bottlenecks. Senior design defines ordering, idempotency, retry limits, deduplication, and what happens when one reaction fails.

    Where to apply:
    Use these concerns around message queues, background jobs, webhooks, domain events, task orchestration, and middleware. Make every command or event answer: can it run twice, can it run out of order, and who owns recovery?

    Do not confuse with:
    Making work asynchronous does not make coupling disappear. It changes direct coupling into contract, delivery, and observability problems.
  examples:
  - label: Idempotent command
    description: Retried commands use a stable key to avoid duplicate payment capture.
    code: |
      command = CapturePayment(
          order_id=order.id,
          amount=order.total,
          idempotency_key=f"capture:{order.id}",
      )
  - label: Event after commit
    description: Subscribers should not see an order event before the order is durable.
    code: |
      orders.save(order)
      events.publish_after_commit("order_placed", order.id)
  - label: Chain timeout
    description: Middleware should define whether timeout means fail closed or pass through.
    code: |
      response = auth_handler.handle(request, timeout=1)
  difficulty: senior
- title: Avoid pattern ceremony when a local design is enough
  explanation: |
    At senior level, pattern restraint matters as much as pattern knowledge.

    A small if statement, direct constructor, or plain function can be the best design when change pressure is low. Patterns are useful when they reduce meaningful coupling, isolate volatile code, improve testability, or protect a boundary. They are harmful when they scatter simple logic across many files without reducing risk.

    Where to apply:
    Use restraint in small modules, one-off business rules, prototypes, and code owned by one team with low expected variation. Revisit the decision when the same branch or setup logic starts changing repeatedly.

    Do not confuse with:
    Simple is not the same as careless. A direct solution can still be well named, tested, and easy to refactor later.
  examples:
  - label: Pattern not needed yet
    description: One stable local rule reads better as a function.
    code: |
      def delivery_fee(country):
          return 5 if country == "ES" else 15
  - label: Change pressure appears
    description: Repeated market-specific edits justify a strategy map.
    code: |
      delivery_rules = {
          "ES": SpainDeliveryRule(),
          "US": UnitedStatesDeliveryRule(),
      }
  - label: Review question
    description: Explain what future change this abstraction protects.
    code: |
      # Why does this interface exist?
      price = pricing_strategy.calculate(order)
  difficulty: senior
---
