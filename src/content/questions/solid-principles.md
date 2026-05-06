---
category: "SOLID Principles"
questions:
  - q: |
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
      // Three different product teams each own one of these concerns.
      // What is the architectural problem?
    options:
      - text: "Too many useEffect calls -- maximum is 2"
        correct: false
      - text: "It owns three unrelated concerns making it a change magnet -- any team touching any concern must edit this file"
        correct: true
      - text: "useState cannot be called three times in one component"
        correct: false
      - text: "No problem -- this is standard React"
        correct: false
    explanation: "SRP violation that only shows at scale. User auth, post feed, and theme are three independent domains. Any of the three product teams touching this file creates merge conflicts and regression risk. Fix: extract useUser(), usePosts(), useTheme() hooks. Dashboard becomes a thin compositor. Test: how many teams edit this file? More than one = SRP violation."
    difficulty: "junior"
    isCode: true

  - q: |
      function Notification({ type, message }) {
        let icon, color;
        if (type === "success") { icon = "check"; color = "green"; }
        else if (type === "error") { icon = "x"; color = "red"; }
        else if (type === "warning") { icon = "alert"; color = "yellow"; }
        return <div style={{color}}><Icon name={icon}/>{message}</div>;
      }
      // A "info" type is needed. A "critical" type might come later.
      // What is the architectural risk?
    options:
      - text: "No risk -- adding an else if is trivial"
        correct: false
      - text: "Every new type requires modifying the conditional chain, risking regressions on existing types and blocking parallel feature work"
        correct: true
      - text: "The component should be split into Success, Error, Warning sub-components"
        correct: false
      - text: "color should come from CSS classes not inline style"
        correct: false
    explanation: "OCP: open for extension, closed for modification. Every new type touches the same chain. Fix: const CONFIG = { success: {icon:'check',color:'green'}, ... }. Adding 'info' means one new key -- zero conditional changes. Scales to 20 types with no branching growth and no risk of touching existing paths."
    difficulty: "mid"
    isCode: true

  - q: |
      // Option A: One hook does everything
      function useForm(config) {
        // validation + submission + dirty tracking + field state
      }

      // Option B: Focused hooks
      const useFormField = (name) => { /* value, onChange, error for one field */ };
      const useFormSubmit = (onSubmit) => { /* submission only */ };
      const useFormDirty = () => { /* dirty tracking only */ };

      // A component only needs field validation, nothing else.
      // Which approach is better and why?
    options:
      - text: "Option A -- one hook is simpler to import"
        correct: false
      - text: "Option B -- the component only depends on the interface it needs, not a fat hook forcing unused submission and dirty tracking"
        correct: true
      - text: "They are identical -- hooks do not have the coupling problem of classes"
        correct: false
      - text: "Option A is better for testing"
        correct: false
    explanation: "ISP: do not force clients to depend on interfaces they do not use. A single useForm() couples components needing field validation to submission logic. Splitting into focused hooks means a field component only imports what it needs. React Query, React Hook Form, and Zustand all follow this -- expose granular hooks so you only subscribe to the slice you consume."
    difficulty: "senior"
    isCode: true

  - q: |
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
      // This Modal is reused in 20 places across the app.
      // Some contexts should not track the event. What is the problem?
    options:
      - text: "No problem -- analytics tracking is always appropriate"
        correct: false
      - text: "Modal is coupled to analytics -- reusing it in no-tracking contexts fires the event anyway, and changing the tracking call touches all 20 usages"
        correct: true
      - text: "analytics.track should be in useEffect instead"
        correct: false
      - text: "The button needs an aria-label"
        correct: false
    explanation: "SRP: Modal should not know about analytics. It also violates DIP -- it depends on the concrete analytics service rather than the onClose abstraction. Fix: the caller passes onClose that tracks if needed. Modal stays pure. Reuse in no-tracking contexts costs nothing. Each callsite controls its own side effects."
    difficulty: "principal"
    isCode: true

  - q: |
      function DataTable({ fetchData }) {
        const [rows, setRows] = useState([]);
        useEffect(() => {
          fetchData().then(setRows);
        }, [fetchData]);
        return <table>...</table>;
      }

      // Usage A: <DataTable fetchData={() => fetch('/api').then(r => r.json())} />
      // Usage B: <DataTable fetchData={() => Promise.resolve(mockRows)} />
      // Usage C: <DataTable fetchData={graphqlClient.getRows} />
      // Which principle does this design demonstrate?
    options:
      - text: "SRP -- DataTable has one job"
        correct: false
      - text: "DIP -- DataTable depends on the fetchData abstraction not a concrete fetch call, making all three usages possible without modifying the component"
        correct: true
      - text: "OCP -- DataTable cannot be modified"
        correct: false
      - text: "ISP -- the props interface is minimal"
        correct: false
    explanation: "DIP: high-level component depends on an abstraction (fetchData: () => Promise<Row[]>), not on fetch() directly. REST, GraphQL, or mock all satisfy the contract. Also LSP: any function returning Promise<Row[]> substitutes fetchData. This is what makes DataTable testable -- pass () => Promise.resolve(mockData) in tests. Foundation of headless component design."
    difficulty: "junior"
    isCode: true

  - q: |
      function Button({
        onClick, label, style, className,
        isLoading, loadingText, disabled, disabledReason,
        icon, iconPosition, tooltip, tooltipDelay,
        analyticsEvent, analyticsPayload
      }) { /* ... */ }
      // What is the architectural consequence of this interface?
    options:
      - text: "No consequence -- more props means more flexibility"
        correct: false
      - text: "Every consumer must understand 14 props even using 2, any prop change breaks all consumers, and unrelated concerns are coupled into one component"
        correct: true
      - text: "TypeScript will reject this prop signature"
        correct: false
      - text: "The only fix is to use a class component"
        correct: false
    explanation: "ISP: a 40-prop (or 14-prop) component forces every consumer to understand the full interface even if they use 2 props. Tooltip should compose Tooltip around Button. Analytics belongs in onClick at the callsite. Loading state can be LoadingButton. Each concern extracted means the Button interface stays stable. This is how Radix UI, Headless UI, and React Aria are built: minimal props per primitive."
    difficulty: "mid"
    isCode: true

  - q: |
      function withSubscription(Component, selectData) {
        return function(props) {
          const store = useContext(StoreContext);
          const data = selectData(store);
          return <Component {...props} data={data} />;
        };
      }
      const ConnectedList = withSubscription(List, store => store.items);
      // What does the selectData argument demonstrate architecturally?
    options:
      - text: "SRP -- separates selection logic from rendering"
        correct: false
      - text: "DIP -- withSubscription depends on a selector abstraction not on store shape directly, making it reusable across any store and any slice"
        correct: true
      - text: "OCP -- the HOC cannot be modified"
        correct: false
      - text: "LSP -- List can be replaced by any component"
        correct: false
    explanation: "DIP: withSubscription does not know store.items exists -- it delegates that knowledge to the caller via selectData. This is exactly how react-redux's connect(mapStateToProps) works. The HOC is reusable across any store shape. selectData functions are pure and independently testable. Three layers of dependency inversion in one pattern."
    difficulty: "senior"
    isCode: true

  - q: |
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
      // Teams want: keyboard nav, URL sync, animated transitions.
      // What is the correct architectural direction?
    options:
      - text: "Add isKeyboard, syncUrl, and animate props to Tabs"
        correct: false
      - text: "Expose a useTabs() headless hook or compound component pattern -- Tabs provides state, callers compose the behavior they need"
        correct: true
      - text: "Create TabsWithKeyboard, TabsWithUrl, TabsWithAnimation variants"
        correct: false
      - text: "Use an existing tabs library that covers all cases"
        correct: false
    explanation: "OCP + ISP: adding three props pushes toward the 14-prop antipattern. Compound components (TabList, Tab, TabPanel sharing context) let callers compose exactly what they need. Or useTabs() exposes {activeIndex, onSelect, getTabProps} and callers render whatever DOM they want. Radix UI Tabs, Headless UI Tabs, and React Aria all use this model -- zero built-in styling, full behavior, infinite composability."
    difficulty: "principal"
    isCode: true
---

# SOLID Principles in React

Questions on applying SOLID principles to real React component architecture decisions.
