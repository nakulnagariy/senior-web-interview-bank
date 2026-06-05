
---
# A junior engineer adds useMemo and useCallback everywhere "for performance." Explain precisely why this is wrong — including the actual cost these hooks carry — and give the correct decision criteria for when each genuinely helps.

## Why Adding `useMemo` and `useCallback` Everywhere Is Wrong

### 1. **What do `useMemo` and `useCallback` do?**

- **`useMemo(fn, deps)`**: Remembers (caches) the result of a calculation between renders, only recalculating if dependencies change.
- **`useCallback(fn, deps)`**: Remembers (caches) the function instance between renders, only recreating it if dependencies change.

### 2. **What’s the Actual Cost of These Hooks?**

- **Memory Overhead:**  
  React must store the cached value or function and the dependencies for every `useMemo`/`useCallback` you use.
- **Dependency Comparison:**  
  On every render, React must compare the dependencies array to decide if the cache is still valid. This comparison is not free—especially for large or complex dependencies.
- **Extra Complexity:**  
  Overusing these hooks makes code harder to read and maintain. It can hide bugs and make debugging more difficult.
- **Stale Values:**  
  If dependencies are wrong or missed, you can get bugs where your component uses outdated data.

### 3. **Why Overusing Them Hurts Performance**

- **Unnecessary Caching:**  
  If the calculation or function is cheap, caching it is more expensive than just recalculating or recreating it.
- **Wasted Work:**  
  If dependencies change often, the memoization does little or nothing, but you still pay the cost of tracking and comparing dependencies.
- **React’s Optimization:**  
  React is already very fast at creating new functions and recalculating simple values. Premature memoization can actually slow things down.

### 4. **When Should You Actually Use Them?**

#### **useMemo**
- Use **only** when:
  - The calculation is **expensive** (e.g., heavy computation, big array filtering/sorting).
  - The calculation runs **on every render** and you can avoid it if inputs haven’t changed.
- **Don’t use** for simple math, string concatenation, or small objects.

#### **useCallback**
- Use **only** when:
  - You pass a callback to a **child component** that relies on referential equality (e.g., `React.memo` or a dependency array in the child).
  - The function is **expensive to recreate** or triggers unnecessary renders in children.
- **Don’t use** for local event handlers or functions not passed to children.

### 5. **Correct Decision Criteria**

- **Is the calculation or function expensive?**  
  If not, don’t memoize.
- **Does referential equality matter?**  
  Only memoize if a child component or hook depends on the function or value not changing.
- **Are dependencies stable?**  
  If dependencies change every render, memoization is pointless.

---

## **Summary Table**

| Hook         | Use When...                                                                 | Don’t Use When...                        |
|--------------|-----------------------------------------------------------------------------|------------------------------------------|
| `useMemo`    | Expensive calculation, dependencies rarely change, value used in render      | Simple/cheap calculation, dependencies change often |
| `useCallback`| Passing function to memoized child, function is expensive to recreate        | Local handlers, not passed to children   |

---

## **In Practice**

- **Don’t**:  
  ```js
  const value = useMemo(() => a + b, [a, b]); // a + b is cheap, don’t memoize
  const handleClick = useCallback(() => setCount(c => c + 1), []); // Not needed unless passed to child
  ```
- **Do**:  
  ```js
  // Expensive calculation
  const sortedData = useMemo(() => bigData.sort(customSort), [bigData, customSort]);
  // Passing stable callback to memoized child
  const onSelect = useCallback((id) => setSelected(id), []);
  ```

---

## **Key Takeaway**

> **useMemo** and **useCallback** are performance tools, not performance guarantees.  
> **Use them only when you’ve measured a real problem or know you need referential stability.**

---

# This component tries to prevent expensive child re-renders using useCallback, but it still re-renders on every parent state change. Find all the reasons why and fix the code correctly.

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText]   = useState('');

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  const options = { theme: 'dark', size: 'lg' };

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveChild onClick={handleClick} options={options} />
    </div>
  );
}

const ExpensiveChild = React.memo(({ onClick, options }) => {
  console.log('ExpensiveChild rendered');
  return <button onClick={onClick}>Click</button>;
});
```

## 1. **Why ExpensiveChild Still Re-renders**

### **a. The `options` Object is Re-created Every Render**
- In the `Parent` component, `options` is defined as:
  ```js
  const options = { theme: 'dark', size: 'lg' };
  ```
- This creates a **new object** every time `Parent` renders.
- Even though the contents are the same, the reference is different, so `React.memo` sees `options` as changed and re-renders `ExpensiveChild`.

### **b. `handleClick` is Stable (Correctly Memoized)**
- `handleClick` is wrapped in `useCallback` with an empty dependency array, so it stays the same between renders.

### **c. State Changes in Parent**
- Whenever `count` or `text` changes, `Parent` re-renders, which causes a new `options` object to be created.

---

## 2. **How to Fix It**

### **a. Memoize the `options` Object**
- Use `useMemo` to keep the same reference for `options` unless its contents change:
  ```js
  const options = useMemo(() => ({ theme: 'dark', size: 'lg' }), []);
  ```

### **b. Confirm Child Props are Stable**
- Now, both `handleClick` and `options` are stable, so `ExpensiveChild` will only re-render if one of them changes.

---

## 3. **Corrected Code**

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText]   = useState('');

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => ({ theme: 'dark', size: 'lg' }), []);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveChild onClick={handleClick} options={options} />
    </div>
  );
}

const ExpensiveChild = React.memo(({ onClick, options }) => {
  console.log('ExpensiveChild rendered');
  return <button onClick={onClick}>Click</button>;
});
```

---

## 4. **Summary Table**

| Prop         | Before (Re-created?) | After (Memoized?) |
|--------------|----------------------|-------------------|
| handleClick  | No                   | No                |
| options      | Yes                  | No                |

---

## 5. **Extra: Custom Comparison**

If `options` is complex and you want to control when `ExpensiveChild` re-renders, you can use a custom comparison function with `React.memo`:

```js
const ExpensiveChild = React.memo(
  ({ onClick, options }) => {
    console.log('ExpensiveChild rendered');
    return <button onClick={onClick}>Click</button>;
  },
  (prevProps, nextProps) =>
    prevProps.onClick === nextProps.onClick &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
);
```

---

**Key Takeaway:**  
> Always memoize objects and arrays passed as props to memoized children, or they’ll trigger re-renders even if their contents haven’t changed.

---

---

# This useMemo has a subtle stale closure bug that only surfaces under a specific condition. Identify it, explain when it triggers, and fix it.

```jsx
function SearchResults({ query, filters }) {
  const [data, setData] = useState([]);

  const filtered = useMemo(() => {
    return data.filter(item =>
      item.name.includes(query)
    );
  }, [data]);

  return <ResultsList items={filtered} />;
}
```

## 1. **What’s the Bug?**

- The `useMemo` callback uses both `data` and `query`.
- But the dependency array is `[data]`—it does **not** include `query`.
- This means:  
  - If `query` changes but `data` does not, the memoized value is **not recalculated**.
  - The filter will use the **old value of `query`** (the one from when the memo was last recomputed).

---

## 2. **When Does It Trigger?**

- **If `query` changes but `data` stays the same**, the filter does **not** update.
- The user will see stale results that don’t match the new query.

**Example:**
1. `data` is `[ { name: "apple" }, { name: "banana" } ]`, `query` is `"a"`.
2. User changes `query` to `"b"`, but `data` is unchanged.
3. `useMemo` does **not** rerun, so `filtered` still uses the old query `"a"`.

---

## 3. **How to Fix It**

- **Add `query` to the dependency array** so the memoized value updates whenever `query` or `data` changes.

```js
const filtered = useMemo(() => {
  return data.filter(item =>
    item.name.includes(query)
  );
}, [data, query]);
```

---

## 4. **Summary Table**

| Dependency Array | When does filter update?         | Bug?         |
|------------------|----------------------------------|--------------|
| `[data]`         | Only when `data` changes         | Yes (stale)  |
| `[data, query]`  | When `data` or `query` changes   | No           |

---

## 5. **Key Takeaway**

> Always include **all variables used inside a `useMemo` or `useCallback`** in the dependency array, or you risk subtle bugs with stale values.

---

Would you like more examples of stale closure bugs or best practices for dependency arrays?