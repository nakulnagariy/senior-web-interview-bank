/**
 * Generated drill snippet for: Object.freeze vs Object.seal vs const
 * Slug: arrays-objects/object-freeze-vs-object-seal-vs-const
 */

const scenario = {
  topic: "Object.freeze vs Object.seal vs const",
  slug: "arrays-objects/object-freeze-vs-object-seal-vs-const",
  seed: 30
};

function drillObjectFreezeVsObjectSealVsConst(input) {
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

const output = drillObjectFreezeVsObjectSealVsConst({ candidate: 'senior', mode: 'discussion' });
console.log(output);
