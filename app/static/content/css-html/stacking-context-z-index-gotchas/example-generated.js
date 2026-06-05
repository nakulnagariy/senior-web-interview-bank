/**
 * Generated drill snippet for: Stacking context & z-index gotchas
 * Slug: css-html/stacking-context-z-index-gotchas
 */

const scenario = {
  topic: "Stacking context & z-index gotchas",
  slug: "css-html/stacking-context-z-index-gotchas",
  seed: 82
};

function drillStackingContextZIndexGotchas(input) {
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

const output = drillStackingContextZIndexGotchas({ candidate: 'senior', mode: 'discussion' });
console.log(output);
