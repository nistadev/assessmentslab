---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
lessons:
- title: Algorithm choice is a product contract
  explanation: |
    At principal level, choosing an algorithm means choosing user-visible behavior, scaling limits, and operational failure modes.

    "Find nearest result" can mean fewest edges, lowest weighted cost, fastest available provider, freshest data, or most relevant ranking. Each definition implies a different algorithm and a different contract. The principal skill is turning vague product language into exact input assumptions, ordering rules, tie-breaking, freshness expectations, and failure behavior.

    Where to apply:
    Use this framing for search, ranking, scheduling, routing, recommendations, access control, deduplication, and dependency resolution. Document what "best," "first," "nearest," "valid," or "available" means before optimizing.

    Do not confuse with:
    A correct implementation of the wrong definition is still a product bug.
  examples:
  - label: Ambiguous nearest
    description: The same request can imply different algorithms.
    code: |
      # Fewest links from current user: BFS
      # Lowest travel cost: Dijkstra
      # Best business score: ranking model
  - label: Tie-break contract
    description: Stable tie-breaking makes repeated runs predictable.
    code: |
      def choose_candidate(candidates):
          return min(
              candidates,
              key=lambda item: (item.distance, item.created_at, item.id),
          )
  - label: Explicit failure behavior
    description: No path can be a normal result, not an exception from deep code.
    code: |
      result = find_route(graph, start, goal)
      if result is None:
          return {"status": "unreachable"}
  difficulty: principal
- title: Backtracking needs disciplined state ownership
  explanation: |
    At principal level, backtracking is a controlled search over choices with shared temporary state.

    The pattern is choose, recurse, unchoose. Mutating one path list and forgetting to undo it leaks state into sibling branches. Copying every intermediate state is safer but can be expensive. Principal-level review balances correctness, memory use, and readability, then tests cases where branches share prefixes.

    Where to apply:
    Use backtracking for all paths, permutations, combinations, constraint solving, tree path sums, route enumeration, and policy search. Keep the mutable state local to the search and copy only when recording a result that must survive later mutations.

    Do not confuse with:
    Backtracking is not the same as plain DFS. Backtracking also manages candidate state while exploring and undoing choices.
  examples:
  - label: Path Sum II shape
    description: Push before recursion, copy on match, pop before returning.
    code: |
      def path_sum(node, target, path, result):
          if node is None:
              return

          path.append(node.value)
          remaining = target - node.value

          if node.left is None and node.right is None and remaining == 0:
              result.append(list(path))

          path_sum(node.left, remaining, path, result)
          path_sum(node.right, remaining, path, result)
          path.pop()
  - label: Combination search
    description: Each branch owns its choice until it is popped.
    code: |
      def choose(values, start, path, result):
          result.append(list(path))
          for index in range(start, len(values)):
              path.append(values[index])
              choose(values, index + 1, path, result)
              path.pop()
  - label: Leak smell
    description: Missing pop makes later branches include stale choices.
    code: |
      path.append(choice)
      search(next_state)
      # missing path.pop()
  difficulty: principal
- title: Graph algorithms need explicit cycle and consistency semantics
  explanation: |
    At principal level, graph work usually fails at the model boundary before it fails in code.

    Some graphs are DAGs, some have cycles, some are weighted, some change while you are reading them, and some have edges with business permissions. Topological sort requires a DAG. Shortest path requires a weight model. Reachability requires a clear edge direction. If those assumptions are undocumented, a correct algorithm can produce invalid business behavior.

    Where to apply:
    Use graph assumptions in build systems, authorization inheritance, dependency maps, recommendations, routing, workflow engines, and organizational hierarchies. Decide how to handle cycles, missing nodes, stale edges, concurrent edits, and partial visibility.

    Do not confuse with:
    A tree algorithm is often wrong for a graph. Graph nodes can have multiple parents and cycles.
  examples:
  - label: Topological sort requires DAG
    description: Remaining nodes after processing means dependency cycle.
    code: |
      order = topo_sort(graph)
      if len(order) != len(graph.nodes):
          raise ValueError("cycle detected")
  - label: Permissioned edges
    description: Reachability may depend on what the current actor can see.
    code: |
      for edge in graph.edges_from(node):
          if permissions.can_read(user, edge):
              visit(edge.to_node)
  - label: Snapshot consistency
    description: Long graph traversals should define which version of edges they read.
    code: |
      snapshot = graph.snapshot()
      result = traverse(snapshot, start)
  difficulty: principal
- title: Scalable algorithms often trade exactness, latency, and memory
  explanation: |
    At principal level, the best algorithm depends on constraints around the system, not only asymptotic complexity.

    Exact counts may require too much memory for a stream. Full sorting may be too slow for a request path. Recomputing from scratch may be correct but too expensive for frequent updates. Systems often choose incremental maintenance, approximate sketches, bounded heaps, sampling, caching, or offline precomputation. Those choices must be visible because they affect correctness and user trust.

    Where to apply:
    Use these tradeoffs for analytics, recommendations, fraud detection, search indexing, quota enforcement, monitoring, and large imports. Define acceptable error, freshness, latency, and memory budgets before choosing approximate or incremental algorithms.

    Do not confuse with:
    Approximate algorithms are not shortcuts around correctness. They need documented error bounds and product acceptance.
  examples:
  - label: Bounded top k
    description: Keep only the best k candidates instead of sorting everything.
    code: |
      import heapq

      def top_k_stream(items, k, score):
          heap = []
          for item in items:
              entry = (score(item), item)
              if len(heap) < k:
                  heapq.heappush(heap, entry)
              else:
                  heapq.heappushpop(heap, entry)
          return [item for _, item in sorted(heap, reverse=True)]
  - label: Incremental aggregate
    description: Update stored state when one event arrives.
    code: |
      counts[event.category] = counts.get(event.category, 0) + 1
  - label: Make approximation explicit
    description: Callers should know when result is an estimate.
    code: |
      return {
          "unique_users_estimate": sketch.estimate(),
          "relative_error": 0.02,
      }
  difficulty: principal
- title: Principal review tests failure modes, not only happy paths
  explanation: |
    At principal level, algorithm quality includes how it fails under bad data, edge cases, and changing constraints.

    Tests should cover empty inputs, duplicate values, invalid graphs, disconnected components, skewed trees, equal scores, unstable ordering, very deep recursion, and large inputs. Observability should expose runtime, input size, output size, retries, and fallback counts. This turns algorithm behavior into something the team can operate.

    Where to apply:
    Use this review lens for shared libraries, core product workflows, data pipelines, and request-path algorithms. Add contract tests around behavior that other teams or stored data depend on.

    Do not confuse with:
    Unit tests for example cases are not enough when the algorithm becomes a platform dependency.
  examples:
  - label: Edge-case matrix
    description: Small examples should target known failure modes.
    code: |
      assert binary_search([], 3) == -1
      assert longest_without_repeat("abba") == 2
      assert has_cycle(single_node_cycle) is True
  - label: Deterministic ordering
    description: Equal scores should still produce stable output.
    code: |
      ranked = sorted(items, key=lambda item: (-item.score, item.id))
  - label: Runtime telemetry
    description: Shared algorithms should emit enough facts to debug scaling issues.
    code: |
      metrics.timing("rank.duration_ms", elapsed_ms)
      metrics.gauge("rank.input_size", len(items))
      metrics.gauge("rank.output_size", len(ranked))
  difficulty: principal
---
