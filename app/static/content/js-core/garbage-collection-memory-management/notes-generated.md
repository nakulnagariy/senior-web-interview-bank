# Garbage Collection & Memory Management

## What is Garbage Collection?
- Garbage collection (GC) is the automatic process of reclaiming memory that is no longer reachable or needed by a program.
- In JavaScript, the engine (e.g., V8, SpiderMonkey) handles GC, so developers don't manually free memory.

## How Does It Work?
- **Reachability:** An object is "reachable" if it can be accessed from the root (global object, stack, or current execution context).
- **Mark-and-Sweep:** The most common algorithm. The GC marks all reachable objects, then sweeps and frees memory for unreachable ones.
- **Generational GC:** Divides memory into "young" and "old" generations for more efficient collection.

## Common Memory Leaks
- **Global variables:** Accidentally keeping references in the global scope.
- **Closures:** Retaining references to large objects in closures.
- **Detached DOM nodes:** Keeping references to removed DOM elements.
- **Timers/Intervals:** Not clearing setInterval or setTimeout.
- **Event listeners:** Not removing listeners from DOM nodes.

## Best Practices
- Nullify references when no longer needed.
- Remove event listeners and timers on cleanup.
- Use tools (Chrome DevTools, heap snapshots) to detect leaks.

## Example

```js
let obj = { data: new Array(1000000).fill('x') };
obj = null; // Eligible for GC
```

### Summary
- GC is crucial for memory management in JavaScript.
- Understanding how it works helps prevent memory leaks and optimize performance.
- GC is automatic, but developers must avoid patterns that keep objects alive unnecessarily.
- Memory leaks can degrade performance and crash apps.