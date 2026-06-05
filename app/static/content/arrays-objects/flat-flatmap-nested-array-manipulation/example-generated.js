/**
 * Generated drill snippet for: flat / flatMap - nested array manipulation
 * Slug: arrays-objects/flat-flatmap-nested-array-manipulation
 */

const scenario = {
  topic: "flat / flatMap - nested array manipulation",
  slug: "arrays-objects/flat-flatmap-nested-array-manipulation",
  seed: 28
};

function drillFlatFlatmapNestedArrayManipulation(input) {
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

const output = drillFlatFlatmapNestedArrayManipulation({ candidate: 'senior', mode: 'discussion' });
console.log(output);
