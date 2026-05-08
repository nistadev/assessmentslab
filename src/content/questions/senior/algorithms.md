---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
questions:
- q: You need to save a component tree to localStorage and restore it exactly on next load. Which algorithm fits best?
  options:
  - text: Preorder serialize/deserialize
    correct: true
  - text: Inorder traversal only
    correct: false
  - text: Postorder without null markers
    correct: false
  - text: Postorder serialize/deserialize
    correct: false
  explanation: Preorder writes the root before its children, so deserialization knows what node to create first and can recursively
    rebuild children. For a general binary tree, null markers are still needed to preserve exact shape.
  difficulty: senior
- q: A role hierarchy is stored as a BST by permission level. Before deploying, verify no role was inserted in the wrong position.
    Which algorithm should you use?
  options:
  - text: isValidBST
    correct: true
  - text: maxDepth
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Level order traversal
    correct: false
  explanation: isValidBST validates the global BST rule by carrying min and max bounds down the tree. Checking only immediate
    children can miss invalid descendants.
  difficulty: senior
- q: You are building a diff tool. Before comparing two trees, you need to send one over a network as a string and rebuild
    it on the other side. Which algorithm should you use?
  options:
  - text: Preorder serialize/deserialize
    correct: true
  - text: Inorder traversal without nulls
    correct: false
  - text: maxDepth
    correct: false
  - text: Invert tree
    correct: false
  explanation: Preorder serialization sends root before subtrees, so the receiver can rebuild from the same root-first structure.
    For exact reconstruction of a general tree, include null markers.
  difficulty: senior
- q: A permission system stores roles as a BST by access level. You need all roles between level 3 and level 7. Which algorithm
    should you use?
  options:
  - text: Inorder traversal with range filtering
    correct: true
  - text: Level order traversal only
    correct: false
  - text: Invert tree
    correct: false
  - text: maxDepth
    correct: false
  explanation: Inorder walks a BST in sorted order. With range bounds, you can skip subtrees outside the range and collect
    only roles between levels 3 and 7.
  difficulty: senior
- q: A Figma-like tool clones an entire component tree to create a duplicate frame. The clone must preserve exact hierarchy.
    Which traversal is the natural fit?
  options:
  - text: Preorder traversal
    correct: true
  - text: Postorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  - text: Lowest common ancestor
    correct: false
  explanation: Preorder creates or visits the root first, then recursively handles children. That is natural for cloning because
    parent nodes must exist before child clones can attach to them.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function withinBounds(node, min = -Infinity, max = Infinity) {\n  if (!node) return true;\n  if (node.val <= min\
    \ || node.val >= max) return false;\n  return withinBounds(node.left, min, node.val) &&\n    withinBounds(node.right,\
    \ node.val, max);\n}"
  options:
  - text: Validate Binary Search Tree
    correct: true
  - text: Check if a binary tree is height-balanced
    correct: false
  - text: Lowest common ancestor
    correct: false
  - text: Level order traversal
    correct: false
  explanation: The min and max bounds enforce global BST constraints across all descendants, not only immediate parent-child
    comparisons.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function encode(node) {\n  if (!node) return ['#'];\n  return [\n    String(node.val),\n    ...encode(node.left),\n\
    \    ...encode(node.right)\n  ];\n}"
  options:
  - text: Preorder serialization with null markers
    correct: true
  - text: Postorder serialization with null markers
    correct: false
  - text: Inorder traversal without null markers
    correct: false
  - text: Level order traversal
    correct: false
  explanation: The node value is emitted before left and right children, so this is preorder. The `#` null markers preserve
    tree shape for exact deserialization.
  difficulty: senior
- q: Which algorithmic pattern is this?
  code: "function copyNode(node) {\n  if (!node) return null;\n  const duplicate = new TreeNode(node.val);\n  duplicate.left\
    \ = copyNode(node.left);\n  duplicate.right = copyNode(node.right);\n  return duplicate;\n}"
  options:
  - text: Preorder tree clone
    correct: true
  - text: Postorder tree clone
    correct: false
  - text: Inorder tree clone
    correct: false
  - text: BST range query
    correct: false
  explanation: The copy node is created before its children are cloned, then child copies attach to it. That is a preorder-style
    recursive clone.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function queryAccess(node, minLevel, maxLevel, out = []) {\n  if (!node) return out;\n  if (node.val > minLevel)\
    \ queryAccess(node.left, minLevel, maxLevel, out);\n  if (node.val >= minLevel && node.val <= maxLevel) out.push(node.val);\n\
    \  if (node.val < maxLevel) queryAccess(node.right, minLevel, maxLevel, out);\n  return out;\n}"
  options:
  - text: BST range query using inorder pruning
    correct: true
  - text: Inorder traversal only (no pruning)
    correct: false
  - text: Level order traversal
    correct: false
  - text: BFS range scan
    correct: false
  explanation: The function uses BST ordering to skip impossible subtrees and visits values in inorder position. It collects
    only nodes inside the low-to-high range.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function maxWindow(s) {\n  const lastIndex = new Map();\n  let left = 0;\n  let maxLen = 0;\n  for (let right = 0;\
    \ right < s.length; right++) {\n    const prev = lastIndex.get(s[right]);\n    if (prev !== undefined && prev >= left)\
    \ left = prev + 1;\n    lastIndex.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return\
    \ maxLen;\n}"
  options:
  - text: Longest substring without repeating characters
    correct: true
  - text: Group Anagrams
    correct: false
  - text: First unique character
    correct: false
  - text: Two-pointer without a map
    correct: false
  explanation: This is sliding window with a last-seen map. The left pointer jumps past duplicates inside the current window,
    while `maxLen` tracks the longest valid window.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function isCircular(head) {\n  let a = head;\n  let b = head;\n  while (b && b.next) {\n    a = a.next;\n    b =\
    \ b.next.next;\n    if (a === b) return true;\n  }\n  return false;\n}"
  options:
  - text: Floyd's cycle detection
    correct: true
  - text: Find middle of linked list using two pointers
    correct: false
  - text: Find intersection of two lists using length difference
    correct: false
  - text: Remove nth node from end
    correct: false
  explanation: The fast pointer moves two steps while the slow pointer moves one. If there is a cycle, they eventually meet.
    This is Floyd's tortoise and hare algorithm.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function joinSorted(listA, listB) {\n  const sentinel = { next: null };\n  let cursor = sentinel;\n  while (listA\
    \ && listB) {\n    if (listA.val <= listB.val) {\n      cursor.next = listA;\n      listA = listA.next;\n    } else {\n\
    \      cursor.next = listB;\n      listB = listB.next;\n    }\n    cursor = cursor.next;\n  }\n  cursor.next = listA ||\
    \ listB;\n  return sentinel.next;\n}"
  options:
  - text: Merge two sorted linked lists
    correct: true
  - text: Reverse a linked list
    correct: false
  - text: Detect a cycle
    correct: false
  - text: Remove duplicates from sorted list
    correct: false
  explanation: The dummy head and tail pointer build a sorted chain by repeatedly taking the smaller current node from either
    list.
  difficulty: senior
- q: Which algorithm is implemented?
  code: "function nthSmallest(root, k) {\n  const trail = [];\n  let node = root;\n  while (trail.length || node) {\n    while\
    \ (node) {\n      trail.push(node);\n      node = node.left;\n    }\n    node = trail.pop();\n    if (--k === 0) return\
    \ node.val;\n    node = node.right;\n  }\n}"
  options:
  - text: Find kth smallest value using iterative inorder traversal
    correct: true
  - text: Find kth smallest using a min heap
    correct: false
  - text: Find kth largest using a max heap
    correct: false
  - text: Binary search on value range
    correct: false
  explanation: The stack walks to the leftmost node first, then visits nodes in inorder sorted order. Decrementing k on each
    visit returns the kth smallest BST value.
  difficulty: senior
- q: Given a string, find the longest substring without repeating characters. Which algorithmic pattern should you use?
  options:
  - text: Sliding window with a hash map storing character to last seen index
    correct: true
  - text: Frequency count of the whole string only
    correct: false
  - text: Sort the characters first
    correct: false
  - text: Depth-first search
    correct: false
  explanation: Sliding window expands right while tracking last seen indexes. When a duplicate appears inside the current
    window, move left past the previous index. This preserves O(n) time.
  difficulty: senior
- q: Given a list of transactions, find all pairs of transactions that cancel each other out by summing to zero. Which algorithm
    should you adapt?
  options:
  - text: Two Sum variation checking each value's negative
    correct: true
  - text: Inorder traversal
    correct: false
  - text: Topological sort
    correct: false
  - text: Max depth
    correct: false
  explanation: This is a Two Sum variation where the target is zero. Store values or indexes in a hash map, and for each transaction
    x, check whether -x has already appeared.
  difficulty: senior
---
