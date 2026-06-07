// Example 1: Chaining map, filter, reduce
const arr = [2, 5, 8, 11];
const result = arr
  .filter(x => x % 2 === 1)    // [5, 11]
  .map(x => x * 2)             // [10, 22]
  .reduce((a, b) => a + b, 0); // 32

// Example 2: Order matters
const arr2 = [1, 2, 3];
const res1 = arr2.map(x => x * 2).filter(x => x > 3); // [4, 6]
const res2 = arr2.filter(x => x > 1).map(x => x * 2); // [4, 6]

// Example 3: Another chain
const arr3 = [1, 2, 3, 4];
const result3 = arr3
  .map(x => x + 1)             // [2, 3, 4, 5]
  .filter(x => x % 2 === 0)    // [2, 4]
  .reduce((a, b) => a * b, 1); // 8