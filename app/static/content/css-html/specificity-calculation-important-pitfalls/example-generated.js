/**
 * Generated drill snippet for: Specificity - calculation, !important pitfalls
 * Slug: css-html/specificity-calculation-important-pitfalls
 */

const scenario = {
  topic: "Specificity - calculation, !important pitfalls",
  slug: "css-html/specificity-calculation-important-pitfalls",
  seed: 74
};

function drillSpecificityCalculationImportantPitfalls(input) {
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

const output = drillSpecificityCalculationImportantPitfalls({ candidate: 'senior', mode: 'discussion' });
console.log(output);
