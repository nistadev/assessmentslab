---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
questions:
- q: Which data structure is implemented?
  code: "class HistoryBuffer {\n  items = [];\n  add(value) {\n    this.items.push(value);\n  }\n  remove() {\n    return\
    \ this.items.pop();\n  }\n  peek() {\n    return this.items[this.items.length - 1];\n  }\n}"
  options:
  - text: Stack
    correct: true
  - text: Queue
    correct: false
  - text: Deque
    correct: false
  - text: Priority queue
    correct: false
  explanation: Both insertion and removal happen at the same end of the array. That last-in, first-out behavior identifies
    a stack.
  difficulty: junior
- q: Which data structure is implemented?
  code: "class TaskLine {\n  items = [];\n  add(value) {\n    this.items.push(value);\n  }\n  remove() {\n    return this.items.shift();\n\
    \  }\n}"
  options:
  - text: Queue
    correct: true
  - text: Stack
    correct: false
  - text: Deque
    correct: false
  - text: Circular queue
    correct: false
  explanation: Values enter at the back with `push` and leave from the front with `shift`. That first-in, first-out behavior
    identifies a queue.
  difficulty: junior
- q: Which data structure is implemented?
  code: "class StepNode {\n  constructor(value, next = null) {\n    this.value = value;\n    this.next = next;\n  }\n}\nclass\
    \ ChainList {\n  head = null;\n  addFirst(value) {\n    this.head = new StepNode(value, this.head);\n  }\n}"
  options:
  - text: Singly linked list
    correct: true
  - text: Doubly linked list
    correct: false
  - text: Circular linked list
    correct: false
  - text: Stack backed by an array
    correct: false
  explanation: Each node stores a value and one `next` pointer. There is no `prev` pointer, so this is a singly linked list.
  difficulty: junior
- q: Which data structure is represented?
  code: "class ItemNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n\
    \  }\n}"
  options:
  - text: Binary tree node
    correct: true
  - text: Trie node
    correct: false
  - text: N-ary tree node
    correct: false
  - text: Heap node
    correct: false
  explanation: The node has at most two child references named `left` and `right`. That is the basic node shape for a binary
    tree.
  difficulty: junior
---
