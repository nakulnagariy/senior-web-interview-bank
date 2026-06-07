# The `this` Keyword — 4 Binding Rules

## Interview Lens

`this` is determined **at call time**, not at definition time (except arrow functions). The four rules apply in a strict priority order. The most common interview trap is losing implicit binding when a method is assigned to a variable or passed as a callback.

---

## Binding Rule Priority

| Priority | Rule | How it's called |
|---|---|---|
| 1 (highest) | **new binding** | `new Foo()` |
| 2 | **Explicit binding** | `.call()`, `.apply()`, `.bind()` |
| 3 | **Implicit binding** | `obj.foo()` |
| 4 (lowest) | **Default binding** | `foo()` |

---

## 1. Default Binding

Called without any context. `this` is the global object in sloppy mode, `undefined` in strict mode.

```js
function foo() {
  console.log(this); // window (sloppy) | undefined (strict)
}
foo();
```

---

## 2. Implicit Binding

Called as a method of an object — `this` is the object **immediately to the left of the dot** at call time.

```js
const user = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};
user.greet(); // "Alice" — this === user
```

### Nested objects — only the immediate caller matters

```js
const outer = {
  name: 'Outer',
  inner: {
    name: 'Inner',
    print() { console.log(this.name); }
  }
};
outer.inner.print(); // "Inner" — this === outer.inner
```

### Losing implicit binding (most common pitfall)

Assigning a method to a variable or passing it as a callback detaches it from its object. Default binding takes over.

```js
const person = { name: 'Bob', sayName() { console.log(this.name); } };

const say = person.sayName;
say(); // undefined — default binding, not implicit

setTimeout(person.sayName, 100); // undefined — same reason
```

**Fixes**: use `.bind()`, wrap in an arrow function, or call the method directly.

```js
const say = person.sayName.bind(person); // explicit binding fixes it
setTimeout(() => person.sayName(), 100); // arrow wrapper fixes it
```

---

## 3. Explicit Binding

`.call()` and `.apply()` set `this` for one call. `.bind()` returns a new permanently-bound function.

```js
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: 'Carol' };

greet.call(user, 'Hello');           // "Hello, Carol"
greet.apply(user, ['Hi']);           // "Hi, Carol"

const boundGreet = greet.bind(user);
boundGreet('Hey');                   // "Hey, Carol"
```

### Hard binding pattern

```js
function foo() { console.log(this.a); }
const obj = { a: 2 };
const bar = foo.bind(obj);
bar();        // 2
bar.call({ a: 99 }); // still 2 — bind wins over call
```

`.bind()` produces a hard binding that **cannot be overridden by `.call()`/`.apply()`**.

---

## 4. new Binding

Called with `new`: a brand-new object is created, `this` is bound to it, and it is returned implicitly.

```js
function Person(name) {
  this.name = name; // this === the new object
}
const p = new Person('Dave');
console.log(p.name); // "Dave"
```

`new` overrides even `.bind()`.

---

## Arrow Functions — Lexical `this`

Arrow functions have **no own `this`**. They capture `this` from the enclosing lexical scope at definition time. No rule can override it — `.call()`, `.apply()`, `.bind()`, and `new` all have no effect on an arrow function's `this`.

```js
const timer = {
  seconds: 0,
  start() {
    // Arrow — inherits `this` from start()'s scope === timer
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};
timer.start(); // works correctly

// Regular function — loses `this` in the callback
const broken = {
  seconds: 0,
  start() {
    setInterval(function() {
      this.seconds++; // this === undefined (strict) or window
    }, 1000);
  }
};
```

### When NOT to use arrow functions

```js
const obj = {
  name: 'Eve',
  // ✗ Arrow — this is the outer scope, not obj
  greet: () => console.log(this.name),
  // ✓ Method shorthand — gets implicit binding
  greet() { console.log(this.name); }
};
```

Never use arrow functions as object methods or prototype methods.

---

## Precedence in Practice

```js
function Foo() { this.val = 1; }

// new vs bind
const bound = Foo.bind({ val: 99 });
const instance = new bound();
console.log(instance.val); // 1 — new wins over bind

// explicit vs implicit
const obj = { val: 2, foo: Foo };
obj.foo.call({ val: 3 });  // this.val === 3 — explicit wins over implicit
```

---

## Quick Reference

```
Is it an arrow function?           → lexical this (outer scope)
Called with new?                   → the new object
Called with .call/.apply/.bind?    → the specified object
Called as obj.method()?            → obj
Called as standalone function?     → global (sloppy) | undefined (strict)
```

---

## Common Interview Questions

**Q: Why does `this` become `undefined` in a `setTimeout` callback?**  
The callback is invoked as a standalone function (default binding). Fix with `.bind(this)` or an arrow function.

**Q: What does `bind` return?**  
A new function with `this` permanently set. The original function is unmodified.

**Q: Can you override a bound function's `this` with `.call()`?**  
No. `.bind()` produces a hard binding — `.call()` and `.apply()` on the result are silently ignored for `this`.

**Q: Does `new` work on an arrow function?**  
No. `new arrowFn()` throws `TypeError: arrowFn is not a constructor`.