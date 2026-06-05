/**
 * Generated drill snippet for: CSS Grid - areas, auto-fill vs auto-fit, minmax
 * Slug: css-html/css-grid-areas-auto-fill-vs-auto-fit-minmax
 */

const scenario = {
  topic: "CSS Grid - areas, auto-fill vs auto-fit, minmax",
  slug: "css-html/css-grid-areas-auto-fill-vs-auto-fit-minmax",
  seed: 77
};

function drillCssGridAreasAutoFillVsAutoFitMinmax(input) {
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

const output = drillCssGridAreasAutoFillVsAutoFitMinmax({ candidate: 'senior', mode: 'discussion' });
console.log(output);
