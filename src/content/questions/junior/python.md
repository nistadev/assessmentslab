---
defaultDomains:
- backend
defaultTopics:
- python
questions:
- q: Which Python technique most directly reduces memory use when processing very large datasets?
  options:
  - text: Use generators or iterators instead of loading full dataset into memory
    correct: true
  - text: Convert every record into a class instance before processing
    correct: false
  - text: Duplicate intermediate results so debugging is easier
    correct: false
  - text: Prefer nested Python loops over built-in iterables
    correct: false
  explanation: Generators and iterators let Python process data lazily, which avoids holding the full dataset at once. This
    is one of the most important memory-management techniques in data-heavy applications. Eager loading often fails first
    on memory, not CPU.
  difficulty: junior
- q: Which approach usually improves performance in Python data manipulation workloads?
  options:
  - text: Use vectorized operations in libraries such as pandas or NumPy
    correct: true
  - text: Replace every library call with manual Python loops
    correct: false
  - text: Copy arrays before each transformation to keep state explicit
    correct: false
  - text: Prefer linked lists for tabular analysis
    correct: false
  explanation: Vectorized operations push work into optimized native implementations and reduce Python-level loop overhead.
    For heavy numerical or tabular workloads, this is often the biggest performance win. Manual looping in Python usually
    becomes bottleneck.
  difficulty: junior
- q: What is effective first step when debugging a complex Python issue?
  options:
  - text: Use tracebacks, targeted logging, and a minimal reproducible case to narrow problem
    correct: true
  - text: Rewrite module from scratch before inspecting failure details
    correct: false
  - text: Disable tests so issue can be observed in production
    correct: false
  - text: Assume garbage collection is root cause
    correct: false
  explanation: Complex debugging becomes manageable when you reduce scope, inspect stack traces, and instrument behavior.
    Minimal repros reveal real cause faster than large-system guessing. Good debugging is systematic narrowing, not intuition
    alone.
  difficulty: junior
- q: What is main benefit of using `pdb` or IDE debuggers in Python?
  options:
  - text: They let you inspect execution state step by step instead of relying only on print statements
    correct: true
  - text: They compile Python code into faster machine code during debugging
    correct: false
  - text: They remove need for logs and tests permanently
    correct: false
  - text: They are useful only for syntax errors
    correct: false
  explanation: Interactive debugging tools provide breakpoints, stack inspection, variable introspection, and execution control.
    That is especially useful for branching logic and stateful bugs. They complement logs and tests rather than replacing
    them.
  difficulty: junior
- q: Which tools are commonly used to detect performance bottlenecks in Python data processing?
  options:
  - text: '`cProfile`, `line_profiler`, and `timeit`'
    correct: true
  - text: '`gc`, `venv`, and `black`'
    correct: false
  - text: '`pytest`, `pip`, and `mypy`'
    correct: false
  - text: '`pickle`, `ast`, and `argparse`'
    correct: false
  explanation: Profilers and benchmarking tools identify hotspots, per-line costs, and timing behavior so optimization effort
    goes where it matters. Without measurement, performance work often targets wrong area. Good tuning starts with evidence.
  difficulty: junior
---
