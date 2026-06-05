/**
 * Generated drill snippet for: WeakMap / WeakSet / WeakRef
 * Slug: js-core/weakmap-weakset-weakref
 */

const scenario = {
  topic: "WeakMap / WeakSet / WeakRef",
  slug: "js-core/weakmap-weakset-weakref",
  seed: 12
};

function drillWeakmapWeaksetWeakref(input) {
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

const output = drillWeakmapWeaksetWeakref({ candidate: 'senior', mode: 'discussion' });
console.log(output);
