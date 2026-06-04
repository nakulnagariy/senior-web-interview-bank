# React Performance Revision Sheet

## Core Rule

Measure first. Optimize one bottleneck at a time. Re-measure after every change.

---

## What To Measure

- LCP: main content render speed
- INP: interaction responsiveness
- CLS: layout stability
- TTFB: server response delay
- Bundle size: shipped JS and CSS cost
- Hydration cost: client work after HTML arrives

---

## Best Tools

- Lighthouse for page-level audits
- Browser Performance tab for timeline and main-thread work
- React DevTools Profiler for rerenders and slow commits
- Bundle analyzer for heavy chunks and large dependencies
- Network tab for waterfalls, caching, and asset payloads
- React 19 performance tracks for Scheduler, Components, and Server timelines

---

## Biggest React Performance Levers

### 1. Ship less JavaScript

- Production build only
- Minify JS and CSS
- Enable Brotli or Gzip
- Remove unused packages
- Verify tree shaking works

### 2. Code split aggressively but intentionally

- Split by route
- Lazy-load heavy features, editors, charts, maps, modals
- Keep the initial bundle focused on above-the-fold content

```jsx
const AdminPage = lazy(() => import('./AdminPage'));
```

### 3. Optimize assets and delivery

- Put static assets behind a CDN
- Cache hashed assets with long immutable caching
- Preconnect critical origins
- Preload only truly critical assets
- Prefetch by user intent when useful

### 4. Optimize images

- Prefer AVIF or WebP when possible
- Use `srcSet` and `sizes`
- Always set width and height
- Lazy-load below-the-fold images
- Use `fetchpriority="high"` only for the real LCP image

### 5. Avoid data waterfalls

- Fetch in parallel where possible
- Use server loaders or SSR when appropriate
- Cache repeated data requests
- Prefetch likely next-route data

### 6. Manage client data properly

- Prefer TanStack Query for real apps
- Use stale times intentionally
- Deduplicate and cache requests
- Cancel stale requests with `AbortController`

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal });

  return () => controller.abort();
}, []);
```

### 7. Reduce unnecessary rerenders

- Keep state local
- Split large components
- Avoid effect-driven update loops
- Stabilize props passed to memoized children
- Use `memo`, `useMemo`, and `useCallback` only when profiling shows they help

### 8. Use React concurrency features where useful

- `startTransition` for non-urgent updates
- `useDeferredValue` for laggy filtered lists
- React Compiler can reduce the need for manual memoization in supported setups

### 9. Virtualize large lists

- Use `react-window`, `react-virtualized`, or `@tanstack/react-virtual`
- Render only visible rows plus a small buffer

---

## Fast Interview Answers

### Which React DevTools tab is used to analyze rerenders?

Profiler.

### What is a commit in the React Profiler?

A completed render pass whose changes were committed to the DOM.

### How do you hide insignificant rerenders in the Profiler?

Hide commits below a duration threshold and record a narrow interaction instead of the entire session.

### What are React 19 performance tracks?

React-specific browser Performance timeline tracks that show Scheduler work, component render/effect durations, and server-related work.

### How does code splitting improve LCP?

It reduces the JavaScript needed for the initial screen, so the browser downloads and executes less before rendering visible content.

### How do you find the heaviest components?

Run a production build with a bundle analyzer and inspect the largest chunks first.

---

## Senior-Level Sound Bites

- Do not memoize blindly. Fix architecture and data flow first.
- The slow app is often a bundle, image, or network problem before it is a React hook problem.
- SSR improves first paint, but hydration cost still matters.
- The best optimization is the one you can measure and defend.
- Optimize from the user journey, not from code aesthetics.