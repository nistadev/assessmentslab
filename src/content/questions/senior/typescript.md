---
defaultDomains:
- frontend
- backend
defaultTopics:
- javascript-typescript
questions:
- q: What does 'satisfies' do differently than a type annotation?
  code: "const palette = {\n  red: [255, 0, 0],\n  blue: '0000ff'\n} satisfies Record<string, string | number[]>;"
  options:
  - text: Identical to annotating with Record<string, string | number[]>
    correct: false
  - text: Validates shape but preserves literal types
    correct: true
  - text: Throws a runtime error if types mismatch
    correct: false
  - text: Makes all fields readonly
    correct: false
  explanation: satisfies validates without widening. With annotation palette.red becomes string | number[] and you lose array
    methods. With satisfies palette.red is still number[] and palette.blue is still string. Critical for config and theme
    objects where you want type safety AND precise autocomplete per field.
  difficulty: senior
- q: Which line causes a TypeScript compile error?
  code: "function parseResponse(raw: unknown) {\n  console.log(raw.name); // line A\n  if (typeof raw === 'object' && raw\
    \ !== null && 'name' in raw) {\n    console.log((raw as { name: string }).name); // line B\n  }\n}"
  options:
  - text: Neither
    correct: false
  - text: Line A
    correct: true
  - text: Line B
    correct: false
  - text: Both lines
    correct: false
  explanation: unknown is the type-safe counterpart to any. You cannot access properties or call methods on unknown without
    first narrowing via typeof, instanceof, or a type guard. Line A compiles to a TypeScript error. Line B is correct -- the
    typeof + in check narrows the type before access. This is why JSON.parse should return unknown not any.
  difficulty: senior
- q: What is key effect of hoisting on JavaScript scoping behavior?
  options:
  - text: Declarations are processed before execution, which can create surprising `undefined` access or shadowing issues
    correct: true
  - text: JavaScript moves runtime values to global scope automatically
    correct: false
  - text: Hoisting affects only functions, never variables
    correct: false
  - text: Hoisting removes differences between `var`, `let`, and `const`
    correct: false
  explanation: Hoisting changes when bindings become known within scope, and misunderstanding it leads to bugs around initialization,
    shadowing, and callback behavior. `var`, `let`, and `const` still behave differently because of function scope and temporal
    dead zone rules.
  difficulty: senior
- q: What is advanced use of closures in asynchronous JavaScript workflows?
  options:
  - text: Preserving private state for memoization, deferred execution, or higher-order async utilities
    correct: true
  - text: Preventing promises from resolving until garbage collection runs
    correct: false
  - text: Making all asynchronous operations synchronous
    correct: false
  - text: Replacing modules as scope boundary mechanism entirely
    correct: false
  explanation: Closures are powerful in async workflows because they retain state across later execution points. That enables
    patterns like memoization, factories, deferred actions, and custom control-flow helpers. These patterns are common in
    sophisticated JS utilities.
  difficulty: senior
---
