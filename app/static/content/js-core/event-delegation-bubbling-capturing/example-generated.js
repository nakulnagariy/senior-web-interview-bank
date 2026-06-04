/**
 * Generated drill snippet for: Event delegation, bubbling, capturing
 * Slug: js-core/event-delegation-bubbling-capturing
 */

const scenario = {
  topic: "Event delegation, bubbling, capturing",
  slug: "js-core/event-delegation-bubbling-capturing",
  seed: 18
};

function drillEventDelegationBubblingCapturing(input) {
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

const output = drillEventDelegationBubblingCapturing({ candidate: 'senior', mode: 'discussion' });
console.log(output);
