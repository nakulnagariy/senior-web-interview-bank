// Example: Using React Suspense for incremental rendering

import React, { Suspense } from 'react';

const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// This demonstrates incremental rendering: the UI shows a fallback while HeavyComponent loads.