---
defaultDomains:
- computer-science
defaultTopics:
- design-patterns
questions:
- q: What pattern? What does @retry(3) do to call_payment_api?
  code: "def retry(max_attempts: int):\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            for attempt\
    \ in range(max_attempts):\n                try:\n                    return func(*args, **kwargs)\n                except\
    \ Exception:\n                    if attempt == max_attempts - 1:\n                        raise\n        return wrapper\n\
    \    return decorator\n\n@retry(3)\ndef call_payment_api(order_id: str):\n    # may raise on transient network errors\n\
    \    ..."
  options:
  - text: Decorator pattern
    correct: true
  - text: Strategy
    correct: false
  - text: Template Method
    correct: false
  - text: Proxy
    correct: false
  explanation: Decorator pattern. @retry(3) replaces call_payment_api with wrapper, which transparently adds retry behavior.
    The original function is unchanged and unaware of the wrapping. Python's @ syntax is syntactic sugar for call_payment_api
    = retry(3)(call_payment_api). Used in production for rate limiting, caching (@functools.lru_cache), authentication, and
    logging -- any cross-cutting concern that should not pollute business logic.
  difficulty: senior
- q: What is printed?
  code: "class TextEditor:\n    def __init__(self):\n        self.content = \"\"\n        self._history = []\n\n    def execute(self,\
    \ command):\n        command.do(self)\n        self._history.append(command)\n\n    def undo(self):\n        if self._history:\n\
    \            self._history.pop().undo(self)\n\nclass Insert:\n    def __init__(self, text): self.text = text\n    def\
    \ do(self, ed): ed.content += self.text\n    def undo(self, ed): ed.content = ed.content[:-len(self.text)]\n\ned = TextEditor()\n\
    ed.execute(Insert(\"Hello\"))\ned.execute(Insert(\" World\"))\ned.undo()\nprint(ed.content)"
  options:
  - text: '"Hello"'
    correct: true
  - text: '""'
    correct: false
  - text: '"Hello World"'
    correct: false
  - text: '" World"'
    correct: false
  explanation: Command pattern. Each command encapsulates an action and its inverse. undo() pops the last command and calls
    its undo(), removing ' World'. ed.content is 'Hello'. The history stack enables unlimited undo/redo without the editor
    knowing how to reverse any specific action. Used in text editors, game engines, financial transaction logs, and any system
    requiring auditability or rollback.
  difficulty: senior
---
