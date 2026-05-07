---
defaultDomains:
  - data-infra
defaultTopics:
  - data-engineering
questions:
  - q: Which design choice most directly improves scalability and fault tolerance in ETL pipelines?
    options:
      - text: Use modular pipeline stages with strong error handling, logging, and idempotent operations
        correct: true
      - text: Combine all transformations into one long script to reduce orchestration overhead
        correct: false
      - text: Store compute and storage on same tightly coupled machine whenever possible
        correct: false
      - text: Disable retries so failures surface immediately and consistently
        correct: false
    explanation: Modular stages, idempotency, and strong observability make ETL easier to scale, retry, and recover. Monolithic scripts and tightly coupled infrastructure create brittle failure modes. In production data systems, recoverability matters as much as raw throughput.
    difficulty: junior
  - q: Why is idempotency especially important in ETL workflows?
    options:
      - text: Rerunning a failed or delayed job should not duplicate or corrupt data
        correct: true
      - text: It guarantees lower cloud cost for every pipeline
        correct: false
      - text: It removes need for monitoring and alerts
        correct: false
      - text: It makes schema evolution unnecessary
        correct: false
    explanation: ETL jobs are often retried after partial failure, backfill, or scheduler issues. Idempotent behavior keeps reruns safe. Without it, duplicates and inconsistent aggregates become common operational problems.
    difficulty: mid
  - q: Which schema pattern is commonly preferred for analytical workloads in cloud warehouses?
    options:
      - text: Star or snowflake schema
        correct: true
      - text: Highly normalized OLTP schema with many small transactional joins
        correct: false
      - text: Single table for all entities regardless of access pattern
        correct: false
      - text: Key-value store layout embedded into one text column
        correct: false
    explanation: Star and snowflake schemas are designed for analytics, balancing simplicity, query speed, and dimensional modeling. OLTP-style normalization often increases join cost for reporting queries. Warehouses optimize for read-heavy aggregate workloads, not transaction processing.
    difficulty: junior
  - q: When is denormalization usually appropriate in analytical data models?
    options:
      - text: When reducing joins improves query performance and workload simplicity
        correct: true
      - text: Whenever storage is unlimited so schema quality no longer matters
        correct: false
      - text: Only when data must be written in real time by end users
        correct: false
      - text: To avoid defining keys and dimensions
        correct: false
    explanation: Analytical systems often denormalize selectively to reduce expensive joins and simplify reporting. That tradeoff is different from OLTP modeling. Good denormalization is intentional, not excuse for weak data design.
    difficulty: mid
  - q: Which practices most improve reliability and maintainability of large data pipelines?
    options:
      - text: Automated tests, version control, reusable modules, lineage tracking, and orchestration
        correct: true
      - text: Manual job restarts and tribal knowledge among senior engineers
        correct: false
      - text: Keeping every DAG or workflow unique to its data source
        correct: false
      - text: Skipping validation so pipelines fail only on hard runtime errors
        correct: false
    explanation: "Reliable pipeline systems behave like software systems: tested, versioned, reusable, observable, and orchestrated. Manual operations and one-off jobs do not scale. In production, lineage and standardized modules reduce debugging time significantly."
    difficulty: mid
  - q: What is main value of monitoring data lineage in a large-scale pipeline ecosystem?
    options:
      - text: It helps trace where data came from, how it changed, and what downstream assets are affected
        correct: true
      - text: It automatically fixes broken upstream jobs
        correct: false
      - text: It replaces need for schema documentation
        correct: false
      - text: It guarantees data quality without validation rules
        correct: false
    explanation: Lineage improves impact analysis, debugging, governance, and trust. It does not replace monitoring or validation, but it makes incidents much faster to scope. In data platforms, unknown downstream impact is expensive.
    difficulty: senior
  - q: Which concern is most important when building a cloud data lake?
    options:
      - text: Governance, discoverability, cost control, and lifecycle policies
        correct: true
      - text: Using raw object storage without metadata because flexibility is highest
        correct: false
      - text: Avoiding all schema decisions forever
        correct: false
      - text: Keeping every dataset in hottest storage tier permanently
        correct: false
    explanation: A useful data lake needs governance, metadata, discoverability, and cost management, not only cheap storage. Without those controls, lakes often become unusable swamps. Lifecycle strategy matters because data volume grows quickly.
    difficulty: mid
  - q: Which data quality checks are most foundational in ETL workflows?
    options:
      - text: Null checks, duplicate detection, referential integrity, and schema validation
        correct: true
      - text: Row count only, because values can be validated later by analysts
        correct: false
      - text: UI snapshot tests for every transformed dataset
        correct: false
      - text: Skipping ingestion checks to maximize throughput
        correct: false
    explanation: "Basic data quality controls catch many critical failures early: missing required values, duplicates, broken relationships, and schema drift. Row counts alone are too weak. In production ETL, trust starts at ingestion."
    difficulty: junior
  - q: Why is an audit trail valuable in data transformation workflows?
    options:
      - text: It records how data changed over time, supporting debugging, compliance, and reconciliation
        correct: true
      - text: It eliminates need for source-of-truth systems
        correct: false
      - text: It guarantees every transformation is semantically correct
        correct: false
      - text: It reduces storage cost by removing metadata
        correct: false
    explanation: Audit trails give teams evidence of what happened, when, and by which process. That matters for incident response, compliance, and backfills. In regulated or business-critical pipelines, missing auditability becomes major risk.
    difficulty: senior
  - q: Which architectural pattern most directly improves cost efficiency in modern cloud data warehousing?
    options:
      - text: Separate storage from compute so each can scale independently
        correct: true
      - text: Pin every workload to always-on dedicated clusters
        correct: false
      - text: Avoid partitioning because it makes query planning harder
        correct: false
      - text: Keep archived data in same expensive hot tier as daily dashboards
        correct: false
    explanation: Decoupled storage and compute let teams pay for processing only when needed while keeping data durably stored. This is core advantage of modern warehouses like BigQuery and Synapse patterns. Cost-effective architecture aligns resource type with workload.
    difficulty: mid
  - q: How do partitioning and clustering help analytical systems?
    options:
      - text: They reduce amount of data scanned for queries and improve performance-cost efficiency
        correct: true
      - text: They guarantee all queries become constant time
        correct: false
      - text: They replace need for schema design
        correct: false
      - text: They are useful only for streaming systems
        correct: false
    explanation: Partitioning and clustering improve pruning and locality, which reduces scanned data and query cost. They are workload-aware physical optimizations, not universal performance magic. In cloud warehouses, they often have direct billing impact.
    difficulty: mid
  - q: What is best practice for handling schema evolution across batch and streaming pipelines?
    options:
      - text: Use schema registries and compatible formats, and design consumers to tolerate additive changes safely
        correct: true
      - text: Fail every pipeline on any new optional field, even if compatible
        correct: false
      - text: Avoid schemas entirely and trust downstream parsing logic
        correct: false
      - text: Use CSV everywhere because it has no schema enforcement
        correct: false
    explanation: Schema registries plus formats like Avro or Parquet support backward and forward compatibility patterns. Good consumers handle missing or extra fields gracefully when contract allows it. In evolving data ecosystems, rigid break-on-change behavior becomes operational bottleneck.
    difficulty: senior
  - q: Which security control is most important for cloud-based data engineering platforms?
    options:
      - text: Encrypt data at rest and in transit, then enforce fine-grained role-based access
        correct: true
      - text: Rely on private networking alone and skip access controls
        correct: false
      - text: Use one shared admin account for all jobs and analysts
        correct: false
      - text: Disable access logging to reduce storage and noise
        correct: false
    explanation: "Data platforms need layered security: encryption, identity, authorization, logging, and network controls. Private networking alone is not enough. In production, shared privileged accounts and weak auditability are major compliance failures."
    difficulty: mid
  - q: What helps achieve high throughput and low latency in real-time data pipelines?
    options:
      - text: Parallel ingestion and processing, distributed messaging, tuned batching, and minimal unnecessary transforms
        correct: true
      - text: Force every event through single-threaded synchronous enrichment path
        correct: false
      - text: Increase transformation count so data becomes more standardized before delivery
        correct: false
      - text: Use smallest possible batch size in all situations
        correct: false
    explanation: Real-time pipelines balance throughput and latency with parallelism, efficient messaging systems, resource tuning, and careful batching. Single-threaded or over-transformed paths create bottlenecks. Batch-size tuning is workload-specific, not universally minimal.
    difficulty: senior
  - q: Why do managed services such as AWS Glue, Azure Data Factory, or Google Dataflow reduce operational overhead?
    options:
      - text: They handle scaling, connectors, scheduling, and job management so teams operate less infrastructure directly
        correct: true
      - text: They remove all need for monitoring and cost controls
        correct: false
      - text: They make vendor lock-in impossible
        correct: false
      - text: They guarantee lower cost than self-managed systems in every case
        correct: false
    explanation: Managed services reduce undifferentiated operations work by providing built-in orchestration, scaling, and integrations. They still require observability, governance, and cost management. Their value is lower platform burden, not automatic perfection.
    difficulty: junior
  - q: What is strongest reason to version-control pipeline code and configuration?
    options:
      - text: Changes become reviewable, reproducible, and safer to roll back
        correct: true
      - text: It prevents all runtime data quality issues
        correct: false
      - text: It removes need for orchestration tools
        correct: false
      - text: It lets teams skip documentation entirely
        correct: false
    explanation: Version control gives history, peer review, rollback, and promotion discipline for pipelines just like application code. It does not remove runtime concerns, but it sharply improves maintainability. In large data teams, unversioned jobs become unmanageable fast.
    difficulty: junior
---

# Data Engineering Questions

Conceptual data engineering questions covering ETL reliability, warehouse modeling, data lakes, data quality, schema evolution, security, real-time pipelines, and managed cloud services.
