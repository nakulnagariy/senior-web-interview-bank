import React, { useState, useTransition, useDeferredValue } from 'react';

// useTransition example
export function SearchListTransition({ items }) {
  const [input, setInput] = useState('');
  const [filtered, setFiltered] = useState(items);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    setInput(value);
    startTransition(() => {
      setFiltered(items.filter(item => item.includes(value)));
    });
  }

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <span>Loading...</span>}
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </>
  );
}

// useDeferredValue example
export function SearchListDeferred({ items }) {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);
  const filtered = items.filter(item => item.includes(deferredInput));

  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </>
  );
}