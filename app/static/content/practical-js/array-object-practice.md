# Array & Object Methods — Learning & Practice Guide

> 30 questions from beginner-friendly to senior-level output prediction.
> Each question has a **hint**, the **answer**, and an **explanation**.
> Work through each one before reading the answer.

---

## Quick Reference Cheatsheet

```
ARRAY METHODS
─────────────────────────────────────────────────────
map(fn)           → new array, same length, transforms each item
filter(fn)        → new array, shorter/equal, keeps truthy items
reduce(fn, init)  → single value, accumulates over each item
find(fn)          → first matching item, or undefined
findIndex(fn)     → index of first match, or -1
some(fn)          → true if ANY item matches
every(fn)         → true if ALL items match
flat(depth)       → flattens nested arrays
flatMap(fn)       → map then flat(1) in one step
forEach(fn)       → no return value, side effects only
sort(fn)          → sorts IN PLACE — mutates original array
splice(i, n)      → removes/inserts IN PLACE — mutates original
slice(start, end) → returns new array — does NOT mutate
includes(val)     → true/false membership check
indexOf(val)      → index of value, or -1
Array.from(x)     → creates array from iterable or array-like
Array.isArray(x)  → true if x is an array

OBJECT METHODS
─────────────────────────────────────────────────────
Object.keys(obj)          → array of own enumerable keys
Object.values(obj)        → array of own enumerable values
Object.entries(obj)       → array of [key, value] pairs
Object.fromEntries(arr)   → object from [key, value] pairs
Object.assign(target, …)  → shallow merge — MUTATES target
Object.freeze(obj)        → makes obj immutable (shallow)
Object.seal(obj)          → no add/delete, but can update values
Object.create(proto)      → new object with given prototype
hasOwnProperty(key)       → true if key is own (not inherited)
spread { ...obj }         → shallow clone / merge (no mutation)
```

---

## Section 1 — map()

### Q1 — Basic transform
```javascript
const prices = [10, 20, 30, 40, 50];
const discounted = prices.map(p => p * 0.9);
console.log(discounted);
```
**What does `discounted` contain?**

<details>
<summary>💡 Hint</summary>
map() transforms each item. 10% discount means multiply by 0.9.
</details>

<details>
<summary>✅ Answer</summary>

```javascript
[9, 18, 27, 36, 45]
```

**Explanation:** `map()` creates a new array of the same length. Each price is multiplied by `0.9`. The original `prices` array is unchanged.

</details>

---

### Q2 — map() on array of objects
```javascript
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob',   active: false },
  { id: 3, name: 'Carol', active: true },
];
const names = users.map(u => u.name.toUpperCase());
console.log(names);
```
**What is `names`?**

<details>
<summary>✅ Answer</summary>

```javascript
['ALICE', 'BOB', 'CAROL']
```

**Explanation:** `map()` extracts the `name` from each object and converts it to uppercase. Returns a plain string array — not objects.

</details>

---

### Q3 — map() index parameter
```javascript
const items = ['a', 'b', 'c', 'd'];
const result = items.map((item, index) => `${index + 1}. ${item}`);
console.log(result);
```
**What is `result`?**

<details>
<summary>✅ Answer</summary>

```javascript
['1. a', '2. b', '3. c', '4. d']
```

**Explanation:** The second parameter of `map()`'s callback is the zero-based index. Adding 1 gives a 1-based position number.

</details>

---

### Q4 — Tricky: map() returns `undefined` items
```javascript
const nums = [1, 2, 3];
const result = nums.map(n => {
  if (n > 1) return n * 2;
});
console.log(result);
```
**What is `result`? What is `result[0]`?**

<details>
<summary>💡 Hint</summary>
What does a function return when there's no explicit return statement?
</details>

<details>
<summary>✅ Answer</summary>

```javascript
[undefined, 4, 6]
// result[0] === undefined
```

**Explanation:** When `n === 1`, the `if` condition is false and the function has no explicit return — so it returns `undefined`. `map()` always produces an array of the same length — it never skips items. Use `filter()` if you want to skip items.

</details>

---

## Section 2 — filter()

### Q5 — Basic filter
```javascript
const scores = [45, 82, 60, 91, 73, 55, 88];
const passed = scores.filter(s => s >= 70);
console.log(passed);
console.log(passed.length);
```
**What are `passed` and `passed.length`?**

<details>
<summary>✅ Answer</summary>

```javascript
passed       = [82, 91, 73, 88]
passed.length = 4
```

**Explanation:** `filter()` returns a new array containing only items where the callback returns truthy. Items below 70 are excluded.

</details>

---

### Q6 — filter() on objects
```javascript
const products = [
  { name: 'Laptop', inStock: true,  price: 999 },
  { name: 'Phone',  inStock: false, price: 599 },
  { name: 'Tablet', inStock: true,  price: 399 },
  { name: 'Watch',  inStock: false, price: 199 },
];
const available = products
  .filter(p => p.inStock)
  .map(p => p.name);
console.log(available);
```
**What is `available`?**

<details>
<summary>✅ Answer</summary>

```javascript
['Laptop', 'Tablet']
```

**Explanation:** `filter()` keeps only in-stock items. Chaining `.map()` then extracts just the name. Method chaining is a core pattern — each method returns a new array for the next method to work on.

</details>

---

### Q7 — filter() with falsy values gotcha
```javascript
const mixed = [0, 1, '', 'hello', null, undefined, false, true, NaN, 42];
const truthy = mixed.filter(Boolean);
console.log(truthy);
```
**What is `truthy`?**

<details>
<summary>💡 Hint</summary>
`Boolean` is a function. Which of these values are falsy in JavaScript?
</details>

<details>
<summary>✅ Answer</summary>

```javascript
[1, 'hello', true, 42]
```

**Explanation:** Falsy values are: `0`, `''`, `null`, `undefined`, `false`, `NaN`. `filter(Boolean)` is shorthand for `filter(x => Boolean(x))` — passing the `Boolean` constructor as the callback. All falsy values are removed.

</details>

---

### Q8 — filter() does NOT mutate
```javascript
const nums = [1, 2, 3, 4, 5];
const evens = nums.filter(n => n % 2 === 0);
console.log(nums);
console.log(evens);
```
**What do both logs show?**

<details>
<summary>✅ Answer</summary>

```javascript
nums  = [1, 2, 3, 4, 5]  // unchanged
evens = [2, 4]
```

**Explanation:** `filter()` returns a new array — it never modifies the original. This is true for `map()` and `reduce()` too. Always keep immutability in mind — `sort()` and `splice()` are the notable exceptions that mutate in place.

</details>

---

## Section 3 — reduce()

### Q9 — Sum of array (your example)
```javascript
const numbers = [10, 20, 30, 40];
const total = numbers.reduce((acc, current) => acc + current, 0);
console.log(total);
```
**What is `total`? Trace the accumulator at each step.**

<details>
<summary>✅ Answer</summary>

```javascript
// Trace:
// acc=0,  current=10 → returns 10
// acc=10, current=20 → returns 30
// acc=30, current=30 → returns 60
// acc=60, current=40 → returns 100

total = 100
```

**Explanation:** `reduce(callback, initialValue)`. The `acc` starts at `0` (initialValue). Each iteration adds the current element. Always provide an initial value — without it, `reduce` on an empty array throws a TypeError.

</details>

---

### Q10 — reduce() without initial value — the gotcha
```javascript
const nums = [5, 10, 15];
const result = nums.reduce((acc, curr) => acc + curr);
console.log(result);

const empty = [];
const bad = empty.reduce((acc, curr) => acc + curr);
```
**What does the first log show? What does the second line do?**

<details>
<summary>💡 Hint</summary>
Without an initial value, reduce uses the first element as the initial accumulator.
</details>

<details>
<summary>✅ Answer</summary>

```javascript
// First: 30 (5 + 10 + 15, first element 5 used as acc)
// Second: TypeError: Reduce of empty array with no initial value
```

**Explanation:** Without an initial value, `reduce` uses `arr[0]` as `acc` and starts iterating from `arr[1]`. This works fine on non-empty arrays but **throws on empty arrays**. Always provide an initial value for safety: `.reduce(fn, 0)`.

</details>

---

### Q11 — Group by (your example, extended)
```javascript
const people = [
  { name: 'Alice',   dept: 'Eng' },
  { name: 'Bob',     dept: 'HR'  },
  { name: 'Carol',   dept: 'Eng' },
  { name: 'Dave',    dept: 'HR'  },
  { name: 'Eve',     dept: 'Eng' },
];
const byDept = people.reduce((acc, person) => {
  const key = person.dept;
  acc[key] = acc[key] ? [...acc[key], person.name] : [person.name];
  return acc;
}, {});
console.log(byDept);
```
**What is `byDept`?**

<details>
<summary>✅ Answer</summary>

```javascript
{
  Eng: ['Alice', 'Carol', 'Eve'],
  HR:  ['Bob', 'Dave']
}
```

**Explanation:** `reduce()` builds an object keyed by department. The conditional `acc[key] ? [...acc[key], person.name] : [person.name]` handles both the first item for a new key and appending to existing keys. This is the canonical group-by pattern.

</details>

---

### Q12 — Frequency counter (your example)
```javascript
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(counts);
```
**What is `counts`? Why does `(acc[fruit] || 0)` work?**

<details>
<summary>✅ Answer</summary>

```javascript
{ apple: 3, banana: 2, orange: 1 }
```

**Explanation:** `acc[fruit]` is `undefined` the first time a fruit is seen. `undefined || 0` evaluates to `0`, so we start counting from `0 + 1 = 1`. This is the frequency counter pattern — memorise it. It works for any array of primitives.

</details>

---

### Q13 — Flatten with reduce (your example)
```javascript
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, curr) => acc.concat(curr), []);
console.log(flat);
```
**What is `flat`? What is the modern alternative?**

<details>
<summary>✅ Answer</summary>

```javascript
[1, 2, 3, 4, 5, 6]
```

**Modern alternative:** `nested.flat()` — cleaner and handles deeper nesting with `nested.flat(Infinity)`.

**Explanation:** `concat()` merges the current sub-array into the accumulator. This manually implements `flat(1)`. Know both patterns — interviewers sometimes ask you to implement `flat` from scratch.

</details>

---

### Q14 — reduce() to build a lookup map
```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob'   },
  { id: 3, name: 'Carol' },
];
const userMap = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
console.log(userMap[2]);
console.log(userMap[2].name);
```
**What do the two logs show?**

<details>
<summary>✅ Answer</summary>

```javascript
userMap[2]      = { id: 2, name: 'Bob' }
userMap[2].name = 'Bob'
```

**Explanation:** This is the O(1) lookup pattern — converting an array into an object keyed by ID. Array lookup is O(n); object lookup by key is O(1). Critical pattern for performance-sensitive code.

</details>

---

## Section 4 — Chaining map + filter + reduce

### Q15 — Chain: filter then reduce
```javascript
const orders = [
  { product: 'Laptop', qty: 2, price: 999, status: 'shipped'   },
  { product: 'Mouse',  qty: 5, price: 25,  status: 'pending'   },
  { product: 'Desk',   qty: 1, price: 350, status: 'shipped'   },
  { product: 'Chair',  qty: 3, price: 150, status: 'cancelled' },
];
const shippedTotal = orders
  .filter(o => o.status === 'shipped')
  .reduce((acc, o) => acc + (o.qty * o.price), 0);
console.log(shippedTotal);
```
**What is `shippedTotal`?**

<details>
<summary>✅ Answer</summary>

```javascript
// Shipped orders: Laptop (2×999=1998), Desk (1×350=350)
// Total: 1998 + 350 = 2348

shippedTotal = 2348
```

**Explanation:** `filter()` keeps only shipped orders, then `reduce()` sums `qty × price`. Chaining is the idiomatic approach — avoid storing intermediate arrays in variables unless you need to reuse them.

</details>

---

### Q16 — Senior output prediction (your example)
```javascript
const arr = [124, 202, 101, 303, 123];

const result = arr
  .map(ci => Array.from(String(ci), cv => Number(cv))
                  .reduce((acc, cv) => acc + cv, 0))
  .sort((a, b) => a - b);

console.log(result);
```
**Predict the exact output. Trace step by step.**

<details>
<summary>💡 Hint</summary>

`Array.from(String(n), cv => Number(cv))` converts each digit character to a number. Then `.reduce()` sums those digits.

</details>

<details>
<summary>✅ Answer</summary>

```javascript
// Step 1 — digit sum each number:
// 124 → [1,2,4] → 7
// 202 → [2,0,2] → 4
// 101 → [1,0,1] → 2
// 303 → [3,0,3] → 6
// 123 → [1,2,3] → 6

// After map: [7, 4, 2, 6, 6]

// Step 2 — sort ascending:
[2, 4, 6, 6, 7]
```

**Explanation:**
- `String(124)` → `"124"`
- `Array.from("124", cv => Number(cv))` → `[1, 2, 4]` (maps each character)
- `.reduce((acc, cv) => acc + cv, 0)` → `7`
- Final `.sort((a, b) => a - b)` sorts numerically ascending

**Note:** `.sort()` without a comparator sorts lexicographically (`[10, 2, 9]` → `[10, 2, 9]`). Always pass `(a, b) => a - b` for numeric sort.

</details>

---

### Q17 — flatMap()
```javascript
const sentences = ['hello world', 'foo bar baz'];
const words = sentences.flatMap(s => s.split(' '));
console.log(words);
console.log(words.length);
```
**What is `words`?**

<details>
<summary>✅ Answer</summary>

```javascript
words        = ['hello', 'world', 'foo', 'bar', 'baz']
words.length = 5
```

**Explanation:** `flatMap(fn)` is equivalent to `.map(fn).flat(1)`. It maps each item (producing an array) then flattens one level. Perfect for "one item produces multiple items" transformations.

</details>

---

## Section 5 — sort(), find(), some(), every()

### Q18 — sort() mutation gotcha
```javascript
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = nums.sort((a, b) => a - b);
console.log(sorted);
console.log(nums);
console.log(sorted === nums);
```
**What do all three logs show?**

<details>
<summary>💡 Hint</summary>
sort() is one of the few array methods that mutates in place.
</details>

<details>
<summary>✅ Answer</summary>

```javascript
sorted        = [1, 1, 2, 3, 4, 5, 6, 9]
nums          = [1, 1, 2, 3, 4, 5, 6, 9]  // MUTATED
sorted === nums  // true — same reference!
```

**Explanation:** `sort()` sorts **in place** and returns the same array reference. `sorted` and `nums` point to the same array. To sort without mutation: `const sorted = [...nums].sort((a, b) => a - b)` or `nums.slice().sort(...)`.

</details>

---

### Q19 — find() vs filter()
```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob'   },
  { id: 2, name: 'Bobby' },  // duplicate id!
  { id: 3, name: 'Carol' },
];
const found = users.find(u => u.id === 2);
const all   = users.filter(u => u.id === 2);
console.log(found);
console.log(all);
```
**What do both logs show?**

<details>
<summary>✅ Answer</summary>

```javascript
found = { id: 2, name: 'Bob' }        // first match only
all   = [{ id: 2, name: 'Bob' }, { id: 2, name: 'Bobby' }]
```

**Explanation:** `find()` returns the **first** matching item and stops. `filter()` returns **all** matching items. Use `find()` when you expect a unique result (e.g. by ID). Use `filter()` when multiple matches are valid.

</details>

---

### Q20 — some() and every()
```javascript
const ages = [22, 35, 17, 28, 15, 41];

console.log(ages.some(a => a < 18));
console.log(ages.every(a => a >= 18));
console.log(ages.every(a => a > 0));
console.log(ages.some(a => a > 100));
```
**Predict all four outputs.**

<details>
<summary>✅ Answer</summary>

```javascript
ages.some(a => a < 18)    // true  — 17 and 15 are under 18
ages.every(a => a >= 18)  // false — 17 and 15 fail
ages.every(a => a > 0)    // true  — all positive
ages.some(a => a > 100)   // false — none over 100
```

**Explanation:**
- `some()` → short-circuits on first truthy. Returns `true` if ANY match.
- `every()` → short-circuits on first falsy. Returns `true` only if ALL match.
- Both return `false`/`true` for empty arrays: `[].some(fn)` → `false`, `[].every(fn)` → `true` (vacuously true).

</details>

---

## Section 6 — Object Methods

### Q21 — Object.keys / values / entries
```javascript
const config = { host: 'localhost', port: 3000, debug: true };

console.log(Object.keys(config));
console.log(Object.values(config));
console.log(Object.entries(config));
```
**What do all three log?**

<details>
<summary>✅ Answer</summary>

```javascript
Object.keys(config)    = ['host', 'port', 'debug']
Object.values(config)  = ['localhost', 3000, true]
Object.entries(config) = [['host','localhost'], ['port',3000], ['debug',true]]
```

**Explanation:** All three return arrays of **own enumerable** properties only (no inherited prototype properties). `entries()` gives you both key and value together — useful for iteration and transformation.

</details>

---

### Q22 — Object.entries + map + fromEntries
```javascript
const prices = { apple: 1.5, banana: 0.75, mango: 2.0 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([key, val]) => [key, val * 2])
);
console.log(doubled);
```
**What is `doubled`?**

<details>
<summary>✅ Answer</summary>

```javascript
{ apple: 3, banana: 1.5, mango: 4 }
```

**Explanation:** The `entries → map → fromEntries` pipeline is the idiomatic way to transform object values:
1. `Object.entries()` converts the object to an array of `[key, value]` pairs
2. `.map()` transforms each pair (destructured as `[key, val]`)
3. `Object.fromEntries()` converts the pairs back into an object

This pattern never mutates the original object.

</details>

---

### Q23 — Object spread vs Object.assign mutation gotcha
```javascript
const defaults = { theme: 'light', lang: 'en', fontSize: 14 };
const userPrefs = { theme: 'dark' };

// Method A
const configA = Object.assign(defaults, userPrefs);

// Method B
const configB = { ...defaults, ...userPrefs };

console.log(defaults);   // ?
console.log(configA === defaults);  // ?
console.log(configB === defaults);  // ?
```
**What do the three logs show?**

<details>
<summary>💡 Hint</summary>
Object.assign(target, source) mutates the TARGET. Spread creates a new object.
</details>

<details>
<summary>✅ Answer</summary>

```javascript
defaults            = { theme: 'dark', lang: 'en', fontSize: 14 }  // MUTATED!
configA === defaults // true  — same reference, defaults was the target
configB === defaults // false — spread creates a new object
```

**Explanation:** `Object.assign(target, source)` **mutates `target`** and returns it. `defaults` is now permanently modified. To merge without mutation: `Object.assign({}, defaults, userPrefs)` (empty object as target) or use spread. In React/Redux, always use spread to preserve immutability.

</details>

---

### Q24 — Object.freeze gotcha
```javascript
const settings = Object.freeze({ name: 'App', meta: { version: 1 } });

settings.name = 'NewApp';         // line A
settings.meta.version = 2;       // line B
settings.newKey = 'test';         // line C

console.log(settings.name);
console.log(settings.meta.version);
console.log(settings.newKey);
```
**What do the three logs show?**

<details>
<summary>💡 Hint</summary>
Object.freeze is SHALLOW — it only freezes the top-level properties.
</details>

<details>
<summary>✅ Answer</summary>

```javascript
settings.name         // 'App'       — line A silently failed (strict mode throws)
settings.meta.version // 2           — line B SUCCEEDED — nested object NOT frozen
settings.newKey       // undefined   — line C silently failed
```

**Explanation:** `Object.freeze()` is **shallow** — it prevents adding, deleting, or reassigning top-level properties. But nested objects (like `meta`) are still mutable references. For deep immutability, you must recursively freeze or use a library like `immer`.

</details>

---

### Q25 — hasOwnProperty vs in operator
```javascript
function Animal(name) { this.name = name; }
Animal.prototype.breathe = function() { return true; };

const dog = new Animal('Rex');

console.log('name' in dog);
console.log('breathe' in dog);
console.log(dog.hasOwnProperty('name'));
console.log(dog.hasOwnProperty('breathe'));
```
**Predict all four outputs.**

<details>
<summary>✅ Answer</summary>

```javascript
'name' in dog              // true  — own property
'breathe' in dog           // true  — found on prototype chain
dog.hasOwnProperty('name')    // true  — own property
dog.hasOwnProperty('breathe') // false — inherited, not own
```

**Explanation:** The `in` operator searches the **entire prototype chain**. `hasOwnProperty()` only returns `true` for **own** properties (directly on the object, not inherited). Always use `hasOwnProperty` (or `Object.hasOwn(obj, key)` — newer, safer) when iterating objects with `for...in`.

</details>

---

## Section 7 — Senior Output Prediction Challenges

### Q26 — Tricky reduce + object spread
```javascript
const updates = [
  { key: 'name',  value: 'Alice'  },
  { key: 'role',  value: 'Admin'  },
  { key: 'name',  value: 'Alicia' }, // duplicate key!
];
const merged = updates.reduce((acc, { key, value }) => ({
  ...acc, [key]: value
}), {});
console.log(merged);
```
**What is `merged`? What happens to the duplicate key?**

<details>
<summary>✅ Answer</summary>

```javascript
{ name: 'Alicia', role: 'Admin' }
```

**Explanation:** Spread in reduce processes updates **in order**. The second `name: 'Alicia'` overwrites the first `name: 'Alice'`. Last write wins. Note: `{ ...acc, [key]: value }` creates a **new object** each iteration (immutable accumulation) — vs `acc[key] = value; return acc` which mutates. Both produce the same result, but the spread version is safer in functional patterns.

</details>

---

### Q27 — map() + filter() + sort() chain output
```javascript
const employees = [
  { name: 'Alice', salary: 90000,  dept: 'Eng' },
  { name: 'Bob',   salary: 75000,  dept: 'HR'  },
  { name: 'Carol', salary: 105000, dept: 'Eng' },
  { name: 'Dave',  salary: 68000,  dept: 'HR'  },
  { name: 'Eve',   salary: 95000,  dept: 'Eng' },
];

const result = employees
  .filter(e => e.dept === 'Eng')
  .sort((a, b) => b.salary - a.salary)
  .map(e => `${e.name}: $${e.salary.toLocaleString()}`);

console.log(result);
```
**What is `result`?**

<details>
<summary>✅ Answer</summary>

```javascript
[
  'Carol: $105,000',
  'Eve: $95,000',
  'Alice: $90,000'
]
```

**Explanation:**
1. `filter` keeps only Eng dept: Alice, Carol, Eve
2. `sort((a,b) => b.salary - a.salary)` sorts descending by salary
3. `map` formats as a string using `toLocaleString()` (adds commas)

**Note:** `sort()` here mutates the **filtered array** (not the original), since filter returned a new array. The original `employees` is unchanged.

</details>

---

### Q28 — Deep clone vs shallow clone gotcha
```javascript
const original = {
  name: 'Alice',
  address: { city: 'London', zip: 'SW1' }
};

const shallow = { ...original };
const deep    = JSON.parse(JSON.stringify(original));

shallow.name          = 'Bob';
shallow.address.city  = 'Paris';   // mutates nested!

console.log(original.name);
console.log(original.address.city);
console.log(deep.address.city);
```
**Predict all three outputs.**

<details>
<summary>💡 Hint</summary>
Spread creates a shallow copy. Nested objects are still shared references.
</details>

<details>
<summary>✅ Answer</summary>

```javascript
original.name         // 'Alice'  — shallow copy made new top-level
original.address.city // 'Paris'  — MUTATED via shared nested reference
deep.address.city     // 'London' — deep clone is independent
```

**Explanation:** Spread (`{...obj}`) clones the top-level only. `shallow.address` and `original.address` point to the **same object** in memory. Mutating `shallow.address.city` changes `original.address.city`. `JSON.parse(JSON.stringify())` creates a truly independent clone but fails for functions, `undefined`, `Date`, `RegExp`, circular references. Use `structuredClone()` (modern) for a safe deep clone.

</details>

---

### Q29 — Array destructuring + rest
```javascript
const scores = [95, 88, 72, 65, 51, 40];
const [first, second, ...rest] = scores;

console.log(first);
console.log(second);
console.log(rest);
console.log(rest.length);
```
**What do all four logs show?**

<details>
<summary>✅ Answer</summary>

```javascript
first       = 95
second      = 88
rest        = [72, 65, 51, 40]
rest.length = 4
```

**Explanation:** Array destructuring unpacks by position. The rest parameter (`...rest`) collects all remaining elements into a new array. `rest` is always a real array — never undefined even if there are no remaining elements (would be `[]`).

</details>

---

### Q30 — Senior challenge: pipeline
```javascript
const transactions = [
  { id: 1, user: 'alice', amount: 120, type: 'credit' },
  { id: 2, user: 'bob',   amount: 45,  type: 'debit'  },
  { id: 3, user: 'alice', amount: 200, type: 'credit' },
  { id: 4, user: 'carol', amount: 80,  type: 'credit' },
  { id: 5, user: 'bob',   amount: 30,  type: 'credit' },
  { id: 6, user: 'alice', amount: 60,  type: 'debit'  },
];

const summary = transactions
  .filter(t => t.type === 'credit')
  .reduce((acc, t) => {
    acc[t.user] = (acc[t.user] || 0) + t.amount;
    return acc;
  }, {});

const topUser = Object.entries(summary)
  .sort(([, a], [, b]) => b - a)[0];

console.log(summary);
console.log(`Top user: ${topUser[0]} with $${topUser[1]}`);
```
**Predict both outputs. Explain the `([, a], [, b])` destructuring syntax.**

<details>
<summary>✅ Answer</summary>

```javascript
summary = { alice: 320, carol: 80, bob: 30 }
// alice: 120+200=320, carol: 80, bob: 30 (only credits)

'Top user: alice with $320'
```

**Explanation of `([, a], [, b])`:**
`Object.entries()` returns `[key, value]` pairs. In the sort comparator:
- `[, a]` destructures the pair — `,` skips the first element (key), `a` captures the second (value)
- `[, b]` does the same for the second pair

This is "skip destructuring" — a senior-level syntax pattern for ignoring elements you don't need.

**Full pipeline breakdown:**
1. `filter` → keeps only credits: 4 transactions
2. `reduce` → builds `{ alice: 320, carol: 80, bob: 30 }`
3. `Object.entries` → `[['alice',320], ['carol',80], ['bob',30]]`
4. `sort` descending by value → `[['alice',320], ...]`
5. `[0]` → first (highest) entry: `['alice', 320]`

</details>

---

## Bonus — Quick-fire Gotchas

### Q31 — typeof and Array.isArray
```javascript
const arr = [1, 2, 3];
console.log(typeof arr);
console.log(Array.isArray(arr));
console.log(Array.isArray({}));
console.log(Array.isArray('hello'));
```

<details>
<summary>✅ Answer</summary>

```javascript
typeof arr          // 'object' — arrays are objects in JS!
Array.isArray(arr)  // true
Array.isArray({})   // false
Array.isArray('hello') // false
```

**Always use `Array.isArray()` to check for arrays — never `typeof`.**

</details>

---

### Q32 — splice vs slice
```javascript
const arr = ['a', 'b', 'c', 'd', 'e'];
const sliced  = arr.slice(1, 3);
const spliced = arr.splice(1, 2);

console.log(arr);
console.log(sliced);
console.log(spliced);
```

<details>
<summary>✅ Answer</summary>

```javascript
// After slice (non-mutating):
sliced = ['b', 'c']
arr    = ['a', 'b', 'c', 'd', 'e']  // unchanged

// After splice (mutating — removes 2 items from index 1):
spliced = ['b', 'c']
arr     = ['a', 'd', 'e']           // MUTATED
```

**Memory trick:** s**p**lice = s**p**oils the original. s**l**ice = s**l**eaves it alone.

</details>

---

## Summary: Key Rules to Memorise

| Method | Returns | Mutates? | Use for |
|---|---|---|---|
| `map()` | New array (same length) | ❌ | Transform each item |
| `filter()` | New array (shorter) | ❌ | Keep matching items |
| `reduce()` | Single value (any type) | ❌ | Accumulate, group, build |
| `find()` | First match or `undefined` | ❌ | Find one item |
| `some()` | Boolean | ❌ | Check if any match |
| `every()` | Boolean | ❌ | Check if all match |
| `flatMap()` | New array (flattened) | ❌ | Map then flatten |
| `sort()` | Same array (sorted) | ✅ **YES** | Sort — always spread first! |
| `splice()` | Removed items | ✅ **YES** | Remove/insert in place |
| `slice()` | New sub-array | ❌ | Extract without mutating |
| `Object.assign(target)` | Target (mutated) | ✅ **YES** | Merge — use `{}` as target! |
| `{ ...obj }` | New object | ❌ | Shallow clone / merge |
| `Object.freeze()` | Same object | ✅ shallow | Immutability (shallow only) |
