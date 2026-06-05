/**
 * Generated drill snippet for: Browser rendering pipeline - parse, layout, paint, composite
 * Slug: performance-tooling/browser-rendering-pipeline-parse-layout-paint-composite
 */

const scenario = {
  topic: "Browser rendering pipeline - parse, layout, paint, composite",
  slug: "performance-tooling/browser-rendering-pipeline-parse-layout-paint-composite",
  seed: 87
};

function drillBrowserRenderingPipelineParseLayoutPaintComposite(input) {
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

const output = drillBrowserRenderingPipelineParseLayoutPaintComposite({ candidate: 'senior', mode: 'discussion' });
console.log(output);
