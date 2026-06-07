import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// Custom input with imperative API
export const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => (inputRef.current.value = '')
  }));
  return <input ref={inputRef} {...props} />;
});

// Usage example
export function ParentComponent() {
  const inputRef = useRef();
  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </div>
  );
}