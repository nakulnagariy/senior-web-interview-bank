/**
 * Generated drill snippet for: Database selection - SQL vs NoSQL trade-offs
 * Slug: system-design/database-selection-sql-vs-nosql-trade-offs
 */

const scenario = {
  topic: "Database selection - SQL vs NoSQL trade-offs",
  slug: "system-design/database-selection-sql-vs-nosql-trade-offs",
  seed: 119
};

function drillDatabaseSelectionSqlVsNosqlTradeOffs(input) {
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

const output = drillDatabaseSelectionSqlVsNosqlTradeOffs({ candidate: 'senior', mode: 'discussion' });
console.log(output);
