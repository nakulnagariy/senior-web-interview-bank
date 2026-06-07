# `map` / `filter` / `reduce` — Chained Output Questions

## Interview Lens

These questions test whether you can **trace through data transformations step-by-step** and spot subtle edge cases: falsy filtering, missing initial values in `reduce`, sparse arrays, and implicit `undefined` returns from `map`. Senior interviews focus on chained combinations and gotchas, not just knowing what each method does.

---

## Quick Reference

| Method | Returns | Length | Mutates? |
|---|---|---|---|
| `map(fn)` | New array | Same as input | No |
| `filter(fn)` | New array | ≤ input | No |
| `reduce(fn, init)` | Single value | — | No |

---

## Core Behaviour

### `map`

Transforms every element. Always returns an array of the **same length**.

```js
[1, 2, 3].map(x => x * 2)       // [2, 4, 6]
[1, 2, 3].map(x => x > 1)       // [false, true, true]
```

**Pitfall**: forgetting to `return` inside a block body returns `undefined` for every element.

```js
[1, 2, 3].map(x => { x * 2 })   // [undefined, undefined, undefined]
//                ^ no return
```

### `filter`

Keeps elements where the callback returns truthy. Returns a new array of length ≤ input.

```js
[1, 2, 3, 4].filter(x => x % 2 === 0)   // [2, 4]
[0, 1, '', 'a', null].filter(Boolean)    // [1, 'a']
```

### `reduce`

Folds an array into a single value using an accumulator.

```js
[1, 2, 3].reduce((acc, x) => acc + x, 0)   // 6
```

**Always provide an initial value.** Without it on an empty array:

```js
[].reduce((a, b) => a + b)
// TypeError: Reduce of empty array with no initial value
```

---

## Chaining Pattern

```js
const result = [1, 2, 3, 4, 5]
  .filter(x => x % 2 === 1)    // [1, 3, 5]  — keep odds
  .map(x => x * 2)             // [2, 6, 10] — double each
  .reduce((a, b) => a + b, 0); // 18         — sum
```

**Order matters.** `filter → map → reduce` is the natural pipeline: narrow the data set, transform it, then aggregate.

---

## Output Prediction Questions

### Q1 — `filter(Boolean)` removes falsy values

```js
[0, 1, 2, 3].filter(Boolean).map(x => x * 2).reduce((a, b) => a + b, 0)
```

```
filter(Boolean) → [1, 2, 3]   // 0 is falsy, removed
map(x => x * 2) → [2, 4, 6]
reduce(sum)     → 12
```

**Output: `12`**

---

### Q2 — `reduce` on empty array without initial value

```js
[].reduce((a, b) => a + b)
```

**Output: `TypeError`** — always provide an initial value when the array might be empty.

```js
[].reduce((a, b) => a + b, 0)  // safe → 0
```

---

### Q3 — Chain that filters down to nothing

```js
const arr = [1, 2, 3, 4];
arr.filter(x => x > 2).map(x => x.toString()).filter(x => x.length > 1)
```

```
filter(x > 2)       → [3, 4]
map(toString)       → ['3', '4']
filter(length > 1)  → []          // '3' and '4' are length 1
```

**Output: `[]`**

---

### Q4 — `map` with implicit `undefined`

```js
[1, 2, 3].map(x => { if (x % 2) return x * 2; }).filter(Boolean)
```

```
map:
  1 (odd)  → 2
  2 (even) → undefined   // no return branch
  3 (odd)  → 6
→ [2, undefined, 6]

filter(Boolean) removes undefined → [2, 6]
```

**Output: `[2, 6]`**

---

### Q5 — `reduce` building a new array

```js
[1, 2, 3, 4].reduce((acc, x) => acc.concat([x, x * 2]), [])
```

```
[]         → concat [1, 2]  → [1, 2]
[1, 2]     → concat [2, 4]  → [1, 2, 2, 4]
[1,2,2,4]  → concat [3, 6]  → [1, 2, 2, 4, 3, 6]
[…]        → concat [4, 8]  → [1, 2, 2, 4, 3, 6, 4, 8]
```

**Output: `[1, 2, 2, 4, 3, 6, 4, 8]`**

---

### Q6 — Chained to a primitive, then string methods

```js
[1, 2, 3].filter(x => x > 1).reduce((a, b) => a * b, 1).toString().split('')
```

```
filter(x > 1)           → [2, 3]
reduce((a,b) => a*b, 1) → 1 * 2 * 3 = 6
.toString()             → '6'
.split('')              → ['6']
```

**Output: `['6']`**

---

### Q7 — Sparse arrays in `map`

```js
const arr = [1, , 3];
arr.map(x => x * 2);
```

`map` skips holes — the hole stays a hole in the output.

**Output: `[2, <1 empty item>, 6]`**

Note: `filter` also skips holes. `reduce` skips holes too. `forEach` skips holes.

---

## Senior Pitfalls to Mention

- **`filter(Boolean)` vs `filter(x => x !== undefined)`** — `Boolean` removes all falsy values (`0`, `''`, `NaN`, `null`). Use the explicit check if `0` or `''` are valid values.
- **`map` always returns same length** — if you want to both filter and transform, `flatMap` or `reduce` is cleaner than a `map` that returns `undefined` for some elements.
- **`reduce` without initial value** — when the array has one element, that element is returned directly (callback never called). Fine for sum, dangerous if the callback has side effects.
- **Performance** — each chained method iterates the full array. For large datasets, a single `reduce` doing filter + map in one pass avoids the extra iterations. Profile before optimising.

```js
// Three passes
arr.filter(pred).map(transform).reduce(aggregate, init);

// One pass — same result
arr.reduce((acc, x) => pred(x) ? aggregate(acc, transform(x)) : acc, init);
```