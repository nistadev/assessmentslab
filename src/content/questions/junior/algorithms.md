---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
questions:
- q: You have a BST of product prices. A customer wants to see all products listed from cheapest to most expensive. Which
    algorithm should you use?
  options:
  - text: Inorder traversal
    correct: true
  - text: Preorder traversal
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Level order traversal
    correct: false
  explanation: In a BST, inorder traversal visits left subtree, node, then right subtree. Because left values are smaller
    and right values are larger, this produces sorted output without an extra sort.
  difficulty: junior
- q: 'An org chart UI needs to render each management level in a different color: CEO row first, VP row second, director row
    third. Which algorithm should you use?'
  options:
  - text: Level order traversal (BFS)
    correct: true
  - text: Inorder traversal
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Preorder traversal
    correct: false
  explanation: Level order traversal uses BFS to process nodes by depth. It naturally gives grouped rows like level 0, level
    1, and level 2, which maps directly to row-based UI rendering.
  difficulty: junior
- q: A presentation tool needs a mirror layout button that flips the entire slide tree left to right for RTL display. Which
    algorithm should you use?
  options:
  - text: Invert tree
    correct: true
  - text: Level order traversal
    correct: false
  - text: Lowest common ancestor
    correct: false
  - text: Validate BST
    correct: false
  explanation: Invert tree recursively swaps left and right children at every node. Doing that for the whole slide hierarchy
    produces the mirrored layout.
  difficulty: junior
- q: A file explorer needs to display all files alphabetically. Files are stored in a BST keyed by filename. Which algorithm
    should you use?
  options:
  - text: Inorder traversal
    correct: true
  - text: Level order traversal
    correct: false
  - text: Preorder traversal
    correct: false
  - text: Postorder traversal
    correct: false
  explanation: For a BST keyed by filename, inorder traversal visits keys in sorted order. That makes it a direct fit for
    alphabetical display.
  difficulty: junior
- q: A legal compliance tool needs to audit pages starting from highest priority root down, level by level. Which algorithm
    should you use?
  options:
  - text: Level order traversal (BFS)
    correct: true
  - text: Postorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  - text: Preorder traversal
    correct: false
  explanation: Level order traversal processes the root first, then every node one depth level lower, and so on. That exactly
    matches top-down priority auditing.
  difficulty: junior
- q: A chat app has threaded conversations stored as a tree. Display replies grouped by depth, with each depth shown together.
    Which algorithm should you use?
  options:
  - text: Level order traversal (BFS)
    correct: true
  - text: Postorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  - text: hasPathSum
    correct: false
  explanation: Level order traversal groups nodes by depth using a queue. That makes it fit threaded views where all replies
    at the same depth are rendered together.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function walk(node, out = []) {\n  if (!node) return out;\n  walk(node.left, out);\n  out.push(node.val);\n  walk(node.right,\
    \ out);\n  return out;\n}"
  options:
  - text: Inorder traversal
    correct: true
  - text: Preorder traversal
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Reverse inorder traversal
    correct: false
  explanation: The order is left subtree, current node, then right subtree. That is inorder traversal. On a BST, this returns
    values in sorted order.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function walk(node, out = []) {\n  if (!node) return out;\n  out.push(node.val);\n  walk(node.left, out);\n  walk(node.right,\
    \ out);\n  return out;\n}"
  options:
  - text: Preorder traversal
    correct: true
  - text: Inorder traversal
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Reverse preorder traversal
    correct: false
  explanation: The current node is processed before both children. That root-left-right order is preorder traversal, commonly
    used when cloning or serializing a tree.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function collectAll(root) {\n  if (!root) return [];\n  const result = [];\n  const pending = [root];\n  while (pending.length)\
    \ {\n    const node = pending.shift();\n    result.push(node.val);\n    if (node.left) pending.push(node.left);\n    if\
    \ (node.right) pending.push(node.right);\n  }\n  return result;\n}"
  options:
  - text: Level order traversal (BFS)
    correct: true
  - text: Depth-first search preorder
    correct: false
  - text: Postorder traversal
    correct: false
  - text: Inorder traversal
    correct: false
  explanation: A queue is used to process the current node, then enqueue its children. That FIFO behavior visits nodes breadth-first,
    one level at a time.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function swapChildren(node) {\n  if (!node) return null;\n  const left = swapChildren(node.left);\n  const right\
    \ = swapChildren(node.right);\n  node.left = right;\n  node.right = left;\n  return node;\n}"
  options:
  - text: Invert binary tree
    correct: true
  - text: Validate BST
    correct: false
  - text: Lowest common ancestor
    correct: false
  - text: Postorder tree clone
    correct: false
  explanation: The recursive calls process both subtrees, then assign the right result to `left` and the left result to `right`.
    That swaps children at every node, producing a mirror tree.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function firstSingleton(s) {\n  const count = new Map();\n  for (const ch of s) count.set(ch, (count.get(ch) ?? 0)\
    \ + 1);\n  for (let i = 0; i < s.length; i++) {\n    if (count.get(s[i]) === 1) return i;\n  }\n  return -1;\n}"
  options:
  - text: First unique character using frequency count
    correct: true
  - text: Longest substring without repeats
    correct: false
  - text: Two Sum
    correct: false
  - text: Sliding window with a set
    correct: false
  explanation: The first pass builds character counts. The second pass preserves original string order and returns the first
    index whose count is exactly 1.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function commonValues(a, b) {\n  const registry = new Set(a);\n  const common = new Set();\n  for (const value of\
    \ b) {\n    if (registry.has(value)) common.add(value);\n  }\n  return [...common];\n}"
  options:
  - text: Hash set intersection
    correct: true
  - text: Two Sum complement lookup
    correct: false
  - text: Sorting both arrays and merging
    correct: false
  - text: Frequency count intersection
    correct: false
  explanation: The first set stores values from one array. The second loop checks membership and records shared values, which
    is the standard hash set intersection pattern.
  difficulty: junior
- q: Which algorithm is implemented?
  code: "function locate(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n   \
    \ const pivot = Math.floor((left + right) / 2);\n    if (nums[pivot] === target) return pivot;\n    if (nums[pivot] <\
    \ target) left = pivot + 1;\n    else right = pivot - 1;\n  }\n  return -1;\n}"
  options:
  - text: Binary search
    correct: true
  - text: Jump search on sorted array
    correct: false
  - text: Interpolation search
    correct: false
  - text: Linear search
    correct: false
  explanation: The code keeps left and right bounds and cuts the search space in half after each comparison. That is binary
    search on a sorted array.
  difficulty: junior
- q: Given a string, find the first character that appears only once. Which algorithmic approach should you use?
  options:
  - text: Frequency count, then scan for the first count of 1
    correct: true
  - text: Sort the string and return the first different character
    correct: false
  - text: Use a stack and pop duplicates
    correct: false
  - text: Use binary search on characters
    correct: false
  explanation: A frequency map stores char -> count. The second scan preserves original order, so the first character whose
    count is 1 is the correct answer.
  difficulty: junior
- q: Given an array, find the element that appears more than n/2 times. Which algorithmic approach works?
  options:
  - text: Frequency count and return the first value whose count is greater than n/2
    correct: true
  - text: Use level order traversal
    correct: false
  - text: Use a queue and remove pairs blindly
    correct: false
  - text: Return the first element because majority is guaranteed
    correct: false
  explanation: Frequency counting maps value -> count. As counts increase, any value crossing n/2 is the majority element.
    This is straightforward O(n) time and O(n) space.
  difficulty: junior
- q: Given two arrays, return the values that appear in both. Which algorithm should you use?
  options:
  - text: Hash set intersection
    correct: true
  - text: Sorting both arrays then scanning
    correct: false
  - text: Two Sum complement lookup
    correct: false
  - text: String serialization
    correct: false
  explanation: Store values from the first array in a Set, then iterate the second array and check Set.has(value). Set lookup
    is expected O(1), which avoids a nested O(n*m) scan.
  difficulty: junior
- q: Given an array of integers, check if any value appears at least twice. Which algorithmic approach is most direct?
  options:
  - text: Use a hash set and return true when a value is already present
    correct: true
  - text: Use maxDepth
    correct: false
  - text: Use binary search on the unsorted array
    correct: false
  - text: Use preorder traversal
    correct: false
  explanation: A hash set tracks values already seen. If the current value is already in the set, a duplicate exists and the
    function can return true immediately.
  difficulty: junior
---
