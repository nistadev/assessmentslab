---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Strategy swaps algorithms without changing the caller
  explanation: |
    Group: Behavioral pattern.

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
    Group: Behavioral pattern.

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
    Group: Creational pattern.

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
    Group: Structural pattern.

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
    Group: Structural pattern.

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
- title: Singleton shares one instance for one process-wide responsibility
  explanation: |
    Group: Creational pattern.

    Singleton pattern makes sure a class has only one shared instance.

    The useful question is "does this object truly have one lifecycle for the whole process?" Loggers, configuration snapshots, and connection pools sometimes fit. A singleton can prevent repeated setup and make shared infrastructure easy to reach, but it also creates global state pressure. If one part of the program mutates the singleton, every other part sees that mutation.

    Where to apply:
    Use Singleton sparingly for process-wide resources that are created once at application startup. Prefer passing the instance into code that needs it instead of letting deep code fetch it from a global location.

    Do not confuse with:
    Singleton is not a shortcut for dependency injection. It is also not a good default for ordinary services. If tests need to reset hidden global state, the singleton is making code harder to reason about.
  examples:
  - label: Shared logger instance
    description: Each call returns the same logger object.
    code: |
      class Logger:
          _instance = None

          def __new__(cls):
              if cls._instance is None:
                  cls._instance = super().__new__(cls)
              return cls._instance

      first = Logger()
      second = Logger()
      print(first is second)  # True
  - label: Hidden test coupling
    description: State stored on the singleton can leak between tests.
    code: |
      Logger().level = "debug"
      assert Logger().level == "info"  # may fail later
  difficulty: junior
- title: Abstract Factory builds related objects that must work together
  explanation: |
    Group: Creational pattern.

    Abstract Factory pattern creates families of related objects without callers choosing each concrete class.

    The useful question is "do these objects need to come from the same family?" A light theme button should usually pair with a light theme dialog. A Stripe payment form should pair with a Stripe payment client. Abstract Factory keeps those related choices in one place so callers do not accidentally mix incompatible parts.

    Where to apply:
    Use Abstract Factory when the product family matters more than one object. Common examples are UI widgets, cross-platform components, payment provider bundles, storage provider bundles, and test doubles for a whole subsystem.

    Do not confuse with:
    Abstract Factory is not needed when you only create one object. A simple factory is clearer for one product type. Abstract Factory pays off when several objects must be selected together.
  examples:
  - label: Mixed family risk
    description: Callers manually choose each class and can accidentally combine incompatible objects.
    code: |
      button = LightButton()
      dialog = DarkDialog()  # mixed theme
  - label: Theme factory
    description: The factory creates related widgets from the same family.
    code: |
      class LightThemeFactory:
          def create_button(self):
              return LightButton()

          def create_dialog(self):
              return LightDialog()

      factory = LightThemeFactory()
      button = factory.create_button()
      dialog = factory.create_dialog()
  difficulty: junior
- title: Builder assembles complex objects step by step
  explanation: |
    Group: Creational pattern.

    Builder pattern separates object construction from the final object.

    The useful question is "is construction becoming hard to read?" A constructor with many optional parameters, repeated setup steps, or order-sensitive configuration can become confusing. A builder gives names to each setup step and then creates the final object when required data is ready.

    Where to apply:
    Use Builder for objects with many optional settings, validation before creation, readable test data setup, query builders, request builders, and complex value objects. It is most useful when construction has several meaningful steps.

    Do not confuse with:
    Builder is not needed for small objects with two or three obvious fields. A plain constructor or factory function is usually clearer until construction becomes noisy.
  examples:
  - label: Constructor noise
    description: Many positional arguments make it easy to swap values by mistake.
    code: |
      report = Report("sales", True, False, "csv", None, "Europe/Madrid")
  - label: Named build steps
    description: Each step explains what part of the object is being configured.
    code: |
      report = (
          ReportBuilder()
          .named("sales")
          .with_format("csv")
          .with_timezone("Europe/Madrid")
          .build()
      )
  difficulty: junior
- title: Prototype copies an existing object when setup is expensive or repetitive
  explanation: |
    Group: Creational pattern.

    Prototype pattern creates a new object by copying an existing configured object.

    The useful question is "do many objects start from the same setup?" If creating an object requires many default values, expensive loading, or detailed configuration, it can be cheaper and clearer to clone a prepared prototype and then change the few fields that differ.

    Where to apply:
    Use Prototype for template objects, configured documents, game objects, UI components, test fixtures, and objects with expensive initialization. Make sure copied objects do not accidentally share mutable state such as lists or dictionaries.

    Do not confuse with:
    Prototype is not the same as assignment. Assignment creates another reference to the same object. Prototype needs a real copy when the new object should change independently.
  examples:
  - label: Shared reference bug
    description: Assignment does not create a new notification.
    code: |
      welcome = Notification("Welcome", tags=[])
      reminder = welcome
      reminder.tags.append("reminder")
      print(welcome.tags)  # ["reminder"]
  - label: Copy from prototype
    description: Each new object starts from the same defaults but can change independently.
    code: |
      welcome = Notification("Welcome", tags=[])
      reminder = welcome.copy()
      reminder.title = "Payment reminder"
      reminder.tags.append("billing")
  difficulty: junior
- title: Bridge separates what an object does from how it is implemented
  explanation: |
    Group: Structural pattern.

    Bridge pattern splits an abstraction from its implementation so both can vary independently.

    The useful question is "am I creating subclasses for every combination?" If reports can be summary or detailed, and each report can render as HTML or PDF, inheritance can produce SummaryHtmlReport, SummaryPdfReport, DetailedHtmlReport, and DetailedPdfReport. Bridge keeps report type separate from renderer type.

    Where to apply:
    Use Bridge when two dimensions change independently. Common examples are shape plus drawing API, report plus renderer, notification plus delivery channel, and remote control plus device.

    Do not confuse with:
    Bridge is not Adapter. Adapter makes an incompatible interface fit after the fact. Bridge is designed upfront to keep two change axes separate.
  examples:
  - label: Subclass combinations
    description: Every report type and format combination needs another class.
    code: |
      class SummaryPdfReport:
          pass

      class SummaryHtmlReport:
          pass

      class DetailPdfReport:
          pass
  - label: Report bridge
    description: Report behavior and rendering behavior vary independently.
    code: |
      class Report:
          def __init__(self, renderer):
              self.renderer = renderer

          def export(self, data):
              return self.renderer.render(data)

      report = Report(PdfRenderer())
  difficulty: junior
- title: Composite treats single objects and groups the same way
  explanation: |
    Group: Structural pattern.

    Composite pattern lets clients use individual objects and groups through the same interface.

    The useful question is "does this structure form a tree?" Files and folders, menus and menu items, comments and replies, and UI containers and controls all have leaf items and parent groups. Composite lets code ask both a single file and a folder for size, render output, or child content through the same method.

    Where to apply:
    Use Composite for tree-like structures where operations should apply recursively. Common examples are file systems, organization charts, nested menus, UI component trees, and product bundles.

    Do not confuse with:
    Composite is not needed for a flat list. It is useful when objects can contain other objects of the same general kind.
  examples:
  - label: Separate handling
    description: Caller must know whether it has a file or folder.
    code: |
      if item.is_folder:
          total = sum(child.size() for child in item.children)
      else:
          total = item.size()
  - label: Shared interface
    description: File and folder both answer size, so callers do not branch on type.
    code: |
      class Folder:
          def __init__(self, children):
              self.children = children

          def size(self):
              return sum(child.size() for child in self.children)

      total = item.size()
  difficulty: junior
- title: Facade gives a simple entry point to a complex subsystem
  explanation: |
    Group: Structural pattern.

    Facade pattern provides one simple interface over several detailed classes or services.

    The useful question is "do callers need to know too much setup detail?" A video export may require loading codecs, opening files, selecting compression, writing metadata, and cleaning temporary files. Most callers only want export_video(input, format). A facade hides the subsystem workflow behind a clearer API.

    Where to apply:
    Use Facade around complicated libraries, legacy systems, multi-step workflows, SDKs, and internal modules with many moving parts. It is especially useful when most callers need the same high-level use case.

    Do not confuse with:
    Facade is not Adapter. Adapter changes an interface to match another expected interface. Facade simplifies a subsystem. It should not hide important errors or make the subsystem impossible to use directly when advanced callers need it.
  examples:
  - label: Subsystem details leak
    description: Every caller must know the same export sequence.
    code: |
      codec = CodecRegistry().find("mp4")
      reader = VideoReader(path)
      compressor = Compressor(codec)
      writer = VideoWriter(output)
      writer.write(compressor.compress(reader.frames()))
  - label: Simple facade
    description: The common workflow sits behind one focused method.
    code: |
      class VideoFacade:
          def export(self, path, output, format):
              codec = CodecRegistry().find(format)
              frames = VideoReader(path).frames()
              VideoWriter(output).write(Compressor(codec).compress(frames))

      video.export("input.mov", "output.mp4", "mp4")
  difficulty: junior
- title: Flyweight shares repeated immutable data to save memory
  explanation: |
    Group: Structural pattern.

    Flyweight pattern reuses small shared objects when many objects would otherwise duplicate the same data.

    The useful question is "are thousands of objects storing the same values?" A text editor may display many characters with the same font data. A map may show many markers with the same icon. Flyweight keeps shared intrinsic data in one object and passes unique external data, such as position, separately.

    Where to apply:
    Use Flyweight when memory cost matters and many objects share repeated immutable state. Common examples are text rendering, icons, map markers, game objects, and cached value objects.

    Do not confuse with:
    Flyweight is not ordinary caching for expensive calls. It is mainly about sharing repeated object data. Shared flyweight data should be immutable so one caller cannot corrupt all users.
  examples:
  - label: Duplicated icon data
    description: Every marker stores the same large icon bytes.
    code: |
      markers = [
          Marker(x=10, y=20, icon_bytes=load_icon("hotel")),
          Marker(x=12, y=25, icon_bytes=load_icon("hotel")),
      ]
  - label: Shared icon flyweight
    description: Marker position is unique, while icon data is shared.
    code: |
      hotel_icon = IconFactory.get("hotel")
      markers = [
          Marker(x=10, y=20, icon=hotel_icon),
          Marker(x=12, y=25, icon=hotel_icon),
      ]
  difficulty: junior
- title: Proxy controls access to another object through the same interface
  explanation: |
    Group: Structural pattern.

    Proxy pattern stands in front of another object and controls access to it.

    The useful question is "should this call reach the real object right now?" A proxy can lazy-load expensive data, check permissions, call a remote service, cache a result, or add rate limiting. Callers use the same kind of method, but the proxy decides how and when the real object is reached.

    Where to apply:
    Use Proxy for lazy loading, protected resources, remote clients, cached reads, and expensive objects. It is common in ORMs, API clients, document systems, and image loading.

    Do not confuse with:
    Proxy and Decorator both wrap objects. Decorator adds optional behavior around an operation. Proxy controls access to the underlying object.
  examples:
  - label: Lazy loading
    description: The report is loaded only when rows are requested.
    code: |
      class ReportProxy:
          def __init__(self, report_id):
              self.report_id = report_id
              self._report = None

          def rows(self):
              if self._report is None:
                  self._report = load_report(self.report_id)
              return self._report.rows()
  - label: Permission proxy
    description: Access check happens before the real document is read.
    code: |
      class ProtectedDocument:
          def __init__(self, document, permissions):
              self.document = document
              self.permissions = permissions

          def read(self, user):
              self.permissions.require(user, "read")
              return self.document.read()
  difficulty: junior
- title: Chain of Responsibility passes a request through possible handlers
  explanation: |
    Group: Behavioral pattern.

    Chain of Responsibility pattern gives several handlers a chance to process a request.

    The useful question is "which handler should deal with this?" Instead of one large if/else block deciding every support ticket, request, or validation rule, each handler checks whether it can handle the request. If not, it passes the request to the next handler.

    Where to apply:
    Use Chain of Responsibility for middleware, validation pipelines, support routing, logging filters, request processing, and fallback lookup. It works best when handlers are independent and order is clear.

    Do not confuse with:
    Chain of Responsibility is not a good fit for required steps that must all run. If payment, inventory, and order save must happen in order, use an explicit workflow. Chain fits "handle or pass along" decisions.
  examples:
  - label: Large routing branch
    description: One function owns every support rule.
    code: |
      def route(ticket):
          if ticket.kind == "billing":
              return billing.handle(ticket)
          if ticket.kind == "technical":
              return technical.handle(ticket)
          return general.handle(ticket)
  - label: Handler chain
    description: Each handler owns one decision and passes unhandled tickets forward.
    code: |
      billing.set_next(technical).set_next(general)
      result = billing.handle(ticket)
  difficulty: junior
- title: Command turns a request into an object
  explanation: |
    Group: Behavioral pattern.

    Command pattern wraps an action and the data needed to run it inside an object.

    The useful question is "does this action need its own lifecycle?" Once an action is an object, it can be queued, logged, retried, delayed, stored, authorized, or undone. Buttons, menu items, background jobs, and undo stacks can all hold commands without knowing every concrete action.

    Where to apply:
    Use Command for undo and redo, task queues, UI actions, scheduled jobs, audit logs, and workflows where actions are chosen now but executed later.

    Do not confuse with:
    Command is not needed for every method call. If the action happens immediately and never needs queueing, logging, retry, or undo as a unit, a direct call is clearer.
  examples:
  - label: Direct button action
    description: The button knows exactly which function to call.
    code: |
      save_button.on_click(lambda: document.save())
  - label: Save command
    description: The button receives an executable action object.
    code: |
      class SaveDocument:
          def __init__(self, document):
              self.document = document

          def execute(self):
              self.document.save()

      save_button.command = SaveDocument(document)
  difficulty: junior
- title: Interpreter evaluates a small language or expression grammar
  explanation: |
    Group: Behavioral pattern.

    Interpreter pattern represents grammar rules as objects that can evaluate sentences in a small language.

    The useful question is "do users or config need to express rules?" Search filters, simple formulas, permission expressions, and validation rules may have a small grammar such as "country is ES and total over 100." Interpreter models each expression type and evaluates it against a context.

    Where to apply:
    Use Interpreter for small, stable languages where rules are simple enough to represent in code. It can work for filters, calculators, simple policy rules, and educational parsers.

    Do not confuse with:
    Interpreter is not a reason to invent a language for normal configuration. If a few settings or if statements solve the problem clearly, use those. For complex languages, use a real parser or existing engine.
  examples:
  - label: Expression objects
    description: Each expression knows how to evaluate itself against data.
    code: |
      class CountryIs:
          def __init__(self, country):
              self.country = country

          def evaluate(self, order):
              return order.country == self.country

      rule = CountryIs("ES")
      print(rule.evaluate(order))
  - label: Composed expression
    description: Small expressions can be combined into a larger rule.
    code: |
      rule = And(CountryIs("ES"), TotalOver(100))
      if rule.evaluate(order):
          apply_free_shipping(order)
  difficulty: junior
- title: Iterator walks through a collection without exposing its internals
  explanation: |
    Group: Behavioral pattern.

    Iterator pattern provides a standard way to move through items in a collection.

    The useful question is "should callers know how this collection is stored?" A playlist, tree, paginated API, or custom data structure may store items in a way callers should not depend on. Iterator lets callers ask for the next item without knowing internal indexes, nodes, or pages.

    Where to apply:
    Use Iterator for custom collections, lazy streams, paginated results, tree traversal, and anything where traversal rules should be hidden behind a simple loop.

    Do not confuse with:
    Many languages already provide iterator support. Use the built-in protocol when possible instead of creating custom iterator classes for normal lists.
  examples:
  - label: Internal storage leak
    description: Caller reaches into the playlist list directly.
    code: |
      for index in range(len(playlist.songs)):
          play(playlist.songs[index])
  - label: Collection iterator
    description: Caller loops over the playlist without knowing how songs are stored.
    code: |
      class Playlist:
          def __iter__(self):
              return iter(self._songs)

      for song in playlist:
          play(song)
  difficulty: junior
- title: Mediator coordinates objects so they do not all know each other
  explanation: |
    Group: Behavioral pattern.

    Mediator pattern puts communication between related objects into a central coordinator.

    The useful question is "are these objects calling each other in a messy web?" Dialog fields, buttons, and panels often react to each other. Chat users send messages to a room, not directly to every other user. Mediator reduces direct dependencies by making objects talk through one coordinator.

    Where to apply:
    Use Mediator for UI dialogs, chat rooms, workflow coordination, and modules that need structured communication without every object depending on every other object.

    Do not confuse with:
    Mediator should not become a giant object that owns all business rules. If the mediator grows too much, split responsibilities or move rules back to the objects that own them.
  examples:
  - label: Objects know too much
    description: Each UI control updates several other controls directly.
    code: |
      country_select.on_change(lambda country: tax_field.update(country))
      country_select.on_change(lambda country: shipping_field.update(country))
  - label: Dialog mediator
    description: Controls report events to the mediator, and the mediator coordinates updates.
    code: |
      class CheckoutDialog:
          def country_changed(self, country):
              self.tax_field.update(country)
              self.shipping_field.update(country)

      country_select.on_change(dialog.country_changed)
  difficulty: junior
- title: Memento saves state so it can be restored later
  explanation: |
    Group: Behavioral pattern.

    Memento pattern captures an object's state without exposing its private internals.

    The useful question is "do I need undo or rollback?" An editor can save a snapshot before a change, then restore it if the user presses undo. The caretaker stores snapshots, but it does not need to understand every internal field of the object.

    Where to apply:
    Use Memento for undo and redo, drafts, checkpoints, rollback before risky operations, and restoring UI state. Keep snapshots reasonably small and clear about what is included.

    Do not confuse with:
    Memento is not the same as full database backup. It is usually a focused snapshot of one object's state. If state is huge, use diffs or event history instead of copying everything.
  examples:
  - label: Editor snapshot
    description: The editor creates a memento before changing content.
    code: |
      class Editor:
          def save(self):
              return {"content": self.content, "cursor": self.cursor}

          def restore(self, snapshot):
              self.content = snapshot["content"]
              self.cursor = snapshot["cursor"]
  - label: Undo history
    description: History stores snapshots and asks the editor to restore the last one.
    code: |
      history.append(editor.save())
      editor.insert("hello")
      editor.restore(history.pop())
  difficulty: junior
- title: State changes behavior when an object changes state
  explanation: |
    Group: Behavioral pattern.

    State pattern moves state-specific behavior into separate state objects.

    The useful question is "does this object keep checking its status before acting?" An order behaves differently when it is pending, paid, shipped, or cancelled. A large if/else block inside every method becomes hard to maintain. State lets each status own the behavior that applies while the object is in that status.

    Where to apply:
    Use State for workflows, documents, orders, games, media players, connection lifecycles, and UI components where behavior depends strongly on current state.

    Do not confuse with:
    State is not needed for one or two simple flags. It helps when many methods branch on the same state value and new states are likely to appear.
  examples:
  - label: Status branching
    description: Every action checks the same state value.
    code: |
      def cancel(order):
          if order.status == "shipped":
              raise Exception("Too late")
          if order.status == "cancelled":
              return
          order.status = "cancelled"
  - label: State object
    description: The current state owns behavior for that state.
    code: |
      class ShippedState:
          def cancel(self, order):
              raise Exception("Too late")

      class PendingState:
          def cancel(self, order):
              order.state = CancelledState()
  difficulty: junior
- title: Template Method fixes workflow order while steps vary
  explanation: |
    Group: Behavioral pattern.

    Template Method pattern defines an algorithm skeleton in a base class and lets subclasses fill in selected steps.

    The useful question is "must every variant follow the same sequence?" A report generator may always fetch data, transform it, and render it. CSV and HTML reports differ in details, but the workflow order should stay stable. Template Method keeps that order in one place.

    Where to apply:
    Use Template Method for import pipelines, report generation, test frameworks, request handling, and workflows where the sequence is part of the contract.

    Do not confuse with:
    Template Method uses inheritance. If you need to swap behavior at runtime or combine independent steps flexibly, Strategy or composition may fit better.
  examples:
  - label: Repeated workflow
    description: Each report repeats the same high-level sequence.
    code: |
      def make_csv_report(source):
          data = fetch(source)
          rows = transform(data)
          return render_csv(rows)
  - label: Base workflow
    description: The base class controls order while subclasses provide details.
    code: |
      class ReportGenerator:
          def generate(self, source):
              data = self.fetch(source)
              rows = self.transform(data)
              return self.render(rows)

          def fetch(self, source):
              raise NotImplementedError
  difficulty: junior
- title: Visitor adds operations to a stable object structure
  explanation: |
    Group: Behavioral pattern.

    Visitor pattern puts new operations in visitor objects instead of adding methods to every class in a structure.

    The useful question is "does the object structure stay stable while operations change?" An abstract syntax tree may have Number, Add, and Multiply nodes. You may want to print it, evaluate it, and export it. Visitor lets each operation live in its own visitor instead of editing every node class for every new operation.

    Where to apply:
    Use Visitor for compilers, syntax trees, document trees, reporting over object structures, and cases where you add many operations to a stable set of element types.

    Do not confuse with:
    Visitor is awkward when new element classes are added often, because every visitor may need a new method. It fits stable structures with changing operations, not changing structures with stable operations.
  examples:
  - label: Operations mixed into nodes
    description: Each node class gains another method for every new operation.
    code: |
      class Number:
          def evaluate(self):
              return self.value

          def print_tree(self):
              return str(self.value)
  - label: Visitor operation
    description: Printing lives in a visitor, separate from node data.
    code: |
      class PrintVisitor:
          def visit_number(self, node):
              return str(node.value)

      output = number_node.accept(PrintVisitor())
  difficulty: junior
---
