# Mapped types & conditional types

## Interview Lens
- Focus level: Advanced
- Route slug: typescript/mapped-types-conditional-types
- What interviewers are probing: design judgement, edge-case awareness, and production trade-offs.

## Core Mental Model
Mapped types & conditional types should be explained as a decision model, not a definition. Start from the baseline mechanism, then explain failure modes, and finally describe the production-safe pattern.

## Senior Discussion Anchors
1. What breaks first when mapped types & conditional types is implemented naively?
2. How does this topic affect observability, maintainability, and debugging speed?
3. Which trade-off do you pick when latency and correctness are in tension?

## Pitfalls to Mention
- Overconfidence in happy-path behavior while ignoring edge inputs.
- Missing rollback or fallback strategy in runtime error scenarios.
- Coupling API shape to current UI assumptions.

## Whiteboard Drill
1. Explain Mapped types & conditional types in 45 seconds using one real production example.
2. Show one anti-pattern and the corrected pattern for mapped-types-conditional-types.
3. List two metrics you would track to verify the approach in production.

## Compact Recap
Use the format: "Problem -> Constraint -> Choice -> Trade-off -> Monitoring" when answering Mapped types & conditional types.
