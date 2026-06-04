/**
 * Generated drill snippet for: Generics - constraints, defaults, infer
 * Slug: typescript/generics-constraints-defaults-infer
 */

const scenario = {
  topic: "Generics - constraints, defaults, infer",
  slug: "typescript/generics-constraints-defaults-infer",
  seed: 66
};

function drillGenericsConstraintsDefaultsInfer(input) {
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

const output = drillGenericsConstraintsDefaultsInfer({ candidate: 'senior', mode: 'discussion' });
console.log(output);
