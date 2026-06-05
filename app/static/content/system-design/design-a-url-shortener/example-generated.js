/**
 * Generated drill snippet for: Design a URL shortener
 * Slug: system-design/design-a-url-shortener
 */

const scenario = {
  topic: "Design a URL shortener",
  slug: "system-design/design-a-url-shortener",
  seed: 110
};

function drillDesignAUrlShortener(input) {
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

const output = drillDesignAUrlShortener({ candidate: 'senior', mode: 'discussion' });
console.log(output);
