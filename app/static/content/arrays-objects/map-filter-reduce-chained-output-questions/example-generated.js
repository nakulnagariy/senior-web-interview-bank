/**
 * Generated drill snippet for: map / filter / reduce - chained output questions
 * Slug: arrays-objects/map-filter-reduce-chained-output-questions
 */

const scenario = {
  topic: "map / filter / reduce - chained output questions",
  slug: "arrays-objects/map-filter-reduce-chained-output-questions",
  seed: 27
};

function drillMapFilterReduceChainedOutputQuestions(input) {
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

const output = drillMapFilterReduceChainedOutputQuestions({ candidate: 'senior', mode: 'discussion' });
console.log(output);
