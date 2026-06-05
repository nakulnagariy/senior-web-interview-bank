/**
 * Category: Runtime Semantics
 * Question: What happens when resolve and reject are both called in executor?
 *
 * new Promise((resolve, reject) => {
 *   resolve(1);
 *   reject(new Error('too late'));
 *   throw new Error('also too late');
 * });
 *
 * Senior expectation:
 * - Promise settles once; first settle wins.
 * - Executor runs synchronously.
 * - Errors thrown after settlement do not re-settle the promise.
 */

function firstSettleWinsDemo() {
  return new Promise((resolve, reject) => {
    resolve(1);
    reject(new Error('too late'));
    throw new Error('also too late');
  }).then((v) => console.log('fulfilled with', v));
}

/*
 * Trade-off:
 * - Early settle patterns are concise.
 * - If code continues after settle, hidden bugs can be swallowed.
 * - Prefer return resolve(...) for clearer control flow.
 */
