# Class lifecycle vs hooks equivalents

## Interview Lens
- Focus level: Applied
- Route slug: react-fundamentals/class-lifecycle-vs-hooks-equivalents
- What interviewers are probing: design judgement, edge-case awareness, and production trade-offs.

## Core Mental Model
Class lifecycle vs hooks equivalents should be explained as a decision model, not a definition. Start from the baseline mechanism, then explain failure modes, and finally describe the production-safe pattern.

## Senior Discussion Anchors
1. What breaks first when class lifecycle vs hooks equivalents is implemented naively?
2. How does this topic affect observability, maintainability, and debugging speed?
3. Which trade-off do you pick when latency and correctness are in tension?

## Pitfalls to Mention
- Overconfidence in happy-path behavior while ignoring edge inputs.
- Missing rollback or fallback strategy in runtime error scenarios.
- Coupling API shape to current UI assumptions.

## Whiteboard Drill
1. Explain Class lifecycle vs hooks equivalents in 45 seconds using one real production example.
2. Show one anti-pattern and the corrected pattern for class-lifecycle-vs-hooks-equivalents.
3. List two metrics you would track to verify the approach in production.

## Compact Recap
Use the format: "Problem -> Constraint -> Choice -> Trade-off -> Monitoring" when answering Class lifecycle vs hooks equivalents.
