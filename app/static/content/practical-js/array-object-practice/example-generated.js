/**
 * Generated drill snippet for: Array & Object practice
 * Slug: practical-js/array-object-practice
 */

const scenario = {
  topic: "Array & Object practice",
  slug: "practical-js/array-object-practice",
  seed: 112
};

function drillArrayObjectPractice(input) {
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

const output = drillArrayObjectPractice({ candidate: 'senior', mode: 'discussion' });
console.log(output);
