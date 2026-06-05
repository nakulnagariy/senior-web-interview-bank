/**
 * Generated drill snippet for: useReducer - when to choose over useState
 * Slug: react-hooks/usereducer-when-to-choose-over-usestate
 */

const scenario = {
  topic: "useReducer - when to choose over useState",
  slug: "react-hooks/usereducer-when-to-choose-over-usestate",
  seed: 49
};

function drillUsereducerWhenToChooseOverUsestate(input) {
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

const output = drillUsereducerWhenToChooseOverUsestate({ candidate: 'senior', mode: 'discussion' });
console.log(output);
