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
      - text: Denormalize hot tables to eliminate expensive joins at scale
        correct: false
      - text: Use materialized views to consolidate repeated query results
        correct: false
      - text: Apply surrogate keys across all tables to decouple natural key dependencies
        correct: false
    explanation: Normalization reduces redundancy and update anomalies by separating data into well-structured relations. Denormalization, materialized views, and surrogate keys address performance or modeling concerns but do not reduce redundancy. In production, teams balance normalization with pragmatic denormalization only when performance demands it.
    difficulty: junior
  - q: Why are foreign keys and constraints valuable in a large-scale database schema?
    options:
      - text: They enforce data integrity rules close to the data itself
        correct: true
      - text: They improve read performance by enabling the query planner to skip redundant checks
        correct: false
      - text: They replace application-layer validation once tables grow beyond a certain size
        correct: false
      - text: They guarantee consistent behavior when the schema is accessed by multiple services concurrently
        correct: false
    explanation: Foreign keys and constraints prevent invalid relationships and bad writes at database level. They do not replace indexing, application validation, or transaction isolation. In multi-service systems, database-enforced integrity is often last line of defense against application bugs.
    difficulty: mid
  - q: Which technique is primarily used to limit the volume of data returned per request in high-traffic REST APIs?
    options:
      - text: Pagination and filtering
        correct: true
      - text: Response compression at the gateway layer
        correct: false
      - text: HTTP/2 multiplexing to batch concurrent requests
        correct: false
      - text: Sparse fieldsets using query parameters to project columns
        correct: false
    explanation: Pagination and filtering limit how many records travel per request. Compression reduces size of a given payload but does not limit record count. HTTP/2 multiplexing improves connection efficiency. Sparse fieldsets reduce column width but not result set size. In heavy-traffic systems, limiting result volume is one of simplest wins.
    difficulty: junior
  - q: What is strongest reason to cache frequent REST API responses?
    options:
      - text: Reduce repeated backend work and improve latency under load
        correct: true
      - text: Serve stale data as a resilience fallback during upstream degradation
        correct: false
      - text: Reduce database connection pool pressure during traffic spikes
        correct: false
      - text: Bypass rate limiting for trusted internal service-to-service calls
        correct: false
    explanation: Caching cuts repeated computation and database load, improving throughput and response time. Serving stale data as a fallback is a secondary pattern. Reducing connection pressure is a side effect, not the primary goal. In production, cache strategy must account for invalidation and staleness tradeoffs.
    difficulty: mid
  - q: Which statement best captures ACID vs BASE tradeoff in distributed systems?
    options:
      - text: ACID prioritizes strong consistency in transactions, while BASE accepts eventual consistency for higher availability or scale
        correct: true
      - text: ACID is always the right choice for relational databases, regardless of distribution scale
        correct: false
      - text: BASE relaxes durability guarantees to improve write throughput in single-node databases
        correct: false
      - text: Distributed two-phase commit achieves ACID guarantees across services without significant latency cost
        correct: false
    explanation: ACID focuses on transactional guarantees, while BASE accepts looser consistency to improve distribution characteristics. ACID at true distributed scale is expensive. BASE is about consistency tradeoffs, not durability relaxation. 2PC across services adds significant latency and coordination cost. Backend design depends on which failure modes business can tolerate.
    difficulty: senior
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
    explanation: Consensus algorithms coordinate agreement across distributed nodes for leader election and replicated logs. They do not route reads, guarantee synchronous full replication, or primarily serve as compression mechanisms. In production, they underpin safety when networks and nodes fail.
    difficulty: principal
  - q: Which SQL optimization is most useful when same high-selectivity column appears often in WHERE clauses?
    options:
      - text: Index that hot column
        correct: true
      - text: Partition the table on that column so the planner can prune partitions automatically
        correct: false
      - text: Add a covering index on all columns to give the optimizer full visibility
        correct: false
      - text: Cluster table rows by that column to improve sequential scan locality
        correct: false
    explanation: Indexing a frequently filtered high-selectivity column directly enables fast lookups. Partitioning on that column helps range pruning but adds management overhead and is not always the right fit. A covering index on all columns is expensive to maintain. Clustering helps sequential scans but not individual row lookups. Targeted indexes are often first tuning step.
    difficulty: junior
  - q: Why should high-concurrency SQL systems avoid `SELECT *` in hot paths?
    options:
      - text: It fetches unnecessary columns, increasing I/O and transfer cost
        correct: true
      - text: It forces a full table scan even when a usable index exists on the queried columns
        correct: false
      - text: It prevents the query planner from reusing prepared statement execution plans
        correct: false
      - text: It breaks row-level security policies that restrict column visibility per role
        correct: false
    explanation: Selecting only needed columns reduces row width, memory usage, network transfer, and can enable index-only plan opportunities. `SELECT *` does not inherently prevent index use or plan reuse, though it can block covering-index scans. In production, explicit column selection protects performance and API stability.
    difficulty: mid
  - q: What is main architectural benefit of using message queues for asynchronous backend workflows?
    options:
      - text: They decouple long-running work from request-response path
        correct: true
      - text: They replace distributed transactions by making all writes atomic across services
        correct: false
      - text: They provide at-most-once delivery guarantees for time-sensitive notifications
        correct: false
      - text: They allow producers to block until all consumers have acknowledged each message
        correct: false
    explanation: Message queues let user-facing endpoints stay fast while workers process expensive tasks separately. They do not provide atomicity across services, and delivery semantics vary by system and configuration. Blocking producers defeats the async benefit. In scalable systems, this decoupling is core to resilience.
    difficulty: mid
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
    explanation: Saga coordinates distributed workflow as sequence of local transactions plus compensation on failure. Two-phase commit works but introduces tight coupling and availability risk at scale. The outbox pattern solves reliable event publishing, not cross-service transaction coordination. In production, Saga pairs well with idempotency and event-driven communication.
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
    explanation: Distributed systems retry requests, replay events, and recover after partial failure. Idempotent operations keep those retries safe. Ordering, acknowledgment, and bounded execution time are separate concerns. Without idempotency, payments, emails, and inventory changes can duplicate under failure conditions.
    difficulty: senior
  - q: What is most important goal of robust API versioning?
    options:
      - text: Allow API evolution without unexpectedly breaking existing clients
        correct: true
      - text: Signal breaking changes through semantic versioning only, without maintaining old endpoints
        correct: false
      - text: Reduce API surface area by deprecating low-traffic endpoints immediately
        correct: false
      - text: Pin all consumers to the same version to simplify compatibility testing
        correct: false
    explanation: Versioning exists to support change while protecting current integrations. Semantic versioning signals intent but does not by itself protect running clients. Aggressive deprecation and forcing version lock both undermine the purpose of versioning. In enterprise systems, backward compatibility is usually a business requirement, not a preference.
    difficulty: junior
  - q: Which observability practice most directly enables tracing one request across many backend services?
    options:
      - text: Propagate trace IDs or correlation IDs through each hop
        correct: true
      - text: Aggregate all service logs into a centralized store with aligned timestamps
        correct: false
      - text: Use structured logging with consistent severity levels across all services
        correct: false
      - text: Instrument each service independently and correlate spans offline using request timestamps
        correct: false
    explanation: Trace or correlation IDs connect logs, spans, and metrics for same request path across services. Centralized logs and structured logging help but do not stitch requests together across service boundaries on their own. Timestamp-based correlation is unreliable due to clock skew. In microservice systems, propagated IDs are foundational for debugging latency and failures.
    difficulty: mid
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
    explanation: Exponential backoff reduces retry storms and gives downstream systems time to recover. Jitter prevents synchronized clients from retrying together. Fixed and linear backoff are improvements over immediate retries but still risk synchronized spikes. Circuit breakers are complementary, not a replacement for retry strategy. In production, naive retries can amplify outages instead of healing them.
    difficulty: senior
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
    explanation: Dead-letter queues isolate poison messages after retry exhaustion, preventing them from blocking main processing flow. Buffering during downtime is what the main queue does. Throttling producers is backpressure, a separate concern. DLQs hold failed messages, not successful ones. In production, DLQs are critical for recovery and root-cause analysis.
    difficulty: principal
  - q: Which database security control most directly limits blast radius if application credentials are compromised?
    options:
      - text: Principle of least privilege with role-based access control
        correct: true
      - text: Rotating application credentials on a regular schedule through a secrets manager
        correct: false
      - text: Terminating all active connections immediately when suspicious query patterns are detected
        correct: false
      - text: Using connection pooling with a single shared credential to centralize access management
        correct: false
    explanation: Least privilege and RBAC restrict what stolen credentials can do, limiting damage at the moment of compromise. Rotation reduces exposure window over time but does not limit what compromised credentials can access right now. Anomaly detection and connection pooling are useful but do not directly constrain the scope of a credential breach.
    difficulty: mid
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
    explanation: "Production database security needs layered controls: identity, encryption, auditing, maintenance, and review. Replica-only logging misses writes on the primary. Network controls are one layer, not a complete security posture. Schema change workflows address change management, not security auditing. Continuous enforcement and inspection are what make auditing meaningful."
    difficulty: principal
---

# Backend Questions

Conceptual backend questions covering schema design, REST API scalability, distributed consistency, SQL performance, async workflows, microservice transactions, versioning, observability, retries, and database security.
