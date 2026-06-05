/**
 * Generated drill snippet for: Scalability patterns - horizontal vs vertical scaling
 * Slug: system-design/scalability-patterns-horizontal-vs-vertical-scaling
 */

const scenario = {
  topic: "Scalability patterns - horizontal vs vertical scaling",
  slug: "system-design/scalability-patterns-horizontal-vs-vertical-scaling",
  seed: 120
};

function drillScalabilityPatternsHorizontalVsVerticalScaling(input) {
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

const output = drillScalabilityPatternsHorizontalVsVerticalScaling({ candidate: 'senior', mode: 'discussion' });
console.log(output);
