# Deep Clone: structuredClone vs JSON vs lodash

## What is Deep Cloning?
- Deep cloning creates a new object with all nested objects/arrays also cloned, not just references.
- Used to avoid mutation bugs and ensure true data isolation.

## Methods

### 1. structuredClone (Native)
- Modern, built-in browser API.
- Handles most types: objects, arrays, Dates, Maps, Sets, RegExps, circular references, and more.
- Does **not** clone functions, DOM nodes, or objects with non-cloneable types.

### 2. JSON.parse(JSON.stringify(obj))
- Serializes to JSON and parses back.
- Fast and simple, but:
  - Loses functions, `undefined`, `Infinity`, `NaN`, Dates, Maps, Sets, RegExps, and circular references.
  - Only works for JSON-safe data.

### 3. lodash.cloneDeep
- Handles most JS types, including arrays, objects, Dates, Maps, Sets, and RegExps.
- Does **not** handle functions or DOM nodes.
- Handles circular references.

## Comparison Table

| Feature           | structuredClone | JSON | lodash.cloneDeep |
|-------------------|----------------|------|------------------|
| Dates             | Yes            | No   | Yes              |
| Maps/Sets         | Yes            | No   | Yes              |
| RegExp            | Yes            | No   | Yes              |
| Circular refs     | Yes            | No   | Yes              |
| Functions         | No             | No   | No               |
| Performance       | Fast           | Fast | Slower           |
| Native            | Yes            | Yes  | No (library)     |

## Example

```js
const obj = { a: 1, b: { c: 2 } };
const clone1 = structuredClone(obj);
const clone2 = JSON.parse(JSON.stringify(obj));
const clone3 = _.cloneDeep(obj);
```

### Summary
- Use `structuredClone` for modern, robust deep cloning of most types.
- Use `JSON` for simple, JSON-safe data when performance is critical and loss of non
-JSON types is acceptable.
- Use `lodash.cloneDeep` for compatibility with older environments or when you need to clone complex
- Use `structuredClone` if available and you need to handle complex/circular data.
- Use `JSON` for simple, JSON-safe data.
- Use `lodash.cloneDeep` for legacy support or when you need to handle more types than JSON.