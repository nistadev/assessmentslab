---
defaultDomains:
- backend
defaultTopics:
- backend
questions:
- q: What role do consensus algorithms such as Raft or Paxos play in distributed databases?
  options:
  - text: Help nodes agree on shared state changes despite failures
    correct: true
  - text: Coordinate query routing so reads always hit the most up-to-date replica
    correct: false
  - text: Ensure writes are durable by replicating to all nodes before acknowledging
    correct: false
  - text: Batch replication log entries to reduce network overhead during partition recovery
    correct: false
  explanation: Consensus algorithms coordinate agreement across distributed nodes for leader election and replicated logs.
    They do not route reads, guarantee synchronous full replication, or primarily serve as compression mechanisms. In production,
    they underpin safety when networks and nodes fail.
  difficulty: principal
- q: What is purpose of a dead-letter queue in asynchronous backend processing?
  options:
  - text: Capture messages that repeatedly fail so they can be inspected or replayed safely
    correct: true
  - text: Buffer messages temporarily during planned consumer downtime to avoid data loss
    correct: false
  - text: Throttle high-volume producers to match consumer processing capacity
    correct: false
  - text: Archive successfully processed messages for compliance and audit purposes
    correct: false
  explanation: Dead-letter queues isolate poison messages after retry exhaustion, preventing them from blocking main processing
    flow. Buffering during downtime is what the main queue does. Throttling producers is backpressure, a separate concern.
    DLQs hold failed messages, not successful ones. In production, DLQs are critical for recovery and root-cause analysis.
  difficulty: principal
- q: Which combination best supports database security auditing in production?
  options:
  - text: Audit logging, strong authentication, encryption, patching, and periodic security reviews
    correct: true
  - text: Enabling query logging on the read replica only to avoid performance impact on the primary
    correct: false
  - text: Restricting network access with firewall rules and relying on IP allowlisting for authentication
    correct: false
  - text: Automated schema change approval workflows with documented rollback procedures
    correct: false
  explanation: 'Production database security needs layered controls: identity, encryption, auditing, maintenance, and review.
    Replica-only logging misses writes on the primary. Network controls are one layer, not a complete security posture. Schema
    change workflows address change management, not security auditing. Continuous enforcement and inspection are what make
    auditing meaningful.'
  difficulty: principal
---
