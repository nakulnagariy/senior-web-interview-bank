import React, { createContext, useContext } from 'react';

// Before: Prop drilling
function Grandchild({ user }) {
  return <div>{user.name}</div>;
}
function Child({ user }) {
  return <Grandchild user={user} />;
}
function Parent({ user }) {
  return <Child user={user} />;
}

// After: Context API
const UserContext = createContext();
function GrandchildWithContext() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}
function ChildWithContext() {
  return <GrandchildWithContext />;
}
function ParentWithContext({ user }) {
  return (
    <UserContext.Provider value={user}>
      <ChildWithContext />
    </UserContext.Provider>
  );
}