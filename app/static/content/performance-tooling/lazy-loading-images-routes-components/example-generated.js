/**
 * Generated drill snippet for: Lazy loading - images, routes, components
 * Slug: performance-tooling/lazy-loading-images-routes-components
 */

const scenario = {
  topic: "Lazy loading - images, routes, components",
  slug: "performance-tooling/lazy-loading-images-routes-components",
  seed: 90
};

function drillLazyLoadingImagesRoutesComponents(input) {
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

const output = drillLazyLoadingImagesRoutesComponents({ candidate: 'senior', mode: 'discussion' });
console.log(output);
