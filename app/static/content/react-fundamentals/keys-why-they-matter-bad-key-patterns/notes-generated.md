# React Keys: Why They Matter & Bad Key Patterns

## Why Keys Matter
- Keys help React identify which items in a list have changed, been added, or removed.
- They enable efficient reconciliation (diffing), minimizing DOM operations and preserving component state.
- Without stable keys, React may unnecessarily re-render or lose state in child components.

## Good Key Patterns
- Use a unique, stable identifier for each item (e.g., a database ID).
- Keys should not change between renders if the item’s identity hasn’t changed.

## Bad Key Patterns
- Using array indexes as keys (e.g., `key={index}`) is problematic if the list can be reordered, filtered, or items can be inserted/removed.
- Using non-unique or unstable values as keys (e.g., random numbers, object references that change).

## Consequences of Bad Keys
- Loss of component state (e.g., input values reset unexpectedly).
- Unnecessary re-renders or DOM operations.
- Bugs that are hard to debug, especially in dynamic lists.

## Example

**Good:**
```jsx
{items.map(item => <li key={item.id}>{item.text}</li>)}
```
**Bad:**
```jsx
{items.map((item, idx) => <li key={idx}>{item.text}</li>)}
```

## Summary
- Always use stable, unique keys for list items.
- Avoid using array indexes or unstable values as keys.
