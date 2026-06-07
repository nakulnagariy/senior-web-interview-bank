# React Strict Mode Behavior

## What is React Strict Mode?
- `<React.StrictMode>` is a tool for highlighting potential problems in an application.
- It does not render any visible UI, but activates additional checks and warnings for its descendants.

## Key Behaviors
- **Double Invocations:** In development, React intentionally double-invokes certain lifecycle methods and functions (like component constructors, useEffect, useState initializers) to help catch side effects and bugs.
- **Deprecation Warnings:** Warns about deprecated APIs and unsafe lifecycle methods.
- **Detects Side Effects:** Helps identify side effects that should not occur during rendering.
- **Strict Mode Only in Development:** These checks and behaviors are only active in development mode, not production.

## Common Gotchas
- Functions and effects may run twice, leading to confusion if side effects are not idempotent.
- Strict Mode does not affect production builds, so double invocations are only for development safety.

## Example
```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

All components under <StrictMode> are subject to extra checks.

### Summary
- Strict Mode is a development tool for catching bugs and unsafe patterns.
- It encourages writing resilient, side-effect-free code.