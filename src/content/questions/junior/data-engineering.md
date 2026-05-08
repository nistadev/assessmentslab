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
  explanation: Modular stages, idempotency, and strong observability make ETL easier to scale, retry, and recover. Centralizing
    logic reduces flexibility and creates a single failure point. Unchecked parallelism without checkpointing makes recovery
    harder. Synchronous sequential execution improves ordering but limits throughput and fault recovery. In production data
    systems, recoverability matters as much as raw throughput.
  difficulty: junior
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
  explanation: Star and snowflake schemas are designed for analytics, balancing simplicity, query speed, and dimensional modeling.
    Third normal form serves OLTP well but increases join cost for aggregate reporting. Wide flat tables are a form of denormalization,
    not the structured star/snowflake pattern. EAV is highly flexible but performs poorly for analytical queries. Warehouses
    optimize for read-heavy aggregate workloads.
  difficulty: junior
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
  explanation: 'Basic data quality controls catch many critical failures early: missing required values, duplicates, broken
    relationships, and schema drift. Row count checks are too weak on their own — counts can match even with corrupted values.
    Outlier detection and checksums are useful but secondary to catching structural problems at ingestion. In production ETL,
    trust starts at ingestion.'
  difficulty: junior
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
  explanation: Managed services reduce undifferentiated operations work by providing built-in orchestration, scaling, and
    integrations. They still require observability, governance, cost management, and performance tuning. Portability is generally
    limited by provider-specific APIs. Data quality validation remains the pipeline author's responsibility. Their value is
    lower platform burden, not automatic perfection.
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
  explanation: Version control gives history, peer review, rollback, and promotion discipline for pipelines just like application
    code. Consistent execution environments come from containerization or environment parity practices, not version control
    alone. Automated dependency updates and schema access control are separate concerns. In large data teams, unversioned
    jobs become unmanageable fast.
  difficulty: junior
---
