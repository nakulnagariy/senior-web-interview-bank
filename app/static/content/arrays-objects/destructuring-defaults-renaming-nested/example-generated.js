/**
 * Generated drill snippet for: Destructuring - defaults, renaming, nested
 * Slug: arrays-objects/destructuring-defaults-renaming-nested
 */

const scenario = {
  topic: "Destructuring - defaults, renaming, nested",
  slug: "arrays-objects/destructuring-defaults-renaming-nested",
  seed: 33
};

function drillDestructuringDefaultsRenamingNested(input) {
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

const output = drillDestructuringDefaultsRenamingNested({ candidate: 'senior', mode: 'discussion' });
console.log(output);
