---
defaultDomains:
  - computer-science
defaultTopics:
  - data-structures
questions:
  - q: Which data structure is implemented?
    code: |-
      class Stack {
        items = [];
        push(value) {
          this.items.push(value);
        }
        pop() {
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
      - text: Hash map
        correct: false
      - text: Trie
        correct: false
    explanation: Both insertion and removal happen at the same end of the array. That last-in, first-out behavior identifies a stack.
    difficulty: junior
  - q: Which data structure is implemented?
    code: |-
      class Queue {
        items = [];
        enqueue(value) {
          this.items.push(value);
        }
        dequeue() {
          return this.items.shift();
        }
      }
    options:
      - text: Queue
        correct: true
      - text: Stack
        correct: false
      - text: Binary search tree
        correct: false
      - text: Heap
        correct: false
    explanation: Values enter at the back with `push` and leave from the front with `shift`. That first-in, first-out behavior identifies a queue.
    difficulty: junior
  - q: Which data structure is implemented?
    code: |-
      class MinHeap {
        data = [];
        push(value) {
          this.data.push(value);
          this.bubbleUp(this.data.length - 1);
        }
        bubbleUp(index) {
          while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.data[parent] <= this.data[index]) break;
            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            index = parent;
          }
        }
      }
    options:
      - text: Min heap
        correct: true
      - text: Max stack
        correct: false
      - text: Trie
        correct: false
      - text: Linked list
        correct: false
    explanation: The parent index formula and bubble-up swap preserve the rule that each parent is less than or equal to its children. That identifies a min heap.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class TrieNode {
        constructor() {
          this.children = new Map();
          this.isWord = false;
        }
      }
      class Trie {
        root = new TrieNode();
        insert(word) {
          let node = this.root;
          for (const ch of word) {
            if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
            node = node.children.get(ch);
          }
          node.isWord = true;
        }
      }
    options:
      - text: Trie
        correct: true
      - text: Hash set only
        correct: false
      - text: Binary search tree
        correct: false
      - text: Queue
        correct: false
    explanation: Each character moves one level deeper through a child map, and `isWord` marks complete words. That prefix-tree structure is a trie.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class UnionFind {
        constructor(n) {
          this.parent = Array.from({ length: n }, (_, i) => i);
        }
        find(x) {
          if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
          return this.parent[x];
        }
        union(a, b) {
          this.parent[this.find(a)] = this.find(b);
        }
      }
    options:
      - text: Union-find / disjoint set
        correct: true
      - text: Trie
        correct: false
      - text: Min heap
        correct: false
      - text: Stack
        correct: false
    explanation: "`find` returns the representative parent and compresses paths. `union` connects two sets by representative. That is disjoint set union."
    difficulty: principal
  - q: Which data structure behavior is implemented?
    code: |-
      class LRUCache {
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
      - text: FIFO queue only
        correct: false
      - text: Min heap
        correct: false
      - text: Binary search tree
        correct: false
    explanation: The map preserves insertion order. Accessed keys are deleted and reinserted as most recent, and the oldest key is evicted when capacity is exceeded.
    difficulty: principal
  - q: Which graph representation is implemented?
    code: |-
      function buildGraph(edges) {
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
      - text: Binary heap
        correct: false
      - text: Doubly linked list
        correct: false
    explanation: Each node maps to an array of outgoing neighbors. That map-of-lists shape is an adjacency list representation.
    difficulty: mid
  - q: Which data structure is implemented?
    code: |-
      class HashSet {
        buckets = Array.from({ length: 16 }, () => []);
        hash(value) {
          return String(value).length % this.buckets.length;
        }
        add(value) {
          const bucket = this.buckets[this.hash(value)];
          if (!bucket.includes(value)) bucket.push(value);
        }
        has(value) {
          return this.buckets[this.hash(value)].includes(value);
        }
      }
    options:
      - text: Hash set with separate chaining
        correct: true
      - text: Stack
        correct: false
      - text: Trie
        correct: false
      - text: Min heap
        correct: false
    explanation: The structure hashes a value to a bucket, stores unique values, and resolves collisions with arrays inside buckets. That is a hash set using separate chaining.
    difficulty: senior
  - q: Which data structure operation is shown?
    code: |-
      class Node {
        constructor(value) {
          this.value = value;
          this.prev = null;
          this.next = null;
        }
      }
      function remove(node) {
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        node.prev = null;
        node.next = null;
      }
    options:
      - text: Remove a node from a doubly linked list
        correct: true
      - text: Remove from a binary heap
        correct: false
      - text: Trie prefix deletion
        correct: false
      - text: Graph BFS
        correct: false
    explanation: The node has both `prev` and `next` pointers. Removal reconnects the previous node to the next node and the next node back to the previous node, which is doubly linked list behavior.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class HashMap {
        buckets = Array.from({ length: 16 }, () => []);
        hash(key) {
          return String(key).length % this.buckets.length;
        }
        set(key, value) {
          const bucket = this.buckets[this.hash(key)];
          const pair = bucket.find(([k]) => k === key);
          if (pair) pair[1] = value;
          else bucket.push([key, value]);
        }
        get(key) {
          return this.buckets[this.hash(key)]
            .find(([k]) => k === key)?.[1];
        }
      }
    options:
      - text: Hash map with separate chaining
        correct: true
      - text: Stack
        correct: false
      - text: Binary heap
        correct: false
      - text: Trie
        correct: false
    explanation: Keys are hashed into buckets, and collisions are stored as key-value pairs inside a bucket array. That is separate chaining in a hash map.
    difficulty: senior
  - q: Which data structure behavior is implemented?
    code: |-
      class DynamicArray {
        data = new Array(2);
        length = 0;
        push(value) {
          if (this.length === this.data.length) {
            const next = new Array(this.data.length * 2);
            for (let i = 0; i < this.length; i++) next[i] = this.data[i];
            this.data = next;
          }
          this.data[this.length++] = value;
        }
      }
    options:
      - text: Dynamic array resizing
        correct: true
      - text: Linked list insertion
        correct: false
      - text: Queue dequeue
        correct: false
      - text: Trie insert
        correct: false
    explanation: The backing array doubles when full, then existing values are copied into the larger storage. That is dynamic array growth.
    difficulty: mid
  - q: Which data structure is implemented?
    code: |-
      class CircularQueue {
        constructor(size) {
          this.data = new Array(size);
          this.head = 0;
          this.tail = 0;
          this.count = 0;
        }
        enqueue(value) {
          if (this.count === this.data.length) return false;
          this.data[this.tail] = value;
          this.tail = (this.tail + 1) % this.data.length;
          this.count++;
          return true;
        }
      }
    options:
      - text: Circular queue
        correct: true
      - text: Stack
        correct: false
      - text: Trie
        correct: false
      - text: Union-find
        correct: false
    explanation: The tail wraps with modulo when it reaches the end of the backing array. That ring-buffer behavior identifies a circular queue.
    difficulty: senior
  - q: Which data structure is implemented?
    code: |-
      class Deque {
        items = [];
        pushFront(value) {
          this.items.unshift(value);
        }
        pushBack(value) {
          this.items.push(value);
        }
        popFront() {
          return this.items.shift();
        }
        popBack() {
          return this.items.pop();
        }
      }
    options:
      - text: Deque
        correct: true
      - text: Stack only
        correct: false
      - text: Queue only
        correct: false
      - text: Binary search tree
        correct: false
    explanation: A deque supports insertion and removal at both front and back. The four methods map directly to double-ended queue behavior.
    difficulty: mid
  - q: Which data structure is implemented?
    code: |-
      class ListNode {
        constructor(value, next = null) {
          this.value = value;
          this.next = next;
        }
      }
      class SinglyLinkedList {
        head = null;
        prepend(value) {
          this.head = new ListNode(value, this.head);
        }
      }
    options:
      - text: Singly linked list
        correct: true
      - text: Doubly linked list
        correct: false
      - text: Stack backed by an array
        correct: false
      - text: Hash map
        correct: false
    explanation: Each node stores a value and one `next` pointer. There is no `prev` pointer, so this is a singly linked list.
    difficulty: junior
  - q: Which data structure is represented?
    code: |-
      class TreeNode {
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
      - text: Graph adjacency list
        correct: false
      - text: Hash bucket
        correct: false
    explanation: The node has at most two child references named `left` and `right`. That is the basic node shape for a binary tree.
    difficulty: junior
  - q: Which data structure is implemented?
    code: |-
      class BST {
        root = null;
        insert(value) {
          const node = new TreeNode(value);
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
      - text: Trie
        correct: false
      - text: Queue
        correct: false
    explanation: Each insert compares values and moves left for smaller values or right for greater/equal values. That ordering rule identifies a binary search tree.
    difficulty: mid
  - q: Which graph representation is implemented?
    code: |-
      function makeMatrix(n, edges) {
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
      - text: Hash set
        correct: false
      - text: Min heap
        correct: false
    explanation: The graph is represented by a two-dimensional n-by-n matrix where matrix[from][to] records whether an edge exists.
    difficulty: mid
  - q: Which compact data structure is implemented?
    code: |-
      class BitSet {
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
      - text: Trie
        correct: false
      - text: Queue
        correct: false
      - text: Linked list
        correct: false
    explanation: Each position is represented by one bit inside an integer. Bitwise OR sets a bit, and bitwise AND checks whether that bit is present.
    difficulty: senior
  - q: Which probabilistic data structure is implemented?
    code: |-
      class BloomFilter {
        bits = new Set();
        hashes(value) {
          return [value.length % 10, value.charCodeAt(0) % 10];
        }
        add(value) {
          for (const hash of this.hashes(value)) this.bits.add(hash);
        }
        mightHave(value) {
          return this.hashes(value).every(hash => this.bits.has(hash));
        }
      }
    options:
      - text: Bloom filter
        correct: true
      - text: LRU cache
        correct: false
      - text: Binary search tree
        correct: false
      - text: Deque
        correct: false
    explanation: Multiple hashes mark positions on insert, and lookup checks whether all hash positions are present. That can produce false positives, which is the key Bloom filter tradeoff.
    difficulty: principal
---

# Data Structures

Questions covering implementation and identification of common data structures.
