/**
 * Generated drill snippet for: Event loop - call stack, microtask, macrotask
 * Slug: js-core/event-loop-call-stack-microtask-macrotask
 */

const scenario = {
  topic: "Event loop - call stack, microtask, macrotask",
  slug: "js-core/event-loop-call-stack-microtask-macrotask",
  seed: 4
};

function drillEventLoopCallStackMicrotaskMacrotask(input) {
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

const output = drillEventLoopCallStackMicrotaskMacrotask({ candidate: 'senior', mode: 'discussion' });
console.log(output);
