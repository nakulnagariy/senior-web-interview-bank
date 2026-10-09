/**
 * Generated drill snippet for: Part 1 - JavaScript fundamentals
 * Slug: practical-js/part-1-javascript-fundamentals
 */

const scenario = {
  topic: "Part 1 - JavaScript fundamentals",
  slug: "practical-js/part-1-javascript-fundamentals",
  seed: 113
};

function drillPart1JavascriptFundamentals(input) {
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

const output = drillPart1JavascriptFundamentals({ candidate: 'senior', mode: 'discussion' });
console.log(output);
