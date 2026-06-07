# React Synthetic Events & Event Pooling

## What are Synthetic Events?
- React wraps native browser events in a cross-browser wrapper called a SyntheticEvent.
- Synthetic events normalize event properties and behavior across browsers, providing a consistent API.

## Event Pooling
- For performance, React (before v17) reused SyntheticEvent objects via pooling.
- After an event handler runs, the SyntheticEvent's properties are cleared and the object is reused for future events.
- Accessing event properties asynchronously (e.g., inside a setTimeout or Promise) would return `null` or undefined values.

## How to Persist Events
- To access event properties asynchronously, call `event.persist()` to remove the event from the pool.
- In React 17+, event pooling was removed, but understanding it is important for legacy code and interviews.

## Example

```jsx
function MyButton() {
  function handleClick(e) {
    setTimeout(() => {
      // e.type may be null unless e.persist() was called (React <17)
      alert(e.type);
    }, 100);
  }
  return <button onClick={handleClick}>Click me</button>;
}
```

### Summary
- Synthetic events provide a consistent API.
- Event pooling can cause bugs if event properties are accessed asynchronously.
- Use event.persist() in React <17 if you need to access event properties later.