---
defaultDomains:
- frontend
defaultTopics:
- react
questions:
- q: Initial render output?
  code: "function Child({ value, show }) {\n  if (!show) return <span>hidden</span>;\n  return <span>{value > 0 ? \"positive\"\
    \ : \"zero\"}</span>;\n}\nfunction Parent() {\n  const [n, setN] = useState(0);\n  return <Child value={n} show={n !==\
    \ 1} />;\n}"
  options:
  - text: '"zero"'
    correct: true
  - text: '"positive"'
    correct: false
  - text: '"hidden"'
    correct: false
  - text: 'null'
    correct: false
  explanation: On mount n=0. show = (0 !== 1) = true so Child renders. value=0 so 0 > 0 is false -> renders 'zero'. The stale
    state never changes because there's no button.
  difficulty: junior
- q: What is rendered?
  code: "function Wrapper({ condition, children }) {\n  if (condition) {\n    return <div className=\"box\">{children}</div>;\n\
    \  }\n  return children;\n}\nfunction App() {\n  return (\n    <Wrapper condition={false}>\n      <span>text</span>\n\
    \    </Wrapper>\n  );\n}"
  options:
  - text: <div class="box"><span>text</span></div>
    correct: false
  - text: <span>text</span>
    correct: true
  - text: 'null'
    correct: false
  - text: Error
    correct: false
  explanation: condition=false so Wrapper returns children directly. children is <span>text</span>. React allows returning
    a ReactElement directly from render -- no wrapper needed. This is the conditional wrapper / transparent wrapper pattern,
    common in layout components that optionally add a container.
  difficulty: junior
- q: Initial render output?
  code: "function Parent({ show }) {\n  if (!show) return <p>Parent hidden</p>;\n  return <Section ready={true} />;\n}\nfunction\
    \ Section({ ready }) {\n  if (!ready) return <p>Section blocked</p>;\n  return <Panel expanded={false} />;\n}\nfunction\
    \ Panel({ expanded }) {\n  return expanded ? <p>Details</p> : <p>Collapsed</p>;\n}\nfunction App() {\n  return <Parent\
    \ show={true} />;\n}"
  options:
  - text: '"Parent hidden"'
    correct: false
  - text: '"Section blocked"'
    correct: false
  - text: '"Details"'
    correct: false
  - text: '"Collapsed"'
    correct: true
  explanation: Three levels matter here. App passes show=true, so Parent renders Section. Section gets ready=true, so it renders
    Panel. Panel gets expanded=false, so final output is 'Collapsed'. This mirrors real UI trees where layout, permission,
    and local display conditions stack across parent-child-grandchild levels.
  difficulty: junior
- q: What is rendered?
  code: "function GrandParent({ signedIn }) {\n  return signedIn ? <Parent canView={false} /> : <p>Login</p>;\n}\nfunction\
    \ Parent({ canView }) {\n  return <Child enabled={canView ? false : true} />;\n}\nfunction Child({ enabled }) {\n  return\
    \ enabled ? <p>Dashboard</p> : null;\n}\nfunction App() {\n  return <GrandParent signedIn={true} />;\n}"
  options:
  - text: '"Login"'
    correct: false
  - text: '"Dashboard"'
    correct: true
  - text: nothing from Child
    correct: false
  - text: React throws because Child returns null
    correct: false
  explanation: 'GrandParent passes signedIn=true, so Parent renders. Parent gets canView=false and passes enabled=true. Child
    returns <p>Dashboard<p>. Important production lesson: permission-gated trees can look mounted at upper levels while leaf
    UI intentionally renders nothing.'
  difficulty: junior
- q: What is bug?
  code: "function App() {\n  const [user, setUser] = useState({ name: \"Ada\", role: \"dev\" });\n  const promote = () =>\
    \ {\n    user.role = \"lead\";\n    setUser(user);\n  };\n  return <button onClick={promote}>{user.role}</button>;\n}"
  options:
  - text: No bug, role updates to lead correctly
    correct: false
  - text: State object is mutated in place, so React may bail because reference did not change
    correct: true
  - text: useState cannot store objects
    correct: false
  - text: Button text cannot render object fields
    correct: false
  explanation: 'React state updates rely on new references. Here code mutates existing object and passes same reference back
    into state. React may treat it as unchanged and skip render. Correct fix: `setUser(u => ({ ...u, role: ''lead'' }))`.
    This is common source of stale UI in forms and nested data.'
  difficulty: junior
- q: Why is initial state read outside effect?
  code: "function useOnlineStatus() {\n  const [online, setOnline] = useState(navigator.onLine);\n  useEffect(() => {\n  \
    \  const on = () => setOnline(true);\n    const off = () => setOnline(false);\n    window.addEventListener(\"online\"\
    , on);\n    window.addEventListener(\"offline\", off);\n    return () => {\n      window.removeEventListener(\"online\"\
    , on);\n      window.removeEventListener(\"offline\", off);\n    };\n  }, []);\n  return online;\n}"
  options:
  - text: Because effects run after first render, but UI needs immediate initial value
    correct: true
  - text: Because addEventListener requires useState first
    correct: false
  - text: Because navigator.onLine changes automatically inside state
    correct: false
  - text: Because cleanup cannot access state initialized in effect
    correct: false
  explanation: Effects run after paint. If initial online value were only set inside effect, first render could show wrong
    state. Reading initial value during render gives immediate UI, while effect handles subscriptions. This pattern appears
    often in custom hooks wrapping browser APIs.
  difficulty: junior
- q: When switching tabs, is Panel state preserved?
  code: "function App() {\n  const [tab, setTab] = useState(\"home\");\n  return (\n    <>\n      <button onClick={() => setTab(\"\
    settings\")}>go</button>\n      {tab === \"home\" && <Panel />}\n      {tab === \"settings\" && <Panel />}\n    </>\n\
    \  );\n}\nfunction Panel() {\n  const [count] = useState(1);\n  return <p>{count}</p>;\n}"
  options:
  - text: Yes, same component function means same state always
    correct: false
  - text: No, because one Panel unmounts and another mounts in different branch positions
    correct: true
  - text: Yes, because both branches render Panel with no key
    correct: false
  - text: Only in production build
    correct: false
  explanation: These are separate conditional branches. When `home` becomes false, first Panel unmounts. Then second branch
    mounts its own Panel instance. Same component type is not enough; position in tree determines identity. State resets across
    such branch swaps.
  difficulty: junior
- q: Final output?
  code: "function GrandParent({ enabled }) {\n  return enabled ? <Parent loaded={true} /> : <p>Off</p>;\n}\nfunction Parent({\
    \ loaded }) {\n  return loaded ? <Child items={[]} /> : <p>Loading</p>;\n}\nfunction Child({ items }) {\n  return items.length\
    \ ? <ul>{items.map(i => <li key={i}>{i}</li>)}</ul> : <p>Empty</p>;\n}\nfunction App() {\n  return <GrandParent enabled={true}\
    \ />;\n}"
  options:
  - text: '"Off"'
    correct: false
  - text: '"Loading"'
    correct: false
  - text: '"Empty"'
    correct: true
  - text: <ul></ul>
    correct: false
  explanation: Three levels of conditions. enabled=true -> Parent. loaded=true -> Child. items=[] so length is 0 and Child
    returns 'Empty'. In real apps this pattern shows up with feature flag, fetch state, then data-empty state at leaf.
  difficulty: junior
- q: How many times is "even" logged after two clicks?
  code: "function Child({ count }) {\n  if (count % 2 === 0) console.log(\"even\");\n  return <p>{count}</p>;\n}\nfunction\
    \ App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}><Child count={count}\
    \ /></button>;\n}"
  options:
  - text: '0'
    correct: false
  - text: '1'
    correct: true
  - text: '2'
    correct: false
  - text: '3'
    correct: false
  explanation: 'Prompt says `after two clicks`, so ignore initial render where count=0 would log `even`. After first click
    count=1, no log. After second click count=2, condition passes and logs once. Total after clicks only: 1.'
  difficulty: junior
- q: What are main phases of React component lifecycle?
  options:
  - text: Mounting, updating, and unmounting
    correct: true
  - text: Rendering, compiling, and bundling
    correct: false
  - text: Creation, hydration, and destruction only
    correct: false
  - text: Props, state, and context
    correct: false
  explanation: React component lifecycle is commonly described as mounting, updating, and unmounting. Class components expose
    lifecycle methods for these phases, while function components express similar behavior through hooks. Understanding phase
    boundaries helps place side effects correctly.
  difficulty: junior
- q: What is typical use of `componentDidMount` or an effect with mount-like behavior?
  options:
  - text: Start side effects such as API requests, subscriptions, or initial setup after component appears
    correct: true
  - text: Mutate props before first render
    correct: false
  - text: Prevent all future re-renders
    correct: false
  - text: Replace need for cleanup logic on unmount
    correct: false
  explanation: Mount-time logic is commonly used for fetching, subscriptions, analytics, or setup work that should begin after
    component renders. It does not justify prop mutation or remove need for cleanup. Correct placement of side effects avoids
    bugs and duplicate work.
  difficulty: junior
- q: Which state management option is usually enough for component-local state?
  options:
  - text: '`useState` or `useReducer`'
    correct: true
  - text: Redux for every input and toggle
    correct: false
  - text: Context for all state, regardless of scope
    correct: false
  - text: Apollo Client even when no remote data exists
    correct: false
  explanation: Local component concerns should usually stay local with `useState` or `useReducer`. Global solutions add complexity
    and should solve real sharing or coordination problems. Over-centralizing state is common source of unnecessary architecture.
  difficulty: junior
- q: What is main difference between controlled and uncontrolled inputs in React?
  options:
  - text: Controlled inputs are driven by React state, while uncontrolled inputs keep current value in DOM state
    correct: true
  - text: Controlled inputs are always faster than uncontrolled ones
    correct: false
  - text: Uncontrolled inputs cannot be validated
    correct: false
  - text: Controlled inputs require class components
    correct: false
  explanation: Controlled inputs derive value from React state and update through handlers, which gives predictability and
    easier validation. Uncontrolled inputs rely on DOM state, often accessed through refs. Each approach has tradeoffs, but
    controlled is default for most forms.
  difficulty: junior
- q: How are side effects primarily handled in modern React function components?
  options:
  - text: With hooks such as `useEffect` and `useLayoutEffect`, often wrapped in custom hooks for reuse
    correct: true
  - text: By putting async calls directly in render output
    correct: false
  - text: By mutating props during reconciliation
    correct: false
  - text: With reducers only, because effects are legacy
    correct: false
  explanation: Function components use effect hooks to coordinate work outside pure rendering, such as network requests, subscriptions,
    DOM sync, or cleanup. Custom hooks often package repeated effect logic cleanly. Rendering should remain free of imperative
    side effects.
  difficulty: junior
- q: <LoggedButton color="red" size="lg" /> -- what does Button receive?
  code: "function withLogger(Component) {\n  return function Logged(props) {\n    console.log(\"render\", Component.displayName);\n\
    \    return <Component {...props} />;\n  };\n}\nconst LoggedButton = withLogger(Button);"
  topics:
  - react
  - design-patterns
  options:
  - text: No props
    correct: false
  - text: '{ color: ''red'', size: ''lg'' }'
    correct: true
  - text: '{ color: ''red'' }'
    correct: false
  - text: Error
    correct: false
  explanation: '{...props} spreads all received props onto the wrapped component. LoggedButton receives {color:''red'', size:''lg''}
    and passes them through to Button unchanged. The HOC adds the logging side effect transparently. Standard HOC prop forwarding
    contract -- the wrapper must never swallow props.'
  difficulty: junior
- q: What happens on mount?
  code: "const EnhancedInput = React.forwardRef(function(props, ref) {\n  return <input ref={ref} className=\"enhanced\" {...props}\
    \ />;\n});\nfunction Form() {\n  const inputRef = useRef(null);\n  useEffect(() => {\n    inputRef.current.focus();\n\
    \  }, []);\n  return <EnhancedInput ref={inputRef} placeholder=\"type here\" />;\n}"
  topics:
  - react
  - design-patterns
  options:
  - text: Error
    correct: false
  - text: The input gets focus and has class 'enhanced' and placeholder 'type here'
    correct: true
  - text: inputRef.current is null because ref is not forwarded correctly
    correct: false
  - text: focus() fails because useEffect runs before mount
    correct: false
  explanation: forwardRef passes the ref through to the underlying input. useEffect runs after the DOM is painted so inputRef.current
    is the actual input element and focus() works. {...props} spreads placeholder onto input. className='enhanced' is always
    applied. Required whenever a parent needs direct DOM access to a wrapped component.
  difficulty: junior
- q: Three different product teams each own one of these concerns. What is the architectural problem?
  code: "function Dashboard() {\n  const [user, setUser] = useState(null);\n  const [posts, setPosts] = useState([]);\n  const\
    \ [theme, setTheme] = useState(\"light\");\n  useEffect(() => { fetchUser().then(setUser); }, []);\n  useEffect(() =>\
    \ { fetchPosts().then(setPosts); }, []);\n  return (\n    <div className={theme}>\n      <Header user={user} onTheme={setTheme}\
    \ />\n      <Feed posts={posts} />\n    </div>\n  );\n}"
  topics:
  - react
  - solid-principles
  options:
  - text: Too many useEffect calls
    correct: false
  - text: It owns three unrelated concerns making it a change magnet
    correct: true
  - text: useState cannot be called three times in one component
    correct: false
  - text: No problem
    correct: false
  explanation: 'SRP violation that only shows at scale. User auth, post feed, and theme are three independent domains. Any
    of the three product teams touching this file creates merge conflicts and regression risk. Fix: extract useUser(), usePosts(),
    useTheme() hooks. Dashboard becomes a thin compositor. Test: how many teams edit this file? More than one = SRP violation.'
  difficulty: junior
- q: 'Usage A: <DataTable fetchData={() => fetch(''/api'').then(r => r.json())} /> Usage B: <DataTable fetchData={() => Promise.resolve(mockRows)}
    /> Usage C: <DataTable fetchData={graphqlClient.getRows} /> Which principle does this design demonstrate?'
  code: "function DataTable({ fetchData }) {\n  const [rows, setRows] = useState([]);\n  useEffect(() => {\n    fetchData().then(setRows);\n\
    \  }, [fetchData]);\n  return <table>...</table>;\n}"
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
  - text: ISP
    correct: false
  explanation: 'DIP: high-level component depends on an abstraction (fetchData: () => Promise<Row[]>), not on fetch() directly.
    REST, GraphQL, or mock all satisfy the contract. Also LSP: any function returning Promise<Row[]> substitutes fetchData.
    This is what makes DataTable testable -- pass () => Promise.resolve(mockData) in tests. Foundation of headless component
    design.'
  difficulty: junior
---
