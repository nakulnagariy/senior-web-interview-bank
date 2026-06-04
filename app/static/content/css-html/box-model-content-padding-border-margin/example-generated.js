/**
 * Generated drill snippet for: Box model - content/padding/border/margin
 * Slug: css-html/box-model-content-padding-border-margin
 */

const scenario = {
  topic: "Box model - content/padding/border/margin",
  slug: "css-html/box-model-content-padding-border-margin",
  seed: 75
};

function drillBoxModelContentPaddingBorderMargin(input) {
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

const output = drillBoxModelContentPaddingBorderMargin({ candidate: 'senior', mode: 'discussion' });
console.log(output);
