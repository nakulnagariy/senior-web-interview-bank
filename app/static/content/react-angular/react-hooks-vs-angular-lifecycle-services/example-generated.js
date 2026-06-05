/**
 * Generated drill snippet for: React hooks vs Angular lifecycle & services
 * Slug: react-angular/react-hooks-vs-angular-lifecycle-services
 */

const scenario = {
  topic: "React hooks vs Angular lifecycle & services",
  slug: "react-angular/react-hooks-vs-angular-lifecycle-services",
  seed: 103
};

function drillReactHooksVsAngularLifecycleServices(input) {
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

const output = drillReactHooksVsAngularLifecycleServices({ candidate: 'senior', mode: 'discussion' });
console.log(output);
