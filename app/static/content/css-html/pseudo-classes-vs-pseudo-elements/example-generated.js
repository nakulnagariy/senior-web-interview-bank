/**
 * Generated drill snippet for: Pseudo-classes vs pseudo-elements
 * Slug: css-html/pseudo-classes-vs-pseudo-elements
 */

const scenario = {
  topic: "Pseudo-classes vs pseudo-elements",
  slug: "css-html/pseudo-classes-vs-pseudo-elements",
  seed: 79
};

function drillPseudoClassesVsPseudoElements(input) {
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

const output = drillPseudoClassesVsPseudoElements({ candidate: 'senior', mode: 'discussion' });
console.log(output);
