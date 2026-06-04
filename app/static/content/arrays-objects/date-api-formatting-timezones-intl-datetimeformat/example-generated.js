/**
 * Generated drill snippet for: Date API - formatting, timezones, Intl.DateTimeFormat
 * Slug: arrays-objects/date-api-formatting-timezones-intl-datetimeformat
 */

const scenario = {
  topic: "Date API - formatting, timezones, Intl.DateTimeFormat",
  slug: "arrays-objects/date-api-formatting-timezones-intl-datetimeformat",
  seed: 35
};

function drillDateApiFormattingTimezonesIntlDatetimeformat(input) {
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

const output = drillDateApiFormattingTimezonesIntlDatetimeformat({ candidate: 'senior', mode: 'discussion' });
console.log(output);
