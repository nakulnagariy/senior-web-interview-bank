/**
 * Generated drill snippet for: Custom hooks - design patterns & rules of hooks
 * Slug: react-hooks/custom-hooks-design-patterns-rules-of-hooks
 */

const scenario = {
  topic: "Custom hooks - design patterns & rules of hooks",
  slug: "react-hooks/custom-hooks-design-patterns-rules-of-hooks",
  seed: 53
};

function drillCustomHooksDesignPatternsRulesOfHooks(input) {
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

const output = drillCustomHooksDesignPatternsRulesOfHooks({ candidate: 'senior', mode: 'discussion' });
console.log(output);
