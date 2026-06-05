# React Hooks vs Angular Equivalents — Complete Reference

> Every React hook mapped to its Angular counterpart, with side-by-side code examples.
> React 19 · Angular 20 (Signals, standalone components)

---

## Table of Contents

1. [useState → signal()](#1-usestate--signal)
2. [useReducer → signal() + update logic](#2-usereducer--signal--update-logic)
3. [useMemo → computed()](#3-usememo--computed)
4. [useCallback → plain method / computed](#4-usecallback--plain-method--computed)
5. [useEffect → effect() / ngOnInit / ngOnDestroy](#5-useeffect--effect--ngoninit--ngondestroy)
6. [useLayoutEffect → ngAfterViewInit](#6-uselayouteffect--ngafterviewinit)
7. [useRef → viewChild() / ElementRef](#7-useref--viewchild--elementref)
8. [useImperativeHandle → viewChild() + public API](#8-useimperativehandle--viewchild--public-api)
9. [useContext → inject() + Injectable Service](#9-usecontext--inject--injectable-service)
10. [useId → Unique ID pattern](#10-useid--unique-id-pattern)
11. [useTransition → Signal + loading flag](#11-usetransition--signal--loading-flag)
12. [useDeferredValue → @defer / debounce signal](#12-usedeferredvalue--defer--debounce-signal)
13. [useSyncExternalStore → toSignal() / RxJS interop](#13-usesyncexternalstore--tosignal--rxjs-interop)
14. [useDebugValue → Angular DevTools](#14-usedebugvalue--angular-devtools)
15. [useInsertionEffect → Renderer2](#15-useinsertioneeffect--renderer2)
16. [use() → resource() / httpResource()](#16-use--resource--httpresource)
17. [useOptimistic → Optimistic signal updates](#17-useoptimistic--optimistic-signal-updates)
18. [useFormStatus → Form signal state](#18-useformstatus--form-signal-state)
19. [Custom Hooks → Custom Services / Directives](#19-custom-hooks--custom-services--directives)
20. [Quick Mapping Cheat Sheet](#20-quick-mapping-cheat-sheet)

---

## 1. useState → signal()

### React — `useState`

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [user, setUser]   = useState<User | null>(null);

  // Replace entire value
  const reset = () => setCount(0);

  // Update based on previous value
  const increment = () => setCount(prev => prev + 1);

  // Partial object update
  const updateName = (name: string) =>
    setUser(prev => prev ? { ...prev, name } : null);

  return <button onClick={increment}>{count}</button>;
}
```

### Angular — `signal()`

```typescript
import { Component, signal } from '@angular/core';

@Component({ selector: 'app-counter', template: `
  <button (click)="increment()">{{ count() }}</button>
` })
export class CounterComponent {
  readonly count = signal(0);
  readonly user  = signal<User | null>(null);

  // Replace entire value
  reset()     { this.count.set(0); }

  // Update based on previous value
  increment() { this.count.update(prev => prev + 1); }

  // Partial object update (mutate — skips deep clone)
  updateName(name: string) {
    this.user.update(u => u ? { ...u, name } : null);
  }
}
```

### Key differences

| | React `useState` | Angular `signal()` |
|---|---|---|
| Read | `count` (value) | `count()` (call it) |
| Set | `setCount(val)` | `count.set(val)` |
| Update | `setCount(fn)` | `count.update(fn)` |
| Mutate in-place | ❌ (new reference) | `count.mutate(fn)` |
| Lazy init | `useState(() => expensiveInit())` | `signal(expensiveInit())` |
| Batching | Automatic in events | Always synchronous |

---

## 2. useReducer → signal() + update logic

`useReducer` is useful when state transitions are complex and described by action types. Angular achieves the same with a service + signal.

### React — `useReducer`

```tsx
type State  = { count: number; status: 'idle' | 'loading' | 'error' };
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_STATUS'; payload: State['status'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':   return { ...state, count: state.count + 1 };
    case 'DECREMENT':   return { ...state, count: state.count - 1 };
    case 'RESET':       return { count: 0, status: 'idle' };
    case 'SET_STATUS':  return { ...state, status: action.payload };
    default:            return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, status: 'idle' });

  return (
    <>
      <p>Count: {state.count} | Status: {state.status}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  );
}
```

### Angular — Service with signals (reducer pattern)

```typescript
// counter.store.ts
interface CounterState { count: number; status: 'idle' | 'loading' | 'error'; }

@Injectable({ providedIn: 'root' })
export class CounterStore {
  // Single state object signal
  private readonly _state = signal<CounterState>({ count: 0, status: 'idle' });

  // Public read-only slices
  readonly count  = computed(() => this._state().count);
  readonly status = computed(() => this._state().status);

  // "Dispatch" methods replace action creators
  increment() { this._state.update(s => ({ ...s, count: s.count + 1 })); }
  decrement() { this._state.update(s => ({ ...s, count: s.count - 1 })); }
  reset()     { this._state.set({ count: 0, status: 'idle' }); }
  setStatus(status: CounterState['status']) {
    this._state.update(s => ({ ...s, status }));
  }
}

// counter.ts
@Component({ selector: 'app-counter', template: `
  <p>Count: {{ store.count() }} | Status: {{ store.status() }}</p>
  <button (click)="store.increment()">+</button>
  <button (click)="store.decrement()">-</button>
  <button (click)="store.reset()">Reset</button>
` })
export class CounterComponent {
  readonly store = inject(CounterStore);
}
```

> **NgRx** is the direct equivalent of Redux + `useReducer` for large apps — it uses `createReducer`, `createAction`, and `Store` with the same pattern.

---

## 3. useMemo → computed()

### React — `useMemo`

```tsx
function ProductList({ products, category }: { products: Product[]; category: string }) {
  // Recalculates only when products or category changes
  const filtered = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  );

  const totalPrice = useMemo(
    () => filtered.reduce((sum, p) => sum + p.price, 0),
    [filtered]
  );

  return (
    <div>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
```

### Angular — `computed()`

```typescript
@Component({ selector: 'app-product-list', template: `
  <p>Total: {{ totalPrice() | currency }}</p>
  <ul>@for (p of filtered(); track p.id) { <li>{{ p.name }}</li> }</ul>
` })
export class ProductListComponent {
  readonly products = input.required<Product[]>();
  readonly category = input.required<string>();

  // Automatically re-runs only when products() or category() changes
  readonly filtered = computed(() =>
    this.products().filter(p => p.category === this.category())
  );

  readonly totalPrice = computed(() =>
    this.filtered().reduce((sum, p) => sum + p.price, 0)
  );
}
```

### Key differences

| | React `useMemo` | Angular `computed()` |
|---|---|---|
| Dependency tracking | Manual `[deps]` array | **Automatic** — reads tracked signals |
| Stale dep risk | Yes — easy to forget a dep | None — no deps array |
| Type | Any value | Any value |
| Lazy | Runs on first read | Runs on first read |
| Can be written? | No | No (use `linkedSignal` instead) |

---

## 4. useCallback → plain method / computed

`useCallback` in React memoizes a function reference to prevent child re-renders. Angular's `OnPush` + signals make this unnecessary.

### React — `useCallback`

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function reference every render → Child re-renders
  // With useCallback: stable reference → Child skips re-render
  const handleClick = useCallback((id: number) => {
    console.log('clicked', id, count);
  }, [count]); // ← must list count as dep because it's captured

  const handleReset = useCallback(() => setCount(0), []); // stable forever

  return <Child onClick={handleClick} onReset={handleReset} />;
}

const Child = memo(({ onClick, onReset }: { onClick: (id: number) => void; onReset: () => void }) => {
  return <button onClick={() => onClick(1)}>Click</button>;
});
```

### Angular — plain class method (no memoization needed)

```typescript
// Angular does NOT re-instantiate the component class on each render.
// Methods are stable references forever. No useCallback equivalent needed.

@Component({ selector: 'app-parent', template: `
  <app-child (clicked)="handleClick($event)" (reset)="handleReset()" />
` })
export class ParentComponent {
  readonly count = signal(0);

  // Stable forever — the class instance never changes
  handleClick(id: number) {
    console.log('clicked', id, this.count()); // reads latest signal value
  }

  handleReset() { this.count.set(0); }
}
```

> Angular methods are inherently stable — the class instance lives for the component lifetime. `useCallback` has no Angular equivalent because the problem doesn't exist.

---

## 5. useEffect → effect() / ngOnInit / ngOnDestroy

### React — `useEffect`

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  // Run once on mount
  useEffect(() => {
    console.log('component mounted');
    return () => console.log('component destroyed');
  }, []);

  // Run when userId changes
  useEffect(() => {
    const controller = new AbortController();
    fetchUser(userId, controller.signal).then(setUser);
    return () => controller.abort();           // cleanup on dep change / unmount
  }, [userId]);

  // Subscribe to a store / event
  useEffect(() => {
    const unsub = themeStore.subscribe(() => forceUpdate());
    return unsub;
  }, []);
}
```

### Angular — `effect()` + lifecycle hooks

```typescript
@Component({ selector: 'app-user-profile', template: `...` })
export class UserProfileComponent implements OnInit, OnDestroy {
  readonly userId = input.required<string>();
  readonly user   = signal<User | null>(null);

  private readonly userService = inject(UserService);
  private readonly destroyRef  = inject(DestroyRef);  // replaces ngOnDestroy

  constructor() {
    // Reactive effect — re-runs automatically when userId() changes
    // Angular tracks dependencies automatically (no deps array)
    effect(() => {
      const id = this.userId();     // reading userId() registers it as a dependency
      this.userService.getUser(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(u => this.user.set(u));
    });
  }

  ngOnInit(): void {
    console.log('component mounted');
  }

  ngOnDestroy(): void {
    console.log('component destroyed');
    // OR: use destroyRef.onDestroy() anywhere without implementing the interface
  }
}

// Even cleaner — destroyRef.onDestroy() replaces ngOnDestroy entirely
@Component({ ... })
export class CleanComponent {
  constructor() {
    inject(DestroyRef).onDestroy(() => console.log('destroyed'));
  }
}
```

### effect() vs useEffect — key differences

| | React `useEffect` | Angular `effect()` |
|---|---|---|
| Dependency tracking | Manual `[deps]` array | **Automatic** via signal reads |
| Runs | After paint (async) | Synchronously after signals change |
| Cleanup | Return a function | `effect(() => { ...; return cleanup; })` |
| Run once | `useEffect(fn, [])` | `afterNextRender(fn)` |
| Skip first run | `useRef` hack | `effect(() => ..., { manualCleanup: true })` |
| SSR safe | `useEffect` skipped on server | `afterRender` / `afterNextRender` |

---

## 6. useLayoutEffect → ngAfterViewInit

`useLayoutEffect` fires synchronously after DOM mutations, before the browser paints — used for DOM measurement.

### React — `useLayoutEffect`

```tsx
function Tooltip({ text }: { text: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Fires before browser paint — reads DOM layout synchronously
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom, left: rect.left });
    }
  }, [text]);

  return <div ref={ref}>{text}</div>;
}
```

### Angular — `ngAfterViewInit` + `viewChild`

```typescript
@Component({ selector: 'app-tooltip', template: `
  <div #container>{{ text() }}</div>
` })
export class TooltipComponent implements AfterViewInit {
  readonly text      = input.required<string>();
  readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  readonly pos = signal({ top: 0, left: 0 });

  ngAfterViewInit(): void {
    // DOM is ready — equivalent to useLayoutEffect
    this.measurePosition();
  }

  private measurePosition(): void {
    const rect = this.container().nativeElement.getBoundingClientRect();
    this.pos.set({ top: rect.bottom, left: rect.left });
  }
}
```

---

## 7. useRef → viewChild() / ElementRef

`useRef` has two uses in React:
1. **DOM reference** — accessing a DOM element directly
2. **Mutable container** — persisting a value across renders without triggering re-render

### React — `useRef`

```tsx
function VideoPlayer({ src }: { src: string }) {
  // USE 1: DOM reference
  const videoRef = useRef<HTMLVideoElement>(null);

  const play  = () => videoRef.current?.play();
  const pause = () => videoRef.current?.pause();

  // USE 2: Mutable value (no re-render)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const renderCount = useRef(0);  // track render count without causing re-render

  useEffect(() => {
    renderCount.current++;
    intervalRef.current = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  return <video ref={videoRef} src={src} />;
}
```

### Angular — `viewChild()` + instance properties

```typescript
@Component({ selector: 'app-video-player', template: `
  <video #player [src]="src()"></video>
  <button (click)="play()">Play</button>
  <button (click)="pause()">Pause</button>
` })
export class VideoPlayerComponent {
  readonly src = input.required<string>();

  // USE 1: DOM reference — viewChild() signal
  readonly playerEl = viewChild.required<ElementRef<HTMLVideoElement>>('player');

  play()  { this.playerEl().nativeElement.play(); }
  pause() { this.playerEl().nativeElement.pause(); }

  // USE 2: Mutable value without re-render — plain class property
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private renderCount = 0;  // plain property, no signal needed

  ngOnInit() {
    this.renderCount++;
    this.intervalId = setInterval(() => console.log('tick'), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
```

### Querying child components

```tsx
// React — useRef to call child methods (requires forwardRef + useImperativeHandle)
const childRef = useRef<ChildHandle>(null);
childRef.current?.scrollToTop();

return <ChildComponent ref={childRef} />;
```

```typescript
// Angular — viewChild() queries child component instance directly
@Component({ template: `<app-scroll-list #list />` })
export class ParentComponent {
  readonly list = viewChild.required(ScrollListComponent);

  scrollToTop() {
    this.list().scrollToTop();  // calls public method on child directly
  }
}
```

---

## 8. useImperativeHandle → viewChild() + public API

`useImperativeHandle` lets a child component **expose a controlled API** to a parent via a ref — used when a parent needs to imperatively call child methods (e.g. `.focus()`, `.scrollTo()`, `.reset()`).

### React — `useImperativeHandle` + `forwardRef`

```tsx
// child: FancyInput.tsx
interface FancyInputHandle {
  focus: ()       => void;
  clear: ()       => void;
  getValue: ()    => string;
}

const FancyInput = forwardRef<FancyInputHandle, { label: string }>(
  ({ label }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');

    // Expose a CONTROLLED subset of the child's API to the parent
    useImperativeHandle(ref, () => ({
      focus:    () => inputRef.current?.focus(),
      clear:    () => setValue(''),
      getValue: () => value,
    }), [value]);

    return (
      <label>
        {label}
        <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} />
      </label>
    );
  }
);

// parent: Form.tsx
function Form() {
  const inputRef = useRef<FancyInputHandle>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.getValue());
    inputRef.current?.clear();
  };

  return (
    <>
      <FancyInput ref={inputRef} label="Name" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### Angular — `viewChild()` queries public class members directly

Angular does **not** need `forwardRef` or `useImperativeHandle`. A parent gets the child component instance via `viewChild()` and can call any **public** method/property directly. The child author controls the API by choosing what to make `public` vs `private`.

```typescript
// fancy-input.ts — the child just exposes public methods
@Component({
  selector: 'app-fancy-input',
  template: `
    <label>
      {{ label() }}
      <input #input [value]="value()" (input)="value.set($any($event.target).value)" />
    </label>
  `
})
export class FancyInputComponent {
  readonly label = input.required<string>();
  readonly value = signal('');              // accessible to parent via viewChild

  // These ARE the imperative API — just public methods
  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('input');

  focus():    void   { this.inputEl().nativeElement.focus(); }
  clear():    void   { this.value.set(''); }
  getValue(): string { return this.value(); }
}

// form.ts — the parent
@Component({
  selector: 'app-form',
  template: `
    <app-fancy-input #nameInput label="Name" />
    <button (click)="nameInput.focus()">Focus</button>
    <button (click)="submit()">Submit</button>
  `
})
export class FormComponent {
  // viewChild() gives you the ACTUAL component instance
  readonly nameInput = viewChild.required(FancyInputComponent);

  submit(): void {
    console.log(this.nameInput().getValue());
    this.nameInput().clear();
  }
}
```

### Side-by-side comparison

| Aspect | React | Angular |
|---|---|---|
| Boilerplate | `forwardRef` + `useImperativeHandle` + interface | None — `viewChild()` returns the instance |
| API control | Explicit whitelist in `useImperativeHandle` | Public/private TypeScript visibility |
| Type safety | Separate handle interface | Full component type automatically |
| Template ref | `ref={childRef}` | `#nameInput` template variable |
| Access in parent | `childRef.current?.method()` | `this.nameInput().method()` |
| Multiple children | Multiple `useRef` | `viewChildren(FancyInputComponent)` |

### Querying multiple children — `viewChildren()`

```tsx
// React
const refs = Array.from({ length: 3 }, () => useRef<ChildHandle>(null));
refs[0].current?.focus();
```

```typescript
// Angular — viewChildren() returns a Signal<readonly T[]>
@Component({ template: `
  @for (item of items(); track item.id) {
    <app-item #itemRef [data]="item" />
  }
` })
export class ListComponent {
  readonly items    = input.required<Item[]>();
  readonly itemRefs = viewChildren(ItemComponent);  // Signal<readonly ItemComponent[]>

  focusFirst() { this.itemRefs()[0]?.focus(); }
  clearAll()   { this.itemRefs().forEach(r => r.clear()); }
}
```

---

## 9. useContext → inject() + Injectable Service

### React — `useContext`

```tsx
// auth.context.tsx
interface AuthCtx { user: User | null; login: (creds: Credentials) => Promise<void>; logout: () => void; }
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (creds: Credentials) => {
    const u = await api.login(creds);
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

// Consumer — any level of the tree
function Header() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>{user?.name}</button>;
}
```

### Angular — `inject()` + `@Injectable`

```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })  // singleton — no Provider component needed
export class AuthService {
  readonly user    = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  private readonly http = inject(HttpClient);

  async login(creds: Credentials): Promise<void> {
    const u = await firstValueFrom(this.http.post<User>('/api/login', creds));
    this.user.set(u);
  }

  logout(): void { this.user.set(null); }
}

// Consumer — any component, no wrapping provider needed
@Component({ selector: 'app-header', template: `
  <button (click)="auth.logout()">{{ auth.user()?.name }}</button>
` })
export class HeaderComponent {
  readonly auth = inject(AuthService);  // DI resolves it automatically
}
```

---

## 10. useId → Unique ID pattern

`useId` generates a stable unique ID per component instance for accessibility (linking `<label>` to `<input>`).

### React — `useId`

```tsx
function FormField({ label }: { label: string }) {
  const id = useId();   // stable per component instance
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}
// Two <FormField /> instances get different IDs: :r0:, :r1:
```

### Angular — inject-based counter or `crypto.randomUUID()`

```typescript
// Shared token for unique IDs
let nextId = 0;

@Component({ selector: 'app-form-field', template: `
  <label [for]="fieldId">{{ label() }}</label>
  <input [id]="fieldId" type="text" />
` })
export class FormFieldComponent {
  readonly label   = input.required<string>();
  readonly fieldId = `field-${nextId++}`;   // stable for component lifetime
}

// OR: inject a service
@Injectable({ providedIn: 'root' })
export class UniqueIdService {
  private counter = 0;
  next(prefix = 'id'): string { return `${prefix}-${++this.counter}`; }
}

@Component({ ... })
export class FormFieldComponent {
  readonly fieldId = inject(UniqueIdService).next('field');
}
```

---

## 11. useTransition → Signal + loading flag

`useTransition` lets you mark a state update as non-urgent, keeping the UI responsive while expensive state changes render.

### React — `useTransition`

```tsx
function SearchPage() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Result[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);                    // urgent — update input immediately

    startTransition(() => {
      setResults(heavyFilter(val));   // non-urgent — can be interrupted
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <ResultsList items={results} />
    </>
  );
}
```

### Angular — `signal()` + async pipe / `resource()`

Angular's signals are synchronous and fine-grained — expensive derived computations only update the specific DOM nodes that depend on them. For truly async/deferred work, use `resource()`.

```typescript
@Component({ selector: 'app-search', template: `
  <input [value]="query()" (input)="query.set($any($event.target).value)" />
  @if (search.isLoading()) { <app-spinner /> }
  <app-results-list [items]="search.value() ?? []" />
` })
export class SearchComponent {
  readonly query = signal('');

  // resource() — re-runs whenever query() changes, tracks loading state
  readonly search = resource({
    request: () => ({ q: this.query() }),
    loader: ({ request, abortSignal }) =>
      fetch(`/api/search?q=${request.q}`, { signal: abortSignal })
        .then(r => r.json() as Promise<Result[]>),
  });
}
```

---

## 12. useDeferredValue → @defer / debounce signal

`useDeferredValue` keeps a stale copy of a value while a newer, expensive render catches up.

### React — `useDeferredValue`

```tsx
function ProductSearch({ query }: { query: string }) {
  // deferredQuery lags behind query — shows stale results while new ones compute
  const deferredQuery = useDeferredValue(query);
  const isStale       = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <ExpensiveProductList query={deferredQuery} />
    </div>
  );
}
```

### Angular — debounced signal + `@defer`

```typescript
@Component({ selector: 'app-product-search', template: `
  <input (input)="setRaw($any($event.target).value)" />

  <!-- @defer defers rendering until the browser is idle -->
  @defer (on idle) {
    <app-expensive-list [query]="debouncedQuery()" />
  } @placeholder {
    <p style="opacity: 0.5">Searching...</p>
  }
` })
export class ProductSearchComponent {
  private readonly raw = signal('');

  // Debounce with RxJS + toSignal
  readonly debouncedQuery = toSignal(
    toObservable(this.raw).pipe(debounceTime(300)),
    { initialValue: '' }
  );

  setRaw(val: string) { this.raw.set(val); }
}
```

---

## 13. useSyncExternalStore → toSignal() / RxJS interop

`useSyncExternalStore` subscribes React to external stores (Redux, Zustand, browser APIs) safely.

### React — `useSyncExternalStore`

```tsx
// Subscribe to browser online/offline status
function useOnlineStatus() {
  return useSyncExternalStore(
    callback => {
      window.addEventListener('online',  callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online',  callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,     // getSnapshot (client)
    () => true,                 // getServerSnapshot (SSR)
  );
}

// Usage
function Status() {
  const isOnline = useOnlineStatus();
  return <p>{isOnline ? '🟢 Online' : '🔴 Offline'}</p>;
}
```

### Angular — `toSignal()` + Observable

```typescript
// online-status.service.ts
@Injectable({ providedIn: 'root' })
export class OnlineStatusService {
  private readonly online$ = merge(
    fromEvent(window, 'online').pipe(map(() => true)),
    fromEvent(window, 'offline').pipe(map(() => false)),
  ).pipe(startWith(navigator.onLine), distinctUntilChanged());

  // Convert Observable to Signal
  readonly isOnline = toSignal(this.online$, { initialValue: navigator.onLine });
}

// Consumer
@Component({ selector: 'app-status', template: `
  <p>{{ status.isOnline() ? '🟢 Online' : '🔴 Offline' }}</p>
` })
export class StatusComponent {
  readonly status = inject(OnlineStatusService);
}
```

---

## 14. useDebugValue → Angular DevTools

`useDebugValue` labels a custom hook value in React DevTools.

### React — `useDebugValue`

```tsx
function useFetch<T>(url: string) {
  const [state, setState] = useState<{ data: T | null; status: string }>({
    data: null,
    status: 'idle',
  });

  useDebugValue(state.status, s => `Fetch status: ${s}`);  // shown in DevTools

  // ... fetch logic
  return state;
}
```

### Angular — no direct equivalent; Angular DevTools shows signals automatically

Angular DevTools (Chrome extension) automatically displays all signals and their current values in the component tree — no annotation needed.

```typescript
@Component({ ... })
export class MyComponent {
  // All signals appear in Angular DevTools automatically
  readonly userId  = signal(1);         // visible as "userId: 1"
  readonly loading = signal(false);     // visible as "loading: false"
  readonly user    = resource({ ... }); // visible with status
}
```

---

## 15. useInsertionEffect → Renderer2

`useInsertionEffect` fires before DOM mutations and is used by CSS-in-JS libraries to inject styles.

### React — `useInsertionEffect`

```tsx
function useDynamicStyles(css: string) {
  useInsertionEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, [css]);
}
```

### Angular — `Renderer2`

```typescript
@Injectable({ providedIn: 'root' })
export class DynamicStyleService {
  private readonly renderer = inject(Renderer2);
  private readonly doc      = inject(DOCUMENT);

  inject(css: string): HTMLStyleElement {
    const el = this.renderer.createElement('style') as HTMLStyleElement;
    el.textContent = css;
    this.renderer.appendChild(this.doc.head, el);
    return el;
  }

  remove(el: HTMLStyleElement): void {
    this.renderer.removeChild(this.doc.head, el);
  }
}
```

---

## 16. use() → resource() / httpResource()

React 19's `use()` hook suspends a component while awaiting a Promise or reads a Context. Angular's `resource()` and `httpResource()` serve the same purpose with a signal-based API.

### React — `use()` (React 19)

```tsx
// Suspend while a promise resolves
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);  // suspends until resolved
  return <h1>{user.name}</h1>;
}

// Parent wraps in Suspense
function App() {
  const userPromise = fetchUser(1);   // created outside component (stable ref)
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

// use() with Context (replaces useContext in conditional/loop positions)
function ThemedButton() {
  const theme = use(ThemeContext);
  return <button style={{ color: theme.primary }}>Click</button>;
}
```

### Angular — `resource()` / `httpResource()`

```typescript
// resource() — async derived state with loading/error signals
@Component({ selector: 'app-user-profile', template: `
  @if (userRes.isLoading()) {
    <app-spinner />
  } @else if (userRes.error()) {
    <p role="alert">Failed to load user.</p>
  } @else {
    <h1>{{ userRes.value()?.name }}</h1>
  }
` })
export class UserProfileComponent {
  readonly userId = input.required<number>();

  // Re-fetches automatically when userId() changes
  readonly userRes = resource({
    request: () => this.userId(),
    loader: ({ request: id }) =>
      fetch(`/api/users/${id}`).then(r => r.json() as Promise<User>),
  });
}

// httpResource() — shorthand GET (Angular v19.2+)
@Component({ ... })
export class UserProfileComponent {
  readonly userId  = input.required<number>();
  readonly userRes = httpResource<User>(() => `/api/users/${this.userId()}`);
  // userRes.value()     → User | undefined
  // userRes.isLoading() → boolean
  // userRes.error()     → HttpErrorResponse | undefined
  // userRes.reload()    → force re-fetch
}
```

---

## 17. useOptimistic → Optimistic signal updates

React 19's `useOptimistic` shows an optimistic UI update immediately while the real mutation runs in the background.

### React — `useOptimistic` (React 19)

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  async function addTodo(text: string) {
    const tempTodo = { id: Date.now(), text, done: false };
    addOptimistic(tempTodo);               // immediately add to UI
    await api.createTodo(text);            // actual request
    // React reverts optimistic update if the server call throws
  }

  return (
    <ul>
      {optimisticTodos.map(t => <li key={t.id}>{t.text}</li>)}
    </ul>
  );
}
```

### Angular — manual optimistic signal pattern

```typescript
@Component({ selector: 'app-todo-list', template: `
  <ul>@for (t of todos(); track t.id) { <li>{{ t.text }}</li> }</ul>
  <button (click)="addTodo('New task')">Add</button>
` })
export class TodoListComponent {
  readonly todos = signal<Todo[]>([]);
  private readonly todoService = inject(TodoService);

  async addTodo(text: string): Promise<void> {
    const tempId  = -Date.now();  // temp negative ID
    const optimistic: Todo = { id: tempId, text, done: false };

    this.todos.update(list => [...list, optimistic]);  // optimistic update

    try {
      const real = await firstValueFrom(this.todoService.create(text));
      // Replace temp entry with real server response
      this.todos.update(list => list.map(t => t.id === tempId ? real : t));
    } catch {
      // Revert on failure
      this.todos.update(list => list.filter(t => t.id !== tempId));
    }
  }
}
```

---

## 18. useFormStatus → Form signal state

React 19's `useFormStatus` reads the pending state of the nearest parent `<form>` using Server Actions.

### React — `useFormStatus` (React 19 + Server Actions)

```tsx
// submit-button.tsx — reads parent form's pending state
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}

// parent form with Server Action
async function saveProfile(formData: FormData) {
  'use server';
  await db.profiles.update({ name: formData.get('name') });
}

function ProfileForm() {
  return (
    <form action={saveProfile}>
      <input name="name" />
      <SubmitButton />  {/* automatically gets pending state */}
    </form>
  );
}
```

### Angular — reactive form `status` signal

Angular Reactive Forms expose `form.status`, `form.pending`, and `form.valid` as observables. Convert to signals for template use.

```typescript
@Component({ selector: 'app-profile-form', imports: [ReactiveFormsModule], template: `
  <form [formGroup]="form" (ngSubmit)="save()">
    <input formControlName="name" />
    <!-- Pass submitting state to child button -->
    <app-submit-button [pending]="submitting()" />
  </form>
` })
export class ProfileFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);

  readonly form = this.fb.group({
    name: ['', Validators.required],
  });

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.submitting.set(true);
    try {
      await firstValueFrom(this.profileService.update(this.form.value));
    } finally {
      this.submitting.set(false);
    }
  }
}

// submit-button.ts — receives pending as an input signal
@Component({ selector: 'app-submit-button', template: `
  <button type="submit" [disabled]="pending()" [attr.aria-busy]="pending()">
    {{ pending() ? 'Saving…' : 'Save' }}
  </button>
` })
export class SubmitButtonComponent {
  readonly pending = input(false);
}
```

---

## 19. Custom Hooks → Custom Services / Directives

Custom hooks in React bundle stateful logic for reuse across components. Angular achieves the same with **injectable services** (for state/data) and **directives** (for DOM behaviour).

### React — Custom Hook

```tsx
// useWindowSize.ts
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;   // reusable in any component
}

// useLocalStorage.ts
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? '') ?? initial; }
    catch { return initial; }
  });

  const set = (val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, set] as const;
}
```

### Angular — Service (for logic) + Directive (for DOM)

```typescript
// window-size.service.ts — reusable injectable
@Injectable({ providedIn: 'root' })
export class WindowSizeService {
  private readonly size$ = fromEvent(window, 'resize').pipe(
    map(() => ({ width: window.innerWidth, height: window.innerHeight })),
    startWith({ width: window.innerWidth, height: window.innerHeight }),
    shareReplay(1),
  );

  readonly size = toSignal(this.size$, {
    initialValue: { width: window.innerWidth, height: window.innerHeight },
  });
}

// local-storage.service.ts
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get<T>(key: string, fallback: T): T {
    try { return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback; }
    catch { return fallback; }
  }
  set<T>(key: string, value: T): void { localStorage.setItem(key, JSON.stringify(value)); }
}

// Usage — inject in any component
@Component({ selector: 'app-dashboard', template: `
  Window: {{ win.size().width }} × {{ win.size().height }}
` })
export class DashboardComponent {
  readonly win = inject(WindowSizeService);
}
```

### Directive as a reusable behaviour hook

```typescript
// ripple.directive.ts — equivalent to useRipple custom hook
@Directive({ selector: '[appRipple]', host: { '(click)': 'createRipple($event)' } })
export class RippleDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  createRipple(event: MouseEvent): void {
    const circle  = document.createElement('span');
    const rect    = this.el.nativeElement.getBoundingClientRect();
    const size    = Math.max(rect.width, rect.height);
    circle.style.cssText = `
      position: absolute; border-radius: 50%; pointer-events: none;
      width: ${size}px; height: ${size}px;
      top: ${event.clientY - rect.top  - size / 2}px;
      left: ${event.clientX - rect.left - size / 2}px;
      animation: ripple 600ms linear;
    `;
    this.el.nativeElement.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }
}
// Usage: <button appRipple>Click me</button>
```

---

## 20. Quick Mapping Cheat Sheet

| React Hook | Angular Equivalent | Notes |
|---|---|---|
| `useState(v)` | `signal(v)` | Call signal to read: `val()` |
| `useState(fn)` | `signal(fn())` | Angular: call init fn immediately |
| `useReducer` | `signal()` + methods in service | Or NgRx for complex reducers |
| `useMemo` | `computed()` | No deps array — auto-tracked |
| `useCallback` | Plain class method | Not needed — methods are stable |
| `useEffect(fn,[])` | `ngOnInit()` / `afterNextRender()` | |
| `useEffect(fn,[dep])` | `effect(fn)` | Auto-tracks signal deps |
| `useEffect cleanup` | `ngOnDestroy()` / `DestroyRef.onDestroy()` | |
| `useLayoutEffect` | `ngAfterViewInit()` | |
| `useRef` (DOM) | `viewChild('ref')` | Returns `Signal<ElementRef>` |
| `useRef` (mutable) | Plain class property | `private intervalId = 0` |
| `useImperativeHandle` | `viewChild(ChildComp)` + public methods | No forwardRef needed |
| `forwardRef` | `viewChild()` on component type | Built into the query |
| `useContext` | `inject(Service)` | No Provider wrapper needed |
| `useId` | Counter service / `crypto.randomUUID()` | |
| `useTransition` | `resource()` + `isLoading()` signal | |
| `useDeferredValue` | `debounceTime()` + `toSignal()` | |
| `useSyncExternalStore` | `toSignal(observable$)` | |
| `useDebugValue` | Angular DevTools (automatic) | |
| `useInsertionEffect` | `Renderer2` | |
| `use(Promise)` | `resource()` / `httpResource()` | |
| `use(Context)` | `inject(Token)` | |
| `useOptimistic` | Manual optimistic signal + try/catch | |
| `useFormStatus` | `signal(submitting)` passed as `input()` | |
| Custom hook | `@Injectable` service or `@Directive` | Service = logic, Directive = DOM |
| `React.memo` | `ChangeDetectionStrategy.OnPush` | |
| `React.lazy` | `loadComponent` / `loadChildren` | |
| `React.Suspense` | `@defer` with `@loading` / `@placeholder` | |
| `React.createContext` | `InjectionToken<T>` | |
| `ReactDOM.createPortal` | `DomPortal` / `CdkPortal` | |
