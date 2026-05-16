---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
lessons:
- title: Recursion returns facts from smaller problems
  explanation: |
    At mid level, recursion is not only "a function calls itself." It is a way to ask smaller versions of the same question and combine their answers.

    Tree algorithms often follow this shape. Maximum depth asks each child for its depth, then returns one plus the larger child result. Balance checks ask each child for height and failure state. Path checks subtract the current node value and ask children whether the remaining target can be reached.

    Where to apply:
    Use recursion when the input is naturally nested, such as trees, folders, menus, component hierarchies, and expression nodes. Define the base case first, then define what one node contributes to the answer.

    Do not confuse with:
    Recursion is not automatically simpler. If the input can be huge or deeply nested, consider an explicit stack to avoid call stack limits.
  examples:
  - label: Maximum depth
    description: Each node returns one plus the deeper child.
    code: |
      def max_depth(node):
          if node is None:
              return 0
          return 1 + max(max_depth(node.left), max_depth(node.right))
  - label: Boolean path sum
    description: Each recursive call asks whether the remaining total exists below this node.
    code: |
      def has_path_sum(node, target):
          if node is None:
              return False

          if node.left is None and node.right is None:
              return node.value == target

          remaining = target - node.value
          return (
              has_path_sum(node.left, remaining)
              or has_path_sum(node.right, remaining)
          )
  - label: Explicit stack alternative
    description: Iteration can protect against very deep trees.
    code: |
      def count_nodes(root):
          total = 0
          stack = [root]
          while stack:
              node = stack.pop()
              if node is None:
                  continue
              total += 1
              stack.append(node.left)
              stack.append(node.right)
          return total
  difficulty: mid
- title: Postorder fits dependency-first work
  explanation: |
    At mid level, postorder traversal matters because many real workflows must finish children before parents.

    Deleting a folder requires deleting files and subfolders first. Bundling a module requires bundling imports first. Calculating a directory size requires knowing child sizes first. Postorder gives that dependency-first shape: left subtree, right subtree, then current node.

    Where to apply:
    Use postorder for cleanup, teardown, size aggregation, dependency execution, and validation where parent work depends on child results.

    Do not confuse with:
    Preorder is parent-first. It is good for creating or cloning structures, but risky when the parent owns references needed by children during deletion.
  examples:
  - label: Delete children first
    description: Parent deletion happens after all child nodes are gone.
    code: |
      def delete_tree(node):
          if node is None:
              return
          delete_tree(node.left)
          delete_tree(node.right)
          delete_node(node)
  - label: Aggregate child sizes
    description: Parent total depends on both child totals.
    code: |
      def folder_size(folder):
          total = folder.own_bytes
          for child in folder.children:
              total += folder_size(child)
          return total
  - label: Dependency execution
    description: Imported modules run before the module that imports them.
    code: |
      def build(module, built):
          if module.name in built:
              return
          for dependency in module.dependencies:
              build(dependency, built)
          compile_module(module)
          built.add(module.name)
  difficulty: mid
- title: BFS and DFS answer different graph questions
  explanation: |
    At mid level, graph traversal means choosing a frontier policy.

    Breadth-first search uses a queue. It explores neighbors by distance from the start, which makes it useful for shortest path in an unweighted graph, level grouping, and nearest reachable item. Depth-first search uses recursion or a stack. It explores one path deeply before backtracking, which makes it useful for connected components, cycle detection, exhaustive search, and topological ordering.

    Where to apply:
    Use BFS when distance by edge count matters. Use DFS when deep exploration, backtracking, or finish order matters. In graphs, keep a visited set or cycles can make traversal never stop.

    Do not confuse with:
    BFS and DFS both can visit all reachable nodes. The difference is order and the extra facts that order gives you.
  examples:
  - label: BFS with queue
    description: Nodes are visited by increasing distance from start.
    code: |
      from collections import deque

      def bfs(graph, start):
          visited = {start}
          queue = deque([start])
          order = []

          while queue:
              node = queue.popleft()
              order.append(node)
              for next_node in graph[node]:
                  if next_node not in visited:
                      visited.add(next_node)
                      queue.append(next_node)

          return order
  - label: DFS with recursion
    description: Recursive calls go deep before trying the next neighbor.
    code: |
      def dfs(graph, node, visited=None, order=None):
          visited = visited or set()
          order = order or []
          if node in visited:
              return order

          visited.add(node)
          order.append(node)
          for next_node in graph[node]:
              dfs(graph, next_node, visited, order)

          return order
  - label: Visited prevents cycles
    description: Without this check, A -> B -> A can loop forever.
    code: |
      if next_node not in visited:
          visited.add(next_node)
          queue.append(next_node)
  difficulty: mid
- title: Two pointers reduce search space with ordered movement
  explanation: |
    At mid level, two-pointer algorithms work when pointer movement has a reason.

    On a sorted list, a left and right pointer can compare the current sum to the target. If the sum is too small, moving left forward is safe because it increases the sum. If the sum is too large, moving right backward is safe because it decreases the sum. For linked lists, slow and fast pointers reveal middle nodes and cycles through different speeds.

    Where to apply:
    Use two pointers for sorted pair problems, palindrome checks, partitioning, merging, and linked-list structure questions. State the invariant that makes each move safe.

    Do not confuse with:
    Two pointers are not magic for unsorted data. If movement cannot safely discard candidates, use a different pattern such as a hash map.
  examples:
  - label: Pair sum in sorted input
    description: Pointer movement discards impossible pairs.
    code: |
      def two_sum_sorted(values, target):
          left = 0
          right = len(values) - 1

          while left < right:
              total = values[left] + values[right]
              if total == target:
                  return (left, right)
              if total < target:
                  left += 1
              else:
                  right -= 1

          return None
  - label: Middle of linked list
    description: Fast moves twice while slow moves once.
    code: |
      def middle(head):
          slow = head
          fast = head
          while fast and fast.next:
              slow = slow.next
              fast = fast.next.next
          return slow
  - label: Cycle detection
    description: If a cycle exists, fast eventually catches slow.
    code: |
      def has_cycle(head):
          slow = head
          fast = head
          while fast and fast.next:
              slow = slow.next
              fast = fast.next.next
              if slow is fast:
                  return True
          return False
  difficulty: mid
- title: Topological sort schedules dependencies
  explanation: |
    At mid level, topological sort orders work so every dependency appears before the thing that needs it.

    It only works on directed acyclic graphs. If a cycle exists, no valid order exists because some item depends on itself through a chain. Build systems, course prerequisites, migration runners, workflow engines, and package installers all use this idea.

    Where to apply:
    Use topological sort when tasks have directed dependency edges and you need a valid execution order. Track indegrees or use DFS finish order. Also report cycles clearly, because a missing order is data, not a random failure.

    Do not confuse with:
    Tree postorder handles tree-shaped dependencies. Topological sort handles graph-shaped dependencies where nodes can have multiple incoming edges.
  examples:
  - label: Indegree setup
    description: Count how many prerequisites each task still has.
    code: |
      indegree = {task: 0 for task in tasks}
      for task in tasks:
          for dependency in graph[task]:
              indegree[task] += 1
  - label: Kahn's algorithm
    description: Run tasks whose prerequisites are already satisfied.
    code: |
      from collections import deque

      def topo_sort(graph):
          indegree = {node: 0 for node in graph}
          for node in graph:
              for next_node in graph[node]:
                  indegree[next_node] += 1

          ready = deque([node for node, count in indegree.items() if count == 0])
          order = []

          while ready:
              node = ready.popleft()
              order.append(node)
              for next_node in graph[node]:
                  indegree[next_node] -= 1
                  if indegree[next_node] == 0:
                      ready.append(next_node)

          if len(order) != len(graph):
              raise ValueError("cycle detected")

          return order
  - label: Cycle means no schedule
    description: A remaining indegree means something could not be unlocked.
    code: |
      if len(order) != len(graph):
          raise ValueError("dependency cycle")
  difficulty: mid
---
