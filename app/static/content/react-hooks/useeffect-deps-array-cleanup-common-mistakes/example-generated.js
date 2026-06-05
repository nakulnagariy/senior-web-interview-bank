/**
 * Generated drill snippet for: useEffect - deps array, cleanup, common mistakes
 * Slug: react-hooks/useeffect-deps-array-cleanup-common-mistakes
 */

const scenario = {
  topic: "useEffect - deps array, cleanup, common mistakes",
  slug: "react-hooks/useeffect-deps-array-cleanup-common-mistakes",
  seed: 46
};

function drillUseeffectDepsArrayCleanupCommonMistakes(input) {
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

const output = drillUseeffectDepsArrayCleanupCommonMistakes({ candidate: 'senior', mode: 'discussion' });
console.log(output);
