/**
 * Generated drill snippet for: useLayoutEffect vs useEffect - timing difference
 * Slug: react-hooks/uselayouteffect-vs-useeffect-timing-difference
 */

const scenario = {
  topic: "useLayoutEffect vs useEffect - timing difference",
  slug: "react-hooks/uselayouteffect-vs-useeffect-timing-difference",
  seed: 51
};

function drillUselayouteffectVsUseeffectTimingDifference(input) {
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

const output = drillUselayouteffectVsUseeffectTimingDifference({ candidate: 'senior', mode: 'discussion' });
console.log(output);
