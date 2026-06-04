# React App Performance Best Practices

This guide is structured for interview prep and real-world performance work. The main rule is simple:

**Measure first, optimize one bottleneck at a time, and verify the impact after every change.**

If you try to optimize the whole app at once, you usually create noise instead of speed.

---

## 1. Performance Mindset

### Optimize one area at a time

This is the safest and most effective way to improve a React app.

- You can isolate the impact of a change.
- You can tell whether a fix improved LCP, INP, TTI, or render time.
- You avoid adding memoization, caching, or complexity that does not pay for itself.
- You can identify the actual heavy route, component, query, image, or dependency instead of guessing.

### Recommended workflow

1. Measure a real user flow.
2. Identify the slowest route, component, request, or asset.
3. Fix one clear bottleneck.
4. Re-measure the same flow.
5. Keep the change only if the result is better.

### Always test from the user's perspective

- Use a production build, not the dev build.
- Test on slow 4G or throttled network.
- Test with CPU throttling when needed.
- Check with cache disabled during diagnosis.
- Validate again with normal cache behavior to confirm real-world gains.

---

## 2. What To Measure First

### Core Web Vitals and runtime metrics

- **LCP**: how quickly the main visible content appears.
- **INP**: how responsive the app feels after user interaction.
- **CLS**: whether layout shifts while loading.
- **TTFB**: whether the server is slow before the page even starts rendering.
- **Bundle size**: how much JavaScript and CSS the user must download.
- **Hydration/render cost**: how expensive React work is after the HTML arrives.

### Best tools

- Browser Performance tab
- React DevTools Profiler
- Lighthouse
- Bundle analyzer
- Web Vitals in production analytics
- Network panel for waterfalls, caching, and image payloads

---

## 3. Bundle Optimization

Bundle size is often the first easy win. Shipping less JavaScript improves parse time, execute time, and time to interactivity.

### 3.1 Use production builds, minification, and compression

- Minify JavaScript.
- Minify CSS.
- Serve Brotli or Gzip compressed assets.
- Make sure source maps are not accidentally shipped as public production assets unless you explicitly want that.

### 3.2 Enable code splitting

Do not send every route and every heavy component in the initial bundle.

Use route-level and component-level splitting.

```jsx
import { lazy, Suspense } from 'react';

const AdminPage = lazy(() => import('./AdminPage'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPage />
    </Suspense>
  );
}
```

Use code splitting for:

- admin areas
- settings pages
- rarely used modals
- charting libraries
- rich text editors
- maps and large third-party SDKs

### 3.3 Tree shaking and dead-code removal

Tree shaking works best when:

- you use ES modules
- your imports are specific
- packages are marked as side-effect free when true
- unused utility files and stale feature flags are removed

Example:

```js
// Better
import debounce from 'lodash/debounce';

// Riskier for bundle size depending on tooling and package structure
import { debounce } from 'lodash';
```

### 3.4 Remove unused dependencies

Unused packages increase install size, bundle size, maintenance burden, and audit noise.

Useful commands:

```bash
npx depcheck
npm ls --depth=0
```

What to remove first:

- old UI libraries
- duplicate utility libraries
- unused icon packs
- date libraries used in only one place
- packages imported only in abandoned files

### 3.5 Analyze the bundle before guessing

Use a bundle analyzer to see what is actually large.

Questions it answers:

- Which route or component owns the largest chunk?
- Which third-party libraries dominate the bundle?
- Did code splitting actually isolate the heavy area?
- What is the gzipped and Brotli cost of the shipped code?

Vite example:

```js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [visualizer({ open: true })],
});
```

### 3.6 Avoid shipping development-only work

- Do not benchmark performance with the React dev build.
- Remove debug logs, mock data, and feature probes from production bundles.
- Confirm the app is not accidentally loading testing utilities in production.

---

## 4. Asset Optimization and CDN Strategy

Even a perfectly memoized React tree can feel slow if assets are large or delivered poorly.

### 4.1 Put static assets behind a CDN

Use a CDN for:

- JavaScript chunks
- CSS files
- images
- fonts
- videos and large media

Benefits:

- lower latency
- edge caching
- faster repeat visits
- less load on the origin server

### 4.2 Cache hashed static assets aggressively

Hashed assets should usually be served with long-lived immutable caching.

Example:

```http
Cache-Control: public, max-age=31536000, immutable
```

For HTML documents, use shorter caching because they control which asset hashes are referenced.

### 4.3 Preconnect and DNS-prefetch critical origins

If the page depends on a CDN, API, or image host, reduce connection setup delay.

```html
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### 4.4 Preload only truly critical resources

Preload helps when you are certain a resource is needed immediately.

```html
<link rel="preload" as="image" href="/hero.avif">
<link rel="preload" as="font" href="/fonts/brand.woff2" type="font/woff2" crossorigin>
```

Do not preload too many assets or you just create network contention.

### 4.5 Use intent-based prefetching

Preload or prefetch code when the user is likely to need it soon, not on every page load.

Examples:

- prefetch the next route on hover
- preload a modal's code when its trigger enters the viewport
- prefetch product details after the user opens the product list

```jsx
function ProductLink() {
  return (
    <a
      href="/product/42"
      onMouseEnter={() => {
        import('./ProductPage');
      }}
    >
      View product
    </a>
  );
}
```

Framework routers often provide better built-in route prefetching. Prefer those features when available.

---

## 5. SSR, Streaming, and Server-side Work

For content-heavy or SEO-sensitive apps, client-only rendering can delay the first useful paint.

### 5.1 Use SSR or SSG where it helps

Prefer:

- **SSR** for personalized or frequently changing pages
- **SSG** for static marketing pages and docs
- **Streaming SSR** when you want the shell and above-the-fold content to appear earlier

Benefits:

- faster initial render
- better SEO
- better perceived performance

### 5.2 Move appropriate logic to the server

Server functions, server components, or backend APIs can reduce client JavaScript and avoid shipping logic that does not need to run in the browser.

Good candidates:

- data joins and aggregation
- markdown or rich text processing
- permission checks
- expensive formatting or transformation
- large library usage that the client does not need

### 5.3 Be careful with hydration cost

SSR is not enough by itself. If the page hydrates a huge interactive tree, the user still pays the JavaScript cost later.

Reduce hydration cost by:

- splitting interactive islands
- delaying non-critical widgets
- avoiding global state updates on mount
- keeping above-the-fold content simple

---

## 6. Data Fetching and Caching

Many slow React apps are actually slow data apps.

### 6.1 Use HTTP caching correctly

For API responses, decide whether they should be:

- browser cached
- edge cached
- revalidated in the background
- always fresh

Use proper `Cache-Control`, `ETag`, or stale-while-revalidate semantics where appropriate.

### 6.2 Use a query library for client data management

For non-trivial apps, prefer TanStack Query instead of hand-rolled `useEffect` fetching everywhere.

Why it helps:

- request deduplication
- background refetching
- stale/fresh control
- retry behavior
- cache reuse across screens
- loading and error handling become consistent

```tsx
import { useQuery } from '@tanstack/react-query';

function UserPanel({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    staleTime: 60_000,
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

### 6.3 Cancel stale requests

When a component unmounts or a search term changes quickly, cancel the old request so stale responses do not overwrite new state.

```jsx
import { useEffect, useState } from 'react';

function Search({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, [query]);

  return <ResultsList items={results} />;
}
```

### 6.4 Avoid waterfalls

Bad pattern:

- parent loads
- then child loads
- then nested child loads

Better pattern:

- fetch in parallel
- prefetch likely next screens
- aggregate backend data when the UI always needs it together

---

## 7. React Rendering Optimizations

React performance problems are often caused by too much work per render or too many unnecessary renders.

### 7.1 Fix architecture before adding memoization

First ask:

- Is state too high in the tree?
- Are we re-rendering a whole page for a tiny local interaction?
- Are we passing fresh objects and functions into memoized children?
- Are effects causing cascading updates?

The best optimization is often:

- move state closer to where it is used
- split a large component
- reduce props churn
- remove unnecessary effects

### 7.2 Use `memo`, `useMemo`, and `useCallback` selectively

These are tools, not defaults.

Use them when:

- a child is slow and receives stable props
- a calculation is expensive
- referential equality matters for a memoized child or hook dependency

Avoid them when:

- the work is cheap
- dependencies change every render
- you have not measured an actual bottleneck

```jsx
import { memo, useCallback, useMemo } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {
  return items.map((item) => (
    <button key={item.id} onClick={() => onSelect(item.id)}>
      {item.label}
    </button>
  ));
});

export default function Parent({ rawItems, filter }) {
  const visibleItems = useMemo(() => {
    return rawItems.filter((item) => item.label.includes(filter));
  }, [rawItems, filter]);

  const handleSelect = useCallback((id) => {
    console.log(id);
  }, []);

  return <ExpensiveList items={visibleItems} onSelect={handleSelect} />;
}
```

### 7.3 React Compiler can reduce manual memoization

React Compiler can automatically memoize values and functions in supported setups, which reduces the need for manual `useMemo` and `useCallback` in many cases.

Important caveats:

- It does not remove the need for good component architecture.
- It does not fix wasteful effects or oversized bundles.
- You still need to measure whether a bottleneck is render work, network work, or JavaScript payload.

### 7.4 Use transitions for non-urgent updates

If an update is expensive but not urgent, move it to a transition.

```jsx
import { startTransition, useState } from 'react';

function SearchPage() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  function handleChange(event) {
    const nextValue = event.target.value;
    setInput(nextValue);

    startTransition(() => {
      setQuery(nextValue);
    });
  }

  return <input value={input} onChange={handleChange} />;
}
```

### 7.5 Use `useDeferredValue` for laggy derived UI

When the input should stay responsive but a large result list can update slightly later:

```jsx
import { useDeferredValue, useMemo, useState } from 'react';

function SearchList({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.name.includes(deferredQuery));
  }, [items, deferredQuery]);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsList items={filteredItems} />
    </>
  );
}
```

### 7.6 Remove effect-driven rerender loops

Many performance problems come from effects that:

- set state on every render
- derive state that could be computed during render
- trigger fetches repeatedly because dependencies are unstable

If a value can be derived from props or state, prefer calculating it directly instead of storing it again.

---

## 8. Large Lists and Virtualization

Rendering hundreds or thousands of rows at once is expensive.

### Use virtualization for large collections

Render only the visible items plus a small buffer.

Popular options:

- `react-window`
- `react-virtualized`
- `@tanstack/react-virtual`

```jsx
import { FixedSizeList as List } from 'react-window';

function Row({ index, style, data }) {
  return <div style={style}>{data[index].name}</div>;
}

export default function VirtualizedUsers({ users }) {
  return (
    <List
      height={500}
      itemCount={users.length}
      itemSize={44}
      width={400}
      itemData={users}
    >
      {Row}
    </List>
  );
}
```

Also make sure:

- row keys are stable
- row components do not receive constantly changing props
- expensive cell formatting is memoized or moved out of render

---

## 9. Image Optimization

Images frequently dominate LCP.

### 9.1 Use the right format

Prefer:

- AVIF when supported
- WebP when AVIF is not available
- PNG only when you need lossless transparency
- JPEG for photo-heavy fallbacks
- SVG for simple vector graphics

### 9.2 Use responsive images

Do not send desktop-sized images to mobile devices.

```html
<img
  src="/images/card-800.jpg"
  srcset="/images/card-400.jpg 400w, /images/card-800.jpg 800w, /images/card-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  width="800"
  height="450"
  loading="lazy"
  alt="Product preview"
>
```

### 9.3 Always set width and height

This prevents layout shifts and improves CLS.

### 9.4 Lazy-load non-critical images

Use `loading="lazy"` for below-the-fold images.

### 9.5 Prioritize the LCP image correctly

For the hero image or obvious LCP candidate, consider:

- eager loading
- preload
- `fetchpriority="high"`

```html
<img
  src="/hero.avif"
  width="1440"
  height="810"
  alt="Hero banner"
  fetchpriority="high"
>
```

Use this sparingly. Only the most important image should usually get high priority.

---

## 10. Routing, Interaction, and UI Patterns

### 10.1 Split by route boundaries

Each route is usually a natural code-splitting boundary.

### 10.2 Prefetch likely next screens

If analytics show a common path, prefetch the next route after idle time or user intent.

### 10.3 Delay non-critical widgets

Examples:

- chat widgets
- feedback widgets
- analytics dashboards
- maps
- embedded videos

Load them after the first paint or after user interaction.

### 10.4 Keep context values stable

Large context objects can trigger broad rerenders.

Prefer:

- splitting contexts by concern
- memoizing provider values when needed
- avoiding huge mutable objects in context

```jsx
const value = useMemo(() => ({ user, logout }), [user, logout]);

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

---

## 11. Profiling and Debugging Strategy

### 11.1 Use the bundle analyzer to find the heaviest components

What to look for:

- the largest route chunks
- oversized vendor libraries
- duplicated libraries across chunks
- unexpectedly large local components or utility modules

Interpretation strategy:

1. Run a production build.
2. Open the analyzer output.
3. Find the biggest boxes first.
4. Ask whether they belong in the initial load.
5. Split, remove, or replace them.

### 11.2 Use the React Profiler to understand rerenders

Record a real user flow such as:

- typing in search
- opening a detail page
- switching tabs
- expanding filters

Then inspect:

- which components rerendered
- which commits were slow
- whether props changed meaningfully
- whether updates cascade from effects or context

### 11.3 React Performance tracks in React 19

React 19 exposes React-specific entries in the browser Performance timeline.

The major track groups are:

- **Scheduler**
- **Components**
- **Server**

Scheduler includes priority-based subtracks such as:

- **Blocking**
- **Transition**
- **Suspense**
- **Idle**

For render passes, React can show phases like:

- **Update**
- **Render**
- **Commit**
- **Remaining Effects**

Components tracks help you see:

- render duration flamegraphs
- effect duration flamegraphs
- changed props for a rendered component in development

Server tracks help you inspect:

- server requests
- server component work

This is especially useful when you want to correlate React work with network activity, JavaScript execution, and browser rendering on a single timeline.

### 11.4 Correlate React work with browser work

Do not stop at React-only tools. A slow interaction may be caused by:

- layout/reflow
- large images
- long JavaScript tasks
- third-party scripts
- main-thread blocking unrelated to React

---

## 12. Interview Questions and Direct Answers

### Which React DevTools tab is used to record and analyze component rerenders?

The **Profiler** tab.

### In the React Profiler, what does a commit represent?

A **commit** is a render pass whose result has been applied to the DOM. In that phase React commits the finished work, updates the UI, and runs commit-phase work such as layout effects.

### How can a developer filter out insignificant rerenders in the React Profiler?

Use the Profiler controls to **hide commits below a duration threshold** and focus only on slow commits. Also record a narrow interaction instead of profiling the entire app session, so the noisy fast updates do not dominate the trace.

### What are React 19 performance tracks?

They are React-specific timeline tracks shown in the browser Performance panel that visualize Scheduler work, component render and effect durations, and server-related work. They help correlate React internals with network, JavaScript, and paint activity.

### How does code splitting help improve LCP?

It removes non-critical JavaScript from the initial load so the browser downloads, parses, and executes less code before rendering the main visible content.

### How do I identify the heaviest components using a bundle analyzer?

Generate a production build with a bundle analyzer, inspect the largest boxes in the visualization, and target the heaviest route chunks, vendor packages, or components first.

---

## 13. Practical Optimization Checklist

### Build and delivery

- Use a production build.
- Minify JS and CSS.
- Enable Brotli or Gzip.
- Use route-level code splitting.
- Lazy-load heavy components.
- Verify tree shaking works.
- Remove unused packages.
- Analyze the final bundle regularly.

### Network and assets

- Put static assets behind a CDN.
- Cache hashed assets aggressively.
- Preconnect critical origins.
- Preload only critical assets.
- Prefetch by intent, not blindly.
- Optimize images by format and device size.

### Rendering and React

- Keep state local when possible.
- Split large components.
- Avoid unnecessary effects.
- Use `memo`, `useMemo`, and `useCallback` only where they pay off.
- Use transitions for non-urgent work.
- Use `useDeferredValue` for laggy derived UI.
- Virtualize large lists.
- Stabilize props passed to memoized children.

### Data

- Avoid network waterfalls.
- Use request caching intentionally.
- Use TanStack Query for complex apps.
- Cancel stale requests with `AbortController`.
- Prefetch likely next data.

### Diagnostics

- Use Lighthouse for page-level issues.
- Use the Network panel for waterfalls and payloads.
- Use bundle analyzers to find heavy code.
- Use React Profiler to find expensive rerenders.
- Use React 19 performance tracks to correlate React work with the browser timeline.
- Re-test after every optimization.

---

## 14. Senior-level Takeaway

The best React performance work is rarely about adding memoization everywhere.

It is usually a combination of:

- shipping less JavaScript
- loading less code up front
- caching correctly
- reducing unnecessary renders
- avoiding waterfalls
- optimizing images and lists
- measuring one bottleneck at a time

If you remember only one rule, remember this:

**Find the biggest current bottleneck, fix that exact bottleneck, and verify the result before moving to the next one.**