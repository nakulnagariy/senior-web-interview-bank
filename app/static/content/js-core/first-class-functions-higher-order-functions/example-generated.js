// First-class function: assign to variable
const greet = function(name) { return 'Hello, ' + name; };

// Higher-order function: takes a function as argument
function repeat(fn, n) {
  for (let i = 0; i < n; i++) fn();
}
repeat(() => console.log('Hi'), 3);

// Higher-order function: returns a function
function makeMultiplier(x) {
  return function(y) { return x * y; };
}
const triple = makeMultiplier(3);
console.log(triple(4)); // 12

// Standard library examples
[1, 2, 3].map(x => x * 2); // [2, 4, 6]
setTimeout(() => console.log('Timeout!'), 1000);