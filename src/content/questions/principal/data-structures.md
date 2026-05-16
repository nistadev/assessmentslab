---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
questions:
- q: Which data structure is implemented?
  code: "class ComponentTracker {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n  }\n  getRoot(x)\
    \ {\n    if (this.parent[x] !== x) this.parent[x] = this.getRoot(this.parent[x]);\n    return this.parent[x];\n  }\n \
    \ connect(a, b) {\n    this.parent[this.getRoot(a)] = this.getRoot(b);\n  }\n}"
  options:
  - text: Union-find / disjoint set
    correct: true
  - text: Bloom filter
    correct: false
  - text: Min heap
    correct: false
  - text: Adjacency list
    correct: false
  explanation: '`getRoot` returns the representative parent and compresses paths. `connect` merges two sets by representative.
    That is disjoint set union.'
  difficulty: principal
- q: Which data structure behavior is implemented?
  code: "class BoundedCache {\n  constructor(limit) {\n    this.limit = limit;\n    this.map = new Map();\n  }\n  get(key)\
    \ {\n    if (!this.map.has(key)) return -1;\n    const value = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key,\
    \ value);\n    return value;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key,\
    \ value);\n    if (this.map.size > this.limit) {\n      this.map.delete(this.map.keys().next().value);\n    }\n  }\n}"
  options:
  - text: LRU cache
    correct: true
  - text: MRU cache (most-recently-used eviction)
    correct: false
  - text: Bounded FIFO queue
    correct: false
  - text: Min heap with key-value pairs
    correct: false
  explanation: The map preserves insertion order. Accessed keys are deleted and reinserted as most recent, and the oldest
    key is evicted when capacity is exceeded.
  difficulty: principal
- q: Which probabilistic data structure is implemented?
  code: "class PresenceFilter {\n  markers = new Set();\n  digest(value) {\n    return [value.length % 10, value.charCodeAt(0)\
    \ % 10];\n  }\n  add(value) {\n    for (const h of this.digest(value)) this.markers.add(h);\n  }\n  mightContain(value)\
    \ {\n    return this.digest(value).every(h => this.markers.has(h));\n  }\n}"
  options:
  - text: Bloom filter
    correct: true
  - text: Count-min sketch
    correct: false
  - text: Cuckoo filter
    correct: false
  - text: LRU cache
    correct: false
  explanation: Multiple hashes mark positions on insert, and lookup checks whether all hash positions are present. That can
    produce false positives, which is the key Bloom filter tradeoff.
  difficulty: principal
- q: An API returns a list of user records. Every consuming team independently writes code to find a user by ID. What structural
    change to the API response eliminates this duplicated work?
  options:
  - text: Return a map keyed by user ID so consumers get O(1) lookup without building their own index
    correct: true
  - text: Sort the list by user ID so consumers can binary-search it
    correct: false
  - text: Add a separate endpoint that accepts an ID and returns a single user
    correct: false
  - text: Include a version field so consumers know when to rebuild their local index
    correct: false
  explanation: The access pattern is key-based lookup. A map encodes that pattern in the schema itself and gives every consumer
    O(1) access without duplicating index-building logic. Sorting enables binary search but still forces consumers to write
    search code. A separate endpoint adds an extra network call. A version field helps caching but does not remove the indexing
    burden.
  difficulty: principal
- q: A platform team is about to publish a shared event schema that contains a list of permission strings. Six months later
    they need to change it to a map of permission to expiry timestamp. Which statement best describes the risk?
  options:
  - text: It is a breaking change; all existing consumers must be updated simultaneously or the schema needs a new version
    correct: true
  - text: It is backward-compatible because consumers can still iterate the map values
    correct: false
  - text: It only affects consumers that read permissions — write-only consumers are unaffected
    correct: false
  - text: The change is safe as long as the new map values default to null
    correct: false
  explanation: Changing a list to a map changes the wire shape. Consumers that deserialize into a typed list will fail. Consumers
    reading a raw list will receive an object instead of an array. This is a breaking change regardless of how consumers
    use the data. The safe path is schema versioning with a migration window.
  difficulty: principal
- q: "Which schema evolution rule is always backward-compatible when adding to an existing JSON collection schema?"
  options:
  - text: Adding a new optional field to each object in the collection
    correct: true
  - text: Renaming an existing key
    correct: false
  - text: Changing the type of an existing field from string to integer
    correct: false
  - text: Removing a field that some consumers still read
    correct: false
  explanation: Adding optional fields does not break consumers that ignore unknown fields, which is standard practice for
    forward-compatible parsers. Renaming, type changes, and removals all break consumers that rely on the original shape.
  difficulty: principal
- q: A service stores 100 million user records as a list of dicts, each with 10 fields. A nightly job reads only the 'age'
    field for all records. What architectural change would most reduce memory and CPU cost for this job?
  options:
  - text: Switch to columnar storage where each field is a separate array, so the job reads only the age column
    correct: true
  - text: Add an index on the age field inside each dict
    correct: false
  - text: Cache the list in Redis so the job does not reload it each night
    correct: false
  - text: Compress each dict with msgpack before storing it
    correct: false
  explanation: Row-oriented storage (list of dicts) forces the job to load all 10 fields per record even when it only needs
    one. Columnar storage puts all age values in a contiguous array, reducing data read by ~10x and improving cache efficiency.
    Indexes, caching, and compression do not change the fundamental I/O pattern.
  difficulty: principal
- q: "A platform team wants to standardize how services implement in-process job queues. What is the primary goal of publishing\
    \ a shared implementation and decision record?"
  options:
  - text: Reduce coordination cost by giving all teams a tested, observable default so they stop independently rebuilding
      equivalent structures
    correct: true
  - text: Enforce that all teams use exactly the same queue class to simplify code review
    correct: false
  - text: Eliminate the need for teams to write unit tests for queue behavior
    correct: false
  - text: Prevent teams from using language-built-in queue types that may have bugs
    correct: false
  explanation: Without a standard, teams independently implement similar structures with subtle behavioral differences that
    make cross-team debugging expensive. A shared default with a decision record lowers this coordination tax. It is not
    about enforcing uniformity, eliminating tests, or distrust of built-ins.
  difficulty: principal
- q: "A decision record for a standard in-process queue must state which of the following to be useful to future teams?"
  options:
  - text: What it is, what invariants it protects, what it does NOT solve, and when to escalate to a different solution
    correct: true
  - text: The names of the engineers who reviewed the decision and their seniority levels
    correct: false
  - text: Benchmark results comparing it to every alternative implementation
    correct: false
  - text: A list of all services currently using it
    correct: false
  explanation: The decision record must help future teams apply the tradeoff independently. The four elements — what, invariants,
    non-goals, and escalation path — give teams the context to judge edge cases. Reviewer names, benchmarks, and usage lists
    do not help with decision-making.
  difficulty: principal
- q: A workflow orchestrator's DAG accepts edges submitted by multiple teams. A new edge from team B introduces a cycle that
    breaks deployments for teams A and C. Which two controls would have prevented this incident?
  options:
  - text: Cycle detection on every edge mutation plus structured event emission with the offending edge identified
    correct: true
  - text: Rate limiting on edge submissions and a deployment freeze during business hours
    correct: false
  - text: Requiring teams to submit edges via pull request so humans can review for cycles
    correct: false
  - text: Storing edges in a sorted map so cycles are easier to detect visually
    correct: false
  explanation: Automated cycle detection catches the violation at write time before it propagates. Structured events make
    the offending edge immediately visible to on-call without log scraping. Rate limiting and freezes do not prevent cycles.
    Manual PR review is too slow and error-prone for graph topology. Sorted maps have no cycle-detection capability.
  difficulty: principal
- q: "A shared graph schema is published without a version field. Six months later the platform team needs to add a new edge\
    \ attribute. What problem does the missing version field cause?"
  options:
  - text: Consumers cannot detect whether they are reading the old or new schema, leading to silent misparse or ignored fields
    correct: true
  - text: The new attribute cannot be added to the schema at all without a version field
    correct: false
  - text: The graph becomes read-only until all consumers are updated
    correct: false
  - text: The platform team must delete and republish all existing edges
    correct: false
  explanation: Without a version field, a consumer receiving the updated schema has no signal that the shape changed. It may
    silently ignore the new attribute or fail to parse if the attribute is required. A version field lets the consumer detect
    the change and either handle it or fail loudly with a clear error.
  difficulty: principal
- q: "Teams across an organization are each maintaining their own graph traversal utility with slightly different cycle-detection\
    \ logic. As a principal engineer, what is the right intervention?"
  options:
  - text: Extract a versioned platform library with one canonical traversal and cycle-detection implementation, document the
      invariants, and assign an owner team
    correct: true
  - text: Write a cross-team RFC requiring all teams to use depth-first search only
    correct: false
  - text: Audit each team's implementation and leave the best-written one in place
    correct: false
  - text: Add integration tests to each team's service to verify cycle detection independently
    correct: false
  explanation: Divergent implementations accumulate behavioral differences that surface as bugs when teams interact. A canonical
    platform library with a named owner centralizes the invariant, reduces duplication, and creates a single place for improvements.
    An RFC enforces algorithm choice without eliminating duplication. Auditing picks a winner but leaves N implementations.
    Per-service tests verify local behavior but do not prevent divergence.
  difficulty: principal
- q: "A platform API returns a list of items that consumers must sort before using. The sort order is always the same. What\
    \ does this imply about the schema design?"
  options:
  - text: The schema should return items pre-sorted or use a structure that encodes the order, eliminating duplicated sort
      logic in every consumer
    correct: true
  - text: Consumers should cache their sorted copy so the sort runs only once
    correct: false
  - text: The platform should expose a sort parameter so consumers can request different orderings
    correct: false
  - text: Documentation should specify the expected sort order so consumers implement it consistently
    correct: false
  explanation: When all consumers apply the same sort, the platform is making them duplicate work. Returning pre-sorted data
    or using an ordered structure encodes the access pattern in the contract. Caching moves the duplication to each consumer.
    A sort parameter adds flexibility that no one needs. Documentation is not enforced and diverges over time.
  difficulty: principal
- q: "A high-cardinality in-memory map holds 200 million string keys. Memory usage is far higher than expected. Which analysis\
    \ should happen first?"
  options:
  - text: Measure per-entry overhead including Python object headers, dict metadata, and string interning behavior
    correct: true
  - text: Profile CPU time to find which operations are slowest
    correct: false
  - text: Add a TTL to each entry so the map stays smaller over time
    correct: false
  - text: Switch from a hash map to a sorted map to reduce memory fragmentation
    correct: false
  explanation: Memory surprise at high cardinality is almost always a per-entry overhead problem, not a CPU or TTL problem.
    Python dicts carry significant per-key metadata. String objects add header overhead. Understanding actual per-entry bytes
    determines whether the fix is interning, a different structure, or a compact encoding. A sorted map typically uses more
    memory per entry, not less.
  difficulty: principal
- q: "A platform's row-oriented event store holds billions of records. An analytics team queries a single field across all\
    \ records daily. The query is slow and memory-intensive. Without changing infrastructure, what data layout change helps\
    \ most?"
  options:
  - text: Store fields as separate columnar arrays so the query reads only the target field's contiguous memory
    correct: true
  - text: Add a composite index on all fields to speed up full-record scans
    correct: false
  - text: Partition records into smaller dicts to reduce individual dict size
    correct: false
  - text: Move records to a sorted list so binary search can skip irrelevant entries
    correct: false
  explanation: Row-oriented layout loads all fields per record even when one field is queried. Columnar layout puts each field
    in a contiguous array. A single-field query reads only that array, reducing data volume by a factor equal to the number
    of fields and improving cache efficiency. Indexes, partitioning, and sorting do not change the fundamental read pattern.
  difficulty: principal
- q: "An organization's three platform teams each define their own 'standard' in-memory queue, each with slightly different\
    \ thread-safety guarantees. A new service team is unsure which to use. What principal-level problem does this reflect?"
  options:
  - text: Lack of organizational defaults — no canonical choice with documented invariants and a clear owner
    correct: true
  - text: The new team lacks seniority to evaluate the three options independently
    correct: false
  - text: Thread-safety is inherently team-specific and cannot be standardized
    correct: false
  - text: The three teams should each deprecate their implementation and use the language built-in directly
    correct: false
  explanation: When multiple teams publish competing defaults without clear ownership, consuming teams face unnecessary decision
    cost and risk choosing incorrectly. The principal engineer's role is to reduce this coordination tax by establishing
    one canonical implementation with documented invariants, a named owner, and a clear escalation path.
  difficulty: principal
- q: "A shared data structure is used by 12 teams across an organization. The platform team wants to change an internal field\
    \ from a list to a map for performance reasons. What governance process is required?"
  options:
  - text: Version the schema, communicate the change with a migration window, and support both versions during transition
    correct: true
  - text: Update the implementation and notify teams via a company-wide email
    correct: false
  - text: Release the change as a patch version since it is an internal improvement
    correct: false
  - text: Change the field only in services the platform team owns directly
    correct: false
  explanation: At 12 consumers, a structural change to a shared type is a breaking change regardless of intent. Schema versioning
    with a migration window gives consumers time to adapt without forced synchronization. Email notification alone does not
    coordinate the migration. Internal improvements are not patches when they change observable behavior. Partial rollout
    creates version skew between consumers.
  difficulty: principal
- q: "When a graph or tree structure is promoted to a first-class platform primitive (for example, a workflow DAG), which\
    \ four concerns must the owning team address?"
  options:
  - text: Schema versioning, cycle-detection invariants, structured observability on mutations, and an incident owner
    correct: true
  - text: Algorithm efficiency, code coverage, deployment frequency, and backwards compatibility
    correct: false
  - text: Memory layout, CPU profiling, language choice, and test strategy
    correct: false
  - text: Access control, rate limiting, geographic distribution, and data retention
    correct: false
  explanation: First-class graph primitives fail in domain-specific ways (cycles, orphaned nodes, stale edges) that lists and
    maps do not. Schema versioning handles evolution. Cycle-detection invariants prevent topology bugs. Structured mutation
    events make failures traceable. An incident owner means someone is accountable when the graph breaks downstream teams.
  difficulty: principal
- q: "A platform team ships a new graph library. Three months later a consuming team files an incident: their pipeline is\
    \ broken because an edge they did not create appeared in the graph. Which observability gap caused the difficulty in\
    \ diagnosing this?"
  options:
  - text: Edge mutations were not emitted as structured events, so there is no audit trail of who added the edge and when
    correct: true
  - text: The graph library did not include unit tests for edge insertion
    correct: false
  - text: The consuming team did not validate the graph on startup
    correct: false
  - text: The platform team did not document the graph data model
    correct: false
  explanation: Without structured events on every mutation (edge added, node removed, cycle detected), tracing the origin
    of unexpected state requires log archaeology across all writers. Structured events with a timestamp and caller identity
    turn a multi-hour investigation into a single query. Unit tests, startup validation, and documentation do not create
    an audit trail.
  difficulty: principal
- q: "A platform team must choose between returning a list and a map in a shared search API used by 20 services. The access\
    \ pattern is unknown — some consumers iterate, others look up by ID. Which decision process is correct?"
  options:
  - text: Survey consumers to identify the dominant access pattern, then pick the structure that matches it and document the
      rationale in an ADR
    correct: true
  - text: Return both formats and let consumers pick which field to use
    correct: false
  - text: Default to a list because it is more general-purpose
    correct: false
  - text: Return a list now and plan to add a map field later when consumers ask for it
    correct: false
  explanation: At platform scale, structure choice is a long-lived contract. Surveying consumers identifies the real access
    pattern before committing to a shape. An ADR records the rationale so future teams understand why the choice was made.
    Returning both formats doubles the schema surface and maintenance cost. A list is not more general — it forces consumers
    with key-based access to build their own index. Deferring a map field means breaking changes later.
  difficulty: principal
---
