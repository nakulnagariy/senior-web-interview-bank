import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';

// useLayoutEffect: measure width before paint
export function MeasureWidth() {
  const ref = useRef();
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  return <div ref={ref}>Width: {width}</div>;
}

// useEffect: measurement happens after paint (may cause flash)
export function MeasureWidthEffect() {
  const ref = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  return <div ref={ref}>Width: {width}</div>;
}