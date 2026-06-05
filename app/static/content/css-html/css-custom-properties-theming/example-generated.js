/**
 * Generated drill snippet for: CSS custom properties (variables) & theming
 * Slug: css-html/css-custom-properties-theming
 */

const scenario = {
  topic: "CSS custom properties (variables) & theming",
  slug: "css-html/css-custom-properties-theming",
  seed: 80
};

function drillCssCustomPropertiesTheming(input) {
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

const output = drillCssCustomPropertiesTheming({ candidate: 'senior', mode: 'discussion' });
console.log(output);
