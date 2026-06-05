/**
 * Generated drill snippet for: Callback hell & pyramid of doom
 * Slug: js-core/callback-hell-pyramid-of-doom
 */

const scenario = {
  topic: "Callback hell & pyramid of doom",
  slug: "js-core/callback-hell-pyramid-of-doom",
  seed: 9
};

function drillCallbackHellPyramidOfDoom(input) {
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

const output = drillCallbackHellPyramidOfDoom({ candidate: 'senior', mode: 'discussion' });
console.log(output);
