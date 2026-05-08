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
  explanation: Normalization reduces redundancy and update anomalies by separating data into well-structured relations. Denormalization,
    materialized views, and surrogate keys address performance or modeling concerns but do not reduce redundancy. In production,
    teams balance normalization with pragmatic denormalization only when performance demands it.
  difficulty: junior
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
  explanation: Pagination and filtering limit how many records travel per request. Compression reduces size of a given payload
    but does not limit record count. HTTP/2 multiplexing improves connection efficiency. Sparse fieldsets reduce column width
    but not result set size. In heavy-traffic systems, limiting result volume is one of simplest wins.
  difficulty: junior
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
  explanation: Indexing a frequently filtered high-selectivity column directly enables fast lookups. Partitioning on that
    column helps range pruning but adds management overhead and is not always the right fit. A covering index on all columns
    is expensive to maintain. Clustering helps sequential scans but not individual row lookups. Targeted indexes are often
    first tuning step.
  difficulty: junior
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
  explanation: Versioning exists to support change while protecting current integrations. Semantic versioning signals intent
    but does not by itself protect running clients. Aggressive deprecation and forcing version lock both undermine the purpose
    of versioning. In enterprise systems, backward compatibility is usually a business requirement, not a preference.
  difficulty: junior
---
