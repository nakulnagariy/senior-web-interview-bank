/**
 * Generated drill snippet for: Micro-frontend architecture
 * Slug: react-patterns-architecture/micro-frontend-architecture
 */

const scenario = {
  topic: "Micro-frontend architecture",
  slug: "react-patterns-architecture/micro-frontend-architecture",
  seed: 59
};

function drillMicroFrontendArchitecture(input) {
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

const output = drillMicroFrontendArchitecture({ candidate: 'senior', mode: 'discussion' });
console.log(output);
