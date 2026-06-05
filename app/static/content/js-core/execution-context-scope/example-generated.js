/**
 * Generated drill snippet for: Execution context & scope
 * Slug: js-core/execution-context-scope
 */

const scenario = {
  topic: "Execution context & scope",
  slug: "js-core/execution-context-scope",
  seed: 8
};

function drillExecutionContextScope(input) {
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

const output = drillExecutionContextScope({ candidate: 'senior', mode: 'discussion' });
console.log(output);
