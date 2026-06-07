# useContext — Performance Gotchas & Re-render Scope

> **Senior-level notes** for interview preparation. Focus on what React actually does under the hood, not just the API surface.

---

## 1. What useContext Actually Does

`useContext(MyContext)` subscribes the calling component to the **nearest** `MyContext.Provider` above it in the tree. When the Provider's `value` prop changes, every subscribed component re-renders — no exceptions, no built-in filtering.

```js
const value = useContext(ThemeContext); // subscribes this component
```

React uses **referential equality (`Object.is`)** to decide if the context value changed. If the value is an object or function, a new reference = a re-render, even if contents are identical.

---

## 2. The Three Deps Array Modes — Context vs State

| Mechanism     | Granularity       | Selector support? | Re-render on any change? |
|---------------|-------------------|-------------------|--------------------------|
| `useState`    | per-state-value   | N/A               | Only that component      |
| `useContext`  | entire context    | ❌ No             | ALL consumers            |
| Redux `useSelector` | per-slice  | ✅ Yes            | Only if slice changed    |

**Key insight:** `useContext` is all-or-nothing. There is no built-in way to say "only re-render if `user.name` changed." Every consumer re-renders when anything in the context value changes.

---

## 3. The Unstable Value Object Trap

### ❌ Wrong — creates new object every render
```jsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
```

Every render of `AppProvider` creates a **new object literal** `{ user, setUser, theme, setTheme }`. Every consumer re-renders on every parent re-render — even if `user` and `theme` haven't changed.

### ✅ Fixed — stabilise with useMemo
```jsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => ({ user, setUser, theme, setTheme }),
    [user, theme] // setUser/setTheme are stable from useState
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

---

## 4. Context Splitting — The Primary Solution

Split one large context into multiple smaller ones by **update frequency**. Consumers only subscribe to the context they need.

```jsx
// High-frequency: changes on every keystroke
const SearchContext = createContext();

// Low-frequency: changes on login/logout
const AuthContext = createContext();

// Never changes: stable config
const ConfigContext = createContext();
```

**Rule of thumb:** One context per "rate of change." A component rendering a user avatar doesn't need to re-render on every search keystroke.

---

## 5. The Multiple React Instances Trap

In monorepos or micro-frontends, a library may ship its own copy of React instead of declaring it as a `peerDependency`. This creates **two separate context registries** — a Provider from one React instance is invisible to consumers using the other.

**Symptom:** `useContext` returns `undefined` intermittently, only in production builds.

**Diagnosis:**
```js
console.log(require.resolve('react')); // run in both app and library
// Must resolve to the exact same file path
```

**Fix in Vite:**
```js
resolve: { dedupe: ['react', 'react-dom'] }
```

**Fix in Webpack:**
```js
resolve: { alias: { react: path.resolve('./node_modules/react') } }
```

---

## 6. The Guard Pattern — Context Outside Provider

Always guard context hooks to produce actionable errors:

```jsx
const AuthContext = createContext(null); // default: null, not undefined

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useAuth must be used within an <AuthProvider>. ' +
      'Wrap your component tree with <AuthProvider>.'
    );
  }
  return ctx;
}
```

Without this guard, consuming outside a Provider silently returns `null`/`undefined` and produces cryptic downstream errors.

---

## 7. When Context Is the Right Tool

| ✅ Good fit                                  | ❌ Bad fit                                      |
|----------------------------------------------|--------------------------------------------------|
| Scoped compound component state              | Global state with 20+ consumers                  |
| Theme, locale, auth session                  | High-frequency updates (keystrokes, scroll)      |
| Values that rarely change                    | State that needs selector-based subscriptions    |
| Bounded, known set of consumers              | State needing middleware (logging, persistence)  |
| Replacing prop drilling 3+ levels deep       | Fine-grained re-render control                   |

---

## 8. Context vs useReducer vs Redux/Zustand Decision Tree

```
Is the state truly global across the app?
├── No → Is it scoped to a feature/component subtree?
│         ├── Yes → useContext (optionally with useReducer for logic)
│         └── No  → useState in the nearest common ancestor
└── Yes → How many consumers?
          ├── < 10, low update frequency → useContext + useMemo
          └── > 10, or high frequency, or need selectors → Zustand / Redux
```

---

## 9. The useContextSelector Pattern (Without a Library)

Since React has no built-in selector, you can approximate it by splitting state and dispatch:

```jsx
// Separate read-context from dispatch-context
const StateContext  = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

// Components that only dispatch — NEVER re-render on state change
function ActionButton() {
  const dispatch = useContext(DispatchContext);
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>;
}
```

`dispatch` from `useReducer` is **always the same reference** — `DispatchContext` consumers never re-render from state changes.

---

## 10. Key Interview Signals

| What you say                                      | What it signals                        |
|--------------------------------------------------|----------------------------------------|
| "Context uses referential equality"              | You understand why object literals cause re-renders |
| "Split contexts by update frequency"             | You know the primary solution          |
| "useContext has no selector mechanism"           | You know where it breaks down          |
| "Multiple React instances in monorepos"          | Principal-level debugging knowledge    |
| "Separate state and dispatch contexts"           | Advanced pattern knowledge             |
| "Reach for Zustand when selectors are needed"   | Architectural maturity                 |

---

## Quick Reference

```
createContext(defaultValue)    — default used when NO Provider above
useContext(MyContext)           — subscribes, re-renders on any value change
Provider value={...}           — stabilise with useMemo if object/function
Split contexts                 — primary performance solution
Guard hook                     — if (!ctx) throw new Error(...)
```
