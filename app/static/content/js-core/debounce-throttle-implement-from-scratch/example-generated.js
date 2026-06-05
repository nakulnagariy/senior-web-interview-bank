/**
 * Generated drill snippet for: Debounce & throttle - implement from scratch
 * Slug: js-core/debounce-throttle-implement-from-scratch
 */

const scenario = {
  topic: "Debounce & throttle - implement from scratch",
  slug: "js-core/debounce-throttle-implement-from-scratch",
  seed: 14
};

function drillDebounceThrottleImplementFromScratch(input) {
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

const output = drillDebounceThrottleImplementFromScratch({ candidate: 'senior', mode: 'discussion' });
console.log(output);
