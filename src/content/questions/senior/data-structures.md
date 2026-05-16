---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
questions:
- q: Which data structure is implemented?
  code: "class PriorityStore {\n  data = [];\n  push(value) {\n    this.data.push(value);\n    this.promote(this.data.length\
    \ - 1);\n  }\n  promote(index) {\n    while (index > 0) {\n      const parentIdx = Math.floor((index - 1) / 2);\n    \
    \  if (this.data[parentIdx] <= this.data[index]) break;\n      [this.data[parentIdx], this.data[index]] = [this.data[index],\
    \ this.data[parentIdx]];\n      index = parentIdx;\n    }\n  }\n}"
  options:
  - text: Min heap
    correct: true
  - text: Max heap
    correct: false
  - text: AVL tree
    correct: false
  - text: Priority queue backed by a sorted array
    correct: false
  explanation: The parent index formula and bubble-up swap preserve the rule that each parent is less than or equal to its
    children. That identifies a min heap.
  difficulty: senior
- q: Which data structure is implemented?
  code: "class PrefixNode {\n  constructor() {\n    this.children = new Map();\n    this.terminal = false;\n  }\n}\nclass\
    \ WordStore {\n  root = new PrefixNode();\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n\
    \      if (!node.children.has(ch)) node.children.set(ch, new PrefixNode());\n      node = node.children.get(ch);\n   \
    \ }\n    node.terminal = true;\n  }\n}"
  options:
  - text: Trie
    correct: true
  - text: Hash map with prefix keys
    correct: false
  - text: Radix tree
    correct: false
  - text: Binary search tree
    correct: false
  explanation: Each character moves one level deeper through a child map, and `terminal` marks complete words. That prefix-tree
    structure is a trie.
  difficulty: senior
- q: Which data structure is implemented?
  code: "class UniqueRegistry {\n  slots = Array.from({ length: 16 }, () => []);\n  hash(value) {\n    return String(value).length\
    \ % this.slots.length;\n  }\n  add(value) {\n    const bucket = this.slots[this.hash(value)];\n    if (!bucket.includes(value))\
    \ bucket.push(value);\n  }\n  has(value) {\n    return this.slots[this.hash(value)].includes(value);\n  }\n}"
  options:
  - text: Hash set with separate chaining
    correct: true
  - text: Hash map with separate chaining
    correct: false
  - text: Hash set with open addressing
    correct: false
  - text: Min heap
    correct: false
  explanation: The structure hashes a value to a bucket, stores unique values, and resolves collisions with arrays inside
    buckets. That is a hash set using separate chaining.
  difficulty: senior
- q: Which data structure operation is shown?
  code: "class CacheEntry {\n  constructor(value) {\n    this.value = value;\n    this.prev = null;\n    this.next = null;\n\
    \  }\n}\nfunction detach(entry) {\n  if (entry.prev) entry.prev.next = entry.next;\n  if (entry.next) entry.next.prev\
    \ = entry.prev;\n  entry.prev = null;\n  entry.next = null;\n}"
  options:
  - text: Remove a node from a doubly linked list
    correct: true
  - text: Remove a node from a singly linked list
    correct: false
  - text: Remove from a binary heap
    correct: false
  - text: Remove from a circular buffer
    correct: false
  explanation: The node has both `prev` and `next` pointers. Removal reconnects the previous node to the next node and the
    next node back to the previous node, which is doubly linked list behavior.
  difficulty: senior
- q: Which data structure is implemented?
  code: "class LookupTable {\n  slots = Array.from({ length: 16 }, () => []);\n  hash(key) {\n    return String(key).length\
    \ % this.slots.length;\n  }\n  set(key, value) {\n    const bucket = this.slots[this.hash(key)];\n    const pair = bucket.find(([k])\
    \ => k === key);\n    if (pair) pair[1] = value;\n    else bucket.push([key, value]);\n  }\n  get(key) {\n    return this.slots[this.hash(key)]\n\
    \      .find(([k]) => k === key)?.[1];\n  }\n}"
  options:
  - text: Hash map with separate chaining
    correct: true
  - text: Hash set with separate chaining
    correct: false
  - text: Hash map with open addressing
    correct: false
  - text: Trie
    correct: false
  explanation: Keys are hashed into buckets, and collisions are stored as key-value pairs inside a bucket array. That is separate
    chaining in a hash map.
  difficulty: senior
- q: Which data structure is implemented?
  code: "class RingBuffer {\n  constructor(size) {\n    this.slots = new Array(size);\n    this.head = 0;\n    this.tail =\
    \ 0;\n    this.count = 0;\n  }\n  enqueue(value) {\n    if (this.count === this.slots.length) return false;\n    this.slots[this.tail]\
    \ = value;\n    this.tail = (this.tail + 1) % this.slots.length;\n    this.count++;\n    return true;\n  }\n}"
  options:
  - text: Circular queue
    correct: true
  - text: Deque
    correct: false
  - text: Regular queue
    correct: false
  - text: Stack
    correct: false
  explanation: The tail wraps with modulo when it reaches the end of the backing array. That ring-buffer behavior identifies
    a circular queue.
  difficulty: senior
- q: Which compact data structure is implemented?
  code: "class PermissionFlags {\n  bits = 0;\n  add(position) {\n    this.bits |= (1 << position);\n  }\n  has(position)\
    \ {\n    return (this.bits & (1 << position)) !== 0;\n  }\n}"
  options:
  - text: Bit set
    correct: true
  - text: Boolean array map
    correct: false
  - text: Byte array
    correct: false
  - text: Hash set
    correct: false
  explanation: Each position is represented by one bit inside an integer. Bitwise OR sets a bit, and bitwise AND checks whether
    that bit is present.
  difficulty: senior
- q: "A function returns a raw dict to its callers. A caller accidentally mutates it:\n\n```python\ndef get_config():\n    return\
    \ {\"timeout\": 30}\n\ncfg = get_config()\ncfg[\"timeout\"] = 0  # caller mutates shared state\n```\nWhat is the most\
    \ robust fix?"
  options:
  - text: Return a frozen dataclass or namedtuple so mutation raises a TypeError
    correct: true
  - text: Document that callers should not mutate the dict
    correct: false
  - text: Return a copy of the dict so mutation only affects the copy
    correct: false
  - text: Wrap the dict in a list so the caller cannot modify keys directly
    correct: false
  explanation: A frozen dataclass or namedtuple makes the contract explicit and enforced at runtime. Documentation is not
    enforced. Returning a copy prevents mutation of the original but does not communicate the immutability intent. Wrapping
    in a list is an obscure workaround that does not actually prevent mutation.
  difficulty: senior
- q: "Why does sequential access of a large linked list typically run 5-20x slower than the same traversal over an array,\
    \ despite both being O(n)?"
  options:
  - text: Linked list nodes are at non-contiguous heap addresses, causing a CPU cache miss on every pointer dereference
    correct: true
  - text: Linked lists require bounds checking on every access
    correct: false
  - text: Pointer arithmetic in linked lists is more expensive than index arithmetic in arrays
    correct: false
  - text: Linked list traversal is actually O(n log n) due to pointer indirection
    correct: false
  explanation: Cache misses are the dominant cost. An array's contiguous layout lets the CPU prefetcher load upcoming elements
    before they are needed. Each linked list node may be at a random memory address, stalling the CPU on every pointer follow.
    Big-O ignores hardware constants like cache miss latency (~100 cycles vs ~4 cycles for L1 cache).
  difficulty: senior
- q: "Multiple goroutines/threads append results to a shared list without synchronization. What category of bug is this?"
  options:
  - text: Data race — concurrent writes to a shared mutable structure without a lock
    correct: true
  - text: Memory leak — the list grows without bound
    correct: false
  - text: Stack overflow — recursive appends exhaust call stack space
    correct: false
  - text: Off-by-one error — concurrent appends corrupt index calculations
    correct: false
  explanation: Concurrent mutation of a shared list without synchronization is a data race. Depending on the runtime, this
    can corrupt internal state, lose entries, or intermittently raise errors. The fix is to use a thread-safe queue or protect
    the list with a lock.
  difficulty: senior
- q: "An LRU cache must evict the least-recently-used entry when full. Which combination of data structures satisfies O(1)\
    \ get and O(1) put?"
  options:
  - text: Hash map for O(1) key lookup + doubly linked list for O(1) recency reordering
    correct: true
  - text: Hash map alone
    correct: false
  - text: Sorted map keyed by access time
    correct: false
  - text: Priority queue keyed by access timestamp
    correct: false
  explanation: The hash map gives O(1) key lookup. The doubly linked list lets you move any accessed node to the front and
    remove the tail in O(1) without shifting. A hash map alone cannot order by recency. A sorted map or priority queue
    gives O(log n) per operation.
  difficulty: senior
- q: "A service builds a configuration dict at startup and then reads it on every request. What structural choice reduces\
    \ accidental mutation risk and signals intent to readers?"
  options:
  - text: Use a frozen dataclass or types.MappingProxyType to make the object immutable after construction
    correct: true
  - text: Use a regular dict and rely on code review to catch mutations
    correct: false
  - text: Copy the dict on every request so mutations are isolated
    correct: false
  - text: Store the config in a module-level list of tuples
    correct: false
  explanation: An immutable wrapper communicates the build-once-read-many lifecycle and prevents accidental writes at runtime.
    Code review is not enforced. Copying per request adds unnecessary allocation on every call. A list of tuples has no
    key-based access.
  difficulty: senior
- q: What specific invariant justifies wrapping a hash map and a doubly linked list together in an LRU cache class rather
    than leaving them as separate objects?
  options:
  - text: Every map access must atomically update the recency list; no external caller can be trusted to do both
    correct: true
  - text: The class provides a nicer API than using a dict and list separately
    correct: false
  - text: It prevents the garbage collector from collecting either structure independently
    correct: false
  - text: The class reduces total memory by sharing node objects between map and list
    correct: false
  explanation: The invariant is that the map and the list must always reflect the same recency order. Exposing them separately
    lets callers update one without the other, breaking the invariant silently. Encapsulation enforces the atomic update.
    Nicer API and GC behavior are not invariants.
  difficulty: senior
- q: "A function signature is `def load_users() -> List[User]`. What implicit contract does this return type create for callers?"
  options:
  - text: Items have a defined order and callers may access them by position or iterate in sequence
    correct: true
  - text: Items are unique and callers can perform O(1) membership checks
    correct: false
  - text: Items are sorted by a natural ordering of User
    correct: false
  - text: Callers can look up users by ID in O(1)
    correct: false
  explanation: A List implies ordering and positional access. It does not guarantee uniqueness (that is Set), sorted order
    (that is a sorted collection), or key-based lookup (that is Dict). Changing the return type to Set or Dict later breaks
    callers relying on positional access or insertion order.
  difficulty: senior
- q: A high-throughput service stores 50 million session records in a dict-of-dicts structure. Memory usage is unexpectedly
    high. What is the most likely cause?
  options:
  - text: Python dicts carry per-key overhead of roughly 200 bytes, multiplied by 50 million entries
    correct: true
  - text: The garbage collector is not reclaiming expired session dicts
    correct: false
  - text: Python lists inside the dicts are over-allocating backing arrays
    correct: false
  - text: Dict key hashing stores a full copy of each key string
    correct: false
  explanation: Python's dict implementation carries significant per-entry overhead for hash metadata, pointer storage, and
    object headers. At 50 million records this accumulates to gigabytes. Columnar storage or compact structures like dataclasses
    with __slots__ can reduce this by an order of magnitude.
  difficulty: senior
- q: "A service receives a workflow DAG from an orchestrator and processes each step. The service does NOT implement traversal\
    \ or cycle detection. Why is this appropriate?"
  options:
  - text: The orchestrator owns graph invariants; the service only processes pre-validated steps in guaranteed topological order
    correct: true
  - text: Cycle detection is always the responsibility of the consuming service
    correct: false
  - text: DAGs cannot contain cycles by definition, so no detection is needed anywhere
    correct: false
  - text: The service should validate the graph on each call to avoid trusting external systems
    correct: false
  explanation: The orchestrator is the invariant owner. It guarantees topological order and cycle-freedom before delivering
    steps. The service trusting that contract is the correct architectural boundary. Re-implementing traversal in every consumer
    duplicates logic and diverges over time.
  difficulty: senior
- q: "You are designing a function that returns a collection of active feature flags. Callers will only ever check whether\
    \ a specific flag is active — they never iterate in order. Which return type best matches the access contract?"
  options:
  - text: frozenset
    correct: true
  - text: list
    correct: false
  - text: tuple
    correct: false
  - text: dict
    correct: false
  explanation: frozenset signals that the collection is unordered, unique, immutable, and optimized for membership checks.
    list and tuple imply ordering that callers do not need. dict implies key-value association where only keys matter, which
    is semantically wrong.
  difficulty: senior
- q: "A service has a hot path that runs a sorted map lookup on every request, but the only operation used is exact key lookup\
    \ by user ID. What should be changed and why?"
  options:
  - text: Replace the sorted map with a hash map; exact lookup does not need ordering and a hash map is O(1) vs O(log n)
    correct: true
  - text: Add an index to the sorted map to speed up lookups
    correct: false
  - text: Pre-sort the user IDs and use binary search on a list instead
    correct: false
  - text: Cache the sorted map in a thread-local so sorting happens only once per thread
    correct: false
  explanation: A sorted map (balanced BST) charges O(log n) per lookup to maintain key order. When callers never query ranges
    or iterate in order, that cost is wasted. A hash map gives O(1) exact lookup with no ordering overhead.
  difficulty: senior
- q: "Which mutation lifecycle requires the least synchronization overhead for a shared in-memory collection?"
  options:
  - text: Built once at startup and then only read (build-once-read-many)
    correct: true
  - text: Rebuilt from a database on every request
    correct: false
  - text: Appended to by multiple threads simultaneously
    correct: false
  - text: Randomly updated by background workers while readers access it
    correct: false
  explanation: Build-once-read-many requires no locking after construction because readers never see concurrent writes. The
    structure can be safely shared across threads without synchronization. All other patterns involve concurrent or repeated
    mutation that requires locks, atomic operations, or copy-on-write strategies.
  difficulty: senior
- q: "A team notices their graph of service dependencies is slow to update and hard to debug. Which two concerns are most\
    \ important to address first at the senior level?"
  options:
  - text: Assign a single owner for the graph and add structured logging on every edge mutation
    correct: true
  - text: Rewrite the graph in a compiled language for speed and add more unit tests
    correct: false
  - text: Switch from an adjacency list to an adjacency matrix for faster edge lookup
    correct: false
  - text: Add a cache in front of the graph so reads are faster
    correct: false
  explanation: Graph bugs are hard to trace because mutations accumulate silently. Assigning an owner establishes accountability
    for invariants. Structured events on edge mutations give observability. A compiled language, matrix format, and caching
    are premature optimizations that do not address the root causes of slow updates and poor debuggability.
  difficulty: senior
---
