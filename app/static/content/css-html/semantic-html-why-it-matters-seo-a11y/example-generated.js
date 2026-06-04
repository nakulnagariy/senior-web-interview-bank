/**
 * Generated drill snippet for: Semantic HTML - why it matters, SEO & a11y
 * Slug: css-html/semantic-html-why-it-matters-seo-a11y
 */

const scenario = {
  topic: "Semantic HTML - why it matters, SEO & a11y",
  slug: "css-html/semantic-html-why-it-matters-seo-a11y",
  seed: 83
};

function drillSemanticHtmlWhyItMattersSeoA11y(input) {
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

const output = drillSemanticHtmlWhyItMattersSeoA11y({ candidate: 'senior', mode: 'discussion' });
console.log(output);
