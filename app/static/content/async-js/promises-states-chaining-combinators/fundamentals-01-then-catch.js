/**
 * Category: Fundamentals
 * Question: Implement a minimal Promise chain where .catch handles errors thrown in .then.
 *
 * Starter:
 * Promise.resolve(10)
 *   .then(v => v * 2)
 *   .then(v => {
 *     throw new Error('boom');
 *   })
 *   .catch(err => console.log(err.message));
 *
 * Senior expectation:
 * - Explain that thrown errors in .then become rejected promises.
 * - Explain why .catch is shorthand for .then(undefined, onRejected).
 * - Show propagation: each .then returns a new promise.
 */

/*
 * Correct mental model:
 * - .then callback return value resolves next promise.
 * - throw inside .then rejects next promise.
 * - .catch handles nearest unhandled rejection in chain.
 */

function demoThenCatch() {
  return Promise.resolve(10)
    .then((v) => v * 2)
    .then(() => {
      throw new Error('boom');
    })
    .catch((err) => {
      console.log('Handled:', err.message);
      return 'recovered';
    })
    .then((v) => console.log('Next value:', v));
}

/*
 * Trade-off:
 * - Recovery in catch can hide failures if overused.
 * - Prefer rethrow when caller must know the operation failed.
 */
