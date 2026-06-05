/**
 * Generated drill snippet for: Set & Map - when to use over array/object
 * Slug: arrays-objects/set-map-when-to-use-over-array-object
 */

const scenario = {
  topic: "Set & Map - when to use over array/object",
  slug: "arrays-objects/set-map-when-to-use-over-array-object",
  seed: 36
};

function drillSetMapWhenToUseOverArrayObject(input) {
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

const output = drillSetMapWhenToUseOverArrayObject({ candidate: 'senior', mode: 'discussion' });
console.log(output);
