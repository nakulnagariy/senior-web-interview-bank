/**
 * Generated drill snippet for: Utility types - Partial, Required, Pick, Omit, Record
 * Slug: typescript/utility-types-partial-required-pick-omit-record
 */

const scenario = {
  topic: "Utility types - Partial, Required, Pick, Omit, Record",
  slug: "typescript/utility-types-partial-required-pick-omit-record",
  seed: 67
};

function drillUtilityTypesPartialRequiredPickOmitRecord(input) {
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

const output = drillUtilityTypesPartialRequiredPickOmitRecord({ candidate: 'senior', mode: 'discussion' });
console.log(output);
