/**
 * Generated drill snippet for: Pure functions & side effects
 * Slug: js-core/pure-functions-side-effects
 */

const scenario = {
  topic: "Pure functions & side effects",
  slug: "js-core/pure-functions-side-effects",
  seed: 16
};

function drillPureFunctionsSideEffects(input) {
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

const output = drillPureFunctionsSideEffects({ candidate: 'senior', mode: 'discussion' });
console.log(output);
