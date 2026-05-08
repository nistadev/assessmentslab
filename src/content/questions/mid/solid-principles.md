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
---
