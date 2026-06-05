/**
 * Generated drill snippet for: Cancellable promises & AbortController
 * Slug: async-js/cancellable-promises-abortcontroller
 */

const scenario = {
  topic: "Cancellable promises & AbortController",
  slug: "async-js/cancellable-promises-abortcontroller",
  seed: 25
};

function drillCancellablePromisesAbortcontroller(input) {
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

const output = drillCancellablePromisesAbortcontroller({ candidate: 'senior', mode: 'discussion' });
console.log(output);
