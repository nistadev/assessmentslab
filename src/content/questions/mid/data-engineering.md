---
defaultDomains:
- data-infra
defaultTopics:
- data-engineering
questions:
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
  explanation: ETL jobs are often retried after partial failure, backfill, or scheduler issues. Idempotent behavior keeps
    reruns safe regardless of implementation approach. Checksum skipping and once-only reads are specific implementation tactics,
    not what idempotency means. Without it, duplicates and inconsistent aggregates become common operational problems.
  difficulty: mid
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
  explanation: Analytical systems often denormalize selectively to reduce expensive joins and simplify reporting. Source data
    shape is an implementation convenience, not a justification for a modeling decision. Row count and write concurrency are
    not valid triggers for denormalization. Good denormalization is intentional and workload-driven, not an excuse for weak
    data design.
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
  explanation: 'Reliable pipeline systems behave like software systems: tested, versioned, reusable, observable, and orchestrated.
    Never-retry policies make recovery slower, not faster. Unrestricted production access increases incident risk. One DAG
    per environment trades flexibility for false simplicity. In production, lineage and standardized modules reduce debugging
    time significantly.'
  difficulty: mid
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
  explanation: A useful data lake needs governance, metadata, discoverability, and cost management, not only cheap storage.
    Timestamp partitioning and indefinite retention are specific design choices, not the primary concern. Format standardization
    matters but is secondary to governance and access controls. Without those controls, lakes often become unusable swamps.
  difficulty: mid
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
  explanation: Decoupled storage and compute let teams pay for processing only when needed while keeping data durably stored.
    Replication across regions adds storage cost and complexity. Compression and clustering improve query efficiency but are
    optimizations within a compute instance, not an architectural separation. Scheduled scaling is a tactical saving, not
    a structural pattern. Cost-effective architecture aligns resource type with workload.
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
  explanation: Partitioning and clustering improve pruning and locality, which reduces scanned data and query cost. Write
    distribution is about ingestion sharding, not analytical partitioning. Clustering influences physical layout and can act
    like an index but does not fully replace indexes. Compression is a separate concern. In cloud warehouses, they often have
    direct billing impact.
  difficulty: mid
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
  explanation: 'Data platforms need layered security: encryption, identity, authorization, logging, and network controls.
    VPC isolation is one layer — it does not protect against insider threats or misconfigured services within the same network.
    Broad editor roles violate least privilege. Key rotation and periodic log review are good hygiene but insufficient without
    proper access scoping.'
  difficulty: mid
---
