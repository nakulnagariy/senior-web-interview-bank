/**
 * Generated drill snippet for: Arrow function vs regular function
 * Slug: js-core/arrow-function-vs-regular-function
 */

const scenario = {
  topic: "Arrow function vs regular function",
  slug: "js-core/arrow-function-vs-regular-function",
  seed: 7
};

function drillArrowFunctionVsRegularFunction(input) {
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

const output = drillArrowFunctionVsRegularFunction({ candidate: 'senior', mode: 'discussion' });
console.log(output);
