/**
 * Generated drill snippet for: Observability - logging, metrics, tracing
 * Slug: system-design/observability-logging-metrics-tracing
 */

const scenario = {
  topic: "Observability - logging, metrics, tracing",
  slug: "system-design/observability-logging-metrics-tracing",
  seed: 118
};

function drillObservabilityLoggingMetricsTracing(input) {
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

const output = drillObservabilityLoggingMetricsTracing({ candidate: 'senior', mode: 'discussion' });
console.log(output);
