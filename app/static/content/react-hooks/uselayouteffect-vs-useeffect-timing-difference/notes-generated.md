# useLayoutEffect vs useEffect: Timing Difference

## useEffect
- Runs **after** the browser has painted (committed) the DOM updates.
- Non-blocking: does not delay the browser's paint.
- Good for side effects that don't need to block the UI (data fetching, subscriptions, logging).

## useLayoutEffect
- Runs **synchronously after all DOM mutations but before the browser paints**.
- Blocking: the browser waits for all `useLayoutEffect` callbacks to finish before painting.
- Good for reading layout, measuring DOM nodes, or synchronously triggering visual updates (e.g., animations, scroll position).

## Timing Difference
- `useLayoutEffect` runs **before** the browser paints, so changes are visible immediately.
- `useEffect` runs **after** paint, so the user may see a flash of unstyled or unmeasured content.

## Example Use Cases
- **useLayoutEffect:** Measuring element size, synchronizing scroll position, fixing layout glitches.
- **useEffect:** Fetching data, setting up subscriptions, logging.

## Example

```js
useLayoutEffect(() => {
  // Read or write DOM here
}, []);

useEffect(() => {
  // Non-blocking side effects here
}, []);
```

### Summary
- Use useLayoutEffect for DOM reads/writes that must happen before paint.
- Use useEffect for side effects that can happen after paint.

