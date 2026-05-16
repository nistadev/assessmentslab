---
defaultDomains:
- computer-science
defaultTopics:
- data-structures
lessons:
- title: Pick collections by lookup and update needs
  explanation: |
    Arrays, sets, and maps solve different access problems.

    Arrays preserve order and support indexed traversal. Sets answer membership questions without scanning every item. Maps associate one key with one value. Most data-structure choices start by asking which operation must stay cheap: append, lookup by position, membership check, or lookup by key.
  examples:
  - label: Linear membership scan
    description: This works for small lists, but every lookup may scan the whole array.
    code: |
      blocked_users = ["ana", "lee", "sam"]

      def can_post(user):
          return user not in blocked_users
  - label: Set membership
    description: A set communicates uniqueness and gives fast membership checks.
    code: |
      blocked_users = {"ana", "lee", "sam"}

      def can_post(user):
          return user not in blocked_users
  - label: Map lookup
    description: Use a map when a stable key should retrieve a related value.
    code: |
      users_by_id = {
          "u_1": {"name": "Ana"},
          "u_2": {"name": "Lee"},
      }

      user = users_by_id.get("u_2")
  difficulty: junior
- title: Stacks and queues encode processing order
  explanation: |
    Stack and queue names describe removal order.

    A stack is last-in, first-out. It matches undo history, nested parsing, and depth-first traversal. A queue is first-in, first-out. It matches background jobs, breadth-first traversal, and fair request handling. The data structure makes the processing policy explicit.
  examples:
  - label: Stack for undo
    description: Last action should be undone first.
    code: |
      undo_stack = []

      undo_stack.append(("rename", "draft.md"))
      undo_stack.append(("delete", "notes.md"))

      action = undo_stack.pop()
  - label: Queue for jobs
    description: First enqueued job should run first.
    code: |
      from collections import deque

      jobs = deque()
      jobs.append("send-email")
      jobs.append("render-invoice")

      next_job = jobs.popleft()
  difficulty: junior
---
