/**
 * Generated drill snippet for: Prop drilling - when it becomes a problem & solutions
 * Slug: react-patterns-architecture/prop-drilling-when-it-becomes-a-problem-solutions
 */

const scenario = {
  topic: "Prop drilling - when it becomes a problem & solutions",
  slug: "react-patterns-architecture/prop-drilling-when-it-becomes-a-problem-solutions",
  seed: 64
};

function drillPropDrillingWhenItBecomesAProblemSolutions(input) {
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

const output = drillPropDrillingWhenItBecomesAProblemSolutions({ candidate: 'senior', mode: 'discussion' });
console.log(output);
