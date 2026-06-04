/**
 * Generated drill snippet for: Flexbox vs Grid - when to use which
 * Slug: css-html/flexbox-vs-grid-when-to-use-which
 */

const scenario = {
  topic: "Flexbox vs Grid - when to use which",
  slug: "css-html/flexbox-vs-grid-when-to-use-which",
  seed: 76
};

function drillFlexboxVsGridWhenToUseWhich(input) {
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

const output = drillFlexboxVsGridWhenToUseWhich({ candidate: 'senior', mode: 'discussion' });
console.log(output);
