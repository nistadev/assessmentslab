---
defaultDomains:
- backend
defaultTopics:
- backend
questions:
- q: Which statement best captures ACID vs BASE tradeoff in distributed systems?
  options:
  - text: ACID prioritizes strong consistency in transactions, while BASE accepts eventual consistency for higher availability
      or scale
    correct: true
  - text: ACID is always the right choice for relational databases, regardless of distribution scale
    correct: false
  - text: BASE relaxes durability guarantees to improve write throughput in single-node databases
    correct: false
  - text: Distributed two-phase commit achieves ACID guarantees across services without significant latency cost
    correct: false
  explanation: ACID focuses on transactional guarantees, while BASE accepts looser consistency to improve distribution characteristics.
    ACID at true distributed scale is expensive. BASE is about consistency tradeoffs, not durability relaxation. 2PC across
    services adds significant latency and coordination cost. Backend design depends on which failure modes business can tolerate.
  difficulty: senior
- q: Which pattern is commonly used to coordinate transactions across multiple microservices without global database locks?
  options:
  - text: Saga pattern with compensating actions
    correct: true
  - text: Two-phase commit coordinated by a dedicated transaction manager service
    correct: false
  - text: Outbox pattern with polling to guarantee exactly-once delivery between services
    correct: false
  - text: Eventual consistency enforced through a shared event log with no rollback support
    correct: false
  explanation: Saga coordinates distributed workflow as sequence of local transactions plus compensation on failure. Two-phase
    commit works but introduces tight coupling and availability risk at scale. The outbox pattern solves reliable event publishing,
    not cross-service transaction coordination. In production, Saga pairs well with idempotency and event-driven communication.
  difficulty: senior
- q: Why is idempotency important in distributed transactional workflows?
  options:
  - text: Retries can happen, and repeated processing must not create incorrect duplicate effects
    correct: true
  - text: It ensures messages are processed in the order they were originally sent, even after network reorder
    correct: false
  - text: It allows services to skip acknowledgment, reducing round trips under load
    correct: false
  - text: It guarantees that each operation completes within a bounded time window
    correct: false
  explanation: Distributed systems retry requests, replay events, and recover after partial failure. Idempotent operations
    keep those retries safe. Ordering, acknowledgment, and bounded execution time are separate concerns. Without idempotency,
    payments, emails, and inventory changes can duplicate under failure conditions.
  difficulty: senior
- q: Which retry strategy is generally safest for transient backend failures under load?
  options:
  - text: Exponential backoff, ideally with jitter
    correct: true
  - text: Fixed-interval retries with a short delay to give downstream services time to recover
    correct: false
  - text: Linear backoff so retry pressure decreases predictably over time
    correct: false
  - text: Circuit breaker with no retries to protect downstream from any additional load
    correct: false
  explanation: Exponential backoff reduces retry storms and gives downstream systems time to recover. Jitter prevents synchronized
    clients from retrying together. Fixed and linear backoff are improvements over immediate retries but still risk synchronized
    spikes. Circuit breakers are complementary, not a replacement for retry strategy. In production, naive retries can amplify
    outages instead of healing them.
  difficulty: senior
---
