// Example: Dynamically loading a remote micro-frontend with Module Federation

// Host app's webpack.config.js
/*
plugins: [
  new ModuleFederationPlugin({
    remotes: {
      ProfileApp: 'profileApp@https://profile.example.com/remoteEntry.js'
    },
    shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
  })
]
*/

// In your host app code
import React, { Suspense } from 'react';

const Profile = React.lazy(() => import('ProfileApp/Profile'));

export function App() {
  return (
    <Suspense fallback="Loading Profile...">
      <Profile />
    </Suspense>
  );
}