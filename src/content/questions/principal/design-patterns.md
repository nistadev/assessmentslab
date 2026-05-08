---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: What pattern? What does a subclass that only overrides render() guarantee?
  code: "class ReportGenerator:\n    def generate(self, data: dict) -> str:\n        raw = self.fetch(data)\n        processed\
    \ = self.transform(raw)\n        return self.render(processed)\n\n    def transform(self, raw):\n        return raw  #\
    \ default: identity\n\n    def fetch(self, data): raise NotImplementedError\n    def render(self, data): raise NotImplementedError\n\
    \nclass CSVReport(ReportGenerator):\n    def fetch(self, data): return data[\"rows\"]\n    def render(self, data):\n \
    \       return \"\\n\".join(\",\".join(str(c) for c in row) for row in data)\n\nclass JSONReport(ReportGenerator):\n \
    \   def fetch(self, data): return data\n    def render(self, data):\n        import json; return json.dumps(data)"
  options:
  - text: Template Method
    correct: true
  - text: Strategy
    correct: false
  - text: Factory
    correct: false
  - text: Chain of Responsibility
    correct: false
  explanation: Template Method. generate() defines the invariant algorithm skeleton (fetch → transform → render). Subclasses
    override only the variant steps. A subclass overriding only render() gets the default identity transform and must provide
    fetch. The base class controls the flow; subclasses customize the parts. Used in Python's unittest (setUp/tearDown/test*),
    HTTP request handlers, and data pipelines where the processing sequence must stay consistent.
  difficulty: principal
---
