---
defaultDomains:
- data-infra
defaultTopics:
- devops
questions:
- q: Why are fast test suites important in continuous integration?
  options:
  - text: They provide rapid feedback so developers can fix issues before context is lost
    correct: true
  - text: They allow more aggressive parallelism by reducing resource contention per job
    correct: false
  - text: They prevent flaky failures caused by test isolation issues in slow sequential suites
    correct: false
  - text: They reduce the need for staging environments by validating behavior more frequently
    correct: false
  explanation: Fast feedback is core CI value. Slow pipelines increase batch size, delay fixes, and reduce trust in automation.
    Parallelism and resource contention are scheduling concerns, not why speed matters. Flakiness comes from isolation issues,
    not suite speed. Fast suites do not replace staging or broader test coverage, but they keep inner loop usable.
  difficulty: mid
- q: Why is idempotency important in infrastructure automation?
  options:
  - text: Running same automation repeatedly should converge on same desired state without unintended side effects
    correct: true
  - text: It prevents simultaneous runs from creating race conditions during parallel provisioning
    correct: false
  - text: It ensures resource changes are atomic so partial failures never leave inconsistent state
    correct: false
  - text: It allows automation to detect configuration drift by comparing current and desired state
    correct: false
  explanation: Idempotent automation is safe to rerun and crucial for repair, retries, and drift correction. Preventing race
    conditions requires locking mechanisms, not idempotency. Atomicity and drift detection are related but separate concerns.
    Non-idempotent scripts often fail or duplicate resources when retried. In real operations, reruns happen constantly.
  difficulty: mid
- q: Which concern is critical when orchestrating containers in production?
  options:
  - text: High availability, service discovery, storage, security, and self-healing
    correct: true
  - text: Selecting the right base image size to minimize container startup time
    correct: false
  - text: Mapping container ports explicitly to host ports to simplify external access routing
    correct: false
  - text: Ensuring containers share a host network namespace for low-latency service communication
    correct: false
  explanation: Production orchestration must handle resilience, networking, storage, and operational safety. Image size, port
    mapping, and network namespace sharing are implementation details that matter at the margins but are not critical production
    orchestration concerns. In enterprise environments, orchestration platform value is in handling cross-cutting concerns
    consistently.
  difficulty: mid
- q: Why should dependency vulnerability scanning be part of CI?
  options:
  - text: It catches known vulnerable packages before they ship further through pipeline
    correct: true
  - text: It generates a software bill of materials automatically for every build artifact
    correct: false
  - text: It validates that all direct dependencies are pinned to exact versions in lock files
    correct: false
  - text: It prevents packages from being imported that are not approved by security teams
    correct: false
  explanation: Dependency scanning helps surface known CVEs early, before deployment. SBOM generation, version pinning, and
    allowlist enforcement are separate and complementary controls. Scanning is one layer only and does not replace patching
    or broader security review. In production CI, automated scanning reduces avoidable exposure.
  difficulty: mid
- q: Which tactic most directly improves cost efficiency in container orchestration?
  options:
  - text: Right-size resource requests and limits, then autoscale based on real usage
    correct: true
  - text: Consolidate all workloads onto fewer larger nodes to maximize physical host utilization
    correct: false
  - text: Apply namespace-level resource quotas to enforce team budget limits at cluster level
    correct: false
  - text: Pre-warm node pools before expected traffic increases to avoid cold-start latency costs
    correct: false
  explanation: Cost optimization starts with accurate resource sizing and dynamic scaling. Bin packing onto fewer nodes can
    help but without proper sizing it just moves waste around. Namespace quotas enforce limits but do not reduce actual consumption.
    Pre-warming reduces latency but increases cost. In real clusters, utilization data should drive tuning.
  difficulty: mid
- q: How should automated testing be integrated into CI pipelines?
  options:
  - text: Trigger unit, integration, and end-to-end tests automatically on changes, with parallelization and reporting
    correct: true
  - text: Gate only on unit tests in CI and run integration tests in separate nightly pipelines
    correct: false
  - text: Prioritize end-to-end tests in CI because they provide the highest confidence per test run
    correct: false
  - text: Run the full test suite sequentially to detect cascading failures across test levels
    correct: false
  explanation: Good CI testing runs automatically, covers multiple levels, and returns visible results quickly. Deferring
    integration tests to nightly runs delays feedback on real breakages. End-to-end tests are the slowest and most brittle,
    so relying on them alone weakens the inner loop. Sequential execution does not improve failure detection and slows feedback.
    Relying on rare or single-layer testing weakens confidence and slows delivery.
  difficulty: mid
- q: Why are code quality gates useful in large CI systems?
  options:
  - text: They enforce minimum standards before changes move further toward release
    correct: true
  - text: They catch performance regressions automatically by comparing benchmark results to a baseline
    correct: false
  - text: They ensure test coverage thresholds are met before any feature branch can be merged
    correct: false
  - text: They replace manual code review for teams that have standardized on static analysis tools
    correct: false
  explanation: Quality gates such as lint, test, coverage, or security checks stop obvious bad changes early. Performance
    benchmarking and coverage thresholds are specific types of quality gates, not what makes gates useful in general. Quality
    gates complement human review — they do not replace it. In large repos, automation keeps standards consistent across many
    contributors.
  difficulty: mid
---
