/**
 * Generated drill snippet for: Responsive design - media queries, container queries
 * Slug: css-html/responsive-design-media-queries-container-queries
 */

const scenario = {
  topic: "Responsive design - media queries, container queries",
  slug: "css-html/responsive-design-media-queries-container-queries",
  seed: 78
};

function drillResponsiveDesignMediaQueriesContainerQueries(input) {
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

const output = drillResponsiveDesignMediaQueriesContainerQueries({ candidate: 'senior', mode: 'discussion' });
console.log(output);
