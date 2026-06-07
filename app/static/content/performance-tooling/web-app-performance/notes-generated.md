# Web App Performance Optimization

## Interview Lens

Performance questions test whether you can **measure before you optimize**, target the right bottleneck, and explain trade-offs. Interviewers want specificity — not "use `useMemo`", but *when* and *why*.

---

## 1. Bundle Optimizations

- **Minify JS/CSS** — Terser (JS) and cssnano (CSS) strip whitespace, comments, and shorten variable names. Non-negotiable in production.
- **Code Splitting** — Split the bundle into chunks using `dynamic import()`, `React.lazy`, or route-based splitting (Next.js). Only the current view's chunk is loaded, improving initial load and LCP.
- **Tree Shaking** — Dead code elimination at build time (Webpack, Vite, Rollup). Only used exports survive. Requires ES modules (`import`/`export`) — CommonJS (`require`) breaks tree shaking.
- **Bundle Analyzer** — Visualise what's in your bundle. Use `webpack-bundle-analyzer` or Vite's `rollup-plugin-visualizer` to find unexpectedly large dependencies before optimising anything else.

---

## 2. Asset Delivery & CDN

- **CDN** — Serve static assets (JS, CSS, images, fonts) from a CDN edge node close to the user.
- **Compression** — Brotli first (30–40% smaller than Gzip), Gzip as fallback.
- **`<link rel="preload">`** — Priority-load critical assets (hero font, LCP image, above-the-fold CSS) before the parser would normally discover them.
- **`<link rel="prefetch">`** — Low-priority fetch of likely-next assets during idle time (e.g., the next route's chunk).
- **`fetchpriority="high"`** — Boost fetch priority of the LCP image without blocking the parser.

---

## 3. Image Optimization

| Technique | What it does |
|---|---|
| `loading="lazy"` | Defer offscreen images until they approach the viewport |
| `srcset` + `sizes` | Serve resolution-appropriate image per device |
| Explicit `width`/`height` | Prevent layout shifts (reduces CLS) |
| WebP / AVIF | Smaller file sizes vs JPEG/PNG with equivalent quality |
| Preload hero image | `<link rel="preload" as="image">` for the LCP image |

---

## 4. Caching Strategy

- **HTTP cache headers** — `Cache-Control: max-age=31536000, immutable` for content-hashed assets. `no-store` or short TTL for HTML.
- **Service Workers** — Cache assets and API responses for offline support and fast repeat visits.
- **React Query / SWR** — Stale-while-revalidate: return cached data immediately, fetch fresh data in background. Handles deduplication, background refetching, and cancellation.

---

## 5. Rendering Strategy Trade-offs

| Strategy | First Load | SEO | Dynamic Data | When to use |
|---|---|---|---|---|
| **SSG** | Fastest | ✓ | ✗ | Marketing pages, docs |
| **SSR** | Fast | ✓ | ✓ | E-commerce, dashboards with auth |
| **CSR** | Slowest | ✗ | ✓ | Highly interactive, behind auth |
| **ISR** | Fast | ✓ | ✓ (staleable) | Blog, product pages |

**SSR trade-off**: Fresh data and SEO at the cost of server compute and TTFB. Hydration mismatch is the most common bug.

---

## 6. React-Specific Optimizations

### `useMemo` and `useCallback`

```jsx
// useMemo — memoize expensive computation
const sorted = useMemo(() => expensiveSort(list), [list]);

// useCallback — stable function reference for child props
const handleSubmit = useCallback((data) => submit(data), [submit]);
```

**When they actually help**: only when the child is wrapped in `React.memo` *and* the prop would change on every render. Without `React.memo`, memoizing props is free CPU waste.

### `React.memo`

```jsx
const Row = React.memo(({ item, onClick }) => <tr>...</tr>);
```

Skips re-render if props are shallowly equal. Combine with `useCallback` for function props.

### React Compiler (React 19+)

Automatically memoizes components and hooks at the compiler level — reduces the need for manual `useMemo`/`useCallback`. Still experimental; measure before relying on it.

### `AbortController`

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(setData);
  return () => controller.abort(); // cancel on unmount or dep change
}, [url]);
```

Prevents memory leaks and wasted work from in-flight fetches after unmount.

---

## 7. Virtualization

Render only visible rows in long lists using `react-window` or `@tanstack/virtual`.

```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} itemCount={10000} itemSize={40} width="100%">
  {({ index, style }) => <Row style={style} item={data[index]} />}
</FixedSizeList>
```

**When to use**: lists > ~200 items where DOM node count causes jank. Confirm with React Profiler first.

---

## 8. Debounce vs Throttle

```js
// Debounce — fires after a pause in events (search input, resize)
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle — fires at most once per interval (scroll, mousemove)
function throttle(fn, limit) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn(...args); }
  };
}
```

| | Debounce | Throttle |
|---|---|---|
| Fires | After inactivity | At a regular rate |
| Use case | Search input, form validation | Scroll handlers, resize events |

---

## 9. Profiling & Diagnostics

### React Profiler

- Record renders to see which components re-render, how long each commit takes, and why they rendered.
- A **commit** = one batch of DOM updates. Look for commits that take > 16ms (one frame at 60fps).
- Filter noise with the "Hide renders below X ms" setting.

### React 19 Performance Tracks

- DevTools shows blocking time per hook/component, not just per component render.

### Browser Performance Tab

- Identify LCP, TBT, FID/INP, and CLS directly.
- Look for long tasks (> 50ms) on the main thread.
- Check for layout thrashing (forced reflows inside JS loops).

### `depcheck`

```bash
npx depcheck
```

Finds unused npm packages. Smaller `node_modules` = smaller bundle.

---

## 10. Systematic Optimization Approach

> Measure → Identify bottleneck → Fix one thing → Measure again

1. **Baseline** — Record LCP, TBT, INP before touching anything.
2. **Bundle first** — Run bundle analyzer. Large dependencies (e.g., `moment`, full `lodash`) are often the quickest wins.
3. **Network second** — CDN, compression, preload hints.
4. **Render last** — Profiler-driven `React.memo`, virtualization, code splitting.
5. **Avoid premature optimization** — `useMemo`/`useCallback` have overhead. Add them after the Profiler proves a re-render is expensive.

---

## Core Web Vitals Reference

| Metric | Measures | Good threshold |
|---|---|---|
| **LCP** | Largest content paint (load speed) | < 2.5s |
| **INP** | Interaction responsiveness (replaces FID) | < 200ms |
| **CLS** | Layout shift (visual stability) | < 0.1 |
| **TBT** | Main thread blocking (correlated with INP) | < 200ms |