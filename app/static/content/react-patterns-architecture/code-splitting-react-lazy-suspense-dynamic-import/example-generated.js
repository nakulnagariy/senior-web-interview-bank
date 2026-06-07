import React, { Suspense } from 'react';

// Code splitting with React.lazy and Suspense
const LazyComponent = React.lazy(() => import('./MyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// Dynamic import for non-component code
async function loadUtils() {
  const utils = await import('./utils');
  utils.doSomething();
}