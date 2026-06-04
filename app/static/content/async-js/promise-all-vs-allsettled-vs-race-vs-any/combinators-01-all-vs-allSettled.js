/**
 * Category: Combinators
 * Question: Load independent dashboard widgets where some widgets can fail.
 *
 * Senior expectation:
 * - Use Promise.all for all-or-nothing.
 * - Use Promise.allSettled when partial success is acceptable.
 * - Mention fail-fast behavior of Promise.all.
 */

async function loadAllOrNothing(getA, getB, getC) {
  const [a, b, c] = await Promise.all([getA(), getB(), getC()]);
  return { a, b, c };
}

async function loadPartialOk(getA, getB, getC) {
  const results = await Promise.allSettled([getA(), getB(), getC()]);
  return results.map((r) => (r.status === 'fulfilled' ? r.value : null));
}

/*
 * Trade-off:
 * - Promise.all is simpler and strict.
 * - Promise.allSettled is resilient but requires per-result handling.
 */
