/**
 * Generated drill snippet for: web app performance
 * Slug: performance-tooling/web-app-performance
 */

const scenario = {
  topic: "web app performance",
  slug: "performance-tooling/web-app-performance",
  seed: 96
};

function drillWebAppPerformance(input) {
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

const output = drillWebAppPerformance({ candidate: 'senior', mode: 'discussion' });
console.log(output);
