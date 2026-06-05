/**
 * Generated drill snippet for: useContext - performance gotchas, re-render scope
 * Slug: react-hooks/usecontext-performance-gotchas-re-render-scope
 */

const scenario = {
  topic: "useContext - performance gotchas, re-render scope",
  slug: "react-hooks/usecontext-performance-gotchas-re-render-scope",
  seed: 50
};

function drillUsecontextPerformanceGotchasReRenderScope(input) {
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

const output = drillUsecontextPerformanceGotchasReRenderScope({ candidate: 'senior', mode: 'discussion' });
console.log(output);
