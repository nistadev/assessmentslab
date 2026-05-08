---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
questions:
- q: A task manager has nested tasks. To delete a project you must delete all subtasks before the parent task or you lose
    references. Which traversal should you use?
  options:
  - text: Postorder traversal
    correct: true
  - text: Preorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  - text: Level order traversal
    correct: false
  explanation: Postorder processes children before the parent. That is the safe shape for deletion, cleanup, and dependency
    teardown because dependent child nodes are handled before the node that owns them.
  difficulty: mid
- q: A SaaS app limits free users to 3 levels of nested folders. Before allowing a new folder, you need to validate the current
    nesting depth. Which algorithm should you use?
  options:
  - text: maxDepth
    correct: true
  - text: hasPathSum
    correct: false
  - text: Invert tree
    correct: false
  - text: Inorder traversal
    correct: false
  explanation: maxDepth measures the longest path from the root to a leaf. Comparing that depth to the product limit tells
    you whether adding another nested folder would break the rule.
  difficulty: mid
- q: A CI/CD pipeline must execute jobs in dependency order, where no job runs before its dependencies are done. Return the
    execution order. Which tree traversal matches this?
  options:
  - text: Postorder traversal
    correct: true
  - text: Preorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  - text: Level order traversal
    correct: false
  explanation: Postorder returns children before parent. If dependencies are children and the job is the parent, postorder
    gives dependency-first execution.
  difficulty: mid
- q: A meditation app has a session tree where each session branches into deeper sessions. You need the longest possible session
    chain. Which algorithm should you use?
  options:
  - text: maxDepth
    correct: true
  - text: hasPathSum
    correct: false
  - text: Lowest common ancestor
    correct: false
  - text: isValidBST
    correct: false
  explanation: maxDepth returns the length of the longest root-to-leaf path. That is the longest possible chain through the
    session tree.
  difficulty: mid
- q: A webpack-like bundler processes modules. Each module can only be bundled after all imported modules are bundled first.
    Which traversal matches this dependency rule?
  options:
  - text: Postorder traversal
    correct: true
  - text: Preorder traversal
    correct: false
  - text: Level order traversal
    correct: false
  - text: Inorder traversal
    correct: false
  explanation: Postorder handles children before parent. If imported modules are children, they are bundled before the module
    that imports them.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function walk(node, out = []) {\n  if (!node) return out;\n  walk(node.left, out);\n  walk(node.right, out);\n  out.push(node.val);\n\
    \  return out;\n}"
  options:
  - text: Postorder traversal
    correct: true
  - text: Preorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  - text: Level order traversal
    correct: false
  explanation: The node is processed after both children. That left-right-root order is postorder, useful for deleting trees
    or resolving dependencies before dependents.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function groupByRow(root) {\n  if (!root) return [];\n  const result = [];\n  const pending = [root];\n  while (pending.length)\
    \ {\n    const size = pending.length;\n    const row = [];\n    for (let i = 0; i < size; i++) {\n      const node = pending.shift();\n\
    \      row.push(node.val);\n      if (node.left) pending.push(node.left);\n      if (node.right) pending.push(node.right);\n\
    \    }\n    result.push(row);\n  }\n  return result;\n}"
  options:
  - text: Level order traversal grouped by depth
    correct: true
  - text: Level order traversal (BFS, flat list)
    correct: false
  - text: Preorder traversal
    correct: false
  - text: Postorder traversal
    correct: false
  explanation: The queue gives BFS, and the `size` snapshot separates the nodes already in the queue for this depth from children
    added for the next depth.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function longestPath(node) {\n  if (!node) return 0;\n  return 1 + Math.max(longestPath(node.left), longestPath(node.right));\n\
    }"
  options:
  - text: Maximum depth of a binary tree
    correct: true
  - text: Minimum depth of a binary tree
    correct: false
  - text: Check if a binary tree is height-balanced
    correct: false
  - text: Invert tree
    correct: false
  explanation: The function returns 0 for null and 1 plus the larger child depth for real nodes. That computes the longest
    root-to-leaf depth.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function findPair(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const\
    \ complement = target - nums[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(nums[i],\
    \ i);\n  }\n  return null;\n}"
  options:
  - text: Two Sum with a hash map
    correct: true
  - text: Two Sum with sorting and two pointers
    correct: false
  - text: Sliding window
    correct: false
  - text: Hash set intersection
    correct: false
  explanation: For each number, the code checks whether the complement has already been seen. The map stores value to index,
    making lookups expected O(1).
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function clusterWords(words) {\n  const groups = new Map();\n  for (const word of words) {\n    const key = word.split('').sort().join('');\n\
    \    const list = groups.get(key) ?? [];\n    list.push(word);\n    groups.set(key, list);\n  }\n  return [...groups.values()];\n\
    }"
  options:
  - text: Group Anagrams
    correct: true
  - text: Longest consecutive sequence
    correct: false
  - text: Two Sum
    correct: false
  - text: Frequency count per word
    correct: false
  explanation: Each word is converted to a sorted-letter signature. Anagrams share the same signature, so the map groups them
    into the same bucket.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function isClosed(s) {\n  const stack = [];\n  const matching = { ')': '(', ']': '[', '}': '{' };\n  for (const ch\
    \ of s) {\n    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);\n    else if (stack.pop() !== matching[ch])\
    \ return false;\n  }\n  return stack.length === 0;\n}"
  options:
  - text: Valid parentheses using a stack
    correct: true
  - text: Balanced bracket counter using recursion
    correct: false
  - text: Stack-based reverse scan
    correct: false
  - text: Binary search
    correct: false
  explanation: Opening brackets are pushed, and closing brackets must match the most recent opening bracket. That nested last-in,
    first-out matching is the stack clue.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function flipOrder(head) {\n  let behind = null;\n  let cursor = head;\n  while (cursor) {\n    const next = cursor.next;\n\
    \    cursor.next = behind;\n    behind = cursor;\n    cursor = next;\n  }\n  return behind;\n}"
  options:
  - text: Reverse a singly linked list
    correct: true
  - text: Detect a cycle using two pointers
    correct: false
  - text: Merge two sorted lists
    correct: false
  - text: Remove nth node from end
    correct: false
  explanation: The code walks the list once and flips each `next` pointer to the previous node. Returning `behind` gives the
    old tail as the new head.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function splitPoint(head) {\n  let a = head;\n  let b = head;\n  while (b && b.next) {\n    a = a.next;\n    b =\
    \ b.next.next;\n  }\n  return a;\n}"
  options:
  - text: Find middle node with slow and fast pointers
    correct: true
  - text: Detect a cycle using two pointers
    correct: false
  - text: Find kth node from end using two pointers
    correct: false
  - text: Reverse linked list
    correct: false
  explanation: Fast advances twice as quickly as slow. When fast reaches the end, slow is at the middle.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function spreadFrom(graph, start) {\n  const visited = new Set([start]);\n  const frontier = [start];\n  const result\
    \ = [];\n  while (frontier.length) {\n    const node = frontier.shift();\n    result.push(node);\n    for (const next\
    \ of graph.get(node) ?? []) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        frontier.push(next);\n\
    \      }\n    }\n  }\n  return result;\n}"
  options:
  - text: Breadth-first search on a graph
    correct: true
  - text: Iterative DFS using an explicit stack
    correct: false
  - text: Depth-first search
    correct: false
  - text: Topological sort
    correct: false
  explanation: The queue processes nodes in FIFO order, and the seen set prevents revisiting. That is breadth-first search
    over an adjacency list.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function deepScan(graph, start, visited = new Set(), result = []) {\n  if (visited.has(start)) return result;\n \
    \ visited.add(start);\n  result.push(start);\n  for (const next of graph.get(start) ?? []) {\n    deepScan(graph, next,\
    \ visited, result);\n  }\n  return result;\n}"
  options:
  - text: Depth-first search on a graph
    correct: true
  - text: Breadth-first search
    correct: false
  - text: Iterative BFS using a queue
    correct: false
  - text: Topological sort via DFS
    correct: false
  explanation: The recursive call explores each neighbor before returning to try the next neighbor. That deep recursive exploration
    identifies DFS.
  difficulty: mid
- q: Which algorithm is implemented?
  code: "function topItems(nums, k) {\n  const freq = new Map();\n  for (const num of nums) freq.set(num, (freq.get(num) ??\
    \ 0) + 1);\n  return [...freq.entries()]\n    .sort((a, b) => b[1] - a[1])\n    .slice(0, k)\n    .map(([num]) => num);\n\
    }"
  options:
  - text: Top K frequent elements using a frequency map
    correct: true
  - text: Top K with a min heap
    correct: false
  - text: Top K with bucket sort by frequency
    correct: false
  - text: Binary search
    correct: false
  explanation: The map counts how often each value appears, then entries are sorted by count and the first k keys are returned.
    The core algorithmic pattern is frequency counting plus top-k selection.
  difficulty: mid
- q: Given an array of integers and a target, find the two indexes whose values add up to the target. The solution must be
    O(n). Which algorithm should you use?
  options:
  - text: Two Sum with a hash map storing value to index
    correct: true
  - text: Nested loops over every pair
    correct: false
  - text: Sort the array and use two pointers
    correct: false
  - text: Binary search without preprocessing
    correct: false
  explanation: Two Sum uses a hash map from value to index. For each number, compute target - value and check if that complement
    already exists. This gives O(n) time because each lookup is expected O(1).
  difficulty: mid
- q: Given an array of strings, group all words that are anagrams of each other. Which algorithm should you use?
  options:
  - text: Group Anagrams using a signature map
    correct: true
  - text: Two-pass frequency sort per word
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Hash map grouping by sorted characters
    correct: false
  explanation: Group Anagrams maps a canonical signature to an array of words. Sorting each word's letters makes anagrams
    share the same key, such as 'ate', 'eat', and 'tea' all mapping to 'aet'.
  difficulty: mid
- q: Given a list of words, return the most frequently used word excluding a list of banned words. Which algorithmic approach
    should you use?
  options:
  - text: Frequency count words while skipping banned words, then return the highest count
    correct: true
  - text: Sort banned words only
    correct: false
  - text: Use inorder traversal
    correct: false
  - text: Use a queue and keep only the last word
    correct: false
  explanation: Put banned words in a Set for fast exclusion, then count allowed words in a hash map. Track the highest count
    or scan the map afterward to return the most frequent allowed word.
  difficulty: mid
---
