# useImperativeHandle & forwardRef

## What is forwardRef?
- `forwardRef` is a React API that lets you pass a ref from a parent component to a child component.
- Useful for exposing a child’s DOM node or imperative methods to the parent.

## What is useImperativeHandle?
- `useImperativeHandle` is a React hook used with `forwardRef` to customize the instance value exposed to parent refs.
- Lets you control what methods or properties the parent can access, instead of exposing the entire child component or DOM node.

## Why Use Them?
- Encapsulate imperative logic (e.g., focus, scroll, animations) inside a component, but allow parent components to trigger it.
- Hide internal details and expose only a controlled API.

## Example

```js
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => (inputRef.current.value = '')
  }));
  return <input ref={inputRef} />;
});

// Usage:
const ref = useRef();
<FancyInput ref={ref} />
ref.current.focus();
ref.current.clear();
```

### Summary
- Use forwardRef to pass refs through components.
- Use useImperativeHandle to expose a custom, controlled API to parent components.