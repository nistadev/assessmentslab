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
- q: |
    A commerce service owns pricing, fraud scoring, ledger posting, customer messaging, and compliance reporting.
    What is the principal-level SRP problem?
  options:
  - text: "Competing ownership and change streams create coordination risk"
    correct: true
  - text: "The platform lacks controlled extension points for pricing and fraud variants"
    correct: false
  - text: "Consumers depend on one universal commerce surface instead of focused capabilities"
    correct: false
  - text: "The core domain imports vendor and framework details directly"
    correct: false
  explanation: "At principal level SRP aligns boundaries with durable ownership. Unrelated teams editing one module for unrelated outcomes creates release risk."
  difficulty: principal
- q: |
    Which evidence best suggests an SRP split at platform scale?
  options:
  - text: "Unrelated PR reviewers, deployment blockers, incidents, and roadmap conflicts concentrate in one module"
    correct: true
  - text: "New market-specific behavior can register through a versioned extension point"
    correct: false
  - text: "Provider implementations pass the same compatibility suite"
    correct: false
  - text: "Consumers can choose OrderReadClient instead of a universal platform SDK"
    correct: false
  explanation: "Principal-level SRP looks at ownership, incident accountability, and coordination cost, not just class size."
  difficulty: principal
- q: |
    Why is SRP not the same as microservices?
  options:
  - text: "A bad service split can increase coupling through distributed transactions and duplicated data"
    correct: true
  - text: "A service split must define versioned extension contracts for new variants"
    correct: false
  - text: "A service split should ensure every provider remains substitutable"
    correct: false
  - text: "A service split should expose separate read, command, and report capabilities"
    correct: false
  explanation: "A good SRP split reduces coordination and clarifies authority. Moving code into another repository can make coupling worse."
  difficulty: principal
- q: |
    In a checkout platform, pricing_service.quote calls fraud_service.check, then pricing_service recalculates after fraud.
    What is the main risk?
  options:
  - text: "The split moved code but kept a synchronous distributed bottleneck"
    correct: true
  - text: "The split created an uncontrolled extension point for fraud plugins"
    correct: false
  - text: "The split makes pricing and fraud providers fail the same compatibility contract"
    correct: false
  - text: "The split exposes too many capabilities to simple checkout consumers"
    correct: false
  explanation: "A split must reduce coordination. Back-and-forth service calls for one decision can create distributed coupling."
  difficulty: principal
- q: |
    A plugin list can mutate checkout state before complete_order with no phase, owner, limits, or logging.
    What OCP problem is this?
  options:
  - text: "Uncontrolled extensibility creates hidden coupling and unstable core behavior"
    correct: true
  - text: "Plugin authors and checkout owners have competing responsibility boundaries"
    correct: false
  - text: "Plugins cannot substitute for one another because they may return different decisions"
    correct: false
  - text: "Plugins expose too many methods to consumers that only need checkout reads"
    correct: false
  explanation: "Principal-level OCP needs controlled extension mechanisms: registration rules, safety limits, ordering, rollout controls, and observability."
  difficulty: principal
- q: |
    Which detail belongs in a controlled extension contract?
  options:
  - text: "Version, phase, owner, allowed decisions, safety limits, ordering, and contract tests"
    correct: true
  - text: "An owner map, incident rotation, and deployment boundary for each policy area"
    correct: false
  - text: "A compatibility suite that checks old and new providers share timeout semantics"
    correct: false
  - text: "Separate read, command, admin, and export SDKs with permissions"
    correct: false
  explanation: "OCP at platform scale lets teams move independently without destabilizing the core. The extension behavior must be governed and visible."
  difficulty: principal
- q: |
    Which core rule should remain closed even when checkout extensions exist?
  options:
  - text: "Authorization and ledger correctness"
    correct: true
  - text: "Plugin-owned campaign copy and optional customer messages"
    correct: false
  - text: "Market-specific display labels returned by an extension"
    correct: false
  - text: "Partner-specific tax hints validated by the core ledger"
    correct: false
  explanation: "OCP does not mean everything varies. Core invariants such as authorization, audit, and balanced ledger entries must stay protected."
  difficulty: principal
- q: |
    Why is too much configuration risky as an OCP strategy?
  options:
  - text: "It can become a weakly tooled programming language"
    correct: true
  - text: "It can clarify ownership by separating pricing, fraud, and ledger policies"
    correct: false
  - text: "It can preserve substitutability when each option follows one contract"
    correct: false
  - text: "It can narrow capability surfaces for consumers with different permissions"
    correct: false
  explanation: "Controlled extensibility chooses what may vary. Making everything configurable creates hidden complexity."
  difficulty: principal
- q: |
    A new search provider returns [] on timeout while the old provider raised SearchUnavailable.
    What principle is violated?
  options:
  - text: "Liskov Substitution Principle (LSP)"
    correct: true
  - text: "Open/Closed Principle (OCP), because the search provider was added behind an extension point"
    correct: false
  - text: "Dependency Inversion Principle (DIP), because search is an external infrastructure adapter"
    correct: false
  - text: "Interface Segregation Principle (ISP), because consumers may need different search capabilities"
    correct: false
  explanation: "Types can still compile while behavior breaks. Consumers relying on failure semantics are no longer safe to substitute providers."
  difficulty: principal
- q: |
    What should a principal-level compatibility suite test for replaceable providers?
  options:
  - text: "Return semantics, error semantics, ordering, idempotency, and consistency guarantees"
    correct: true
  - text: "Which team owns each provider and release train"
    correct: false
  - text: "Which extension phase allows the provider to run"
    correct: false
  - text: "Which SDK surface exposes each provider capability"
    correct: false
  explanation: "Substitutability is governance across versions, teams, and providers. Compatibility suites protect existing consumers."
  difficulty: principal
- q: |
    Old consumers rely on strict search failure semantics, but new consumers want partial results.
    What is the safest principal-level move?
  options:
  - text: "Introduce a versioned contract such as search_v2 for partial results"
    correct: true
  - text: "Keep search_v1 but add an extension flag that changes timeout behavior per market"
    correct: false
  - text: "Split SearchReader and SearchAdmin interfaces while keeping timeout semantics ambiguous"
    correct: false
  - text: "Move timeout mapping into a vendor adapter but preserve no documented failure contract"
    correct: false
  explanation: "When old consumers rely on old behavior, new behavior belongs behind a new contract version."
  difficulty: principal
- q: |
    Which statement about LSP is true at principal level?
  options:
  - text: "It applies to REST APIs, message schemas, SDK clients, event consumers, and adapters"
    correct: true
  - text: "It applies only after a system has controlled plugin registration"
    correct: false
  - text: "It applies only when providers use the same dependency direction"
    correct: false
  - text: "It applies only inside one service boundary, not across APIs"
    correct: false
  explanation: "Anything advertised as replaceable must behave like the thing it replaces."
  difficulty: principal
- q: |
    A simple status page imports a universal commerce SDK with billing, mutation, admin, and export capabilities.
    Which principle is being strained?
  options:
  - text: "Interface Segregation Principle (ISP)"
    correct: true
  - text: "Dependency Inversion Principle (DIP), because status code depends on a platform abstraction"
    correct: false
  - text: "Single Responsibility Principle (SRP), because billing, admin, and export have different owners"
    correct: false
  - text: "Liskov Substitution Principle (LSP), because SDK clients must preserve behavior across versions"
    correct: false
  explanation: "A universal SDK looks efficient for providers but forces consumers to understand permissions, payloads, and failure modes they do not use."
  difficulty: principal
- q: |
    Which capability split best follows principal-level ISP?
  options:
  - text: "OrderReadClient, RefundCommandClient, and SettlementReportClient"
    correct: true
  - text: "CommercePlatformClient with optional permission flags for every method"
    correct: false
  - text: "CheckoutExtensionRegistry where each consumer registers only needed callbacks"
    correct: false
  - text: "OrderProviderPort implemented by every vendor, admin, and reporting flow"
    correct: false
  explanation: "The goal is a small set of stable named capabilities that map to real use cases, not one giant surface or endless one-offs."
  difficulty: principal
- q: |
    Why should capability surfaces align with permissions and rate limits?
  options:
  - text: "Consumers can adopt the smallest safe surface for their job"
    correct: true
  - text: "Providers can substitute implementations without preserving all behavior"
    correct: false
  - text: "Extensions can bypass core invariants when they only need read data"
    correct: false
  - text: "Domain policy can depend directly on the SDK because permissions are clear"
    correct: false
  explanation: "Capability surfaces include policy: permissions, rate limits, approval requirements, and compatibility promises."
  difficulty: principal
- q: |
    approve_order(request, session) reads HTTP request and ORM session directly inside business policy.
    What is the principal-level DIP issue?
  options:
  - text: "Framework concepts have become the language of the domain"
    correct: true
  - text: "Order approval has too many ownership streams and should be split by teams"
    correct: false
  - text: "ApproveOrder should be an extension point so markets can change approval behavior"
    correct: false
  - text: "The approval API exposes too many commands to read-only consumers"
    correct: false
  explanation: "Frameworks are useful at the edge. The risk is making business rules depend on request objects, ORM sessions, or vendor response shapes."
  difficulty: principal
- q: |
    Which dependency direction best protects a long-lived domain?
  options:
  - text: "Core defines ports and policy; edge adapters implement databases, vendors, queues, and HTTP"
    correct: true
  - text: "Core exposes one universal SDK so every adapter can access all capabilities"
    correct: false
  - text: "Core keeps one plugin list where adapters can mutate policy at any phase"
    correct: false
  - text: "Core relies on compatibility tests but still imports vendor response shapes"
    correct: false
  explanation: "DIP sets dependency direction inward so migrations, tests, parallel implementations, and vendor exits do not rewrite policy."
  difficulty: principal
- q: |
    When should an anti-corruption adapter be used?
  options:
  - text: "When an external model does not match domain language"
    correct: true
  - text: "When an extension needs a versioned phase, owner, and rollout policy"
    correct: false
  - text: "When two providers must pass the same compatibility suite"
    correct: false
  - text: "When one SDK should be split into read, command, report, and admin surfaces"
    correct: false
  explanation: "Adapters translate external concepts into domain language and keep vendor churn at the edge."
  difficulty: principal
- q: |
    Which design better follows DIP for order approval?
  options:
  - text: "A core ApproveOrder use case depends on orders and limits ports; the handler adapts HTTP into command input"
    correct: true
  - text: "A framework controller owns approval policy but calls a versioned extension hook for market differences"
    correct: false
  - text: "The domain imports an OrderReadClient SDK with admin and export operations disabled"
    correct: false
  - text: "The domain uses a provider compatibility suite to verify ORM and HTTP behavior"
    correct: false
  explanation: "The edge should own framework details. The core should speak in domain terms and depend on ports."
  difficulty: principal
---
