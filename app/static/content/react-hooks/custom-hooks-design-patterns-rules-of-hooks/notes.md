# Custom Hooks: Design Patterns & Rules of Hooks

## What are Custom Hooks?
- Custom hooks are reusable functions that encapsulate logic using React hooks.
- They allow sharing stateful logic between components without duplicating code.

## Design Patterns
- **Encapsulation:** Hide complex logic (e.g., data fetching, subscriptions) inside a hook.
- **Composition:** Combine multiple hooks to build more powerful abstractions.
- **Parameterization:** Accept arguments to customize behavior (e.g., URL for fetching).
- **Return Values:** Return state, setters, and utility functions for use in components.

## Rules of Hooks
- **Only call hooks at the top level:** Never call hooks inside loops, conditions, or nested functions.
- **Only call hooks from React functions:** Hooks must be called from function components or other custom hooks, not from regular JS functions or class components.
- **Naming convention:** Custom hooks must start with "use" (e.g., useFetch, useForm).

## Example

```js
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
}
```

### Summary
- Custom hooks enable code reuse and abstraction.
- Follow the rules of hooks to avoid bugs and ensure correct behavior.