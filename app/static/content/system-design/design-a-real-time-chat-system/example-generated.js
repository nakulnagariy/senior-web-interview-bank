/**
 * Generated drill snippet for: Design a real-time chat system
 * Slug: system-design/design-a-real-time-chat-system
 */

const scenario = {
  topic: "Design a real-time chat system",
  slug: "system-design/design-a-real-time-chat-system",
  seed: 111
};

function drillDesignARealTimeChatSystem(input) {
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

const output = drillDesignARealTimeChatSystem({ candidate: 'senior', mode: 'discussion' });
console.log(output);
