# Error Boundaries in React: Class Only & Placement Strategy

## What are Error Boundaries?
- Error boundaries are React components that catch JavaScript errors in their child component tree during rendering, lifecycle methods, and constructors.
- They display a fallback UI instead of crashing the whole app.

## Class Only
- Error boundaries can only be implemented using class components.
- They require `componentDidCatch(error, info)` and `static getDerivedStateFromError(error)` lifecycle methods.
- There is no hook-based equivalent (as of React 18).

## Placement Strategy
- Error boundaries only catch errors in their children, not in themselves or their parents.
- Placement matters: wrap only the parts of the UI you want to isolate from errors.
- Common strategies:
  - Wrap the entire app for global fallback.
  - Wrap specific sections (e.g., widgets, routes) for localized recovery.

## Example

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Log error, send to monitoring, etc.
  }
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```
### Summary
- Error boundaries are class-only.
- Placement determines which errors are caught and how much UI is replaced.
- Use multiple boundaries for granular error handling.