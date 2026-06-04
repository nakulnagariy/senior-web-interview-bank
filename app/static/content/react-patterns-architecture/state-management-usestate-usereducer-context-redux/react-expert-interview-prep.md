# SCOR RUP React Expert Interview Prep

Target role: Senior React Engineer (6+ years), leading Angular to React migration in an enterprise context.

## 1) What This Role Is Really Testing

This role is less about writing React components and more about engineering leadership during a high-risk transition.

Core signals interviewers will look for:

- You can run Angular and React in production at the same time without breaking business delivery.
- You can pick and defend a migration path with measurable checkpoints.
- You can design micro-frontends that avoid team bottlenecks and version chaos.
- You can keep quality high with tests, observability, and release controls.
- You can integrate with Azure hosting and DevOps pipelines pragmatically.

## 2) Migration Strategy You Should Present

Use a strangler-fig migration with coexistence.

### Recommended framing

1. Discovery and slicing
2. Platform foundation
3. Vertical migration by domain
4. Decommission and hardening

### 2.1 Discovery and slicing

- Build a feature inventory: business criticality, dependency graph, usage frequency, defect rate.
- Classify modules:
  - Keep in Angular for now
  - Rebuild in React
  - Wrap and expose as shared capability
- Define migration unit as a vertical slice (route + API + UI), not by component library first.

### 2.2 Platform foundation

- Establish shell responsibilities:
  - Routing orchestration
  - Auth/session handoff
  - Feature flags
  - Shared observability
- Establish contract boundaries:
  - Typed APIs
  - Shared design tokens
  - Event bus conventions
- Build compatibility adapters:
  - Angular-to-React bridge wrappers
  - Shared state sync for auth and global context only

### 2.3 Vertical migration rollout

- Start with medium complexity, high visibility domains.
- Migrate one bounded context at a time with dual-run fallback.
- Release with canary controls and rollback thresholds.

### 2.4 Decommission phase

- Remove dead Angular routes and services once KPIs stabilize.
- Freeze old module development except critical fixes.
- Track percentage migrated and legacy footprint burn-down.

## 3) Micro-Frontend Architecture Talking Points

## Decision position

For enterprise teams with independent deployment needs, use Module Federation with a stable app-shell contract. Consider single-spa only if orchestration complexity is a first-class requirement.

### Design principles

- Independent deployability per domain team.
- Runtime integration with strict version governance.
- Shared UI kit and design tokens as versioned packages.
- Minimal cross-MFE communication (events, not tight imports).

### Suggested runtime boundaries

- App shell: auth, navigation, telemetry bootstrap, route composition.
- Remote MFEs: domain UIs and local state.
- Shared platform libs: logging, API client, error boundary, feature flags.

### Failure isolation plan

- Per-remote error boundaries.
- Timeout and fallback UI for remote load failures.
- Circuit breaker for repeatedly failing remotes.

## 4) Angular and React Interoperability During Transition

Interoperability strategy you can describe:

- Route-level coexistence first, component-level embedding second.
- Wrap React modules for Angular consumption where needed.
- Keep cross-framework state narrow: auth profile, locale, feature flags.
- Standardize data fetching contracts and error schema across both stacks.

Avoid these anti-patterns:

- Shared mutable global store for everything.
- Deep cross-framework imports.
- Migrating by widget without domain ownership.

## 5) React Engineering Excellence Areas to Emphasize

### Performance

- Code splitting by route and heavy feature.
- Prevent over-rendering via memoization only where profiling confirms need.
- Cache strategy for data fetching and stale-while-revalidate behavior.
- Web Vitals and custom performance budgets in CI.

Strong senior framing:

- Start with measurement, not assumptions: LCP, INP, CLS, bundle size, and slow user flows.
- Optimize one bottleneck at a time so you can prove the impact of each change.
- Treat many React performance issues as delivery problems first: too much JavaScript, heavy images, waterfalls, poor caching, or hydration cost.
- Use React-specific tuning only after bundle, network, and rendering hotspots are identified.

Practical examples you can bring into the interview:

- Bundle work: route-based code splitting, lazy loading heavy features, tree shaking, removing unused packages, and running a bundle analyzer.
- Data work: TanStack Query for caching and request deduplication, plus `AbortController` to cancel stale requests.
- Rendering work: localize state, split large components, use `memo`, `useMemo`, and `useCallback` selectively, and virtualize long lists.
- Delivery work: CDN-backed assets, responsive images, preload only the real LCP asset, and use SSR or streaming where first paint matters.

Tools and diagnostics worth naming explicitly:

- React DevTools Profiler for slow commits and rerender causes.
- Browser Performance tab for main-thread blocking and network correlation.
- React 19 performance tracks for Scheduler, Components, and Server timelines.
- Lighthouse and Web Vitals dashboards for user-facing metrics.

Sharp interview answers:

- Profiler tab is used to record and analyze rerenders.
- A commit is the moment React applies a completed update to the DOM.
- Hide commits below a duration threshold to filter out insignificant rerenders.
- React 19 performance tracks expose React-specific work directly inside the browser Performance timeline.

### Maintainability

- Feature-first folder architecture.
- Clear separation between UI, domain logic, and data access.
- Typed contracts at all boundaries.

### Testability

- Test pyramid for frontend:
  - Fast unit tests for business logic
  - Component tests with React Testing Library
  - Contract tests for integration boundaries
  - Focused end-to-end tests for critical user journeys

## 6) Azure Hosting and CI/CD Positioning

Given the role mentions Azure ecosystem, present a practical architecture:

- Hosting options:
  - Azure Static Web Apps for front-end assets and easy staging environments
  - Azure App Service when you need tighter custom runtime control
- Edge/security:
  - Front Door or CDN for global routing and caching
  - Entra ID integration for enterprise auth
- Observability:
  - Application Insights with correlation IDs from shell to remotes

### CI/CD narrative

- Trunk-based development with short-lived branches.
- PR gates:
  - Lint, typecheck, unit tests, coverage threshold
  - Bundle size regression checks
  - Dependency and security scanning
- Deployment:
  - Per-MFE pipeline and versioned release artifacts
  - Progressive rollout (internal, canary, broader)
  - One-click rollback with immutable artifact history

## 7) Metrics You Should Bring Into Discussion

Use objective KPIs to show leadership maturity:

- Migration progress: percent routes/features moved to React
- Reliability: change failure rate, rollback frequency
- Velocity: lead time from merge to production
- Quality: escaped defects, flaky test rate
- Performance: p75/p95 page load and interaction timings

## 8) Interview Questions You Are Likely To Get

## Q1. How would you migrate Angular to React without pausing feature delivery?

Strong answer shape:

- Strangler strategy with coexistence.
- Prioritize vertical slices with clear ownership.
- Introduce shell, standards, and bridges first.
- Roll out incrementally with canary and rollback.
- Track business and technical KPIs weekly.

## Q2. Module Federation vs single-spa: what and why?

Strong answer shape:

- Module Federation for runtime shared dependencies and independently deployed remotes.
- single-spa if cross-framework orchestration is dominant and routing lifecycle control is primary.
- Decision based on team topology, deployment frequency, and governance maturity.

## Q3. How do you prevent micro-frontend sprawl?

Strong answer shape:

- Strict domain boundaries and ownership map.
- Version policy for shared libraries.
- Contract testing and architectural linting.
- Platform team guardrails plus automated checks.

## Q4. How do you ensure Angular and React modules interoperate safely?

Strong answer shape:

- Route-first coexistence.
- Shared contracts and adapter layer.
- Minimal global shared state.
- Unified auth/session/telemetry strategy.

## Q5. What does good CI/CD look like for this migration?

Strong answer shape:

- Independent MFE pipelines, common quality gates.
- Environment promotion with release metadata.
- Progressive rollout and automated rollback triggers.
- Post-deploy monitoring tied to release identifiers.

## 9) 30-60-90 Day Plan (Use This In Final Round)

### First 30 days

- Map current Angular landscape and dependency hotspots.
- Define target architecture and migration governance.
- Agree standards: TypeScript strictness, testing baseline, observability schema.

### Days 31 to 60

- Deliver shell and first production React slice.
- Establish CI/CD templates and release controls.
- Start migration scorecard and executive reporting cadence.

### Days 61 to 90

- Scale to multiple domain teams.
- Improve developer productivity and reduce bottlenecks.
- Decommission first legacy Angular slice with measured outcomes.

## 10) Red Flags To Avoid In Your Answers

- Promising a big-bang rewrite.
- Ignoring interoperability details.
- Talking only about tools, not operating model.
- No rollback or no success metrics.
- Treating micro-frontends as only a bundler setup.

## 11) High-Impact Closing Pitch (Adapt In Interview)

I lead migrations as a product and platform transformation, not a framework swap. I establish coexistence first, migrate by vertical domains, and enforce measurable engineering standards across architecture, performance, and release safety. The outcome is continuous business delivery while steadily reducing legacy risk.

## 12) Design Patterns You Should Be Ready To Explain

For detailed examples, review:

- POPULAR_DESIGN_PATTERNS_WITH_EXAMPLES.md

Highest-value patterns for this role:

- Adapter: Bridge Angular and React boundary contracts during coexistence.
- Facade: Hide multi-service orchestration behind clean domain APIs.
- Strategy: Switch business behaviors without conditional sprawl.
- Observer/Pub-Sub: Event-driven communication between shell and remotes.
- Custom Hooks and Compound Components: Scale React code quality and API ergonomics.

How to present pattern usage in interviews:

1. Describe the migration or architecture problem.
2. Choose one pattern and justify why it fits better than alternatives.
3. Show where it lives in the codebase (shell, remote, shared package, or feature module).
4. Mention trade-offs and governance (tests, lint rules, contract checks).
