---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
questions:
- q: Two users are collaborating on a shared Google Doc nested inside a folder tree. You need the closest shared parent folder
    to build the breadcrumb. Which algorithm identifies it?
  options:
  - text: Lowest common ancestor (LCA)
    correct: true
  - text: Max depth
    correct: false
  - text: Path sum
    correct: false
  - text: Preorder traversal with path tracking
    correct: false
  explanation: LCA finds the nearest node that contains both target nodes in its subtree. In a folder tree, that nearest common
    node is the closest shared parent folder.
  difficulty: principal
- q: A game map is a tree of zones, each with a movement cost. You must check if the player can reach any leaf spending exactly
    their remaining stamina. Which algorithm should you use?
  options:
  - text: hasPathSum
    correct: true
  - text: maxDepth
    correct: false
  - text: Path Sum II
    correct: false
  - text: Inorder traversal
    correct: false
  explanation: hasPathSum checks whether any root-to-leaf path totals the target. It subtracts each visited node cost from
    remaining stamina and returns true only when a leaf exactly matches the remaining value.
  difficulty: principal
- q: A budget tool must find every spending path from company root to a team where the total equals exactly $500k. It must
    return all matching paths. Which algorithm should you use?
  options:
  - text: Path Sum II with backtracking
    correct: true
  - text: hasPathSum boolean check
    correct: false
  - text: maxDepth
    correct: false
  - text: isValidBST
    correct: false
  explanation: Path Sum II collects all root-to-leaf paths whose sum equals the target. Backtracking keeps the current path
    while exploring and removes nodes when returning from recursion.
  difficulty: principal
- q: Two microservices share a dependency graph stored as a tree. You need the closest shared dependency to avoid loading
    it twice. Which algorithm should identify it?
  options:
  - text: Lowest common ancestor (LCA)
    correct: true
  - text: Level order traversal
    correct: false
  - text: Path Sum II
    correct: false
  - text: isValidBST
    correct: false
  explanation: LCA returns the nearest ancestor shared by two nodes. In a dependency tree, that ancestor is the closest shared
    dependency.
  difficulty: principal
- q: Which algorithm is implemented?
  code: "function getSharedParent(root, docA, docB) {\n  if (!root || root === docA || root === docB) return root;\n  const\
    \ left = getSharedParent(root.left, docA, docB);\n  const right = getSharedParent(root.right, docA, docB);\n  if (left\
    \ && right) return root;\n  return left || right;\n}"
  options:
  - text: Lowest common ancestor in a binary tree
    correct: true
  - text: Postorder traversal with return value
    correct: false
  - text: Path Sum II
    correct: false
  - text: Preorder search with path tracking
    correct: false
  explanation: If one target is found in each subtree, the current root is the closest shared ancestor. Otherwise the function
    returns whichever side found a target.
  difficulty: principal
- q: Which algorithm is implemented?
  code: "function canReach(node, budget) {\n  if (!node) return false;\n  if (!node.left && !node.right) return node.val ===\
    \ budget;\n  return canReach(node.left, budget - node.val) ||\n    canReach(node.right, budget - node.val);\n}"
  options:
  - text: Path Sum
    correct: true
  - text: Path Sum II
    correct: false
  - text: Maximum depth
    correct: false
  - text: Validate BST
    correct: false
  explanation: The function subtracts each visited node value and returns a boolean when any root-to-leaf path exactly equals
    the target. It does not collect all paths, so it is Path Sum, not Path Sum II.
  difficulty: principal
- q: Which algorithm is implemented?
  code: "function findRoutes(node, budget, path = [], result = []) {\n  if (!node) return result;\n  path.push(node.val);\n\
    \  if (!node.left && !node.right && node.val === budget) {\n    result.push([...path]);\n  }\n  findRoutes(node.left,\
    \ budget - node.val, path, result);\n  findRoutes(node.right, budget - node.val, path, result);\n  path.pop();\n  return\
    \ result;\n}"
  options:
  - text: Path Sum II with backtracking
    correct: true
  - text: hasPathSum boolean check
    correct: false
  - text: Inorder with path accumulation
    correct: false
  - text: Invert tree
    correct: false
  explanation: The function keeps a mutable `path`, copies it into `result` when a matching leaf is found, then pops when
    unwinding recursion. That push/copy/pop pattern is backtracking.
  difficulty: principal
- q: Which algorithm is implemented?
  code: "function maxStreak(nums) {\n  const lookup = new Set(nums);\n  let best = 0;\n  for (const num of lookup) {\n   \
    \ if (lookup.has(num - 1)) continue;\n    let cursor = num;\n    let length = 1;\n    while (lookup.has(cursor + 1)) {\n\
    \      cursor++;\n      length++;\n    }\n    best = Math.max(best, length);\n  }\n  return best;\n}"
  options:
  - text: Longest consecutive sequence with a hash set
    correct: true
  - text: Two Sum
    correct: false
  - text: Frequency count then scan
    correct: false
  - text: Group Anagrams
    correct: false
  explanation: The set gives expected O(1) membership checks. The key clue is `if (lookup.has(num - 1)) continue`, which skips
    non-start nodes so each sequence is counted once.
  difficulty: principal
- q: Which algorithm is implemented?
  code: "function checkStructure(root) {\n  function getSize(node) {\n    if (!node) return 0;\n    const left = getSize(node.left);\n\
    \    if (left === -1) return -1;\n    const right = getSize(node.right);\n    if (right === -1) return -1;\n    if (Math.abs(left\
    \ - right) > 1) return -1;\n    return 1 + Math.max(left, right);\n  }\n  return getSize(root) !== -1;\n}"
  options:
  - text: Check if a binary tree is height-balanced
    correct: true
  - text: Validate BST using bounds
    correct: false
  - text: Count nodes in subtrees
    correct: false
  - text: Find lowest common ancestor
    correct: false
  explanation: The helper returns subtree height, but uses -1 as a failure sentinel when any subtree is already unbalanced
    or child heights differ by more than 1.
  difficulty: principal
- q: Given an unsorted array of integers, find the length of the longest consecutive sequence such as [1,2,3]. Which algorithm
    should you use?
  options:
  - text: 'Hash set sequence starts: count only when num - 1 is absent'
    correct: true
  - text: Sort and use every value as a sequence start
    correct: false
  - text: Use a stack to reverse the array
    correct: false
  - text: Use LCA
    correct: false
  explanation: 'The key optimization is only starting from sequence heads: numbers where num - 1 is absent. Then count num
    + 1, num + 2, and so on while values exist in the set. This avoids recounting the same sequence.'
  difficulty: principal
---
