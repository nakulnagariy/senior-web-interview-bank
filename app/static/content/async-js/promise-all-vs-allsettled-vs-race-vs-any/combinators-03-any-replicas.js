/**
 * Category: Combinators
 * Question: Query 3 replicas and use the first successful response.
 *
 * Senior expectation:
 * - Use Promise.any for first success semantics.
 * - Explain AggregateError when all promises reject.
 */

async function getFromAnyReplica(fetchers) {
  try {
    const response = await Promise.any(fetchers.map((f) => f()));
    return response;
  } catch (aggregateError) {
    return {
      error: 'All replicas failed',
      causes: aggregateError.errors || [],
    };
  }
}

/*
 * Trade-off:
 * - Great latency for replicated reads.
 * - Harder observability because many failures may be ignored if one succeeds.
 */
