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
---
