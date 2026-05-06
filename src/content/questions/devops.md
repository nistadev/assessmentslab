---
category: "DevOps"
questions:
  - q: "Which practice is most fundamental for effective continuous integration in a large project?"
    options:
      - text: "Keep code in single source repository and automate build and test on each change"
        correct: true
      - text: "Run builds manually at end of each sprint"
        correct: false
      - text: "Allow each team to use separate undocumented pipeline conventions"
        correct: false
      - text: "Skip tests in CI to reduce queue time"
        correct: false
    explanation: "CI depends on shared source of truth plus automated verification on change. Manual builds and inconsistent pipeline practices break fast feedback. In large systems, reliability starts with repeatable automation tied to version control."
    difficulty: "junior"
    isCode: false

  - q: "Why are fast test suites important in continuous integration?"
    options:
      - text: "They provide rapid feedback so developers can fix issues before context is lost"
        correct: true
      - text: "They remove need for integration or end-to-end tests"
        correct: false
      - text: "They guarantee zero flaky failures"
        correct: false
      - text: "They make code review unnecessary"
        correct: false
    explanation: "Fast feedback is core CI value. Slow pipelines increase batch size, delay fixes, and reduce trust in automation. Fast suites do not replace broader test coverage, but they keep inner loop usable."
    difficulty: "mid"
    isCode: false

  - q: "What is main benefit of storing CI configuration and scripts in version control?"
    options:
      - text: "Pipeline behavior becomes reviewable, reproducible, and auditable"
        correct: true
      - text: "Secrets become easier to expose across teams"
        correct: false
      - text: "Build agents no longer need dependencies"
        correct: false
      - text: "It guarantees every pipeline runs faster"
        correct: false
    explanation: "Versioning CI config gives history, peer review, rollback, and shared visibility. It does not remove runtime dependencies or inherently improve speed. In production, pipeline changes are code and should be treated like code."
    difficulty: "junior"
    isCode: false

  - q: "Which approach best supports scalable and repeatable infrastructure automation?"
    options:
      - text: "Define infrastructure as code with reusable modules and idempotent automation"
        correct: true
      - text: "Provision environments manually from runbook screenshots"
        correct: false
      - text: "Use one giant script with hardcoded values per environment"
        correct: false
      - text: "Edit cloud resources directly in console for flexibility"
        correct: false
    explanation: "Scalable infrastructure automation depends on declarative or scripted IaC, modularity, and repeatability. Manual console changes create drift and make recovery harder. In growing systems, repeatable provisioning is non-negotiable."
    difficulty: "junior"
    isCode: false

  - q: "Why is idempotency important in infrastructure automation?"
    options:
      - text: "Running same automation repeatedly should converge on same desired state without unintended side effects"
        correct: true
      - text: "It ensures infrastructure never changes after initial deploy"
        correct: false
      - text: "It removes need for environment variables"
        correct: false
      - text: "It guarantees lower cloud cost in every case"
        correct: false
    explanation: "Idempotent automation is safe to rerun and crucial for repair, retries, and drift correction. Non-idempotent scripts often fail or duplicate resources when retried. In real operations, reruns happen constantly."
    difficulty: "mid"
    isCode: false

  - q: "Which concern is critical when orchestrating containers in production?"
    options:
      - text: "High availability, service discovery, storage, security, and self-healing"
        correct: true
      - text: "Using containers only for stateless demo services"
        correct: false
      - text: "Disabling monitoring to save cluster resources"
        correct: false
      - text: "Avoiding rolling updates because they add complexity"
        correct: false
    explanation: "Production orchestration must handle resilience, networking, storage, and operational safety. Demo-only assumptions break quickly under real traffic. In enterprise environments, orchestration platform value is in handling these concerns consistently."
    difficulty: "mid"
    isCode: false

  - q: "What is strongest baseline control for securing CI pipelines?"
    options:
      - text: "Restrict access, protect secrets, and apply least privilege to pipeline identities"
        correct: true
      - text: "Share one admin token across all jobs for simplicity"
        correct: false
      - text: "Disable dependency scanning to reduce build time"
        correct: false
      - text: "Allow all contributors to edit production deployment steps directly"
        correct: false
    explanation: "CI pipelines are privileged execution environments, so access control, secret protection, and least privilege are foundational. Shared admin credentials and unrestricted edits create major supply-chain risk. Security must be built into pipeline design, not added later."
    difficulty: "senior"
    isCode: false

  - q: "Why should dependency vulnerability scanning be part of CI?"
    options:
      - text: "It catches known vulnerable packages before they ship further through pipeline"
        correct: true
      - text: "It replaces need for patching base images and runtimes"
        correct: false
      - text: "It guarantees protection from zero-day attacks"
        correct: false
      - text: "It is useful only for frontend code"
        correct: false
    explanation: "Dependency scanning helps surface known CVEs early, before deployment. It is one layer only and does not replace patching or broader security review. In production CI, automated scanning reduces avoidable exposure."
    difficulty: "mid"
    isCode: false

  - q: "Which tactic most directly improves cost efficiency in container orchestration?"
    options:
      - text: "Right-size resource requests and limits, then autoscale based on real usage"
        correct: true
      - text: "Set every workload to maximum CPU and memory to avoid throttling"
        correct: false
      - text: "Disable autoscaling so capacity stays predictable"
        correct: false
      - text: "Keep idle staging clusters running indefinitely"
        correct: false
    explanation: "Cost optimization starts with accurate resource sizing and dynamic scaling. Overprovisioning and leaving idle systems running waste money fast. In real clusters, utilization data should drive tuning."
    difficulty: "mid"
    isCode: false

  - q: "When are spot instances or preemptible VMs most useful in orchestration platforms?"
    options:
      - text: "For fault-tolerant workloads that can handle interruption in exchange for lower cost"
        correct: true
      - text: "For every stateful production database primary"
        correct: false
      - text: "Only when autoscaling is disabled"
        correct: false
      - text: "When workload cannot be rescheduled safely"
        correct: false
    explanation: "Spot or preemptible capacity is cheap because it can disappear. Good use cases are stateless or resilient jobs, batch work, and flexible background processing. Critical irreplaceable workloads need stronger guarantees."
    difficulty: "senior"
    isCode: false

  - q: "Which deployment strategy best supports low-risk continuous delivery with easy rollback?"
    options:
      - text: "Blue-green or canary deployment with automated rollback paths"
        correct: true
      - text: "Replace all instances at once with no health checks"
        correct: false
      - text: "Ship directly from developer laptop to production servers"
        correct: false
      - text: "Delay all releases until large quarterly batch"
        correct: false
    explanation: "Blue-green and canary patterns limit blast radius and make rollback practical. Big-bang replacement increases outage risk. Mature continuous delivery optimizes safe change frequency, not heroic release events."
    difficulty: "senior"
    isCode: false

  - q: "What is biggest operational challenge of container orchestration at enterprise scale?"
    options:
      - text: "Managing complexity across networking, security, storage, scaling, and cluster operations"
        correct: true
      - text: "Remembering single Docker command syntax"
        correct: false
      - text: "Finding any tool that supports service discovery"
        correct: false
      - text: "Avoiding all managed services by default"
        correct: false
    explanation: "Enterprise orchestration is hard because many distributed systems concerns interact at once. Managed platforms can reduce some burden, but complexity remains. Success depends on strong operational patterns, not only tool choice."
    difficulty: "principal"
    isCode: false

  - q: "How should automated testing be integrated into CI pipelines?"
    options:
      - text: "Trigger unit, integration, and end-to-end tests automatically on changes, with parallelization and reporting"
        correct: true
      - text: "Run tests only before major releases to save compute"
        correct: false
      - text: "Keep test results local to build agent with no reporting"
        correct: false
      - text: "Use end-to-end tests only because they cover everything"
        correct: false
    explanation: "Good CI testing runs automatically, covers multiple levels, and returns visible results quickly. Parallelization helps maintain speed. Relying on rare or single-layer testing weakens confidence and slows delivery."
    difficulty: "mid"
    isCode: false

  - q: "Which statement best compares Kubernetes, Docker Swarm, and Apache Mesos?"
    options:
      - text: "Kubernetes offers broad feature depth and ecosystem, Swarm is simpler, and Mesos is powerful but complex"
        correct: true
      - text: "Swarm is most complex but most feature-rich by large margin"
        correct: false
      - text: "Mesos has been standard default choice for simplest small teams"
        correct: false
      - text: "All three have effectively identical operational tradeoffs"
        correct: false
    explanation: "These tools differ mainly in ecosystem, complexity, and operational model. Kubernetes dominates for flexibility and scale, Swarm trades depth for simplicity, and Mesos historically offered broad scheduling power with more setup burden. Tool choice should match team capability and problem size."
    difficulty: "senior"
    isCode: false

  - q: "How does Infrastructure as Code improve collaboration inside DevOps teams?"
    options:
      - text: "Infrastructure changes become reviewable, reusable, versioned, and less prone to configuration drift"
        correct: true
      - text: "Only one platform engineer can safely manage environments anymore"
        correct: false
      - text: "Console edits become preferred because code already documents intent"
        correct: false
      - text: "It eliminates need for environment parity checks"
        correct: false
    explanation: "IaC turns infrastructure into shared code artifacts that teams can review, reuse, and evolve together. It reduces drift by defining desired state explicitly. In practice, this improves parallel work and lowers risk from undocumented manual changes."
    difficulty: "junior"
    isCode: false

  - q: "Why are code quality gates useful in large CI systems?"
    options:
      - text: "They enforce minimum standards before changes move further toward release"
        correct: true
      - text: "They allow teams to skip documentation because pipeline already checks quality"
        correct: false
      - text: "They replace human judgment in all reviews"
        correct: false
      - text: "They guarantee every merge is architecturally correct"
        correct: false
    explanation: "Quality gates such as lint, test, coverage, or security checks stop obvious bad changes early. They do not replace design review or documentation. In large repos, automation keeps standards consistent across many contributors."
    difficulty: "mid"
    isCode: false
---

# DevOps Questions

Conceptual DevOps questions covering CI, infrastructure automation, container orchestration, pipeline security, cost efficiency, continuous delivery, enterprise-scale operations, automated testing, orchestration tool tradeoffs, and IaC collaboration.
