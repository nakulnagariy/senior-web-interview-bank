/**
 * Generated drill snippet for: Shallow vs deep copy patterns
 * Slug: arrays-objects/shallow-vs-deep-copy-patterns
 */

const scenario = {
  topic: "Shallow vs deep copy patterns",
  slug: "arrays-objects/shallow-vs-deep-copy-patterns",
  seed: 32
};

function drillShallowVsDeepCopyPatterns(input) {
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

const output = drillShallowVsDeepCopyPatterns({ candidate: 'senior', mode: 'discussion' });
console.log(output);
