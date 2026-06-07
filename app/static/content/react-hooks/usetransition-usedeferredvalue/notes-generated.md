# useTransition & useDeferredValue (Concurrent Features)

## What is useTransition?
- `useTransition` is a React hook for marking state updates as "transitions" (non-urgent).
- It returns `[isPending, startTransition]`.
- Transitions allow React to keep the UI responsive by interrupting, delaying, or batching non-urgent updates.
- Example: Typing in a search box updates the input immediately (urgent), but filtering a large list is deferred (transition).

## What is useDeferredValue?
- `useDeferredValue` lets you defer a value until the browser is less busy.
- It returns a "laggy" version of a value that updates less urgently.
- Useful for passing expensive-to-render values to children without blocking urgent updates.

## When to Use
- Use `useTransition` when you want to keep the UI responsive during expensive state updates (e.g., filtering, sorting, rendering large lists).
- Use `useDeferredValue` when you want to defer a derived value (e.g., filtered results) but keep the input responsive.

## Example

```js
const [isPending, startTransition] = useTransition();
const [input, setInput] = useState('');
const deferredInput = useDeferredValue(input);

function handleChange(e) {
  setInput(e.target.value);
  // or: startTransition(() => setExpensiveState(e.target.value));
}
```

### Summary
- Both hooks help manage UI responsiveness in concurrent React.
- `useTransition` is for marking updates as non-urgent.
- `useDeferredValue` is for deferring values, not updates.