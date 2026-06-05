/**
 * Generated drill snippet for: Virtualization - react-window, when/why
 * Slug: performance-tooling/virtualization-react-window-when-why
 */

const scenario = {
  topic: "Virtualization - react-window, when/why",
  slug: "performance-tooling/virtualization-react-window-when-why",
  seed: 91
};

function drillVirtualizationReactWindowWhenWhy(input) {
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

const output = drillVirtualizationReactWindowWhenWhy({ candidate: 'senior', mode: 'discussion' });
console.log(output);
