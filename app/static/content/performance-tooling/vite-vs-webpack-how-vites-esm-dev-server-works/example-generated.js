/**
 * Generated drill snippet for: Vite vs Webpack - how Vite's ESM dev server works
 * Slug: performance-tooling/vite-vs-webpack-how-vites-esm-dev-server-works
 */

const scenario = {
  topic: "Vite vs Webpack - how Vite's ESM dev server works",
  slug: "performance-tooling/vite-vs-webpack-how-vites-esm-dev-server-works",
  seed: 89
};

function drillViteVsWebpackHowVitesEsmDevServerWorks(input) {
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

const output = drillViteVsWebpackHowVitesEsmDevServerWorks({ candidate: 'senior', mode: 'discussion' });
console.log(output);
