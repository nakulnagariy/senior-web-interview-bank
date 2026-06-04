/**
 * Generated drill snippet for: MSW (Mock Service Worker) - intercepting at network level
 * Slug: testing/msw-intercepting-at-network-level
 */

const scenario = {
  topic: "MSW (Mock Service Worker) - intercepting at network level",
  slug: "testing/msw-intercepting-at-network-level",
  seed: 100
};

function drillMswInterceptingAtNetworkLevel(input) {
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

const output = drillMswInterceptingAtNetworkLevel({ candidate: 'senior', mode: 'discussion' });
console.log(output);
