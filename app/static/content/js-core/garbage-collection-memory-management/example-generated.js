/**
 * Generated drill snippet for: Garbage collection & memory management
 * Slug: js-core/garbage-collection-memory-management
 */

const scenario = {
  topic: "Garbage collection & memory management",
  slug: "js-core/garbage-collection-memory-management",
  seed: 13
};

function drillGarbageCollectionMemoryManagement(input) {
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

const output = drillGarbageCollectionMemoryManagement({ candidate: 'senior', mode: 'discussion' });
console.log(output);
