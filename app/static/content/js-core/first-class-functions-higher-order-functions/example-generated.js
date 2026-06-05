/**
 * Generated drill snippet for: First-class functions & higher-order functions
 * Slug: js-core/first-class-functions-higher-order-functions
 */

const scenario = {
  topic: "First-class functions & higher-order functions",
  slug: "js-core/first-class-functions-higher-order-functions",
  seed: 17
};

function drillFirstClassFunctionsHigherOrderFunctions(input) {
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

const output = drillFirstClassFunctionsHigherOrderFunctions({ candidate: 'senior', mode: 'discussion' });
console.log(output);
