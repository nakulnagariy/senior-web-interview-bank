import React, { useReducer, useState } from 'react';

// useReducer example: multi-action counter
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

export function CounterReducer() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

// useState example: simple toggle
export function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(v => !v)}>
      {on ? 'On' : 'Off'}
    </button>
  );
}