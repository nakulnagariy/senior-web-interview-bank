/**
 * Generated drill snippet for: any vs unknown vs never - type safety implications
 * Slug: typescript/any-vs-unknown-vs-never-type-safety-implications
 */

const scenario = {
  topic: "any vs unknown vs never - type safety implications",
  slug: "typescript/any-vs-unknown-vs-never-type-safety-implications",
  seed: 69
};

function drillAnyVsUnknownVsNeverTypeSafetyImplications(input) {
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

const output = drillAnyVsUnknownVsNeverTypeSafetyImplications({ candidate: 'senior', mode: 'discussion' });
console.log(output);
