---
defaultDomains:
  - frontend
defaultTopics:
  - react
questions:
  - q: Initial render output?
    code: |-
      function Child({ value, show }) {
        if (!show) return <span>hidden</span>;
        return <span>{value > 0 ? "positive" : "zero"}</span>;
      }
      function Parent() {
        const [n, setN] = useState(0);
        return <Child value={n} show={n !== 1} />;
      }
    options:
      - text: "\"zero\""
        correct: true
      - text: "\"positive\""
        correct: false
      - text: "\"hidden\""
        correct: false
      - text: "null"
        correct: false
    explanation: On mount n=0. show = (0 !== 1) = true so Child renders. value=0 so 0 > 0 is false -> renders 'zero'. The stale state never changes because there's no button.
    difficulty: junior
  - q: After one click, what does the button show?
    code: |-
      function Counter() {
        const [count, setCount] = useState(0);
        const handleClick = () => {
          setCount(count + 1);
          setCount(count + 1);
          setCount(count + 1);
        };
        return <button onClick={handleClick}>{count}</button>;
      }
    options:
      - text: "3"
        correct: false
      - text: "2"
        correct: false
      - text: "1"
        correct: true
      - text: "0"
        correct: false
    explanation: "All three calls read the same stale count=0 from the closure, so each is setCount(0+1). React batches them -- final result: 1. To get 3, use functional updater: setCount(c => c+1) which chains off the queued value."
    difficulty: mid
  - q: Does Child reuse its state when toggled?
    code: |-
      function App() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(o => !o)}>toggle</button>
            {open ? <Child key="a" /> : <Child key="b" />}
          </>
        );
      }
      function Child() {
        const [n] = useState(Math.random());
        return <p>{n}</p>;
      }
    options:
      - text: Yes -- same component type so state is preserved
        correct: false
      - text: No -- different keys force unmount and remount, new state each time
        correct: true
      - text: Yes -- useState only initializes once
        correct: false
      - text: Depends on React version
        correct: false
    explanation: Different keys ('a' vs 'b') tell React these are completely different instances. React unmounts the old and mounts a new one, so useState re-runs and Math.random() produces a new number every toggle. Key is React's identity signal, not just a perf hint.
    difficulty: mid
  - q: How many times does the effect run after 3 clicks?
    code: |-
      function App() {
        const [count, setCount] = useState(0);
        useEffect(() => {
          document.title = count;
        });
        return <button onClick={() => setCount(c => c+1)}>{count}</button>;
      }
    options:
      - text: "1"
        correct: false
      - text: "3"
        correct: true
      - text: "4"
        correct: false
      - text: "0"
        correct: false
    explanation: No dependency array means effect runs after every render. But prompt says `after 3 clicks`, so by quiz wording rule you do not count initial mount. Three clicks cause three more renders, so effect runs 3 times for those clicks. If question asked total runs including mount, answer would be 4.
    difficulty: senior
  - q: What is the bug when id prop changes?
    code: |-
      function Profile({ id }) {
        const [data, setData] = useState(null);
        useEffect(() => {
          fetchUser(id).then(setData);
        }, []);
        return <div>{data?.name}</div>;
      }
    options:
      - text: No bug -- runs once and that is correct
        correct: false
      - text: Effect never re-runs when id changes -- shows stale data from initial id
        correct: true
      - text: fetchUser is missing from deps and will throw
        correct: false
      - text: setData causes infinite re-renders
        correct: false
    explanation: "[] means run once on mount. If id changes, the effect never fires again -- Profile keeps showing data from the original id. Fix: add id to deps [id]. One of the most common production React bugs. ESLint exhaustive-deps catches it automatically."
    difficulty: mid
  - q: Does "child render" log on every Parent re-render?
    code: |-
      const MemoChild = React.memo(function Child({ onClick }) {
        console.log("child render");
        return <button onClick={onClick}>click</button>;
      });
      function Parent() {
        const [n, setN] = useState(0);
        const handleClick = () => setN(n => n + 1);
        return (
          <>
            <MemoChild onClick={handleClick} />
            <p>{n}</p>
          </>
        );
      }
    options:
      - text: No -- React.memo prevents it
        correct: false
      - text: Yes -- handleClick is a new reference every render, breaking memo
        correct: true
      - text: Only on the first render
        correct: false
      - text: Only when n changes to an even number
        correct: false
    explanation: "React.memo does shallow prop comparison. handleClick is inline -- new function reference every render. To memo, onClick changed every time. Fix: wrap in useCallback(). Without it, React.memo around Child is effectively useless."
    difficulty: senior
  - q: What is the bug?
    code: |-
      function useWindowSize() {
        const [size, setSize] = useState({ w: 0, h: 0 });
        useEffect(() => {
          const handler = () =>
            setSize({ w: window.innerWidth, h: window.innerHeight });
          window.addEventListener("resize", handler);
        }, []);
        return size;
      }
    options:
      - text: useState should use separate w and h
        correct: false
      - text: resize listener is never removed -- memory leak on unmount
        correct: true
      - text: window is not available server-side
        correct: false
      - text: handler needs useCallback
        correct: false
    explanation: "No cleanup function is returned. When the component unmounts, the 'resize' listener stays attached to window, holding a reference to setSize and preventing GC. In a SPA with many mount/unmount cycles this accumulates. Fix: return () => window.removeEventListener('resize', handler)."
    difficulty: principal
  - q: How many times does "render" log after one click?
    code: |-
      function App() {
        const [a, setA] = useState(0);
        const [b, setB] = useState(0);
        const handleClick = () => {
          setA(1);
          setB(1);
        };
        console.log("render");
        return <button onClick={handleClick}>go</button>;
      }
    options:
      - text: "2"
        correct: false
      - text: "1"
        correct: true
      - text: "0"
        correct: false
      - text: Depends on React version
        correct: false
    explanation: "React 18 batches both state updates in same click handler into one re-render. Since prompt says `after one click`, count only click-triggered logs, not initial mount. Result: `render` logs once after click. Total including mount would be 2."
    difficulty: senior
  - q: What renders on initial mount?
    code: |-
      function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
      }
      function App() {
        const [n, setN] = useState(0);
        const prev = usePrevious(n);
        return <p>{prev} -> {n}</p>;
      }
    options:
      - text: "\"0 -> 0\""
        correct: false
      - text: "\"undefined -> 0\""
        correct: true
      - text: "\"null -> 0\""
        correct: false
      - text: Error -- ref.current is not initialized
        correct: false
    explanation: "On initial render: ref.current is undefined (no initial value). The render returns undefined and 0. The effect runs AFTER render and sets ref.current = 0. So on mount you see 'undefined -> 0'. On next render after setN you see '0 -> 1'. The effect always runs after the render it belongs to."
    difficulty: mid
  - q: What is rendered?
    code: |-
      function Wrapper({ condition, children }) {
        if (condition) {
          return <div className="box">{children}</div>;
        }
        return children;
      }
      function App() {
        return (
          <Wrapper condition={false}>
            <span>text</span>
          </Wrapper>
        );
      }
    options:
      - text: <div class="box"><span>text</span></div>
        correct: false
      - text: <span>text</span>
        correct: true
      - text: "null"
        correct: false
      - text: Error -- cannot return children directly
        correct: false
    explanation: condition=false so Wrapper returns children directly. children is <span>text</span>. React allows returning a ReactElement directly from render -- no wrapper needed. This is the conditional wrapper / transparent wrapper pattern, common in layout components that optionally add a container.
    difficulty: junior
  - q: Why is `ignore` used here?
    code: |-
      function Search({ term }) {
        const [results, setResults] = useState([]);
        useEffect(() => {
          let ignore = false;
          fetch(`/api/search?q=${term}`)
            .then(r => r.json())
            .then(data => {
              if (!ignore) setResults(data);
            });
          return () => {
            ignore = true;
          };
        }, [term]);
        return <pre>{JSON.stringify(results)}</pre>;
      }
    options:
      - text: To debounce requests so only one request is sent
        correct: false
      - text: To prevent older async responses from overwriting newer state after term changes
        correct: true
      - text: To force effect to run only once
        correct: false
      - text: To avoid fetch throwing on unmount
        correct: false
    explanation: When term changes quickly, earlier requests may resolve after later ones. Without the cleanup flag, stale response data can overwrite newer results. `ignore` does not cancel the request; it only prevents outdated completion handlers from calling setResults. This is classic effect race-condition protection.
    difficulty: senior
  - q: When button is clicked, does Toolbar render again?
    code: |-
      const ThemeContext = React.createContext({ theme: "light" });
      const Toolbar = React.memo(function Toolbar() {
        const value = useContext(ThemeContext);
        console.log("toolbar render");
        return <div>{value.theme}</div>;
      });
      function App() {
        const [count, setCount] = useState(0);
        return (
          <ThemeContext.Provider value={{ theme: "dark" }}>
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
            <Toolbar />
          </ThemeContext.Provider>
        );
      }
    options:
      - text: No, because React.memo blocks all re-renders
        correct: false
      - text: Yes, because provider gets a new object value on every App render, so context changes
        correct: true
      - text: No, because context value did not change
        correct: false
      - text: Only every second click
        correct: false
    explanation: "Provider creates fresh object literal `{ theme: 'dark' }` on every App render. Context compares provider value by reference, so Toolbar sees changed context and re-renders even though semantic theme string did not change. `React.memo` only helps with props; context updates still propagate. Real fix: memoize provider value or split static values out."
    difficulty: principal
  - q: What happens to Label after clicking "inc" once?
    code: |-
      const CountContext = React.createContext(0);
      const Label = React.memo(function Label() {
        const count = useContext(CountContext);
        console.log("label render");
        return <span>{count}</span>;
      });
      function App() {
        const [count, setCount] = useState(0);
        return (
          <CountContext.Provider value={count}>
            <button onClick={() => setCount(c => c + 1)}>inc</button>
            <Label />
          </CountContext.Provider>
        );
      }
    options:
      - text: It does not render because React.memo blocks it
        correct: false
      - text: It re-renders because context value changed
        correct: true
      - text: It unmounts and remounts
        correct: false
      - text: It throws because useContext cannot be used inside memo
        correct: false
    explanation: Context updates bypass prop memoization. `React.memo` only shallow-compares props, but `useContext(CountContext)` subscribes the component to provider value changes. After count changes from 0 to 1, Label re-renders even though it has no props. This catches teams that wrap everything in memo and expect context consumers to stop rendering.
    difficulty: mid
  - q: After one click, what shows?
    code: |-
      function reducer(state, action) {
        switch (action.type) {
          case "add":
            return { count: state.count + action.value };
          case "reset":
            return { count: 0 };
          default:
            return state;
        }
      }
      function Counter() {
        const [state, dispatch] = useReducer(reducer, { count: 1 });
        return (
          <button
            onClick={() => {
              dispatch({ type: "add", value: 2 });
              dispatch({ type: "add", value: 3 });
            }}
          >
            {state.count}
          </button>
        );
      }
    options:
      - text: "3"
        correct: false
      - text: "4"
        correct: false
      - text: "6"
        correct: true
      - text: "1"
        correct: false
    explanation: Reducer updates queue in order against latest reducer state, not stale closure values like `setCount(count + 1)`. Start at 1. First dispatch -> 3. Second dispatch -> 6. This is one reason reducers are good for sequential state transitions and more complex event logic.
    difficulty: mid
  - q: After clicking button and waiting, what value is repeatedly saved?
    code: |-
      function useAutoSave(value) {
        useEffect(() => {
          const id = setInterval(() => {
            save(value);
          }, 1000);
          return () => clearInterval(id);
        }, []);
      }
      function Editor() {
        const [text, setText] = useState("A");
        useAutoSave(text);
        return <button onClick={() => setText("B")}>{text}</button>;
      }
    options:
      - text: "\"B\""
        correct: false
      - text: "\"A\""
        correct: true
      - text: Both "A" and "B" alternating
        correct: false
      - text: Nothing, because cleanup clears interval immediately
        correct: false
    explanation: Effect has empty deps, so interval callback closes over initial `value` only. After text changes to B, interval keeps calling `save('A')`. This is stale-closure bug inside side effects. Fix with `[value]`, a ref pattern, or event-style APIs depending on save requirements.
    difficulty: senior
  - q: Initial render output?
    code: |-
      function Parent({ show }) {
        if (!show) return <p>Parent hidden</p>;
        return <Section ready={true} />;
      }
      function Section({ ready }) {
        if (!ready) return <p>Section blocked</p>;
        return <Panel expanded={false} />;
      }
      function Panel({ expanded }) {
        return expanded ? <p>Details</p> : <p>Collapsed</p>;
      }
      function App() {
        return <Parent show={true} />;
      }
    options:
      - text: "\"Parent hidden\""
        correct: false
      - text: "\"Section blocked\""
        correct: false
      - text: "\"Details\""
        correct: false
      - text: "\"Collapsed\""
        correct: true
    explanation: Three levels matter here. App passes show=true, so Parent renders Section. Section gets ready=true, so it renders Panel. Panel gets expanded=false, so final output is 'Collapsed'. This mirrors real UI trees where layout, permission, and local display conditions stack across parent-child-grandchild levels.
    difficulty: junior
  - q: What is rendered?
    code: |-
      function GrandParent({ signedIn }) {
        return signedIn ? <Parent canView={false} /> : <p>Login</p>;
      }
      function Parent({ canView }) {
        return <Child enabled={canView ? false : true} />;
      }
      function Child({ enabled }) {
        return enabled ? <p>Dashboard</p> : null;
      }
      function App() {
        return <GrandParent signedIn={true} />;
      }
    options:
      - text: "\"Login\""
        correct: false
      - text: "\"Dashboard\""
        correct: true
      - text: nothing from Child
        correct: false
      - text: React throws because Child returns null
        correct: false
    explanation: "GrandParent passes signedIn=true, so Parent renders. Parent gets canView=false and passes enabled=true. Child returns <p>Dashboard<p>. Important production lesson: permission-gated trees can look mounted at upper levels while leaf UI intentionally renders nothing."
    difficulty: junior
  - q: What is bug?
    code: |-
      function List({ items, filter }) {
        const visible = useMemo(() => {
          return items.filter(item => item.includes(filter));
        }, [items]);
        return <p>{visible.length}</p>;
      }
    options:
      - text: useMemo cannot return arrays
        correct: false
      - text: filter missing from dependency array, so visible can become stale
        correct: true
      - text: items should never be in deps
        correct: false
      - text: filter must be wrapped in useCallback
        correct: false
    explanation: Memoized computation depends on both `items` and `filter`. With `[items]` only, changing filter alone keeps old visible list. This is same class of stale-data bug as effects with missing deps, just in render-time memoization instead of side effects.
    difficulty: mid
  - q: Why useRef here instead of useState?
    code: |-
      function Form() {
        const inputRef = useRef(null);
        useEffect(() => {
          inputRef.current.focus();
        }, []);
        return <input ref={inputRef} />;
      }
    options:
      - text: Because refs store DOM nodes without causing re-renders when updated
        correct: true
      - text: Because state cannot hold objects
        correct: false
      - text: Because refs are reactive and rerender automatically
        correct: false
      - text: Because focus only works in reducers
        correct: false
    explanation: "`useRef` is for mutable value that survives renders without triggering one. DOM node references are perfect fit. If this lived in state, setting it would add unnecessary render churn and complicate imperative DOM access. Common hook interview topic: state is for UI data, ref is for mutable instance-like storage."
    difficulty: senior
  - q: On open, then close, what logs?
    code: |-
      function App() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(o => !o)}>toggle</button>
            {open && <Modal />}
          </>
        );
      }
      function Modal() {
        useEffect(() => {
          console.log("subscribe");
          return () => console.log("cleanup");
        }, []);
        return <div>Modal</div>;
      }
    options:
      - text: "\"subscribe\", then \"cleanup\""
        correct: true
      - text: "\"cleanup\", then \"subscribe\""
        correct: false
      - text: "\"subscribe\" only"
        correct: false
      - text: Nothing because effect has []
        correct: false
    explanation: When open becomes true, Modal mounts and effect runs -> `subscribe`. When open becomes false, Modal unmounts and cleanup runs -> `cleanup`. Empty deps means run once per mount lifecycle, not once forever. This is core to subscriptions, event listeners, and portals/modals.
    difficulty: principal
  - q: What is bug?
    code: |-
      function App() {
        const [user, setUser] = useState({ name: "Ada", role: "dev" });
        const promote = () => {
          user.role = "lead";
          setUser(user);
        };
        return <button onClick={promote}>{user.role}</button>;
      }
    options:
      - text: No bug, role updates to lead correctly
        correct: false
      - text: State object is mutated in place, so React may bail because reference did not change
        correct: true
      - text: useState cannot store objects
        correct: false
      - text: Button text cannot render object fields
        correct: false
    explanation: "React state updates rely on new references. Here code mutates existing object and passes same reference back into state. React may treat it as unchanged and skip render. Correct fix: `setUser(u => ({ ...u, role: 'lead' }))`. This is common source of stale UI in forms and nested data."
    difficulty: junior
  - q: What is problem with updater?
    code: |-
      function App() {
        const [items, setItems] = useState(["a"]);
        const add = () => {
          setItems(prev => {
            prev.push("b");
            return prev;
          });
        };
        return <button onClick={add}>{items.join(",")}</button>;
      }
    options:
      - text: Functional updaters cannot return arrays
        correct: false
      - text: It mutates prev array and returns same reference
        correct: true
      - text: push is async so item order is unstable
        correct: false
      - text: join causes rerender loop
        correct: false
    explanation: "Functional updater helps avoid stale closures, but it does not make mutation safe. `prev.push('b')` mutates existing array, then returns same reference. React can bail and UI can desync. Correct version: `return [...prev, 'b']`."
    difficulty: mid
  - q: What appears after effects settle?
    code: |-
      function App() {
        const [count, setCount] = useState(0);
        useEffect(() => {
          if (count < 3) {
            setCount(count + 1);
          }
        }, [count]);
        return <p>{count}</p>;
      }
    options:
      - text: "0"
        correct: false
      - text: "1"
        correct: false
      - text: "3"
        correct: true
      - text: Infinite loop forever
        correct: false
    explanation: Effect runs after mount with count=0, then sets 1. It repeats for 1 and 2. When count reaches 3, condition fails and loop stops. This is controlled render-effect loop, not infinite loop. Important distinction in interview and production debugging.
    difficulty: mid
  - q: Why is initial state read outside effect?
    code: |-
      function useOnlineStatus() {
        const [online, setOnline] = useState(navigator.onLine);
        useEffect(() => {
          const on = () => setOnline(true);
          const off = () => setOnline(false);
          window.addEventListener("online", on);
          window.addEventListener("offline", off);
          return () => {
            window.removeEventListener("online", on);
            window.removeEventListener("offline", off);
          };
        }, []);
        return online;
      }
    options:
      - text: Because effects run after first render, but UI needs immediate initial value
        correct: true
      - text: Because addEventListener requires useState first
        correct: false
      - text: Because navigator.onLine changes automatically inside state
        correct: false
      - text: Because cleanup cannot access state initialized in effect
        correct: false
    explanation: Effects run after paint. If initial online value were only set inside effect, first render could show wrong state. Reading initial value during render gives immediate UI, while effect handles subscriptions. This pattern appears often in custom hooks wrapping browser APIs.
    difficulty: junior
  - q: What is issue?
    code: |-
      function Parent() {
        const [query, setQuery] = useState("");
        return (
          <>
            <input value={query} onChange={e => setQuery(e.target.value)} />
            <Results query={query} />
          </>
        );
      }
      const Results = React.memo(function Results({ query }) {
        const params = { q: query };
        useEffect(() => {
          fetchResults(params);
        }, [params]);
        return null;
      });
    options:
      - text: React.memo prevents effect from running
        correct: false
      - text: params is new object every render, so effect runs every render
        correct: true
      - text: query cannot be passed to memo child
        correct: false
      - text: fetchResults must be inside Parent
        correct: false
    explanation: Dependency array compares by reference. `params` is recreated on every render, so effect sees changed dependency every time. Use `[query]` directly or memoize params object if truly needed. This is common object-identity bug around effects and memoization.
    difficulty: mid
  - q: When switching tabs, is Panel state preserved?
    code: |-
      function App() {
        const [tab, setTab] = useState("home");
        return (
          <>
            <button onClick={() => setTab("settings")}>go</button>
            {tab === "home" && <Panel />}
            {tab === "settings" && <Panel />}
          </>
        );
      }
      function Panel() {
        const [count] = useState(1);
        return <p>{count}</p>;
      }
    options:
      - text: Yes, same component function means same state always
        correct: false
      - text: No, because one Panel unmounts and another mounts in different branch positions
        correct: true
      - text: Yes, because both branches render Panel with no key
        correct: false
      - text: Only in production build
        correct: false
    explanation: These are separate conditional branches. When `home` becomes false, first Panel unmounts. Then second branch mounts its own Panel instance. Same component type is not enough; position in tree determines identity. State resets across such branch swaps.
    difficulty: junior
  - q: What does Header render?
    code: |-
      const AuthContext = React.createContext(null);
      function Header() {
        const auth = useContext(AuthContext);
        return <p>{auth?.user?.name ?? "guest"}</p>;
      }
      function App() {
        return <Header />;
      }
    options:
      - text: "\"guest\""
        correct: true
      - text: "\"null\""
        correct: false
      - text: Throws because provider is missing
        correct: false
      - text: undefined
        correct: false
    explanation: When no provider exists above consumer, `useContext(AuthContext)` returns context default value, here `null`. Optional chaining plus nullish coalescing falls back to 'guest'. Missing provider does not throw by itself unless custom hook explicitly checks for it.
    difficulty: senior
  - q: After one click, what shows?
    code: |-
      function reducer(state, action) {
        switch (action.type) {
          case "toggle":
            return { ...state, open: !state.open };
          case "rename":
            return { ...state, name: action.name };
          default:
            return state;
        }
      }
      function App() {
        const [state, dispatch] = useReducer(reducer, { open: false, name: "A" });
        const click = () => {
          dispatch({ type: "toggle" });
          dispatch({ type: "rename", name: "B" });
        };
        return <button onClick={click}>{state.open ? state.name : "closed"}</button>;
      }
    options:
      - text: "\"closed\""
        correct: false
      - text: "\"A\""
        correct: false
      - text: "\"B\""
        correct: true
      - text: Nothing until second click
        correct: false
    explanation: "Reducer actions process in order against updated state. First action opens panel. Second action renames to B. Final state is `{ open: true, name: 'B' }`, so button shows B. Good reducer question because multiple fields change in one event without stale state confusion."
    difficulty: senior
  - q: Final output?
    code: |-
      function GrandParent({ enabled }) {
        return enabled ? <Parent loaded={true} /> : <p>Off</p>;
      }
      function Parent({ loaded }) {
        return loaded ? <Child items={[]} /> : <p>Loading</p>;
      }
      function Child({ items }) {
        return items.length ? <ul>{items.map(i => <li key={i}>{i}</li>)}</ul> : <p>Empty</p>;
      }
      function App() {
        return <GrandParent enabled={true} />;
      }
    options:
      - text: "\"Off\""
        correct: false
      - text: "\"Loading\""
        correct: false
      - text: "\"Empty\""
        correct: true
      - text: <ul></ul>
        correct: false
    explanation: Three levels of conditions. enabled=true -> Parent. loaded=true -> Child. items=[] so length is 0 and Child returns 'Empty'. In real apps this pattern shows up with feature flag, fetch state, then data-empty state at leaf.
    difficulty: junior
  - q: "This input is:"
    code: |-
      function App() {
        const [value, setValue] = useState("");
        return (
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        );
      }
    options:
      - text: Uncontrolled, because browser owns current value
        correct: false
      - text: Controlled, because React state drives value prop
        correct: true
      - text: Hybrid, because onChange makes it both
        correct: false
      - text: Read-only, because value prop is present
        correct: false
    explanation: Input receives its displayed value from React state through `value={value}`. `onChange` writes browser edits back into state, completing controlled loop. This is foundational React forms concept and often tied to validation, masking, and debounced submission flows.
    difficulty: mid
  - q: Is `double` missing from deps?
    code: |-
      function App() {
        const [n, setN] = useState(0);
        const double = n * 2;
        useEffect(() => {
          console.log(double);
        }, [n]);
        return <button onClick={() => setN(n + 1)}>{double}</button>;
      }
    options:
      - text: Yes, effect is always wrong without double in deps
        correct: false
      - text: No, because double is derived from n and changes only when n changes
        correct: true
      - text: Yes, primitives must always be listed separately
        correct: false
      - text: Depends on strict mode only
        correct: false
    explanation: "If a value is fully derived from declared dependency `n`, then tracking `n` is enough. Adding `double` would be redundant, not more correct. Important nuance: exhaustive deps is about actual reactive inputs, not every local variable blindly."
    difficulty: principal
  - q: Why is useCallback useful here?
    code: |-
      function App() {
        const [count, setCount] = useState(0);
        const increment = useCallback(() => setCount(c => c + 1), []);
        return <Child onAdd={increment} />;
      }
      const Child = React.memo(function Child({ onAdd }) {
        console.log("child render");
        return <button onClick={onAdd}>add</button>;
      });
    options:
      - text: It makes setCount synchronous
        correct: false
      - text: It keeps onAdd reference stable so memo child can avoid re-render from prop identity changes
        correct: true
      - text: It prevents Child from ever rendering
        correct: false
      - text: It batches multiple updates automatically
        correct: false
    explanation: "`React.memo` shallow-compares props. Without `useCallback`, inline handler would be new function each render and break memoization. Here callback has no changing dependencies because functional updater removes need to read `count` from closure. Classic correct use of `useCallback`."
    difficulty: senior
  - q: What happens to `id.current` after hide and later show again?
    code: |-
      function App() {
        const [show, setShow] = useState(true);
        return (
          <>
            <button onClick={() => setShow(false)}>hide</button>
            {show ? <Widget /> : null}
          </>
        );
      }
      function Widget() {
        const id = useRef(Math.random());
        return <p>{id.current}</p>;
      }
    options:
      - text: Same value, refs survive unmounts
        correct: false
      - text: New value, because Widget unmounts and new instance mounts later
        correct: true
      - text: undefined until second render
        correct: false
      - text: It becomes null after cleanup
        correct: false
    explanation: "`useRef` survives re-renders of same mounted instance, not unmount/remount cycles. When Widget is removed from tree, its instance is gone. Showing it again creates fresh component instance and new random ref value. This matters for caching assumptions and imperative handles."
    difficulty: mid
  - q: How many times is "app" logged clicking button once?
    code: |-
      function App() {
        const [n, setN] = useState(0);
        console.log("app");
        return <button onClick={() => setN(1)}>{n}</button>;
      }
    options:
      - text: "0"
        correct: false
      - text: "1"
        correct: false
      - text: "2"
        correct: true
      - text: Depends on whether button is clicked
        correct: false
    explanation: "Question does not say `after`, so include initial mount. First render logs once. Clicking button changes state from 0 to 1, causing one more render and one more log. Total: 2. This is exact wording rule you wanted: no `after` means include initial render."
    difficulty: mid
  - q: How many times is "child visible" logged after one click?
    code: |-
      function Child({ visible = true }) {
        if (visible) console.log("child visible");
        return visible ? <p>shown</p> : null;
      }
      function App() {
        const [show, setShow] = useState(false);
        return (
          <>
            <button onClick={() => setShow(true)}>show</button>
            <Child visible={show} />
          </>
        );
      }
    options:
      - text: "0"
        correct: false
      - text: "1"
        correct: true
      - text: "2"
        correct: false
      - text: "3"
        correct: false
    explanation: On first render show=false, so nothing logs. After click show=true, Child re-renders and condition passes once, so `child visible` logs once.
    difficulty: senior
  - q: How many logs happen after one click? Count both "app" and "child".
    code: |-
      function Child() {
        console.log("child");
        return <p>child</p>;
      }
      function App() {
        const [open, setOpen] = useState(false);
        console.log("app");
        return (
          <>
            <button onClick={() => setOpen(true)}>open</button>
            {open ? <Child /> : null}
          </>
        );
      }
    options:
      - text: 1 app, 0 child
        correct: false
      - text: 1 app, 1 child
        correct: true
      - text: 2 app, 1 child
        correct: false
      - text: 2 app, 2 child
        correct: false
    explanation: "Click sets open=true. App re-renders and logs `app` once. Because open is now true, Child mounts and logs `child` once. Since question says `after one click`, initial mount `app` log is excluded. Total after click: 1 app, 1 child."
    difficulty: senior
  - q: How many times is "even" logged after two clicks?
    code: |-
      function Child({ count }) {
        if (count % 2 === 0) console.log("even");
        return <p>{count}</p>;
      }
      function App() {
        const [count, setCount] = useState(0);
        return <button onClick={() => setCount(c => c + 1)}><Child count={count} /></button>;
      }
    options:
      - text: "0"
        correct: false
      - text: "1"
        correct: true
      - text: "2"
        correct: false
      - text: "3"
        correct: false
    explanation: "Prompt says `after two clicks`, so ignore initial render where count=0 would log `even`. After first click count=1, no log. After second click count=2, condition passes and logs once. Total after clicks only: 1."
    difficulty: junior
  - q: How many logs happen in total if we click once? Count both "child" and "effect".
    code: |-
      function Child({ value }) {
        console.log("child");
        useEffect(() => {
          console.log("effect");
        }, [value]);
        return <p>{value}</p>;
      }
      function App() {
        const [value, setValue] = useState(0);
        return <button onClick={() => setValue(1)}><Child value={value} /></button>;
      }
    options:
      - text: 1 child, 1 effect
        correct: false
      - text: 2 child, 1 effect
        correct: false
      - text: 2 child, 2 effect
        correct: true
      - text: 3 child, 2 effect
        correct: false
    explanation: "Question does not say `after`, so include mount. Initial render: `child` logs once, then effect logs once. Click changes value to 1: Child re-renders and logs `child` again, then effect runs again because dependency changed. Total = 2 child, 2 effect."
    difficulty: mid
  - q: How many times is "child" logged clicking button once?
    code: |-
      function GrandChild({ ready }) {
        if (ready) console.log("grandchild");
        return ready ? <p>ready</p> : <p>waiting</p>;
      }
      function Child({ enabled }) {
        console.log("child");
        return <GrandChild ready={enabled} />;
      }
      function App() {
        const [enabled, setEnabled] = useState(false);
        console.log("app");
        return (
          <>
            <button onClick={() => setEnabled(true)}>enable</button>
            <Child enabled={enabled} />
          </>
        );
      }
    options:
      - text: "0"
        correct: false
      - text: "1"
        correct: false
      - text: "2"
        correct: true
      - text: "3"
        correct: false
    explanation: "No `after`, so include mount. Child renders on initial mount and logs once. Clicking enable re-renders App and Child, so Child logs one more time. Total `child` logs: 2. `grandchild` only logs on second render because enabled becomes true, but question asks only about `child`."
    difficulty: mid
  - q: After one click, how many times is "idle" logged?
    code: |-
      function Row({ selected }) {
        if (selected) {
          console.log("selected");
          return <p>selected</p>;
        }
        console.log("idle");
        return <p>idle</p>;
      }
      function App() {
        const [selected, setSelected] = useState(false);
        return <button onClick={() => setSelected(true)}><Row selected={selected} /></button>;
      }
    options:
      - text: "0"
        correct: true
      - text: "1"
        correct: false
      - text: "2"
        correct: false
      - text: Depends on whether Row returns null
        correct: false
    explanation: Prompt says `After one click`, so ignore initial mount, where `idle` does log once. After click, selected=true and Row logs `selected`, not `idle`. So `idle` is logged 0 times after click. Good trap question because initial render would change answer if `after` were missing.
    difficulty: principal
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
    explanation: React is JavaScript-heavy, and many real bugs come from stale closures, async timing, and misunderstanding event flow. Hooks especially depend on lexical scope behavior. Strong JS fundamentals directly improve React correctness and maintainability.
    difficulty: mid
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
    explanation: React component lifecycle is commonly described as mounting, updating, and unmounting. Class components expose lifecycle methods for these phases, while function components express similar behavior through hooks. Understanding phase boundaries helps place side effects correctly.
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
    explanation: Mount-time logic is commonly used for fetching, subscriptions, analytics, or setup work that should begin after component renders. It does not justify prop mutation or remove need for cleanup. Correct placement of side effects avoids bugs and duplicate work.
    difficulty: junior
  - q: Which state management option is usually enough for component-local state?
    options:
      - text: "`useState` or `useReducer`"
        correct: true
      - text: Redux for every input and toggle
        correct: false
      - text: Context for all state, regardless of scope
        correct: false
      - text: Apollo Client even when no remote data exists
        correct: false
    explanation: Local component concerns should usually stay local with `useState` or `useReducer`. Global solutions add complexity and should solve real sharing or coordination problems. Over-centralizing state is common source of unnecessary architecture.
    difficulty: junior
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
    explanation: Context works well for relatively simple cross-tree sharing such as theme, auth session, or lightweight config. Redux is often chosen when state flows become more complex and need stronger tooling. Fit depends on scale and change patterns, not trend.
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
    explanation: These tools help avoid avoidable work by preserving references or memoizing output where it matters. They are performance tools, not correctness tools by themselves, and should be used deliberately. Poor state structure can still cause excessive rendering despite memoization.
    difficulty: mid
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
    explanation: State shape influences how often components re-render, how difficult updates become, and how much data must be passed around. Nested state and excessive prop drilling increase churn and complexity. Good state design is major performance and maintainability lever.
    difficulty: senior
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
    explanation: Controlled inputs derive value from React state and update through handlers, which gives predictability and easier validation. Uncontrolled inputs rely on DOM state, often accessed through refs. Each approach has tradeoffs, but controlled is default for most forms.
    difficulty: junior
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
    explanation: Uncontrolled inputs can be practical for simple forms, third-party DOM integrations, or performance-sensitive cases where full controlled state adds noise. They are not default answer for complex validation-heavy workflows. Senior engineers choose based on tradeoff, not dogma.
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
    explanation: Large codebases benefit from modular structure, reusable building blocks, and clear ownership boundaries. Feature or domain organization usually scales better than giant generic folders. Naming clarity matters because navigation and onboarding cost grows with repo size.
    difficulty: mid
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
    explanation: Function components use effect hooks to coordinate work outside pure rendering, such as network requests, subscriptions, DOM sync, or cleanup. Custom hooks often package repeated effect logic cleanly. Rendering should remain free of imperative side effects.
    difficulty: junior
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
    explanation: Redux is valued for predictability, explicit flows, devtools, and broad ecosystem support. It does not eliminate async concerns and can be overkill for smaller apps. Its strengths show most clearly when shared state complexity is high.
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
    explanation: Redux solves real coordination problems, but using it everywhere can increase ceremony and maintenance cost. Middleware and modern tooling address async use cases, so that is not its core limitation. Right-sized architecture matters more than library loyalty.
    difficulty: mid
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
    explanation: Destructuring, modules, arrow functions, and other syntax improve code clarity, but shipped code must still work in supported environments. Tooling like Babel or framework compilers bridges that gap. Team consistency also matters so features are used intentionally and predictably.
    difficulty: senior
  - q: <LoggedButton color="red" size="lg" /> -- what does Button receive?
    code: |-
      function withLogger(Component) {
        return function Logged(props) {
          console.log("render", Component.displayName);
          return <Component {...props} />;
        };
      }
      const LoggedButton = withLogger(Button);
    topics:
      - react
      - design-patterns
    options:
      - text: No props -- HOC must pass props explicitly by name
        correct: false
      - text: "{ color: 'red', size: 'lg' } -- all props forwarded via spread"
        correct: true
      - text: "{ color: 'red' } -- size is swallowed by the HOC"
        correct: false
      - text: Error -- HOC wrapping requires forwardRef
        correct: false
    explanation: "{...props} spreads all received props onto the wrapped component. LoggedButton receives {color:'red', size:'lg'} and passes them through to Button unchanged. The HOC adds the logging side effect transparently. Standard HOC prop forwarding contract -- the wrapper must never swallow props."
    difficulty: junior
  - q: <ProtectedDash isLoggedIn={true} user={me} /> -- what does Dashboard receive?
    code: |-
      function withAuth(Component) {
        return function Protected({ isLoggedIn, ...rest }) {
          if (!isLoggedIn) return <Redirect to="/login" />;
          return <Component {...rest} />;
        };
      }
      const ProtectedDash = withAuth(Dashboard);
    topics:
      - react
      - design-patterns
    options:
      - text: "{ isLoggedIn: true, user: me }"
        correct: false
      - text: "{ user: me } -- isLoggedIn is consumed by the HOC and not forwarded"
        correct: true
      - text: <Redirect to='/login' />
        correct: false
      - text: Error -- rest props cannot be spread onto a component
        correct: false
    explanation: isLoggedIn is destructured out of props. ...rest captures everything else ({user:me}). Since isLoggedIn=true the guard passes and renders <Component {...rest}> = <Dashboard user={me} />. isLoggedIn does NOT reach Dashboard -- it was consumed by the HOC. Implementation details of the wrapper should not leak into the wrapped component.
    difficulty: mid
  - q: <PrimaryButton color="red" /> -- what props does Button receive?
    code: |-
      function withDefaults(Component, defaults) {
        return function WithDefaults(props) {
          return <Component {...defaults} {...props} />;
        };
      }
      const PrimaryButton = withDefaults(Button, { color: "blue", size: "md" });
    topics:
      - react
      - design-patterns
    options:
      - text: "{ color: 'blue', size: 'md' }"
        correct: false
      - text: "{ color: 'red', size: 'md' }"
        correct: true
      - text: "{ color: 'blue', size: 'md', color: 'red' } -- duplicate key"
        correct: false
      - text: "{ color: 'red' }"
        correct: false
    explanation: "Spread order matters. {...defaults} applies first (color:'blue', size:'md'), then {...props} overrides (color:'red'). Final: {color:'red', size:'md'}. Caller always wins. If reversed ({...props} then {...defaults}), defaults would always win and callers could never override. A common HOC bug."
    difficulty: senior
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
    explanation: "HOC composition reads inside-out. withTheme(Dashboard) runs first. withAuth(ThemeDash) runs next. withLogger(AuthDash) runs last and is outermost. Render call order: Logger -> Auth -> Theme -> Dashboard. This matters when HOCs depend on each other -- withAuth must run before withLogger if Logger needs auth state."
    difficulty: principal
  - q: What happens on mount?
    code: |-
      const EnhancedInput = React.forwardRef(function(props, ref) {
        return <input ref={ref} className="enhanced" {...props} />;
      });
      function Form() {
        const inputRef = useRef(null);
        useEffect(() => {
          inputRef.current.focus();
        }, []);
        return <EnhancedInput ref={inputRef} placeholder="type here" />;
      }
    topics:
      - react
      - design-patterns
    options:
      - text: Error -- forwardRef cannot be used with functional components
        correct: false
      - text: The input gets focus and has class 'enhanced' and placeholder 'type here'
        correct: true
      - text: inputRef.current is null because ref is not forwarded correctly
        correct: false
      - text: focus() fails because useEffect runs before mount
        correct: false
    explanation: forwardRef passes the ref through to the underlying input. useEffect runs after the DOM is painted so inputRef.current is the actual input element and focus() works. {...props} spreads placeholder onto input. className='enhanced' is always applied. Required whenever a parent needs direct DOM access to a wrapped component.
    difficulty: junior
  - q: What design pattern is this and what problem does it solve?
    code: |-
      // Compound Component pattern
      const TabsContext = createContext();
      function Tabs({ children }) {
        const [active, setActive] = useState(0);
        return (
          <TabsContext.Provider value={{ active, setActive }}>
            {children}
          </TabsContext.Provider>
        );
      }
      Tabs.List = function({ children }) { return <div role="tablist">{children}</div>; };
      Tabs.Tab = function({ index, children }) {
        const { active, setActive } = useContext(TabsContext);
        return <button aria-selected={active === index} onClick={() => setActive(index)}>{children}</button>;
      };
      Tabs.Panel = function({ index, children }) {
        const { active } = useContext(TabsContext);
        return active === index ? <div>{children}</div> : null;
      };
    topics:
      - react
      - design-patterns
    options:
      - text: HOC pattern -- enhances a single component with extra functionality
        correct: false
      - text: Compound Component pattern -- shares implicit state via context so callers compose flexible layouts without prop drilling
        correct: true
      - text: Observer pattern -- Tabs observes child state changes
        correct: false
      - text: Factory pattern -- Tabs creates child components dynamically
        correct: false
    explanation: Compound Components share implicit state through context. Callers compose Tab.List, Tab.Tab, and Tab.Panel in any layout they want -- no prop drilling needed. Used by Radix UI, Reach UI, Headless UI. The parent (Tabs) owns state, children access it via context. Enables maximum layout flexibility while keeping the component API clean.
    difficulty: mid
  - q: Chart throws during render. What does SafeChart show?
    code: |-
      function withErrorBoundary(Component) {
        return class extends React.Component {
          state = { error: null };
          static getDerivedStateFromError(e) { return { error: e }; }
          render() {
            if (this.state.error)
              return <p>Error: {this.state.error.message}</p>;
            return <Component {...this.props} />;
          }
        };
      }
      const SafeChart = withErrorBoundary(Chart);
    topics:
      - react
      - design-patterns
    options:
      - text: The error propagates to the nearest parent boundary
        correct: false
      - text: "<p>Error: {the error message}</p>"
        correct: true
      - text: Nothing -- the component tree crashes silently
        correct: false
      - text: Chart retries rendering automatically
        correct: false
    explanation: getDerivedStateFromError catches the throw during Chart's render phase and sets error in the HOC's class state. The next render hits the guard and returns the fallback. Error boundaries MUST be class components -- getDerivedStateFromError cannot be implemented in a function component. The boundary only catches errors in its children, not itself.
    difficulty: senior
  - q: What problem does render props solve vs a regular component?
    code: |-
      // Render Props pattern
      function MouseTracker({ render }) {
        const [pos, setPos] = useState({ x: 0, y: 0 });
        return (
          <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
            {render(pos)}
          </div>
        );
      }
      // Usage:
      <MouseTracker render={({ x, y }) => <p>{x}, {y}</p>} />
    topics:
      - react
      - design-patterns
    options:
      - text: It runs faster because it avoids reconciliation
        correct: false
      - text: It inverts control -- the caller decides what to render with the shared state, making the logic reusable without coupling it to a specific UI
        correct: true
      - text: It prevents re-renders when mouse moves
        correct: false
      - text: It replaces the need for context
        correct: false
    explanation: "Render props invert control: MouseTracker owns the behavior (tracking position) and the caller decides what to render with it. The same tracker can power a tooltip, a canvas cursor, a debug overlay -- without changing MouseTracker. Today custom hooks often replace render props for logic sharing, but the pattern still appears in react-table, Formik, and Downshift."
    difficulty: principal
  - q: Three different product teams each own one of these concerns. What is the architectural problem?
    code: |-
      function Dashboard() {
        const [user, setUser] = useState(null);
        const [posts, setPosts] = useState([]);
        const [theme, setTheme] = useState("light");
        useEffect(() => { fetchUser().then(setUser); }, []);
        useEffect(() => { fetchPosts().then(setPosts); }, []);
        return (
          <div className={theme}>
            <Header user={user} onTheme={setTheme} />
            <Feed posts={posts} />
          </div>
        );
      }
    topics:
      - react
      - solid-principles
    options:
      - text: Too many useEffect calls -- maximum is 2
        correct: false
      - text: It owns three unrelated concerns making it a change magnet -- any team touching any concern must edit this file
        correct: true
      - text: useState cannot be called three times in one component
        correct: false
      - text: No problem -- this is standard React
        correct: false
    explanation: "SRP violation that only shows at scale. User auth, post feed, and theme are three independent domains. Any of the three product teams touching this file creates merge conflicts and regression risk. Fix: extract useUser(), usePosts(), useTheme() hooks. Dashboard becomes a thin compositor. Test: how many teams edit this file? More than one = SRP violation."
    difficulty: junior
  - q: A "info" type is needed. A "critical" type might come later. What is the architectural risk?
    code: |-
      function Notification({ type, message }) {
        let icon, color;
        if (type === "success") { icon = "check"; color = "green"; }
        else if (type === "error") { icon = "x"; color = "red"; }
        else if (type === "warning") { icon = "alert"; color = "yellow"; }
        return <div style={{color}}><Icon name={icon}/>{message}</div>;
      }
    topics:
      - react
      - solid-principles
    options:
      - text: No risk -- adding an else if is trivial
        correct: false
      - text: Every new type requires modifying the conditional chain, risking regressions on existing types and blocking parallel feature work
        correct: true
      - text: The component should be split into Success, Error, Warning sub-components
        correct: false
      - text: color should come from CSS classes not inline style
        correct: false
    explanation: "OCP: open for extension, closed for modification. Every new type touches the same chain. Fix: const CONFIG = { success: {icon:'check',color:'green'}, ... }. Adding 'info' means one new key -- zero conditional changes. Scales to 20 types with no branching growth and no risk of touching existing paths."
    difficulty: mid
  - q: A component only needs field validation, nothing else. Which approach is better and why?
    code: |-
      // Option A: One hook does everything
      function useForm(config) {
        // validation + submission + dirty tracking + field state
      }

      // Option B: Focused hooks
      const useFormField = (name) => { /* value, onChange, error for one field */ };
      const useFormSubmit = (onSubmit) => { /* submission only */ };
      const useFormDirty = () => { /* dirty tracking only */ };
    topics:
      - react
      - solid-principles
    options:
      - text: Option A -- one hook is simpler to import
        correct: false
      - text: Option B -- the component only depends on the interface it needs, not a fat hook forcing unused submission and dirty tracking
        correct: true
      - text: They are identical -- hooks do not have the coupling problem of classes
        correct: false
      - text: Option A is better for testing
        correct: false
    explanation: "ISP: do not force clients to depend on interfaces they do not use. A single useForm() couples components needing field validation to submission logic. Splitting into focused hooks means a field component only imports what it needs. React Query, React Hook Form, and Zustand all follow this -- expose granular hooks so you only subscribe to the slice you consume."
    difficulty: senior
  - q: This Modal is reused in 20 places across the app. Some contexts should not track the event. What is the problem?
    code: |-
      function Modal({ onClose }) {
        return (
          <div>
            <button onClick={() => {
              analytics.track('modal_closed');
              onClose();
            }}>X</button>
          </div>
        );
      }
    topics:
      - react
      - solid-principles
    options:
      - text: No problem -- analytics tracking is always appropriate
        correct: false
      - text: Modal is coupled to analytics -- reusing it in no-tracking contexts fires the event anyway, and changing the tracking call touches all 20 usages
        correct: true
      - text: analytics.track should be in useEffect instead
        correct: false
      - text: The button needs an aria-label
        correct: false
    explanation: "SRP: Modal should not know about analytics. It also violates DIP -- it depends on the concrete analytics service rather than the onClose abstraction. Fix: the caller passes onClose that tracks if needed. Modal stays pure. Reuse in no-tracking contexts costs nothing. Each callsite controls its own side effects."
    difficulty: principal
  - q: "Usage A: <DataTable fetchData={() => fetch('/api').then(r => r.json())} /> Usage B: <DataTable fetchData={() => Promise.resolve(mockRows)} /> Usage C: <DataTable fetchData={graphqlClient.getRows} /> Which principle does this design demonstrate?"
    code: |-
      function DataTable({ fetchData }) {
        const [rows, setRows] = useState([]);
        useEffect(() => {
          fetchData().then(setRows);
        }, [fetchData]);
        return <table>...</table>;
      }
    topics:
      - react
      - solid-principles
    options:
      - text: SRP -- DataTable has one job
        correct: false
      - text: DIP -- DataTable depends on the fetchData abstraction not a concrete fetch call, making all three usages possible without modifying the component
        correct: true
      - text: OCP -- DataTable cannot be modified
        correct: false
      - text: ISP -- the props interface is minimal
        correct: false
    explanation: "DIP: high-level component depends on an abstraction (fetchData: () => Promise<Row[]>), not on fetch() directly. REST, GraphQL, or mock all satisfy the contract. Also LSP: any function returning Promise<Row[]> substitutes fetchData. This is what makes DataTable testable -- pass () => Promise.resolve(mockData) in tests. Foundation of headless component design."
    difficulty: junior
  - q: What is the architectural consequence of this interface?
    code: |-
      function Button({
        onClick, label, style, className,
        isLoading, loadingText, disabled, disabledReason,
        icon, iconPosition, tooltip, tooltipDelay,
        analyticsEvent, analyticsPayload
      }) { /* ... */ }
    topics:
      - react
      - solid-principles
    options:
      - text: No consequence -- more props means more flexibility
        correct: false
      - text: Every consumer must understand 14 props even using 2, any prop change breaks all consumers, and unrelated concerns are coupled into one component
        correct: true
      - text: TypeScript will reject this prop signature
        correct: false
      - text: The only fix is to use a class component
        correct: false
    explanation: "ISP: a 14-prop component forces every consumer to understand the full interface even if they use 2 props. Tooltip should compose Tooltip around Button. Analytics belongs in onClick at the callsite. Loading state can be LoadingButton. Each concern extracted means the Button interface stays stable. This is how Radix UI, Headless UI, and React Aria are built: minimal props per primitive."
    difficulty: mid
  - q: What does the selectData argument demonstrate architecturally?
    code: |-
      function withSubscription(Component, selectData) {
        return function(props) {
          const store = useContext(StoreContext);
          const data = selectData(store);
          return <Component {...props} data={data} />;
        };
      }
      const ConnectedList = withSubscription(List, store => store.items);
    topics:
      - react
      - solid-principles
    options:
      - text: SRP -- separates selection logic from rendering
        correct: false
      - text: DIP -- withSubscription depends on a selector abstraction not on store shape directly, making it reusable across any store and any slice
        correct: true
      - text: OCP -- the HOC cannot be modified
        correct: false
      - text: LSP -- List can be replaced by any component
        correct: false
    explanation: "DIP: withSubscription does not know store.items exists -- it delegates that knowledge to the caller via selectData. This is exactly how react-redux's connect(mapStateToProps) works. The HOC is reusable across any store shape. selectData functions are pure and independently testable. Three layers of dependency inversion in one pattern."
    difficulty: senior
  - q: "Teams want: keyboard nav, URL sync, animated transitions. What is the correct architectural direction?"
    code: |-
      function Tabs({ items }) {
        const [active, setActive] = useState(0);
        return (
          <div>
            {items.map((item, i) => (
              <button key={i} onClick={() => setActive(i)}>
                {item.label}
              </button>
            ))}
            <div>{items[active].content}</div>
          </div>
        );
      }
    topics:
      - react
      - solid-principles
    options:
      - text: Add isKeyboard, syncUrl, and animate props to Tabs
        correct: false
      - text: Expose a useTabs() headless hook or compound component pattern -- Tabs provides state, callers compose the behavior they need
        correct: true
      - text: Create TabsWithKeyboard, TabsWithUrl, TabsWithAnimation variants
        correct: false
      - text: Use an existing tabs library that covers all cases
        correct: false
    explanation: "OCP + ISP: adding three props pushes toward the 14-prop antipattern. Compound components (TabList, Tab, TabPanel sharing context) let callers compose exactly what they need. Or useTabs() exposes {activeIndex, onSelect, getTabProps} and callers render whatever DOM they want. Radix UI Tabs, Headless UI Tabs, and React Aria all use this model -- zero built-in styling, full behavior, infinite composability."
    difficulty: principal
---

# React Questions

Practice questions covering hooks, rendering behavior, context, memoization, effects, HOC/compound/render-props patterns, and SOLID principles applied to React components.
