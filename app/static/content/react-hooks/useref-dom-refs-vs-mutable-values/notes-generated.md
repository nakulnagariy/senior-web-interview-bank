# useRef: DOM Refs vs Mutable Values

## What is useRef?
- `useRef` is a React hook that returns a mutable ref object: `{ current: ... }`.
- The `.current` property persists for the lifetime of the component.

## DOM Refs
- The most common use: referencing a DOM node.
- Example: `<input ref={inputRef} />` lets you access the DOM node via `inputRef.current`.
- Useful for focusing, measuring, or imperatively interacting with DOM elements.

## Mutable Values
- `useRef` can also store any mutable value that survives re-renders without causing re-renders when changed.
- Example: storing a previous value, a timer ID, or any value you want to persist but not trigger a render.
- Unlike state, updating `.current` does **not** cause a re-render.

## Key Differences
- **DOM refs:** Used as the `ref` prop on elements, React sets `.current` to the DOM node.
- **Mutable values:** Used for storing values across renders, not tied to the DOM.

## Example

```jsx
function Example() {
  const inputRef = useRef(); // DOM ref
  const countRef = useRef(0); // Mutable value

  useEffect(() => {
    inputRef.current.focus();
    countRef.current += 1;
  });

  return <input ref={inputRef} />;
}
```

### Summary
- useRef is for both DOM access and persisting mutable values.
- Changing .current never triggers a re-render.
- Use state for UI, useRef for non-UI, persistent values.