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
      - text: Centralize all transformation logic in a single service to minimize network hops between stages
        correct: false
      - text: Run all pipeline steps concurrently without checkpointing to maximize parallelism
        correct: false
      - text: Use synchronous sequential execution to ensure consistent ordering between stages
        correct: false
    explanation: Modular stages, idempotency, and strong observability make ETL easier to scale, retry, and recover. Centralizing logic reduces flexibility and creates a single failure point. Unchecked parallelism without checkpointing makes recovery harder. Synchronous sequential execution improves ordering but limits throughput and fault recovery. In production data systems, recoverability matters as much as raw throughput.
    difficulty: junior
  - q: Why is idempotency especially important in ETL workflows?
    options:
      - text: Rerunning a failed or delayed job should not duplicate or corrupt data
        correct: true
      - text: It allows jobs to skip already-processed records by comparing checksums at ingestion time
        correct: false
      - text: It ensures upstream source systems are never read more than once per pipeline run
        correct: false
      - text: It removes the need for deduplication logic in downstream reporting queries
        correct: false
    explanation: ETL jobs are often retried after partial failure, backfill, or scheduler issues. Idempotent behavior keeps reruns safe regardless of implementation approach. Checksum skipping and once-only reads are specific implementation tactics, not what idempotency means. Without it, duplicates and inconsistent aggregates become common operational problems.
    difficulty: mid
  - q: Which schema pattern is commonly preferred for analytical workloads in cloud warehouses?
    options:
      - text: Star or snowflake schema
        correct: true
      - text: Third normal form with indexed foreign keys optimized for join performance
        correct: false
      - text: Wide flat table with all attributes per entity to minimize join depth
        correct: false
      - text: Entity-attribute-value model for maximum schema flexibility across dimensions
        correct: false
    explanation: Star and snowflake schemas are designed for analytics, balancing simplicity, query speed, and dimensional modeling. Third normal form serves OLTP well but increases join cost for aggregate reporting. Wide flat tables are a form of denormalization, not the structured star/snowflake pattern. EAV is highly flexible but performs poorly for analytical queries. Warehouses optimize for read-heavy aggregate workloads.
    difficulty: junior
  - q: When is denormalization usually appropriate in analytical data models?
    options:
      - text: When reducing joins improves query performance and workload simplicity
        correct: true
      - text: When source data arrives already denormalized and normalizing would add pipeline complexity
        correct: false
      - text: Whenever a table grows beyond a certain row count threshold
        correct: false
      - text: When multiple teams need concurrent write access to the same dimension tables
        correct: false
    explanation: Analytical systems often denormalize selectively to reduce expensive joins and simplify reporting. Source data shape is an implementation convenience, not a justification for a modeling decision. Row count and write concurrency are not valid triggers for denormalization. Good denormalization is intentional and workload-driven, not an excuse for weak data design.
    difficulty: mid
  - q: Which practices most improve reliability and maintainability of large data pipelines?
    options:
      - text: Automated tests, version control, reusable modules, lineage tracking, and orchestration
        correct: true
      - text: Immutable pipeline runs that never retry, so failures surface immediately for manual review
        correct: false
      - text: Dedicated pipeline teams with direct production access and no approval gates
        correct: false
      - text: A single centralized DAG per environment to reduce scheduling conflicts
        correct: false
    explanation: "Reliable pipeline systems behave like software systems: tested, versioned, reusable, observable, and orchestrated. Never-retry policies make recovery slower, not faster. Unrestricted production access increases incident risk. One DAG per environment trades flexibility for false simplicity. In production, lineage and standardized modules reduce debugging time significantly."
    difficulty: mid
  - q: What is main value of monitoring data lineage in a large-scale pipeline ecosystem?
    options:
      - text: It helps trace where data came from, how it changed, and what downstream assets are affected
        correct: true
      - text: It automatically reruns affected downstream pipelines when upstream schemas change
        correct: false
      - text: It replaces the need for pipeline documentation by capturing runtime dependencies
        correct: false
      - text: It generates data quality reports by comparing lineage graph checksums over time
        correct: false
    explanation: Lineage improves impact analysis, debugging, governance, and trust. It does not trigger reruns, replace documentation, or perform quality validation on its own. It makes incidents much faster to scope. In data platforms, unknown downstream impact is expensive.
    difficulty: senior
  - q: Which concern is most important when building a cloud data lake?
    options:
      - text: Governance, discoverability, cost control, and lifecycle policies
        correct: true
      - text: Partitioning all datasets by ingestion timestamp to enable time-travel queries
        correct: false
      - text: Retaining all raw data indefinitely to support future reprocessing needs
        correct: false
      - text: Using a single cloud provider's native format to maximize storage compression
        correct: false
    explanation: A useful data lake needs governance, metadata, discoverability, and cost management, not only cheap storage. Timestamp partitioning and indefinite retention are specific design choices, not the primary concern. Format standardization matters but is secondary to governance and access controls. Without those controls, lakes often become unusable swamps.
    difficulty: mid
  - q: Which data quality checks are most foundational in ETL workflows?
    options:
      - text: Null checks, duplicate detection, referential integrity, and schema validation
        correct: true
      - text: Row count reconciliation between source and destination tables after each load
        correct: false
      - text: Statistical outlier detection on all numeric columns before loading
        correct: false
      - text: Row-level checksum comparison between source and target for every batch
        correct: false
    explanation: "Basic data quality controls catch many critical failures early: missing required values, duplicates, broken relationships, and schema drift. Row count checks are too weak on their own — counts can match even with corrupted values. Outlier detection and checksums are useful but secondary to catching structural problems at ingestion. In production ETL, trust starts at ingestion."
    difficulty: junior
  - q: Why is an audit trail valuable in data transformation workflows?
    options:
      - text: It records how data changed over time, supporting debugging, compliance, and reconciliation
        correct: true
      - text: It enables incremental pipeline runs by storing the last successfully processed record per source
        correct: false
      - text: It validates that transformations are applied consistently across development and production
        correct: false
      - text: It archives raw input alongside transformed output to enable storage-efficient rollback
        correct: false
    explanation: Audit trails give teams evidence of what happened, when, and by which process. Storing the last processed watermark is a checkpointing technique, not an audit trail. Cross-environment consistency is a testing concern. Storing raw alongside transformed output is a data lake pattern, not auditing. In regulated or business-critical pipelines, missing auditability becomes major risk.
    difficulty: senior
  - q: Which architectural pattern most directly improves cost efficiency in modern cloud data warehousing?
    options:
      - text: Separate storage from compute so each can scale independently
        correct: true
      - text: Replicate frequently queried datasets to each compute region to reduce cross-region transfer costs
        correct: false
      - text: Use columnar compression and clustering to reduce scan costs without scaling compute
        correct: false
      - text: Run all analytical workloads during off-peak hours using scheduled warehouse scaling
        correct: false
    explanation: Decoupled storage and compute let teams pay for processing only when needed while keeping data durably stored. Replication across regions adds storage cost and complexity. Compression and clustering improve query efficiency but are optimizations within a compute instance, not an architectural separation. Scheduled scaling is a tactical saving, not a structural pattern. Cost-effective architecture aligns resource type with workload.
    difficulty: mid
  - q: How do partitioning and clustering help analytical systems?
    options:
      - text: They reduce amount of data scanned for queries and improve performance-cost efficiency
        correct: true
      - text: They distribute writes evenly across nodes to prevent hot partitions under ingestion load
        correct: false
      - text: They replace indexes in columnar storage by enforcing a strict physical sort order
        correct: false
      - text: They compress storage by grouping similar values into contiguous blocks on disk
        correct: false
    explanation: Partitioning and clustering improve pruning and locality, which reduces scanned data and query cost. Write distribution is about ingestion sharding, not analytical partitioning. Clustering influences physical layout and can act like an index but does not fully replace indexes. Compression is a separate concern. In cloud warehouses, they often have direct billing impact.
    difficulty: mid
  - q: What is best practice for handling schema evolution across batch and streaming pipelines?
    options:
      - text: Use schema registries and compatible formats, and design consumers to tolerate additive changes safely
        correct: true
      - text: Require all schema changes to pass a breaking-change review with all consuming teams before merging
        correct: false
      - text: Version every topic or table independently and deprecate old versions after a fixed time window
        correct: false
      - text: Use JSON without schema enforcement so pipelines never fail on structural changes
        correct: false
    explanation: Schema registries plus formats like Avro or Parquet support backward and forward compatibility patterns. Breaking-change reviews are useful governance but do not on their own protect running consumers. Fixed-window deprecation and independent versioning address lifecycle, not runtime safety. Schemaless JSON shifts the failure from ingestion to silent data corruption downstream. In evolving data ecosystems, rigid break-on-change behavior becomes operational bottleneck.
    difficulty: senior
  - q: Which security control is most important for cloud-based data engineering platforms?
    options:
      - text: Encrypt data at rest and in transit, then enforce fine-grained role-based access
        correct: true
      - text: Restrict all external access at the network perimeter and rely on VPC isolation for data protection
        correct: false
      - text: Use service accounts with project-wide editor roles to simplify pipeline permission management
        correct: false
      - text: Rotate access keys on a weekly schedule and review access logs on a monthly basis
        correct: false
    explanation: "Data platforms need layered security: encryption, identity, authorization, logging, and network controls. VPC isolation is one layer — it does not protect against insider threats or misconfigured services within the same network. Broad editor roles violate least privilege. Key rotation and periodic log review are good hygiene but insufficient without proper access scoping."
    difficulty: mid
  - q: What helps achieve high throughput and low latency in real-time data pipelines?
    options:
      - text: Parallel ingestion and processing, distributed messaging, tuned batching, and minimal unnecessary transforms
        correct: true
      - text: Serializing all events through a single ordered topic to guarantee processing correctness
        correct: false
      - text: Using synchronous enrichment calls for each event to ensure data completeness before delivery
        correct: false
      - text: Increasing acknowledgment timeout to reduce redelivery overhead under peak load
        correct: false
    explanation: Real-time pipelines balance throughput and latency with parallelism, efficient messaging systems, resource tuning, and careful batching. Single-topic serialization and per-event synchronous enrichment create bottlenecks. Longer acknowledgment timeouts reduce redelivery but increase end-to-end latency and mask slow consumers. Batch-size tuning is workload-specific, not universally minimal.
    difficulty: senior
  - q: Why do managed services such as AWS Glue, Azure Data Factory, or Google Dataflow reduce operational overhead?
    options:
      - text: They handle scaling, connectors, scheduling, and job management so teams operate less infrastructure directly
        correct: true
      - text: They automatically optimize job logic and remove the need for pipeline performance tuning
        correct: false
      - text: They provide vendor-neutral portability so pipelines can move between clouds without changes
        correct: false
      - text: They include built-in data quality validation that replaces custom checks in pipeline code
        correct: false
    explanation: Managed services reduce undifferentiated operations work by providing built-in orchestration, scaling, and integrations. They still require observability, governance, cost management, and performance tuning. Portability is generally limited by provider-specific APIs. Data quality validation remains the pipeline author's responsibility. Their value is lower platform burden, not automatic perfection.
    difficulty: junior
  - q: What is strongest reason to version-control pipeline code and configuration?
    options:
      - text: Changes become reviewable, reproducible, and safer to roll back
        correct: true
      - text: It guarantees consistent execution environments across development and production
        correct: false
      - text: It enables automated dependency updates without manual pipeline review
        correct: false
      - text: It prevents unauthorized schema changes from reaching production datasets
        correct: false
    explanation: Version control gives history, peer review, rollback, and promotion discipline for pipelines just like application code. Consistent execution environments come from containerization or environment parity practices, not version control alone. Automated dependency updates and schema access control are separate concerns. In large data teams, unversioned jobs become unmanageable fast.
    difficulty: junior
---

# Data Engineering Questions

Conceptual data engineering questions covering ETL reliability, warehouse modeling, data lakes, data quality, schema evolution, security, real-time pipelines, and managed cloud services.
