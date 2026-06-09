# Advanced Questions — Part 2: TypeScript & React
## Questions 36–70

---

## 🔷 SECTION E — TypeScript Deep Dive

---

### Q36 — type vs interface: the real differences
**What are the actual differences between `type` and `interface` in TypeScript? When do you choose each?**

<details>
<summary>✅ Answer</summary>

```typescript
// interface — for object shapes, extendable, mergeable
interface User {
  id: number;
  name: string;
}
interface User { email: string; } // Declaration merging — adds email!

// type — for everything else
type ID = string | number;         // union
type Callback = (val: string) => void; // function
type Tuple = [string, number];     // tuple
type ReadonlyUser = Readonly<User>; // utility types

// Both can extend:
interface Admin extends User { role: string; }
type Admin = User & { role: string }; // intersection
```

**Key differences:**

| Feature | interface | type |
|---|---|---|
| Declaration merging | ✅ Yes | ❌ No |
| Union types | ❌ No | ✅ Yes |
| Computed properties | ❌ Limited | ✅ Yes |
| Error messages | Cleaner | Can be verbose |

**Rule of thumb:** `interface` for public API shapes and class contracts. `type` for unions, intersections, utility types, and function signatures.
</details>

---

### Q37 — Discriminated unions
```typescript
type Shape =
  | { kind: 'circle';    radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle';  base: number;  height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return 0.5 * shape.base * shape.height;
    // What happens if we add a new shape and forget this switch?
  }
}
```
**How do you make TypeScript error if a new shape variant is added but not handled?**

<details>
<summary>✅ Answer</summary>

Add an exhaustiveness check using the `never` type:

```typescript
function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
    default:
      // If all cases are handled, shape is `never` here
      // If a new variant is added without a case, this line errors at compile time
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}
```

The `never` assignment forces TypeScript to verify the switch is exhaustive. Add `'pentagon'` to the union without handling it and TypeScript errors: `Type 'pentagon' is not assignable to type 'never'`.
</details>

---

### Q38 — Generics with constraints
```typescript
// Make this function type-safe — it should work on any object
// and return only the value at the given key

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alice', active: true };
const name = getProperty(user, 'name');   // type?
const id   = getProperty(user, 'id');     // type?
const bad  = getProperty(user, 'email');  // what happens?
```
**What are the inferred types? What does the last line do?**

<details>
<summary>✅ Answer</summary>

```typescript
name // inferred as: string
id   // inferred as: number
bad  // TypeScript ERROR: Argument of type '"email"' is not assignable
     // to parameter of type 'keyof { id: number; name: string; active: boolean }'
```

`K extends keyof T` constrains `K` to only be keys that exist on `T`. The return type `T[K]` is an **indexed access type** — it looks up the value type at that key. TypeScript infers the exact type at the call site, not just `any` or `unknown`.
</details>

---

### Q39 — Utility types in practice
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Q: Create these types WITHOUT rewriting User fields:
// 1. A type for creating a user (no id, no createdAt)
// 2. A type for updating a user (all fields optional except id)
// 3. A type for public display (no password, no email)
// 4. A type where all fields are readonly
```

<details>
<summary>✅ Answer</summary>

```typescript
// 1. Omit id and createdAt
type CreateUserDTO = Omit<User, 'id' | 'createdAt'>;
// { name: string; email: string; password: string }

// 2. id required, rest optional
type UpdateUserDTO = Pick<User, 'id'> & Partial<Omit<User, 'id'>>;
// { id: number; name?: string; email?: string; ... }

// 3. Public profile
type PublicUser = Omit<User, 'password' | 'email'>;
// { id: number; name: string; createdAt: Date }

// 4. Readonly
type ReadonlyUser = Readonly<User>;
// All fields become readonly

// Bonus — Record for a lookup map:
type UserMap = Record<number, PublicUser>;
// { [key: number]: PublicUser }
```
</details>

---

### Q40 — Conditional types
```typescript
type IsArray<T> = T extends any[] ? true : false;
type IsString<T> = T extends string ? true : false;

type A = IsArray<number[]>;  // ?
type B = IsArray<string>;    // ?
type C = IsString<'hello'>;  // ?
type D = IsString<string>;   // ?

// More advanced:
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type E = Unwrap<Promise<string>>;  // ?
type F = Unwrap<number>;           // ?
```
**What are A, B, C, D, E, F?**

<details>
<summary>✅ Answer</summary>

```typescript
A = true    // number[] extends any[] ✓
B = false   // string does not extend any[]
C = true    // 'hello' extends string (literal extends base)
D = true    // string extends string
E = string  // infer U captures the Promise's resolved type
F = number  // number doesn't extend Promise<any>, returns T as-is
```

`infer` is one of TypeScript's most powerful features — it extracts types from within generic structures. Used in utility types like `ReturnType<T>`, `Parameters<T>`, `Awaited<T>`.
</details>

---

### Q41 — Mapped types
```typescript
// Implement these mapped types from scratch:
type MyPartial<T>  = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Nullable — make all values nullable
type Nullable<T> = { [K in keyof T]: T[K] | null };

// DeepPartial — recursive partial
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```
**What does `-?` mean in `MyRequired`?**

<details>
<summary>✅ Answer</summary>

In mapped types:
- `?` adds optionality
- `-?` **removes** optionality (makes required)
- `readonly` adds readonly
- `-readonly` removes readonly

So `{ [K in keyof T]-?: T[K] }` maps over all keys and removes the optional modifier from each, making all fields required.

`DeepPartial` is recursive — if a property is an object, it recursively applies `DeepPartial` to it. This is used in libraries like `react-hook-form` for partial form schemas.
</details>

---

### Q42 — Function overloads
```typescript
// Implement a function that:
// - takes a string → returns string (uppercased)
// - takes a number → returns number (doubled)
// - TypeScript should enforce the return type matches input type
```

<details>
<summary>✅ Answer</summary>

```typescript
function process(input: string): string;
function process(input: number): number;
function process(input: string | number): string | number {
  if (typeof input === 'string') return input.toUpperCase();
  return input * 2;
}

const a = process('hello'); // type: string
const b = process(21);      // type: number
// process(true);           // Error — no overload for boolean
```

**Important:** The implementation signature (third one) is not part of the public API — TypeScript uses only the overload signatures for type checking. The implementation must be compatible with all overloads but can use a union type internally.
</details>

---

### Q43 — `unknown` vs `any` vs `never`
```typescript
function riskyA(input: any) {
  return input.toUpperCase(); // compiles fine
}

function riskyB(input: unknown) {
  return input.toUpperCase(); // ?
}

function riskyC(input: unknown): string {
  if (typeof input === 'string') return input.toUpperCase(); // ?
  return String(input);
}

type ImpossibleUnion = string & number; // ?
```
**What compiles and what errors? What is `ImpossibleUnion`?**

<details>
<summary>✅ Answer</summary>

```typescript
riskyA: compiles but UNSAFE — any disables type checking entirely
riskyB: ERROR — Object is of type 'unknown' — must narrow before using
riskyC: SAFE — typeof narrows unknown to string inside the if block
ImpossibleUnion = never — a value can't be both string AND number
```

**The hierarchy:**
- `any` — opt out of type checking entirely. Unsafe.
- `unknown` — type-safe any. Must narrow before use.
- `never` — impossible type. Bottom of the type hierarchy. Used for exhaustive checks and unreachable code.

**Rule:** Replace `any` with `unknown` in function parameters. Forces callers to narrow properly.
</details>

---

### Q44 — Template literal types
```typescript
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Margin = `margin-${Direction}`;

// What are the possible values of Margin?

type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>;   // ?
type ChangeEvent = EventName<'change'>; // ?
```

<details>
<summary>✅ Answer</summary>

```typescript
// Margin =
'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left'

// ClickEvent  = 'onClick'
// ChangeEvent = 'onChange'
```

Template literal types combine string literals at the type level. `Capitalize` is a built-in TypeScript intrinsic type. Used to build typed event handlers, CSS property names, Redux action types, etc.

```typescript
// Real-world: typed CSS property name generator
type CSSProperty = `${string}-${string}`;
```
</details>

---

### Q45 — `ReturnType` and `Parameters`
```typescript
async function fetchUser(id: number, include: string[]): Promise<User> {
  // ...
}

type FetchUserReturn = Awaited<ReturnType<typeof fetchUser>>;
type FetchUserParams = Parameters<typeof fetchUser>;
type FirstParam      = FetchUserParams[0];
```
**What are the three types?**

<details>
<summary>✅ Answer</summary>

```typescript
FetchUserReturn = User          // Awaited unwraps the Promise<User>
FetchUserParams = [number, string[]]  // tuple of parameter types
FirstParam      = number        // indexed access into the tuple
```

`typeof funcName` gets the function's type. `ReturnType<T>` extracts what it returns. `Awaited<T>` unwraps one or more levels of Promise. These are essential for typing wrappers, HOFs, and utility functions without repeating type definitions.
</details>

---

## 🔷 SECTION F — React Advanced Patterns

---

### Q46 — Render batching trap
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const [doubled, setDoubled] = useState(0);

  function increment() {
    setCount(c => c + 1);
    setDoubled(d => d + 2);
    // How many renders happen in React 18?
  }

  console.log('render');
  return <button onClick={increment}>{count} / {doubled}</button>;
}
```
**How many renders per click in React 17 vs React 18?**

<details>
<summary>✅ Answer</summary>

```
React 17: 1 render (batched — inside React event handler)
React 18: 1 render (automatic batching — works everywhere)
```

React 18's automatic batching extends batching to async callbacks, setTimeout, and native event listeners — not just React synthetic events. The result: fewer renders, better performance, no code changes needed.

**Escape hatch when you need immediate flush:**
```javascript
import { flushSync } from 'react-dom';
flushSync(() => setCount(c => c + 1)); // renders NOW
flushSync(() => setDoubled(d => d + 2)); // renders NOW
// Total: 2 renders
```
</details>

---

### Q47 — React.memo with unstable props
```javascript
const Child = React.memo(({ style, onClick, items }) => {
  console.log('Child render');
  return <div style={style}>{items.length} items</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child
        style={{ color: 'red' }}
        onClick={() => console.log('clicked')}
        items={[1, 2, 3]}
      />
    </div>
  );
}
```
**Does Child re-render when the button is clicked? Why?**

<details>
<summary>✅ Answer</summary>

**Yes, Child re-renders on every button click.** React.memo performs a shallow prop comparison. Every render of Parent creates:
- New `style` object reference: `{ color: 'red' }` ← new object
- New `onClick` function reference: `() => console.log(...)` ← new function
- New `items` array reference: `[1, 2, 3]` ← new array

All three fail `Object.is` comparison → React.memo bails out of nothing.

**Fix:**
```javascript
const STYLE = { color: 'red' };        // module-level constant
const ITEMS = [1, 2, 3];               // module-level constant

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log('clicked'), []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child style={STYLE} onClick={handleClick} items={ITEMS} />
    </div>
  );
}
```
</details>

---

### Q48 — useRef vs useState for storing values
```javascript
// When should you use useRef instead of useState to store a value?

function Component() {
  const renderCount = useRef(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>Renders: {renderCount.current}</p>
      <button onClick={() => setClicks(c => c + 1)}>
        Clicks: {clicks}
      </button>
    </div>
  );
}
```
**What's wrong with this component? Will `renderCount` display correctly?**

<details>
<summary>✅ Answer</summary>

`renderCount` will always display the value from the **previous render**, not the current one.

`useRef` mutations do NOT trigger re-renders. The effect increments `renderCount.current` but nothing tells React to re-render. The `<p>` shows the stale value from last render.

**Use `useRef` when:** You need a mutable value that persists across renders but does NOT need to trigger UI updates (interval IDs, DOM references, previous value comparison, latest-value tracking for stale closure prevention).

**Use `useState` when:** The value should be reflected in the UI.

If you need to display a live render count — use a ref to count but trigger a re-render via another mechanism, or use a dedicated library like React DevTools.
</details>

---

### Q49 — Custom hook: `usePrevious`
**Implement a `usePrevious(value)` hook that returns the previous render's value.**

<details>
<summary>✅ Answer</summary>

```javascript
function usePrevious(value) {
  const ref = useRef(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]); // runs AFTER render, so ref still has old value during render

  return ref.current;
}

// Usage
function PriceDisplay({ price }) {
  const prevPrice = usePrevious(price);

  return (
    <div>
      <p>Current: ${price}</p>
      <p>Previous: ${prevPrice}</p>
      <p>{price > prevPrice ? '▲ Up' : '▼ Down'}</p>
    </div>
  );
}
```

**Why it works:** The `useEffect` runs AFTER the component renders. During the render, `ref.current` still holds the value from the PREVIOUS render. The effect then updates `ref.current` to the new value — ready for the next render.
</details>

---

### Q50 — Custom hook: `useLocalStorage`
**Implement `useLocalStorage(key, initialValue)` that syncs state with localStorage.**

<details>
<summary>✅ Answer</summary>

```javascript
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    // Lazy init — runs once on mount
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const val = value instanceof Function ? value(stored) : value;
      setStored(val);
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.error(err);
    }
  }, [key, stored]);

  return [stored, setValue];
}

// Usage — same API as useState
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

**Key details:**
- Lazy initialiser (`() => ...`) prevents reading localStorage on every render
- `try/catch` handles SSR (no localStorage) and JSON parse errors
- Functional updater support (`value instanceof Function`)
</details>

---

### Q51 — Error Boundary implementation
**Implement an ErrorBoundary class component with retry functionality.**

<details>
<summary>✅ Answer</summary>

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to error monitoring service
    console.error('ErrorBoundary caught:', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback
        ? this.props.fallback(this.state.error, this.handleRetry)
        : (
          <div>
            <p>Something went wrong.</p>
            <button onClick={this.handleRetry}>Try again</button>
          </div>
        );
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary
  fallback={(error, retry) => (
    <div>
      <p>{error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  )}
  onError={(err) => logToSentry(err)}
>
  <App />
</ErrorBoundary>
```
</details>

---

### Q52 — React reconciliation and keys
```javascript
// Version A
function ListA({ items }) {
  return items.map((item, index) => (
    <Input key={index} defaultValue={item.name} />
  ));
}

// Version B
function ListB({ items }) {
  return items.map(item => (
    <Input key={item.id} defaultValue={item.name} />
  ));
}
```
**You reorder items. What happens in A vs B? Why is B correct?**

<details>
<summary>✅ Answer</summary>

**Version A (index as key):** When items reorder, indices change. React sees key `0` still exists and reuses that component instance — but the component now corresponds to a different item. If `Input` has internal state (cursor position, value), that state stays attached to the wrong item. Users see scrambled or retained incorrect input values.

**Version B (stable ID as key):** React matches each component by its `id`. When items reorder, React moves the existing component instances — preserving their internal state. New items create new instances. Deleted items destroy their instances.

**Rule:** Keys must be:
1. **Unique** among siblings
2. **Stable** — same item = same key across renders
3. **Not the array index** unless the list never reorders or filters
</details>

---

### Q53 — React Fiber and concurrent rendering
**Explain what React Fiber is and what problem it solved. What does "concurrent rendering" actually mean?**

<details>
<summary>✅ Answer</summary>

**Before Fiber (React ≤ 15):** Rendering was synchronous and recursive — once started, it couldn't be interrupted. A large tree update would block the main thread until complete, causing dropped frames and unresponsive UI.

**Fiber (React 16+):** Fiber reimplemented React's reconciliation algorithm as an iterative linked-list structure instead of a recursive call stack. This allows React to:
1. **Pause** rendering work mid-tree
2. **Prioritise** urgent updates (user input) over background updates (data loading)
3. **Resume** or **discard** interrupted work
4. **Reuse** completed work

**Concurrent rendering (React 18):** The Fiber architecture enables React to maintain multiple in-progress renders simultaneously. `useTransition` and `useDeferredValue` expose this — they let React interrupt a low-priority render to handle a high-priority update, then resume.

```javascript
// Without concurrent: typing feels laggy because filtering is slow
setQuery(value);
setItems(expensiveFilter(allItems, value));

// With concurrent: typing is instant, filter updates asynchronously
setQuery(value);
startTransition(() => setItems(expensiveFilter(allItems, value)));
```
</details>

---

### Q54 — `useTransition` vs `useDeferredValue`
**What is the difference between `useTransition` and `useDeferredValue`? When do you use each?**

<details>
<summary>✅ Answer</summary>

Both mark work as low-priority (interruptible), but they attach to different things:

**`useTransition`** — wraps the state update itself:
```javascript
const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  setQuery(query);          // urgent — updates input immediately
  startTransition(() => {
    setResults(filter(query)); // deferred — can be interrupted
  });
}
// Use when you OWN the state update
// isPending: true while transition is in progress → show spinner
```

**`useDeferredValue`** — wraps the value:
```javascript
const deferredQuery = useDeferredValue(query);
// React may render with old deferredQuery while computing new one

// Use when you DON'T own the state update
// (e.g. prop from parent, third-party component)
const results = useMemo(
  () => expensiveFilter(deferredQuery),
  [deferredQuery]
);
```

**When to use each:**
- Own the state update → `useTransition`
- Receiving a value you don't control → `useDeferredValue`
- Both require `React.memo` on expensive child components to be effective
</details>

---

### Q55 — Custom hook: `useDebounce`
**Implement `useDebounce(value, delay)` for a search input.**

<details>
<summary>✅ Answer</summary>

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup cancels pending timeout
  }, [value, delay]);

  return debouncedValue;
}

// Usage — only fires API call after 300ms of inactivity
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetch(`/api/search?q=${debouncedQuery}`);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**Why the cleanup:** Each keystroke creates a new `setTimeout`. The cleanup from the previous render's effect clears the pending timeout before scheduling a new one. Only the last one fires.
</details>

---

### Q56 — Context + Reducer pattern (full implementation)
**Implement a shopping cart using useContext + useReducer with TypeScript.**

<details>
<summary>✅ Answer</summary>

```typescript
type CartItem = { id: number; name: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: 'ADD';    item: CartItem }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.item.id);
      const items = exists
        ? state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.item, qty: 1 }];
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.id !== action.id);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'CLEAR':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
```
</details>

---

### Q57 — Portal and event bubbling
```javascript
// Modal rendered in a portal (outside app root div)
function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```
**Will click events inside the modal bubble up through the React component tree? Does `stopPropagation` affect the DOM tree or the React tree?**

<details>
<summary>✅ Answer</summary>

**Portal events bubble through the React component tree, NOT the DOM tree.**

Even though the modal DOM nodes are children of `<body>`, React events bubble through the React tree — so a click inside the portal WILL propagate to the React component that rendered the portal (the parent component).

This is intentional — it makes portals behave consistently within React's component model while allowing DOM flexibility.

`e.stopPropagation()` on the inner div stops React's synthetic event from bubbling further up the **React component tree**. It does NOT stop native DOM event propagation on `document.body`'s children (though React delegates events to the root, so practically both are stopped).

**Practical implication:** If a parent component has an `onClick` handler, clicking inside the portal will trigger it unless you `stopPropagation`.
</details>

---

### Q58 — `useImperativeHandle` use case
**When and how do you use `useImperativeHandle`? Implement a custom Input that exposes `focus()` and `clear()` to its parent.**

<details>
<summary>✅ Answer</summary>

```javascript
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = '';
    },
    // Parent can ONLY call focus() and clear()
    // The raw DOM input ref is NOT exposed
  }));

  return <input ref={inputRef} {...props} />;
});

// Parent usage
function Form() {
  const inputRef = useRef(null);

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Type here..." />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </div>
  );
}
```

**When to use:** When you need to expose imperative methods to parent components but want to control the API surface (don't expose the raw DOM element). Common for: animation triggers, scroll controls, form field controls in component libraries.
</details>

---

### Q59 — Virtualization concept and implementation
**Why does rendering 10,000 list items crash the browser? Explain the virtualization solution and how `react-window` implements it.**

<details>
<summary>✅ Answer</summary>

**The problem:** Rendering 10,000 DOM nodes simultaneously means:
- 10,000 DOM nodes in memory
- Layout calculations for all 10,000
- Paint operations for all 10,000
- React reconciliation over the entire list on any state change

A browser viewport shows ~20-50 items. The rest are invisible but still mounted.

**Virtualization:** Only render the items currently visible in the viewport, plus a small buffer. As the user scrolls, unmount items that leave the viewport and mount items that enter it.

```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    // `style` MUST be applied — it sets position: absolute + top/height
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={400}        // viewport height
      itemCount={items.length}
      itemSize={50}       // each row height
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**How it works:** A large outer div sets total height (itemCount × itemSize) to maintain correct scroll position. Inner items are positioned absolutely at `top = index × itemSize`. Only items within the viewport range render.

**Result:** 10,000 items → only ~10-20 DOM nodes at any time.
</details>

---

### Q60 — React performance profiling
**What are the five tools/techniques you use to identify and fix React performance issues?**

<details>
<summary>✅ Answer</summary>

1. **React DevTools Profiler** — Records component render times. Identifies which components render, how long they take, and why (props/state/context/hooks). Use "Highlight updates" to visually see which components re-render on interaction.

2. **Why Did You Render library** — Adds console warnings when components re-render with identical props/state. Catches unnecessary re-renders that React.memo or useMemo should prevent.

3. **Chrome Performance tab** — Long tasks (>50ms), JS call stacks, layout thrashing. Use `performance.mark()` / `performance.measure()` to instrument specific operations.

4. **React.memo + useCallback + useMemo** — Applied strategically based on profiler data. Never pre-emptively — always measure first.

5. **Code splitting** — `React.lazy` + `Suspense` for route-level and component-level code splitting. Reduces initial bundle size and parse/evaluate time. Verify with webpack-bundle-analyzer or `vite-plugin-visualizer`.

**Process:** Profile first → identify specific bottleneck → apply targeted fix → profile again. Never optimise blindly.
</details>

---

*Continue in Part 3 → DSA Questions (Q61–100)*
