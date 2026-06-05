/**
 * Generated drill snippet for: HTTP methods & REST constraints
 * Slug: performance-tooling/http-methods-rest-constraints
 */

const scenario = {
  topic: "HTTP methods & REST constraints",
  slug: "performance-tooling/http-methods-rest-constraints",
  seed: 93
};

function drillHttpMethodsRestConstraints(input) {
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

const output = drillHttpMethodsRestConstraints({ candidate: 'senior', mode: 'discussion' });
console.log(output);
