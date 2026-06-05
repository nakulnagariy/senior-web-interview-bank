/**
 * Generated drill snippet for: Deep clone - structuredClone vs JSON vs lodash
 * Slug: js-core/deep-clone-structuredclone-vs-json-vs-lodash
 */

const scenario = {
  topic: "Deep clone - structuredClone vs JSON vs lodash",
  slug: "js-core/deep-clone-structuredclone-vs-json-vs-lodash",
  seed: 15
};

function drillDeepCloneStructuredcloneVsJsonVsLodash(input) {
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

const output = drillDeepCloneStructuredcloneVsJsonVsLodash({ candidate: 'senior', mode: 'discussion' });
console.log(output);
