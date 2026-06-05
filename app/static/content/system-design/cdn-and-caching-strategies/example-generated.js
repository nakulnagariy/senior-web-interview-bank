/**
 * Generated drill snippet for: CDN and caching strategies
 * Slug: system-design/cdn-and-caching-strategies
 */

const scenario = {
  topic: "CDN and caching strategies",
  slug: "system-design/cdn-and-caching-strategies",
  seed: 115
};

function drillCdnAndCachingStrategies(input) {
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

const output = drillCdnAndCachingStrategies({ candidate: 'senior', mode: 'discussion' });
console.log(output);
