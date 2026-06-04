/**
 * Generated drill snippet for: Prototype chain & inheritance
 * Slug: js-core/prototype-chain-inheritance
 */

const scenario = {
  topic: "Prototype chain & inheritance",
  slug: "js-core/prototype-chain-inheritance",
  seed: 5
};

function drillPrototypeChainInheritance(input) {
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

const output = drillPrototypeChainInheritance({ candidate: 'senior', mode: 'discussion' });
console.log(output);
