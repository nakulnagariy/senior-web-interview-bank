
| Feature | var | let | const |
| :-- | :-- | :-- | :-- |
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisting | Yes (initialized as undefined) | Yes (but not initialized) | Yes (but not initialized) |
| Re-declaration | Allowed | Not allowed in same scope | Not allowed in same scope |
| Re-assignment | Allowed | Allowed | Not allowed |
| Temporal Dead Zone | No | Yes | Yes |

--------

## Examples

### var
```js
function testVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (var is function-scoped)
}
testVar();
```

### let
```js
function testLet() {
  if (true) {
    let y = 20;
    console.log(y); // 20
  }
  // console.log(y); // ReferenceError: y is not defined (let is block-scoped)
}
testLet();
```

### const
```js
function testConst() {
  const z = 30;
  // z = 40; // TypeError: Assignment to constant variable.
  const arr = [1, 2];
  arr.push(3); // Allowed: array contents can change
  // arr = [4, 5]; // TypeError: Assignment to constant variable.
}
testConst();
```

### Hoisting Example
```js
console.log(a); // undefined (var is hoisted)
var a = 5;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;

// console.log(c); // ReferenceError: Cannot access 'c' before initialization
const c = 15;
```

### Common Interview Questions
- What is the difference between var, let, and const?

See the table above.

- What is hoisting? How does it affect var, let, and const?

var declarations are hoisted and initialized as undefined.
let and const are hoisted but not initialized, leading to a "temporal dead zone" until their declaration is evaluated.

- Can you re-declare or re-assign variables declared with var, let, or const?

var: Can re-declare and re-assign.
let: Can re-assign, but not re-declare in the same scope.
const: Cannot re-assign or re-declare.

- What is the temporal dead zone?

The period between entering a block and the actual declaration of let or const variables, where accessing them throws a ReferenceError.
What happens if you declare a variable with the same name using var and let?

```js
var x = 1;
let x = 2; // SyntaxError: Identifier 'x' has already been declared
```

- Can you change the contents of a const object or array?

Yes, you can mutate the contents, but you cannot re-assign the variable.
- Why should you avoid using var in modern JavaScript?

Because var is function-scoped and can lead to bugs due to hoisting and lack of block scope. let and const provide safer, more predictable scoping.

## 4. Advanced/Challenging Interview Questions (with Explanations)

### **1. Explain the temporal dead zone with an example.**

**Explanation:**  
The **temporal dead zone (TDZ)** is the period between entering a scope (like a block or function) and the actual declaration of a `let` or `const` variable. During the TDZ, accessing the variable will throw a `ReferenceError`.

**Example:**
```js
{
  // TDZ starts here for 'a'
  // console.log(a); // ReferenceError: Cannot access 'a' before initialization
  let a = 5; // TDZ ends here
  console.log(a); // 5
}
```
- The variable `a` exists in the scope from the start of the block, but you cannot access it until the `let a = 5;` line is executed.

---

### **2. What happens if you use `var` inside a for loop vs `let`?**

**Explanation:**  
- `var` is **function-scoped**, so the same variable is shared across all iterations of the loop.
- `let` is **block-scoped**, so a new variable is created for each iteration.

**Example:**
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2
```
- With `var`, all timeouts reference the same `i`, which is 3 after the loop ends.
- With `let`, each timeout gets its own `j` value due to block scoping.

---

### **3. How does hoisting work for function declarations vs variable declarations?**

**Explanation:**  
- **Function declarations** are hoisted **with their definitions**. You can call the function before its declaration.
- **Variable declarations** (`var`, `let`, `const`) are hoisted, but only `var` is initialized as `undefined`. `let` and `const` are not initialized, leading to the TDZ.

**Example:**
```js
foo(); // Works: "Hello"
function foo() {
  console.log("Hello");
}

console.log(a); // undefined (var is hoisted and initialized)
var a = 5;

// console.log(b); // ReferenceError (let is hoisted but not initialized)
let b = 10;
```

---

### **4. Can you shadow variables declared with `var`, `let`, or `const`?**

**Explanation:**  
**Shadowing** occurs when a variable declared within a certain scope (e.g., a block) has the same name as a variable in an outer scope.  
- `let` and `const` allow shadowing in block scopes.
- `var` is function-scoped, so shadowing only happens in nested functions, not blocks.

**Example:**
```js
let x = 1;
{
  let x = 2; // Shadows outer x
  console.log(x); // 2
}
console.log(x); // 1

function test() {
  var y = 1;
  if (true) {
    var y = 2; // Not shadowing, same variable (function-scoped)
    console.log(y); // 2
  }
  console.log(y); // 2
}
test();
```

---

### **5. What are the implications of using `const` with objects and arrays?**

**Explanation:**  
- `const` prevents **re-assignment** of the variable, but **does not make the object or array immutable**.
- You can still **mutate** the contents (add/remove properties or elements).

**Example:**
```js
const arr = [1, 2];
arr.push(3); // Allowed
console.log(arr); // [1, 2, 3]

// arr = [4, 5]; // TypeError: Assignment to constant variable.

const obj = { a: 1 };
obj.b = 2; // Allowed
console.log(obj); // { a: 1, b: 2 }

// obj = { c: 3 }; // TypeError: Assignment to constant variable.
```
- To make objects/arrays truly immutable, use `Object.freeze()` or libraries like Immutable.js.

---

### **6. How does block scoping help prevent bugs in asynchronous code?**

**Explanation:**  
- Block scoping with `let`/`const` ensures each iteration of a loop gets its own variable instance.
- This prevents classic bugs where asynchronous callbacks (like in `setTimeout`) all reference the same variable (as with `var`).

**Example:**
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2
```
- With `let`, each callback "remembers" the correct value of `j` for that iteration.

---