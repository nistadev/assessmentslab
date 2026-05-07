---
defaultDomains:
  - backend
defaultTopics:
  - backend
questions:
  - q: Which database schema practice most directly reduces redundant data in large applications?
    options:
      - text: Normalize schema to suitable normal form
        correct: true
      - text: Duplicate all lookup data across tables
        correct: false
      - text: Avoid constraints so writes stay flexible
        correct: false
      - text: Store every relation as JSON in one table
        correct: false
    explanation: Normalization reduces redundancy and update anomalies by separating data into well-structured relations. Blind duplication and constraint-free design create integrity problems later. In production, teams balance normalization with pragmatic denormalization only when performance demands it.
    difficulty: junior
  - q: Why are foreign keys and constraints valuable in a large-scale database schema?
    options:
      - text: They enforce data integrity rules close to the data itself
        correct: true
      - text: They automatically shard tables across nodes
        correct: false
      - text: They remove need for indexes
        correct: false
      - text: They guarantee every query uses optimal execution plan
        correct: false
    explanation: Foreign keys and constraints prevent invalid relationships and bad writes at database level. They do not replace indexing, sharding, or query tuning. In multi-service systems, database-enforced integrity is often last line of defense against application bugs.
    difficulty: mid
  - q: Which technique is primarily used to reduce payload size in high-traffic REST APIs?
    options:
      - text: Pagination and filtering
        correct: true
      - text: Adding more fields to every response for future flexibility
        correct: false
      - text: Returning full related resource graphs by default
        correct: false
      - text: Disabling compression to save CPU
        correct: false
    explanation: Pagination and filtering limit how much data travels per request. Large default payloads waste bandwidth and slow clients. In heavy-traffic systems, efficient response shaping is one of simplest wins.
    difficulty: junior
  - q: What is strongest reason to cache frequent REST API responses?
    options:
      - text: Reduce repeated backend work and improve latency under load
        correct: true
      - text: Guarantee permanently fresh data
        correct: false
      - text: Replace need for rate limiting
        correct: false
      - text: Avoid monitoring hot endpoints
        correct: false
    explanation: Caching cuts repeated computation and database load, improving throughput and response time. It does not guarantee freshness or replace rate limiting and monitoring. In production, cache strategy must account for invalidation and staleness tradeoffs.
    difficulty: mid
  - q: Which statement best captures ACID vs BASE tradeoff in distributed systems?
    options:
      - text: ACID prioritizes strong consistency in transactions, while BASE accepts eventual consistency for higher availability or scale
        correct: true
      - text: BASE is stricter than ACID about immediate consistency
        correct: false
      - text: ACID applies only to SQL databases and BASE only to NoSQL databases
        correct: false
      - text: They are different names for same consistency model
        correct: false
    explanation: ACID focuses on transactional guarantees, while BASE accepts looser consistency to improve distribution characteristics. This is architectural tradeoff, not simple SQL-vs-NoSQL split. Backend design depends on which failure modes business can tolerate.
    difficulty: senior
  - q: What role do consensus algorithms such as Raft or Paxos play in distributed databases?
    options:
      - text: Help nodes agree on shared state changes despite failures
        correct: true
      - text: Compress replication traffic for faster backups
        correct: false
      - text: Replace need for data reconciliation
        correct: false
      - text: Turn eventual consistency into zero-latency consistency
        correct: false
    explanation: Consensus algorithms coordinate agreement across distributed nodes, especially for leader election and replicated logs. They do not eliminate all operational complexity or make consistency free. In production, they underpin safety when networks and nodes fail.
    difficulty: principal
  - q: Which SQL optimization is most useful when same high-selectivity column appears often in WHERE clauses?
    options:
      - text: Index that hot column
        correct: true
      - text: Replace all joins with application-side loops
        correct: false
      - text: Use SELECT * so optimizer has full context
        correct: false
      - text: Disable query plan analysis to reduce overhead
        correct: false
    explanation: Indexing frequently filtered columns often improves lookup speed dramatically. Replacing joins blindly or using SELECT * usually makes performance worse. In high-concurrency systems, targeted indexes are often first tuning step.
    difficulty: junior
  - q: Why should high-concurrency SQL systems avoid `SELECT *` in hot paths?
    options:
      - text: It fetches unnecessary columns, increasing I/O and transfer cost
        correct: true
      - text: It prevents use of parameterized queries
        correct: false
      - text: It disables transaction isolation
        correct: false
      - text: It makes indexes impossible to create
        correct: false
    explanation: Selecting only needed columns reduces row width, memory usage, network transfer, and can improve index-only plan opportunities. `SELECT *` is convenient but often expensive on busy endpoints. In production, explicit column selection protects performance and API stability.
    difficulty: mid
  - q: What is main architectural benefit of using message queues for asynchronous backend workflows?
    options:
      - text: They decouple long-running work from request-response path
        correct: true
      - text: They make every task execute immediately
        correct: false
      - text: They remove need for retries and monitoring
        correct: false
      - text: They guarantee strict ordering across all services by default
        correct: false
    explanation: Message queues let user-facing endpoints stay fast while workers process expensive tasks separately. They do not remove operational concerns like retries, ordering, or observability. In scalable systems, this separation is core to resilience.
    difficulty: mid
  - q: Which pattern is commonly used to coordinate transactions across multiple microservices without global database locks?
    options:
      - text: Saga pattern with compensating actions
        correct: true
      - text: Single giant shared table for all services
        correct: false
      - text: Disable retries so duplicate work cannot happen
        correct: false
      - text: Use client-side polling as transaction coordinator
        correct: false
    explanation: Saga coordinates distributed workflow as sequence of local transactions plus compensation on failure. It is usually more practical than global locking across services. In production, it pairs well with idempotency and event-driven communication.
    difficulty: senior
  - q: Why is idempotency important in distributed transactional workflows?
    options:
      - text: Retries can happen, and repeated processing must not create incorrect duplicate effects
        correct: true
      - text: It makes every operation strongly consistent
        correct: false
      - text: It removes need for authentication
        correct: false
      - text: It guarantees ordering between unrelated events
        correct: false
    explanation: Distributed systems retry requests, replay events, and recover after partial failure. Idempotent operations keep those retries safe. Without it, payments, emails, and inventory changes can duplicate under failure conditions.
    difficulty: senior
  - q: What is most important goal of robust API versioning?
    options:
      - text: Allow API evolution without unexpectedly breaking existing clients
        correct: true
      - text: Force every consumer to upgrade immediately
        correct: false
      - text: Eliminate need for API documentation
        correct: false
      - text: Guarantee one permanent version forever
        correct: false
    explanation: Versioning exists to support change while protecting current integrations. Good versioning also needs communication, documentation, deprecation policy, and testing. In enterprise systems, backward compatibility is usually business requirement, not preference.
    difficulty: junior
  - q: Which observability practice most directly enables tracing one request across many backend services?
    options:
      - text: Propagate trace IDs or correlation IDs through each hop
        correct: true
      - text: Rotate logs more frequently
        correct: false
      - text: Compress database backups nightly
        correct: false
      - text: Pin requests to single server instance
        correct: false
    explanation: Trace or correlation IDs connect logs, spans, and metrics for same request path across services. Log rotation and backups matter operationally but do not solve distributed tracing. In microservice systems, this is foundational for debugging latency and failures.
    difficulty: mid
  - q: Which retry strategy is generally safest for transient backend failures under load?
    options:
      - text: Exponential backoff, ideally with jitter
        correct: true
      - text: Immediate infinite retries with no delay
        correct: false
      - text: Retry every failed request exactly once at same millisecond
        correct: false
      - text: Disable retries everywhere to protect downstreams
        correct: false
    explanation: Exponential backoff reduces retry storms and gives downstream systems time to recover. Jitter prevents synchronized clients from retrying together. In production, naive retries can amplify outages instead of healing them.
    difficulty: senior
  - q: What is purpose of a dead-letter queue in asynchronous backend processing?
    options:
      - text: Capture messages that repeatedly fail so they can be inspected or replayed safely
        correct: true
      - text: Store successful messages for long-term analytics only
        correct: false
      - text: Replace main queue during deployments
        correct: false
      - text: Guarantee every message is processed exactly once
        correct: false
    explanation: Dead-letter queues isolate poison messages after retry exhaustion, preventing them from blocking main processing flow. They do not magically ensure exactly-once delivery. In production, DLQs are critical for recovery and root-cause analysis.
    difficulty: principal
  - q: Which database security control most directly limits blast radius if application credentials are compromised?
    options:
      - text: Principle of least privilege with role-based access control
        correct: true
      - text: Grant full admin rights so queries never fail unexpectedly
        correct: false
      - text: Disable audit logs to reduce storage costs
        correct: false
      - text: Expose database directly to internet for easier debugging
        correct: false
    explanation: Least privilege and RBAC restrict what stolen credentials can do, limiting damage. Full access, no audit trail, and public exposure increase risk substantially. In production, security posture depends on layered controls, not trust in application code.
    difficulty: mid
  - q: Which combination best supports database security auditing in production?
    options:
      - text: Audit logging, strong authentication, encryption, patching, and periodic security reviews
        correct: true
      - text: One-time password rotation during initial launch
        correct: false
      - text: Rely only on firewall rules and skip query logging
        correct: false
      - text: Use shared admin account so audit trail stays centralized
        correct: false
    explanation: "Production database security needs layered controls: identity, encryption, auditing, maintenance, and review. One-time actions or shared privileged accounts weaken accountability. Continuous enforcement and inspection are what make auditing meaningful."
    difficulty: principal
---

# Backend Questions

Conceptual backend questions covering schema design, REST API scalability, distributed consistency, SQL performance, async workflows, microservice transactions, versioning, observability, retries, and database security.
