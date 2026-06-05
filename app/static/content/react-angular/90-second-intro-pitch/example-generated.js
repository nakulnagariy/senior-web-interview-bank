/**
 * Generated drill snippet for: 90-second intro pitch
 * Slug: react-angular/90-second-intro-pitch
 */

const scenario = {
  topic: "90-second intro pitch",
  slug: "react-angular/90-second-intro-pitch",
  seed: 108
};

function drill90SecondIntroPitch(input) {
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

const output = drill90SecondIntroPitch({ candidate: 'senior', mode: 'discussion' });
console.log(output);
