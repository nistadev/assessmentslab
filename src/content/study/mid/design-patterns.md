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
- title: Pattern groups reveal the kind of design pressure
  explanation: |
    At mid level, knowing pattern names is not enough. You should identify which kind of problem the code has.

    Creational patterns answer "how should this object be built?" Structural patterns answer "how should these objects fit together?" Behavioral patterns answer "how should these objects communicate or vary behavior?" Starting from the design pressure keeps pattern choice practical instead of vocabulary-driven.

    Where to apply:
    Use the three groups as a first filter during review. If callers repeat constructor choices, look at creational patterns. If the issue is an awkward boundary or composition shape, look at structural patterns. If the issue is branching behavior, workflow, events, or responsibility assignment, look at behavioral patterns.

    Do not confuse with:
    The group is not the final answer. It narrows the search. You still need to choose the specific pattern based on what changes, who owns it, and what callers should know.
  examples:
  - label: Creational pressure
    description: Callers repeat the same object choice from a type key.
    code: |
      if kind == "csv":
          parser = CsvParser()
      else:
          parser = JsonParser()
  - label: Structural pressure
    description: Application code speaks directly to a vendor-specific interface.
    code: |
      result = vendor.charge_card(card_number=card.number, amount_cents=cents)
  - label: Behavioral pressure
    description: One workflow changes only the pricing rule.
    code: |
      total = pricing_rule.apply(order)
      payment.charge(order.customer, total)
  difficulty: mid
- title: Creation patterns solve different object setup problems
  explanation: |
    At mid level, Factory, Abstract Factory, Builder, Prototype, and Singleton should be separated by intent.

    Factory chooses one product. Abstract Factory chooses a family of products that must work together. Builder makes complex setup readable and valid. Prototype copies a prepared object when setup is repetitive or expensive. Singleton shares one process-wide instance, but adds global-state risk.

    Where to apply:
    Use creation patterns when callers should not know concrete construction details. Ask whether the problem is selection, family consistency, step-by-step setup, copying defaults, or one shared lifecycle.

    Do not confuse with:
    Do not use the most complicated creation pattern because it sounds more formal. A function can be a factory. A constructor can be enough. Builder and Abstract Factory are useful when the object setup shape truly needs them.
  examples:
  - label: Factory selection
    description: One external key chooses one parser.
    code: |
      parser = create_parser(file_extension)
      rows = parser.parse(file)
  - label: Abstract Factory family
    description: The same factory creates compatible UI pieces.
    code: |
      theme = DarkThemeFactory()
      button = theme.create_button()
      dialog = theme.create_dialog()
  - label: Builder setup
    description: Builder makes optional settings visible and named.
    code: |
      request = (
          RequestBuilder()
          .to("/reports")
          .with_timeout(5)
          .with_retry(3)
          .build()
      )
  difficulty: mid
- title: Wrapping patterns differ by intent
  explanation: |
    At mid level, Adapter, Facade, Proxy, and Decorator are often confused because they all wrap something.

    Adapter translates an incompatible interface. Facade simplifies a complex subsystem. Proxy controls access, cost, or lifecycle. Decorator adds optional behavior while preserving the same contract. The code shape may look similar, so the reason for the wrapper matters.

    Where to apply:
    Use this distinction when reviewing wrappers around SDKs, HTTP clients, repositories, caches, authorization checks, and legacy systems. Ask what the wrapper is mainly doing: translating, simplifying, controlling access, or adding behavior.

    Do not confuse with:
    A wrapper that does everything becomes unclear. If one class adapts vendor fields, checks permissions, caches results, and runs business policy, split it into smaller collaborators with clearer jobs.
  examples:
  - label: Adapter translates
    description: Vendor units and names are hidden behind the app contract.
    code: |
      payments.charge(card, Money.usd("9.99"))
  - label: Facade simplifies
    description: A multi-step subsystem becomes one common operation.
    code: |
      video.export("input.mov", "output.mp4")
  - label: Proxy controls access
    description: The call reaches the real object only after permission passes.
    code: |
      document = ProtectedDocument(real_document, permissions)
      document.read(current_user)
  - label: Decorator adds behavior
    description: The same client gains retry behavior around existing calls.
    code: |
      client = RetryingHttpClient(HttpClient(), attempts=3)
  difficulty: mid
- title: Behavior variation patterns answer different questions
  explanation: |
    At mid level, behavioral patterns should be chosen by the kind of variation.

    Strategy asks "which algorithm should be used?" State asks "what behavior applies in this current state?" Template Method asks "which steps can vary inside a fixed workflow?" Chain of Responsibility asks "which handler should receive this request?" Interpreter asks "how do we evaluate a small rule language?"

    Where to apply:
    Use these patterns when if/else branching repeats across methods or grows around a clear decision point. The repeated branch usually reveals the change axis: algorithm, state, workflow step, handler selection, or expression evaluation.

    Do not confuse with:
    One branch is not automatically a pattern. Apply the pattern when it reduces repeated change, improves testing, or makes ownership clearer.
  examples:
  - label: Strategy question
    description: The checkout flow is stable, but the discount algorithm changes.
    code: |
      total = discount_strategy.apply(order)
  - label: State question
    description: The same action means different things for pending and shipped orders.
    code: |
      order.state.cancel(order)
  - label: Chain question
    description: Each handler can process the request or pass it forward.
    code: |
      auth.set_next(rate_limit).set_next(controller)
      response = auth.handle(request)
  difficulty: mid
- title: Communication patterns control who knows about whom
  explanation: |
    At mid level, Observer, Mediator, Command, and Memento help separate communication and action ownership.

    Observer lets many subscribers react to an event. Mediator keeps a group of objects from directly knowing each other. Command packages an action as data. Memento saves state for restore or undo without exposing internals. These patterns are useful when direct calls create coupling or when actions need history.

    Where to apply:
    Use Observer for independent reactions, Mediator for dense peer-to-peer coordination, Command for queueable or undoable actions, and Memento for rollback snapshots. Ask whether the problem is notification, coordination, action lifecycle, or state restoration.

    Do not confuse with:
    Do not hide required workflow steps behind events. If payment must happen before order creation, make it explicit. Observer fits side effects and independent reactions.
  examples:
  - label: Observer event
    description: Email and analytics can react independently after the order is placed.
    code: |
      bus.emit("order_placed", order)
  - label: Command object
    description: A job queue stores the work to perform later.
    code: |
      queue.enqueue(SendReceipt(order.id))
  - label: Memento snapshot
    description: The editor stores state before applying a risky change.
    code: |
      snapshot = editor.save()
      editor.replace_selection("new text")
      editor.restore(snapshot)
  difficulty: mid
- title: Structure patterns help with trees, traversal, and shared data
  explanation: |
    At mid level, Composite, Iterator, Visitor, and Flyweight often appear around data structures, documents, and UI trees.

    Composite lets a single item and a group share an interface. Iterator hides traversal details. Visitor adds operations to a stable object structure. Flyweight shares repeated immutable data so many objects do not duplicate it.

    Where to apply:
    Use these patterns when the object structure itself matters: nested folders, menus, document nodes, AST nodes, map markers, icons, and large collections. Ask whether the issue is grouping, walking, adding operations, or reducing repeated memory.

    Do not confuse with:
    Visitor fits stable element types with changing operations. If new element types are added often, Visitor can become expensive because every visitor may need updates.
  examples:
  - label: Composite tree
    description: A folder and a file can both answer size.
    code: |
      total = item.size()
  - label: Iterator traversal
    description: Caller loops without knowing storage details.
    code: |
      for song in playlist:
          play(song)
  - label: Visitor operation
    description: Export logic sits outside document nodes.
    code: |
      document.accept(HtmlExportVisitor())
  difficulty: mid
---
