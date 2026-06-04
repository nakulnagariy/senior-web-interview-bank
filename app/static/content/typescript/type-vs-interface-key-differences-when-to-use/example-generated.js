/**
 * Generated drill snippet for: type vs interface - key differences & when to use
 * Slug: typescript/type-vs-interface-key-differences-when-to-use
 */

const scenario = {
  topic: "type vs interface - key differences & when to use",
  slug: "typescript/type-vs-interface-key-differences-when-to-use",
  seed: 65
};

function drillTypeVsInterfaceKeyDifferencesWhenToUse(input) {
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

const output = drillTypeVsInterfaceKeyDifferencesWhenToUse({ candidate: 'senior', mode: 'discussion' });
console.log(output);
