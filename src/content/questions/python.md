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
    explanation: Generators and iterators let Python process data lazily, which avoids holding the full dataset at once. This is one of the most important memory-management techniques in data-heavy applications. Eager loading often fails first on memory, not CPU.
    difficulty: junior
  - q: Why might in-place operations be preferred when handling large Python data structures?
    options:
      - text: They can reduce extra object allocation and lower peak memory usage
        correct: true
      - text: They always run faster than any non in-place alternative
        correct: false
      - text: They eliminate need for garbage collection entirely
        correct: false
      - text: They automatically parallelize data processing
        correct: false
    explanation: In-place updates can avoid creating additional large objects, which helps memory pressure and peak RAM usage. They are not always faster or safer, but they are often useful in large data workflows. Tradeoff is mutability and sometimes readability.
    difficulty: mid
  - q: What is role of Python's `gc` module in memory management?
    options:
      - text: It gives developers visibility and control over garbage collection behavior
        correct: true
      - text: It replaces all reference counting in CPython
        correct: false
      - text: It automatically fixes every memory leak
        correct: false
      - text: It is mainly used for network connection pooling
        correct: false
    explanation: The `gc` module helps inspect and tune garbage collection, especially around cyclic references. It does not replace CPython's core memory model or magically fix leaks caused by retained references. It is diagnostic and control tooling, not a universal cure.
    difficulty: mid
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
    explanation: Vectorized operations push work into optimized native implementations and reduce Python-level loop overhead. For heavy numerical or tabular workloads, this is often the biggest performance win. Manual looping in Python usually becomes bottleneck.
    difficulty: junior
  - q: Why should Python data pipelines minimize unnecessary copying?
    options:
      - text: Extra copies waste memory and often add avoidable CPU overhead
        correct: true
      - text: Copies make debugging impossible
        correct: false
      - text: Copies disable pandas indexing optimizations globally
        correct: false
      - text: Copies are only expensive on Windows
        correct: false
    explanation: Copying large structures increases memory footprint and can slow down transformations substantially. In data workflows, accidental copies are common performance killers. Efficient code is deliberate about ownership and when duplication is truly needed.
    difficulty: mid
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
    explanation: Complex debugging becomes manageable when you reduce scope, inspect stack traces, and instrument behavior. Minimal repros reveal real cause faster than large-system guessing. Good debugging is systematic narrowing, not intuition alone.
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
    explanation: Interactive debugging tools provide breakpoints, stack inspection, variable introspection, and execution control. That is especially useful for branching logic and stateful bugs. They complement logs and tests rather than replacing them.
    difficulty: junior
  - q: Which testing practice most improves maintainability in large Python projects?
    options:
      - text: Structure code for testability and write automated tests around clear unit boundaries
        correct: true
      - text: Depend mainly on manual QA because Python is dynamic
        correct: false
      - text: Avoid mocking because external systems should always be hit directly
        correct: false
      - text: Measure success only by line count in test files
        correct: false
    explanation: Testable design usually means separation of concerns, small units, and explicit dependencies. That makes automated testing practical and resilient. Manual validation alone does not scale across large codebases.
    difficulty: mid
  - q: Why are mocks useful in Python unit tests?
    options:
      - text: They isolate code under test from external systems and make edge cases easier to simulate
        correct: true
      - text: They increase production performance of the tested module
        correct: false
      - text: They replace need for integration tests entirely
        correct: false
      - text: They guarantee implementation details never change
        correct: false
    explanation: Mocks help test behavior without depending on live networks, databases, or third-party services. They improve speed and determinism, especially for failure-path testing. But they should complement, not replace, higher-level integration coverage.
    difficulty: mid
  - q: Which pandas technique is especially useful for hierarchical analytical data?
    options:
      - text: Multi-indexing
        correct: true
      - text: Replacing all indexes with plain Python lists
        correct: false
      - text: Avoiding groupby in favor of row-by-row mutation
        correct: false
      - text: Converting every column to object dtype
        correct: false
    explanation: Multi-indexing helps represent and query hierarchical dimensions in tabular form. It can simplify certain grouped operations and slicing patterns. Like many pandas features, it is powerful when used intentionally, not automatically.
    difficulty: senior
  - q: Why can categorical dtypes improve pandas performance for some datasets?
    options:
      - text: They reduce memory usage and can speed operations on repeated string-like values
        correct: true
      - text: They make all joins constant time
        correct: false
      - text: They are always better than numeric types
        correct: false
      - text: They disable missing values in grouped data
        correct: false
    explanation: Categorical columns store repeated labels more efficiently than plain object strings and can improve some operations. They are especially useful for low-cardinality repeated values. Type choice should follow data shape and workload.
    difficulty: senior
  - q: How do tools like `tracemalloc` and `memory_profiler` help with memory leaks?
    options:
      - text: They show allocation patterns and memory growth so retained objects and hotspots can be identified
        correct: true
      - text: They automatically free leaked objects during profiling runs
        correct: false
      - text: They work only for C extensions, not Python objects
        correct: false
      - text: They replace need for heap snapshots or object inspection
        correct: false
    explanation: Memory tools surface where memory is allocated and how usage changes over time, which is critical for leak diagnosis. They provide evidence, not automatic fixes. Developers still need to interpret retention patterns and object lifetimes.
    difficulty: mid
  - q: What is `objgraph` most useful for when diagnosing Python memory issues?
    options:
      - text: Visualizing object relationships and unexpectedly retained references
        correct: true
      - text: Benchmarking CPU-intensive loops
        correct: false
      - text: Linting unused imports
        correct: false
      - text: Building pandas pivot tables
        correct: false
    explanation: "`objgraph` helps inspect object growth and reference chains, which is valuable when leak cause is retained objects rather than raw allocation volume. It is a diagnostic graphing tool, not general profiler. Reference visibility is often what unlocks leak debugging."
    difficulty: principal
  - q: What is practical strategy for handling huge datasets in memory-constrained Python environments?
    options:
      - text: Process data in chunks or streams, and consider memmap or out-of-core frameworks
        correct: true
      - text: Increase recursion depth so larger data can be processed in one call
        correct: false
      - text: Convert all files to JSON before loading
        correct: false
      - text: Avoid batching because it complicates code structure
        correct: false
    explanation: Chunked processing, iterators, memory-mapped arrays, and out-of-core tools like Dask help Python work beyond RAM limits. This is often more realistic than trying to fit everything in memory. Architecture should respect hardware constraints.
    difficulty: mid
  - q: Why is property-based testing useful in Python reliability work?
    options:
      - text: It explores broad input spaces and can reveal edge cases example-based tests miss
        correct: true
      - text: It replaces unit and integration tests completely
        correct: false
      - text: It works only for mathematical code
        correct: false
      - text: It guarantees 100 percent branch coverage
        correct: false
    explanation: Property-based testing libraries such as Hypothesis generate varied inputs based on behavioral rules, which often exposes hidden edge cases. It complements traditional test cases well. In reliability-focused systems, that broader search is valuable.
    difficulty: senior
  - q: Which tools are commonly used to detect performance bottlenecks in Python data processing?
    options:
      - text: "`cProfile`, `line_profiler`, and `timeit`"
        correct: true
      - text: "`gc`, `venv`, and `black`"
        correct: false
      - text: "`pytest`, `pip`, and `mypy`"
        correct: false
      - text: "`pickle`, `ast`, and `argparse`"
        correct: false
    explanation: Profilers and benchmarking tools identify hotspots, per-line costs, and timing behavior so optimization effort goes where it matters. Without measurement, performance work often targets wrong area. Good tuning starts with evidence.
    difficulty: junior
---

# Python Questions

Conceptual Python questions covering memory management, performance, debugging, testing, pandas techniques, profiling, and large-dataset processing.
