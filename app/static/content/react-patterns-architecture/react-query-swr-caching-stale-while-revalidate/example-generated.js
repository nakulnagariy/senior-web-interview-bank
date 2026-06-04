/**
 * Generated drill snippet for: React Query / SWR - caching, stale-while-revalidate
 * Slug: react-patterns-architecture/react-query-swr-caching-stale-while-revalidate
 */

const scenario = {
  topic: "React Query / SWR - caching, stale-while-revalidate",
  slug: "react-patterns-architecture/react-query-swr-caching-stale-while-revalidate",
  seed: 62
};

function drillReactQuerySwrCachingStaleWhileRevalidate(input) {
  const base = {
    ...scenario,
    input,
    timestamp: Date.now()
  };

  // Keep answers interview-oriented: explicit assumptions, trade-offs, and checks.
  return {
    summary:       'Explain baseline mechanism, highlight edge case, then provide mitigation and verification plan.',
    assumptions: [
      'Inputs can be malformed in production',
      'Requirements may change after initial delivery',
      'Monitoring is required to validate correctness'
    ],
    tradeOff: 'Prefer debuggability and predictability over clever but opaque shortcuts',
    checkList: ['error path covered', 'fallback defined', 'runtime metric identified'],
    context: base
  };
}

const output = drillReactQuerySwrCachingStaleWhileRevalidate({ candidate: 'senior', mode: 'discussion' });
console.log(output);
