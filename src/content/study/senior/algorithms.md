---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
lessons:
- title: Invariants make algorithm correctness reviewable
  explanation: |
    At senior level, algorithm discussion should name the invariant, not only the implementation.

    An invariant is the fact that stays true while the algorithm runs. Binary search keeps the target inside the current left/right bounds if it exists. Sliding window keeps the current substring valid. Dijkstra keeps finalized shortest distances stable once removed from the priority queue. When the invariant is clear, code review can reason about correctness instead of pattern-matching a familiar snippet.

    Where to apply:
    State invariants for binary search, sliding windows, graph searches, dynamic programming, heaps, and pointer algorithms. Good tests should include boundary cases that threaten the invariant.

    Do not confuse with:
    Passing common examples does not prove the invariant. Off-by-one boundaries and stale state often pass happy paths.
  examples:
  - label: Binary search invariant
    description: If target exists, it is always inside left..right.
    code: |
      def binary_search(values, target):
          left = 0
          right = len(values) - 1

          while left <= right:
              middle = (left + right) // 2
              if values[middle] == target:
                  return middle
              if values[middle] < target:
                  left = middle + 1
              else:
                  right = middle - 1

          return -1
  - label: Sliding window invariant
    description: The window contains no repeated character after each iteration.
    code: |
      def longest_without_repeat(text):
          last_seen = {}
          left = 0
          best = 0

          for right, char in enumerate(text):
              if char in last_seen and last_seen[char] >= left:
                  left = last_seen[char] + 1
              last_seen[char] = right
              best = max(best, right - left + 1)

          return best
  - label: Boundary test
    description: Duplicates next to the left boundary often expose stale window state.
    code: |
      assert longest_without_repeat("abba") == 2
  difficulty: senior
- title: BST algorithms depend on global bounds
  explanation: |
    At senior level, binary search tree algorithms must preserve global ordering rules.

    It is not enough to compare each node with its immediate children. Every node in the left subtree must be below the current node, and every node in the right subtree must be above it. Validation carries lower and upper bounds down the tree. Range queries use those same bounds to skip impossible subtrees. Kth-smallest queries rely on inorder traversal producing sorted order.

    Where to apply:
    Use global bounds for validating a BST. Use pruning when a range excludes a whole subtree. Use iterative inorder when recursion depth or early stopping matters.

    Do not confuse with:
    Local child checks can accept invalid descendants. That bug often survives shallow test trees.
  examples:
  - label: Wrong local check
    description: This misses descendants that violate an ancestor bound.
    code: |
      def looks_valid(node):
          if node is None:
              return True
          if node.left and node.left.value >= node.value:
              return False
          if node.right and node.right.value <= node.value:
              return False
          return looks_valid(node.left) and looks_valid(node.right)
  - label: Correct global bounds
    description: Each child receives a narrower valid range.
    code: |
      def is_valid_bst(node, low=float("-inf"), high=float("inf")):
          if node is None:
              return True
          if node.value <= low or node.value >= high:
              return False
          return (
              is_valid_bst(node.left, low, node.value)
              and is_valid_bst(node.right, node.value, high)
          )
  - label: Range pruning
    description: Skip subtrees that cannot contain values inside the range.
    code: |
      def range_query(node, low, high, out):
          if node is None:
              return
          if node.value > low:
              range_query(node.left, low, high, out)
          if low <= node.value <= high:
              out.append(node.value)
          if node.value < high:
              range_query(node.right, low, high, out)
  difficulty: senior
- title: Serialization needs enough information to rebuild shape
  explanation: |
    At senior level, serialization algorithms are contracts between writer and reader.

    A preorder traversal can serialize a tree because it writes the parent before the children the reader must attach. But values alone are not enough for a general binary tree. Null markers preserve missing children. Without them, different tree shapes can produce the same value sequence, and deserialization becomes ambiguous.

    Where to apply:
    Use preorder with null markers when exact binary tree shape matters. Version the format if saved data or network clients may outlive the current code. Keep parser errors explicit so corrupted data fails predictably.

    Do not confuse with:
    Inorder values from a BST are sorted, but sorted values alone do not preserve original shape.
  examples:
  - label: Preorder encode with null markers
    description: The marker records missing children.
    code: |
      def encode(node, out):
          if node is None:
              out.append("#")
              return
          out.append(str(node.value))
          encode(node.left, out)
          encode(node.right, out)
  - label: Matching decoder
    description: Decoder consumes tokens in the same order the encoder produced them.
    code: |
      def decode(tokens):
          value = next(tokens)
          if value == "#":
              return None

          node = Node(int(value))
          node.left = decode(tokens)
          node.right = decode(tokens)
          return node
  - label: Ambiguous without nulls
    description: These two shapes can share the same preorder values.
    code: |
      # A with left child B
      # A with right child B
      # Both can emit: A, B
  difficulty: senior
- title: Linked-list algorithms are pointer ownership problems
  explanation: |
    At senior level, linked-list algorithms are less about syntax and more about not losing access to the rest of the list.

    Reversal must save next before rewiring current.next. Merge algorithms often use a sentinel node so the first insertion is not a special case. Removing nodes often needs a previous pointer, or a dummy head when the real head might change. The invariant should explain which part is already processed and which part is still reachable.

    Where to apply:
    Use sentinel nodes for merge and delete operations. Save next pointers before mutation. Use slow/fast pointers for cycle, middle, and kth-from-end problems.

    Do not confuse with:
    Changing a pointer before saving the next pointer can orphan the rest of the list.
  examples:
  - label: Reverse safely
    description: Save next before replacing current.next.
    code: |
      def reverse(head):
          previous = None
          current = head

          while current:
              next_node = current.next
              current.next = previous
              previous = current
              current = next_node

          return previous
  - label: Merge with sentinel
    description: Sentinel removes special handling for the first node.
    code: |
      def merge_sorted(left, right):
          sentinel = Node(None)
          tail = sentinel

          while left and right:
              if left.value <= right.value:
                  tail.next = left
                  left = left.next
              else:
                  tail.next = right
                  right = right.next
              tail = tail.next

          tail.next = left or right
          return sentinel.next
  - label: Head may change
    description: A dummy node makes deleting the first real node normal.
    code: |
      dummy = Node(None)
      dummy.next = head
      # delete using previous.next = current.next
      return dummy.next
  difficulty: senior
- title: Complexity includes constant factors and data-structure operations
  explanation: |
    At senior level, Big O is necessary but not enough.

    Two implementations can both be O(n) while one repeatedly performs an expensive list operation. A queue implemented with popleft is different from a list that shifts every item on pop(0). A top-k solution that sorts every unique value may be fine for small inputs, while a heap matters when unique values are huge and k is small.

    Where to apply:
    Review the cost of each data-structure operation inside loops. Check memory growth, allocation volume, recursion depth, input distribution, and early stopping. Pick simpler code when constraints are small and stable.

    Do not confuse with:
    Optimizing every algorithm to the theoretical best shape can make code harder to maintain without product benefit. Let measured constraints guide extra complexity.
  examples:
  - label: Queue with deque
    description: popleft is O(1), unlike repeatedly shifting a list.
    code: |
      from collections import deque

      queue = deque([root])
      node = queue.popleft()
  - label: Top k by sorting
    description: Clear and acceptable when unique values are limited.
    code: |
      def top_k(counts, k):
          return sorted(counts, key=counts.get, reverse=True)[:k]
  - label: Top k by heap
    description: Useful when k is small relative to many unique values.
    code: |
      import heapq

      def top_k(counts, k):
          return heapq.nlargest(k, counts, key=counts.get)
  difficulty: senior
---
