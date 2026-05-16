---
defaultDomains:
- computer-science
defaultTopics:
- algorithms
lessons:
- title: Algorithms are recipes with input, output, and cost
  explanation: |
    An algorithm is a repeatable way to solve a problem.

    At junior level, focus on three questions: what input does the algorithm require, what output should it produce, and how much work does it do as the input grows? A linear scan works on any list but may inspect every item. Binary search is faster, but only when the input is sorted. A hash lookup is fast when you can store values in a set or map.

    Where to apply:
    Use a simple scan for small or unsorted data. Use binary search only when sorted order is guaranteed. Use a set or map when repeated membership or lookup is the main operation.

    Do not confuse with:
    A faster-looking algorithm can be wrong if its precondition is missing. Binary search on an unsorted list is not an optimization; it is a bug.
  examples:
  - label: Linear scan
    description: Works on unsorted data, but may check every value.
    code: |
      def contains_user(users, target_id):
          for user in users:
              if user.id == target_id:
                  return True
          return False
  - label: Binary search precondition
    description: The list must already be sorted by the searched value.
    code: |
      def binary_search(sorted_numbers, target):
          left = 0
          right = len(sorted_numbers) - 1

          while left <= right:
              middle = (left + right) // 2
              if sorted_numbers[middle] == target:
                  return middle
              if sorted_numbers[middle] < target:
                  left = middle + 1
              else:
                  right = middle - 1

          return -1
  - label: Hash lookup
    description: A set makes repeated membership checks cheap.
    code: |
      blocked_ids = {"u_1", "u_7", "u_9"}

      def can_login(user_id):
          return user_id not in blocked_ids
  difficulty: junior
- title: Traversal order decides what you see first
  explanation: |
    Tree traversal algorithms visit the same nodes in different orders.

    Preorder visits the node before its children. That is useful for cloning or serializing a tree because the parent appears first. Inorder visits left, node, right. On a binary search tree, that produces sorted values. Postorder visits children before the node. That is useful for deletion and cleanup. Breadth-first search visits one level at a time.

    Where to apply:
    Choose preorder when parent-first work matters. Choose inorder for sorted BST output. Choose postorder when children must finish before their parent. Choose BFS when level grouping matters.

    Do not confuse with:
    Traversal names are not interchangeable labels. The order is the behavior.
  examples:
  - label: Preorder
    description: Parent appears before children.
    code: |
      def preorder(node, out):
          if node is None:
              return
          out.append(node.value)
          preorder(node.left, out)
          preorder(node.right, out)
  - label: Inorder for a BST
    description: Left, node, right returns values from low to high.
    code: |
      def inorder(node, out):
          if node is None:
              return
          inorder(node.left, out)
          out.append(node.value)
          inorder(node.right, out)
  - label: Postorder
    description: Children appear before parent.
    code: |
      def postorder(node, out):
          if node is None:
              return
          postorder(node.left, out)
          postorder(node.right, out)
          out.append(node.value)
  difficulty: junior
- title: Sets and maps avoid repeated nested scans
  explanation: |
    Many beginner algorithms are slow because they compare every item with every other item.

    A nested loop can be fine for tiny inputs, but it grows quickly. A set can remember values already seen. A map can remember counts, indexes, or grouped items. This turns many common problems into one or two passes over the input: duplicates, intersections, first unique values, and Two Sum.

    Where to apply:
    Use a set when you only need to know whether a value exists. Use a map when the value should point to data such as a count, an index, or a list.

    Do not confuse with:
    A set loses duplicate counts. If counts matter, use a map.
  examples:
  - label: Duplicate check with a set
    description: Return as soon as a repeated value appears.
    code: |
      def has_duplicate(values):
          seen = set()
          for value in values:
              if value in seen:
                  return True
              seen.add(value)
          return False
  - label: Frequency map
    description: Counts matter when you need the first unique value.
    code: |
      def first_unique(text):
          counts = {}
          for char in text:
              counts[char] = counts.get(char, 0) + 1

          for char in text:
              if counts[char] == 1:
                  return char

          return None
  - label: Intersection
    description: Store one side, then check the other side.
    code: |
      def intersection(left, right):
          left_values = set(left)
          result = set()
          for value in right:
              if value in left_values:
                  result.add(value)
          return result
  difficulty: junior
- title: Big O describes growth, not stopwatch time
  explanation: |
    Big O describes how work grows when input grows.

    O(1) work stays roughly constant. O(log n) cuts the search space down repeatedly. O(n) grows with the number of items. O(n²) often means a nested comparison across pairs. The exact runtime still depends on hardware, language, input size, and constants, but Big O helps compare shapes before code reaches production.

    Where to apply:
    Use Big O to spot growth risks in loops, recursion, sorting, searching, and repeated database or API calls. Ask what happens when 100 items become 100,000.

    Do not confuse with:
    Big O does not prove one implementation is always faster for small inputs. A simple O(n) scan can beat a complex structure when the list is tiny.
  examples:
  - label: O(n)
    description: One pass over the input.
    code: |
      def total(values):
          result = 0
          for value in values:
              result += value
          return result
  - label: O(n squared)
    description: Every value is compared with every later value.
    code: |
      def has_pair_sum(values, target):
          for i in range(len(values)):
              for j in range(i + 1, len(values)):
                  if values[i] + values[j] == target:
                      return True
          return False
  - label: Better shape with a set
    description: One pass plus hash lookups avoids checking every pair.
    code: |
      def has_pair_sum(values, target):
          seen = set()
          for value in values:
              if target - value in seen:
                  return True
              seen.add(value)
          return False
  difficulty: junior
---
