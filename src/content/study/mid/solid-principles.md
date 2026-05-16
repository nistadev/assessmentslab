---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
lessons:
- title: SRP separates reasons to change, not lines of code
  explanation: |
    At mid level, Single Responsibility Principle is about finding separate axes of change inside a real workflow.

    A class can be short and still violate SRP if every product request changes it for a different reason. A class can also be longer and still respect SRP if all of its methods support one policy. The practical skill is naming the reason to change before extracting code. "Email logic" is a weak boundary. "Customer notification policy" is better because it explains who owns the change and what behavior belongs there.

    Where to apply:
    Use SRP when a service mixes business policy, formatting, persistence, integration calls, and orchestration. Start by separating policy from effects. Policy decides what should happen. Effects perform database writes, HTTP calls, email sends, and file uploads. That split makes tests smaller and makes future changes less risky.

    Do not confuse with:
    SRP is not a command to split every method into a class. Extract when a new name describes a real concept or ownership boundary. If the extracted class only says "StepOne" or "Helper," the split may hide logic without improving design.
  examples:
  - label: Change magnet
    description: Pricing, receipt copy, and persistence all change for different business reasons.
    code: |
      class CheckoutService:
          def complete(self, cart):
              total = cart.subtotal * 1.2
              order = db.insert("orders", {"total": total})
              email.send(cart.user.email, f"Paid {total}")
              return order
  - label: Policy and effects split
    description: Checkout coordinates collaborators while each collaborator owns one reason to change.
    code: |
      class CheckoutService:
          def __init__(self, pricing, orders, receipts):
              self.pricing = pricing
              self.orders = orders
              self.receipts = receipts

          def complete(self, cart):
              total = self.pricing.total_for(cart)
              order = self.orders.create(cart, total)
              self.receipts.send(order)
              return order
  - label: Weak extraction
    description: Names like Manager and Helper often mean the real responsibility has not been found yet.
    code: |
      class CheckoutHelper:
          def do_checkout_stuff(self, cart):
              ...
  difficulty: mid
- title: OCP appears when variation repeats
  explanation: |
    At mid level, Open/Closed Principle is about recognizing when a branch is becoming a change hotspot.

    One conditional is not a design failure. Repeated edits to the same conditional are the signal. If every new report format, discount rule, or notification channel modifies the same function, the stable part of the workflow is being mixed with variable behavior. OCP asks you to freeze the stable workflow and move each variant behind a shared contract.

    Where to apply:
    Use OCP when variants are expected to grow and each variant can be tested independently. A registry, strategy object, or command map can make new behavior additive. This is especially useful when variants are owned by different teams or released on different schedules.

    Do not confuse with:
    OCP is not speculative generality. Do not build a plugin system before there is evidence of repeated variation. It is often correct to start with a conditional, watch the change pattern, then create the extension point when the third or fourth variant arrives.
  examples:
  - label: Branch grows every sprint
    description: Each campaign touches existing discount code and risks old discounts.
    code: |
      def discount_for(order):
          if order.campaign == "student":
              return order.total * 0.10
          if order.campaign == "loyalty":
              return order.total * 0.15
          if order.campaign == "seasonal":
              return order.total * 0.20
          return 0
  - label: Additive rule registry
    description: New rules are registered beside old rules. Checkout behavior no longer changes for each campaign.
    code: |
      DISCOUNT_RULES = {}

      def register_discount(name, rule):
          DISCOUNT_RULES[name] = rule

      def discount_for(order):
          rule = DISCOUNT_RULES.get(order.campaign)
          return rule(order) if rule else 0

      register_discount("student", lambda order: order.total * 0.10)
  - label: Still too early
    description: A stable two-case branch can be clearer than an abstraction with only one real user.
    code: |
      def tax_rate(country):
          return 0.21 if country == "ES" else 0.0
  difficulty: mid
- title: LSP is about behavioral promises
  explanation: |
    At mid level, Liskov Substitution Principle is about preserving the promises callers rely on.

    A subtype can share method names and still violate LSP. The important contract includes accepted inputs, return shape, side effects, errors, ordering, and invariants. If callers need type checks, defensive branches, or special handling for a subtype, the shared interface is probably describing a wish instead of a reliable behavior.

    Where to apply:
    Use LSP when designing inheritance, protocols, or shared service interfaces. Ask whether every implementation can honestly satisfy the same promise. If some implementations only support part of the behavior, split the capability into smaller contracts instead of forcing "not supported" methods.

    Do not confuse with:
    LSP is not about taxonomy alone. A penguin is a bird biologically, but a Penguin should not inherit Flyable behavior in code. Model the behavior your program needs, not the category label from the real world.
  examples:
  - label: Contract lies
    description: The interface promises refunds, but one implementation throws at runtime.
    code: |
      class PaymentMethod:
          def charge(self, order):
              ...

          def refund(self, payment_id):
              ...

      class GiftCardPayment(PaymentMethod):
          def refund(self, payment_id):
              raise Exception("refund not supported")
  - label: Capability split
    description: Callers ask for the capability they need, so implementations do not fake behavior.
    code: |
      class PaymentMethod:
          def charge(self, order):
              ...

      class RefundablePayment(PaymentMethod):
          def refund(self, payment_id):
              ...

      def issue_refund(payment: RefundablePayment, payment_id):
          payment.refund(payment_id)
  - label: Smell in caller code
    description: Type checks around an interface often reveal a weak behavioral contract.
    code: |
      if isinstance(payment, GiftCardPayment):
          show_manual_refund_message()
      else:
          payment.refund(payment_id)
  difficulty: mid
- title: ISP shapes interfaces around clients
  explanation: |
    At mid level, Interface Segregation Principle is about designing contracts from the consumer side.

    A wide interface often reflects the provider's internal model, not what clients actually need. One screen may only need read behavior. A background job may only need write behavior. A reporting flow may only need search behavior. Forcing all clients to depend on all methods couples them to changes they do not use and makes fake implementations noisy.

    Where to apply:
    Use ISP when tests need large fake objects, implementations contain "not supported" methods, or small clients import heavy dependencies. Split interfaces by role: Reader, Writer, Notifier, Clock, Validator, SearchIndex. Group methods that are used together by the same clients.

    Do not confuse with:
    ISP does not mean one method per interface. Too many tiny contracts make composition harder. The right size is the set of methods a consumer normally needs together.
  examples:
  - label: Provider-shaped interface
    description: Read-only code depends on write and delete methods it never calls.
    code: |
      class UserStore:
          def find(self, user_id): ...
          def save(self, user): ...
          def delete(self, user_id): ...
          def export_csv(self): ...

      def render_profile(store: UserStore, user_id):
          return store.find(user_id)
  - label: Client-shaped interface
    description: Profile rendering only depends on reading behavior.
    code: |
      class UserReader:
          def find(self, user_id): ...

      class UserWriter:
          def save(self, user): ...
          def delete(self, user_id): ...

      def render_profile(users: UserReader, user_id):
          return users.find(user_id)
  - label: Test benefit
    description: A fake for one small role is easier to build and harder to misuse.
    code: |
      class FakeUserReader:
          def __init__(self, users):
              self.users = users

          def find(self, user_id):
              return self.users[user_id]
  difficulty: mid
- title: DIP points business code inward
  explanation: |
    At mid level, Dependency Inversion Principle is about making important policy independent from volatile tools.

    High-level code should describe what it needs in business terms. Low-level adapters should translate that need into database calls, HTTP requests, queue messages, or SDK operations. This keeps tests fast and makes infrastructure replaceable. The direction matters: policy owns the abstraction, infrastructure implements it.

    Where to apply:
    Use DIP around external systems, slow resources, nondeterministic APIs, and framework-specific code. Repositories, mailers, payment gateways, clocks, ID generators, queues, and storage clients are common boundaries. Inject only the behavior the policy needs.

    Do not confuse with:
    DIP is not "wrap everything." Stable language features and simple value objects do not need ports. A bad abstraction around a stable thing creates ceremony without reducing risk.
  examples:
  - label: Policy creates infrastructure
    description: The service is hard to test because it creates the real email sender itself.
    code: |
      class PasswordResetService:
          def reset(self, user):
              token = create_token(user)
              smtp = SmtpClient("smtp.example.com")
              smtp.send(user.email, f"Reset token {token}")
  - label: Policy depends on a port
    description: Tests can pass a fake sender while production passes an SMTP adapter.
    code: |
      class PasswordResetService:
          def __init__(self, tokens, sender):
              self.tokens = tokens
              self.sender = sender

          def reset(self, user):
              token = self.tokens.create_for(user)
              self.sender.send(user.email, f"Reset token {token}")
  - label: Abstraction should be useful
    description: Wrapping a stable built-in call usually adds no meaningful flexibility.
    code: |
      class LengthService:
          def length(self, value):
              return len(value)
  difficulty: mid
---
