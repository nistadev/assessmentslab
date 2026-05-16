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
---
