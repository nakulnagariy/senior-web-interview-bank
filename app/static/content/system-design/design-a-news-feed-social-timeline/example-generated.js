/**
 * Generated drill snippet for: Design a news feed / social timeline
 * Slug: system-design/design-a-news-feed-social-timeline
 */

const scenario = {
  topic: "Design a news feed / social timeline",
  slug: "system-design/design-a-news-feed-social-timeline",
  seed: 112
};

function drillDesignANewsFeedSocialTimeline(input) {
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

const output = drillDesignANewsFeedSocialTimeline({ candidate: 'senior', mode: 'discussion' });
console.log(output);
