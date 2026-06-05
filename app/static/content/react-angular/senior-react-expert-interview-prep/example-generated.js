/**
 * Generated drill snippet for: Senior React expert interview prep
 * Slug: react-angular/senior-react-expert-interview-prep
 */

const scenario = {
  topic: "Senior React expert interview prep",
  slug: "react-angular/senior-react-expert-interview-prep",
  seed: 105
};

function drillSeniorReactExpertInterviewPrep(input) {
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

const output = drillSeniorReactExpertInterviewPrep({ candidate: 'senior', mode: 'discussion' });
console.log(output);
