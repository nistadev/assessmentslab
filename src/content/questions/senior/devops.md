---
defaultDomains:
- data-infra
defaultTopics:
- devops
questions:
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
  explanation: CI pipelines are privileged execution environments, so access control, secret protection, and least privilege
    are foundational. Ephemeral environments, commit signing, and dependency pinning are valuable hardening measures but are
    not the baseline. Shared admin credentials and unrestricted edits create major supply-chain risk regardless of other controls.
    Security must be built into pipeline design, not added later.
  difficulty: senior
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
  explanation: Spot or preemptible capacity is cheap because it can disappear. Good use cases are stateless or resilient jobs,
    batch work, and flexible background processing. Database replicas and latency-sensitive services need stronger availability
    guarantees. Checkpoint-and-resume is a technique that makes a workload spot-compatible, but it does not make spots appropriate
    for critical services.
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
  explanation: Blue-green and canary patterns limit blast radius and make rollback immediate and clean. Rolling deployments
    are lower-risk than big-bang but leave no clean cutover point for rollback. Feature flags are powerful but rely on application
    code paths working correctly. Immutable artifact deployments are sound but DNS-based rollback is slow and unreliable.
    Mature continuous delivery optimizes safe change frequency, not heroic release events.
  difficulty: senior
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
  explanation: These tools differ mainly in ecosystem, complexity, and operational model. Kubernetes dominates for flexibility
    and scale, Swarm trades depth for simplicity, and Mesos historically offered broad scheduling power with more setup burden.
    Swarm does not have particular advantages for stateful workloads. Mesos adoption has declined significantly. Kubernetes
    has extensive CNI options that simplify networking for most teams. Tool choice should match team capability and problem
    size.
  difficulty: senior
---
