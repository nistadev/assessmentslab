---
defaultDomains:
- backend
defaultTopics:
- python
questions:
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
  explanation: Multi-indexing helps represent and query hierarchical dimensions in tabular form. It can simplify certain grouped
    operations and slicing patterns. Like many pandas features, it is powerful when used intentionally, not automatically.
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
  explanation: Categorical columns store repeated labels more efficiently than plain object strings and can improve some operations.
    They are especially useful for low-cardinality repeated values. Type choice should follow data shape and workload.
  difficulty: senior
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
  explanation: Property-based testing libraries such as Hypothesis generate varied inputs based on behavioral rules, which
    often exposes hidden edge cases. It complements traditional test cases well. In reliability-focused systems, that broader
    search is valuable.
  difficulty: senior
---
