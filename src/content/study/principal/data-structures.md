---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
lessons:
- title: Data structure decisions at platform boundaries become versioned contracts
  explanation: |
    When a data structure crosses a team boundary — in an API response, an event schema, or a shared library — it becomes a versioned contract. Changing from a list to a map, adding required fields, or reordering elements can break downstream consumers silently or loudly depending on serialization format.

    The platform team owns the evolution path. Before publishing a schema that contains a list vs. a map decision, ask: what operations must consumers perform cheaply? A list of records forces consumers to build their own indexes. A map keyed by ID offloads that work but removes ordering. The choice is made once and lives in every consumer forever.

    Establish a schema evolution policy before the first consumer ships: additive-only changes are backward-compatible; key renames and type changes require versioning.
  examples:
  - label: List schema that forces all consumers to build indexes
    description: Consumers repeatedly scan the list to find records by ID — duplicated work across teams.
    code: |
      # API returns a list; every consumer writes their own find-by-id
      {
        "users": [
          {"id": "u1", "name": "Ana"},
          {"id": "u2", "name": "Lee"}
        ]
      }

      # Consumer A
      user = next(u for u in data["users"] if u["id"] == target_id)

      # Consumer B does the same
  - label: Map schema that encodes the intended access pattern
    description: The platform makes the index once; consumers get O(1) access without duplication.
    code: |
      # API returns a map; no consumer needs to build an index
      {
        "users_by_id": {
          "u1": {"name": "Ana"},
          "u2": {"name": "Lee"}
        }
      }

      user = data["users_by_id"].get(target_id)
  difficulty: principal
- title: Memory layout choices determine cluster cost at scale
  explanation: |
    A data structure decision that is invisible at 1,000 records dominates cost at 100,000,000. The difference between storing records as a list of dicts vs. columnar arrays can be 10–50x in memory and serialization cost.

    At principal level, data structure selection is a capacity planning input. Hash maps with Python dicts carry per-key overhead (~200 bytes per entry). An array of structs vs. a struct of arrays changes cache efficiency and vectorization potential.

    Model memory cost before finalizing shared in-memory representations used by hot paths. Establish a budget, measure it with realistic data, and treat it as an architectural invariant that reviews enforce.
  examples:
  - label: Row-oriented layout — high overhead for analytical queries
    description: Reading one field requires loading all fields for every record.
    code: |
      # List of dicts: reads "age" forces loading name, email, address too
      users = [
          {"name": "Ana", "age": 31, "email": "ana@x.com"},
          {"name": "Lee", "age": 27, "email": "lee@x.com"},
      ]

      ages = [u["age"] for u in users]
  - label: Columnar layout — fast for field-level access
    description: Reading "ages" touches only contiguous age memory.
    code: |
      import array

      names = ["Ana", "Lee"]
      ages  = array.array("i", [31, 27])
      # ages is a contiguous int array; sum(ages) is cache-efficient
  difficulty: principal
- title: Establish organizational defaults to prevent local optimization drift
  explanation: |
    Without explicit guidance, every team independently chooses data structures optimized for their local problem. Over time, the organization accumulates dozens of slightly different queue implementations, custom caches, and ad-hoc graphs. Cross-team debugging becomes slow because there is no shared mental model.

    A principal engineer's job is to identify the two or three structures that cover 80% of cases, document the decision record for each, and create platform libraries that teams can adopt without reimplementing. This is not about enforcing one true way — it is about reducing coordination cost and creating observable, debuggable defaults.

    The decision record must state: what the structure is, what invariants it protects, what it does not solve, and when to escalate to a custom solution.
  examples:
  - label: Decision record fragment for the standard job queue
    description: Documents the default choice and its boundaries so teams can apply it without re-litigating.
    code: |
      # ADR-042: Standard in-process job queue
      #
      # Decision: use collections.deque with a threading.Lock wrapper
      # Invariants: FIFO order, O(1) enqueue/dequeue, thread-safe
      # Does not solve: persistence, cross-process fanout, retry with backoff
      # Escalate to: Redis queue, Celery, or a message broker when those are needed
  - label: Platform library that wraps the default
    description: One implementation, one set of tests, observable via standard instrumentation.
    code: |
      from collections import deque
      import threading

      class JobQueue:
          def __init__(self):
              self._q = deque()
              self._lock = threading.Lock()

          def push(self, job):
              with self._lock:
                  self._q.append(job)

          def pop(self):
              with self._lock:
                  return self._q.popleft() if self._q else None

          def __len__(self):
              with self._lock:
                  return len(self._q)
  difficulty: principal
- title: Graphs and trees require explicit ownership, versioning, and observability
  explanation: |
    When a graph or tree is a first-class platform primitive — a workflow DAG, a service dependency graph, an RBAC permission tree — it needs the same governance as any shared data model: ownership, a schema, versioning, observability, and an incident story.

    Graphs fail in ways that lists and maps do not: cycles break topological sort, disconnected components cause silent skips, stale edges cause phantom dependencies. These failures are hard to observe without instrumentation built into the graph operations themselves.

    Instrument graph mutations (node added, edge added/removed, cycle detected) as structured events. Version the schema so consumers can detect incompatible changes. Assign a team as the invariant owner — the team responsible for cycle detection, edge validation, and compatibility guarantees.
  examples:
  - label: Cycle detection instrumented as an observable event
    description: Log the cycle as a structured event so on-call can trace which team introduced it.
    code: |
      def add_edge(graph, src, dst, event_log):
          graph[src].add(dst)
          if has_cycle(graph):
              event_log.emit({
                  "event": "dependency_cycle_detected",
                  "src": src,
                  "dst": dst,
                  "affected_paths": find_cycle(graph),
              })
              graph[src].remove(dst)
              raise ValueError(f"Adding {src}->{dst} creates a cycle")
  - label: Versioned graph schema for cross-team DAG exchange
    description: Version field lets consumers detect breaking changes without silently misreading new fields.
    code: |
      {
        "schema_version": 2,
        "nodes": [{"id": "step_a"}, {"id": "step_b"}],
        "edges": [{"from": "step_a", "to": "step_b"}]
      }

      # Consumer validates version before processing
      if payload["schema_version"] != SUPPORTED_VERSION:
          raise UnsupportedSchemaVersion(payload["schema_version"])
  difficulty: principal
---
