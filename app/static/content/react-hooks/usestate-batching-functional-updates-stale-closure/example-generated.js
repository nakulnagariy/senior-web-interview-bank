/**
 * Generated drill snippet for: useState - batching, functional updates, stale closure
 * Slug: react-hooks/usestate-batching-functional-updates-stale-closure
 */

const scenario = {
  topic: "useState - batching, functional updates, stale closure",
  slug: "react-hooks/usestate-batching-functional-updates-stale-closure",
  seed: 45
};

function drillUsestateBatchingFunctionalUpdatesStaleClosure(input) {
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

const output = drillUsestateBatchingFunctionalUpdatesStaleClosure({ candidate: 'senior', mode: 'discussion' });
console.log(output);
