/**
 * Category: Patterns
 * Question: Run many async jobs with max N concurrency, preserve output order.
 *
 * Senior expectation:
 * - Implement worker pool/sliding window.
 * - Preserve result order by writing to indexed result array.
 */

async function mapLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let index = 0;

  async function worker() {
    while (true) {
      const current = index;
      index += 1;
      if (current >= tasks.length) return;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/*
 * Trade-off:
 * - Protects upstream APIs from overload.
 * - Slightly more complex than plain Promise.all.
 */
