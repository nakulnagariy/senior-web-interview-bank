/**
 * Generated drill snippet for: Design a rate limiter
 * Slug: system-design/design-a-rate-limiter
 */

const scenario = {
  topic: "Design a rate limiter",
  slug: "system-design/design-a-rate-limiter",
  seed: 114
};

function drillDesignARateLimiter(input) {
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

const output = drillDesignARateLimiter({ candidate: 'senior', mode: 'discussion' });
console.log(output);
