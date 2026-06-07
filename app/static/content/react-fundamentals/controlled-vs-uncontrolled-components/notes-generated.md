# Controlled vs Uncontrolled Components in React

## Controlled Components
- Controlled components are React components where form data is handled by React state.
- The value of the input is set via a prop, and changes are managed with an onChange handler.
- React is always aware of the current value, enabling validation, formatting, and synchronization.

## Uncontrolled Components
- Uncontrolled components store their own state internally in the DOM.
- React accesses the value using refs (e.g., `inputRef.current.value`).
- Useful for simple forms, integrating with non-React code, or when you don't need to track every change.

## Fiber's Role
- React Fiber doesn't change the controlled/uncontrolled distinction, but its incremental rendering and reconciliation can affect how updates propagate.
- Controlled components are more predictable with Fiber, as state updates are scheduled and batched.
- Uncontrolled components may not benefit from Fiber's scheduling, since their state is outside React.

## Key Differences
- Controlled: React state is source of truth, easier to validate and manipulate.
- Uncontrolled: DOM state is source of truth, less React overhead, but harder to manage.

## Example

### Controlled
```jsx
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

### Uncontrolled
```jsx
const inputRef = useRef();
<input ref={inputRef} />
// Later: inputRef.current.value
```
## Summary
- Use controlled components for complex forms, validation, and React-driven UI.
- Use uncontrolled components for simple cases or when integrating with legacy code.