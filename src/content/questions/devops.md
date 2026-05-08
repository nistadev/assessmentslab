---
defaultDomains:
  - data-infra
defaultTopics:
  - devops
questions:
  - q: Which practice is most fundamental for effective continuous integration in a large project?
    options:
      - text: Keep code in single source repository and automate build and test on each change
        correct: true
      - text: Deploy to a staging environment on every merge to validate integration early
        correct: false
      - text: Require all changes to pass peer review before triggering any automated build
        correct: false
      - text: Enforce branch-per-feature policies with automated merge trains to prevent conflicts
        correct: false
    explanation: CI depends on shared source of truth plus automated verification on change. Staging deployment on every merge is CD, not CI. Requiring review before builds slows the feedback loop CI is designed to shorten. Merge trains and feature branches are workflow conventions, not the foundation of CI itself. In large systems, reliability starts with repeatable automation tied to version control.
    difficulty: junior
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
    explanation: Fast feedback is core CI value. Slow pipelines increase batch size, delay fixes, and reduce trust in automation. Parallelism and resource contention are scheduling concerns, not why speed matters. Flakiness comes from isolation issues, not suite speed. Fast suites do not replace staging or broader test coverage, but they keep inner loop usable.
    difficulty: mid
  - q: What is main benefit of storing CI configuration and scripts in version control?
    options:
      - text: Pipeline behavior becomes reviewable, reproducible, and auditable
        correct: true
      - text: It decouples pipeline definitions from the runtime environment for portability
        correct: false
      - text: It allows pipeline agents to self-update configuration without admin intervention
        correct: false
      - text: It encrypts secrets alongside build scripts for centralized credential management
        correct: false
    explanation: Versioning CI config gives history, peer review, rollback, and shared visibility. Decoupling from runtime is a nice property but not the main benefit. Self-updating agents and secret management are unrelated concerns that version control does not address. In production, pipeline changes are code and should be treated like code.
    difficulty: junior
  - q: Which approach best supports scalable and repeatable infrastructure automation?
    options:
      - text: Define infrastructure as code with reusable modules and idempotent automation
        correct: true
      - text: Use configuration management tools to apply settings to existing servers after provisioning
        correct: false
      - text: Build golden VM images for each environment to enforce environment parity
        correct: false
      - text: Automate provisioning and handle configuration changes manually to limit blast radius
        correct: false
    explanation: Scalable infrastructure automation depends on declarative or scripted IaC, modularity, and repeatability. Configuration management tools are complementary but apply to existing infrastructure, not a substitute for IaC. Golden images help immutable infrastructure patterns but do not cover all infrastructure types. Manual configuration changes reintroduce drift. In growing systems, repeatable provisioning is non-negotiable.
    difficulty: junior
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
    explanation: Idempotent automation is safe to rerun and crucial for repair, retries, and drift correction. Preventing race conditions requires locking mechanisms, not idempotency. Atomicity and drift detection are related but separate concerns. Non-idempotent scripts often fail or duplicate resources when retried. In real operations, reruns happen constantly.
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
    explanation: Production orchestration must handle resilience, networking, storage, and operational safety. Image size, port mapping, and network namespace sharing are implementation details that matter at the margins but are not critical production orchestration concerns. In enterprise environments, orchestration platform value is in handling cross-cutting concerns consistently.
    difficulty: mid
  - q: What is strongest baseline control for securing CI pipelines?
    options:
      - text: Restrict access, protect secrets, and apply least privilege to pipeline identities
        correct: true
      - text: Run all pipeline jobs in ephemeral isolated environments that are destroyed after each run
        correct: false
      - text: Require signed commits and verify committer identity before triggering any pipeline
        correct: false
      - text: Pin all dependency versions in pipeline scripts to prevent supply chain substitution
        correct: false
    explanation: CI pipelines are privileged execution environments, so access control, secret protection, and least privilege are foundational. Ephemeral environments, commit signing, and dependency pinning are valuable hardening measures but are not the baseline. Shared admin credentials and unrestricted edits create major supply-chain risk regardless of other controls. Security must be built into pipeline design, not added later.
    difficulty: senior
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
    explanation: Dependency scanning helps surface known CVEs early, before deployment. SBOM generation, version pinning, and allowlist enforcement are separate and complementary controls. Scanning is one layer only and does not replace patching or broader security review. In production CI, automated scanning reduces avoidable exposure.
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
    explanation: Cost optimization starts with accurate resource sizing and dynamic scaling. Bin packing onto fewer nodes can help but without proper sizing it just moves waste around. Namespace quotas enforce limits but do not reduce actual consumption. Pre-warming reduces latency but increases cost. In real clusters, utilization data should drive tuning.
    difficulty: mid
  - q: When are spot instances or preemptible VMs most useful in orchestration platforms?
    options:
      - text: For fault-tolerant workloads that can handle interruption in exchange for lower cost
        correct: true
      - text: For stateful database replicas that benefit from automatic failover on spot reclamation
        correct: false
      - text: For workloads with strict latency SLAs that require guaranteed compute availability
        correct: false
      - text: For critical services where checkpoint-and-resume reduces overall job completion time
        correct: false
    explanation: Spot or preemptible capacity is cheap because it can disappear. Good use cases are stateless or resilient jobs, batch work, and flexible background processing. Database replicas and latency-sensitive services need stronger availability guarantees. Checkpoint-and-resume is a technique that makes a workload spot-compatible, but it does not make spots appropriate for critical services.
    difficulty: senior
  - q: Which deployment strategy best supports low-risk continuous delivery with easy rollback?
    options:
      - text: Blue-green or canary deployment with automated rollback paths
        correct: true
      - text: Rolling deployment with readiness probes and a minimum healthy percentage threshold
        correct: false
      - text: Feature flags combined with a single production environment and instant toggle rollback
        correct: false
      - text: Immutable deployments using versioned artifacts with previous-version fallback in DNS
        correct: false
    explanation: Blue-green and canary patterns limit blast radius and make rollback immediate and clean. Rolling deployments are lower-risk than big-bang but leave no clean cutover point for rollback. Feature flags are powerful but rely on application code paths working correctly. Immutable artifact deployments are sound but DNS-based rollback is slow and unreliable. Mature continuous delivery optimizes safe change frequency, not heroic release events.
    difficulty: senior
  - q: What is biggest operational challenge of container orchestration at enterprise scale?
    options:
      - text: Managing complexity across networking, security, storage, scaling, and cluster operations
        correct: true
      - text: Ensuring container image registries are available across all regions with acceptable pull latency
        correct: false
      - text: Preventing namespace proliferation that leads to resource quota conflicts across teams
        correct: false
      - text: Maintaining pod scheduling efficiency as cluster node count grows beyond a few hundred
        correct: false
    explanation: Enterprise orchestration is hard because many distributed systems concerns interact at once. Registry availability, namespace sprawl, and scheduler efficiency are real operational problems but are individual symptoms of the broader complexity challenge. Managed platforms can reduce some burden, but complexity remains. Success depends on strong operational patterns, not only tool choice.
    difficulty: principal
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
    explanation: Good CI testing runs automatically, covers multiple levels, and returns visible results quickly. Deferring integration tests to nightly runs delays feedback on real breakages. End-to-end tests are the slowest and most brittle, so relying on them alone weakens the inner loop. Sequential execution does not improve failure detection and slows feedback. Relying on rare or single-layer testing weakens confidence and slows delivery.
    difficulty: mid
  - q: Which statement best compares Kubernetes, Docker Swarm, and Apache Mesos?
    options:
      - text: Kubernetes offers broad feature depth and ecosystem, Swarm is simpler, and Mesos is powerful but complex
        correct: true
      - text: Swarm is preferred for stateful database workloads because it has native persistent volume management
        correct: false
      - text: Mesos is now the standard choice for new container workloads due to its multi-framework scheduler support
        correct: false
      - text: Kubernetes requires more manual networking configuration than Swarm or Mesos for most use cases
        correct: false
    explanation: These tools differ mainly in ecosystem, complexity, and operational model. Kubernetes dominates for flexibility and scale, Swarm trades depth for simplicity, and Mesos historically offered broad scheduling power with more setup burden. Swarm does not have particular advantages for stateful workloads. Mesos adoption has declined significantly. Kubernetes has extensive CNI options that simplify networking for most teams. Tool choice should match team capability and problem size.
    difficulty: senior
  - q: How does Infrastructure as Code improve collaboration inside DevOps teams?
    options:
      - text: Infrastructure changes become reviewable, reusable, versioned, and less prone to configuration drift
        correct: true
      - text: It generates infrastructure documentation automatically from resource definitions
        correct: false
      - text: It reduces the need for environment-specific configuration by abstracting provider differences
        correct: false
      - text: It enforces a single cloud provider so teams avoid splitting expertise across tools
        correct: false
    explanation: IaC turns infrastructure into shared code artifacts that teams can review, reuse, and evolve together. Documentation generation depends on tooling choices and is not a core collaboration benefit. Abstracting provider differences is a goal of some frameworks but is separate from collaboration. Provider lock-in is a tradeoff to manage, not a goal. In practice, IaC improves parallel work and lowers risk from undocumented manual changes.
    difficulty: junior
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
    explanation: Quality gates such as lint, test, coverage, or security checks stop obvious bad changes early. Performance benchmarking and coverage thresholds are specific types of quality gates, not what makes gates useful in general. Quality gates complement human review — they do not replace it. In large repos, automation keeps standards consistent across many contributors.
    difficulty: mid
---

# DevOps Questions

Conceptual DevOps questions covering CI, infrastructure automation, container orchestration, pipeline security, cost efficiency, continuous delivery, enterprise-scale operations, automated testing, orchestration tool tradeoffs, and IaC collaboration.
