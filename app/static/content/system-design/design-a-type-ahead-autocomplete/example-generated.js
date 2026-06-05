/**
 * Generated drill snippet for: Design a type-ahead / autocomplete
 * Slug: system-design/design-a-type-ahead-autocomplete
 */

const scenario = {
  topic: "Design a type-ahead / autocomplete",
  slug: "system-design/design-a-type-ahead-autocomplete",
  seed: 113
};

function drillDesignATypeAheadAutocomplete(input) {
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

const output = drillDesignATypeAheadAutocomplete({ candidate: 'senior', mode: 'discussion' });
console.log(output);
