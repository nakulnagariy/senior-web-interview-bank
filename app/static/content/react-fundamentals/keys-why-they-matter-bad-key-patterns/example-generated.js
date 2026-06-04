/**
 * Generated drill snippet for: Keys - why they matter, bad key patterns
 * Slug: react-fundamentals/keys-why-they-matter-bad-key-patterns
 */

const scenario = {
  topic: "Keys - why they matter, bad key patterns",
  slug: "react-fundamentals/keys-why-they-matter-bad-key-patterns",
  seed: 42
};

function drillKeysWhyTheyMatterBadKeyPatterns(input) {
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

const output = drillKeysWhyTheyMatterBadKeyPatterns({ candidate: 'senior', mode: 'discussion' });
console.log(output);
