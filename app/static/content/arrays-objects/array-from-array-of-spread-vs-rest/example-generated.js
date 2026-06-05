/**
 * Generated drill snippet for: Array.from, Array.of, spread vs rest
 * Slug: arrays-objects/array-from-array-of-spread-vs-rest
 */

const scenario = {
  topic: "Array.from, Array.of, spread vs rest",
  slug: "arrays-objects/array-from-array-of-spread-vs-rest",
  seed: 29
};

function drillArrayFromArrayOfSpreadVsRest(input) {
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

const output = drillArrayFromArrayOfSpreadVsRest({ candidate: 'senior', mode: 'discussion' });
console.log(output);
