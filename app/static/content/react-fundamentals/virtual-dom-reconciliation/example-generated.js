/**
 * Generated drill snippet for: Virtual DOM & reconciliation (diffing algo)
 * Slug: react-fundamentals/virtual-dom-reconciliation
 */

const scenario = {
  topic: "Virtual DOM & reconciliation (diffing algo)",
  slug: "react-fundamentals/virtual-dom-reconciliation",
  seed: 37
};

function drillVirtualDomReconciliation(input) {
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

const output = drillVirtualDomReconciliation({ candidate: 'senior', mode: 'discussion' });
console.log(output);
