---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
lessons:
- title: Data structure choice is a contract, not an implementation detail
  explanation: |
    When a function returns a list, callers assume ordering and duplicate membership. When it returns a set, callers assume uniqueness. When it returns a dict, callers assume key-based access. These are contracts.

    Changing the return type later breaks callers silently when type hints are absent, and noisily when they are present. The structure exposed at a boundary encodes assumptions about iteration order, identity, and cardinality that live beyond the function.

    Before choosing a structure at a module or service boundary, ask: what guarantees must survive over time? Expose the narrowest interface that satisfies callers now, so the internal implementation can change without breaking the contract.
  examples:
  - label: Leaky return type
    description: Returning a raw dict leaks internal layout and lets callers mutate state.
    code: |
      def get_config():
          return {"timeout": 30, "retries": 3}  # caller can mutate

      cfg = get_config()
      cfg["timeout"] = 0  # unintended mutation
  - label: Stable contract via dataclass
    description: A dataclass makes the contract explicit and prevents key typos and unintended mutation.
    code: |
      from dataclasses import dataclass

      @dataclass(frozen=True)
      class Config:
          timeout: int
          retries: int

      def get_config() -> Config:
          return Config(timeout=30, retries=3)
  difficulty: senior
- title: Cache locality determines real throughput, not just Big-O
  explanation: |
    Big-O measures operation count. Cache locality measures how many CPU cache misses those operations cause. A linked list has O(1) insert, but each node is a separate heap allocation with no guaranteed proximity to its neighbors. Sequential access causes cache misses on every node.

    An array with O(n) insert beats a linked list for many workloads because the sequential memory layout lets the CPU prefetcher load upcoming elements before they are needed. This gap is typically 5–20x on modern hardware.

    Profile before replacing arrays with pointer-based structures. The theoretical advantage of a linked list or tree rarely survives contact with CPU memory hierarchy in practice.
  examples:
  - label: Linked list traversal — each node is a cache miss
    description: Pointer chasing forces the CPU to wait for each node's memory load.
    code: |
      # Each node.next dereference may fetch from main memory (~100 cycles)
      total = 0
      node = head
      while node:
          total += node.value
          node = node.next
  - label: Array traversal — prefetcher loads ahead
    description: Sequential memory access; the CPU prefetcher stays ahead of the loop.
    code: |
      # Elements sit contiguously; prefetcher loads next cache line before needed
      total = sum(values)  # values is a list or array
  difficulty: senior
- title: Design for the mutation pattern, not the read pattern
  explanation: |
    Most structure choices focus on read performance. The harder question is mutation: who mutates, how often, and with what concurrency?

    A list that is read frequently but mutated rarely by appending is fine as a plain list. A list that many threads append to simultaneously needs a lock or a concurrent queue. A dict that is built once and then only read can be frozen and safely shared. A dict rebuilt on every request is a GC pressure source.

    Map the mutation lifecycle before finalizing the structure. Build-once-read-many, grow-only-at-tail, and arbitrary-concurrent-update require different structures and synchronization guarantees.
  examples:
  - label: Shared mutable list causes data race
    description: Two threads appending without synchronization can corrupt list internals.
    code: |
      import threading

      results = []

      def worker(item):
          results.append(item)  # not thread-safe in all runtimes

      threads = [threading.Thread(target=worker, args=(i,)) for i in range(100)]
  - label: Queue provides safe concurrent producer-consumer
    description: queue.Queue handles locking internally.
    code: |
      import queue, threading

      q = queue.Queue()

      def producer(item):
          q.put(item)

      def consumer():
          item = q.get()
          q.task_done()
  difficulty: senior
- title: Build custom structures only when invariants cannot be enforced externally
  explanation: |
    A custom data structure is justified when the invariant you need to enforce cannot be expressed through composition of standard types without leaking internal state to callers.

    An LRU cache combines a hash map and a doubly linked list because the two must stay synchronized — every map access must update the recency list. No composition of the two independent types can enforce this invariant without wrapping them. This is a valid reason.

    An invalid reason is "I want a nicer API." A dataclass or a thin wrapper function satisfies nicer APIs without the maintenance cost of a full data structure. Before writing a custom structure, name the specific invariant that standard types cannot protect.
  examples:
  - label: LRU cache — invariant requires combined structure
    description: Map and recency list must stay in sync; the invariant cannot survive outside the class.
    code: |
      from collections import OrderedDict

      class LRUCache:
          def __init__(self, capacity):
              self.capacity = capacity
              self.cache = OrderedDict()

          def get(self, key):
              if key not in self.cache:
                  return -1
              self.cache.move_to_end(key)
              return self.cache[key]

          def put(self, key, value):
              self.cache[key] = value
              self.cache.move_to_end(key)
              if len(self.cache) > self.capacity:
                  self.cache.popitem(last=False)
  - label: Thin wrapper is not a data structure
    description: This adds no invariant; a plain dict with a helper function is better.
    code: |
      # No invariant to protect — just delete the class
      class TaggedDict:
          def __init__(self):
              self._data = {}

          def set(self, k, v):
              self._data[k] = v

          def get(self, k):
              return self._data.get(k)
  difficulty: senior
- title: Graphs and trees appear at service boundaries, not in application logic
  explanation: |
    In senior-level work, trees and graphs appear primarily at system boundaries: the DAG of a workflow orchestrator, the B-tree of a database index, the dependency graph of a build system. Application logic rarely needs to manage these structures directly.

    When your service receives a DAG from an orchestrator or emits one, you interact with a serialized form — JSON, a protobuf, or an adjacency list. The ownership of traversal and invariants lives in the platform. Your code adapts inputs and emits outputs.

    Knowing where trees and graphs live helps you debug performance. A slow database query is often a B-tree problem. A slow deployment pipeline is often a dependency graph problem. Reasoning at the right level avoids premature optimization inside application code.
  examples:
  - label: Receiving a DAG from an orchestrator
    description: Application code processes nodes; it does not own the traversal or cycle detection.
    code: |
      def handle_step(step: dict, context: dict) -> dict:
          # Orchestrator guarantees topological order; no graph code needed here
          inputs = {dep: context[dep] for dep in step["depends_on"]}
          result = run_task(step["task"], inputs)
          return result
  - label: Emitting a dependency graph for a build tool
    description: Application code builds an adjacency list; the build tool owns traversal.
    code: |
      def get_build_graph(modules):
          graph = {}
          for mod in modules:
              graph[mod.name] = mod.dependencies
          return graph  # adjacency list; caller traverses
  difficulty: senior
---
