/**
 * Generated drill snippet for: Lexical vs dynamic scope
 * Slug: js-core/lexical-vs-dynamic-scope
 */

const scenario = {
  topic: "Lexical vs dynamic scope",
  slug: "js-core/lexical-vs-dynamic-scope",
  seed: 3
};

function drillLexicalVsDynamicScope(input) {
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

const output = drillLexicalVsDynamicScope({ candidate: 'senior', mode: 'discussion' });
console.log(output);
