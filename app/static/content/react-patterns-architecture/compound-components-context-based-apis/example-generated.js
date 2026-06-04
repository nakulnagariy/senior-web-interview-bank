/**
 * Generated drill snippet for: Compound components & Context-based APIs
 * Slug: react-patterns-architecture/compound-components-context-based-apis
 */

const scenario = {
  topic: "Compound components & Context-based APIs",
  slug: "react-patterns-architecture/compound-components-context-based-apis",
  seed: 60
};

function drillCompoundComponentsContextBasedApis(input) {
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

const output = drillCompoundComponentsContextBasedApis({ candidate: 'senior', mode: 'discussion' });
console.log(output);
