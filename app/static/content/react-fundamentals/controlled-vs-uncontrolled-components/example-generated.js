// Controlled Input Example
import React, { useState, useRef } from 'react';

export function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Uncontrolled Input Example
export function UncontrolledInput() {
  const inputRef = useRef();
  return <input ref={inputRef} />;
}

// Usage:
// <ControlledInput />
// <UncontrolledInput />