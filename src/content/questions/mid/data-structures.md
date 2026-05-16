---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
questions:
- q: Which graph representation is implemented?
  code: "function buildRouteMap(edges) {\n  const graph = new Map();\n  for (const [from, to] of edges) {\n    if (!graph.has(from))\
    \ graph.set(from, []);\n    if (!graph.has(to)) graph.set(to, []);\n    graph.get(from).push(to);\n  }\n  return graph;\n\
    }"
  options:
  - text: Adjacency list
    correct: true
  - text: Adjacency matrix
    correct: false
  - text: Incidence matrix
    correct: false
  - text: Edge list
    correct: false
  explanation: Each node maps to an array of outgoing neighbors. That map-of-lists shape is an adjacency list representation.
  difficulty: mid
- q: Which data structure behavior is implemented?
  code: "class GrowableBuffer {\n  storage = new Array(2);\n  length = 0;\n  push(value) {\n    if (this.length === this.storage.length)\
    \ {\n      const next = new Array(this.storage.length * 2);\n      for (let i = 0; i < this.length; i++) next[i] = this.storage[i];\n\
    \      this.storage = next;\n    }\n    this.storage[this.length++] = value;\n  }\n}"
  options:
  - text: Dynamic array resizing
    correct: true
  - text: Amortized linked list append
    correct: false
  - text: Circular buffer append
    correct: false
  - text: Queue dequeue
    correct: false
  explanation: The backing array doubles when full, then existing values are copied into the larger storage. That is dynamic
    array growth.
  difficulty: mid
- q: Which data structure is implemented?
  code: "class BrowserHistory {\n  items = [];\n  addStart(value) {\n    this.items.unshift(value);\n  }\n  addEnd(value)\
    \ {\n    this.items.push(value);\n  }\n  removeStart() {\n    return this.items.shift();\n  }\n  removeEnd() {\n    return\
    \ this.items.pop();\n  }\n}"
  options:
  - text: Deque
    correct: true
  - text: Stack (LIFO only)
    correct: false
  - text: Queue (FIFO only)
    correct: false
  - text: Circular queue
    correct: false
  explanation: A deque supports insertion and removal at both front and back. The four methods map directly to double-ended
    queue behavior.
  difficulty: mid
- q: Which data structure is implemented?
  code: "class SortedIndex {\n  root = null;\n  insert(value) {\n    const node = new ItemNode(value);\n    if (!this.root)\
    \ {\n      this.root = node;\n      return;\n    }\n    let current = this.root;\n    while (true) {\n      if (value\
    \ < current.value) {\n        if (!current.left) return void (current.left = node);\n        current = current.left;\n\
    \      } else {\n        if (!current.right) return void (current.right = node);\n        current = current.right;\n \
    \     }\n    }\n  }\n}"
  options:
  - text: Binary search tree
    correct: true
  - text: Binary heap
    correct: false
  - text: AVL tree
    correct: false
  - text: Red-black tree
    correct: false
  explanation: Each insert compares values and moves left for smaller values or right for greater/equal values. That ordering
    rule identifies a binary search tree.
  difficulty: mid
- q: Which graph representation is implemented?
  code: "function buildAccessGrid(n, edges) {\n  const matrix = Array.from({ length: n }, () => Array(n).fill(false));\n \
    \ for (const [from, to] of edges) {\n    matrix[from][to] = true;\n  }\n  return matrix;\n}"
  options:
  - text: Adjacency matrix
    correct: true
  - text: Adjacency list
    correct: false
  - text: Incidence matrix
    correct: false
  - text: Edge list
    correct: false
  explanation: The graph is represented by a two-dimensional n-by-n matrix where matrix[from][to] records whether an edge
    exists.
  difficulty: mid
- q: You need to remove items from the front of a collection thousands of times per second. Which structure should you use?
  options:
  - text: collections.deque
    correct: true
  - text: list
    correct: false
  - text: set
    correct: false
  - text: tuple
    correct: false
  explanation: list.pop(0) is O(n) because every remaining element shifts left. deque.popleft() is O(1) because it adjusts
    a head pointer. At high frequency this difference dominates throughput.
  difficulty: mid
- q: "An algorithm checks whether each item in list A exists in list B, using a nested loop. What is the time complexity and\
    \ what simple change improves it?"
  options:
  - text: O(n*m); convert list B to a set so each lookup becomes O(1)
    correct: true
  - text: O(n log n); sort list A before iterating
    correct: false
  - text: O(n+m); merge both lists and deduplicate
    correct: false
  - text: O(n*m); use a deque instead of a list for list B
    correct: false
  explanation: The nested loop checks every pair, giving O(n*m). Converting list B to a set makes each inner lookup O(1),
    reducing the whole operation to O(n+m). A deque offers no improvement for membership checks.
  difficulty: mid
- q: You need to store events keyed by Unix timestamp and later retrieve all events between two timestamps. Which structure
    is the right fit?
  options:
  - text: A sorted map or sorted dictionary (keys maintained in order)
    correct: true
  - text: A plain hash map
    correct: false
  - text: A set
    correct: false
  - text: A deque
    correct: false
  explanation: A range query requires keys to be ordered. A sorted map supports irange or slicing by key in O(log n). A hash
    map gives O(1) exact lookup but has no concept of key ordering, so range queries require a full scan.
  difficulty: mid
- q: "You convert a list to a set to speed up lookups. What do you lose?"
  options:
  - text: Insertion order and duplicate entries
    correct: true
  - text: The ability to iterate over items
    correct: false
  - text: O(1) membership checks
    correct: false
  - text: The ability to add new items later
    correct: false
  explanation: Sets are unordered and store only unique values. Converting a list to a set drops any order the items had and
    collapses duplicates to one entry. Iteration, membership checks, and mutation all still work on a set.
  difficulty: mid
- q: Which scenario justifies using a linked list over a dynamic array?
  options:
  - text: You hold a direct pointer to a node and must insert or remove at that position in O(1)
    correct: true
  - text: You need fast sequential read access of all elements
    correct: false
  - text: You need O(1) random access by index
    correct: false
  - text: You want lower memory usage per element
    correct: false
  explanation: A linked list's insert and remove are O(1) only when you already have the node reference. Sequential read and
    index access are both faster on arrays due to cache locality. Linked list nodes carry pointer overhead, so memory usage
    is higher per element.
  difficulty: mid
- q: Why does sequential traversal of a large array typically outperform traversal of a linked list of the same size, even
    though both are O(n)?
  options:
  - text: Array elements sit in contiguous memory, so the CPU prefetcher loads upcoming elements before they are needed
    correct: true
  - text: Arrays skip null pointer checks that linked lists require
    correct: false
  - text: Arrays use less total memory, reducing swap usage
    correct: false
  - text: Linked list traversal is actually O(n log n) in practice
    correct: false
  explanation: Big-O measures operation count, not hardware cost. Contiguous memory lets the CPU prefetcher keep the next
    elements in cache. Each linked list node may be at a random memory address, causing a cache miss on every pointer dereference.
    The gap is often 5-20x on real hardware.
  difficulty: mid
- q: "A sliding-window rate limiter records the timestamp of each request and drops timestamps older than 60 seconds. Which\
    \ structure best supports appending new timestamps and removing old ones from the front?"
  options:
  - text: deque with maxlen or manual front removal
    correct: true
  - text: list with pop(0) for front removal
    correct: false
  - text: set of timestamps
    correct: false
  - text: sorted dictionary keyed by timestamp
    correct: false
  explanation: The limiter appends to the back and removes from the front — exactly what a deque supports in O(1). list.pop(0)
    is O(n). A set has no ordering so you cannot efficiently identify the oldest entry. A sorted dict adds log-factor cost
    unnecessarily.
  difficulty: mid
- q: A team wraps a list in a class that exposes push and pop(0) methods. What is the problem with this design?
  options:
  - text: pop(0) on a list is O(n); the wrapper hides a performance trap behind a clean API
    correct: true
  - text: Lists do not support pop(0) at all
    correct: false
  - text: Wrapping a list in a class makes it immutable
    correct: false
  - text: The class prevents the garbage collector from reclaiming list memory
    correct: false
  explanation: list.pop(0) shifts every remaining element, making it O(n). The wrapper makes the cost invisible to callers.
    The fix is to use collections.deque, which gives O(1) popleft(). Wrapping does not affect mutability or GC behavior.
  difficulty: mid
- q: You need a collection that returns items in priority order, not insertion order. Which structure fits?
  options:
  - text: Priority queue (heap)
    correct: true
  - text: deque
    correct: false
  - text: Sorted list
    correct: false
  - text: Hash map
    correct: false
  explanation: A priority queue always removes the highest-priority item regardless of when it was inserted. A deque preserves
    insertion order. A sorted list works but has O(n log n) rebuild cost on each insert. A heap gives O(log n) insert and
    O(log n) remove-min.
  difficulty: mid
- q: "When is it appropriate to introduce a custom data structure instead of using standard library types?"
  options:
  - text: When you need to enforce an invariant that cannot survive outside the class without leaking internal state
    correct: true
  - text: When you want a more readable method name than the standard type offers
    correct: false
  - text: When the standard type has more methods than you intend to use
    correct: false
  - text: When the collection holds more than a few hundred items
    correct: false
  explanation: A custom structure is justified when two or more internal components must stay synchronized and that invariant
    cannot be enforced externally (e.g., an LRU cache combining a map and a linked list). Nicer APIs, fewer methods, and
    collection size are not valid reasons.
  difficulty: mid
- q: A hash map gives O(1) average lookup. A balanced BST (sorted map) gives O(log n) lookup. Why would you choose the BST?
  options:
  - text: You need range queries or sorted iteration over keys
    correct: true
  - text: You need faster exact-key lookup
    correct: false
  - text: You want lower memory usage
    correct: false
  - text: You need to store duplicate keys
    correct: false
  explanation: A hash map cannot efficiently answer "find all keys between A and B" because keys are unordered. A sorted map
    supports range queries and yields keys in order. For pure exact-key lookups the hash map is faster. Memory usage is
    usually higher for BSTs due to pointer overhead.
  difficulty: mid
- q: "What does `deque(maxlen=5)` do when a sixth item is appended?"
  options:
  - text: The oldest item is automatically removed from the front
    correct: true
  - text: An IndexError is raised
    correct: false
  - text: The new item is silently dropped
    correct: false
  - text: The deque doubles its capacity like a dynamic array
    correct: false
  explanation: A bounded deque discards the item from the opposite end when full. Appending to the right drops the leftmost
    item, maintaining a fixed-size sliding window without any manual eviction code.
  difficulty: mid
- q: Which BFS implementation correctly uses the right data structure for the frontier?
  options:
  - text: "```python\nfrom collections import deque\nqueue = deque([start])\nwhile queue:\n    node = queue.popleft()\n    for\
      \ n in graph[node]:\n        queue.append(n)\n```"
    correct: true
  - text: "```python\nstack = [start]\nwhile stack:\n    node = stack.pop()\n    for n in graph[node]:\n        stack.append(n)\n\
      ```"
    correct: false
  - text: "```python\nfrontier = set([start])\nfor node in frontier:\n    for n in graph[node]:\n        frontier.add(n)\n\
      ```"
    correct: false
  - text: "```python\nqueue = [start]\nwhile queue:\n    node = queue.pop(0)\n    for n in graph[node]:\n        queue.append(n)\n\
      ```"
    correct: false
  explanation: BFS requires FIFO ordering. deque.popleft() is O(1) and correct. stack.pop() gives DFS, not BFS. A set has
    no ordering. list.pop(0) gives the right order but is O(n) per removal.
  difficulty: mid
- q: You need to count how many times each domain appears in a list of URLs. Which structure and pattern is most direct?
  options:
  - text: A dictionary mapping domain to count, incremented with dict.get(key, 0) + 1
    correct: true
  - text: A list of (domain, count) tuples appended per occurrence
    correct: false
  - text: A set of domains, checking membership before adding
    correct: false
  - text: A sorted list of domains, then count runs with a loop
    correct: false
  explanation: A dictionary gives O(1) lookup and update per domain. The list-of-tuples approach requires scanning for each
    domain. A set cannot store counts. Sorting and counting runs adds unnecessary complexity.
  difficulty: mid
- q: "Two sets of user IDs need to be compared: find users in set A who are NOT in set B. Which operation and which data\
    \ structure gives the most direct solution?"
  options:
  - text: Set difference — A - B using Python sets
    correct: true
  - text: Filter list A by checking each ID against list B in a nested loop
    correct: false
  - text: Sort both collections and walk them with two pointers
    correct: false
  - text: Build a dict from B, then filter A against dict keys
    correct: false
  explanation: Set difference is a built-in O(n+m) operation that directly answers "elements in A not in B." A nested loop
    is O(n*m). Two-pointer requires sorting, adding O(n log n) cost. Building a dict from B works but is more verbose than
    set difference with no benefit.
  difficulty: mid
---
