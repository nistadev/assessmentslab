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
- q: You need to check whether a username is in a blocked list. The list has thousands of entries and the check runs on every
    request. Which collection type makes the lookup fastest?
  options:
  - text: Set
    correct: true
  - text: List
    correct: false
  - text: Tuple
    correct: false
  - text: Queue
    correct: false
  explanation: A set stores unique values in a hash table, giving O(1) membership checks. A list requires scanning every element,
    which is O(n) and slow for thousands of entries checked on every request.
  difficulty: junior
- q: Which statement correctly describes the difference between a list and a set?
  options:
  - text: A list preserves insertion order and allows duplicates; a set does not preserve order and stores only unique values.
    correct: true
  - text: A list allows only unique values; a set allows duplicates.
    correct: false
  - text: A list gives O(1) membership checks; a set gives O(n).
    correct: false
  - text: A list and a set have identical performance for membership checks.
    correct: false
  explanation: Lists maintain order and permit duplicates. Sets discard ordering and enforce uniqueness, which enables the
    O(1) membership check backed by a hash table.
  difficulty: junior
- q: You are building an undo feature. Each action is recorded and the most recent action must be undone first. Which data
    structure fits this policy?
  options:
  - text: Stack
    correct: true
  - text: Queue
    correct: false
  - text: Set
    correct: false
  - text: Sorted list
    correct: false
  explanation: Undo requires last-in, first-out ordering — the most recent action is the first to be reversed. A stack's
    pop returns the last item pushed, which matches this policy exactly.
  difficulty: junior
- q: A background job system must process tasks in the order they are submitted. Which data structure should hold the pending
    tasks?
  options:
  - text: Queue
    correct: true
  - text: Stack
    correct: false
  - text: Set
    correct: false
  - text: Map
    correct: false
  explanation: First-in, first-out ordering means the earliest submitted job runs first. A queue's dequeue operation removes
    the oldest item, enforcing that order naturally.
  difficulty: junior
- q: "Which operation on a Python list has O(n) time complexity?"
  options:
  - text: Removing an item from the middle
    correct: true
  - text: Appending an item to the end
    correct: false
  - text: Reading an item by index
    correct: false
  - text: Getting the length of the list
    correct: false
  explanation: Removing from the middle requires shifting every element after the removed position. Append, index access, and
    len() are all O(1) amortized or O(1) exactly.
  difficulty: junior
- q: You want to look up a user record by their ID. Which data structure gives you the most direct access?
  options:
  - text: Dictionary (hash map)
    correct: true
  - text: List
    correct: false
  - text: Set
    correct: false
  - text: Stack
    correct: false
  explanation: A dictionary maps each key to a value in O(1) average time. A list would require a linear scan to find the
    matching ID. A set only stores keys with no associated value.
  difficulty: junior
- q: "What does this code print?\n\n```python\nitems = []\nitems.append(1)\nitems.append(2)\nitems.append(3)\nprint(items.pop())\n\
    ```"
  options:
  - text: "3"
    correct: true
  - text: "1"
    correct: false
  - text: "2"
    correct: false
  - text: An error is raised
    correct: false
  explanation: pop() with no argument removes and returns the last element. 3 was the last item appended, so it is returned.
    This is stack (LIFO) behavior.
  difficulty: junior
- q: "What does this code print?\n\n```python\nfrom collections import deque\njobs = deque()\njobs.append('a')\njobs.append('b')\n\
    jobs.append('c')\nprint(jobs.popleft())\n```"
  options:
  - text: a
    correct: true
  - text: c
    correct: false
  - text: b
    correct: false
  - text: An error is raised
    correct: false
  explanation: popleft() removes from the front of the deque. 'a' was appended first so it is at the front. This is queue
    (FIFO) behavior.
  difficulty: junior
- q: Which of the following is the best use case for a Python dictionary?
  options:
  - text: Counting how many times each word appears in a document
    correct: true
  - text: Storing a sequence of log lines in the order they arrived
    correct: false
  - text: Tracking which items have been visited without duplicates
    correct: false
  - text: Processing requests in the order they were received
    correct: false
  explanation: A dictionary maps keys to values, making it ideal for frequency counting (word -> count). Ordered sequences
    belong in a list, uniqueness tracking belongs in a set, and ordered processing belongs in a queue.
  difficulty: junior
- q: You have a list of user IDs and you want to find IDs that appear in both list A and list B. Which approach is most efficient?
  options:
  - text: Convert both lists to sets and use set intersection
    correct: true
  - text: Nest a loop over list B inside a loop over list A
    correct: false
  - text: Sort both lists and scan them in parallel
    correct: false
  - text: Use a dictionary with list A values as keys
    correct: false
  explanation: Converting to sets enables O(n+m) intersection using hash lookups. A nested loop is O(n*m). Sorting both lists
    takes O(n log n + m log m) and adds code complexity. Set intersection is the most direct solution.
  difficulty: junior
- q: When does a dynamic list (Python list) need to copy its internal buffer?
  options:
  - text: When it runs out of space in its backing array
    correct: true
  - text: Every time an item is appended
    correct: false
  - text: When an item is read by index
    correct: false
  - text: When the list is passed to a function
    correct: false
  explanation: A Python list over-allocates a backing array. When that array is full and a new item is appended, the list
    allocates a larger array and copies all existing items. Reads and most appends do not trigger a copy.
  difficulty: junior
- q: Which data structure should you use when you need to store items and guarantee that no item appears more than once?
  options:
  - text: Set
    correct: true
  - text: List
    correct: false
  - text: Queue
    correct: false
  - text: Stack
    correct: false
  explanation: A set enforces uniqueness automatically — adding a duplicate has no effect. A list permits duplicates and would
    require a manual check before each insertion to enforce uniqueness.
  difficulty: junior
- q: A linked list node holds a value and a reference to the next node. What is the time complexity of finding the fifth
    element?
  options:
  - text: O(n) — you must follow pointers from the head
    correct: true
  - text: O(1) — you can jump directly by index
    correct: false
  - text: O(log n) — you can binary-search the list
    correct: false
  - text: O(n log n) — sorting is needed first
    correct: false
  explanation: Linked lists have no index. To reach the fifth element you start at the head and follow four next pointers.
    This is O(n) in the general case. Arrays give O(1) index access because elements sit at known memory offsets.
  difficulty: junior
- q: Where do trees and graphs most commonly appear in everyday application code?
  options:
  - text: Indirectly, inside libraries and frameworks such as databases and build tools
    correct: true
  - text: As the primary data structure in most feature code
    correct: false
  - text: Only in interview problems and academic exercises
    correct: false
  - text: Whenever you use a list or dictionary
    correct: false
  explanation: Everyday application logic mostly uses sequences and maps. Trees and graphs appear in the tools surrounding
    your code — the database's B-tree index, the package manager's dependency graph — not usually in feature code itself.
  difficulty: junior
- q: You are choosing between storing a collection as a list or a set. Which question most directly determines the right
    choice?
  options:
  - text: Do you need to check membership, or do you need to access items by position?
    correct: true
  - text: Is the collection larger than 100 items?
    correct: false
  - text: Will the collection ever be empty?
    correct: false
  - text: Are the items strings or integers?
    correct: false
  explanation: The core trade-off is access pattern. Sets give O(1) membership checks but no positional access. Lists give
    O(1) index access but O(n) membership checks. Collection size, emptiness, and item type do not determine the choice.
  difficulty: junior
- q: "What is the output of this code?\n\n```python\nblocked = {'ana', 'lee'}\nprint('ana' in blocked)\nprint('sam' in blocked)\n\
    ```"
  options:
  - text: "True\nFalse"
    correct: true
  - text: "False\nTrue"
    correct: false
  - text: "True\nTrue"
    correct: false
  - text: An error is raised
    correct: false
  explanation: "'ana' is in the set so the first check is True. 'sam' is not in the set so the second check is False. Set\
    \ membership with `in` is O(1)."
  difficulty: junior
---
