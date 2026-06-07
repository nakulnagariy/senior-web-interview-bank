# Arrow Function vs Regular Function

## Arrow Functions
- Introduced in ES6.
- Do **not** have their own `this`, `arguments`, `super`, or `new.target`.
- `this` is lexically inherited from the enclosing scope.
- Cannot be used as constructors (`new` will throw).
- Cannot use `yield` (not generator functions).
- Shorter syntax, especially for inline and callback functions.

## Regular Functions
- Have their own `this`, `arguments`, `super`, and `new.target`.
- `this` is determined by how the function is called (default, implicit, explicit, new).
- Can be used as constructors.
- Can be generator functions (with `function*`).

## Use Cases
- Arrow functions: Callbacks, methods that need lexical `this`, concise one-liners.
- Regular functions: Methods needing their own `this`, constructors, generators.

## Example

```js
const obj = {
  value: 42,
  arrow: () => console.log(this.value), // undefined
  regular: function() { console.log(this.value); } // 42
};
obj.arrow();
obj.regular();
```

### Summary
- Choose arrow functions for lexical this and concise syntax.
- Use regular functions when you need your own this, as constructors, or as generators.