---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
lessons:
- title: Choose between array and linked list by access pattern
  explanation: |
    Arrays and linked lists both store sequences, but their cost profiles differ.

    Arrays give O(1) random access and are cache-friendly because elements sit in contiguous memory. Insertion and removal in the middle cost O(n) because elements shift. Linked lists give O(1) insert and remove at a known node but O(n) traversal to find a position. Random access does not exist.

    In practice, arrays (and dynamic lists backed by arrays) win for most workloads because cache locality matters more than the theoretical insert cost. Prefer a linked list only when you hold a pointer to the node being modified and insertions dominate reads — for example, a doubly linked list backing an LRU cache.
  examples:
  - label: Array beats linked list for read-heavy work
    description: Sequential access of an array is fast due to CPU cache prefetching.
    code: |
      # Array: elements in contiguous memory, prefetcher loads ahead
      totals = [compute(x) for x in items]
      result = sum(totals)  # sequential scan — cache friendly
  - label: Linked list node removal without shifting
    description: An LRU eviction removes a node by relinking neighbors, not shifting the whole buffer.
    code: |
      class Node:
          def __init__(self, key, val):
              self.key = key
              self.val = val
              self.prev = self.next = None

      def remove(node):
          node.prev.next = node.next
          node.next.prev = node.prev
  difficulty: mid
- title: Distinguish hash map from sorted map by query type
  explanation: |
    A hash map and a sorted map (balanced BST, skip list) both retrieve values by key, but they answer different questions cheaply.

    Hash maps give average O(1) get, set, and delete. They do not support range queries or ordered iteration. Sorted maps give O(log n) for all operations but also support "find all keys between A and B" and yield keys in sorted order.

    Reach for a sorted structure only when the query requires ordering. Using a sorted map as a key-value store when you only ever look up exact keys adds log-factor cost for no benefit.
  examples:
  - label: Hash map for exact lookup
    description: Config values are retrieved by known key. Order is irrelevant.
    code: |
      config = {"timeout": 30, "retries": 3, "debug": False}
      timeout = config["timeout"]
  - label: Sorted map for range query
    description: Retrieving all events between two timestamps requires ordered keys.
    code: |
      from sortedcontainers import SortedDict

      events = SortedDict()
      events[1716800000] = "user_login"
      events[1716800050] = "page_view"
      events[1716800120] = "logout"

      window = list(events.irange(1716800000, 1716800100))
  difficulty: mid
- title: Use deque when both ends of a sequence need cheap access
  explanation: |
    A plain list is a poor double-ended queue. Popping from the left costs O(n) because every element shifts. A deque (double-ended queue) supports O(1) append and pop from both ends, and O(1) len.

    This matters in sliding-window problems, breadth-first search frontiers, and rate limiters that drain from the front while appending to the back. Using a list in these cases is a hidden performance bug that only shows at scale: at 10,000 items, each list.pop(0) shifts 10,000 elements.

    Do not confuse deque with a priority queue. A deque is O(1) at both ends but does not sort. A priority queue is O(log n) insert and O(log n) remove, always yielding the highest-priority item next.
  examples:
  - label: Sliding window with deque
    description: Track the last N timestamps efficiently without shifting a list.
    code: |
      from collections import deque

      MAX = 5
      window = deque(maxlen=MAX)

      for ts in event_stream:
          window.append(ts)
          # oldest drops off automatically when len > MAX
  - label: BFS frontier
    description: BFS pops from the left and appends to the right; both must be O(1).
    code: |
      from collections import deque

      def bfs(graph, start):
          visited = set()
          queue = deque([start])
          while queue:
              node = queue.popleft()
              for neighbor in graph[node]:
                  if neighbor not in visited:
                      visited.add(neighbor)
                      queue.append(neighbor)
  difficulty: mid
- title: Recognize when a set eliminates a nested loop
  explanation: |
    Any algorithm that asks "is this item in a collection?" inside a loop over another collection is a candidate for a set replacement.

    Scanning a list for membership is O(n). Doing that inside a loop over n items gives O(n²) total. Converting the inner collection to a set reduces each lookup to O(1), making the whole operation O(n) — a meaningful improvement when n is large. Building the set itself costs O(m) where m is its size, paid once upfront.

    Do not blindly convert everything to sets. Sets discard duplicates and ordering. If you need either, a set is wrong.
  examples:
  - label: Nested loop smell
    description: Checking each user against a blocked list inside a loop is O(n*m).
    code: |
      allowed = []
      for user in users:
          for blocked in blocked_list:
              if user.id == blocked:
                  break
          else:
              allowed.append(user)
  - label: Set fix
    description: Build a set once, then each membership check is O(1).
    code: |
      blocked_ids = set(blocked_list)
      allowed = [u for u in users if u.id not in blocked_ids]
  difficulty: mid
- title: Know when not to introduce a custom data structure
  explanation: |
    A custom data structure adds cognitive overhead for every future reader. Most of the time, composition of built-in types — lists, dicts, sets, and deques — is enough.

    Introduce a custom structure only when the built-in composition fails to meet a concrete need: the operations you need are not supported, the performance is provably insufficient, or the invariants you need to enforce are impossible to express otherwise.

    A common mistake is wrapping a list in a class to add a method that could have been a plain function, or building a custom queue when deque already exists. Check the standard library before writing new abstractions.
  examples:
  - label: Unnecessary wrapper
    description: This class adds nothing that a plain list and a function could not do.
    code: |
      class JobQueue:
          def __init__(self):
              self._items = []

          def push(self, item):
              self._items.append(item)

          def pop(self):
              return self._items.pop(0)  # still O(n) — no improvement
  - label: Use deque instead
    description: deque already provides what this class was trying to be.
    code: |
      from collections import deque

      jobs = deque()
      jobs.append("send-email")
      next_job = jobs.popleft()
  difficulty: mid
---
