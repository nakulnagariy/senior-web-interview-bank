/**
 * Generated drill snippet for: Redux Toolkit - slices, thunks, RTK Query
 * Slug: react-patterns-architecture/redux-toolkit-slices-thunks-rtk-query
 */

const scenario = {
  topic: "Redux Toolkit - slices, thunks, RTK Query",
  slug: "react-patterns-architecture/redux-toolkit-slices-thunks-rtk-query",
  seed: 57
};

function drillReduxToolkitSlicesThunksRtkQuery(input) {
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

const output = drillReduxToolkitSlicesThunksRtkQuery({ candidate: 'senior', mode: 'discussion' });
console.log(output);
