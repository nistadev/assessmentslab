---
defaultDomains:
- frontend
- backend
defaultTopics:
- javascript-typescript
questions:
- q: What do A and B evaluate to?
  code: 'type Flatten<T> = T extends Array<infer U> ? U : T;

    type A = Flatten<string[]>;

    type B = Flatten<number>;'
  options:
  - text: A = string[], B = number
    correct: false
  - text: A = string, B = number
    correct: true
  - text: A = string, B = never
    correct: false
  - text: Compile error
    correct: false
  explanation: Conditional types with infer extract the inner type. Flatten<string[]> infers U = string and returns string.
    Flatten<number> does not match Array<infer U> so it returns T as-is (number). Used in tRPC to unwrap Promise<T> or Array<T>
    from API return types.
  difficulty: junior
- q: 'What does Getters<{ name: string }> produce?'
  code: "type Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]\n};"
  options:
  - text: '{ name: string }'
    correct: false
  - text: '{ getName: () => string }'
    correct: true
  - text: Compile error
    correct: false
  - text: '{ getname: () => string }'
    correct: false
  explanation: Template literal types + the 'as' key remapping clause transform key names. Capitalize uppercases the first
    letter. Used in codegen tools, ORM query builders, and design systems that auto-generate accessor APIs from a base schema
    definition.
  difficulty: junior
- q: What are common challenges in asynchronous JavaScript code?
  options:
  - text: Callback nesting, error handling complexity, and race conditions
    correct: true
  - text: Lack of any built-in concurrency primitives whatsoever
    correct: false
  - text: Automatic deadlocks caused by `let` and `const`
    correct: false
  - text: Functions losing lexical scope by default
    correct: false
  explanation: Async JavaScript is often hard because control flow becomes indirect, failures can be missed, and operations
    may complete in unexpected order. Promises, async/await, and careful sequencing exist largely to manage these issues more
    clearly.
  difficulty: junior
- q: Which tools most directly improve readability in complex asynchronous JavaScript?
  options:
  - text: Promises and async/await
    correct: true
  - text: Deeply nested anonymous callbacks
    correct: false
  - text: '`var` hoisting patterns'
    correct: false
  - text: Global mutable state for coordination
    correct: false
  explanation: Promises and async/await flatten async control flow, making sequencing and error handling much easier to follow.
    They do not solve all concurrency issues, but they are major readability improvement over nested callback chains.
  difficulty: junior
- q: What is difference between throttling and debouncing high-frequency JavaScript events?
  domains:
  - frontend
  options:
  - text: Throttling limits handler to at most once per interval, while debouncing waits until activity stops
    correct: true
  - text: Debouncing runs continuously and throttling runs only once at end
    correct: false
  - text: They are identical terms for event delegation
    correct: false
  - text: Both are useful only for network requests, not UI events
    correct: false
  explanation: Throttling and debouncing both reduce event pressure, but they solve different timing problems. Throttle is
    useful for steady updates like scroll position; debounce is useful when only final settled input matters, such as search
    typing.
  difficulty: junior
---
