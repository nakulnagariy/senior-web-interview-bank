# Prop Drilling: When It Becomes a Problem & Solutions

## What is Prop Drilling?
- Prop drilling is the process of passing data from a parent component down to deeply nested child components via props, even if intermediate components don’t need the data.

## When Does Prop Drilling Become a Problem?
- When data or functions must be passed through many layers of components that don’t use them.
- Leads to tightly coupled components, harder maintenance, and more difficult refactoring.
- Increases the risk of bugs and makes the codebase less readable.

## Solutions to Prop Drilling
- **Context API:** Provides a way to share values between components without explicitly passing props through every level.
- **State Management Libraries:** (Redux, Zustand, MobX, Recoil) for global or shared state.
- **Component Composition:** Use render props, higher-order components, or hooks to avoid unnecessary prop passing.
- **Colocation:** Move state closer to where it’s needed to minimize drilling.

## Example

```js
// Problem: Passing user through many layers
<Parent user={user}>
  <Child>
    <Grandchild user={user} />
  </Child>
</Parent>

// Solution: Context
const UserContext = React.createContext();
<UserContext.Provider value={user}>
  <Parent>
    <Child>
      <Grandchild />
    </Child>
  </Parent>
</UserContext.Provider>
```

### Summary
- Prop drilling can lead to maintenance issues and tightly coupled components.
- Use Context API, state management libraries, or component composition to avoid unnecessary prop passing and improve code maintainability.
- Prop drilling is manageable for shallow trees but problematic for deep or wide trees.
- Use Context or state management solutions to avoid unnecessary prop passing.