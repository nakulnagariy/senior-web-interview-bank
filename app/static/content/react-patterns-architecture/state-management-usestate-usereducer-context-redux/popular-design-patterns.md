# Most Popular Design Patterns for Frontend Interviews (with Examples)

This guide focuses on patterns that frequently appear in senior React and frontend architecture interviews.

## 1) Container and Presentational Pattern

When to use:

- Keep UI components simple and reusable.
- Isolate data fetching and stateful logic.

### Example (React)

```tsx
import { useEffect, useState } from 'react';

type User = { id: string; name: string };

function UserListView({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return <UserListView users={users} />;
}
```

Interview talking point:

- This improves testability by separating fetching logic from rendering logic.

## 2) Custom Hook Pattern

When to use:

- Reuse stateful behavior across components.
- Encapsulate side effects and async logic.

### Example (React)

```tsx
import { useEffect, useState } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (active) setData(json);
      })
      .catch(err => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
}
```

Interview talking point:

- Explain cleanup handling to avoid state updates after unmount.

## 3) Compound Components Pattern

When to use:

- Build flexible APIs for complex UI widgets.
- Let consumers compose subcomponents declaratively.

### Example (React)

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type AccordionContextValue = {
  openIndex: number | null;
  toggle: (index: number) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used inside Accordion.Root');
  return ctx;
}

function Root({ children }: { children: ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) => setOpenIndex(prev => (prev === index ? null : index));

  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}

function Item({ index, children }: { index: number; children: ReactNode }) {
  return <div data-index={index}>{children}</div>;
}

function Trigger({ index, children }: { index: number; children: ReactNode }) {
  const { toggle } = useAccordionContext();
  return <button onClick={() => toggle(index)}>{children}</button>;
}

function Content({ index, children }: { index: number; children: ReactNode }) {
  const { openIndex } = useAccordionContext();
  if (openIndex !== index) return null;
  return <div>{children}</div>;
}

export const Accordion = { Root, Item, Trigger, Content };
```

Interview talking point:

- Great for design systems where ergonomic component APIs matter.

## 4) Strategy Pattern

When to use:

- Switch algorithms or behavior at runtime without conditional sprawl.

### Example (TypeScript)

```ts
type DiscountStrategy = (amount: number) => number;

const regularDiscount: DiscountStrategy = amount => amount;
const premiumDiscount: DiscountStrategy = amount => amount * 0.9;
const vipDiscount: DiscountStrategy = amount => amount * 0.8;

function calculateTotal(amount: number, strategy: DiscountStrategy) {
  return strategy(amount);
}

const total = calculateTotal(100, premiumDiscount); // 90
```

Interview talking point:

- Show how this keeps business rules open for extension and closed for modification.

## 5) Factory Pattern

When to use:

- Create objects or services without exposing creation logic.

### Example (TypeScript)

```ts
type Logger = { log: (msg: string) => void };

function createLogger(env: 'dev' | 'prod'): Logger {
  if (env === 'dev') {
    return { log: msg => console.log('[DEV]', msg) };
  }

  return { log: msg => {/* send to external sink */} };
}

const logger = createLogger('dev');
logger.log('Application started');
```

Interview talking point:

- Useful for environment-based setup and dependency injection boundaries.

## 6) Adapter Pattern

When to use:

- Integrate old and new APIs during migration.
- Normalize backend response shapes.

### Example (TypeScript)

```ts
type LegacyUser = { user_id: string; full_name: string };
type User = { id: string; name: string };

function adaptLegacyUser(input: LegacyUser): User {
  return {
    id: input.user_id,
    name: input.full_name,
  };
}
```

Interview talking point:

- This pattern is especially valuable in Angular to React coexistence phases.

## 7) Observer / Pub-Sub Pattern

When to use:

- Loosely couple independently deployed modules.
- Share cross-cutting events in micro-frontends.

### Example (TypeScript)

```ts
type Handler<T> = (payload: T) => void;

class EventBus {
  private handlers = new Map<string, Set<Handler<unknown>>>();

  subscribe<T>(event: string, handler: Handler<T>) {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as Handler<unknown>);
    this.handlers.set(event, set);

    return () => {
      set.delete(handler as Handler<unknown>);
    };
  }

  publish<T>(event: string, payload: T) {
    const set = this.handlers.get(event);
    if (!set) return;
    set.forEach(handler => handler(payload));
  }
}

const bus = new EventBus();
const unsubscribe = bus.subscribe<{ locale: string }>('locale.changed', payload => {
  console.log('New locale', payload.locale);
});

bus.publish('locale.changed', { locale: 'en-GB' });
unsubscribe();
```

Interview talking point:

- Mention event naming conventions and schema validation to avoid event chaos.

## 8) Facade Pattern

When to use:

- Hide complexity behind a simple API.
- Keep UI layer clean from multi-service orchestration.

### Example (TypeScript)

```ts
type DashboardData = {
  user: { id: string; name: string };
  permissions: string[];
};

async function getDashboardData(userId: string): Promise<DashboardData> {
  const [user, permissions] = await Promise.all([
    fetch(`/api/users/${userId}`).then(res => res.json()),
    fetch(`/api/users/${userId}/permissions`).then(res => res.json()),
  ]);

  return { user, permissions };
}
```

Interview talking point:

- Helps preserve a thin component layer with clear service contracts.

## 9) Higher-Order Component Pattern (Legacy but still asked)

When to use:

- Reuse cross-cutting behavior in codebases that already use HOCs.

### Example (React)

```tsx
import { ComponentType } from 'react';

function withLoading<P>(Component: ComponentType<P>) {
  return function Wrapped(props: P & { loading: boolean }) {
    if (props.loading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}
```

Interview talking point:

- Explain that custom hooks are generally preferred in modern React, but HOCs are common in older enterprise code.

## 10) Singleton Pattern (Use Carefully)

When to use:

- Shared infrastructure services such as logging or analytics.

### Example (TypeScript)

```ts
class Analytics {
  private static instance: Analytics;

  static getInstance() {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  track(event: string) {
    console.log('Track', event);
  }
}

Analytics.getInstance().track('page.view');
```

Interview talking point:

- Call out drawbacks: hidden dependencies and harder test isolation.

## Pattern Selection Cheat Sheet

- Need UI flexibility and composability: Compound Components
- Need reusable side effects: Custom Hooks
- Need migration compatibility: Adapter
- Need algorithm switches: Strategy
- Need simple API over complexity: Facade
- Need loose coupling across MFEs: Observer/Pub-Sub
- Need environment-based object creation: Factory

## Common Interview Mistakes

- Naming patterns without showing trade-offs.
- Using Singleton for broad app state.
- Overusing Pub-Sub instead of clear data flow.
- Forcing HOCs in new React code where hooks are cleaner.

## How to answer pattern questions like a senior engineer

Use this sequence:

1. State the problem context.
2. Name the pattern and why it fits.
3. Show a short code sketch.
4. Mention one trade-off.
5. Mention how you test or govern it in production.
