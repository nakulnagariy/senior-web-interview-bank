# useReducer: When to Choose Over useState

## What is useReducer?
- `useReducer` is a React hook for managing state with a reducer function, similar to Redux.
- It takes a reducer, initial state, and returns `[state, dispatch]`.

## When to Use useReducer
- Prefer `useReducer` when:
  - State logic is complex (multiple sub-values, interdependent updates).
  - State transitions depend on previous state or involve multiple actions.
  - You want to centralize state updates and make them predictable.
  - You need to share dispatch logic across deeply nested components (with context).

- Prefer `useState` when:
  - State is simple (single value or independent values).
  - Updates are straightforward and not interdependent.

## Example

```js
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
```

### Summary
- Use useReducer for complex state logic, multiple actions, or when you want predictable state transitions.
- Use useState for simple, independent state values.