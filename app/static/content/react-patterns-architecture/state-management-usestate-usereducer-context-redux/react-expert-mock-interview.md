# SCOR RUP React Expert Mock Interview Script

Use this for realistic senior-level practice. Each question includes what the interviewer is testing, a strong answer structure, and follow-up probes.

## Interview Setup

- Duration: 60 to 75 minutes
- Round type: Technical leadership + architecture + delivery
- Focus: Angular to React migration, micro-frontends, interoperability, Azure, CI/CD

## Q1. Walk me through your approach to migrating a large Angular app to React.

What they are testing:

- Strategy maturity
- Risk management
- Ability to deliver while migrating

Model answer structure:

1. I would avoid a big-bang rewrite and use a strangler migration.
2. I would build an inventory by domain and dependency complexity.
3. I would establish a shell layer for routing, auth, and observability.
4. I would migrate by vertical slices with feature flags and rollback.
5. I would track KPIs weekly: migrated scope, defects, release stability, lead time.

Follow-up probes:

- How do you choose the first domain to migrate?
- How do you avoid duplicate business logic in both frameworks?

## Q2. How would you keep Angular and React interoperable during transition?

What they are testing:

- Pragmatism over purity
- Boundary design

Model answer structure:

1. Prefer route-level coexistence first.
2. Use adapters only where embedding is needed.
3. Keep shared global state minimal: auth, locale, feature flags.
4. Enforce typed API contracts and unified error payloads.
5. Add telemetry correlation across both frameworks.

Follow-up probes:

- What is the biggest interop pitfall?
- How do you manage shared dependencies safely?

## Q3. Module Federation or single-spa: which would you choose?

What they are testing:

- Architecture judgment
- Ability to defend trade-offs

Model answer structure:

1. I would default to Module Federation for independently deployable remotes with shared runtime dependencies.
2. I would use single-spa if orchestration lifecycle and multi-framework bootstrapping control are dominant needs.
3. Decision inputs are team topology, release cadence, and governance capability.
4. I would define ownership contracts before implementation.

Follow-up probes:

- How do you prevent version drift in shared packages?
- What is your failure isolation strategy per remote?

## Q4. How do you ensure performance and maintainability in React at scale?

What they are testing:

- Senior engineering depth

Model answer structure:

1. Profile first, optimize second.
2. Split code by route and heavy features.
3. Use memoization selectively, only when profiling shows value.
4. Keep strict TypeScript contracts and feature-based architecture.
5. Track Web Vitals and enforce performance budgets in CI.

Follow-up probes:

- How do you diagnose unnecessary re-renders?
- What performance regressions do you gate in CI?

## Q5. What testing strategy would you enforce for this migration?

What they are testing:

- Quality ownership

Model answer structure:

1. Unit tests for business logic and utility contracts.
2. Component tests with React Testing Library for behavior, not implementation details.
3. Contract tests for shell-remote boundaries.
4. Focused E2E tests only for critical user journeys.
5. Flaky test budget and reliability targets by team.

Follow-up probes:

- How do you keep test runtime fast in CI?
- How do you test fallback behavior when a remote fails to load?

## Q6. How would you implement CI/CD for independently deployable front-end modules?

What they are testing:

- Delivery reliability
- DevOps fluency

Model answer structure:

1. Separate pipeline per remote and a pipeline for shell.
2. Common quality gates: lint, typecheck, test, bundle budget, security scan.
3. Immutable artifacts with release metadata.
4. Progressive rollout by environment and user cohort.
5. Fast rollback tied to monitored SLO breaches.

Follow-up probes:

- What would block a production release automatically?
- How would you version shell-to-remote compatibility?

## Q7. How would Azure fit into your front-end hosting strategy?

What they are testing:

- Cloud integration practicality

Model answer structure:

1. Azure Static Web Apps for static front-end hosting and preview environments.
2. App Service where runtime control needs are higher.
3. Front Door or CDN for routing and caching.
4. Application Insights for distributed telemetry and alerting.
5. Entra ID integration for enterprise auth patterns.

Follow-up probes:

- How do you propagate correlation IDs across shell and remotes?
- What metrics do you alert on post-deploy?

## Q8. Describe a migration risk you would escalate early.

What they are testing:

- Leadership and stakeholder communication

Model answer structure:

1. Hidden coupling between legacy modules is a top risk.
2. I would expose this with dependency mapping and spike migrations.
3. I would propose phased risk burn-down and clear go/no-go criteria.
4. I would communicate impact in business terms: timeline confidence and user risk.

Follow-up probes:

- What would make you pause migration for a domain?
- How do you keep stakeholders aligned when timelines move?

## Q9. How do you lead code quality across multiple teams?

What they are testing:

- Influence and standards

Model answer structure:

1. Define baseline standards: architecture rules, lint rules, testing gates.
2. Codify standards in templates and CI, not only in documents.
3. Run design reviews for cross-cutting decisions.
4. Rotate code review ownership to scale engineering judgment.

Follow-up probes:

- How do you handle disagreement on standards?
- How do you avoid slowing delivery with too much process?

## Q10. What would your first 90 days look like?

What they are testing:

- Execution readiness

Model answer structure:

1. 0 to 30: assessment, architecture target, KPI baseline.
2. 31 to 60: ship shell and first domain migration with measurable outcomes.
3. 61 to 90: scale migration playbook to multiple teams and decommission first legacy slice.

Follow-up probes:

- What specific KPI target would you commit to in 90 days?
- What dependencies do you need from platform and product teams?

## Quick Practice Prompt (Self-Drill)

Answer this in 2 minutes:

How would you migrate an enterprise Angular app with 12 domain teams to React while maintaining release cadence and minimizing customer risk?

Scoring rubric (self-evaluation):

- 0 to 2: Tool-focused only, no rollout strategy.
- 3 to 5: Good strategy but weak risk controls.
- 6 to 8: Strong migration design with delivery controls.
- 9 to 10: Strong strategy plus KPIs, stakeholder model, and rollback plan.
