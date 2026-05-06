---
category: "Data Structures"
questions:
  - q: |
      // Binary tree:
      //       4
      //      / \
      //     2   6
      //    / \   \
      //   1   3   7

      function traverse(node) {
        if (!node) return [];
        return [...traverse(node.left), node.val, ...traverse(node.right)];
      }
      // What does traverse(root) return?
    options:
      - text: "[4, 2, 1, 3, 6, 7]"
        correct: false
      - text: "[1, 2, 3, 4, 6, 7]"
        correct: true
      - text: "[1, 3, 2, 7, 6, 4]"
        correct: false
      - text: "[[4], [2, 6], [1, 3, 7]]"
        correct: false
    explanation: "This is inorder traversal: left -> node -> right. For a BST, inorder always produces sorted order. The pattern: go all the way left first (1), visit node (2), then right child (3), back up to root (4), skip empty left of 6, visit 6, then right (7). Used to get a BST in sorted order without extra sorting."
    difficulty: "junior"
    isCode: true

  - q: |
      function maxDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
      }
      // Tree:
      //       4
      //      / \
      //     2   6
      //    /
      //   1
      // What does maxDepth(root) return?
    options:
      - text: "2"
        correct: false
      - text: "3"
        correct: true
      - text: "4"
        correct: false
      - text: "1"
        correct: false
    explanation: "maxDepth returns 1 + max of children depths. Node 1 has no children: depth 0. Node 2 has one child (1): 1 + max(1, 0) = 2. Node 6 has no children: depth 0. Root 4: 1 + max(2, 1) = 3. Mental model: depth of a null node is 0, depth of a leaf is 1, depth of any node is 1 plus its tallest subtree."
    difficulty: "mid"
    isCode: true

  - q: |
      function isValidBST(node, min = -Infinity, max = Infinity) {
        if (!node) return true;
        if (node.val <= min || node.val >= max) return false;
        return isValidBST(node.left, min, node.val) &&
               isValidBST(node.right, node.val, max);
      }
      // Tree:
      //     5
      //    / \
      //   1   4
      //      / \
      //     3   6
      // Is this a valid BST?
    options:
      - text: "Yes -- each node is greater than its left child and less than its right child"
        correct: false
      - text: "No -- 4 is in the right subtree of 5 but 4 < 5, violating the BST property"
        correct: true
      - text: "Yes -- 3 < 4 < 6 so the right subtree is valid"
        correct: false
      - text: "No -- 3 is less than 5 but appears in the right subtree"
        correct: false
    explanation: "The common wrong approach: only check node vs immediate children. That misses the global constraint. When validating the right subtree of 5, every node must be > 5. Node 4 fails that -- it is in the right subtree of 5 but 4 < 5. The bounds propagate down: isValidBST(4, 5, Infinity) -> 4 <= 5 = false. The bound-passing approach catches this."
    difficulty: "senior"
    isCode: true

  - q: |
      function lca(root, p, q) {
        if (!root || root === p || root === q) return root;
        const left = lca(root.left, p, q);
        const right = lca(root.right, p, q);
        if (left && right) return root;
        return left || right;
      }
      // Tree:
      //       6
      //      / \
      //     2   8
      //    / \
      //   0   4
      // lca(root, node2, node4) returns?
    options:
      - text: "node6 (the root)"
        correct: false
      - text: "node2"
        correct: true
      - text: "node0"
        correct: false
      - text: "node4"
        correct: false
    explanation: "LCA(6, 2, 4): node6 is not p or q, recurse both sides. Left: LCA(2, 2, 4) -- node2 === p, return node2. Right: LCA(8, 2, 4) -- neither found, return null. Back at root: left=node2, right=null. Since only left returned something: return left (node2). Node2 is the LCA because both 2 and 4 are in its subtree."
    difficulty: "principal"
    isCode: true

  - q: |
      function invertTree(node) {
        if (!node) return null;
        [node.left, node.right] = [
          invertTree(node.right),
          invertTree(node.left)
        ];
        return node;
      }
      // Tree before:
      //     4
      //    / \
      //   2   7
      //  / \ / \
      // 1  3 6  9
      // What is the tree after invertTree(root)?
    options:
      - text: "Same tree -- recursive swap cancels itself"
        correct: false
      - text: "Mirror image: root=4, left=7(9,6), right=2(3,1)"
        correct: true
      - text: "Reversed level order: 9,6,3,1,7,2,4"
        correct: false
      - text: "Error -- you cannot destructure assignments in a tree"
        correct: false
    explanation: "Invert recursively swaps left and right at every node bottom-up. Leaves have no children so nothing to swap. Node 2: left=3, right=1. Node 7: left=9, right=6. Root 4: left=7, right=2. Destructuring assignment swaps atomically without a temp variable. The result is the mirror image of the original."
    difficulty: "junior"
    isCode: true

  - q: |
      function levelOrder(root) {
        if (!root) return [];
        const result = [], queue = [root];
        while (queue.length) {
          const level = [], size = queue.length;
          for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
          }
          result.push(level);
        }
        return result;
      }
      // Tree:
      //       4
      //      / \
      //     2   6
      //    /     \
      //   1       7
      // What does levelOrder(root) return?
    options:
      - text: "[4, 2, 6, 1, 7]"
        correct: false
      - text: "[[4], [2, 6], [1, 7]]"
        correct: true
      - text: "[[4], [2], [6], [1], [7]]"
        correct: false
      - text: "[[1], [2, 6], [4, 7]]"
        correct: false
    explanation: "BFS uses a queue. The key: snapshot queue.length at the start of each iteration -- that tells you how many nodes are on the CURRENT level before any new children are enqueued. Level 1: [4]. Level 2: [2,6] (children of 4). Level 3: [1,7] (children of 2 and 6). The size snapshot is what separates levels correctly."
    difficulty: "mid"
    isCode: true

  - q: |
      // Which traversal would you use to serialize a binary tree
      // so it can be perfectly reconstructed?
      // (Not a BST -- a general binary tree)
    options:
      - text: "Inorder -- because it visits all nodes"
        correct: false
      - text: "Preorder -- root is serialized before children, so deserialization knows the root first and can reconstruct subtrees recursively"
        correct: true
      - text: "Postorder -- children before root is easier to reconstruct"
        correct: false
      - text: "Level order -- it is the most natural for serialization"
        correct: false
    explanation: "Preorder (root, left, right) serializes the root first. During deserialization you read the root first, then recursively build the left subtree, then the right. Inorder alone is insufficient -- [1,2,3] could be multiple different trees. Level order also works (used in LeetCode's format) but requires explicit null markers. Preorder with null markers is the most common interview answer."
    difficulty: "senior"
    isCode: false

  - q: |
      function hasPathSum(node, target) {
        if (!node) return false;
        if (!node.left && !node.right) return node.val === target;
        return hasPathSum(node.left, target - node.val) ||
               hasPathSum(node.right, target - node.val);
      }
      // Tree:
      //       5
      //      / \
      //     4   8
      //    /   / \
      //   11  13  4
      //  /  \      \
      // 7    2      1
      // Does a root-to-leaf path sum to 22?
    options:
      - text: "No -- no path sums to 22"
        correct: false
      - text: "Yes -- path 5 -> 4 -> 11 -> 2 = 22"
        correct: true
      - text: "Yes -- path 5 -> 8 -> 4 -> 1 = 18"
        correct: false
      - text: "Error -- the recursion will infinite loop"
        correct: false
    explanation: "5 -> 4 -> 11 -> 2 = 22. The algorithm subtracts current node value and checks if any child path sums to the remainder. At leaf: target === node.val. hasPathSum(5, 22) -> check left hasPathSum(4, 17) -> check left hasPathSum(11, 13) -> check right hasPathSum(2, 2) -> leaf and 2===2 -> true. The || short-circuits as soon as one path is found."
    difficulty: "principal"
    isCode: true
---

# Data Structures: Binary Trees

Questions covering tree traversals, BST validation, LCA, BFS/DFS, and common recursive patterns.
