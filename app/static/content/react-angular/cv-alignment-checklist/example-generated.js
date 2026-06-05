/**
 * Generated drill snippet for: CV alignment checklist
 * Slug: react-angular/cv-alignment-checklist
 */

const scenario = {
  topic: "CV alignment checklist",
  slug: "react-angular/cv-alignment-checklist",
  seed: 107
};

function drillCvAlignmentChecklist(input) {
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

const output = drillCvAlignmentChecklist({ candidate: 'senior', mode: 'discussion' });
console.log(output);
