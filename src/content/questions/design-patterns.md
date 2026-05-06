---
category: "Design Patterns"
questions:
  - q: |
      function withLogger(Component) {
        return function Logged(props) {
          console.log("render", Component.displayName);
          return <Component {...props} />;
        };
      }
      const LoggedButton = withLogger(Button);
      // <LoggedButton color="red" size="lg" /> -- what does Button receive?
    options:
      - text: "No props -- HOC must pass props explicitly by name"
        correct: false
      - text: "{ color: 'red', size: 'lg' } -- all props forwarded via spread"
        correct: true
      - text: "{ color: 'red' } -- size is swallowed by the HOC"
        correct: false
      - text: "Error -- HOC wrapping requires forwardRef"
        correct: false
    explanation: "{...props} spreads all received props onto the wrapped component. LoggedButton receives {color:'red', size:'lg'} and passes them through to Button unchanged. The HOC adds the logging side effect transparently. Standard HOC prop forwarding contract -- the wrapper must never swallow props."
    difficulty: "junior"
    isCode: true

  - q: |
      function withAuth(Component) {
        return function Protected({ isLoggedIn, ...rest }) {
          if (!isLoggedIn) return <Redirect to="/login" />;
          return <Component {...rest} />;
        };
      }
      const ProtectedDash = withAuth(Dashboard);
      // <ProtectedDash isLoggedIn={true} user={me} /> -- what does Dashboard receive?
    options:
      - text: "{ isLoggedIn: true, user: me }"
        correct: false
      - text: "{ user: me } -- isLoggedIn is consumed by the HOC and not forwarded"
        correct: true
      - text: "<Redirect to='/login' />"
        correct: false
      - text: "Error -- rest props cannot be spread onto a component"
        correct: false
    explanation: "isLoggedIn is destructured out of props. ...rest captures everything else ({user:me}). Since isLoggedIn=true the guard passes and renders <Component {...rest}> = <Dashboard user={me} />. isLoggedIn does NOT reach Dashboard -- it was consumed by the HOC. Implementation details of the wrapper should not leak into the wrapped component."
    difficulty: "mid"
    isCode: true

  - q: |
      function withDefaults(Component, defaults) {
        return function WithDefaults(props) {
          return <Component {...defaults} {...props} />;
        };
      }
      const PrimaryButton = withDefaults(Button, { color: "blue", size: "md" });
      // <PrimaryButton color="red" /> -- what props does Button receive?
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
    difficulty: "senior"
    isCode: true

  - q: |
      const A = withLogger(withAuth(withTheme(Dashboard)));
      // In what order do HOCs wrap Dashboard?
    options:
      - text: "withLogger -> withAuth -> withTheme -> Dashboard (left to right)"
        correct: false
      - text: "withTheme wraps Dashboard first, then withAuth, then withLogger outermost"
        correct: true
      - text: "All three wrap simultaneously"
        correct: false
      - text: "Order does not matter for HOCs"
        correct: false
    explanation: "HOC composition reads inside-out. withTheme(Dashboard) runs first. withAuth(ThemeDash) runs next. withLogger(AuthDash) runs last and is outermost. Render call order: Logger -> Auth -> Theme -> Dashboard. This matters when HOCs depend on each other -- withAuth must run before withLogger if Logger needs auth state."
    difficulty: "principal"
    isCode: true

  - q: |
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
      // What happens on mount?
    options:
      - text: "Error -- forwardRef cannot be used with functional components"
        correct: false
      - text: "The input gets focus and has class 'enhanced' and placeholder 'type here'"
        correct: true
      - text: "inputRef.current is null because ref is not forwarded correctly"
        correct: false
      - text: "focus() fails because useEffect runs before mount"
        correct: false
    explanation: "forwardRef passes the ref through to the underlying input. useEffect runs after the DOM is painted so inputRef.current is the actual input element and focus() works. {...props} spreads placeholder onto input. className='enhanced' is always applied. Required whenever a parent needs direct DOM access to a wrapped component."
    difficulty: "junior"
    isCode: true

  - q: |
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
      // What design pattern is this and what problem does it solve?
    options:
      - text: "HOC pattern -- enhances a single component with extra functionality"
        correct: false
      - text: "Compound Component pattern -- shares implicit state via context so callers compose flexible layouts without prop drilling"
        correct: true
      - text: "Observer pattern -- Tabs observes child state changes"
        correct: false
      - text: "Factory pattern -- Tabs creates child components dynamically"
        correct: false
    explanation: "Compound Components share implicit state through context. Callers compose Tab.List, Tab.Tab, and Tab.Panel in any layout they want -- no prop drilling needed. Used by Radix UI, Reach UI, Headless UI. The parent (Tabs) owns state, children access it via context. Enables maximum layout flexibility while keeping the component API clean."
    difficulty: "mid"
    isCode: true

  - q: |
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
      // Chart throws during render. What does SafeChart show?
    options:
      - text: "The error propagates to the nearest parent boundary"
        correct: false
      - text: '<p>Error: {the error message}</p>'
        correct: true
      - text: "Nothing -- the component tree crashes silently"
        correct: false
      - text: "Chart retries rendering automatically"
        correct: false
    explanation: "getDerivedStateFromError catches the throw during Chart's render phase and sets error in the HOC's class state. The next render hits the guard and returns the fallback. Error boundaries MUST be class components -- getDerivedStateFromError cannot be implemented in a function component. The boundary only catches errors in its children, not itself."
    difficulty: "senior"
    isCode: true

  - q: |
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
      // What problem does render props solve vs a regular component?
    options:
      - text: "It runs faster because it avoids reconciliation"
        correct: false
      - text: "It inverts control -- the caller decides what to render with the shared state, making the logic reusable without coupling it to a specific UI"
        correct: true
      - text: "It prevents re-renders when mouse moves"
        correct: false
      - text: "It replaces the need for context"
        correct: false
    explanation: "Render props invert control: MouseTracker owns the behavior (tracking position) and the caller decides what to render with it. The same tracker can power a tooltip, a canvas cursor, a debug overlay -- without changing MouseTracker. Today custom hooks often replace render props for logic sharing, but the pattern still appears in react-table, Formik, and Downshift."
    difficulty: "principal"
    isCode: true
---

# Design Patterns in React

HOC composition, compound components, render props, forwardRef, and error boundaries.
