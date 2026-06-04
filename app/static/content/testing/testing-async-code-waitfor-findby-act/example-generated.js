/**
 * Generated drill snippet for: Testing async code - waitFor, findBy, act()
 * Slug: testing/testing-async-code-waitfor-findby-act
 */

const scenario = {
  topic: "Testing async code - waitFor, findBy, act()",
  slug: "testing/testing-async-code-waitfor-findby-act",
  seed: 98
};

function drillTestingAsyncCodeWaitforFindbyAct(input) {
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

const output = drillTestingAsyncCodeWaitforFindbyAct({ candidate: 'senior', mode: 'discussion' });
console.log(output);
