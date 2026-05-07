---
defaultDomains:
  - computer-science
defaultTopics:
  - algorithms
questions:
  - q: You have a BST of product prices. A customer wants to see all products listed from cheapest to most expensive. Which algorithm should you use?
    options:
      - text: Inorder traversal
        correct: true
      - text: Preorder traversal
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Level order traversal
        correct: false
    explanation: In a BST, inorder traversal visits left subtree, node, then right subtree. Because left values are smaller and right values are larger, this produces sorted output without an extra sort.
    difficulty: junior
  - q: You need to save a component tree to localStorage and restore it exactly on next load. Which algorithm fits best?
    options:
      - text: Preorder serialize/deserialize
        correct: true
      - text: Inorder traversal only
        correct: false
      - text: Postorder without null markers
        correct: false
      - text: Binary search
        correct: false
    explanation: Preorder writes the root before its children, so deserialization knows what node to create first and can recursively rebuild children. For a general binary tree, null markers are still needed to preserve exact shape.
    difficulty: senior
  - q: A task manager has nested tasks. To delete a project you must delete all subtasks before the parent task or you lose references. Which traversal should you use?
    options:
      - text: Postorder traversal
        correct: true
      - text: Preorder traversal
        correct: false
      - text: Inorder traversal
        correct: false
      - text: Level order traversal
        correct: false
    explanation: Postorder processes children before the parent. That is the safe shape for deletion, cleanup, and dependency teardown because dependent child nodes are handled before the node that owns them.
    difficulty: mid
  - q: "An org chart UI needs to render each management level in a different color: CEO row first, VP row second, director row third. Which algorithm should you use?"
    options:
      - text: Level order traversal (BFS)
        correct: true
      - text: Inorder traversal
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Lowest common ancestor
        correct: false
    explanation: Level order traversal uses BFS to process nodes by depth. It naturally gives grouped rows like level 0, level 1, and level 2, which maps directly to row-based UI rendering.
    difficulty: junior
  - q: Two users are collaborating on a shared Google Doc nested inside a folder tree. You need the closest shared parent folder to build the breadcrumb. Which algorithm identifies it?
    options:
      - text: Lowest common ancestor (LCA)
        correct: true
      - text: Max depth
        correct: false
      - text: Path sum
        correct: false
      - text: Invert tree
        correct: false
    explanation: LCA finds the nearest node that contains both target nodes in its subtree. In a folder tree, that nearest common node is the closest shared parent folder.
    difficulty: principal
  - q: A game map is a tree of zones, each with a movement cost. You must check if the player can reach any leaf spending exactly their remaining stamina. Which algorithm should you use?
    options:
      - text: hasPathSum
        correct: true
      - text: maxDepth
        correct: false
      - text: isValidBST
        correct: false
      - text: Inorder traversal
        correct: false
    explanation: hasPathSum checks whether any root-to-leaf path totals the target. It subtracts each visited node cost from remaining stamina and returns true only when a leaf exactly matches the remaining value.
    difficulty: principal
  - q: A SaaS app limits free users to 3 levels of nested folders. Before allowing a new folder, you need to validate the current nesting depth. Which algorithm should you use?
    options:
      - text: maxDepth
        correct: true
      - text: Two Sum
        correct: false
      - text: Invert tree
        correct: false
      - text: Inorder traversal
        correct: false
    explanation: maxDepth measures the longest path from the root to a leaf. Comparing that depth to the product limit tells you whether adding another nested folder would break the rule.
    difficulty: mid
  - q: A presentation tool needs a mirror layout button that flips the entire slide tree left to right for RTL display. Which algorithm should you use?
    options:
      - text: Invert tree
        correct: true
      - text: Level order traversal
        correct: false
      - text: Lowest common ancestor
        correct: false
      - text: Path Sum II
        correct: false
    explanation: Invert tree recursively swaps left and right children at every node. Doing that for the whole slide hierarchy produces the mirrored layout.
    difficulty: junior
  - q: A role hierarchy is stored as a BST by permission level. Before deploying, verify no role was inserted in the wrong position. Which algorithm should you use?
    options:
      - text: isValidBST
        correct: true
      - text: maxDepth
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Level order traversal
        correct: false
    explanation: isValidBST validates the global BST rule by carrying min and max bounds down the tree. Checking only immediate children can miss invalid descendants.
    difficulty: senior
  - q: A CI/CD pipeline must execute jobs in dependency order, where no job runs before its dependencies are done. Return the execution order. Which tree traversal matches this?
    options:
      - text: Postorder traversal
        correct: true
      - text: Preorder traversal
        correct: false
      - text: Inorder traversal
        correct: false
      - text: Invert tree
        correct: false
    explanation: Postorder returns children before parent. If dependencies are children and the job is the parent, postorder gives dependency-first execution.
    difficulty: mid
  - q: A file explorer needs to display all files alphabetically. Files are stored in a BST keyed by filename. Which algorithm should you use?
    options:
      - text: Inorder traversal
        correct: true
      - text: Level order traversal
        correct: false
      - text: Preorder traversal
        correct: false
      - text: Postorder traversal
        correct: false
    explanation: For a BST keyed by filename, inorder traversal visits keys in sorted order. That makes it a direct fit for alphabetical display.
    difficulty: junior
  - q: A budget tool must find every spending path from company root to a team where the total equals exactly $500k. It must return all matching paths. Which algorithm should you use?
    options:
      - text: Path Sum II with backtracking
        correct: true
      - text: hasPathSum boolean check
        correct: false
      - text: maxDepth
        correct: false
      - text: isValidBST
        correct: false
    explanation: Path Sum II collects all root-to-leaf paths whose sum equals the target. Backtracking keeps the current path while exploring and removes nodes when returning from recursion.
    difficulty: principal
  - q: A legal compliance tool needs to audit pages starting from highest priority root down, level by level. Which algorithm should you use?
    options:
      - text: Level order traversal (BFS)
        correct: true
      - text: Postorder traversal
        correct: false
      - text: Inorder traversal
        correct: false
      - text: Lowest common ancestor
        correct: false
    explanation: Level order traversal processes the root first, then every node one depth level lower, and so on. That exactly matches top-down priority auditing.
    difficulty: junior
  - q: You are building a diff tool. Before comparing two trees, you need to send one over a network as a string and rebuild it on the other side. Which algorithm should you use?
    options:
      - text: Preorder serialize/deserialize
        correct: true
      - text: Inorder traversal without nulls
        correct: false
      - text: maxDepth
        correct: false
      - text: Invert tree
        correct: false
    explanation: Preorder serialization sends root before subtrees, so the receiver can rebuild from the same root-first structure. For exact reconstruction of a general tree, include null markers.
    difficulty: senior
  - q: A meditation app has a session tree where each session branches into deeper sessions. You need the longest possible session chain. Which algorithm should you use?
    options:
      - text: maxDepth
        correct: true
      - text: hasPathSum
        correct: false
      - text: Lowest common ancestor
        correct: false
      - text: Two Sum
        correct: false
    explanation: maxDepth returns the length of the longest root-to-leaf path. That is the longest possible chain through the session tree.
    difficulty: mid
  - q: Two microservices share a dependency graph stored as a tree. You need the closest shared dependency to avoid loading it twice. Which algorithm should identify it?
    options:
      - text: Lowest common ancestor (LCA)
        correct: true
      - text: Level order traversal
        correct: false
      - text: Path Sum II
        correct: false
      - text: isValidBST
        correct: false
    explanation: LCA returns the nearest ancestor shared by two nodes. In a dependency tree, that ancestor is the closest shared dependency.
    difficulty: principal
  - q: A webpack-like bundler processes modules. Each module can only be bundled after all imported modules are bundled first. Which traversal matches this dependency rule?
    options:
      - text: Postorder traversal
        correct: true
      - text: Preorder traversal
        correct: false
      - text: Level order traversal
        correct: false
      - text: Inorder traversal
        correct: false
    explanation: Postorder handles children before parent. If imported modules are children, they are bundled before the module that imports them.
    difficulty: mid
  - q: A permission system stores roles as a BST by access level. You need all roles between level 3 and level 7. Which algorithm should you use?
    options:
      - text: Inorder traversal with range filtering
        correct: true
      - text: Level order traversal only
        correct: false
      - text: Invert tree
        correct: false
      - text: maxDepth
        correct: false
    explanation: Inorder walks a BST in sorted order. With range bounds, you can skip subtrees outside the range and collect only roles between levels 3 and 7.
    difficulty: senior
  - q: A Figma-like tool clones an entire component tree to create a duplicate frame. The clone must preserve exact hierarchy. Which traversal is the natural fit?
    options:
      - text: Preorder traversal
        correct: true
      - text: Postorder traversal
        correct: false
      - text: Inorder traversal
        correct: false
      - text: Lowest common ancestor
        correct: false
    explanation: Preorder creates or visits the root first, then recursively handles children. That is natural for cloning because parent nodes must exist before child clones can attach to them.
    difficulty: senior
  - q: A chat app has threaded conversations stored as a tree. Display replies grouped by depth, with each depth shown together. Which algorithm should you use?
    options:
      - text: Level order traversal (BFS)
        correct: true
      - text: Postorder traversal
        correct: false
      - text: Inorder traversal
        correct: false
      - text: Path Sum II
        correct: false
    explanation: Level order traversal groups nodes by depth using a queue. That makes it fit threaded views where all replies at the same depth are rendered together.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function walk(node, out = []) {
        if (!node) return out;
        walk(node.left, out);
        out.push(node.val);
        walk(node.right, out);
        return out;
      }
    options:
      - text: Inorder traversal
        correct: true
      - text: Preorder traversal
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Level order traversal
        correct: false
    explanation: The order is left subtree, current node, then right subtree. That is inorder traversal. On a BST, this returns values in sorted order.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function walk(node, out = []) {
        if (!node) return out;
        out.push(node.val);
        walk(node.left, out);
        walk(node.right, out);
        return out;
      }
    options:
      - text: Preorder traversal
        correct: true
      - text: Inorder traversal
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Breadth-first search
        correct: false
    explanation: The current node is processed before both children. That root-left-right order is preorder traversal, commonly used when cloning or serializing a tree.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function walk(node, out = []) {
        if (!node) return out;
        walk(node.left, out);
        walk(node.right, out);
        out.push(node.val);
        return out;
      }
    options:
      - text: Postorder traversal
        correct: true
      - text: Preorder traversal
        correct: false
      - text: Inorder traversal
        correct: false
      - text: Binary search
        correct: false
    explanation: The node is processed after both children. That left-right-root order is postorder, useful for deleting trees or resolving dependencies before dependents.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function traverse(root) {
        if (!root) return [];
        const result = [];
        const queue = [root];
        while (queue.length) {
          const node = queue.shift();
          result.push(node.val);
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
        return result;
      }
    options:
      - text: Level order traversal (BFS)
        correct: true
      - text: Depth-first search preorder
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Lowest common ancestor
        correct: false
    explanation: A queue is used to process the current node, then enqueue its children. That FIFO behavior visits nodes breadth-first, one level at a time.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function levels(root) {
        if (!root) return [];
        const result = [];
        const queue = [root];
        while (queue.length) {
          const size = queue.length;
          const level = [];
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
    options:
      - text: Level order traversal grouped by depth
        correct: true
      - text: Inorder traversal
        correct: false
      - text: Path Sum II
        correct: false
      - text: BST validation
        correct: false
    explanation: The queue gives BFS, and the `size` snapshot separates the nodes already in the queue for this depth from children added for the next depth.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function depth(node) {
        if (!node) return 0;
        return 1 + Math.max(depth(node.left), depth(node.right));
      }
    options:
      - text: Maximum depth of a binary tree
        correct: true
      - text: Minimum depth of a binary tree
        correct: false
      - text: Path Sum II
        correct: false
      - text: Invert tree
        correct: false
    explanation: The function returns 0 for null and 1 plus the larger child depth for real nodes. That computes the longest root-to-leaf depth.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function flip(node) {
        if (!node) return null;
        const left = flip(node.left);
        const right = flip(node.right);
        node.left = right;
        node.right = left;
        return node;
      }
    options:
      - text: Invert binary tree
        correct: true
      - text: Validate BST
        correct: false
      - text: Lowest common ancestor
        correct: false
      - text: Preorder serialization
        correct: false
    explanation: The recursive calls process both subtrees, then assign the right result to `left` and the left result to `right`. That swaps children at every node, producing a mirror tree.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function valid(node, min = -Infinity, max = Infinity) {
        if (!node) return true;
        if (node.val <= min || node.val >= max) return false;
        return valid(node.left, min, node.val) &&
          valid(node.right, node.val, max);
      }
    options:
      - text: Validate Binary Search Tree
        correct: true
      - text: Lowest common ancestor
        correct: false
      - text: Two Sum
        correct: false
      - text: Level order traversal
        correct: false
    explanation: The min and max bounds enforce global BST constraints across all descendants, not only immediate parent-child comparisons.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function search(root, p, q) {
        if (!root || root === p || root === q) return root;
        const left = search(root.left, p, q);
        const right = search(root.right, p, q);
        if (left && right) return root;
        return left || right;
      }
    options:
      - text: Lowest common ancestor in a binary tree
        correct: true
      - text: Maximum depth
        correct: false
      - text: Path Sum II
        correct: false
      - text: Inorder traversal
        correct: false
    explanation: If one target is found in each subtree, the current root is the closest shared ancestor. Otherwise the function returns whichever side found a target.
    difficulty: principal
  - q: Which algorithm is implemented?
    code: |-
      function exists(node, target) {
        if (!node) return false;
        if (!node.left && !node.right) return node.val === target;
        return exists(node.left, target - node.val) ||
          exists(node.right, target - node.val);
      }
    options:
      - text: Path Sum
        correct: true
      - text: Path Sum II
        correct: false
      - text: Maximum depth
        correct: false
      - text: Validate BST
        correct: false
    explanation: The function subtracts each visited node value and returns a boolean when any root-to-leaf path exactly equals the target. It does not collect all paths, so it is Path Sum, not Path Sum II.
    difficulty: principal
  - q: Which algorithm is implemented?
    code: |-
      function collect(node, target, path = [], result = []) {
        if (!node) return result;
        path.push(node.val);
        if (!node.left && !node.right && node.val === target) {
          result.push([...path]);
        }
        collect(node.left, target - node.val, path, result);
        collect(node.right, target - node.val, path, result);
        path.pop();
        return result;
      }
    options:
      - text: Path Sum II with backtracking
        correct: true
      - text: hasPathSum boolean check
        correct: false
      - text: Level order traversal
        correct: false
      - text: Invert tree
        correct: false
    explanation: The function keeps a mutable `path`, copies it into `result` when a matching leaf is found, then pops when unwinding recursion. That push/copy/pop pattern is backtracking.
    difficulty: principal
  - q: Which algorithm is implemented?
    code: |-
      function serialize(node) {
        if (!node) return ['#'];
        return [
          String(node.val),
          ...serialize(node.left),
          ...serialize(node.right)
        ];
      }
    options:
      - text: Preorder serialization with null markers
        correct: true
      - text: Inorder traversal without null markers
        correct: false
      - text: Level order traversal
        correct: false
      - text: Postorder deletion
        correct: false
    explanation: The node value is emitted before left and right children, so this is preorder. The `#` null markers preserve tree shape for exact deserialization.
    difficulty: senior
  - q: Which algorithmic pattern is this?
    code: |-
      function clone(node) {
        if (!node) return null;
        const copy = new TreeNode(node.val);
        copy.left = clone(node.left);
        copy.right = clone(node.right);
        return copy;
      }
    options:
      - text: Preorder tree clone
        correct: true
      - text: Postorder traversal
        correct: false
      - text: BST range query
        correct: false
      - text: Topological sort
        correct: false
    explanation: The copy node is created before its children are cloned, then child copies attach to it. That is a preorder-style recursive clone.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function range(node, low, high, out = []) {
        if (!node) return out;
        if (node.val > low) range(node.left, low, high, out);
        if (node.val >= low && node.val <= high) out.push(node.val);
        if (node.val < high) range(node.right, low, high, out);
        return out;
      }
    options:
      - text: BST range query using inorder pruning
        correct: true
      - text: Path Sum II
        correct: false
      - text: Level order traversal
        correct: false
      - text: Invert tree
        correct: false
    explanation: The function uses BST ordering to skip impossible subtrees and visits values in inorder position. It collects only nodes inside the low-to-high range.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function twoSum(nums, target) {
        const seen = new Map();
        for (let i = 0; i < nums.length; i++) {
          const need = target - nums[i];
          if (seen.has(need)) return [seen.get(need), i];
          seen.set(nums[i], i);
        }
        return null;
      }
    options:
      - text: Two Sum with a hash map
        correct: true
      - text: Binary search
        correct: false
      - text: Sliding window
        correct: false
      - text: Hash set intersection
        correct: false
    explanation: For each number, the code checks whether the complement has already been seen. The map stores value to index, making lookups expected O(1).
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function group(words) {
        const buckets = new Map();
        for (const word of words) {
          const key = word.split('').sort().join('');
          const list = buckets.get(key) ?? [];
          list.push(word);
          buckets.set(key, list);
        }
        return [...buckets.values()];
      }
    options:
      - text: Group Anagrams
        correct: true
      - text: Longest consecutive sequence
        correct: false
      - text: Two Sum
        correct: false
      - text: First unique character
        correct: false
    explanation: Each word is converted to a sorted-letter signature. Anagrams share the same signature, so the map groups them into the same bucket.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function firstUnique(s) {
        const count = new Map();
        for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);
        for (let i = 0; i < s.length; i++) {
          if (count.get(s[i]) === 1) return i;
        }
        return -1;
      }
    options:
      - text: First unique character using frequency count
        correct: true
      - text: Longest substring without repeats
        correct: false
      - text: Two Sum
        correct: false
      - text: Level order traversal
        correct: false
    explanation: The first pass builds character counts. The second pass preserves original string order and returns the first index whose count is exactly 1.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function longest(s) {
        const lastSeen = new Map();
        let left = 0;
        let best = 0;
        for (let right = 0; right < s.length; right++) {
          const prev = lastSeen.get(s[right]);
          if (prev !== undefined && prev >= left) left = prev + 1;
          lastSeen.set(s[right], right);
          best = Math.max(best, right - left + 1);
        }
        return best;
      }
    options:
      - text: Longest substring without repeating characters
        correct: true
      - text: Group Anagrams
        correct: false
      - text: First unique character
        correct: false
      - text: BST validation
        correct: false
    explanation: This is sliding window with a last-seen map. The left pointer jumps past duplicates inside the current window, while `best` tracks the longest valid window.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function longestConsecutive(nums) {
        const set = new Set(nums);
        let best = 0;
        for (const num of set) {
          if (set.has(num - 1)) continue;
          let current = num;
          let length = 1;
          while (set.has(current + 1)) {
            current++;
            length++;
          }
          best = Math.max(best, length);
        }
        return best;
      }
    options:
      - text: Longest consecutive sequence with a hash set
        correct: true
      - text: Two Sum
        correct: false
      - text: Binary tree max depth
        correct: false
      - text: Group Anagrams
        correct: false
    explanation: The set gives expected O(1) membership checks. The key clue is `if (set.has(num - 1)) continue`, which skips non-start nodes so each sequence is counted once.
    difficulty: principal
  - q: Which algorithm is implemented?
    code: |-
      function intersect(a, b) {
        const seen = new Set(a);
        const result = new Set();
        for (const value of b) {
          if (seen.has(value)) result.add(value);
        }
        return [...result];
      }
    options:
      - text: Hash set intersection
        correct: true
      - text: Two Sum
        correct: false
      - text: Path Sum
        correct: false
      - text: Preorder traversal
        correct: false
    explanation: The first set stores values from one array. The second loop checks membership and records shared values, which is the standard hash set intersection pattern.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function isValid(s) {
        const stack = [];
        const pairs = { ')': '(', ']': '[', '}': '{' };
        for (const ch of s) {
          if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
          else if (stack.pop() !== pairs[ch]) return false;
        }
        return stack.length === 0;
      }
    options:
      - text: Valid parentheses using a stack
        correct: true
      - text: Queue-based BFS
        correct: false
      - text: Two Sum
        correct: false
      - text: Binary search
        correct: false
    explanation: Opening brackets are pushed, and closing brackets must match the most recent opening bracket. That nested last-in, first-out matching is the stack clue.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function reverseList(head) {
        let prev = null;
        let current = head;
        while (current) {
          const next = current.next;
          current.next = prev;
          prev = current;
          current = next;
        }
        return prev;
      }
    options:
      - text: Reverse a singly linked list
        correct: true
      - text: Detect a cycle
        correct: false
      - text: Merge two sorted lists
        correct: false
      - text: Remove nth node from end
        correct: false
    explanation: The code walks the list once and flips each `next` pointer to the previous node. Returning `prev` gives the old tail as the new head.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function hasCycle(head) {
        let slow = head;
        let fast = head;
        while (fast && fast.next) {
          slow = slow.next;
          fast = fast.next.next;
          if (slow === fast) return true;
        }
        return false;
      }
    options:
      - text: Floyd's cycle detection
        correct: true
      - text: Binary search
        correct: false
      - text: Merge sort
        correct: false
      - text: Union-find
        correct: false
    explanation: The fast pointer moves two steps while the slow pointer moves one. If there is a cycle, they eventually meet. This is Floyd's tortoise and hare algorithm.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function middleNode(head) {
        let slow = head;
        let fast = head;
        while (fast && fast.next) {
          slow = slow.next;
          fast = fast.next.next;
        }
        return slow;
      }
    options:
      - text: Find middle node with slow and fast pointers
        correct: true
      - text: Reverse linked list
        correct: false
      - text: LRU cache eviction
        correct: false
      - text: Trie lookup
        correct: false
    explanation: Fast advances twice as quickly as slow. When fast reaches the end, slow is at the middle.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function merge(a, b) {
        const dummy = { next: null };
        let tail = dummy;
        while (a && b) {
          if (a.val <= b.val) {
            tail.next = a;
            a = a.next;
          } else {
            tail.next = b;
            b = b.next;
          }
          tail = tail.next;
        }
        tail.next = a || b;
        return dummy.next;
      }
    options:
      - text: Merge two sorted linked lists
        correct: true
      - text: Reverse a linked list
        correct: false
      - text: Detect a cycle
        correct: false
      - text: Find intersection node
        correct: false
    explanation: The dummy head and tail pointer build a sorted chain by repeatedly taking the smaller current node from either list.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function search(nums, target) {
        let left = 0;
        let right = nums.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (nums[mid] === target) return mid;
          if (nums[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        return -1;
      }
    options:
      - text: Binary search
        correct: true
      - text: Linear search
        correct: false
      - text: Breadth-first search
        correct: false
      - text: Two pointers
        correct: false
    explanation: The code keeps left and right bounds and cuts the search space in half after each comparison. That is binary search on a sorted array.
    difficulty: junior
  - q: Which algorithm is implemented?
    code: |-
      function bfs(graph, start) {
        const seen = new Set([start]);
        const queue = [start];
        const order = [];
        while (queue.length) {
          const node = queue.shift();
          order.push(node);
          for (const next of graph.get(node) ?? []) {
            if (!seen.has(next)) {
              seen.add(next);
              queue.push(next);
            }
          }
        }
        return order;
      }
    options:
      - text: Breadth-first search on a graph
        correct: true
      - text: Depth-first search
        correct: false
      - text: Binary search
        correct: false
      - text: Union-find
        correct: false
    explanation: The queue processes nodes in FIFO order, and the seen set prevents revisiting. That is breadth-first search over an adjacency list.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function dfs(graph, start, seen = new Set(), order = []) {
        if (seen.has(start)) return order;
        seen.add(start);
        order.push(start);
        for (const next of graph.get(start) ?? []) {
          dfs(graph, next, seen, order);
        }
        return order;
      }
    options:
      - text: Depth-first search on a graph
        correct: true
      - text: Breadth-first search
        correct: false
      - text: Two Sum
        correct: false
      - text: LRU cache
        correct: false
    explanation: The recursive call explores each neighbor before returning to try the next neighbor. That deep recursive exploration identifies DFS.
    difficulty: mid
  - q: Which algorithm is implemented?
    code: |-
      function isBalanced(root) {
        function height(node) {
          if (!node) return 0;
          const left = height(node.left);
          if (left === -1) return -1;
          const right = height(node.right);
          if (right === -1) return -1;
          if (Math.abs(left - right) > 1) return -1;
          return 1 + Math.max(left, right);
        }
        return height(root) !== -1;
      }
    options:
      - text: Check if a binary tree is height-balanced
        correct: true
      - text: Validate BST
        correct: false
      - text: Invert binary tree
        correct: false
      - text: Find lowest common ancestor
        correct: false
    explanation: The helper returns subtree height, but uses -1 as a failure sentinel when any subtree is already unbalanced or child heights differ by more than 1.
    difficulty: principal
  - q: Which algorithm is implemented?
    code: |-
      function kthSmallest(root, k) {
        const stack = [];
        let node = root;
        while (stack.length || node) {
          while (node) {
            stack.push(node);
            node = node.left;
          }
          node = stack.pop();
          if (--k === 0) return node.val;
          node = node.right;
        }
      }
    options:
      - text: Find kth smallest value using iterative inorder traversal
        correct: true
      - text: Find max depth
        correct: false
      - text: Serialize a tree
        correct: false
      - text: Level order traversal
        correct: false
    explanation: The stack walks to the leftmost node first, then visits nodes in inorder sorted order. Decrementing k on each visit returns the kth smallest BST value.
    difficulty: senior
  - q: Which algorithm is implemented?
    code: |-
      function topKFrequent(nums, k) {
        const count = new Map();
        for (const num of nums) count.set(num, (count.get(num) ?? 0) + 1);
        return [...count.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, k)
          .map(([num]) => num);
      }
    options:
      - text: Top K frequent elements using a frequency map
        correct: true
      - text: Binary search
        correct: false
      - text: Union-find
        correct: false
      - text: Graph DFS
        correct: false
    explanation: The map counts how often each value appears, then entries are sorted by count and the first k keys are returned. The core algorithmic pattern is frequency counting plus top-k selection.
    difficulty: mid
  - q: Given an array of integers and a target, find the two indexes whose values add up to the target. The solution must be O(n). Which algorithm should you use?
    options:
      - text: Two Sum with a hash map storing value to index
        correct: true
      - text: Nested loops over every pair
        correct: false
      - text: Sort the array and return sorted positions
        correct: false
      - text: Binary search without preprocessing
        correct: false
    explanation: Two Sum uses a hash map from value to index. For each number, compute target - value and check if that complement already exists. This gives O(n) time because each lookup is expected O(1).
    difficulty: mid
  - q: Given an array of strings, group all words that are anagrams of each other. Which algorithm should you use?
    options:
      - text: Group Anagrams using a signature map
        correct: true
      - text: Binary search
        correct: false
      - text: Postorder traversal
        correct: false
      - text: Union-find
        correct: false
    explanation: Group Anagrams maps a canonical signature to an array of words. Sorting each word's letters makes anagrams share the same key, such as 'ate', 'eat', and 'tea' all mapping to 'aet'.
    difficulty: mid
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
    explanation: A frequency map stores char -> count. The second scan preserves original order, so the first character whose count is 1 is the correct answer.
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
    explanation: Frequency counting maps value -> count. As counts increase, any value crossing n/2 is the majority element. This is straightforward O(n) time and O(n) space.
    difficulty: junior
  - q: Given two arrays, return the values that appear in both. Which algorithm should you use?
    options:
      - text: Hash set intersection
        correct: true
      - text: Postorder traversal
        correct: false
      - text: A min heap only
        correct: false
      - text: String serialization
        correct: false
    explanation: Store values from the first array in a Set, then iterate the second array and check Set.has(value). Set lookup is expected O(1), which avoids a nested O(n*m) scan.
    difficulty: junior
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
    explanation: Sliding window expands right while tracking last seen indexes. When a duplicate appears inside the current window, move left past the previous index. This preserves O(n) time.
    difficulty: senior
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
    explanation: A hash set tracks values already seen. If the current value is already in the set, a duplicate exists and the function can return true immediately.
    difficulty: junior
  - q: Given a list of transactions, find all pairs of transactions that cancel each other out by summing to zero. Which algorithm should you adapt?
    options:
      - text: Two Sum variation checking each value's negative
        correct: true
      - text: Inorder traversal
        correct: false
      - text: Topological sort
        correct: false
      - text: Max depth
        correct: false
    explanation: This is a Two Sum variation where the target is zero. Store values or indexes in a hash map, and for each transaction x, check whether -x has already appeared.
    difficulty: senior
  - q: Given an unsorted array of integers, find the length of the longest consecutive sequence such as [1,2,3]. Which algorithm should you use?
    options:
      - text: "Hash set sequence starts: count only when num - 1 is absent"
        correct: true
      - text: Sort and use every value as a sequence start
        correct: false
      - text: Use a stack to reverse the array
        correct: false
      - text: Use LCA
        correct: false
    explanation: "The key optimization is only starting from sequence heads: numbers where num - 1 is absent. Then count num + 1, num + 2, and so on while values exist in the set. This avoids recounting the same sequence."
    difficulty: principal
  - q: Given a list of words, return the most frequently used word excluding a list of banned words. Which algorithmic approach should you use?
    options:
      - text: Frequency count words while skipping banned words, then return the highest count
        correct: true
      - text: Sort banned words only
        correct: false
      - text: Use inorder traversal
        correct: false
      - text: Use a queue and keep only the last word
        correct: false
    explanation: Put banned words in a Set for fast exclusion, then count allowed words in a hash map. Track the highest count or scan the map afterward to return the most frequent allowed word.
    difficulty: mid
---

# Algorithms: Binary Trees

Questions covering algorithm identification for common binary tree interview patterns.
