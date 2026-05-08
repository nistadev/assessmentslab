---
defaultDomains:
- backend
defaultTopics:
- python
questions:
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
  explanation: In-place updates can avoid creating additional large objects, which helps memory pressure and peak RAM usage.
    They are not always faster or safer, but they are often useful in large data workflows. Tradeoff is mutability and sometimes
    readability.
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
  explanation: The `gc` module helps inspect and tune garbage collection, especially around cyclic references. It does not
    replace CPython's core memory model or magically fix leaks caused by retained references. It is diagnostic and control
    tooling, not a universal cure.
  difficulty: mid
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
  explanation: Copying large structures increases memory footprint and can slow down transformations substantially. In data
    workflows, accidental copies are common performance killers. Efficient code is deliberate about ownership and when duplication
    is truly needed.
  difficulty: mid
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
  explanation: Testable design usually means separation of concerns, small units, and explicit dependencies. That makes automated
    testing practical and resilient. Manual validation alone does not scale across large codebases.
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
  explanation: Mocks help test behavior without depending on live networks, databases, or third-party services. They improve
    speed and determinism, especially for failure-path testing. But they should complement, not replace, higher-level integration
    coverage.
  difficulty: mid
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
  explanation: Memory tools surface where memory is allocated and how usage changes over time, which is critical for leak
    diagnosis. They provide evidence, not automatic fixes. Developers still need to interpret retention patterns and object
    lifetimes.
  difficulty: mid
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
  explanation: Chunked processing, iterators, memory-mapped arrays, and out-of-core tools like Dask help Python work beyond
    RAM limits. This is often more realistic than trying to fit everything in memory. Architecture should respect hardware
    constraints.
  difficulty: mid
---
