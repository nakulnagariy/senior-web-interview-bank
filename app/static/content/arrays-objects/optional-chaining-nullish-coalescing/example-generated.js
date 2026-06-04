/**
 * Generated drill snippet for: Optional chaining & nullish coalescing
 * Slug: arrays-objects/optional-chaining-nullish-coalescing
 */

const scenario = {
  topic: "Optional chaining & nullish coalescing",
  slug: "arrays-objects/optional-chaining-nullish-coalescing",
  seed: 34
};

function drillOptionalChainingNullishCoalescing(input) {
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

const output = drillOptionalChainingNullishCoalescing({ candidate: 'senior', mode: 'discussion' });
console.log(output);
