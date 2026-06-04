/**
 * Generated drill snippet for: Concurrency limiter (N at a time)
 * Slug: async-js/concurrency-limiter
 */

const scenario = {
  topic: "Concurrency limiter (N at a time)",
  slug: "async-js/concurrency-limiter",
  seed: 24
};

function drillConcurrencyLimiter(input) {
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

const output = drillConcurrencyLimiter({ candidate: 'senior', mode: 'discussion' });
console.log(output);
