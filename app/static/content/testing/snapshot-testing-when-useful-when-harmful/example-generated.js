/**
 * Generated drill snippet for: Snapshot testing - when useful, when harmful
 * Slug: testing/snapshot-testing-when-useful-when-harmful
 */

const scenario = {
  topic: "Snapshot testing - when useful, when harmful",
  slug: "testing/snapshot-testing-when-useful-when-harmful",
  seed: 97
};

function drillSnapshotTestingWhenUsefulWhenHarmful(input) {
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

const output = drillSnapshotTestingWhenUsefulWhenHarmful({ candidate: 'senior', mode: 'discussion' });
console.log(output);
