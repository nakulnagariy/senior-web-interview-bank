// ============================================================
// useContext — Performance Gotchas & Re-render Scope
// example-generated.js
// Senior-level coding samples with explanations
// ============================================================


// ─────────────────────────────────────────────────────────────
// SAMPLE 1: The Unstable Value Trap vs Stable Value
// ─────────────────────────────────────────────────────────────

import React, {
  createContext, useContext, useState,
  useMemo, useReducer, useCallback, memo
} from 'react';

const AppContext = createContext(null);

// ❌ BAD: New object created on every render → all consumers re-render
function BadProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // This object is recreated every single render of BadProvider
  // Object.is(prev, next) → false every time → all consumers re-render
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ GOOD: useMemo stabilises the value reference
function GoodProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // Value object only recreated when user or theme actually changes
  // setUser and setTheme from useState are always the same reference
  const value = useMemo(
    () => ({ user, setUser, theme, setTheme }),
    [user, theme]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


// ─────────────────────────────────────────────────────────────
// SAMPLE 2: Context Splitting by Update Frequency
// ─────────────────────────────────────────────────────────────

// Three separate contexts — consumers only subscribe to what they use
const AuthContext    = createContext(null); // changes: login/logout
const SearchContext  = createContext(null); // changes: every keystroke
const ConfigContext  = createContext(null); // changes: never (stable config)

function RootProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [query, setQuery]     = useState('');
  const config                = useMemo(() => ({ apiUrl: '/api', version: 2 }), []);

  const authValue   = useMemo(() => ({ user, setUser }), [user]);
  const searchValue = useMemo(() => ({ query, setQuery }), [query]);

  return (
    <ConfigContext.Provider value={config}>
      <AuthContext.Provider value={authValue}>
        <SearchContext.Provider value={searchValue}>
          {children}
        </SearchContext.Provider>
      </AuthContext.Provider>
    </ConfigContext.Provider>
  );
}

// This component ONLY re-renders when user changes — NOT on every keystroke
function UserAvatar() {
  const { user } = useContext(AuthContext);
  console.log('UserAvatar render'); // only logs on login/logout
  return <div>{user?.name}</div>;
}

// This component re-renders on every keystroke — expected and correct
function SearchBar() {
  const { query, setQuery } = useContext(SearchContext);
  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}


// ─────────────────────────────────────────────────────────────
// SAMPLE 3: Guard Pattern — useContext safety hook
// ─────────────────────────────────────────────────────────────

const ThemeContext = createContext(null);

// Always create a wrapper hook with a guard
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error(
      'useTheme() must be used inside a <ThemeProvider>.\n' +
      'Make sure your component is wrapped: <ThemeProvider><YourComponent /></ThemeProvider>'
    );
  }
  return ctx;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(
    () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    []
  );
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Consumer — clean, no null checks needed, error is self-documenting
function ThemedButton({ children }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
    >
      {children}
    </button>
  );
}


// ─────────────────────────────────────────────────────────────
// SAMPLE 4: Separate State + Dispatch Contexts
// Consumers that only dispatch NEVER re-render from state changes
// ─────────────────────────────────────────────────────────────

const CountStateContext    = createContext(null);
const CountDispatchContext = createContext(null);

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET':     return { count: 0 };
    default:          return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(countReducer, { count: 0 });

  // dispatch from useReducer is ALWAYS the same reference — never changes
  // So CountDispatchContext consumers never re-render due to count changes
  return (
    <CountDispatchContext.Provider value={dispatch}>
      <CountStateContext.Provider value={state}>
        {children}
      </CountStateContext.Provider>
    </CountDispatchContext.Provider>
  );
}

// ✅ Only re-renders when count changes
const CountDisplay = memo(function CountDisplay() {
  const { count } = useContext(CountStateContext);
  console.log('CountDisplay render');
  return <p>Count: {count}</p>;
});

// ✅ NEVER re-renders from count changes — only reads dispatch (stable ref)
const CountControls = memo(function CountControls() {
  const dispatch = useContext(CountDispatchContext);
  console.log('CountControls render — should only log ONCE (on mount)');
  return (
    <div>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
});


// ─────────────────────────────────────────────────────────────
// SAMPLE 5: Context with Async — loading state management
// ─────────────────────────────────────────────────────────────

const UserContext = createContext(null);

function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'LOGOUT':
      return { status: 'idle', data: null, error: null };
    default:
      return state;
  }
};

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {
    status: 'idle',
    data: null,
    error: null,
  });

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const user = await api.login(credentials);
      dispatch({ type: 'FETCH_SUCCESS', payload: user });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', error: err.message });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  // login and logout are stable (useCallback with [])
  // state changes when status/data/error changes
  const value = useMemo(
    () => ({ ...state, login, logout }),
    [state, login, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}


// ─────────────────────────────────────────────────────────────
// SAMPLE 6: Measuring re-renders — debugging context performance
// ─────────────────────────────────────────────────────────────

// Utility: wrap any component to log when it re-renders and why
function withRenderLog(Component, name) {
  return memo(function LoggedComponent(props) {
    console.count(`${name} render`);
    return <Component {...props} />;
  });
}

// In development: use React DevTools Profiler
// Components re-rendering unexpectedly? Check:
// 1. Is the context value a new object reference every render?
// 2. Is the consumer subscribed to a context that changes frequently?
// 3. Are there multiple React instances (monorepo trap)?

// Quick context value stability check:
function ContextValueDebugger({ context }) {
  const value = useContext(context);
  React.useEffect(() => {
    console.log('Context value changed:', value);
  }); // no deps — runs on every render, showing every value change
  return null;
}


// ─────────────────────────────────────────────────────────────
// SAMPLE 7: When to abandon Context — Zustand migration pattern
// ─────────────────────────────────────────────────────────────

// Signal: you have this pattern with 10+ consumers
const HeavyContext = createContext(null);

// ← When this becomes painful, migrate to Zustand:
// import { create } from 'zustand';
//
// const useAppStore = create((set) => ({
//   user: null,
//   theme: 'light',
//   searchQuery: '',
//   setUser:        (user)  => set({ user }),
//   setTheme:       (theme) => set({ theme }),
//   setSearchQuery: (q)     => set({ searchQuery: q }),
// }));
//
// // Selector — ONLY re-renders when user changes, not theme or query
// const user = useAppStore(state => state.user);
//
// // This is what Context fundamentally cannot do without a library
