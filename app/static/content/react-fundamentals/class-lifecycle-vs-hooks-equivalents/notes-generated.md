# React Class Lifecycle Methods vs Hooks Equivalents

## Class Lifecycle Methods
- **constructor:** Initialization logic, state setup, binding methods.
- **componentDidMount:** Runs once after the component mounts (good for data fetching, subscriptions).
- **componentDidUpdate:** Runs after every update (can compare prev/next props/state).
- **componentWillUnmount:** Runs before the component is removed (cleanup, unsubscribe).
- **shouldComponentUpdate:** Controls whether a re-render should occur.
- **getDerivedStateFromProps:** Sync state with props before rendering.
- **getSnapshotBeforeUpdate:** Capture info from the DOM before it changes.

## Hooks Equivalents
- **useState:** State management (replaces constructor state).
- **useEffect:** Handles side effects. By changing the dependency array, you can mimic mount, update, and unmount behaviors.
  - `useEffect(fn, [])` → componentDidMount
  - `useEffect(fn, [deps])` → componentDidUpdate (for those deps)
  - Cleanup function in `useEffect` → componentWillUnmount
- **useMemo/useCallback:** Memoization, similar to optimizing with shouldComponentUpdate.
- **useRef:** Accessing DOM nodes or persisting values across renders.
- **Custom hooks:** Encapsulate reusable logic.

## Example Mapping

| Class Method              | Hooks Equivalent                |
|--------------------------|---------------------------------|
| constructor              | useState                        |
| componentDidMount        | useEffect(() => {...}, [])      |
| componentDidUpdate       | useEffect(() => {...}, [deps])  |
| componentWillUnmount     | useEffect(() => { return ... }, []) |
| shouldComponentUpdate    | React.memo, useMemo, useCallback|
| getDerivedStateFromProps | useEffect/useMemo (rarely)      |
| getSnapshotBeforeUpdate  | useLayoutEffect                 |

## Summary
- Hooks provide more granular and flexible control over side effects and state.
- Understanding the mapping helps migrate class components to function components.