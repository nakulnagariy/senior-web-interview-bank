# Responsive design — media queries, container queries

## Why interviewers ask this
"Mobile-first vs desktop-first" is table stakes. The actual differentiator at L4 is container queries — knowing precisely what problem they solve that viewport media queries structurally cannot, since that's the newest, most-commonly-half-understood piece of the responsive toolkit.

## Key concepts

**Mobile-first: `min-width` queries, breakpoints add complexity as the viewport grows.**
Write the base (no-media-query) styles for the smallest viewport, then layer `@media (min-width: ...)` rules that progressively enhance for larger screens. This is the dominant modern default because most traffic/complexity growth happens as you add capability for larger screens, and it avoids the override-fighting that desktop-first (`max-width` queries overriding a complex desktop base) tends to produce.

**Media query units: prefer `em`/`rem` breakpoints over raw `px` for one specific reason.**
Browser zoom and user font-size preferences scale `em`/`rem`-based breakpoints along with content, so a user who's increased their default font size gets layout breakpoints that shift with their actual rendered content size — a real accessibility consideration, not just a style preference. (Note: media query breakpoints specifically use the *initial* root font-size context, not the zoomed value, in some browsers — flag this as something to verify against current spec behavior rather than asserting a blanket guarantee.)

**The structural limit of media queries: they only know about the viewport, never the component's own available space.**
A `@media (min-width: 768px)` rule fires based on the **browser window's** width — it has no idea whether the component using that rule is rendered full-width, inside a narrow sidebar, or inside a resizable panel. This is the real problem container queries exist to solve: a reusable component (a card, a widget) that needs to adapt its own layout based on **the space its parent container actually gives it**, regardless of viewport width — the same card might be in a wide main area on one page and a narrow sidebar on another, and a viewport media query can't tell the difference.

**Container queries: `container-type` + `@container`.**
```css
.card-wrapper { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```
`container-type: inline-size` (or `size`) marks an ancestor as a **query container** — establishing a containment context the browser tracks for sizing purposes. `@container` rules inside then respond to *that container's* size, not the viewport's. This lets a single component define its own responsive behavior self-contained, reusable in any layout context, without the parent page needing to know or coordinate breakpoints on the component's behalf — genuinely solves the "same component, different available width" problem that media queries can't.

**Container query units: `cqw`/`cqh`/`cqi`/`cqb`.**
Analogous to viewport units (`vw`/`vh`) but relative to the **query container's** size instead of the viewport — `50cqi` is 50% of the container's inline size. Useful for fluid typography/spacing that scales with the component's own box rather than the page.

**Fluid sizing without any breakpoint at all: `clamp()`.**
`clamp(min, preferred, max)` — e.g. `font-size: clamp(1rem, 2vw + 0.5rem, 1.75rem)` — lets a value scale continuously between a floor and ceiling based on viewport (or container, via `cqi`) size, often removing the need for several discrete breakpoints just to step a font size or spacing value up and down.

## Common traps
- Describing container queries as "just media queries but for an element" without naming the actual problem they solve (viewport media queries can't see a component's actual available space in its render context).
- Forgetting `container-type` has to be set on an ancestor before `@container` rules can target it — there's a required setup step, it's not automatic.
- Not knowing container query units (`cqw`/`cqi` etc.) exist as the container-relative analog of viewport units.
- Treating `em`/`rem` vs `px` breakpoints as a style preference rather than an accessibility-scaling consideration.

## Model answers

**"When would you use a container query instead of a media query?"**
"When the component's layout needs to respond to the space its *parent* gives it, not the browser viewport — a card component that renders full-width in a main content area but narrow inside a sidebar on another page. A viewport media query can't distinguish those two cases because it only knows the window width; the card would need the same breakpoint logic duplicated and coordinated by every page that uses it. A container query lets the card component own its own responsive behavior — I mark its wrapper with `container-type: inline-size`, then write `@container` rules that respond to that container's actual width, so the component adapts correctly no matter where it's placed, with zero coordination from the parent page."

**"Why mobile-first instead of desktop-first?"**
"Starting from the smallest viewport as the unstyled base and layering `min-width` media queries for added complexity tends to avoid the override-fighting you get with desktop-first, where a complex base has to be unwound with `max-width` overrides as the viewport shrinks. It also naturally forces you to prioritize content for the most constrained case first."

## Mini code example
```css
/* mobile-first base + min-width breakpoint */
.nav { flex-direction: column; }
@media (min-width: 48em) {
  .nav { flex-direction: row; }
}

/* container query: component adapts to ITS container, not the viewport */
.card-slot {
  container-type: inline-size;
  container-name: card;
}
@container card (min-width: 400px) {
  .card { display: flex; flex-direction: row; }
}

/* fluid sizing with no breakpoint at all */
.title { font-size: clamp(1.25rem, 1rem + 1.5vw, 2.5rem); }
```

## Rapid-fire Q&A
1. **Q: What does a viewport media query actually measure?** A: The browser window's viewport size — not any individual element's available space.
2. **Q: What problem do container queries solve that media queries structurally can't?** A: A reusable component adapting to the space its own parent container gives it, independent of viewport width.
3. **Q: What CSS property turns an element into a query container?** A: `container-type` (e.g. `inline-size`).
4. **Q: Name a container-relative unit analogous to `vw`.** A: `cqw` (or `cqi` for inline-size-relative).
5. **Q: What does `clamp(min, preferred, max)` let you avoid writing?** A: Multiple discrete breakpoints just to step a single value up and down.

## Gap log (mine, to re-drill)
- [ ] Name the exact structural limitation of media queries (viewport-only, blind to a component's actual render context) before introducing container queries as the fix.
- [ ] Know the required setup step (`container-type` on an ancestor) before `@container` works — it's not automatic.
- [ ] Mention container query units (`cqw`/`cqi`) as the container-relative analog of viewport units.
- [ ] Have `clamp()` ready as the fluid-sizing alternative to breakpoint-stepped values.
