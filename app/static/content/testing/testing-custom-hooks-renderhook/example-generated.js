/**
 * Generated drill snippet for: Testing custom hooks - renderHook
 * Slug: testing/testing-custom-hooks-renderhook
 */

const scenario = {
  topic: "Testing custom hooks - renderHook",
  slug: "testing/testing-custom-hooks-renderhook",
  seed: 99
};

function drillTestingCustomHooksRenderhook(input) {
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

const output = drillTestingCustomHooksRenderhook({ candidate: 'senior', mode: 'discussion' });
console.log(output);
