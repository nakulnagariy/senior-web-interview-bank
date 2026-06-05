/**
 * Generated drill snippet for: Popular design patterns with examples
 * Slug: react-angular/popular-design-patterns-with-examples
 */

const scenario = {
  topic: "Popular design patterns with examples",
  slug: "react-angular/popular-design-patterns-with-examples",
  seed: 104
};

function drillPopularDesignPatternsWithExamples(input) {
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

const output = drillPopularDesignPatternsWithExamples({ candidate: 'senior', mode: 'discussion' });
console.log(output);
