---
defaultDomains:
- frontend
- backend
defaultTopics:
- javascript-typescript
questions:
- q: Why is the first approach preferred?
  code: "type Res =\n  | { status: 'ok'; data: User }\n  | { status: 'error'; error: string }\n  | { status: 'loading' };\n\
    // vs\ntype Res2 = { data?: User; error?: string; loading?: boolean };"
  options:
  - text: It is not
    correct: false
  - text: Res is a discriminated union
    correct: true
  - text: Res2 causes more re-renders in React
    correct: false
  - text: Res2 is not valid TypeScript
    correct: false
  explanation: Res2 allows impossible states (data and error both set). Res is a discriminated union -- the status field narrows
    the type so TypeScript knows data only exists when status === 'ok'. Foundation of type-safe state machines in React. Eliminates
    null-check bugs at compile time.
  difficulty: principal
- q: What is Unpacked?
  code: 'const fn = async (): Promise<string> => "hello";

    type Unpacked = Awaited<ReturnType<typeof fn>>;'
  options:
  - text: Promise<string>
    correct: false
  - text: string
    correct: true
  - text: () => Promise<string>
    correct: false
  - text: Compile error
    correct: false
  explanation: 'ReturnType<typeof fn> extracts Promise<string>. Awaited<Promise<string>> unwraps the Promise to string. Awaited
    is the built-in utility that replaces manual infer-based unwrapping (T extends Promise<infer U> ? U : T). Common in utility
    types for async function return values in API layers.'
  difficulty: principal
---
