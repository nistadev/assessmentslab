---
defaultDomains:
  - computer-science
defaultTopics:
  - data-structures
questions:
  - q: Which data structure is implemented?
    code: |-
      class HistoryBuffer {
        items = [];
        add(value) {
          this.items.push(value);
        }
        remove() {
          return this.items.pop();
        }
        peek() {
          return this.items[this.items.length - 1];
        }
      }
    options:
      - text: Stack
        correct: true
      - text: Queue
        correct: false
      - text: Deque
        correct: false
      - text: Priority queue
        correct: false
    explanation: Both insertion and removal happen at the same end of the array. That last-in, first-out behavior identifies a stack.
    difficulty: junior
  - q: Which data structure is implemented?
    code: |-
      class TaskLine {
        items = [];
        add(value) {
          this.items.push(value);
        }
        remove() {
          return this.items.shift();
        }
      }
    options:
      - text: Queue
        correct: true
      - text: Stack
        correct: false
      - text: Deque
        correct: false
      - text: Circular queue
        correct: false
    explanation: Values enter at the back with `push` and leave from the front with `shift`. That first-in, first-out behavior identifies a queue.
    difficulty: junior
  - q: Which data structure is implemented?
    code: |-
      class PriorityStore {
        data = [];
        push(value) {
          this.data.push(value);
          this.promote(this.data.length - 1);
        }
        promote(index) {
          while (index > 0) {
            const parentIdx = Math.floor((index - 1) / 2);
            if (this.data[parentIdx] <= this.data[index]) break;
            [this.data[parentIdx], this.data[index]] = [this.data[index], this.data[parentIdx]];
            index = parentIdx;
          }
        }
      }
    options:
      - text: Min heap
        correct: true
      - text: Max heap
        correct: false
      - text: AVL tree
        correct: false
      - text: Priority queue backed by a sorted array
        correct: false
    explanation: The parent index formula and bubble-up swap preserve the rule that each parent is less than or equal to its children. That identifies a min heap.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class PrefixNode {
        constructor() {
          this.children = new Map();
          this.terminal = false;
        }
      }
      class WordStore {
        root = new PrefixNode();
        insert(word) {
          let node = this.root;
          for (const ch of word) {
            if (!node.children.has(ch)) node.children.set(ch, new PrefixNode());
            node = node.children.get(ch);
          }
          node.terminal = true;
        }
      }
    options:
      - text: Trie
        correct: true
      - text: Hash map with prefix keys
        correct: false
      - text: Radix tree
        correct: false
      - text: Binary search tree
        correct: false
    explanation: Each character moves one level deeper through a child map, and `terminal` marks complete words. That prefix-tree structure is a trie.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class ComponentTracker {
        constructor(n) {
          this.parent = Array.from({ length: n }, (_, i) => i);
        }
        getRoot(x) {
          if (this.parent[x] !== x) this.parent[x] = this.getRoot(this.parent[x]);
          return this.parent[x];
        }
        connect(a, b) {
          this.parent[this.getRoot(a)] = this.getRoot(b);
        }
      }
    options:
      - text: Union-find / disjoint set
        correct: true
      - text: Bloom filter
        correct: false
      - text: Min heap
        correct: false
      - text: Adjacency list
        correct: false
    explanation: "`getRoot` returns the representative parent and compresses paths. `connect` merges two sets by representative. That is disjoint set union."
    difficulty: principal
  - q: Which data structure behavior is implemented?
    code: |-
      class BoundedCache {
        constructor(limit) {
          this.limit = limit;
          this.map = new Map();
        }
        get(key) {
          if (!this.map.has(key)) return -1;
          const value = this.map.get(key);
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
        put(key, value) {
          if (this.map.has(key)) this.map.delete(key);
          this.map.set(key, value);
          if (this.map.size > this.limit) {
            this.map.delete(this.map.keys().next().value);
          }
        }
      }
    options:
      - text: LRU cache
        correct: true
      - text: MRU cache (most-recently-used eviction)
        correct: false
      - text: Bounded FIFO queue
        correct: false
      - text: Min heap with key-value pairs
        correct: false
    explanation: The map preserves insertion order. Accessed keys are deleted and reinserted as most recent, and the oldest key is evicted when capacity is exceeded.
    difficulty: principal
  - q: Which graph representation is implemented?
    code: |-
      function buildRouteMap(edges) {
        const graph = new Map();
        for (const [from, to] of edges) {
          if (!graph.has(from)) graph.set(from, []);
          if (!graph.has(to)) graph.set(to, []);
          graph.get(from).push(to);
        }
        return graph;
      }
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
  - q: Which data structure is implemented?
    code: |-
      class UniqueRegistry {
        slots = Array.from({ length: 16 }, () => []);
        hash(value) {
          return String(value).length % this.slots.length;
        }
        add(value) {
          const bucket = this.slots[this.hash(value)];
          if (!bucket.includes(value)) bucket.push(value);
        }
        has(value) {
          return this.slots[this.hash(value)].includes(value);
        }
      }
    options:
      - text: Hash set with separate chaining
        correct: true
      - text: Hash map with separate chaining
        correct: false
      - text: Hash set with open addressing
        correct: false
      - text: Min heap
        correct: false
    explanation: The structure hashes a value to a bucket, stores unique values, and resolves collisions with arrays inside buckets. That is a hash set using separate chaining.
    difficulty: senior
  - q: Which data structure operation is shown?
    code: |-
      class CacheEntry {
        constructor(value) {
          this.value = value;
          this.prev = null;
          this.next = null;
        }
      }
      function detach(entry) {
        if (entry.prev) entry.prev.next = entry.next;
        if (entry.next) entry.next.prev = entry.prev;
        entry.prev = null;
        entry.next = null;
      }
    options:
      - text: Remove a node from a doubly linked list
        correct: true
      - text: Remove a node from a singly linked list
        correct: false
      - text: Remove from a binary heap
        correct: false
      - text: Remove from a circular buffer
        correct: false
    explanation: The node has both `prev` and `next` pointers. Removal reconnects the previous node to the next node and the next node back to the previous node, which is doubly linked list behavior.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class LookupTable {
        slots = Array.from({ length: 16 }, () => []);
        hash(key) {
          return String(key).length % this.slots.length;
        }
        set(key, value) {
          const bucket = this.slots[this.hash(key)];
          const pair = bucket.find(([k]) => k === key);
          if (pair) pair[1] = value;
          else bucket.push([key, value]);
        }
        get(key) {
          return this.slots[this.hash(key)]
            .find(([k]) => k === key)?.[1];
        }
      }
    options:
      - text: Hash map with separate chaining
        correct: true
      - text: Hash set with separate chaining
        correct: false
      - text: Hash map with open addressing
        correct: false
      - text: Trie
        correct: false
    explanation: Keys are hashed into buckets, and collisions are stored as key-value pairs inside a bucket array. That is separate chaining in a hash map.
    difficulty: senior
  - q: Which data structure behavior is implemented?
    code: |-
      class GrowableBuffer {
        storage = new Array(2);
        length = 0;
        push(value) {
          if (this.length === this.storage.length) {
            const next = new Array(this.storage.length * 2);
            for (let i = 0; i < this.length; i++) next[i] = this.storage[i];
            this.storage = next;
          }
          this.storage[this.length++] = value;
        }
      }
    options:
      - text: Dynamic array resizing
        correct: true
      - text: Amortized linked list append
        correct: false
      - text: Circular buffer append
        correct: false
      - text: Queue dequeue
        correct: false
    explanation: The backing array doubles when full, then existing values are copied into the larger storage. That is dynamic array growth.
    difficulty: mid
  - q: Which data structure is implemented?
    code: |-
      class RingBuffer {
        constructor(size) {
          this.slots = new Array(size);
          this.head = 0;
          this.tail = 0;
          this.count = 0;
        }
        enqueue(value) {
          if (this.count === this.slots.length) return false;
          this.slots[this.tail] = value;
          this.tail = (this.tail + 1) % this.slots.length;
          this.count++;
          return true;
        }
      }
    options:
      - text: Circular queue
        correct: true
      - text: Deque
        correct: false
      - text: Regular queue
        correct: false
      - text: Stack
        correct: false
    explanation: The tail wraps with modulo when it reaches the end of the backing array. That ring-buffer behavior identifies a circular queue.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class BrowserHistory {
        items = [];
        addStart(value) {
          this.items.unshift(value);
        }
        addEnd(value) {
          this.items.push(value);
        }
        removeStart() {
          return this.items.shift();
        }
        removeEnd() {
          return this.items.pop();
        }
      }
    options:
      - text: Deque
        correct: true
      - text: Stack (LIFO only)
        correct: false
      - text: Queue (FIFO only)
        correct: false
      - text: Circular queue
        correct: false
    explanation: A deque supports insertion and removal at both front and back. The four methods map directly to double-ended queue behavior.
    difficulty: mid
  - q: Which data structure is implemented?
    code: |-
      class StepNode {
        constructor(value, next = null) {
          this.value = value;
          this.next = next;
        }
      }
      class ChainList {
        head = null;
        addFirst(value) {
          this.head = new StepNode(value, this.head);
        }
      }
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
    code: |-
      class ItemNode {
        constructor(value) {
          this.value = value;
          this.left = null;
          this.right = null;
        }
      }
    options:
      - text: Binary tree node
        correct: true
      - text: Trie node
        correct: false
      - text: N-ary tree node
        correct: false
      - text: Heap node
        correct: false
    explanation: The node has at most two child references named `left` and `right`. That is the basic node shape for a binary tree.
    difficulty: junior
  - q: Which data structure is implemented?
    code: |-
      class SortedIndex {
        root = null;
        insert(value) {
          const node = new ItemNode(value);
          if (!this.root) {
            this.root = node;
            return;
          }
          let current = this.root;
          while (true) {
            if (value < current.value) {
              if (!current.left) return void (current.left = node);
              current = current.left;
            } else {
              if (!current.right) return void (current.right = node);
              current = current.right;
            }
          }
        }
      }
    options:
      - text: Binary search tree
        correct: true
      - text: Binary heap
        correct: false
      - text: AVL tree
        correct: false
      - text: Red-black tree
        correct: false
    explanation: Each insert compares values and moves left for smaller values or right for greater/equal values. That ordering rule identifies a binary search tree.
    difficulty: mid
  - q: Which graph representation is implemented?
    code: |-
      function buildAccessGrid(n, edges) {
        const matrix = Array.from({ length: n }, () => Array(n).fill(false));
        for (const [from, to] of edges) {
          matrix[from][to] = true;
        }
        return matrix;
      }
    options:
      - text: Adjacency matrix
        correct: true
      - text: Adjacency list
        correct: false
      - text: Incidence matrix
        correct: false
      - text: Edge list
        correct: false
    explanation: The graph is represented by a two-dimensional n-by-n matrix where matrix[from][to] records whether an edge exists.
    difficulty: mid
  - q: Which compact data structure is implemented?
    code: |-
      class PermissionFlags {
        bits = 0;
        add(position) {
          this.bits |= (1 << position);
        }
        has(position) {
          return (this.bits & (1 << position)) !== 0;
        }
      }
    options:
      - text: Bit set
        correct: true
      - text: Boolean array map
        correct: false
      - text: Byte array
        correct: false
      - text: Hash set
        correct: false
    explanation: Each position is represented by one bit inside an integer. Bitwise OR sets a bit, and bitwise AND checks whether that bit is present.
    difficulty: senior
  - q: Which probabilistic data structure is implemented?
    code: |-
      class PresenceFilter {
        markers = new Set();
        digest(value) {
          return [value.length % 10, value.charCodeAt(0) % 10];
        }
        add(value) {
          for (const h of this.digest(value)) this.markers.add(h);
        }
        mightContain(value) {
          return this.digest(value).every(h => this.markers.has(h));
        }
      }
    options:
      - text: Bloom filter
        correct: true
      - text: Count-min sketch
        correct: false
      - text: Cuckoo filter
        correct: false
      - text: LRU cache
        correct: false
    explanation: Multiple hashes mark positions on insert, and lookup checks whether all hash positions are present. That can produce false positives, which is the key Bloom filter tradeoff.
    difficulty: principal
---

# Data Structures

Questions covering implementation and identification of common data structures.
