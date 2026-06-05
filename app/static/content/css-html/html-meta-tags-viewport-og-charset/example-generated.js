/**
 * Generated drill snippet for: HTML meta tags - viewport, OG, charset
 * Slug: css-html/html-meta-tags-viewport-og-charset
 */

const scenario = {
  topic: "HTML meta tags - viewport, OG, charset",
  slug: "css-html/html-meta-tags-viewport-og-charset",
  seed: 84
};

function drillHtmlMetaTagsViewportOgCharset(input) {
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

const output = drillHtmlMetaTagsViewportOgCharset({ candidate: 'senior', mode: 'discussion' });
console.log(output);
