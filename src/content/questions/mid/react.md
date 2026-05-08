---
defaultDomains:
- frontend
defaultTopics:
- react
questions:
- q: After one click, what does the button show?
  code: "function Counter() {\n  const [count, setCount] = useState(0);\n  const handleClick = () => {\n    setCount(count\
    \ + 1);\n    setCount(count + 1);\n    setCount(count + 1);\n  };\n  return <button onClick={handleClick}>{count}</button>;\n\
    }"
  options:
  - text: '3'
    correct: false
  - text: '2'
    correct: false
  - text: '1'
    correct: true
  - text: '0'
    correct: false
  explanation: 'All three calls read the same stale count=0 from the closure, so each is setCount(0+1). React batches them
    -- final result: 1. To get 3, use functional updater: setCount(c => c+1) which chains off the queued value.'
  difficulty: mid
- q: Does Child reuse its state when toggled?
  code: "function App() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen(o\
    \ => !o)}>toggle</button>\n      {open ? <Child key=\"a\" /> : <Child key=\"b\" />}\n    </>\n  );\n}\nfunction Child()\
    \ {\n  const [n] = useState(Math.random());\n  return <p>{n}</p>;\n}"
  options:
  - text: Yes, same component type so
    correct: false
  - text: No, different keys force unmount
    correct: true
  - text: Yes, useState only initializes once
    correct: false
  - text: Depends on React version
    correct: false
  explanation: Different keys ('a' vs 'b') tell React these are completely different instances. React unmounts the old and
    mounts a new one, so useState re-runs and Math.random() produces a new number every toggle. Key is React's identity signal,
    not just a perf hint.
  difficulty: mid
- q: What is the bug when id prop changes?
  code: "function Profile({ id }) {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetchUser(id).then(setData);\n\
    \  }, []);\n  return <div>{data?.name}</div>;\n}"
  options:
  - text: No bug
    correct: false
  - text: Effect never re-runs when id changes
    correct: true
  - text: fetchUser is missing from deps and will throw
    correct: false
  - text: setData causes infinite re-renders
    correct: false
  explanation: '[] means run once on mount. If id changes, the effect never fires again -- Profile keeps showing data from
    the original id. Fix: add id to deps [id]. One of the most common production React bugs. ESLint exhaustive-deps catches
    it automatically.'
  difficulty: mid
- q: What renders on initial mount?
  code: "function usePrevious(value) {\n  const ref = useRef();\n  useEffect(() => {\n    ref.current = value;\n  });\n  return\
    \ ref.current;\n}\nfunction App() {\n  const [n, setN] = useState(0);\n  const prev = usePrevious(n);\n  return <p>{prev}\
    \ -> {n}</p>;\n}"
  options:
  - text: '"0 -> 0"'
    correct: false
  - text: '"undefined -> 0"'
    correct: true
  - text: '"null -> 0"'
    correct: false
  - text: Error
    correct: false
  explanation: 'On initial render: ref.current is undefined (no initial value). The render returns undefined and 0. The effect
    runs AFTER render and sets ref.current = 0. So on mount you see ''undefined -> 0''. On next render after setN you see
    ''0 -> 1''. The effect always runs after the render it belongs to.'
  difficulty: mid
- q: What happens to Label after clicking "inc" once?
  code: "const CountContext = React.createContext(0);\nconst Label = React.memo(function Label() {\n  const count = useContext(CountContext);\n\
    \  console.log(\"label render\");\n  return <span>{count}</span>;\n});\nfunction App() {\n  const [count, setCount] =\
    \ useState(0);\n  return (\n    <CountContext.Provider value={count}>\n      <button onClick={() => setCount(c => c +\
    \ 1)}>inc</button>\n      <Label />\n    </CountContext.Provider>\n  );\n}"
  options:
  - text: It does not render because React.memo blocks it
    correct: false
  - text: It re-renders because context value changed
    correct: true
  - text: It unmounts and remounts
    correct: false
  - text: It throws because useContext cannot be used inside memo
    correct: false
  explanation: Context updates bypass prop memoization. `React.memo` only shallow-compares props, but `useContext(CountContext)`
    subscribes the component to provider value changes. After count changes from 0 to 1, Label re-renders even though it has
    no props. This catches teams that wrap everything in memo and expect context consumers to stop rendering.
  difficulty: mid
- q: After one click, what shows?
  code: "function reducer(state, action) {\n  switch (action.type) {\n    case \"add\":\n      return { count: state.count\
    \ + action.value };\n    case \"reset\":\n      return { count: 0 };\n    default:\n      return state;\n  }\n}\nfunction\
    \ Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 1 });\n  return (\n    <button\n      onClick={()\
    \ => {\n        dispatch({ type: \"add\", value: 2 });\n        dispatch({ type: \"add\", value: 3 });\n      }}\n   \
    \ >\n      {state.count}\n    </button>\n  );\n}"
  options:
  - text: '3'
    correct: false
  - text: '4'
    correct: false
  - text: '6'
    correct: true
  - text: '1'
    correct: false
  explanation: Reducer updates queue in order against latest reducer state, not stale closure values like `setCount(count
    + 1)`. Start at 1. First dispatch -> 3. Second dispatch -> 6. This is one reason reducers are good for sequential state
    transitions and more complex event logic.
  difficulty: mid
- q: What is bug?
  code: "function List({ items, filter }) {\n  const visible = useMemo(() => {\n    return items.filter(item => item.includes(filter));\n\
    \  }, [items]);\n  return <p>{visible.length}</p>;\n}"
  options:
  - text: useMemo cannot return arrays
    correct: false
  - text: filter missing from dependency array, so visible can become stale
    correct: true
  - text: items should never be in deps
    correct: false
  - text: filter must be wrapped in useCallback
    correct: false
  explanation: Memoized computation depends on both `items` and `filter`. With `[items]` only, changing filter alone keeps
    old visible list. This is same class of stale-data bug as effects with missing deps, just in render-time memoization instead
    of side effects.
  difficulty: mid
- q: What is problem with updater?
  code: "function App() {\n  const [items, setItems] = useState([\"a\"]);\n  const add = () => {\n    setItems(prev => {\n\
    \      prev.push(\"b\");\n      return prev;\n    });\n  };\n  return <button onClick={add}>{items.join(\",\")}</button>;\n\
    }"
  options:
  - text: Functional updaters cannot return arrays
    correct: false
  - text: It mutates prev array and returns same reference
    correct: true
  - text: push is async so item order is unstable
    correct: false
  - text: join causes rerender loop
    correct: false
  explanation: 'Functional updater helps avoid stale closures, but it does not make mutation safe. `prev.push(''b'')` mutates
    existing array, then returns same reference. React can bail and UI can desync. Correct version: `return [...prev, ''b'']`.'
  difficulty: mid
- q: What appears after effects settle?
  code: "function App() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    if (count < 3) {\n      setCount(count\
    \ + 1);\n    }\n  }, [count]);\n  return <p>{count}</p>;\n}"
  options:
  - text: '0'
    correct: false
  - text: '1'
    correct: false
  - text: '3'
    correct: true
  - text: Infinite loop forever
    correct: false
  explanation: Effect runs after mount with count=0, then sets 1. It repeats for 1 and 2. When count reaches 3, condition
    fails and loop stops. This is controlled render-effect loop, not infinite loop. Important distinction in interview and
    production debugging.
  difficulty: mid
- q: What is issue?
  code: "function Parent() {\n  const [query, setQuery] = useState(\"\");\n  return (\n    <>\n      <input value={query}\
    \ onChange={e => setQuery(e.target.value)} />\n      <Results query={query} />\n    </>\n  );\n}\nconst Results = React.memo(function\
    \ Results({ query }) {\n  const params = { q: query };\n  useEffect(() => {\n    fetchResults(params);\n  }, [params]);\n\
    \  return null;\n});"
  options:
  - text: React.memo prevents effect from running
    correct: false
  - text: params is new object every render, so effect runs every render
    correct: true
  - text: query cannot be passed to memo child
    correct: false
  - text: fetchResults must be inside Parent
    correct: false
  explanation: Dependency array compares by reference. `params` is recreated on every render, so effect sees changed dependency
    every time. Use `[query]` directly or memoize params object if truly needed. This is common object-identity bug around
    effects and memoization.
  difficulty: mid
- q: 'This input is:'
  code: "function App() {\n  const [value, setValue] = useState(\"\");\n  return (\n    <input\n      value={value}\n    \
    \  onChange={e => setValue(e.target.value)}\n    />\n  );\n}"
  options:
  - text: Uncontrolled, because browser owns current value
    correct: false
  - text: Controlled, because React state drives value prop
    correct: true
  - text: Hybrid, because onChange makes it both
    correct: false
  - text: Read-only, because value prop is present
    correct: false
  explanation: Input receives its displayed value from React state through `value={value}`. `onChange` writes browser edits
    back into state, completing controlled loop. This is foundational React forms concept and often tied to validation, masking,
    and debounced submission flows.
  difficulty: mid
- q: What happens to `id.current` after hide and later show again?
  code: "function App() {\n  const [show, setShow] = useState(true);\n  return (\n    <>\n      <button onClick={() => setShow(false)}>hide</button>\n\
    \      {show ? <Widget /> : null}\n    </>\n  );\n}\nfunction Widget() {\n  const id = useRef(Math.random());\n  return\
    \ <p>{id.current}</p>;\n}"
  options:
  - text: Same value, refs survive unmounts
    correct: false
  - text: New value, because Widget unmounts and new instance mounts later
    correct: true
  - text: undefined until second render
    correct: false
  - text: It becomes null after cleanup
    correct: false
  explanation: '`useRef` survives re-renders of same mounted instance, not unmount/remount cycles. When Widget is removed
    from tree, its instance is gone. Showing it again creates fresh component instance and new random ref value. This matters
    for caching assumptions and imperative handles.'
  difficulty: mid
- q: How many times is "app" logged clicking button once?
  code: "function App() {\n  const [n, setN] = useState(0);\n  console.log(\"app\");\n  return <button onClick={() => setN(1)}>{n}</button>;\n\
    }"
  options:
  - text: '0'
    correct: false
  - text: '1'
    correct: false
  - text: '2'
    correct: true
  - text: Depends on whether button is clicked
    correct: false
  explanation: 'Question does not say `after`, so include initial mount. First render logs once. Clicking button changes state
    from 0 to 1, causing one more render and one more log. Total: 2. This is exact wording rule you wanted: no `after` means
    include initial render.'
  difficulty: mid
- q: How many logs happen in total if we click once? Count both "child" and "effect".
  code: "function Child({ value }) {\n  console.log(\"child\");\n  useEffect(() => {\n    console.log(\"effect\");\n  }, [value]);\n\
    \  return <p>{value}</p>;\n}\nfunction App() {\n  const [value, setValue] = useState(0);\n  return <button onClick={()\
    \ => setValue(1)}><Child value={value} /></button>;\n}"
  options:
  - text: 1 child, 1 effect
    correct: false
  - text: 2 child, 1 effect
    correct: false
  - text: 2 child, 2 effect
    correct: true
  - text: 3 child, 2 effect
    correct: false
  explanation: 'Question does not say `after`, so include mount. Initial render: `child` logs once, then effect logs once.
    Click changes value to 1: Child re-renders and logs `child` again, then effect runs again because dependency changed.
    Total = 2 child, 2 effect.'
  difficulty: mid
- q: How many times is "child" logged clicking button once?
  code: "function GrandChild({ ready }) {\n  if (ready) console.log(\"grandchild\");\n  return ready ? <p>ready</p> : <p>waiting</p>;\n\
    }\nfunction Child({ enabled }) {\n  console.log(\"child\");\n  return <GrandChild ready={enabled} />;\n}\nfunction App()\
    \ {\n  const [enabled, setEnabled] = useState(false);\n  console.log(\"app\");\n  return (\n    <>\n      <button onClick={()\
    \ => setEnabled(true)}>enable</button>\n      <Child enabled={enabled} />\n    </>\n  );\n}"
  options:
  - text: '0'
    correct: false
  - text: '1'
    correct: false
  - text: '2'
    correct: true
  - text: '3'
    correct: false
  explanation: 'No `after`, so include mount. Child renders on initial mount and logs once. Clicking enable re-renders App
    and Child, so Child logs one more time. Total `child` logs: 2. `grandchild` only logs on second render because enabled
    becomes true, but question asks only about `child`.'
  difficulty: mid
- q: Why should a senior React developer deeply understand JavaScript closures and async patterns?
  options:
  - text: React behavior often depends on lexical scope and async sequencing in handlers, effects, and state updates
    correct: true
  - text: React abstracts JavaScript away, so advanced JS knowledge matters only in build tooling
    correct: false
  - text: Closures are relevant only to class components, not hooks
    correct: false
  - text: Async patterns matter only for Redux users
    correct: false
  explanation: React is JavaScript-heavy, and many real bugs come from stale closures, async timing, and misunderstanding
    event flow. Hooks especially depend on lexical scope behavior. Strong JS fundamentals directly improve React correctness
    and maintainability.
  difficulty: mid
- q: When is React Context usually a better fit than Redux?
  options:
  - text: For lightweight shared state where full global store tooling would be unnecessary
    correct: true
  - text: When application needs time-travel debugging and complex middleware chains
    correct: false
  - text: When every state update must be globally normalized
    correct: false
  - text: When you want to eliminate re-renders by default
    correct: false
  explanation: Context works well for relatively simple cross-tree sharing such as theme, auth session, or lightweight config.
    Redux is often chosen when state flows become more complex and need stronger tooling. Fit depends on scale and change
    patterns, not trend.
  difficulty: mid
- q: What is core goal of React re-render optimization techniques such as `React.memo`, `useMemo`, and `useCallback`?
  options:
  - text: Reduce unnecessary work when component inputs have not meaningfully changed
    correct: true
  - text: Guarantee components never render more than once
    correct: false
  - text: Replace need for state management architecture
    correct: false
  - text: Make large prop objects free to create on every render
    correct: false
  explanation: These tools help avoid avoidable work by preserving references or memoizing output where it matters. They are
    performance tools, not correctness tools by themselves, and should be used deliberately. Poor state structure can still
    cause excessive rendering despite memoization.
  difficulty: mid
- q: When might an uncontrolled component be a reasonable choice?
  options:
  - text: When direct DOM access or lower React coordination overhead is more practical than fully controlled form state
    correct: true
  - text: When application needs strict centralized validation on every keystroke
    correct: false
  - text: When you want to avoid refs entirely
    correct: false
  - text: When component must share every value globally
    correct: false
  explanation: Uncontrolled inputs can be practical for simple forms, third-party DOM integrations, or performance-sensitive
    cases where full controlled state adds noise. They are not default answer for complex validation-heavy workflows. Senior
    engineers choose based on tradeoff, not dogma.
  difficulty: mid
- q: Which component organization pattern usually scales better in large React codebases?
  options:
  - text: Modular, reusable components with clear naming and feature- or domain-based structure
    correct: true
  - text: One shared components folder containing all business logic and UI concerns
    correct: false
  - text: Deeply nested inheritance hierarchies for visual variants
    correct: false
  - text: Anonymous default exports for most components
    correct: false
  explanation: Large codebases benefit from modular structure, reusable building blocks, and clear ownership boundaries. Feature
    or domain organization usually scales better than giant generic folders. Naming clarity matters because navigation and
    onboarding cost grows with repo size.
  difficulty: mid
- q: What is major advantage of Redux in large React applications?
  options:
  - text: Predictable centralized state updates with strong debugging and tooling support
    correct: true
  - text: It removes need for asynchronous control flow entirely
    correct: false
  - text: It always reduces code size compared with local state
    correct: false
  - text: It is best choice for every React project regardless of size
    correct: false
  explanation: Redux is valued for predictability, explicit flows, devtools, and broad ecosystem support. It does not eliminate
    async concerns and can be overkill for smaller apps. Its strengths show most clearly when shared state complexity is high.
  difficulty: mid
- q: What is common limitation of Redux if applied too early or too broadly?
  options:
  - text: It can introduce boilerplate and over-architecture for problems that do not need it
    correct: true
  - text: It cannot support asynchronous workflows at all
    correct: false
  - text: It makes component reuse impossible
    correct: false
  - text: It only works with class components
    correct: false
  explanation: Redux solves real coordination problems, but using it everywhere can increase ceremony and maintenance cost.
    Middleware and modern tooling address async use cases, so that is not its core limitation. Right-sized architecture matters
    more than library loyalty.
  difficulty: mid
- q: <ProtectedDash isLoggedIn={true} user={me} /> -- what does Dashboard receive?
  code: "function withAuth(Component) {\n  return function Protected({ isLoggedIn, ...rest }) {\n    if (!isLoggedIn) return\
    \ <Redirect to=\"/login\" />;\n    return <Component {...rest} />;\n  };\n}\nconst ProtectedDash = withAuth(Dashboard);"
  topics:
  - react
  - design-patterns
  options:
  - text: '{ isLoggedIn: true, user: me }'
    correct: false
  - text: '{ user: me }'
    correct: true
  - text: <Redirect to='/login' />
    correct: false
  - text: Error
    correct: false
  explanation: isLoggedIn is destructured out of props. ...rest captures everything else ({user:me}). Since isLoggedIn=true
    the guard passes and renders <Component {...rest}> = <Dashboard user={me} />. isLoggedIn does NOT reach Dashboard -- it
    was consumed by the HOC. Implementation details of the wrapper should not leak into the wrapped component.
  difficulty: mid
- q: What design pattern is this and what problem does it solve?
  code: "// Compound Component pattern\nconst TabsContext = createContext();\nfunction Tabs({ children }) {\n  const [active,\
    \ setActive] = useState(0);\n  return (\n    <TabsContext.Provider value={{ active, setActive }}>\n      {children}\n\
    \    </TabsContext.Provider>\n  );\n}\nTabs.List = function({ children }) { return <div role=\"tablist\">{children}</div>;\
    \ };\nTabs.Tab = function({ index, children }) {\n  const { active, setActive } = useContext(TabsContext);\n  return <button\
    \ aria-selected={active === index} onClick={() => setActive(index)}>{children}</button>;\n};\nTabs.Panel = function({\
    \ index, children }) {\n  const { active } = useContext(TabsContext);\n  return active === index ? <div>{children}</div>\
    \ : null;\n};"
  topics:
  - react
  - design-patterns
  options:
  - text: HOC pattern
    correct: false
  - text: Compound Component pattern
    correct: true
  - text: Observer pattern
    correct: false
  - text: Factory pattern
    correct: false
  explanation: Compound Components share implicit state through context. Callers compose Tab.List, Tab.Tab, and Tab.Panel
    in any layout they want -- no prop drilling needed. Used by Radix UI, Reach UI, Headless UI. The parent (Tabs) owns state,
    children access it via context. Enables maximum layout flexibility while keeping the component API clean.
  difficulty: mid
- q: A "info" type is needed. A "critical" type might come later. What is the architectural risk?
  code: "function Notification({ type, message }) {\n  let icon, color;\n  if (type === \"success\") { icon = \"check\"; color\
    \ = \"green\"; }\n  else if (type === \"error\") { icon = \"x\"; color = \"red\"; }\n  else if (type === \"warning\")\
    \ { icon = \"alert\"; color = \"yellow\"; }\n  return <div style={{color}}><Icon name={icon}/>{message}</div>;\n}"
  topics:
  - react
  - solid-principles
  options:
  - text: No risk
    correct: false
  - text: Every new type requires modifying the conditional chain, risking regressions on existing types and blocking parallel
      feature work
    correct: true
  - text: The component should be split into Success, Error, Warning sub-components
    correct: false
  - text: color should come from CSS classes not inline style
    correct: false
  explanation: 'OCP: open for extension, closed for modification. Every new type touches the same chain. Fix: const CONFIG
    = { success: {icon:''check'',color:''green''}, ... }. Adding ''info'' means one new key -- zero conditional changes. Scales
    to 20 types with no branching growth and no risk of touching existing paths.'
  difficulty: mid
- q: What is the architectural consequence of this interface?
  code: "function Button({\n  onClick, label, style, className,\n  isLoading, loadingText, disabled, disabledReason,\n  icon,\
    \ iconPosition, tooltip, tooltipDelay,\n  analyticsEvent, analyticsPayload\n}) { /* ... */ }"
  topics:
  - react
  - solid-principles
  options:
  - text: No consequence
    correct: false
  - text: Every consumer must understand 14 props even using 2, any prop change breaks all consumers, and unrelated concerns
      are coupled into one component
    correct: true
  - text: TypeScript will reject this prop signature
    correct: false
  - text: The only fix is to use a class component
    correct: false
  explanation: 'ISP: a 14-prop component forces every consumer to understand the full interface even if they use 2 props.
    Tooltip should compose Tooltip around Button. Analytics belongs in onClick at the callsite. Loading state can be LoadingButton.
    Each concern extracted means the Button interface stays stable. This is how Radix UI, Headless UI, and React Aria are
    built: minimal props per primitive.'
  difficulty: mid
---
