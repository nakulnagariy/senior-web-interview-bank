/**
 * Generated drill snippet for: Frontend architecture - SPA vs MPA vs MFE
 * Slug: system-design/frontend-architecture-spa-vs-mpa-vs-mfe
 */

const scenario = {
  topic: "Frontend architecture - SPA vs MPA vs MFE",
  slug: "system-design/frontend-architecture-spa-vs-mpa-vs-mfe",
  seed: 109
};

function drillFrontendArchitectureSpaVsMpaVsMfe(input) {
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

const output = drillFrontendArchitectureSpaVsMpaVsMfe({ candidate: 'senior', mode: 'discussion' });
console.log(output);
