---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
questions:
- q: Which data structure is implemented?
  code: "class ComponentTracker {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n  }\n  getRoot(x)\
    \ {\n    if (this.parent[x] !== x) this.parent[x] = this.getRoot(this.parent[x]);\n    return this.parent[x];\n  }\n \
    \ connect(a, b) {\n    this.parent[this.getRoot(a)] = this.getRoot(b);\n  }\n}"
  options:
  - text: Union-find / disjoint set
    correct: true
  - text: Bloom filter
    correct: false
  - text: Min heap
    correct: false
  - text: Adjacency list
    correct: false
  explanation: '`getRoot` returns the representative parent and compresses paths. `connect` merges two sets by representative.
    That is disjoint set union.'
  difficulty: principal
- q: Which data structure behavior is implemented?
  code: "class BoundedCache {\n  constructor(limit) {\n    this.limit = limit;\n    this.map = new Map();\n  }\n  get(key)\
    \ {\n    if (!this.map.has(key)) return -1;\n    const value = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key,\
    \ value);\n    return value;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key,\
    \ value);\n    if (this.map.size > this.limit) {\n      this.map.delete(this.map.keys().next().value);\n    }\n  }\n}"
  options:
  - text: LRU cache
    correct: true
  - text: MRU cache (most-recently-used eviction)
    correct: false
  - text: Bounded FIFO queue
    correct: false
  - text: Min heap with key-value pairs
    correct: false
  explanation: The map preserves insertion order. Accessed keys are deleted and reinserted as most recent, and the oldest
    key is evicted when capacity is exceeded.
  difficulty: principal
- q: Which probabilistic data structure is implemented?
  code: "class PresenceFilter {\n  markers = new Set();\n  digest(value) {\n    return [value.length % 10, value.charCodeAt(0)\
    \ % 10];\n  }\n  add(value) {\n    for (const h of this.digest(value)) this.markers.add(h);\n  }\n  mightContain(value)\
    \ {\n    return this.digest(value).every(h => this.markers.has(h));\n  }\n}"
  options:
  - text: Bloom filter
    correct: true
  - text: Count-min sketch
    correct: false
  - text: Cuckoo filter
    correct: false
  - text: LRU cache
    correct: false
  explanation: Multiple hashes mark positions on insert, and lookup checks whether all hash positions are present. That can
    produce false positives, which is the key Bloom filter tradeoff.
  difficulty: principal
---
