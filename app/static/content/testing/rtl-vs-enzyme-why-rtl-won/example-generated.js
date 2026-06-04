/**
 * Generated drill snippet for: RTL vs Enzyme - why RTL won
 * Slug: testing/rtl-vs-enzyme-why-rtl-won
 */

const scenario = {
  topic: "RTL vs Enzyme - why RTL won",
  slug: "testing/rtl-vs-enzyme-why-rtl-won",
  seed: 96
};

function drillRtlVsEnzymeWhyRtlWon(input) {
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

const output = drillRtlVsEnzymeWhyRtlWon({ candidate: 'senior', mode: 'discussion' });
console.log(output);
