---
defaultDomains:
- frontend
defaultTopics:
- react
questions:
- q: What is the bug?
  code: "function useWindowSize() {\n  const [size, setSize] = useState({ w: 0, h: 0 });\n  useEffect(() => {\n    const handler\
    \ = () =>\n      setSize({ w: window.innerWidth, h: window.innerHeight });\n    window.addEventListener(\"resize\", handler);\n\
    \  }, []);\n  return size;\n}"
  options:
  - text: useState should use separate w and h
    correct: false
  - text: resize listener is never removed
    correct: true
  - text: window is not available server-side
    correct: false
  - text: handler needs useCallback
    correct: false
  explanation: 'No cleanup function is returned. When the component unmounts, the ''resize'' listener stays attached to window,
    holding a reference to setSize and preventing GC. In a SPA with many mount/unmount cycles this accumulates. Fix: return
    () => window.removeEventListener(''resize'', handler).'
  difficulty: principal
- q: When button is clicked, does Toolbar render again?
  code: "const ThemeContext = React.createContext({ theme: \"light\" });\nconst Toolbar = React.memo(function Toolbar() {\n\
    \  const value = useContext(ThemeContext);\n  console.log(\"toolbar render\");\n  return <div>{value.theme}</div>;\n});\n\
    function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <ThemeContext.Provider value={{ theme: \"\
    dark\" }}>\n      <button onClick={() => setCount(c => c + 1)}>{count}</button>\n      <Toolbar />\n    </ThemeContext.Provider>\n\
    \  );\n}"
  options:
  - text: No, because React.memo blocks all re-renders
    correct: false
  - text: Yes, because provider gets a new object value on every App render, so context changes
    correct: true
  - text: No, because context value did not change
    correct: false
  - text: Only every second click
    correct: false
  explanation: 'Provider creates fresh object literal `{ theme: ''dark'' }` on every App render. Context compares provider
    value by reference, so Toolbar sees changed context and re-renders even though semantic theme string did not change. `React.memo`
    only helps with props; context updates still propagate. Real fix: memoize provider value or split static values out.'
  difficulty: principal
- q: On open, then close, what logs?
  code: "function App() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen(o\
    \ => !o)}>toggle</button>\n      {open && <Modal />}\n    </>\n  );\n}\nfunction Modal() {\n  useEffect(() => {\n    console.log(\"\
    subscribe\");\n    return () => console.log(\"cleanup\");\n  }, []);\n  return <div>Modal</div>;\n}"
  options:
  - text: '"subscribe", then "cleanup"'
    correct: true
  - text: '"cleanup", then "subscribe"'
    correct: false
  - text: '"subscribe" only'
    correct: false
  - text: Nothing because effect has []
    correct: false
  explanation: When open becomes true, Modal mounts and effect runs -> `subscribe`. When open becomes false, Modal unmounts
    and cleanup runs -> `cleanup`. Empty deps means run once per mount lifecycle, not once forever. This is core to subscriptions,
    event listeners, and portals/modals.
  difficulty: principal
- q: Is `double` missing from deps?
  code: "function App() {\n  const [n, setN] = useState(0);\n  const double = n * 2;\n  useEffect(() => {\n    console.log(double);\n\
    \  }, [n]);\n  return <button onClick={() => setN(n + 1)}>{double}</button>;\n}"
  options:
  - text: Yes, effect is always wrong without double in deps
    correct: false
  - text: No, because double is derived from n and changes only when n changes
    correct: true
  - text: Yes, primitives must always be listed separately
    correct: false
  - text: Depends on strict mode only
    correct: false
  explanation: 'If a value is fully derived from declared dependency `n`, then tracking `n` is enough. Adding `double` would
    be redundant, not more correct. Important nuance: exhaustive deps is about actual reactive inputs, not every local variable
    blindly.'
  difficulty: principal
- q: After one click, how many times is "idle" logged?
  code: "function Row({ selected }) {\n  if (selected) {\n    console.log(\"selected\");\n    return <p>selected</p>;\n  }\n\
    \  console.log(\"idle\");\n  return <p>idle</p>;\n}\nfunction App() {\n  const [selected, setSelected] = useState(false);\n\
    \  return <button onClick={() => setSelected(true)}><Row selected={selected} /></button>;\n}"
  options:
  - text: '0'
    correct: true
  - text: '1'
    correct: false
  - text: '2'
    correct: false
  - text: Depends on whether Row returns null
    correct: false
  explanation: Prompt says `After one click`, so ignore initial mount, where `idle` does log once. After click, selected=true
    and Row logs `selected`, not `idle`. So `idle` is logged 0 times after click. Good trap question because initial render
    would change answer if `after` were missing.
  difficulty: principal
- q: In what order do HOCs wrap Dashboard?
  code: const A = withLogger(withAuth(withTheme(Dashboard)));
  topics:
  - react
  - design-patterns
  options:
  - text: withLogger -> withAuth -> withTheme -> Dashboard (left to right)
    correct: false
  - text: withTheme wraps Dashboard first, then withAuth, then withLogger outermost
    correct: true
  - text: All three wrap simultaneously
    correct: false
  - text: Order does not matter for HOCs
    correct: false
  explanation: 'HOC composition reads inside-out. withTheme(Dashboard) runs first. withAuth(ThemeDash) runs next. withLogger(AuthDash)
    runs last and is outermost. Render call order: Logger -> Auth -> Theme -> Dashboard. This matters when HOCs depend on
    each other -- withAuth must run before withLogger if Logger needs auth state.'
  difficulty: principal
- q: What problem does render props solve vs a regular component?
  code: "// Render Props pattern\nfunction MouseTracker({ render }) {\n  const [pos, setPos] = useState({ x: 0, y: 0 });\n\
    \  return (\n    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>\n      {render(pos)}\n    </div>\n  );\n\
    }\n// Usage:\n<MouseTracker render={({ x, y }) => <p>{x}, {y}</p>} />"
  topics:
  - react
  - design-patterns
  options:
  - text: It runs faster because it avoids reconciliation
    correct: false
  - text: It inverts control
    correct: true
  - text: It prevents re-renders when mouse moves
    correct: false
  - text: It replaces the need for context
    correct: false
  explanation: 'Render props invert control: MouseTracker owns the behavior (tracking position) and the caller decides what
    to render with it. The same tracker can power a tooltip, a canvas cursor, a debug overlay -- without changing MouseTracker.
    Today custom hooks often replace render props for logic sharing, but the pattern still appears in react-table, Formik,
    and Downshift.'
  difficulty: principal
- q: This Modal is reused in 20 places across the app. Some contexts should not track the event. What is the problem?
  code: "function Modal({ onClose }) {\n  return (\n    <div>\n      <button onClick={() => {\n        analytics.track('modal_closed');\n\
    \        onClose();\n      }}>X</button>\n    </div>\n  );\n}"
  topics:
  - react
  - solid-principles
  options:
  - text: No problem
    correct: false
  - text: Modal is coupled to analytics
    correct: true
  - text: analytics.track should be in useEffect instead
    correct: false
  - text: The button needs an aria-label
    correct: false
  explanation: 'SRP: Modal should not know about analytics. It also violates DIP -- it depends on the concrete analytics service
    rather than the onClose abstraction. Fix: the caller passes onClose that tracks if needed. Modal stays pure. Reuse in
    no-tracking contexts costs nothing. Each callsite controls its own side effects.'
  difficulty: principal
- q: 'Teams want: keyboard nav, URL sync, animated transitions. What is the correct architectural direction?'
  code: "function Tabs({ items }) {\n  const [active, setActive] = useState(0);\n  return (\n    <div>\n      {items.map((item,\
    \ i) => (\n        <button key={i} onClick={() => setActive(i)}>\n          {item.label}\n        </button>\n      ))}\n\
    \      <div>{items[active].content}</div>\n    </div>\n  );\n}"
  topics:
  - react
  - solid-principles
  options:
  - text: Add isKeyboard, syncUrl, and animate props to Tabs
    correct: false
  - text: Expose a useTabs() headless hook or compound component pattern
    correct: true
  - text: Create TabsWithKeyboard, TabsWithUrl, TabsWithAnimation variants
    correct: false
  - text: Use an existing tabs library that covers all cases
    correct: false
  explanation: 'OCP + ISP: adding three props pushes toward the 14-prop antipattern. Compound components (TabList, Tab, TabPanel
    sharing context) let callers compose exactly what they need. Or useTabs() exposes {activeIndex, onSelect, getTabProps}
    and callers render whatever DOM they want. Radix UI Tabs, Headless UI Tabs, and React Aria all use this model -- zero
    built-in styling, full behavior, infinite composability.'
  difficulty: principal
---
