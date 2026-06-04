/**
 * Generated drill snippet for: Error boundaries - class only, placement strategy
 * Slug: react-fundamentals/error-boundaries-class-only-placement-strategy
 */

const scenario = {
  topic: "Error boundaries - class only, placement strategy",
  slug: "react-fundamentals/error-boundaries-class-only-placement-strategy",
  seed: 44
};

function drillErrorBoundariesClassOnlyPlacementStrategy(input) {
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

const output = drillErrorBoundariesClassOnlyPlacementStrategy({ candidate: 'senior', mode: 'discussion' });
console.log(output);
