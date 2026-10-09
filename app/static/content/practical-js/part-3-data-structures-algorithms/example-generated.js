/**
 * Generated drill snippet for: Part 3 - Data structures & algorithms
 * Slug: practical-js/part-3-data-structures-algorithms
 */

const scenario = {
  topic: "Part 3 - Data structures & algorithms",
  slug: "practical-js/part-3-data-structures-algorithms",
  seed: 115
};

function drillPart3DataStructuresAlgorithms(input) {
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

const output = drillPart3DataStructuresAlgorithms({ candidate: 'senior', mode: 'discussion' });
console.log(output);
