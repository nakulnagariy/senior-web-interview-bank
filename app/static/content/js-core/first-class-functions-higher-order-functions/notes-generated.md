# First-Class Functions & Higher-Order Functions

## First-Class Functions
- Functions are treated as values: they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures.
- Enables functional programming patterns and flexible APIs.

## Higher-Order Functions
- A higher-order function is a function that takes one or more functions as arguments, returns a function, or both.
- Examples: `map`, `filter`, `reduce`, event handlers, middleware.

## Why It Matters
- Enables abstraction, code reuse, and composition.
- Foundation for callbacks, promises, and functional programming.

## Example

```js
// First-class: assign to variable
const greet = function(name) { return 'Hello, ' + name; };

// Higher-order: takes a function as argument
function repeat(fn, n) {
  for (let i = 0; i < n; i++) fn();
}

// Higher-order: returns a function
function makeMultiplier(x) {
  return function(y) { return x * y; };
}
```

### Summary
- First-class functions are a core feature of JavaScript.
- Higher-order functions enable powerful patterns and abstractions.