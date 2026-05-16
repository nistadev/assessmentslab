---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
lessons:
- title: Pick collections by lookup and update needs
  explanation: |
    Arrays, sets, and maps solve different access problems.

    Arrays preserve order and support indexed traversal. Sets answer membership questions without scanning every item. Maps associate one key with one value. Most data-structure choices start by asking which operation must stay cheap: append, lookup by position, membership check, or lookup by key.

    Big-O notation describes how an operation's cost grows with the size of the collection. O(1) means the cost is constant regardless of size. O(n) means the cost grows linearly — double the items, double the work. Membership check on a list is O(n) because every item may be scanned. Membership check on a set is O(1) because a hash table is used internally.

    In everyday engineering these three types — sequence, set, map — cover the vast majority of real code. Reach for more complex structures only when a clear access pattern demands it.
  examples:
  - label: Linear membership scan
    description: This works for small lists, but every lookup may scan the whole array.
    code: |
      blocked_users = ["ana", "lee", "sam"]

      def can_post(user):
          return user not in blocked_users
  - label: Set membership
    description: A set communicates uniqueness and gives fast membership checks.
    code: |
      blocked_users = {"ana", "lee", "sam"}

      def can_post(user):
          return user not in blocked_users
  - label: Map lookup
    description: Use a map when a stable key should retrieve a related value.
    code: |
      users_by_id = {
          "u_1": {"name": "Ana"},
          "u_2": {"name": "Lee"},
      }

      user = users_by_id.get("u_2")
  difficulty: junior
- title: Stacks and queues encode processing order
  explanation: |
    Stack and queue names describe removal order.

    A stack is last-in, first-out. It matches undo history, nested parsing, and depth-first traversal. A queue is first-in, first-out. It matches background jobs, breadth-first traversal, and fair request handling. The data structure makes the processing policy explicit.

    Both are usually built on top of arrays or linked lists. Push and pop on a stack are O(1). Enqueue and dequeue on a queue are O(1) when backed by a deque. Choosing the right wrapper communicates intent to the next reader even if the performance difference is small.
  examples:
  - label: Stack for undo
    description: Last action should be undone first.
    code: |
      undo_stack = []

      undo_stack.append(("rename", "draft.md"))
      undo_stack.append(("delete", "notes.md"))

      action = undo_stack.pop()
  - label: Queue for jobs
    description: First enqueued job should run first.
    code: |
      from collections import deque

      jobs = deque()
      jobs.append("send-email")
      jobs.append("render-invoice")

      next_job = jobs.popleft()
  difficulty: junior
- title: Lists let you grow sequences without a fixed size
  explanation: |
    A list (dynamic array) is the default sequence type in most languages. It grows as you append items and allows access by position.

    Under the hood, a list is backed by an array that is occasionally copied to a larger buffer when capacity runs out. This keeps appends O(1) amortized — fast on average, with rare O(n) copy events. Random access by index is O(1). Inserting or removing in the middle is O(n) because every item after the insertion point must shift.

    Common beginner confusion: using a list when a set or map would answer the question faster, or removing items from the middle of a list inside a loop.
  examples:
  - label: Append and index
    description: Append is fast. Index access is fast. Both are the common case.
    code: |
      log = []
      log.append("started")
      log.append("processed")
      log.append("done")

      last = log[-1]
  - label: Mid-list removal is slow
    description: Removing from the middle shifts every element after it.
    code: |
      items = ["a", "b", "c", "d"]
      items.remove("b")  # shifts "c" and "d" left
  difficulty: junior
- title: Hash maps give fast lookup by key
  explanation: |
    A hash map (dictionary) turns any hashable key into an index so that lookup, insert, and delete all run in O(1) on average. Worst-case is O(n) when many keys collide, but with a good hash function this is rare in practice.

    Hash maps are one of the most commonly used structures in everyday engineering. Configuration objects, caches, frequency counts, and grouping by attribute are all natural fits.

    Do not confuse with a list of tuples or a sorted structure. A map gives you O(1) access by key, not by position or sorted order.
  examples:
  - label: Frequency count
    description: Count how often each word appears without scanning twice.
    code: |
      words = ["go", "run", "go", "walk", "run", "go"]
      counts = {}

      for word in words:
          counts[word] = counts.get(word, 0) + 1

      # {"go": 3, "run": 2, "walk": 1}
  - label: Cache lookup
    description: Return a cached result instead of recomputing.
    code: |
      cache = {}

      def get_user(user_id):
          if user_id not in cache:
              cache[user_id] = fetch_from_db(user_id)
          return cache[user_id]
  difficulty: junior
- title: Trees and graphs appear in specific contexts, not general code
  explanation: |
    Trees model hierarchy: file systems, nested menus, and HTML documents are all trees. Graphs model arbitrary relationships: dependencies, social connections, and routing networks.

    In everyday application code these structures rarely appear directly. You interact with them through libraries and frameworks — a database uses a B-tree, a build tool uses a dependency graph. You usually do not write tree or graph traversal yourself unless the problem explicitly requires it.

    Recognizing where these structures hide helps you reason about performance and limitations of the tools you are using.
  examples:
  - label: Tree thinking without explicit tree code
    description: A recursive file listing visits a tree, even though the code just calls os.walk.
    code: |
      import os

      for root, dirs, files in os.walk("src"):
          for f in files:
              print(os.path.join(root, f))
  - label: Graph thinking in dependency resolution
    description: Installing packages follows edges in a dependency graph, handled by the package manager.
    code: |
      # pip install requests
      # pip resolves: requests -> urllib3, certifi, charset-normalizer
      # Each dependency edge is a graph edge
      pass
  difficulty: junior
---
