/**
 * Generated drill snippet for: Class lifecycle vs hooks equivalents
 * Slug: react-fundamentals/class-lifecycle-vs-hooks-equivalents
 */

const scenario = {
  topic: "Class lifecycle vs hooks equivalents",
  slug: "react-fundamentals/class-lifecycle-vs-hooks-equivalents",
  seed: 40
};

function drillClassLifecycleVsHooksEquivalents(input) {
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

const output = drillClassLifecycleVsHooksEquivalents({ candidate: 'senior', mode: 'discussion' });
console.log(output);
