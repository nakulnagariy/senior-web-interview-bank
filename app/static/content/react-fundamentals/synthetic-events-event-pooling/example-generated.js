/**
 * Generated drill snippet for: Synthetic events & event pooling
 * Slug: react-fundamentals/synthetic-events-event-pooling
 */

const scenario = {
  topic: "Synthetic events & event pooling",
  slug: "react-fundamentals/synthetic-events-event-pooling",
  seed: 43
};

function drillSyntheticEventsEventPooling(input) {
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

const output = drillSyntheticEventsEventPooling({ candidate: 'senior', mode: 'discussion' });
console.log(output);
