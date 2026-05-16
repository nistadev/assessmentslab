---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Strategy swaps algorithms without changing the caller
  explanation: |
    Strategy pattern moves a changing algorithm behind a shared interface.

    The useful question is "what part of this behavior changes while the rest of the workflow stays the same?" If an exporter always loads data, validates it, and returns a file, but the output format changes between JSON, CSV, and XML, the format rule is the strategy. The caller should not need a growing if/else chain for every new format.

    Where to apply:
    Use Strategy when one step can be replaced without changing the surrounding process. Common examples are sorting rules, discount rules, validation rules, pricing rules, export formats, and retry policies. The context owns the stable workflow. The strategy owns the variable decision.

    Do not confuse with:
    Strategy is not the same as dependency injection. Dependency injection is a way to pass a collaborator in. Strategy is the design choice that the collaborator represents an interchangeable algorithm. Do not introduce Strategy for one branch that is unlikely to grow. A simple if statement can be clearer until change pressure appears.
  examples:
  - label: Format branching
    description: Every new export format requires editing the same function and retesting existing formats.
    code: |
      def export(data, format):
          if format == "json":
              return to_json(data)
          if format == "csv":
              return to_csv(data)
          if format == "xml":
              return to_xml(data)
          raise ValueError("Unknown format")
  - label: Format strategy
    description: The exporter delegates formatting to an object or function with the same contract.
    code: |
      class DataExporter:
          def __init__(self, formatter):
              self.formatter = formatter

          def export(self, data):
              return self.formatter(data)

      json_exporter = DataExporter(to_json)
      csv_exporter = DataExporter(to_csv)
  - label: Not worth abstracting yet
    description: If only one rule exists and no new variants are expected, a strategy object adds ceremony without payoff.
    code: |
      def shipping_fee(order):
          return 5 if order.country == "local" else 15
  difficulty: junior
- title: Observer notifies interested code without hard-coding receivers
  explanation: |
    Observer pattern lets one object publish an event while other objects subscribe to react.

    The useful question is "who needs to know this happened?" If an order is placed, email, inventory, analytics, fraud checks, and warehouse systems may all care. The order placement code should not need to know every current and future reaction. It should publish a clear event, and subscribers should decide what to do.

    Where to apply:
    Use Observer around events that can have multiple independent reactions. Common examples are UI events, domain events, webhooks, message buses, cache invalidation, notifications, and analytics tracking. It is especially useful when adding a new reaction should not require editing the publisher.

    Do not confuse with:
    Observer is not a replacement for direct calls when there is exactly one required next step. If checkout must charge payment before creating the order, that is part of the workflow and should be explicit. Observer fits side effects that can be added, removed, retried, or owned independently.
  examples:
  - label: Hard-coded reactions
    description: OrderService must change whenever another team wants to react to a placed order.
    code: |
      class OrderService:
          def place_order(self, order):
              save_order(order)
              send_email(order)
              update_inventory(order)
              notify_warehouse(order)
  - label: Event subscribers
    description: The publisher emits one event. New reactions register beside existing ones.
    code: |
      bus.on("order_placed", send_email)
      bus.on("order_placed", update_inventory)
      bus.on("order_placed", notify_warehouse)

      class OrderService:
          def place_order(self, order):
              save_order(order)
              bus.emit("order_placed", order)
  - label: Keep required workflow direct
    description: Payment must happen before the order is accepted, so hiding it behind an event can make the business flow unclear.
    code: |
      def place_order(order):
          payment.charge(order)
          save_order(order)
          bus.emit("order_placed", order)
  difficulty: junior
- title: Factory centralizes object creation when setup has rules
  explanation: |
    Factory pattern puts object creation behind a function or class that understands which concrete object to build.

    The useful question is "is construction becoming a decision?" Calling a constructor directly is fine when there is one obvious object. A factory helps when the choice depends on input, configuration, environment, feature flags, or a stable string from outside the program. The caller asks for the capability it needs instead of knowing each concrete class.

    Where to apply:
    Use Factory when many callers repeat the same creation logic or when creation rules must stay consistent. Common examples are choosing a payment gateway by country, building storage clients by environment, creating parsers by file type, and selecting notification senders by channel.

    Do not confuse with:
    Factory is not "never call constructors." Direct construction is the clearest option for simple objects. Factory is also not only a class named Factory. A small function can be the best factory if it hides the creation decision cleanly.
  examples:
  - label: Repeated creation decisions
    description: Each caller must know the same mapping from channel name to concrete sender.
    code: |
      def send_message(channel, user, body):
          if channel == "email":
              sender = EmailSender()
          elif channel == "sms":
              sender = SmsSender()
          else:
              sender = PushSender()

          sender.send(user, body)
  - label: Creation factory
    description: The mapping lives in one place. Callers receive an object with the behavior they need.
    code: |
      def create_sender(channel):
          if channel == "email":
              return EmailSender()
          if channel == "sms":
              return SmsSender()
          return PushSender()

      sender = create_sender(channel)
      sender.send(user, body)
  - label: Direct construction is fine
    description: A plain value object with no creation decision does not need a factory wrapper.
    code: |
      address = Address(
          street="Main Street",
          city="Madrid",
      )
  difficulty: junior
- title: Adapter makes incompatible interfaces fit existing code
  explanation: |
    Adapter pattern wraps one interface so it looks like another interface the application already expects.

    The useful question is "can I keep my code's contract stable while changing the outside dependency?" External libraries, vendor SDKs, old modules, and third-party APIs rarely match the names, inputs, and return values your code wants. An adapter translates between the two sides so the rest of the application does not learn vendor-specific details.

    Where to apply:
    Use Adapter at boundaries: payment providers, email services, file storage, analytics SDKs, legacy systems, or UI libraries. It is most useful when you need to switch vendors, test without the vendor, or protect business code from messy external shapes.

    Do not confuse with:
    Adapter is not a place to hide business rules. It should translate calls and data shapes. If the wrapper starts deciding pricing, eligibility, or permissions, it is doing more than adaptation and should be split.
  examples:
  - label: Vendor shape leaks in
    description: Business code depends on vendor method names and response details.
    code: |
      def send_welcome_email(user):
          response = vendor_client.messages.create(
              recipient=user.email,
              template_id="welcome",
          )
          return response["message_id"]
  - label: Stable app interface
    description: The adapter owns vendor-specific names. Application code uses one stable contract.
    code: |
      class VendorEmailAdapter:
          def __init__(self, client):
              self.client = client

          def send_template(self, to, template):
              response = self.client.messages.create(
                  recipient=to,
                  template_id=template,
              )
              return response["message_id"]

      email.send_template(user.email, "welcome")
  - label: Keep policy outside
    description: The adapter should not decide whether the user deserves the email. That rule belongs in application code.
    code: |
      if user.accepted_marketing:
          email.send_template(user.email, "weekly-summary")
  difficulty: junior
- title: Decorator adds behavior around an object without changing it
  explanation: |
    Decorator pattern wraps an object with another object that has the same interface and adds behavior before or after delegating.

    The useful question is "can this extra behavior sit around the existing operation?" Logging, caching, authorization, retries, timing, validation, and compression often surround a core action. Decorator lets you add those behaviors without editing the original class and without creating many subclasses for every combination.

    Where to apply:
    Use Decorator when features are optional, stackable, or cross-cutting. A repository can be wrapped with caching. An HTTP client can be wrapped with retry and logging. A file reader can be wrapped with decompression. Each wrapper keeps the same public method so callers can use the decorated object like the original.

    Do not confuse with:
    Decorator is not the same as inheritance. Inheritance changes behavior by making a subtype. Decorator changes behavior by composition at runtime. Also avoid decorators that change the meaning of the method so much that callers get a surprise.
  examples:
  - label: Core service edited for caching
    description: Caching code is mixed into fetching code, so the service now has two reasons to change.
    code: |
      class ProductRepository:
          def find_by_id(self, product_id):
              cached = cache.get(product_id)
              if cached:
                  return cached

              product = db.query("select * from products where id = %s", [product_id])
              cache.set(product_id, product)
              return product
  - label: Cache decorator
    description: The wrapper has the same method as the original repository and adds caching around it.
    code: |
      class CachedProductRepository:
          def __init__(self, repository, cache):
              self.repository = repository
              self.cache = cache

          def find_by_id(self, product_id):
              cached = self.cache.get(product_id)
              if cached:
                  return cached

              product = self.repository.find_by_id(product_id)
              self.cache.set(product_id, product)
              return product
  - label: Stackable wrappers
    description: Logging and caching can be composed without changing the base repository.
    code: |
      repository = ProductRepository(db)
      repository = CachedProductRepository(repository, cache)
      repository = LoggedProductRepository(repository, logger)
  difficulty: junior
---
