/**
 * Generated drill snippet for: useRef - DOM refs vs mutable values
 * Slug: react-hooks/useref-dom-refs-vs-mutable-values
 */

const scenario = {
  topic: "useRef - DOM refs vs mutable values",
  slug: "react-hooks/useref-dom-refs-vs-mutable-values",
  seed: 47
};

function drillUserefDomRefsVsMutableValues(input) {
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

const output = drillUserefDomRefsVsMutableValues({ candidate: 'senior', mode: 'discussion' });
console.log(output);
