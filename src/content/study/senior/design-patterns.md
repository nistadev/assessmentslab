---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
lessons:
- title: Decorator handles cross-cutting behavior without polluting core code
  explanation: |
    At senior level, Decorator is about placing optional behavior around a stable operation without changing the operation itself.

    Retry, caching, authorization, tracing, rate limiting, metrics, validation, and logging often surround business actions. If each concern is mixed into the action directly, the action gains many reasons to change. A decorator keeps the core behavior focused and makes wrappers composable.

    Where to apply:
    Use Decorator when the added behavior can run before or after the wrapped operation while preserving the same call contract. This is common around HTTP clients, repositories, command handlers, background jobs, and framework route handlers. Stack decorators in an intentional order because retrying before logging is not the same as logging before retrying.

    Do not confuse with:
    Decorator should not secretly change the meaning of the operation. If a wrapper turns "charge payment" into "maybe enqueue payment later," callers need a different contract. Also avoid hiding critical business decisions inside generic-looking decorators.
  examples:
  - label: Retry decorator
    description: The original function stays focused on payment. Retry behavior surrounds it.
    code: |
      def retry(max_attempts):
          def decorate(func):
              def wrapper(*args, **kwargs):
                  for attempt in range(max_attempts):
                      try:
                          return func(*args, **kwargs)
                      except TimeoutError:
                          if attempt == max_attempts - 1:
                              raise
              return wrapper
          return decorate

      @retry(3)
      def call_payment_api(order_id):
          return gateway.capture(order_id)
  - label: Object decorator
    description: The wrapper keeps the same interface as the wrapped repository.
    code: |
      class CachedProductRepository:
          def __init__(self, repository, cache):
              self.repository = repository
              self.cache = cache

          def find_by_id(self, product_id):
              cached = self.cache.get(product_id)
              if cached is not None:
                  return cached
              product = self.repository.find_by_id(product_id)
              self.cache.set(product_id, product)
              return product
  - label: Order matters
    description: Observability wrappers should be ordered deliberately so metrics describe the intended behavior.
    code: |
      client = PaymentClient()
      client = RetryingPaymentClient(client, attempts=3)
      client = MeteredPaymentClient(client, metrics)
  difficulty: senior
- title: Command turns actions into objects that can be queued, audited, and undone
  explanation: |
    At senior level, Command is about separating "what should happen" from "when and how it runs."

    A command object packages an action and the data needed to perform it. That makes actions storable, queueable, retryable, loggable, permission-checkable, and reversible when an undo operation exists. The receiver can execute commands without knowing each concrete action's internal details.

    Where to apply:
    Use Command for undo/redo stacks, transactional workflows, background jobs, task queues, UI actions, game input, audit logs, and financial operations. Keep command contracts explicit: what inputs are captured, whether execution is idempotent, what failure means, and whether undo is guaranteed.

    Do not confuse with:
    Command is not required for every function call. If an action is immediate, local, and never needs queueing, auditing, retry, or undo, a direct method call is clearer. Command becomes valuable when actions need lifecycle management.
  examples:
  - label: Undoable text command
    description: Editor history stores commands and reverses the last action without knowing insert details.
    code: |
      class InsertText:
          def __init__(self, text):
              self.text = text

          def do(self, editor):
              editor.content += self.text

          def undo(self, editor):
              editor.content = editor.content[:-len(self.text)]

      editor.execute(InsertText("Hello"))
      editor.execute(InsertText(" World"))
      editor.undo()
  - label: Queueable command
    description: The command can be serialized or scheduled because it carries action intent.
    code: |
      class SendReceipt:
          def __init__(self, order_id):
              self.order_id = order_id

          def execute(self, receipts):
              receipts.send_for_order(self.order_id)

      queue.enqueue(SendReceipt(order.id))
  - label: Explicit failure semantics
    description: Commands that may be retried should define idempotency keys or duplicate handling.
    code: |
      class CapturePayment:
          def __init__(self, order_id, amount):
              self.order_id = order_id
              self.amount = amount
              self.idempotency_key = f"capture:{order_id}"
  difficulty: senior
- title: Proxy controls access to another object while preserving its interface
  explanation: |
    At senior level, Proxy is about standing in front of an object to control access, lifecycle, or cost while keeping the same surface.

    A proxy may lazy-load an expensive dependency, enforce authorization, cache remote results, add network boundaries, or protect a resource from invalid access. Callers still use the expected interface, but the proxy decides when and how the real subject is reached.

    Where to apply:
    Use Proxy when access itself has rules: remote service clients, lazy ORM relationships, protected documents, cached read models, expensive file loaders, and API clients with rate limits. Keep the proxy narrow and honest; callers should not need to know whether the real subject is local, remote, lazy, or protected.

    Do not confuse with:
    Proxy and Decorator both wrap objects. Decorator adds behavior around an operation as a feature. Proxy controls access to the underlying object. If the wrapper's main job is "should this call reach the real object and when?", it is probably a proxy.
  examples:
  - label: Lazy proxy
    description: The expensive report loads only when a caller actually asks for data.
    code: |
      class ReportProxy:
          def __init__(self, report_id, loader):
              self.report_id = report_id
              self.loader = loader
              self._report = None

          def rows(self):
              if self._report is None:
                  self._report = self.loader.load(self.report_id)
              return self._report.rows()
  - label: Protection proxy
    description: Access checks happen before the real document is returned.
    code: |
      class ProtectedDocument:
          def __init__(self, document, permissions):
              self.document = document
              self.permissions = permissions

          def read(self, user):
              self.permissions.require(user, "document:read")
              return self.document.read()
  - label: Do not surprise callers
    description: A remote proxy should preserve expected error and timeout behavior through a clear contract.
    code: |
      class InventoryClientProxy:
          def available(self, sku):
              return remote_inventory.available(sku, timeout=2)
  difficulty: senior
---
