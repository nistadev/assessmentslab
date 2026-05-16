---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
questions:
- q: Adding Pentagon requires modifying this function. What principle is violated and what is the correct fix?
  code: "def calculate_area(shape: dict) -> float:\n    if shape[\"type\"] == \"circle\":\n        return 3.14159 * shape[\"\
    radius\"] ** 2\n    elif shape[\"type\"] == \"rectangle\":\n        return shape[\"width\"] * shape[\"height\"]\n    elif\
    \ shape[\"type\"] == \"triangle\":\n        return 0.5 * shape[\"base\"] * shape[\"height\"]\n    raise ValueError(\"\
    unknown shape\")"
  options:
  - text: Open/Closed Principle (OCP)
    correct: true
  - text: Single Responsibility Principle (SRP)
    correct: false
  - text: No violation
    correct: false
  - text: Dependency Inversion Principle (DIP)
    correct: false
  explanation: 'Open/Closed Principle: open for extension, closed for modification. Every new shape requires editing calculate_area,
    risking regressions on existing shapes. Fix: use a Protocol or ABC with area() → each shape class implements it → new
    shapes add a class, not a branch. The function shrinks to one line: return shape.area(). Python''s typing.Protocol enables
    structural subtyping without inheritance.'
  difficulty: mid
- q: What happens? What principle is violated and why?
  code: "class Bird:\n    def fly(self) -> str:\n        return \"flying\"\n\nclass Penguin(Bird):\n    def fly(self) -> str:\n\
    \        raise NotImplementedError(\"Penguins cannot fly\")\n\ndef release(bird: Bird) -> str:\n    return bird.fly()\n\
    \nrelease(Penguin())"
  options:
  - text: Raises NotImplementedError
    correct: true
  - text: Returns 'flying'
    correct: false
  - text: Single Responsibility Principle (SRP) violated
    correct: false
  - text: No violation
    correct: false
  explanation: 'Liskov Substitution Principle: a subtype must be usable wherever its base type is expected, without breaking
    callers. Penguin breaks the Bird contract. Fix: model the hierarchy around capabilities -- FlyingBird(Bird) has fly(),
    Penguin(Bird) does not inherit fly() at all. LSP violations often appear when inheritance is used for code reuse rather
    than true is-a relationships. Classic example from Barbara Liskov''s 1987 paper.'
  difficulty: mid
- q: What is the key production benefit of the refactor?
  code: "# Before\nclass ReportService:\n    def generate(self, data): ...      # builds report structure\n    def export_pdf(self,\
    \ report): ...  # renders to PDF\n    def export_csv(self, report): ...  # renders to CSV\n    def email_report(self,\
    \ pdf, to): ...  # sends email\n    def archive(self, pdf, path): ...  # writes to disk\n\n# After\nclass ReportBuilder:\n\
    \    def generate(self, data): ...\n\nclass PDFExporter:\n    def export(self, report): ...\n\nclass CSVExporter:\n  \
    \  def export(self, report): ...\n\nclass ReportMailer:\n    def send(self, pdf, to): ...\n\nclass ReportArchiver:\n \
    \   def archive(self, pdf, path): ..."
  options:
  - text: Each class can be changed, tested, and deployed independently
    correct: true
  - text: Adding a new export format no longer requires modifying existing exporters (OCP benefit)
    correct: false
  - text: Each exporter now depends on an abstraction, enabling dependency injection (DIP benefit)
    correct: false
  - text: It prevents OCP violations by removing the original class
    correct: false
  explanation: 'SRP applied. ReportService was a change magnet: adding a new export format, changing the email provider, and
    fixing an archive bug all required touching the same class. After: each class has one reason to change. Test PDFExporter
    independently with a mock report. Swap ReportMailer with SESMailer without touching CSVExporter. Deploy PDFExporter fix
    without risk to email or archive logic. This is SRP''s production payoff: isolated blast radius.'
  difficulty: mid
- q: |
    A class is short, but pricing, receipt copy, and persistence requests all change it for different reasons.
    Which principle is still at risk?
  options:
  - text: "Single Responsibility Principle (SRP)"
    correct: true
  - text: "Open/Closed Principle (OCP), because each new request modifies the same class"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because persistence and messaging details are likely concrete"
    correct: false
  - text: "Interface Segregation Principle (ISP), because callers may be exposed to behavior they do not use"
    correct: false
  explanation: "SRP is about separate axes of change, not line count. A short class can still mix policy, formatting, persistence, and effects."
  difficulty: mid
- q: |
    Which boundary name best describes a useful SRP extraction?
  options:
  - text: "CustomerNotificationPolicy"
    correct: true
  - text: "CheckoutExtensionRegistry"
    correct: false
  - text: "PaymentGatewayPort"
    correct: false
  - text: "RefundablePaymentContract"
    correct: false
  explanation: "A useful extraction names a real concept or ownership boundary. Generic helper names often mean the responsibility has not been found."
  difficulty: mid
- q: |
    What is the most useful first split in a workflow that mixes business decisions and database/email/file effects?
  options:
  - text: "Separate policy from effects"
    correct: true
  - text: "Create a plugin point for every possible effect before variants appear"
    correct: false
  - text: "Inject concrete database and email clients while leaving policy and effects tangled"
    correct: false
  - text: "Split the public service interface into read and write methods first"
    correct: false
  explanation: "Policy decides what should happen. Effects perform database writes, HTTP calls, email sends, and file uploads. Splitting them makes tests smaller."
  difficulty: mid
- q: |
    CheckoutHelper.do_checkout_stuff contains meaningful checkout rules but hides them behind a generic name.
    What is the likely design problem?
  options:
  - text: "Weak extraction that hides logic without clarifying responsibility"
    correct: true
  - text: "Good OCP because future checkout variants can be added without editing the caller"
    correct: false
  - text: "Good DIP because checkout logic is now behind a helper abstraction"
    correct: false
  - text: "Good ISP because callers no longer see all checkout methods"
    correct: false
  explanation: "SRP extraction should reveal a responsibility. Names like Helper or Manager often hide unclear ownership."
  difficulty: mid
- q: |
    A discount branch started with two cases, but now every campaign adds another edit to the same function.
    What is the OCP signal?
  options:
  - text: "Repeated edits to the same conditional"
    correct: true
  - text: "Several discount methods that all change for one pricing team"
    correct: false
  - text: "A caller that checks the concrete payment type before refunding"
    correct: false
  - text: "A discount function that constructs its own external campaign API client"
    correct: false
  explanation: "OCP appears when variation repeats. One conditional can be fine; repeated edits show the stable workflow and variable behavior are mixed."
  difficulty: mid
- q: |
    What does a discount registry mainly improve?
  code: |
    DISCOUNT_RULES = {}

    def register_discount(name, rule):
        DISCOUNT_RULES[name] = rule

    def discount_for(order):
        rule = DISCOUNT_RULES.get(order.campaign)
        return rule(order) if rule else 0
  options:
  - text: "New discount behavior becomes additive instead of editing discount_for"
    correct: true
  - text: "discount_for depends on an injected rule provider instead of constructing campaigns itself"
    correct: false
  - text: "Each discount implementation can be substituted even if it returns different result shapes"
    correct: false
  - text: "Discount clients depend only on read methods and not write methods"
    correct: false
  explanation: "A registry or strategy map can freeze the stable lookup flow while each variant lives behind a shared rule contract."
  difficulty: mid
- q: |
    When is it usually too early to introduce an OCP extension point?
  options:
  - text: "A stable two-case branch with no evidence of growth"
    correct: true
  - text: "A branch edited every sprint for new variants owned by different teams"
    correct: false
  - text: "A report system where new formats can share one export contract"
    correct: false
  - text: "A notification channel list where each channel can be tested independently"
    correct: false
  explanation: "OCP is not speculative generality. It is often correct to start simple and extract an extension point when change pressure appears."
  difficulty: mid
- q: |
    A new report format can be tested independently and added without changing report generation.
    Which principle is primarily being used?
  options:
  - text: "Open/Closed Principle (OCP)"
    correct: true
  - text: "Single Responsibility Principle (SRP), because each report format has one reason to change"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because report generation depends on an exporter abstraction"
    correct: false
  - text: "Liskov Substitution Principle (LSP), because each exporter must honor the same output contract"
    correct: false
  explanation: "OCP is useful when variants are expected to grow and each variant can be tested independently behind a shared contract."
  difficulty: mid
- q: |
    An interface promises refund(payment_id), but one implementation throws refund not supported.
    What contract problem is this?
  options:
  - text: "Liskov Substitution Principle violation"
    correct: true
  - text: "Interface Segregation Principle violation, because refund should be split from charge"
    correct: false
  - text: "Open/Closed Principle violation, because each payment method needs its own refund branch"
    correct: false
  - text: "Dependency Inversion Principle violation, because refund should use an injected gateway"
    correct: false
  explanation: "LSP is about behavioral promises. Matching names are not enough if one implementation cannot honor the promised behavior."
  difficulty: mid
- q: |
    Which fact belongs in an LSP contract beyond method names?
  options:
  - text: "Accepted inputs, return shape, side effects, errors, ordering, and invariants"
    correct: true
  - text: "Which concrete adapter is injected by production"
    correct: false
  - text: "Which consumer-facing methods are grouped into the smallest useful interface"
    correct: false
  - text: "Which future variants can be added without changing existing code"
    correct: false
  explanation: "Callers rely on behavior. Inputs, outputs, errors, side effects, and invariants are part of substitutability."
  difficulty: mid
- q: |
    Code checks isinstance(payment, GiftCardPayment) before calling refund.
    What is the strongest smell?
  options:
  - text: "The shared payment contract is not reliable for callers"
    correct: true
  - text: "The payment contract should be split into reader and writer roles for clients"
    correct: false
  - text: "The refund branch should be moved into a payment strategy registry"
    correct: false
  - text: "The caller should receive an injected PaymentGateway instead of a concrete payment"
    correct: false
  explanation: "Caller type checks around an interface often reveal a weak behavioral contract. Split capabilities instead."
  difficulty: mid
- q: |
    Which design best follows LSP for payments?
  options:
  - text: "PaymentMethod has charge; RefundablePayment extends it only for refundable methods"
    correct: true
  - text: "PaymentMethod has charge and refund, while unsupported refunds return a typed NotSupported result"
    correct: false
  - text: "PaymentMethod implementations register themselves in a payment rule registry"
    correct: false
  - text: "PaymentMethod depends on an injected refund provider but every method still promises refund"
    correct: false
  explanation: "A smaller capability contract lets callers ask for exactly the behavior they need and keeps implementations honest."
  difficulty: mid
- q: |
    render_profile only calls find(user_id), but depends on UserStore with save, delete, and export_csv.
    Which principle points to a smaller interface?
  options:
  - text: "Interface Segregation Principle (ISP)"
    correct: true
  - text: "Single Responsibility Principle (SRP), because read, write, delete, and export can change separately"
    correct: false
  - text: "Liskov Substitution Principle (LSP), because UserStore implementations must preserve behavior"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because render_profile should depend on an abstraction"
    correct: false
  explanation: "ISP designs contracts from the consumer side. The profile renderer needs a UserReader, not every UserStore capability."
  difficulty: mid
- q: |
    What is the right size for an ISP interface?
  options:
  - text: "The set of methods a consumer normally needs together"
    correct: true
  - text: "The set of methods the provider happens to implement internally"
    correct: false
  - text: "The set of methods that might be useful to future consumers someday"
    correct: false
  - text: "The set of methods that keep every implementation substitutable regardless of consumer role"
    correct: false
  explanation: "ISP does not mean one method per interface. Group behavior by consumer role: reader, writer, notifier, clock, validator, search index."
  difficulty: mid
- q: |
    A small fake for UserReader is easy to build and hard to misuse.
    Which testing benefit is this?
  options:
  - text: "ISP reduces fake size by narrowing the role under test"
    correct: true
  - text: "LSP guarantees the fake can ignore production-only behavior"
    correct: false
  - text: "DIP removes the need for a fake by injecting the real database"
    correct: false
  - text: "OCP lets tests add fake behavior through a registry"
    correct: false
  explanation: "Narrow consumer-shaped contracts make tests simpler because fakes only implement behavior the consumer actually uses."
  difficulty: mid
- q: |
    PasswordResetService creates SmtpClient inside reset. What is the key DIP issue?
  options:
  - text: "High-level password reset policy depends directly on low-level SMTP infrastructure"
    correct: true
  - text: "Password reset mixes token policy and email copy, so it has multiple reasons to change"
    correct: false
  - text: "SMTP sender should be a registered notification strategy to avoid editing reset"
    correct: false
  - text: "Reset callers depend on sender methods they do not need"
    correct: false
  explanation: "DIP protects policy from volatile tools. The service should depend on a sender port while an SMTP adapter handles infrastructure."
  difficulty: mid
- q: |
    Which dependency direction best follows DIP?
  options:
  - text: "Policy owns the abstraction; infrastructure implements it"
    correct: true
  - text: "Policy depends on a provider-shaped SDK interface so adapters stay thin"
    correct: false
  - text: "Policy exposes every database method so callers can choose the one they need"
    correct: false
  - text: "Policy uses a registry so new infrastructure variants can be added"
    correct: false
  explanation: "The direction matters. High-level policy describes what it needs in business terms; low-level adapters translate to databases, HTTP, queues, or SDKs."
  difficulty: mid
---
