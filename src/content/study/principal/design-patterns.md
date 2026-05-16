---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Template Method fixes workflow order while allowing controlled variation
  explanation: |
    At principal level, Template Method is about protecting workflow invariants while allowing specific steps to vary.

    The base class defines the algorithm skeleton. Subclasses customize selected steps, but they do not control the overall sequence. This is useful when the sequence must remain consistent for correctness, auditability, or operational safety. Examples include report generation, request handling, import pipelines, test frameworks, and compliance workflows.

    Where to apply:
    Use Template Method when all variants must follow the same high-level process: fetch, validate, transform, render, publish; or authorize, execute, audit, respond. Make required hooks explicit and keep default hooks safe. Document which hooks may have side effects and which must be pure.

    Do not confuse with:
    Template Method is inheritance-centered. If teams need runtime composition, separate deployment, or independent ownership of each step, Strategy or a pipeline of handlers may be a better fit. Template Method works best when the base workflow truly owns the sequence.
  examples:
  - label: Fixed report workflow
    description: The base class controls the sequence. Subclasses supply variant steps.
    code: |
      class ReportGenerator:
          def generate(self, data):
              raw = self.fetch(data)
              processed = self.transform(raw)
              return self.render(processed)

          def transform(self, raw):
              return raw

          def fetch(self, data):
              raise NotImplementedError

          def render(self, data):
              raise NotImplementedError
  - label: Concrete variant
    description: CSVReport customizes fetch and render while inheriting the workflow order.
    code: |
      class CSVReport(ReportGenerator):
          def fetch(self, data):
              return data["rows"]

          def render(self, rows):
              return "\n".join(",".join(str(cell) for cell in row) for row in rows)
  - label: Hook contract matters
    description: If transform is optional, its default behavior should be safe and documented.
    code: |
      def transform(self, raw):
          """Optional hook. Must not mutate raw input."""
          return raw
  difficulty: principal
- title: Pattern choice is architecture, not vocabulary
  explanation: |
    At principal level, design patterns are decision tools for managing change, ownership, and failure modes.

    The same code shape can be good or bad depending on forces around it. A Strategy interface may be excellent when market-specific rules ship independently. The same interface may be noise if there is one implementation owned by one team. A Singleton may simplify process-wide configuration, but it may also create hidden global state. Principal-level design asks which change is expected, who owns it, how it is tested, and what breaks when the assumption is wrong.

    Where to apply:
    Use patterns to make a change axis explicit: interchangeable algorithms, boundary translation, controlled extension, shared workflow order, access control, undoable actions, or cross-cutting behavior. Record the reason for the pattern in code or architecture notes so future maintainers know which force the pattern is serving.

    Do not confuse with:
    Naming a pattern does not prove the design. A pattern used without a real force becomes ceremony. A plain function can be better architecture than a cluster of classes if it localizes change and keeps behavior obvious.
  examples:
  - label: Good strategy force
    description: Markets own different tax policies and release on different schedules.
    code: |
      tax_rules = {
          "ES": SpainTaxRule(),
          "US": UnitedStatesTaxRule(),
          "GB": UnitedKingdomTaxRule(),
      }

      total = tax_rules[market].apply(order)
  - label: Weak abstraction
    description: One implementation behind a generic name hides simple behavior without reducing risk.
    code: |
      class StringFormattingStrategy:
          def format(self, value):
              return str(value).strip()
  - label: Capture design force
    description: A short note can preserve why the pattern exists.
    code: |
      # Adapter protects checkout from vendor-specific payment fields.
      payments = StripePaymentAdapter(stripe_client)
  difficulty: principal
- title: Extension patterns need governance when many teams use them
  explanation: |
    At principal level, Factory, Strategy, Observer, and Template Method often become platform extension mechanisms.

    Once many teams can add behavior, the hard problem moves from "how do we extend?" to "how do we keep extension safe?" You need versioned contracts, ownership metadata, ordering rules, rollout controls, test suites, observability, and failure isolation. Otherwise extension points become hidden coupling where any plugin can destabilize the core.

    Where to apply:
    Use governance around extension points in checkout, pricing, notifications, workflow engines, integration platforms, build systems, and internal SDKs. Define what extensions may read, what they may write, how long they may run, how errors behave, and how conflicts resolve. Keep core invariants closed even when extension behavior is open.

    Do not confuse with:
    Governance is not bureaucracy for small local code. A two-strategy module in one service does not need a platform registry. Add governance when independent teams, deployments, tenants, or external partners depend on the extension point.
  examples:
  - label: Unsafe plugin hook
    description: Plugins mutate the order directly, with no ownership, ordering, or failure contract.
    code: |
      def run_checkout(order):
          for plugin in PLUGINS:
              plugin(order)
          complete_order(order)
  - label: Governed extension point
    description: Extensions return explicit decisions and register with owner, phase, and contract version.
    code: |
      registry.register(
          owner="tax-platform",
          phase="before_payment",
          version="2026-01",
          extension=MarketTaxExtension(),
      )

      decision = registry.evaluate("before_payment", CheckoutContext(order))
  - label: Core invariants remain closed
    description: Extension output is validated before core state changes.
    code: |
      decision = registry.evaluate("before_payment", context)
      authorization.require_allowed(context.user, "checkout")
      ledger.assert_balanced(decision.adjustments)
      complete_order(context.order, decision)
  difficulty: principal
- title: Patterns become organizational APIs at team scale
  explanation: |
    At principal level, a pattern can become an API between teams, not just a class structure.

    A Strategy registry for pricing, an Observer event bus for order events, or an Adapter layer for payments may define how many teams ship work. The pattern must match ownership boundaries. If every team can add behavior, the core team owns contracts, validation, documentation, migration paths, and operational visibility.

    Where to apply:
    Use this lens for platform services, shared SDKs, checkout, pricing, notifications, workflow engines, and integration hubs. Ask which team owns the extension point, which teams implement extensions, and who is paged when an extension fails.

    Do not confuse with:
    A code interface does not create organizational clarity by itself. Without ownership and support rules, a shared abstraction becomes shared confusion.
  examples:
  - label: Owned extension API
    description: Pricing platform owns the strategy contract and each market owns its rule implementation.
    code: |
      pricing_registry.register(
          market="ES",
          owner="market-es",
          rule=SpainPricingRule(),
      )
  - label: Unowned shared hook
    description: Anyone can mutate checkout with no owner, version, or failure contract.
    code: |
      CHECKOUT_HOOKS.append(lambda order: order.items.clear())
  - label: Support boundary
    description: Registration metadata makes ownership visible during incidents.
    code: |
      registry.register(owner="billing-team", extension=InvoiceExtension())
  difficulty: principal
- title: Core invariants stay closed while extension stays open
  explanation: |
    At principal level, Open/Closed design must protect invariants, not only allow plugins.

    Extension points are useful when teams need to add behavior independently. They are dangerous when extensions can break accounting, authorization, state transitions, or customer promises. Principal design defines what extensions may decide and what the core always validates after extension output.

    Where to apply:
    Use this around checkout, payments, ledger updates, permissions, fulfillment, identity, and compliance workflows. Let extensions propose decisions, adjustments, or side effects. Keep final validation and state transitions inside the owning core.

    Do not confuse with:
    "Open for extension" does not mean "any extension can do anything." The stable core should be closed around correctness rules.
  examples:
  - label: Extension proposes
    description: Tax extension returns adjustments instead of mutating the order directly.
    code: |
      decision = tax_extension.evaluate(context)
      ledger.assert_balanced(decision.adjustments)
      order.apply_adjustments(decision.adjustments)
  - label: Core validates
    description: Authorization is checked after extension output and before state change.
    code: |
      decision = registry.evaluate("before_capture", context)
      authorization.require_allowed(user, "capture_payment")
      payments.capture(order, decision.amount)
  - label: Unsafe mutation
    description: Extension can silently bypass core invariants.
    code: |
      def plugin(order):
          order.status = "paid"
  difficulty: principal
- title: Version pattern contracts before they become permanent
  explanation: |
    At principal level, shared Strategy, Adapter, Observer, Command, and Template Method contracts need lifecycle management.

    Once many services, plugins, or teams depend on a contract, changing method names is the easy part. The hard parts are data compatibility, behavior expectations, retry semantics, ordering guarantees, and migration. Versioning lets old and new implementations coexist while teams move safely.

    Where to apply:
    Use contract versions for public events, extension hooks, provider adapters, command payloads, workflow templates, and SDK interfaces. Publish deprecation dates and provide compatibility tests so implementers know when they are safe.

    Do not confuse with:
    Versioning is not needed for every internal class. Add it when the contract crosses team, service, package, tenant, or partner boundaries.
  examples:
  - label: Versioned hook
    description: Extensions declare the contract version they implement.
    code: |
      registry.register(
          phase="after_order_created",
          version="2026-01",
          extension=SendInvoice(),
      )
  - label: Event compatibility
    description: Consumers can migrate from v1 to v2 without stopping production traffic.
    code: |
      events.publish("order_placed.v1", old_payload)
      events.publish("order_placed.v2", new_payload)
  - label: Contract test suite
    description: Implementers run the shared test pack before registration.
    code: |
      run_contract_tests(extension, version="2026-01")
  difficulty: principal
- title: Rollout and observability are part of extension design
  explanation: |
    At principal level, design patterns that allow extension also need production controls.

    A new strategy, subscriber, command handler, or adapter can be correct in tests and still fail under traffic. Principal design includes feature flags, canary rollout, per-extension metrics, tracing, timeouts, circuit breakers, and kill switches. Without these controls, one extension can degrade the whole platform.

    Where to apply:
    Use rollout controls for plugin registries, pricing strategies, notification observers, import handlers, payment adapters, and workflow hooks. Treat each extension as a deployable risk with its own health signals.

    Do not confuse with:
    Observability is not an afterthought. If the architecture allows independent behavior, it must also allow independent diagnosis and rollback.
  examples:
  - label: Feature-gated strategy
    description: New pricing rule can be enabled for one market before global rollout.
    code: |
      if flags.enabled("new-pricing", market):
          rule = NewPricingRule()
      else:
          rule = CurrentPricingRule()
  - label: Per-extension metrics
    description: Failures are attributed to the extension owner.
    code: |
      metrics.count("extension.failure", tags={"owner": extension.owner})
  - label: Kill switch
    description: A bad subscriber can be disabled without disabling the event bus.
    code: |
      registry.disable(extension_id, reason="high error rate")
  difficulty: principal
- title: Distributed systems can make local patterns misleading
  explanation: |
    At principal level, GoF patterns must be adapted carefully across service boundaries.

    A local Observer is an in-process callback. A distributed event system has delivery guarantees, ordering, schema evolution, and replay. A local Proxy is a cheap wrapper. A remote proxy adds latency, partial failure, retries, and timeout policy. A local Command may be a method object. A distributed command may need idempotency, authorization, and audit.

    Where to apply:
    Use this caution when a pattern crosses process, network, package, or team boundaries. Keep the pattern vocabulary, but design for distributed reality: failure, ownership, compatibility, observability, and operations.

    Do not confuse with:
    A familiar pattern name does not remove distributed-system risk. Once a call leaves the process, it needs an explicit reliability contract.
  examples:
  - label: Local observer
    description: Callback either runs now or raises in the same process.
    code: |
      order.on_placed(send_email)
  - label: Distributed event
    description: Consumer may receive duplicates or delayed messages.
    code: |
      events.publish("order_placed.v2", {"order_id": order.id})
  - label: Remote proxy contract
    description: Timeout behavior is part of the interface.
    code: |
      inventory.available(sku, timeout=2, fallback="unknown")
  difficulty: principal
- title: Teach pattern decisions through tradeoffs, not labels
  explanation: |
    At principal level, part of the job is helping teams make better design decisions without turning patterns into dogma.

    Good guidance explains when to use a pattern, when to avoid it, what risk it reduces, and what cost it introduces. Teams should learn to compare options: Strategy versus State, Adapter versus Facade, Observer versus direct workflow, Template Method versus composition. The result is a shared decision language, not a checklist of class names.

    Where to apply:
    Use tradeoff-based teaching in architecture reviews, onboarding docs, code review comments, and platform guidelines. Keep examples close to the company's real systems so the guidance transfers to production work.

    Do not confuse with:
    Pattern education is not memorization. A principal-level answer should include context, force, tradeoff, and failure mode.
  examples:
  - label: Decision record
    description: Record the force behind the pattern so future teams know why it exists.
    code: |
      # Use Adapter because checkout must not depend on provider fields.
      payments = StripePaymentAdapter(client)
  - label: Review prompt
    description: Ask what change the abstraction protects and what cost it adds.
    code: |
      # What makes this Strategy better than a local function?
      result = rule.apply(context)
  - label: Teach the pair
    description: Similar patterns are learned by contrast.
    code: |
      # State: behavior changes because order.status changes.
      # Strategy: behavior changes because caller chooses a rule.
  difficulty: principal
---
