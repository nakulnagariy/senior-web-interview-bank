import { useState, useEffect } from 'react';

// Custom hook: useFetch
export function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
}

// Custom hook: usePrevious
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Usage example:
// const data = useFetch('/api/items');
// const prevValue = usePrevious(currentValue);