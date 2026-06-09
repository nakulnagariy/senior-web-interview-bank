# Advanced Questions — Part 1: JavaScript Deep Dive
## Questions 1–35

> Senior/Principal level. Each question tests internals, not just syntax.
> Work the answer in your head before expanding.

---

## 🔷 SECTION A — Output Prediction (JS Internals)

---

### Q1 — Closure + Loop (the classic)
```javascript
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns[0](), fns[1](), fns[2]());
```
**Output?**

<details>
<summary>✅ Answer</summary>

```
3 3 3
```

`var` is function-scoped — all three closures share the same `i`. By the time any function runs, the loop has completed and `i === 3`.

**Fix with `let`:**
```javascript
for (let i = 0; i < 3; i++) { fns.push(() => i); }
// Output: 0 1 2 — let creates a new binding per iteration
```
</details>

---

### Q2 — Prototype chain lookup
```javascript
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const alice = new Person('Alice');
console.log(alice.greet());
console.log(alice.hasOwnProperty('name'));
console.log(alice.hasOwnProperty('greet'));
console.log(alice.__proto__ === Person.prototype);
```
**Output of all four?**

<details>
<summary>✅ Answer</summary>

```
"Hi, I'm Alice"
true
false
true
```

`name` is an own property (set in constructor). `greet` lives on `Person.prototype` — not directly on `alice`. `alice.__proto__` is the same object as `Person.prototype`.
</details>

---

### Q3 — this binding in different contexts
```javascript
const obj = {
  value: 42,
  getValue: function() { return this.value; },
  getArrow: () => this.value,
};

console.log(obj.getValue());
console.log(obj.getArrow());

const fn = obj.getValue;
console.log(fn());
```
**Predict all three. Assume non-strict, browser context.**

<details>
<summary>✅ Answer</summary>

```
42
undefined
undefined
```

- `obj.getValue()` — method call, `this` = `obj` → 42
- `obj.getArrow()` — arrow function captures `this` at **definition time** (module/global scope, where `this.value` is undefined)
- `fn()` — detached call, `this` = global (`window` in browser). `window.value` is undefined.
</details>

---

### Q4 — Event loop with Promise + setTimeout
```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');
```
**Exact output order?**

<details>
<summary>✅ Answer</summary>

```
1 5 3 4 2
```

Sync: `1`, `5`. Microtask queue drains: `3`, `4`. Macrotask fires: `2`.
</details>

---

### Q5 — Tricky typeof
```javascript
console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);
console.log(typeof function(){});
console.log(typeof []);
console.log(typeof class {});
```
**All six outputs?**

<details>
<summary>✅ Answer</summary>

```
'object'     ← famous JS bug, null is not an object
'undefined'
'number'     ← NaN is type number (Not a Number is a Number)
'function'
'object'     ← arrays are objects
'function'   ← classes are syntactic sugar over functions
```
</details>

---

### Q6 — Implicit coercion gotchas
```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log(+[]);
console.log(+{});
console.log(+"3" + +"4");
```
**All six outputs?**

<details>
<summary>✅ Answer</summary>

```
""           — both arrays coerce to "", "" + "" = ""
"[object Object]"  — [] → "", {} → "[object Object]"
"[object Object]"  — {} treated as empty block in some contexts, + [] = 0 ... but as expression: "[object Object]"
0            — +[] coerces [] to 0
NaN          — +{} can't parse "[object Object]"
7            — unary + converts strings to numbers: 3 + 4
```

**Note:** `{} + []` output depends on context. At statement level, `{}` = empty block and result is `0`. As expression: `"[object Object]"`. Interviewers love this ambiguity.
</details>

---

### Q7 — Currying and partial application
```javascript
function multiply(a) {
  return function(b) {
    return function(c) {
      return a * b * c;
    };
  };
}

const triple = multiply(3);
const sixTimes = triple(2);
console.log(sixTimes(5));
console.log(multiply(2)(3)(4));
```
**Both outputs?**

<details>
<summary>✅ Answer</summary>

```
30    — 3 * 2 * 5
24    — 2 * 3 * 4
```

Currying transforms `f(a,b,c)` into `f(a)(b)(c)`. `triple` is a partially applied function with `a=3`. `sixTimes` further applies `b=2`. This is a core functional programming pattern used in React (HOCs, middleware, selectors).
</details>

---

### Q8 — Debounce output prediction
```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const log = debounce((msg) => console.log(msg), 100);
log('a');
log('b');
log('c');
// 100ms later...
```
**What gets logged and when?**

<details>
<summary>✅ Answer</summary>

```
'c'    — only once, after 100ms
```

Each call clears the previous timer. Only the last call (`'c'`) survives the delay. `'a'` and `'b'` are never executed. This is the canonical debounce implementation — implement it from memory in interviews.
</details>

---

### Q9 — Generator function
```javascript
function* counter() {
  let i = 0;
  while (true) {
    const reset = yield i;
    if (reset) i = 0;
    else i++;
  }
}

const gen = counter();
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next(true).value);
console.log(gen.next().value);
```
**All four outputs?**

<details>
<summary>✅ Answer</summary>

```
0
1
0    — gen.next(true) sends true as the value of yield expression, triggers reset
1
```

`yield` pauses execution AND returns a value. The argument to `.next(val)` becomes the resolved value of the `yield` expression inside the generator. Generators are the foundation of async/await in JS engines.
</details>

---

### Q10 — WeakMap use case
```javascript
const cache = new WeakMap();

function process(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = JSON.stringify(obj); // expensive operation
  cache.set(obj, result);
  return result;
}

let data = { id: 1 };
console.log(process(data));
console.log(process(data));
data = null; // what happens to cache entry?
```
**What happens to the cached entry when `data = null`?**

<details>
<summary>✅ Answer</summary>

`process(data)` returns `'{"id":1}'` both times (second is cached).

When `data = null`, the only strong reference to `{ id: 1 }` is gone. Because `WeakMap` holds **weak references**, the object becomes eligible for garbage collection and the cache entry is automatically removed.

**Why WeakMap for caching:** No memory leak. Regular `Map` would hold a strong reference and prevent GC. `WeakMap` keys must be objects; values can be anything.
</details>

---

## 🔷 SECTION B — Implement From Scratch

---

### Q11 — Implement `throttle`
**Implement `throttle(fn, limit)` — fn can fire at most once per `limit` ms, even if called repeatedly.**

<details>
<summary>✅ Answer</summary>

```javascript
function throttle(fn, limit) {
  let lastRun = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      return fn.apply(this, args);
    }
  };
}

// Usage
const throttledScroll = throttle(() => console.log('scroll'), 200);
window.addEventListener('scroll', throttledScroll);
```

**Debounce vs Throttle:**
- **Debounce:** fires AFTER silence. "Call me once you stop typing."
- **Throttle:** fires at most every N ms. "Call me at most once per 200ms while scrolling."
</details>

---

### Q12 — Implement `memoize` with cache size limit
**Implement `memoize(fn, maxSize)` using LRU eviction.**

<details>
<summary>✅ Answer</summary>

```javascript
function memoize(fn, maxSize = 100) {
  const cache = new Map(); // Map preserves insertion order

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // Move to end (most recently used)
      const val = cache.get(key);
      cache.delete(key);
      cache.set(key, val);
      return val;
    }

    const result = fn.apply(this, args);

    if (cache.size >= maxSize) {
      // Delete oldest (first inserted) entry
      cache.delete(cache.keys().next().value);
    }

    cache.set(key, result);
    return result;
  };
}
```

**Key insight:** `Map` preserves insertion order. Delete + re-insert on hit = LRU. `keys().next().value` gets the oldest key.
</details>

---

### Q13 — Implement `pipe` and `compose`
**Implement `pipe(...fns)` and `compose(...fns)`.**

<details>
<summary>✅ Answer</summary>

```javascript
// pipe: left-to-right execution
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// compose: right-to-left execution
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

// Usage
const add1  = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const transform = pipe(add1, double, square);
// (5+1) * 2 = 12, 12^2 = 144
console.log(transform(5)); // 144

const transform2 = compose(square, double, add1);
// same: square(double(add1(5)))
console.log(transform2(5)); // 144
```

`pipe` reads left-to-right (more intuitive). `compose` reads right-to-left (mathematical convention).
</details>

---

### Q14 — Implement `deepClone`
**Implement `deepClone(obj)` that handles: objects, arrays, nested, null, primitives.**

<details>
<summary>✅ Answer</summary>

```javascript
function deepClone(value) {
  // Primitives and null — return as-is
  if (value === null || typeof value !== 'object') return value;

  // Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }

  // Plain object
  const clone = {};
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key]);
  }
  return clone;
}

// Modern alternative (handles more edge cases):
// const clone = structuredClone(obj);
// Limitation of both: doesn't clone functions, DOM nodes, class instances
```
</details>

---

### Q15 — Implement `flatten(arr, depth)`
**Implement array flattening to arbitrary depth without using `.flat()`.**

<details>
<summary>✅ Answer</summary>

```javascript
function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      return acc.concat(flatten(item, depth - 1));
    }
    return acc.concat(item);
  }, []);
}

console.log(flatten([1, [2, [3, [4]]]]));        // [1, 2, 3, 4]
console.log(flatten([1, [2, [3, [4]]]], 1));     // [1, 2, [3, [4]]]
console.log(flatten([1, [2, [3, [4]]]], 2));     // [1, 2, 3, [4]]
```
</details>

---

### Q16 — Implement `EventEmitter`
**Implement a basic EventEmitter with `on`, `off`, `emit`.**

<details>
<summary>✅ Answer</summary>

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this; // chainable
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}
```
</details>

---

### Q17 — Implement `Promise.all` from scratch
**Implement `myPromiseAll(promises)` that behaves like `Promise.all`.**

<details>
<summary>✅ Answer</summary>

```javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);

    const results = new Array(promises.length);
    let resolved = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        results[index] = value;  // preserve order
        resolved++;
        if (resolved === promises.length) resolve(results);
      }).catch(reject);  // fail fast on first rejection
    });
  });
}
```

**Key points:**
- Preserve result order by storing at `index`, not push order
- `Promise.resolve(promise)` handles non-promise values
- Fail-fast: first rejection rejects the whole thing
</details>

---

### Q18 — Implement `groupBy`
**Implement `groupBy(arr, keyFn)` that groups array elements by a key function.**

<details>
<summary>✅ Answer</summary>

```javascript
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});
}

// Usage
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob',   age: 30 },
  { name: 'Carol', age: 25 },
];

console.log(groupBy(people, p => p.age));
// { 25: [{Alice}, {Carol}], 30: [{Bob}] }

console.log(groupBy(people, 'age'));
// same — supports string key
```

**Note:** `Object.groupBy(arr, keyFn)` is now a native method in modern JS (ES2024). Know both.
</details>

---

## 🔷 SECTION C — Async Patterns

---

### Q19 — Async retry with exponential backoff
**Implement `retry(fn, maxRetries, baseDelayMs)` that retries on failure with exponential backoff.**

<details>
<summary>✅ Answer</summary>

```javascript
async function retry(fn, maxRetries = 3, baseDelay = 200) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt)
                    * (0.5 + Math.random() * 0.5);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw lastError;
}

// Usage
const data = await retry(() => fetch('/api/data'), 3, 200);
// Attempts at: 0ms, ~200ms, ~400ms, ~800ms
```
</details>

---

### Q20 — Implement `withTimeout`
**Implement `withTimeout(promise, ms)` — rejects if promise doesn't settle within ms.**

<details>
<summary>✅ Answer</summary>

```javascript
function withTimeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    // Clean up timer if promise settles first
    promise.finally(() => clearTimeout(id));
  });

  return Promise.race([promise, timeoutPromise]);
}

// Usage
try {
  const data = await withTimeout(fetch('/slow-api'), 5000);
} catch (err) {
  console.log(err.message); // 'Operation timed out after 5000ms'
}
```
</details>

---

### Q21 — Sequential vs parallel async
```javascript
// Which is faster? What are the total wait times?

// Version A
async function versionA() {
  const a = await fetchA(); // takes 1s
  const b = await fetchB(); // takes 1s
  return [a, b];
}

// Version B
async function versionB() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]);
  return [a, b];
}
```
**Total time for each?**

<details>
<summary>✅ Answer</summary>

```
Version A: ~2 seconds  — sequential, B waits for A to finish
Version B: ~1 second   — parallel, both start simultaneously
```

Version A: `await` pauses execution — `fetchB` doesn't start until `fetchA` resolves.
Version B: Both promises start immediately. `Promise.all` waits for both but they run concurrently.

**Rule:** If B doesn't depend on A's result, always start both before awaiting.
</details>

---

### Q22 — Async/await error handling patterns
```javascript
// What's wrong with this pattern?
async function loadData() {
  const user    = await getUser();
  const profile = await getProfile(user.id);
  const posts   = await getPosts(user.id);
  return { user, profile, posts };
}
```
**Identify the problem and give two better patterns.**

<details>
<summary>✅ Answer</summary>

**Problem 1 — Sequential when parallel is possible:** `profile` and `posts` both only need `user.id` — they can run concurrently.

**Problem 2 — No error handling:** Any rejection crashes the caller without context.

**Fix:**
```javascript
async function loadData() {
  try {
    const user = await getUser();

    // profile and posts are independent — run in parallel
    const [profile, posts] = await Promise.all([
      getProfile(user.id),
      getPosts(user.id),
    ]);

    return { user, profile, posts };
  } catch (err) {
    // Add context before re-throwing
    throw new Error(`loadData failed: ${err.message}`);
  }
}
```
</details>

---

## 🔷 SECTION D — Advanced Concepts

---

### Q23 — Proxy and Reflect
**Implement a reactive object using Proxy that logs every property read and write.**

<details>
<summary>✅ Answer</summary>

```javascript
function createReactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      console.log(`GET: ${String(key)}`);
      return Reflect.get(obj, key, receiver);
    },
    set(obj, key, value, receiver) {
      console.log(`SET: ${String(key)} = ${JSON.stringify(value)}`);
      return Reflect.set(obj, key, value, receiver);
    },
    deleteProperty(obj, key) {
      console.log(`DELETE: ${String(key)}`);
      return Reflect.deleteProperty(obj, key);
    }
  });
}

const state = createReactive({ count: 0 });
state.count;       // logs: GET: count
state.count = 5;   // logs: SET: count = 5
```

**Why Reflect?** Using `Reflect.get(obj, key, receiver)` instead of `obj[key]` correctly handles inherited properties and getter functions that use `this`.

**Real-world use:** Vue 3's reactivity system is built entirely on Proxy + Reflect.
</details>

---

### Q24 — Symbol use case
```javascript
const id = Symbol('id');
const user = {
  name: 'Alice',
  [id]: 123,
};

console.log(Object.keys(user));
console.log(JSON.stringify(user));
console.log(user[id]);
```
**What do all three output?**

<details>
<summary>✅ Answer</summary>

```
['name']              — Symbol keys excluded from Object.keys
'{"name":"Alice"}'    — Symbol keys excluded from JSON
123                   — accessible via the Symbol reference
```

Symbol properties are **non-enumerable by default** — they don't appear in `for...in`, `Object.keys()`, `JSON.stringify()`, or spread. Use `Object.getOwnPropertySymbols(obj)` to access them. Perfect for private-ish metadata that won't pollute enumerable APIs.
</details>

---

### Q25 — Tail call optimization
```javascript
// Regular recursion — may stack overflow on large n
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Tail-recursive version
function factorialTCO(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTCO(n - 1, n * acc);
}
```
**Why is the tail-recursive version better? Does it work in JS?**

<details>
<summary>✅ Answer</summary>

In the regular version, `n * factorial(n-1)` means the current stack frame must stay alive to do the multiplication after the recursive call returns. For `n=100000`, this creates 100,000 stack frames → stack overflow.

In the tail-recursive version, the recursive call is the **last** operation — no pending work in the current frame. The engine can reuse the same stack frame (tail call optimization).

**JS reality:** TCO is in the ES6 spec but only Safari implements it fully. V8 (Node.js, Chrome) does NOT optimize tail calls. For production recursive code in JS, use an iterative approach or trampolining instead.
</details>

---

### Q26 — Module patterns and IIFE
```javascript
const counter = (function() {
  let count = 0; // private

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount:  () => count,
    reset:     () => { count = 0; },
  };
})();

counter.increment();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount());
console.log(counter.count); // ?
```
**Both outputs?**

<details>
<summary>✅ Answer</summary>

```
2           — 3 increments - 1 decrement
undefined   — count is private via closure, not accessible externally
```

The IIFE (Immediately Invoked Function Expression) creates a private scope. `count` is encapsulated. This is the **Revealing Module Pattern** — the precursor to ES modules and the foundation of many JS library designs.
</details>

---

### Q27 — Object.create and prototype chain
```javascript
const animal = {
  breathe() { return `${this.name} breathes`; }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.bark = function() { return `${this.name} barks`; };

console.log(dog.breathe());
console.log(dog.bark());
console.log(Object.getPrototypeOf(dog) === animal);
console.log(dog.hasOwnProperty('breathe'));
```
**All four outputs?**

<details>
<summary>✅ Answer</summary>

```
'Rex breathes'
'Rex barks'
true
false
```

`Object.create(proto)` creates a new object with `proto` as its prototype. `breathe` is found on the prototype chain, not directly on `dog`. `this.name` resolves to `dog.name` because `this` is the calling object.
</details>

---

### Q28 — Implement `bind` from scratch
**Implement `Function.prototype.myBind(context, ...args)`.**

<details>
<summary>✅ Answer</summary>

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this; // the original function

  return function(...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};

// Test
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const alice = { name: 'Alice' };
const sayHi = greet.myBind(alice, 'Hello');
console.log(sayHi('!'));   // "Hello, Alice!"
console.log(sayHi('...'));  // "Hello, Alice..."
```

**Partial application** is built in — `boundArgs` are prepended to every call.
</details>

---

### Q29 — Getter / Setter in objects
```javascript
const person = {
  _age: 0,
  get age() { return this._age; },
  set age(val) {
    if (val < 0) throw new Error('Age cannot be negative');
    this._age = val;
  }
};

person.age = 30;
console.log(person.age);
person.age = -1;
```
**What happens?**

<details>
<summary>✅ Answer</summary>

```
30
Error: Age cannot be negative
```

Getters/setters look like properties but execute logic. The `_age` convention signals "private" (though it's not truly private). For real privacy, use `#age` (private class fields):

```javascript
class Person {
  #age = 0;
  get age()    { return this.#age; }
  set age(val) { if (val < 0) throw new Error(); this.#age = val; }
}
```
</details>

---

### Q30 — Tagged template literals
```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] !== undefined
      ? `<strong>${values[i]}</strong>`
      : '');
  }, '');
}

const name  = 'Alice';
const score = 95;
const msg   = highlight`Hello ${name}, your score is ${score}!`;
console.log(msg);
```
**What is `msg`?**

<details>
<summary>✅ Answer</summary>

```
'Hello <strong>Alice</strong>, your score is <strong>95</strong>!'
```

Tagged templates call the tag function with:
- `strings` array: `['Hello ', ', your score is ', '!']`
- `...values`: `['Alice', 95]`

Real-world uses: styled-components (`css\`...\``), SQL injection prevention (`sql\`SELECT * FROM users WHERE id = ${id}\``), i18n.
</details>

---

### Q31 — Optional chaining edge cases
```javascript
const data = {
  user: {
    address: null,
  }
};

console.log(data?.user?.address?.city);
console.log(data?.user?.phone?.number);
console.log(data?.nonExistent?.deep?.value);
console.log(data?.user?.address?.city ?? 'Unknown');
```
**All four outputs?**

<details>
<summary>✅ Answer</summary>

```
undefined    — address is null, ?. returns undefined (doesn't throw)
undefined    — phone doesn't exist
undefined    — nonExistent doesn't exist
'Unknown'    — ?? returns right side when left is null OR undefined
```

`?.` short-circuits on `null` or `undefined` (returns `undefined`). `??` (nullish coalescing) returns the right side only for `null`/`undefined` — unlike `||` which also triggers on `0`, `''`, `false`.
</details>

---

### Q32 — Spread vs rest parameters
```javascript
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

const numbers = [1, 2, 3, 4, 5];
console.log(sum(...numbers));
console.log(sum(1, ...numbers, 6));

const [first, ...rest] = numbers;
console.log(first);
console.log(rest);
```
**All four outputs?**

<details>
<summary>✅ Answer</summary>

```
15                    — 1+2+3+4+5
21                    — 1 + (1+2+3+4+5) + 6
1
[2, 3, 4, 5]
```

Rest (`...nums` in params) collects into an array. Spread (`...numbers` in call) expands an array into individual arguments. Rest must be the last parameter.
</details>

---

### Q33 — for...in vs for...of
```javascript
const arr = [10, 20, 30];
arr.custom = 'extra';

for (const key in arr)   console.log(key);
for (const val of arr)   console.log(val);
```
**What does each loop log?**

<details>
<summary>✅ Answer</summary>

```
// for...in:
0
1
2
custom        ← iterates ALL enumerable properties including custom!

// for...of:
10
20
30            ← iterates VALUES of iterable, ignores non-index properties
```

**Rule:** Never use `for...in` on arrays — it includes enumerable prototype/custom properties. Use `for...of` for arrays, strings, Maps, Sets. Use `for...in` for plain objects (key iteration).
</details>

---

### Q34 — Nullish assignment operators
```javascript
let a = null;
let b = 0;
let c = 'existing';

a ??= 'default';
b ??= 'default';
c &&= c.toUpperCase();

console.log(a, b, c);
```
**Output?**

<details>
<summary>✅ Answer</summary>

```
'default'    0    'EXISTING'
```

- `??=` assigns only if current value is `null` or `undefined`. `b=0` is falsy but not nullish → stays `0`.
- `&&=` assigns only if current value is truthy. `c='existing'` is truthy → transforms it.
- Also: `||=` assigns if current value is falsy (includes `0`, `''`, `false`).
</details>

---

### Q35 — Structured clone vs JSON deep copy
```javascript
const original = {
  date: new Date('2024-01-01'),
  regex: /hello/gi,
  fn: () => 'I am a function',
  undef: undefined,
  circular: null,
};

original.circular = original; // circular reference

const jsonCopy = JSON.parse(JSON.stringify(original));
const structuredCopy = structuredClone(original);
```
**What does each copy contain? What fails?**

<details>
<summary>✅ Answer</summary>

```javascript
// JSON.parse(JSON.stringify(...)) THROWS for circular reference
// If no circular: date → string, regex → {}, fn → dropped, undef → dropped

// structuredClone:
// date → new Date object (correct)
// regex → new RegExp (correct)
// fn → THROWS TypeError (functions not supported)
// undef → preserved as undefined
// circular → THROWS DataCloneError (circular... wait, actually works in structuredClone!)
```

**Summary table:**

| | JSON | structuredClone |
|---|---|---|
| Dates | ❌ string | ✅ Date |
| RegExp | ❌ `{}` | ✅ RegExp |
| Functions | ❌ dropped | ❌ throws |
| undefined | ❌ dropped | ✅ preserved |
| Circular refs | ❌ throws | ✅ handles |
| Map/Set | ❌ `{}` / `[]` | ✅ |

</details>

---

*Continue in Part 2 → TypeScript questions (Q36–60)*
