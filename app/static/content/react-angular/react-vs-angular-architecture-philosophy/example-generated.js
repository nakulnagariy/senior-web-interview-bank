/**
 * Generated drill snippet for: React vs Angular - architecture & philosophy
 * Slug: react-angular/react-vs-angular-architecture-philosophy
 */

const scenario = {
  topic: "React vs Angular - architecture & philosophy",
  slug: "react-angular/react-vs-angular-architecture-philosophy",
  seed: 102
};

function drillReactVsAngularArchitecturePhilosophy(input) {
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

const output = drillReactVsAngularArchitecturePhilosophy({ candidate: 'senior', mode: 'discussion' });
console.log(output);
