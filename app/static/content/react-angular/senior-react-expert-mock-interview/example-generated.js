/**
 * Generated drill snippet for: Senior React expert mock interview
 * Slug: react-angular/senior-react-expert-mock-interview
 */

const scenario = {
  topic: "Senior React expert mock interview",
  slug: "react-angular/senior-react-expert-mock-interview",
  seed: 106
};

function drillSeniorReactExpertMockInterview(input) {
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

const output = drillSeniorReactExpertMockInterview({ candidate: 'senior', mode: 'discussion' });
console.log(output);
