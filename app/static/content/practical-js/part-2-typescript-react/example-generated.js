/**
 * Generated drill snippet for: Part 2 - TypeScript & React
 * Slug: practical-js/part-2-typescript-react
 */

const scenario = {
  topic: "Part 2 - TypeScript & React",
  slug: "practical-js/part-2-typescript-react",
  seed: 114
};

function drillPart2TypescriptReact(input) {
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

const output = drillPart2TypescriptReact({ candidate: 'senior', mode: 'discussion' });
console.log(output);
