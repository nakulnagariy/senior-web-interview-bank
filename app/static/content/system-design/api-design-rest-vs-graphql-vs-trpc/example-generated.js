/**
 * Generated drill snippet for: API design - REST vs GraphQL vs tRPC
 * Slug: system-design/api-design-rest-vs-graphql-vs-trpc
 */

const scenario = {
  topic: "API design - REST vs GraphQL vs tRPC",
  slug: "system-design/api-design-rest-vs-graphql-vs-trpc",
  seed: 116
};

function drillApiDesignRestVsGraphqlVsTrpc(input) {
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

const output = drillApiDesignRestVsGraphqlVsTrpc({ candidate: 'senior', mode: 'discussion' });
console.log(output);
