---
defaultDomains:
- backend
defaultTopics:
- backend
questions:
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
  explanation: Foreign keys and constraints prevent invalid relationships and bad writes at database level. They do not replace
    indexing, application validation, or transaction isolation. In multi-service systems, database-enforced integrity is often
    last line of defense against application bugs.
  difficulty: mid
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
  explanation: Caching cuts repeated computation and database load, improving throughput and response time. Serving stale
    data as a fallback is a secondary pattern. Reducing connection pressure is a side effect, not the primary goal. In production,
    cache strategy must account for invalidation and staleness tradeoffs.
  difficulty: mid
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
  explanation: Selecting only needed columns reduces row width, memory usage, network transfer, and can enable index-only
    plan opportunities. `SELECT *` does not inherently prevent index use or plan reuse, though it can block covering-index
    scans. In production, explicit column selection protects performance and API stability.
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
  explanation: Message queues let user-facing endpoints stay fast while workers process expensive tasks separately. They do
    not provide atomicity across services, and delivery semantics vary by system and configuration. Blocking producers defeats
    the async benefit. In scalable systems, this decoupling is core to resilience.
  difficulty: mid
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
  explanation: Trace or correlation IDs connect logs, spans, and metrics for same request path across services. Centralized
    logs and structured logging help but do not stitch requests together across service boundaries on their own. Timestamp-based
    correlation is unreliable due to clock skew. In microservice systems, propagated IDs are foundational for debugging latency
    and failures.
  difficulty: mid
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
  explanation: Least privilege and RBAC restrict what stolen credentials can do, limiting damage at the moment of compromise.
    Rotation reduces exposure window over time but does not limit what compromised credentials can access right now. Anomaly
    detection and connection pooling are useful but do not directly constrain the scope of a credential breach.
  difficulty: mid
---
