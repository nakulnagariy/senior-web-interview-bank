/**
 * Question
 * You have 100 API calls to make. Using Promise.all() fires all 100 simultaneously
 * and likely gets rate-limited. Design a Promise-based concurrency limiter 
 * that processes at most N requests in parallel, without any external library.
 * 
 * The optimal approach uses a sliding window pool. Start by launching limit tasks. Each task, on completion, 
 * immediately starts the next queued task: const pool = tasks.slice(0, limit).map((task, i) => run(i)) where 
 * run(i) resolves task() then calls run(i + limit). The key insight — Promise.race() is not needed here; a 
 * self-consuming recursive chain per "worker slot" is cleaner. Error handling: wrap each task in .catch() 
 * and store results in an ordered array so the output mirrors input order regardless of completion order. 
 * A senior should note that p-limit (used in production) uses this exact pattern internally.
 * 
 * @param {Array<() => Promise>} tasks 
 * @param {number} limit 
 * @returns {Promise<Array>} 
 */
// tasks: Array of () => Promise
// limit: max number of concurrent tasks
async function limitedConcurrency(tasks, limit) {
  const results = new Array(tasks.length); // To store results in order
  let nextIndex = 0; // Next task to start

  // Worker function: picks up next task when called
  async function worker() {
    while (true) {
      const current = nextIndex++; // Atomically get next task index
      if (current >= tasks.length) break; // No more tasks

      try {
        results[current] = await tasks[current](); // Store result in order
      } catch (err) {
        results[current] = err; // Or handle as you wish (e.g., throw)
      }
    }
  }

  // Start 'limit' workers
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);

  // Wait for all workers to finish
  await Promise.all(workers);

  return results;
}

// Simulate async tasks with varying delays
const tasks = Array.from({ length: 10 }, (_, i) => () =>
  new Promise((resolve) =>
    setTimeout(() => resolve(`Task ${i} done`), Math.random() * 1000)
  )
);

limitedConcurrency(tasks, 3).then(console.log);
// Output: [ 'Task 0 done', 'Task 1 done', ..., 'Task 9 done' ]
// Results are in order, but tasks run at most 3 at a time.



/***
 * Compare Promise.all, Promise.allSettled, Promise.race, and Promise.any. 
 * For each, describe a real production scenario where it's the correct choice — not just a toy example. 
 * Then explain why using Promise.race for a timeout pattern can cause a memory leak.
 * 
 * 
 * Promise.all: parallel independent API calls where all results are required (e.g. loading a dashboard — user data + permissions + config). Fails fast on first rejection. 
 * 
 * Promise.allSettled: bulk operations where partial success is acceptable 
 * (e.g. sending notifications to 500 users — report failures without aborting successes). 
 * 
 * Promise.race:  * first-wins semantics (e.g. fetching from primary + fallback CDN). 
 * 
 *  * Imagine you’re building an app where a user clicks a button to fetch data from an API. 
 * You don’t want the user waiting indefinitely if the server is slow or the connection is spotty. 
 * You can "race" your actual data request against a timer. If the timer finishes first, you cancel the wait and show an error message.
 * 
 * const fetchData = fetch('https://example.com');
 *
 * const timeout = new Promise((_, reject) => 
 *   setTimeout(() => reject(new Error('Request timed out!')), 5000)
 * );
 * 
 * Promise.any: like race but ignores rejections — use when any success is sufficient (e.g. querying 3 replicas). 
 * 
 * const fetchFromServerA = fetch('https://example.com');
const fetchFromServerB = fetch('https://example.com');
const fetchFromServerC = fetch('https://example.com');

Promise.any([fetchFromServerA, fetchFromServerB, fetchFromServerC])
  .then(async (response) => {
    // One of the servers responded first! 
    const imageBlob = await response.blob();
    displayAvatar(imageBlob);
  })
  .catch((aggregateError) => {
    // This only runs if ALL servers fail
    console.error("All servers failed to load the avatar.", aggregateError);
  });

 * 
 *

Promise.race([fetchData, timeout])
  .then(response => {
    // The request was fast! Handle the data here.
    console.log("Success:", response);
  })
  .catch(error => {
    // Either the request failed, or it was too slow and the timeout won.
    console.error("Error:", error.message);
  });

 * 
 * Memory leak: when you do Promise.race([fetch(...), timeout(5000)]) — if the fetch wins, the timeout timer still holds a reference. 
 * If the fetch loses, the abandoned fetch response body is never consumed. The underlying request may still be in flight. 
 * Fix: use AbortController to cancel the losing branch explicitly.
 */

/**
    console.log('1');

    setTimeout(() => console.log('2'), 0);
    Promise.resolve().then(() => { 
        console.log('3'); 
        return Promise.resolve('inner'); 
    }).then(v => console.log('4', v));

    Promise.resolve().then(() => console.log('5'));

    console.log('6');

    // 1, 6, 3, 5, 4, 'inner', 2


    Sync runs first: 1, 6. 
    
    Microtask queue drains: 3 fires (first .then callback). 
    Simultaneously queued: 5 fires. 
    But the first chain returned Promise.resolve('inner') — a thenable. 
    The spec requires an extra microtask to call .then on it, then another to resolve the outer promise.
    So 4 inner fires after 5, not before. 
    The setTimeout fires last as a macrotask: 2. 
    
    Final: 1, 6, 3, 5, 4 inner, 2. This two-tick penalty was introduced deliberately by the spec to handle potentially synchronous thenables safely. In V8 you can verify with --trace-microtasks.
 */


/**
 * The Promise constructor takes an executor function that runs synchronously. 
 * Explain what happens under the hood when both resolve and reject are called in the same executor. 
 * Then explain what happens if the executor throws after calling resolve.
 * 
new Promise((resolve, reject) => { 
    resolve(1); 
    reject(new Error('too late')); // what happens? 
    // resolve(2); // what happens? 
    // throw new Error('also too late'); // what happens? 
    // });


    The first call to resolve transitions the Promise to fulfilled with value 1. 
    All subsequent calls to resolve or reject are no-ops — the spec checks the internal slot and exits immediately. 
    The throw after resolve is the dangerous part: the executor is wrapped in a try/catch by the Promise constructor, but it only converts the throw to a rejection if the promise is still pending. 
    Since it's already fulfilled, the thrown error is completely silently swallowed. No unhandled rejection warning. 
    This is a real-world footgun in async code where you throw after an early return/resolve pathway. 
    The fix: use return resolve(val) as a pattern to prevent execution from continuing.
 */

// const data = await retryWithBackoff( () => fetch('/api/data').then(r => r.json()), 3, // max retries 200 // base delay in ms ); // Retry delays: ~200ms, ~400ms, ~800ms (with jitter)

// Helper: Determine if error is retryable (network/5xx = retryable, 4xx = not)
function isRetryable(err) {
  // If fetch, check err.response.status; else, check err.status
  const status = err?.response?.status || err?.status;
  // Network errors (no status) or 5xx are retryable; 4xx are not
  if (status === undefined) return true; // Network error
  if (status >= 500) return true;        // Server error
  if (status >= 400 && status < 500) return false; // Client error
  return true;
}

// Core retry logic with exponential backoff and jitter
async function retryWithBackoff(fn, retries, baseDelay) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!isRetryable(err) || attempt === retries) throw err;
      // Exponential backoff: baseDelay * 2^attempt, with jitter (50–100%)
      const jitter = 0.5 + Math.random() * 0.5;
      const delay = baseDelay * Math.pow(2, attempt) * jitter;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}