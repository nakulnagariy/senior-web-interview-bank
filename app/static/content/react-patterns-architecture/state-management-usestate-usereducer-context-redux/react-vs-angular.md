# React vs Angular — In-Depth Comparison

> All code examples use **React 19** (with hooks) and **Angular 20** (with signals, standalone components, and native control flow).

---

## Table of Contents

1. [Philosophy & Architecture](#1-philosophy--architecture)
2. [Project Setup](#2-project-setup)
3. [Components](#3-components)
4. [Templates & JSX](#4-templates--jsx)
5. [State Management](#5-state-management)
6. [Props / Inputs & Outputs](#6-props--inputs--outputs)
7. [Lifecycle Hooks](#7-lifecycle-hooks)
8. [Routing](#8-routing)
9. [HTTP / API Calls](#9-http--api-calls)
10. [Forms](#10-forms)
11. [Dependency Injection](#11-dependency-injection)
12. [Directives vs Custom Hooks](#12-directives-vs-custom-hooks)
13. [Pipes vs Utility Functions](#13-pipes-vs-utility-functions)
14. [Context vs Services](#14-context-vs-services)
15. [CSS & Styling](#15-css--styling)
16. [Lazy Loading & Code Splitting](#16-lazy-loading--code-splitting)
17. [Change Detection](#17-change-detection)
18. [Testing](#18-testing)
19. [SSR (Server-Side Rendering)](#19-ssr-server-side-rendering)
20. [Animations](#20-animations)
21. [Error Handling](#21-error-handling)
22. [TypeScript Integration](#22-typescript-integration)
23. [Tooling & CLI](#23-tooling--cli)
24. [Quick Reference Cheat Sheet](#24-quick-reference-cheat-sheet)

---

## 1. Philosophy & Architecture

| Aspect | React | Angular |
|---|---|---|
| Type | **UI library** — you choose the rest | **Full framework** — batteries included |
| Language | JavaScript / TypeScript | TypeScript (required) |
| Rendering | Virtual DOM diffing | Zone.js / Signals incremental DOM |
| Data flow | Unidirectional | Unidirectional (components) |
| DI system | Context API / third-party | Built-in hierarchical DI |
| Opinionation | Low — high flexibility | High — opinionated conventions |
| Learning curve | Moderate | Steep |

---

## 2. Project Setup

### React — Vite

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev
```

```
my-app/
├── src/
│   ├── main.tsx          # entry point
│   ├── App.tsx           # root component
│   └── components/
├── index.html
└── vite.config.ts
```

### Angular — CLI

```bash
npm install -g @angular/cli
ng new my-app --style=scss --ssr=false
cd my-app && ng serve
```

```
my-app/
├── src/
│   ├── main.ts           # bootstrapApplication()
│   ├── app/
│   │   ├── app.ts        # root component
│   │   ├── app.html
│   │   ├── app.scss
│   │   └── app.routes.ts
└── angular.json
```

---

## 3. Components

### React

```tsx
// user-card.tsx
import { useState } from 'react';

interface Props {
  name: string;
  role: string;
}

export function UserCard({ name, role }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{role}</p>
      <button onClick={() => setLiked(l => !l)}>
        {liked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </div>
  );
}
```

### Angular

```typescript
// user-card.ts
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCardComponent {
  readonly name = input.required<string>();
  readonly role = input.required<string>();
  readonly liked = signal(false);

  toggleLike() {
    this.liked.update(v => !v);
  }
}
```

```html
<!-- user-card.html -->
<div class="user-card">
  <h2>{{ name() }}</h2>
  <p>{{ role() }}</p>
  <button (click)="toggleLike()">
    {{ liked() ? '❤️ Liked' : '🤍 Like' }}
  </button>
</div>
```

**Key differences:**
- React uses JSX (template + logic in one file); Angular separates `.ts`, `.html`, `.scss`
- React state: `useState` hook; Angular state: `signal()`
- React re-renders the whole component function; Angular surgically updates only signal-dependent DOM nodes

---

## 4. Templates & JSX

### React — JSX

```tsx
function ProductList({ items }: { items: Product[] }) {
  return (
    <ul>
      {items.length === 0 && <p>No products found.</p>}
      {items.map(item => (
        <li key={item.id}>
          {item.name} — ${item.price.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
```

### Angular — Native Control Flow (`@if`, `@for`, `@switch`)

```html
<!-- product-list.html -->
<ul>
  @if (items().length === 0) {
    <p>No products found.</p>
  }
  @for (item of items(); track item.id) {
    <li>{{ item.name }} — {{ item.price | currency }}</li>
  }
</ul>
```

| Feature | React (JSX) | Angular (HTML template) |
|---|---|---|
| Conditionals | `{condition && <El />}` or ternary | `@if` / `@else` |
| Lists | `.map()` + `key` | `@for` + `track` |
| Switch | JS `switch` in render | `@switch` / `@case` |
| Two-way binding | `value` + `onChange` | `[(ngModel)]` or reactive forms |
| Template refs | `useRef` | `#templateRef` |
| Deferred loading | `React.lazy + Suspense` | `@defer` with triggers |

### Angular `@defer` (lazy-load heavy components)

```html
@defer (on viewport; prefetch on idle) {
  <app-heavy-chart />
} @placeholder {
  <div class="skeleton" aria-hidden="true"></div>
} @loading (minimum 300ms) {
  <app-spinner />
} @error {
  <p>Failed to load chart.</p>
}
```

### React equivalent — `Suspense` + `lazy`

```tsx
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  );
}
```

---

## 5. State Management

### React

```tsx
// Local state
const [count, setCount] = useState(0);
const increment = () => setCount(c => c + 1);

// Derived state (useMemo)
const doubled = useMemo(() => count * 2, [count]);

// Ref (mutable, no re-render)
const timerRef = useRef<ReturnType<typeof setInterval>>(null);

// Reducer
const [state, dispatch] = useReducer(reducer, initialState);
```

### Angular — Signals

```typescript
// Local state
readonly count = signal(0);
readonly increment = () => this.count.update(c => c + 1);

// Derived state (computed — equivalent to useMemo)
readonly doubled = computed(() => this.count() * 2);

// linkedSignal (derived but writable — no React equivalent)
readonly selected = signal<string[]>([]);
readonly firstSelected = linkedSignal(() => this.selected()[0] ?? null);

// Effect (runs on signal change — equivalent to useEffect with deps)
constructor() {
  effect(() => {
    console.log('count changed:', this.count());
  });
}
```

### Global State

| Need | React options | Angular options |
|---|---|---|
| Simple global | Context + `useReducer` | Injectable service with signals |
| Complex | Redux / Zustand / Jotai | NgRx / Elf / plain services |
| Server state | TanStack Query | `resource()` / `httpResource()` |

#### Angular service as global state

```typescript
// counter.service.ts
@Injectable({ providedIn: 'root' })
export class CounterService {
  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);

  increment() { this.count.update(c => c + 1); }
  reset()     { this.count.set(0); }
}
```

#### React — Zustand equivalent

```typescript
// useCounterStore.ts
import { create } from 'zustand';

const useCounter = create<{ count: number; increment: () => void }>(set => ({
  count: 0,
  increment: () => set(s => ({ count: s.count + 1 })),
}));
```

---

## 6. Props / Inputs & Outputs

### React

```tsx
// Parent
<Button label="Submit" disabled={isPending} onSuccess={handleSuccess} />

// Child
interface ButtonProps {
  label: string;
  disabled?: boolean;
  onSuccess: (data: string) => void;
}

function Button({ label, disabled = false, onSuccess }: ButtonProps) {
  return <button disabled={disabled} onClick={() => onSuccess('done')}>{label}</button>;
}
```

### Angular

```typescript
// button.ts
@Component({ selector: 'app-button', template: `...` })
export class ButtonComponent {
  readonly label    = input.required<string>();
  readonly disabled = input(false);               // with default
  readonly success  = output<string>();            // EventEmitter equivalent

  handleClick() {
    this.success.emit('done');
  }
}
```

```html
<!-- parent.html -->
<app-button
  label="Submit"
  [disabled]="isPending()"
  (success)="handleSuccess($event)"
/>
```

### Two-way binding — model()

```typescript
// Angular v17+ model() signal (equivalent to React controlled input)
@Component({ selector: 'app-search', template: `
  <input [value]="query()" (input)="query.set($any($event.target).value)" />
`})
export class SearchComponent {
  readonly query = model('');   // bindable signal
}
```

```html
<!-- parent -->
<app-search [(query)]="searchTerm" />
```

---

## 7. Lifecycle Hooks

### React

```tsx
function MyComponent({ id }: { id: number }) {
  // Mount + cleanup (componentDidMount + componentWillUnmount)
  useEffect(() => {
    const sub = subscribe(id);
    return () => sub.unsubscribe();            // cleanup
  }, []);

  // On prop change (componentDidUpdate)
  useEffect(() => {
    fetchData(id);
  }, [id]);

  // Before paint (componentDidMount synchronous)
  useLayoutEffect(() => {
    measureDOM();
  }, []);
}
```

### Angular

```typescript
@Component({ selector: 'app-my', template: `...` })
export class MyComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // after first render, inputs are set
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // input changed — equivalent to useEffect([prop])
    if (changes['id']) this.fetchData(changes['id'].currentValue);
  }

  ngAfterViewInit(): void {
    // DOM is ready — equivalent to useLayoutEffect
    this.measureDOM();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Mapping

| React | Angular |
|---|---|
| Component function runs | `constructor()` |
| `useEffect(fn, [])` | `ngOnInit()` |
| `useEffect(fn, [dep])` | `ngOnChanges()` or `effect()` |
| `useLayoutEffect` | `ngAfterViewInit()` |
| cleanup in `useEffect` return | `ngOnDestroy()` |
| `useRef(null)` + `ref={el}` | `viewChild()` signal |
| `React.memo` | `ChangeDetectionStrategy.OnPush` |

---

## 8. Routing

> **React uses a third-party library (`react-router-dom`); Angular has a native router built into the framework.**

### React — react-router-dom v7

```bash
npm install react-router-dom
```

```tsx
// main.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// Reading params
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();

  return <button onClick={() => navigate(-1)}>Back</button>;
}

// Lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Angular — Native Router

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',          redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',      loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
  { path: 'users/:id', loadComponent: () => import('./features/users/user-detail').then(m => m.UserDetailComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFoundComponent) },
];

// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
});
```

```typescript
// user-detail.ts — reading params
@Component({ selector: 'app-user-detail', template: `...` })
export class UserDetailComponent {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Signal-based (Angular v17+)
  readonly userId = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));

  goBack() { this.router.navigate(['..'], { relativeTo: this.route }); }
}
```

### Router Feature Comparison

| Feature | React Router v7 | Angular Router |
|---|---|---|
| Installation | `npm i react-router-dom` | Built-in |
| Route config | JSX `<Routes>` or objects | `Routes[]` array |
| Lazy loading | `React.lazy` + `Suspense` | `loadComponent` / `loadChildren` |
| Route guards | Loader functions / wrappers | `canActivate`, `canDeactivate`, `resolve` |
| Route params | `useParams()` | `inject(ActivatedRoute).paramMap` |
| Navigation | `useNavigate()` | `inject(Router).navigate()` |
| Query params | `useSearchParams()` | `inject(ActivatedRoute).queryParamMap` |
| Outlet | `<Outlet />` | `<router-outlet />` |
| Link | `<Link to="/about">` | `<a routerLink="/about">` |
| Active link | `<NavLink>` with className | `routerLinkActive="active"` |
| Preloading | Manual | `withPreloading(PreloadAllModules)` |
| Scroll restore | Manual | `withInMemoryScrolling()` |
| Title strategy | `handle.title` | `TitleStrategy` |

---

## 9. HTTP / API Calls

> **React has no built-in HTTP client; Angular provides `HttpClient` with interceptors, retry, and progress events built in.**

### React — fetch / axios

```tsx
// Basic fetch with useEffect
function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/users', { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(setUsers)
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);
}

// TanStack Query (recommended)
import { useQuery, useMutation } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });

  const mutation = useMutation({
    mutationFn: (user: Partial<User>) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(user) }).then(r => r.json()),
  });
}
```

### Angular — HttpClient

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};

// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>('/api/users');              // returns Observable<User[]>
  }

  createUser(data: Partial<User>) {
    return this.http.post<User>('/api/users', data);
  }
}

// user-list.ts — using resource() (Angular v19+)
@Component({ selector: 'app-user-list', template: `...` })
export class UserListComponent {
  private readonly userService = inject(UserService);

  // resource() — async derived state (equivalent to useQuery)
  readonly usersResource = resource({
    loader: () => firstValueFrom(this.userService.getUsers()),
  });
  // usersResource.value()   → User[] | undefined
  // usersResource.isLoading() → boolean
  // usersResource.error()   → unknown

  // Or httpResource() (shorthand for GET)
  readonly users = httpResource<User[]>('/api/users');
}
```

### Interceptors

**React (axios interceptor):**
```typescript
// axiosInstance.ts
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) logout();
    return Promise.reject(err);
  }
);
```

**Angular (functional interceptor):**
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) inject(AuthService).logout();
      return throwError(() => err);
    }),
  );
};
```

### HTTP Feature Comparison

| Feature | React (fetch/axios/TanStack) | Angular HttpClient |
|---|---|---|
| Built-in | ❌ — third-party required | ✅ `@angular/common/http` |
| Interceptors | axios only | Built-in `HttpInterceptorFn` |
| Retry / timeout | axios-retry / manual | `retry()`, `timeout()` RxJS operators |
| Upload progress | `XMLHttpRequest` manually | `reportProgress: true` option |
| Type safety | Generics (manual) | Generics `http.get<T>()` |
| Caching | TanStack Query | `resource()` + custom |
| Cancel request | `AbortController` | `takeUntilDestroyed()` / unsubscribe |
| SSE / WS | Manual | `HttpClient` / WebSocket service |

---

## 10. Forms

### React — Controlled Forms

```tsx
// Uncontrolled with react-hook-form (recommended)
import { useForm } from 'react-hook-form';

interface LoginForm { email: string; password: string; }

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/ })}
        aria-invalid={!!errors.email}
      />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', { required: true, minLength: 8 })}
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

### Angular — Reactive Forms (built-in)

```typescript
// login.ts
@Component({ selector: 'app-login', imports: [ReactiveFormsModule], template: `...` })
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    console.log(this.form.value);
  }
}
```

```html
<!-- login.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
  <input formControlName="email" [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched" />
  @if (form.controls.email.errors?.['email'] && form.controls.email.touched) {
    <p role="alert">Enter a valid email.</p>
  }

  <input type="password" formControlName="password" />

  <button type="submit" [disabled]="form.invalid">Login</button>
</form>
```

### Dynamic FormArray

```typescript
// Angular FormArray
readonly skills = this.fb.array([this.fb.control('')]);
addSkill()         { this.skills.push(this.fb.control('')); }
removeSkill(i: number) { this.skills.removeAt(i); }
```

```tsx
// React — useFieldArray (react-hook-form)
const { fields, append, remove } = useFieldArray({ control, name: 'skills' });
```

### Forms Comparison

| Feature | React (react-hook-form) | Angular Reactive Forms |
|---|---|---|
| Built-in | ❌ | ✅ |
| Two-way binding | Controlled via state | `formControlName` |
| Validation | Rules object + yup/zod | `Validators.*` + custom |
| Nested groups | `useFieldArray` | `FormGroup` + `FormArray` |
| Cross-field validation | `validate` function | Group-level validator |
| Dynamic fields | `useFieldArray` | `FormArray` |
| Form state | `formState.errors/isValid` | `form.valid`, `form.errors` |
| Async validators | `validate: async fn` | `AsyncValidatorFn` |
| Template-driven | N/A | `ngModel` + `FormsModule` |

---

## 11. Dependency Injection

> **React has no built-in DI; it relies on Context + hooks or external libraries. Angular has a hierarchical DI system.**

### React — Context

```tsx
// ThemeContext.tsx
const ThemeContext = createContext<{ theme: string; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};

// Consumer
function Navbar() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>{theme}</button>;
}
```

### Angular — Hierarchical DI

```typescript
// theme.service.ts — singleton (providedIn: 'root')
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme  = signal<'light' | 'dark'>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  toggle() { this.theme.update(t => t === 'light' ? 'dark' : 'light'); }
}

// Consumer — inject() function (no constructor params)
@Component({ selector: 'app-navbar', template: `<button (click)="theme.toggle()">{{ theme.theme() }}</button>` })
export class NavbarComponent {
  readonly theme = inject(ThemeService);
}
```

### DI Scoping — Angular's Superpower

```typescript
// Component-scoped service (new instance per component tree)
@Component({
  selector: 'app-task-board',
  providers: [TaskBoardService],  // scoped to this component + children
})
export class TaskBoardComponent { }

// vs root singleton
@Injectable({ providedIn: 'root' })
export class GlobalCacheService { }

// viewProviders — NOT available to projected content (ng-content)
@Component({
  selector: 'app-parent',
  viewProviders: [LocalService],  // only available to own template view
})
```

> React Context is flat; Angular DI is a **tree** — every component can have its own injector that shadows the parent.

---

## 12. Directives vs Custom Hooks

### React — Custom Hooks

```tsx
// useClickOutside.ts
function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// Usage
function Dropdown() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useClickOutside(ref, () => setOpen(false));
  return <div ref={ref}>{/* ... */}</div>;
}
```

### Angular — Attribute Directive

```typescript
// click-outside.directive.ts
@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  private readonly el    = inject(ElementRef<HTMLElement>);
  readonly clickOutside  = output<void>();

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.clickOutside.emit();
    }
  }
}

// Usage
// <div appClickOutside (clickOutside)="close()">...</div>
```

### Structural Directive vs Render Props

```typescript
// Angular structural directive (*appIf equivalent of @if)
@Directive({ selector: '[appIf]' })
export class IfDirective<T> {
  private readonly vc  = inject(ViewContainerRef);
  private readonly tmpl = inject(TemplateRef<{ $implicit: T }>);

  @Input() set appIf(condition: T | null | undefined) {
    this.vc.clear();
    if (condition) this.vc.createEmbeddedView(this.tmpl, { $implicit: condition });
  }
}
```

---

## 13. Pipes vs Utility Functions

### React — utility functions / libraries

```tsx
import { format } from 'date-fns';
import { formatCurrency } from './utils';

function Invoice({ amount, date }: { amount: number; date: Date }) {
  return (
    <p>
      {formatCurrency(amount, 'USD')} due on {format(date, 'MMM d, yyyy')}
    </p>
  );
}
```

### Angular — Pipes (pure, composable, tree-shakeable)

```html
<!-- Built-in pipes -->
<p>{{ amount | currency:'USD' }} due on {{ date | date:'MMM d, y' }}</p>
<p>{{ user.name | titlecase }}</p>
<p>{{ items | slice:0:5 | json }}</p>
<p>{{ obs$ | async }}</p>       <!-- subscribes and unsubscribes automatically -->
```

```typescript
// Custom pipe
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength = 50, suffix = '…'): string {
    return value.length > maxLength ? value.slice(0, maxLength) + suffix : value;
  }
}
// Usage: {{ description | truncate:100 }}
```

| Built-in Pipe | React equivalent |
|---|---|
| `date` | `date-fns` / `Intl.DateTimeFormat` |
| `currency` | `Intl.NumberFormat` |
| `async` | Subscription management in hooks |
| `json` | `JSON.stringify()` |
| `slice` | `.slice()` in JSX |
| `keyvalue` | `Object.entries()` |
| `percent` | `Intl.NumberFormat` |

---

## 14. Context vs Services

### React — Context + useReducer for global state

```tsx
interface AppState { user: User | null; notifications: Notification[]; }
type Action = { type: 'SET_USER'; user: User } | { type: 'CLEAR' };

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.user };
    case 'CLEAR':    return { ...state, user: null };
    default: return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, { user: null, notifications: [] });
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
```

### Angular — Injectable Service with Signals

```typescript
@Injectable({ providedIn: 'root' })
export class AppStore {
  readonly user          = signal<User | null>(null);
  readonly notifications = signal<Notification[]>([]);
  readonly isLoggedIn    = computed(() => this.user() !== null);

  setUser(user: User)  { this.user.set(user); }
  logout()             { this.user.set(null); this.notifications.set([]); }
  addNotification(n: Notification) {
    this.notifications.update(list => [n, ...list]);
  }
}

// Usage — any component, any level of the tree
@Component({ ... })
export class HeaderComponent {
  readonly store = inject(AppStore);
}
```

---

## 15. CSS & Styling

### React — options

```tsx
// 1. CSS Modules
import styles from './Button.module.css';
<button className={styles.primary}>Click</button>

// 2. Tailwind
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">

// 3. Styled-components (CSS-in-JS)
const Button = styled.button<{ variant: string }>`
  background: ${p => p.variant === 'primary' ? '#6366f1' : 'transparent'};
`;

// 4. Emotion / vanilla-extract
```

### Angular — Component Styles with ViewEncapsulation

```typescript
@Component({
  selector: 'app-button',
  styleUrl: './button.scss',
  // ViewEncapsulation.Emulated  (default) — scoped with _ngcontent attributes
  // ViewEncapsulation.ShadowDom — real shadow DOM
  // ViewEncapsulation.None      — global styles
  encapsulation: ViewEncapsulation.Emulated,
})
```

```scss
// button.scss — automatically scoped to this component
.btn {
  background: var(--primary-color);
  padding: 0.5rem 1rem;

  &:hover { filter: brightness(0.9); }
  &--primary { color: #fff; }
}
```

### Style Isolation

| Approach | React CSS Modules | Angular Emulated | Angular ShadowDom |
|---|---|---|---|
| Scoping | Class name hashing | `_ngcontent` attr | Real shadow DOM |
| Global override | Possible | `:host ::ng-deep` | Harder |
| Performance | Fast | Fast | Slight overhead |
| Browser support | All | All | Modern only |

---

## 16. Lazy Loading & Code Splitting

### React

```tsx
// Route-level splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings"  element={<Settings />} />
  </Routes>
</Suspense>

// Component-level (manual)
const HeavyTable = lazy(() => import('./components/HeavyTable'));
```

### Angular

```typescript
// Route-level (automatic code splitting per route)
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
},
{
  path: 'settings',
  loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes),
},

// Template-level with @defer
@defer (on interaction) {
  <app-heavy-table />
}

// Preloading strategies
provideRouter(routes, withPreloading(PreloadAllModules))
// or custom strategy:
provideRouter(routes, withPreloading(QuicklinkStrategy))
```

---

## 17. Change Detection

### React — Virtual DOM diffing

- On every `setState` / prop change, React re-runs the whole component function
- **React.memo** — skips re-render if props haven't changed (shallow compare)
- **useMemo / useCallback** — memoize expensive values / stable callbacks

```tsx
const ExpensiveList = memo(function ExpensiveList({ items }: { items: Item[] }) {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});

const handleClick = useCallback(() => doSomething(id), [id]);
const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
```

### Angular — Zone.js + Signals

```typescript
// Default (Zone.js): Angular patches all async APIs (setTimeout, fetch, events)
// and runs full change detection after each. Opt-in to OnPush for efficiency.

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,  // only re-check when:
  // 1. Input reference changes
  // 2. Signal/Observable emits
  // 3. Event from this component fires
  // 4. markForCheck() called
})

// Signal-based (Angular v17+ — fine-grained, no Zone.js needed)
readonly items = signal<Item[]>([]);
readonly total = computed(() => this.items().reduce((s, i) => s + i.price, 0));
// Only DOM nodes bound to items() or total() update — zero wasted work
```

### Zoneless Angular (experimental, v18+)

```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
// No zone.js — 100% signal-driven, smaller bundle, faster startup
```

---

## 18. Testing

### React — Vitest + React Testing Library

```tsx
// button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button label="Submit" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders disabled state', () => {
    render(<Button label="Submit" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Angular — Jasmine + Angular Testing Library / TestBed

```typescript
// button.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],   // standalone component = just import it
    }).compileComponents();

    fixture   = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('emits clicked event', () => {
    fixture.componentRef.setInput('label', 'Submit');
    fixture.detectChanges();

    const spy = jasmine.createSpy('clicked');
    component.clicked.subscribe(spy);

    fixture.nativeElement.querySelector('button').click();
    expect(spy).toHaveBeenCalled();
  });

  it('renders label', () => {
    fixture.componentRef.setInput('label', 'Hello');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hello');
  });
});
```

### Service testing — Angular

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('fetches users', () => {
    service.getUsers().subscribe(users => expect(users.length).toBe(2));

    http.expectOne('/api/users').flush([{ id: 1 }, { id: 2 }]);
  });
});
```

### Testing Comparison

| Feature | React (Vitest/RTL) | Angular (Jasmine/TestBed) |
|---|---|---|
| Unit test runner | Vitest / Jest | Jasmine / Jest |
| Component testing | `render()` from RTL | `TestBed.createComponent()` |
| DOM queries | `screen.getByRole()` | `fixture.nativeElement.querySelector()` |
| User events | `@testing-library/user-event` | Native DOM events |
| Mock HTTP | `msw` | `HttpTestingController` |
| DI mocking | `vi.mock()` | `TestBed.overrideProvider()` |
| E2E | Playwright / Cypress | Playwright / Cypress |
| Coverage | Istanbul / c8 | Istanbul (via karma or vitest) |

---

## 19. SSR (Server-Side Rendering)

### React — Next.js

```tsx
// app/users/page.tsx (Next.js App Router)
async function UsersPage() {
  const users = await fetch('https://api.example.com/users', {
    next: { revalidate: 60 },         // ISR
  }).then(r => r.json());

  return <ul>{users.map((u: User) => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Server Actions
async function createUser(formData: FormData) {
  'use server';
  await db.users.create({ name: formData.get('name') as string });
}
```

### Angular — Angular SSR (built-in)

```bash
ng new my-app --ssr
# or add to existing project:
ng add @angular/ssr
```

```typescript
// app.config.server.ts
export const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

// Platform-aware code
@Component({ selector: 'app-root', template: `...` })
export class AppComponent {
  readonly isPlatformBrowser = isPlatformBrowser(inject(PLATFORM_ID));
}

// server.ts — Express server
const app = express();
app.get('*', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;
  commonEngine.render({
    bootstrap,
    documentFilePath: indexHtml,
    url: `${protocol}://${headers.host}${originalUrl}`,
    publicPath: distFolder,
    providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
  }).then(html => res.send(html)).catch(next);
});
```

---

## 20. Animations

### React — Framer Motion

```tsx
import { motion, AnimatePresence } from 'framer-motion';

function Toast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          Saved!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Angular — BrowserAnimationsModule / @angular/animations

```typescript
// app.config.ts
providers: [provideAnimations()]

// component
@Component({
  selector: 'app-toast',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' })),
      ]),
    ]),
  ],
  template: `<div @slideIn *ngIf="visible">Saved!</div>`,
})
export class ToastComponent {
  readonly visible = input(false);
}
```

---

## 21. Error Handling

### React — Error Boundaries

```tsx
// ErrorBoundary.tsx (class component — required for error boundaries)
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { logError(error, info); }

  render() {
    if (this.state.error) return <p>Something went wrong: {this.state.error.message}</p>;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

### Angular — ErrorHandler + Route-level error

```typescript
// global-error.handler.ts
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);

  handleError(error: unknown): void {
    this.logger.error(error);
    console.error(error);
  }
}

// app.config.ts
providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]

// Route-level — @defer @error block
@defer {
  <app-dashboard />
} @error {
  <app-error-page />
}
```

---

## 22. TypeScript Integration

### React

```tsx
// Generic component
function DataTable<T extends { id: string | number }>({
  data,
  columns,
}: {
  data: T[];
  columns: { key: keyof T; label: string }[];
}) {
  return (
    <table>
      <thead>
        <tr>{columns.map(c => <th key={String(c.key)}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(c => <td key={String(c.key)}>{String(row[c.key])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Angular

```typescript
// Generic component
@Component({
  selector: 'app-data-table',
  template: `
    <table>
      <thead>
        <tr>@for (col of columns(); track col.key) { <th>{{ col.label }}</th> }</tr>
      </thead>
      <tbody>
        @for (row of data(); track row.id) {
          <tr>@for (col of columns(); track col.key) { <td>{{ row[col.key] }}</td> }</tr>
        }
      </tbody>
    </table>
  `,
})
export class DataTableComponent<T extends { id: string | number }> {
  readonly data    = input.required<T[]>();
  readonly columns = input.required<{ key: keyof T; label: string }[]>();
}
```

**TypeScript strictness:** Angular requires `strict: true` in `tsconfig.json` by default. React is more flexible.

---

## 23. Tooling & CLI

### React tooling

```bash
# Project scaffolding
npm create vite@latest         # Vite (recommended)
npx create-react-app my-app   # CRA (deprecated)
npx create-next-app@latest    # Next.js

# Common dev tools
npm i -D eslint prettier @typescript-eslint/parser
npm i -D vitest @testing-library/react

# No official CLI for generating components/services
```

### Angular CLI

```bash
npm install -g @angular/cli

# Project
ng new my-app --style=scss --routing --ssr=false

# Generators (no equivalent in React ecosystem)
ng generate component features/users/user-list
ng generate service core/services/auth
ng generate directive shared/directives/ripple
ng generate pipe shared/pipes/truncate
ng generate guard core/guards/auth
ng generate interceptor core/interceptors/auth
ng generate module features/dashboard --routing

# Build
ng build                  # production build
ng build --watch          # watch mode

# Testing
ng test                   # Karma (default)
ng test --no-watch --browsers=ChromeHeadless

# Analyze bundle
ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json
```

---

## 24. Quick Reference Cheat Sheet

| Concept | React | Angular |
|---|---|---|
| **Component** | `function Component() {}` | `@Component class` |
| **Template** | JSX in `.tsx` | `.html` + template syntax |
| **Styling** | CSS Modules / Tailwind / styled | `.scss` with `ViewEncapsulation` |
| **State** | `useState(init)` | `signal(init)` |
| **Derived state** | `useMemo(() => …, [deps])` | `computed(() => …)` |
| **Side effect** | `useEffect(fn, [deps])` | `effect(fn)` or `ngOnInit` |
| **Props in** | Destructured function params | `input()` / `input.required()` |
| **Events out** | Callback props | `output<T>()` |
| **Two-way** | Controlled: `value` + `onChange` | `model()` or `[(ngModel)]` |
| **DOM ref** | `useRef<HTMLElement>(null)` | `viewChild<ElementRef>('ref')` |
| **Routing** | `react-router-dom` (third-party) | `@angular/router` (built-in) |
| **HTTP** | `fetch` / `axios` / TanStack Query | `HttpClient` (built-in) |
| **Forms** | `react-hook-form` (third-party) | `ReactiveFormsModule` (built-in) |
| **DI / Services** | Context + hooks | `@Injectable` + `inject()` |
| **Global state** | Redux / Zustand / Context | Injectable service + signals |
| **Lazy load** | `React.lazy` + `Suspense` | `loadComponent` + `@defer` |
| **HTTP intercept** | axios interceptors | `HttpInterceptorFn` (built-in) |
| **Pipes/Filters** | Utility functions | `@Pipe` + `transform()` |
| **Directives** | Custom hooks | `@Directive` |
| **Change detect** | Virtual DOM re-render | Zone.js / Signals (fine-grained) |
| **SSR** | Next.js (third-party) | `@angular/ssr` (built-in) |
| **Animations** | Framer Motion (third-party) | `@angular/animations` (built-in) |
| **Testing** | Vitest + React Testing Library | Jasmine + TestBed |
| **CLI** | Vite / CRA / Next (no generators) | `ng generate` (full generators) |
| **Language** | JS or TS (optional) | TypeScript (required) |

---

## When to Choose What

### Choose **React** when:
- You want **maximum flexibility** and control over your stack
- Building a highly custom UI with creative interactions (Framer Motion, Three.js)
- Your team is already familiar with JavaScript-first thinking
- You need **Next.js** features (Server Components, Server Actions, edge rendering)
- Small-to-medium apps where a full framework would be overkill

### Choose **Angular** when:
- Building a **large enterprise application** with many developers
- You want **everything built-in** (router, HTTP, forms, DI, animations, SSR)
- Need strict architecture enforcement across large teams
- The application has **complex forms** with deep validation logic
- You prefer **convention over configuration** and strong TypeScript guarantees
- The team needs **Angular CLI generators** for consistent boilerplate
