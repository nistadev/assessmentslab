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
---
