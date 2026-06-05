/**
 * Generated drill snippet for: Declaration merging & module augmentation
 * Slug: typescript/declaration-merging-module-augmentation
 */

const scenario = {
  topic: "Declaration merging & module augmentation",
  slug: "typescript/declaration-merging-module-augmentation",
  seed: 72
};

function drillDeclarationMergingModuleAugmentation(input) {
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

const output = drillDeclarationMergingModuleAugmentation({ candidate: 'senior', mode: 'discussion' });
console.log(output);
