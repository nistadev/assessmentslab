---
defaultDomains:
- frontend
defaultTopics:
- react
questions:
- q: How many times does the effect run after 3 clicks?
  code: "function App() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    document.title = count;\n  });\n\
    \  return <button onClick={() => setCount(c => c+1)}>{count}</button>;\n}"
  options:
  - text: '1'
    correct: false
  - text: '3'
    correct: true
  - text: '4'
    correct: false
  - text: '0'
    correct: false
  explanation: No dependency array means effect runs after every render. But prompt says `after 3 clicks`, so by quiz wording
    rule you do not count initial mount. Three clicks cause three more renders, so effect runs 3 times for those clicks. If
    question asked total runs including mount, answer would be 4.
  difficulty: senior
- q: Does "child render" log on every Parent re-render?
  code: "const MemoChild = React.memo(function Child({ onClick }) {\n  console.log(\"child render\");\n  return <button onClick={onClick}>click</button>;\n\
    });\nfunction Parent() {\n  const [n, setN] = useState(0);\n  const handleClick = () => setN(n => n + 1);\n  return (\n\
    \    <>\n      <MemoChild onClick={handleClick} />\n      <p>{n}</p>\n    </>\n  );\n}"
  options:
  - text: No, React.memo prevents it
    correct: false
  - text: Yes, handleClick is a new
    correct: true
  - text: Only on the first render
    correct: false
  - text: Only when n changes to an even number
    correct: false
  explanation: 'React.memo does shallow prop comparison. handleClick is inline -- new function reference every render. To
    memo, onClick changed every time. Fix: wrap in useCallback(). Without it, React.memo around Child is effectively useless.'
  difficulty: senior
- q: How many times does "render" log after one click?
  code: "function App() {\n  const [a, setA] = useState(0);\n  const [b, setB] = useState(0);\n  const handleClick = () =>\
    \ {\n    setA(1);\n    setB(1);\n  };\n  console.log(\"render\");\n  return <button onClick={handleClick}>go</button>;\n\
    }"
  options:
  - text: '2'
    correct: false
  - text: '1'
    correct: true
  - text: '0'
    correct: false
  - text: Depends on React version
    correct: false
  explanation: 'React 18 batches both state updates in same click handler into one re-render. Since prompt says `after one
    click`, count only click-triggered logs, not initial mount. Result: `render` logs once after click. Total including mount
    would be 2.'
  difficulty: senior
- q: Why is `ignore` used here?
  code: "function Search({ term }) {\n  const [results, setResults] = useState([]);\n  useEffect(() => {\n    let ignore =\
    \ false;\n    fetch(`/api/search?q=${term}`)\n      .then(r => r.json())\n      .then(data => {\n        if (!ignore)\
    \ setResults(data);\n      });\n    return () => {\n      ignore = true;\n    };\n  }, [term]);\n  return <pre>{JSON.stringify(results)}</pre>;\n\
    }"
  options:
  - text: To debounce requests so only one request is sent
    correct: false
  - text: To prevent older async responses from overwriting newer state after term changes
    correct: true
  - text: To force effect to run only once
    correct: false
  - text: To avoid fetch throwing on unmount
    correct: false
  explanation: When term changes quickly, earlier requests may resolve after later ones. Without the cleanup flag, stale response
    data can overwrite newer results. `ignore` does not cancel the request; it only prevents outdated completion handlers
    from calling setResults. This is classic effect race-condition protection.
  difficulty: senior
- q: After clicking button and waiting, what value is repeatedly saved?
  code: "function useAutoSave(value) {\n  useEffect(() => {\n    const id = setInterval(() => {\n      save(value);\n    },\
    \ 1000);\n    return () => clearInterval(id);\n  }, []);\n}\nfunction Editor() {\n  const [text, setText] = useState(\"\
    A\");\n  useAutoSave(text);\n  return <button onClick={() => setText(\"B\")}>{text}</button>;\n}"
  options:
  - text: '"B"'
    correct: false
  - text: '"A"'
    correct: true
  - text: Both "A" and "B" alternating
    correct: false
  - text: Nothing, because cleanup clears interval immediately
    correct: false
  explanation: Effect has empty deps, so interval callback closes over initial `value` only. After text changes to B, interval
    keeps calling `save('A')`. This is stale-closure bug inside side effects. Fix with `[value]`, a ref pattern, or event-style
    APIs depending on save requirements.
  difficulty: senior
- q: Why useRef here instead of useState?
  code: "function Form() {\n  const inputRef = useRef(null);\n  useEffect(() => {\n    inputRef.current.focus();\n  }, []);\n\
    \  return <input ref={inputRef} />;\n}"
  options:
  - text: Because refs store DOM nodes without causing re-renders when updated
    correct: true
  - text: Because state cannot hold objects
    correct: false
  - text: Because refs are reactive and rerender automatically
    correct: false
  - text: Because focus only works in reducers
    correct: false
  explanation: '`useRef` is for mutable value that survives renders without triggering one. DOM node references are perfect
    fit. If this lived in state, setting it would add unnecessary render churn and complicate imperative DOM access. Common
    hook interview topic: state is for UI data, ref is for mutable instance-like storage.'
  difficulty: senior
- q: What does Header render?
  code: "const AuthContext = React.createContext(null);\nfunction Header() {\n  const auth = useContext(AuthContext);\n  return\
    \ <p>{auth?.user?.name ?? \"guest\"}</p>;\n}\nfunction App() {\n  return <Header />;\n}"
  options:
  - text: '"guest"'
    correct: true
  - text: '"null"'
    correct: false
  - text: Throws because provider is missing
    correct: false
  - text: undefined
    correct: false
  explanation: When no provider exists above consumer, `useContext(AuthContext)` returns context default value, here `null`.
    Optional chaining plus nullish coalescing falls back to 'guest'. Missing provider does not throw by itself unless custom
    hook explicitly checks for it.
  difficulty: senior
- q: After one click, what shows?
  code: "function reducer(state, action) {\n  switch (action.type) {\n    case \"toggle\":\n      return { ...state, open:\
    \ !state.open };\n    case \"rename\":\n      return { ...state, name: action.name };\n    default:\n      return state;\n\
    \  }\n}\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { open: false, name: \"A\" });\n  const click\
    \ = () => {\n    dispatch({ type: \"toggle\" });\n    dispatch({ type: \"rename\", name: \"B\" });\n  };\n  return <button\
    \ onClick={click}>{state.open ? state.name : \"closed\"}</button>;\n}"
  options:
  - text: '"closed"'
    correct: false
  - text: '"A"'
    correct: false
  - text: '"B"'
    correct: true
  - text: Nothing until second click
    correct: false
  explanation: 'Reducer actions process in order against updated state. First action opens panel. Second action renames to
    B. Final state is `{ open: true, name: ''B'' }`, so button shows B. Good reducer question because multiple fields change
    in one event without stale state confusion.'
  difficulty: senior
- q: Why is useCallback useful here?
  code: "function App() {\n  const [count, setCount] = useState(0);\n  const increment = useCallback(() => setCount(c => c\
    \ + 1), []);\n  return <Child onAdd={increment} />;\n}\nconst Child = React.memo(function Child({ onAdd }) {\n  console.log(\"\
    child render\");\n  return <button onClick={onAdd}>add</button>;\n});"
  options:
  - text: It makes setCount synchronous
    correct: false
  - text: It keeps onAdd reference stable so memo child can avoid re-render from prop identity changes
    correct: true
  - text: It prevents Child from ever rendering
    correct: false
  - text: It batches multiple updates automatically
    correct: false
  explanation: '`React.memo` shallow-compares props. Without `useCallback`, inline handler would be new function each render
    and break memoization. Here callback has no changing dependencies because functional updater removes need to read `count`
    from closure. Classic correct use of `useCallback`.'
  difficulty: senior
- q: How many times is "child visible" logged after one click?
  code: "function Child({ visible = true }) {\n  if (visible) console.log(\"child visible\");\n  return visible ? <p>shown</p>\
    \ : null;\n}\nfunction App() {\n  const [show, setShow] = useState(false);\n  return (\n    <>\n      <button onClick={()\
    \ => setShow(true)}>show</button>\n      <Child visible={show} />\n    </>\n  );\n}"
  options:
  - text: '0'
    correct: false
  - text: '1'
    correct: true
  - text: '2'
    correct: false
  - text: '3'
    correct: false
  explanation: On first render show=false, so nothing logs. After click show=true, Child re-renders and condition passes once,
    so `child visible` logs once.
  difficulty: senior
- q: How many logs happen after one click? Count both "app" and "child".
  code: "function Child() {\n  console.log(\"child\");\n  return <p>child</p>;\n}\nfunction App() {\n  const [open, setOpen]\
    \ = useState(false);\n  console.log(\"app\");\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>open</button>\n\
    \      {open ? <Child /> : null}\n    </>\n  );\n}"
  options:
  - text: 1 app, 0 child
    correct: false
  - text: 1 app, 1 child
    correct: true
  - text: 2 app, 1 child
    correct: false
  - text: 2 app, 2 child
    correct: false
  explanation: 'Click sets open=true. App re-renders and logs `app` once. Because open is now true, Child mounts and logs
    `child` once. Since question says `after one click`, initial mount `app` log is excluded. Total after click: 1 app, 1
    child.'
  difficulty: senior
- q: Why can poor state structure hurt React performance?
  options:
  - text: It can trigger unnecessary re-renders, deep update chains, and harder-to-maintain component logic
    correct: true
  - text: It stops React from reconciling DOM at all
    correct: false
  - text: It forces all hooks to run asynchronously
    correct: false
  - text: It affects only class components, not function components
    correct: false
  explanation: State shape influences how often components re-render, how difficult updates become, and how much data must
    be passed around. Nested state and excessive prop drilling increase churn and complexity. Good state design is major performance
    and maintainability lever.
  difficulty: senior
- q: Why do React teams still care about transpilation strategy when using ES6+ syntax?
  options:
  - text: Modern syntax improves developer experience, but build tooling must still ensure target environment compatibility
    correct: true
  - text: React runs only in browsers with native support for every ES6+ feature
    correct: false
  - text: Transpilation is needed only for CSS modules, not JavaScript
    correct: false
  - text: ES6+ syntax and browser compatibility are unrelated concerns
    correct: false
  explanation: Destructuring, modules, arrow functions, and other syntax improve code clarity, but shipped code must still
    work in supported environments. Tooling like Babel or framework compilers bridges that gap. Team consistency also matters
    so features are used intentionally and predictably.
  difficulty: senior
- q: <PrimaryButton color="red" /> -- what props does Button receive?
  code: "function withDefaults(Component, defaults) {\n  return function WithDefaults(props) {\n    return <Component {...defaults}\
    \ {...props} />;\n  };\n}\nconst PrimaryButton = withDefaults(Button, { color: \"blue\", size: \"md\" });"
  topics:
  - react
  - design-patterns
  options:
  - text: '{ color: ''blue'', size: ''md'' }'
    correct: false
  - text: '{ color: ''red'', size: ''md'' }'
    correct: true
  - text: '{ color: ''blue'', size: ''md'', color: ''red'' }'
    correct: false
  - text: '{ color: ''red'' }'
    correct: false
  explanation: 'Spread order matters. {...defaults} applies first (color:''blue'', size:''md''), then {...props} overrides
    (color:''red''). Final: {color:''red'', size:''md''}. Caller always wins. If reversed ({...props} then {...defaults}),
    defaults would always win and callers could never override. A common HOC bug.'
  difficulty: senior
- q: Chart throws during render. What does SafeChart show?
  code: "function withErrorBoundary(Component) {\n  return class extends React.Component {\n    state = { error: null };\n\
    \    static getDerivedStateFromError(e) { return { error: e }; }\n    render() {\n      if (this.state.error)\n      \
    \  return <p>Error: {this.state.error.message}</p>;\n      return <Component {...this.props} />;\n    }\n  };\n}\nconst\
    \ SafeChart = withErrorBoundary(Chart);"
  topics:
  - react
  - design-patterns
  options:
  - text: The error propagates to the nearest parent boundary
    correct: false
  - text: '<p>Error: {the error message}</p>'
    correct: true
  - text: Nothing
    correct: false
  - text: Chart retries rendering automatically
    correct: false
  explanation: getDerivedStateFromError catches the throw during Chart's render phase and sets error in the HOC's class state.
    The next render hits the guard and returns the fallback. Error boundaries MUST be class components -- getDerivedStateFromError
    cannot be implemented in a function component. The boundary only catches errors in its children, not itself.
  difficulty: senior
- q: A component only needs field validation, nothing else. Which approach is better and why?
  code: "// Option A: One hook does everything\nfunction useForm(config) {\n  // validation + submission + dirty tracking\
    \ + field state\n}\n\n// Option B: Focused hooks\nconst useFormField = (name) => { /* value, onChange, error for one field\
    \ */ };\nconst useFormSubmit = (onSubmit) => { /* submission only */ };\nconst useFormDirty = () => { /* dirty tracking\
    \ only */ };"
  topics:
  - react
  - solid-principles
  options:
  - text: Option A
    correct: false
  - text: Option B
    correct: true
  - text: They are identical
    correct: false
  - text: Option A is better for testing
    correct: false
  explanation: 'ISP: do not force clients to depend on interfaces they do not use. A single useForm() couples components needing
    field validation to submission logic. Splitting into focused hooks means a field component only imports what it needs.
    React Query, React Hook Form, and Zustand all follow this -- expose granular hooks so you only subscribe to the slice
    you consume.'
  difficulty: senior
- q: What does the selectData argument demonstrate architecturally?
  code: "function withSubscription(Component, selectData) {\n  return function(props) {\n    const store = useContext(StoreContext);\n\
    \    const data = selectData(store);\n    return <Component {...props} data={data} />;\n  };\n}\nconst ConnectedList =\
    \ withSubscription(List, store => store.items);"
  topics:
  - react
  - solid-principles
  options:
  - text: SRP
    correct: false
  - text: DIP
    correct: true
  - text: OCP
    correct: false
  - text: LSP
    correct: false
  explanation: 'DIP: withSubscription does not know store.items exists -- it delegates that knowledge to the caller via selectData.
    This is exactly how react-redux''s connect(mapStateToProps) works. The HOC is reusable across any store shape. selectData
    functions are pure and independently testable. Three layers of dependency inversion in one pattern.'
  difficulty: senior
---
