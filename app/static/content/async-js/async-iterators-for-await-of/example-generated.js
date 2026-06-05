/**
 * Generated drill snippet for: Async iterators & for-await-of
 * Slug: async-js/async-iterators-for-await-of
 */

const scenario = {
  topic: "Async iterators & for-await-of",
  slug: "async-js/async-iterators-for-await-of",
  seed: 26
};

function drillAsyncIteratorsForAwaitOf(input) {
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

const output = drillAsyncIteratorsForAwaitOf({ candidate: 'senior', mode: 'discussion' });
console.log(output);
