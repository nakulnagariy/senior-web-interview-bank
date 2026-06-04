/**
 * Generated drill snippet for: Webpack - loaders, plugins, tree shaking, code splitting
 * Slug: performance-tooling/webpack-loaders-plugins-tree-shaking-code-splitting
 */

const scenario = {
  topic: "Webpack - loaders, plugins, tree shaking, code splitting",
  slug: "performance-tooling/webpack-loaders-plugins-tree-shaking-code-splitting",
  seed: 88
};

function drillWebpackLoadersPluginsTreeShakingCodeSplitting(input) {
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

const output = drillWebpackLoadersPluginsTreeShakingCodeSplitting({ candidate: 'senior', mode: 'discussion' });
console.log(output);
