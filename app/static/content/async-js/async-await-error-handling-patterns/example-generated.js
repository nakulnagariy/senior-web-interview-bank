/**
 * Generated drill snippet for: async/await - error handling patterns
 * Slug: async-js/async-await-error-handling-patterns
 */

const scenario = {
  topic: "async/await - error handling patterns",
  slug: "async-js/async-await-error-handling-patterns",
  seed: 20
};

function drillAsyncAwaitErrorHandlingPatterns(input) {
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

const output = drillAsyncAwaitErrorHandlingPatterns({ candidate: 'senior', mode: 'discussion' });
console.log(output);
