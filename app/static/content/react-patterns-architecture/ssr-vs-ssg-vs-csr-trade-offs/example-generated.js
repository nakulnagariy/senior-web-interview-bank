/**
 * Generated drill snippet for: SSR vs SSG vs CSR trade-offs (Next.js)
 * Slug: react-patterns-architecture/ssr-vs-ssg-vs-csr-trade-offs
 */

const scenario = {
  topic: "SSR vs SSG vs CSR trade-offs (Next.js)",
  slug: "react-patterns-architecture/ssr-vs-ssg-vs-csr-trade-offs",
  seed: 63
};

function drillSsrVsSsgVsCsrTradeOffs(input) {
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

const output = drillSsrVsSsgVsCsrTradeOffs({ candidate: 'senior', mode: 'discussion' });
console.log(output);
