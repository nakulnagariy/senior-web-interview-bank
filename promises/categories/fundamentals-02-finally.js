/**
 * Category: Fundamentals
 * Question: Use .finally for cleanup without changing resolved value or rejection reason.
 *
 * Senior expectation:
 * - Explain that finally runs in both success and failure cases.
 * - Explain that finally does not receive value/reason.
 * - Explain that finally should not mutate success/failure flow unless it throws.
 */

async function readWithCleanup(open, close) {
  return open()
    .then((resource) => resource.read())
    .finally(() => close());
}

/*
 * If finally throws, it overrides original result and rejects chain.
 */

async function safeFinallyExample(task, cleanup) {
  return task()
    .finally(() => {
      try {
        cleanup();
      } catch (err) {
        console.error('cleanup failed', err);
      }
    });
}

/*
 * Trade-off:
 * - finally is great for cleanup but risky if cleanup throws.
 * - Defensive cleanup avoids masking the original error.
 */
