/**
 * Category: Runtime Semantics
 * Question: Predict output order and explain why.
 *
 * console.log('A');
 * setTimeout(() => console.log('B'), 0);
 * Promise.resolve().then(() => console.log('C'));
 * console.log('D');
 *
 * Senior expectation:
 * - Explain call stack first, then microtasks, then macrotasks.
 * - Correct order: A, D, C, B.
 */

function microtaskOrderDemo() {
  console.log('A');
  setTimeout(() => console.log('B'), 0);
  Promise.resolve().then(() => console.log('C'));
  console.log('D');
}

/*
 * Trade-off:
 * - Microtasks improve responsiveness for promise chains.
 * - Too many chained microtasks can starve macrotasks briefly.
 */
