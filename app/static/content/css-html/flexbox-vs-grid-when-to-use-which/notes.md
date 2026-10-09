# Flexbox vs Grid — when to use which

## Why interviewers ask this
Both layout systems can fake each other for simple cases, so a memorized "flexbox is 1D, grid is 2D" answer doesn't differentiate anyone. The L4 bar is picking the right tool from the *content's* shape (does it have an inherent 2D structure, or does it just need to flow?), and knowing the specific features each one has that the other genuinely can't replicate well.

## Key concepts

**The real distinction: content-driven (flex) vs layout-driven (grid).**
- **Flexbox** is for a set of items that should flow along one axis and whose *sizes are determined by their content* (or flex-grow/shrink rules) — a nav bar, a button group, a row of cards that wrap. You're laying out items in relation to each other.
- **Grid** is for when you have an actual **two-dimensional structure** you want to define upfront — rows and columns both matter, and you often want to place items into specific cells regardless of source order. A page layout (header/sidebar/main/footer), a dashboard, a photo gallery with explicit tracks — you're laying out a *structure*, and items are placed within it.
The practical tell: if you find yourself fighting flexbox with wrapping + fixed widths to fake a grid, or fighting grid with a single row/column to fake a flex row, you picked the wrong one for that content's actual shape.

**Grid-specific capabilities that flexbox genuinely can't do:**
- **Named grid areas** (`grid-template-areas`) — define a layout as an ASCII-art-like map of named regions, then place items by name (`grid-area: header`), independent of source order. This is unmatched for readability on a full-page layout.
- **`repeat()` + `minmax()` + `auto-fill`/`auto-fit`** — build a responsive grid of unknown-count items without a single media query (see the dedicated CSS Grid notes for the `auto-fill` vs `auto-fit` distinction in depth).
- **Explicit row *and* column alignment simultaneously** — grid items can be aligned/sized independently on both axes at once; flexbox only fully controls one axis, the cross-axis alignment is comparatively limited.
- **Overlapping items by placement** — multiple items can be explicitly placed into overlapping grid areas/lines, which flexbox has no real equivalent for.

**Flexbox-specific capabilities Grid doesn't really replace:**
- **`flex-wrap` with content-driven sizing** — a row of tags/chips that wrap to the next line, each sized to its own content, is flexbox's natural case; replicating it in grid requires knowing the item count or faking it with `auto-fit`.
- **`flex-grow`/`flex-shrink` ratios** — distributing *remaining* space proportionally among siblings based on their own grow/shrink factors is a flexbox-native concept; grid's `fr` unit is similar but operates on track sizing, not individual item growth within a single row of varying natural sizes.
- **Simple one-axis centering/spacing** — `justify-content`/`align-items` on a single flex row is less conceptual overhead than defining a grid for the same one-dimensional case.

**They compose — this is often the actually-correct senior answer.**
Real layouts frequently nest both: CSS Grid for the page-level 2D structure (header/sidebar/main/footer), and Flexbox *inside* individual grid cells for 1D content flow (a toolbar inside the header, a button row inside a card). Don't present it as an either/or choice for an entire page — name the composition as the mature default.

## Common traps
- Reducing the answer to "flex is 1D, grid is 2D" with no concrete example of why that matters.
- Not knowing grid-specific features (named areas, `auto-fill`/`auto-fit`, two-axis simultaneous alignment) that flexbox can't replicate.
- Implying you must pick one for an entire page, instead of naming the common Grid-for-structure + Flexbox-for-content-flow composition.
- Forgetting `gap` works identically in both — it's not a reason to choose one over the other.

## Model answers

**"When would you use Grid over Flexbox for a card layout?"**
"It depends on whether the cards need to align on both rows and columns simultaneously, or whether they just need to flow and wrap based on their own content size. If I need a strict 2D structure — say, every card in a row needs to match height with cards in other rows, and I want responsive column counts without writing media queries — I'd reach for Grid with `repeat(auto-fit, minmax(240px, 1fr))`. If it's really just a flowing row of items whose sizes are mostly content-driven and I don't care about strict row/column alignment across the whole set, Flexbox with `flex-wrap` is simpler and has less conceptual overhead. In practice I often use both: Grid for the page-level structure, Flexbox inside a card for a content row like icon + title + action button."

**"Can't you just fake a grid with flexbox and wrapping?"**
"You can get visually close, but you lose real 2D control — items can't be explicitly placed into named areas or specific cells independent of source order, and cross-axis alignment on both dimensions at once isn't something flexbox was built for. If the layout is genuinely two-dimensional — a page template, a dashboard — faking it with flex-wrap usually means fighting fixed widths and breakpoints that Grid's `grid-template-areas` or `auto-fit`/`minmax()` would handle natively."

## Mini code example
```css
/* Grid: page-level 2D structure, named areas */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 220px 1fr;
  gap: 1rem;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* Flexbox: content flow INSIDE the header cell */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
```

## Rapid-fire Q&A
1. **Q: In one sentence, what decides flex vs grid?** A: Whether the content needs to flow along one axis (flex) or the layout has a real 2D structure to define upfront (grid).
2. **Q: Name one layout capability only Grid has.** A: Named grid areas (`grid-template-areas`) with placement independent of source order.
3. **Q: Name one capability Flexbox handles more naturally than Grid.** A: Content-driven wrapping of unknown-count items with individual `flex-grow`/`flex-shrink` ratios.
4. **Q: Does `gap` work the same way in both?** A: Yes — not a differentiator between them.
5. **Q: Is nesting Flexbox inside a Grid cell (or vice versa) a bad sign?** A: No — it's the common, mature real-world pattern.

## Gap log (mine, to re-drill)
- [ ] Go beyond "1D vs 2D" — give a concrete feature each one has that the other can't replicate (named areas / auto-fit vs content-driven wrap + grow ratios).
- [ ] Present Grid-for-structure + Flexbox-for-content-flow composition as the default answer, not an either/or choice.
- [ ] Have one real worked example ready (page template) rather than an abstract comparison.
