/**
 * Generated drill snippet for: this keyword - 4 binding rules
 * Slug: js-core/this-keyword-4-binding-rules
 */

const scenario = {
  topic: "this keyword - 4 binding rules",
  slug: "js-core/this-keyword-4-binding-rules",
  seed: 6
};

function drillThisKeyword4BindingRules(input) {
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

const output = drillThisKeyword4BindingRules({ candidate: 'senior', mode: 'discussion' });
console.log(output);
