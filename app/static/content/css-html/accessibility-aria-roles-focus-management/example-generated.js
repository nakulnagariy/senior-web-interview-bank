/**
 * Generated drill snippet for: Accessibility - ARIA roles, focus management
 * Slug: css-html/accessibility-aria-roles-focus-management
 */

const scenario = {
  topic: "Accessibility - ARIA roles, focus management",
  slug: "css-html/accessibility-aria-roles-focus-management",
  seed: 85
};

function drillAccessibilityAriaRolesFocusManagement(input) {
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

const output = drillAccessibilityAriaRolesFocusManagement({ candidate: 'senior', mode: 'discussion' });
console.log(output);
