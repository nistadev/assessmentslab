---
defaultDomains:
- computer-science
defaultTopics:
- solid-principles
questions:
- q: How does this compare to an if/elif chain and what principle does it embody?
  code: "DISCOUNT_RULES = {\n    \"premium\":  lambda total: total * 0.20,\n    \"bulk\":     lambda total: total * 0.10,\n\
    \    \"employee\": lambda total: total * 0.30,\n}\n\ndef apply_discount(order_type: str, total: float) -> float:\n   \
    \ rule = DISCOUNT_RULES.get(order_type)\n    return rule(total) if rule else 0.0\n\n# Adding a \"vip\" discount:\nDISCOUNT_RULES[\"\
    vip\"] = lambda total: total * 0.25"
  options:
  - text: Open/Closed Principle (OCP)
    correct: true
  - text: Single Responsibility Principle (SRP)
    correct: false
  - text: Strategy
    correct: false
  - text: Dependency Inversion Principle (DIP)
    correct: false
  explanation: 'Open/Closed Principle. The if/elif version requires modifying apply_discount for each new type -- risky when
    other discount types exist in the same function. The dict version is closed to modification: apply_discount has never
    changed after three new types were added. DISCOUNT_RULES is open to extension: new entries slot in without touching existing
    rules. This is the registration pattern -- the same technique used by Python''s codecs, Django''s URL router, and Flask''s
    blueprint system.'
  difficulty: principal
---
