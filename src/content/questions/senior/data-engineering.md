---
defaultDomains:
- data-infra
defaultTopics:
- data-engineering
questions:
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
  explanation: Lineage improves impact analysis, debugging, governance, and trust. It does not trigger reruns, replace documentation,
    or perform quality validation on its own. It makes incidents much faster to scope. In data platforms, unknown downstream
    impact is expensive.
  difficulty: senior
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
  explanation: Audit trails give teams evidence of what happened, when, and by which process. Storing the last processed watermark
    is a checkpointing technique, not an audit trail. Cross-environment consistency is a testing concern. Storing raw alongside
    transformed output is a data lake pattern, not auditing. In regulated or business-critical pipelines, missing auditability
    becomes major risk.
  difficulty: senior
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
  explanation: Schema registries plus formats like Avro or Parquet support backward and forward compatibility patterns. Breaking-change
    reviews are useful governance but do not on their own protect running consumers. Fixed-window deprecation and independent
    versioning address lifecycle, not runtime safety. Schemaless JSON shifts the failure from ingestion to silent data corruption
    downstream. In evolving data ecosystems, rigid break-on-change behavior becomes operational bottleneck.
  difficulty: senior
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
  explanation: Real-time pipelines balance throughput and latency with parallelism, efficient messaging systems, resource
    tuning, and careful batching. Single-topic serialization and per-event synchronous enrichment create bottlenecks. Longer
    acknowledgment timeouts reduce redelivery but increase end-to-end latency and mask slow consumers. Batch-size tuning is
    workload-specific, not universally minimal.
  difficulty: senior
---
