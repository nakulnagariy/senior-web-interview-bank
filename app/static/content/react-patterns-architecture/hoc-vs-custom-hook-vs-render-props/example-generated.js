/**
 * Generated drill snippet for: HOC vs custom hook vs render props
 * Slug: react-patterns-architecture/hoc-vs-custom-hook-vs-render-props
 */

const scenario = {
  topic: "HOC vs custom hook vs render props",
  slug: "react-patterns-architecture/hoc-vs-custom-hook-vs-render-props",
  seed: 55
};

function drillHocVsCustomHookVsRenderProps(input) {
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

const output = drillHocVsCustomHookVsRenderProps({ candidate: 'senior', mode: 'discussion' });
console.log(output);
