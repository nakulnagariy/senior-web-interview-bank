/**
 * Generated drill snippet for: E2E testing - Playwright / Cypress philosophy
 * Slug: testing/e2e-testing-playwright-cypress-philosophy
 */

const scenario = {
  topic: "E2E testing - Playwright / Cypress philosophy",
  slug: "testing/e2e-testing-playwright-cypress-philosophy",
  seed: 101
};

function drillE2eTestingPlaywrightCypressPhilosophy(input) {
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

const output = drillE2eTestingPlaywrightCypressPhilosophy({ candidate: 'senior', mode: 'discussion' });
console.log(output);
