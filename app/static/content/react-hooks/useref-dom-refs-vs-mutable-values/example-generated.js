import React, { useRef, useEffect } from 'react';

// DOM ref example
export function FocusInput() {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <input ref={inputRef} />;
}

// Mutable value example
export function TimerComponent() {
  const timerId = useRef();
  useEffect(() => {
    timerId.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
    return () => clearInterval(timerId.current);
  }, []);
  return <div>Timer running...</div>;
}

// Both in one component
export function CombinedExample() {
  const inputRef = useRef();
  const renderCount = useRef(0);
  useEffect(() => {
    inputRef.current.focus();
    renderCount.current += 1;
  });
  return (
    <div>
      <input ref={inputRef} />
      <div>Renders: {renderCount.current}</div>
    </div>
  );
}