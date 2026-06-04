/**
 * Generated drill snippet for: Security - XSS, CSRF, CORS, CSP headers
 * Slug: performance-tooling/security-xss-csrf-cors-csp-headers
 */

const scenario = {
  topic: "Security - XSS, CSRF, CORS, CSP headers",
  slug: "performance-tooling/security-xss-csrf-cors-csp-headers",
  seed: 92
};

function drillSecurityXssCsrfCorsCspHeaders(input) {
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

const output = drillSecurityXssCsrfCorsCspHeaders({ candidate: 'senior', mode: 'discussion' });
console.log(output);
