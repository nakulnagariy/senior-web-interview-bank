# CSS Grid — areas, `auto-fill` vs `auto-fit`, `minmax()`

## Why interviewers ask this
`auto-fill` vs `auto-fit` is the single most-confused pair in CSS Grid — both produce identical results *when the container is exactly full of items*, and only diverge visibly when there's leftover space, which is exactly the scenario most interview questions probe. Getting this precisely right, with a reason, is a strong differentiator.

## Key concepts

**`grid-template-areas` — named regions, placed independent of source order.**
Define the layout as a readable ASCII map of named cells, then assign children to a name with `grid-area`. The single biggest practical benefit: the *visual* structure of the layout is readable directly from the CSS, and you can reorder the visual layout (e.g. for a different breakpoint) by just rewriting the area map — without touching HTML source order or the children's individual rules.

**`repeat(N, size)` — don't write `1fr 1fr 1fr 1fr` by hand.**
`grid-template-columns: repeat(4, 1fr)` is shorthand for four equal flexible columns. `repeat()` also accepts `auto-fill`/`auto-fit` instead of a fixed count — that's where the responsive, no-media-query grid pattern comes from.

**`minmax(min, max)` — a track's size as a range, not a fixed value.**
`minmax(240px, 1fr)` means: never shrink this track below 240px, but let it grow to fill available space up to `1fr`'s share. This is what makes a responsive grid track-sizing rule actually responsive — without `minmax`, a fixed `240px` column never grows, and a bare `1fr` column never has a sane minimum before wrapping.

**`auto-fill` vs `auto-fit` — the exact difference, stated precisely.**
Both are used as the *repeat count* in `repeat(auto-fill|auto-fit, minmax(240px, 1fr))`, and both compute how many tracks of at least the `minmax` minimum fit in the container. They diverge specifically when the container is **wider than needed to fit all actual items** at their minimum size:
- **`auto-fill`** keeps creating **empty tracks** to fill the remaining space — those empty tracks still take up track-sizing space (collapsing to their minimum width, essentially reserving space), which visually means your existing items *don't* stretch to fill the row; they stay at their minmax minimum/content size and leave gaps where the empty tracks are.
- **`auto-fit`** collapses those empty, item-less tracks to zero width, and then (because the remaining tracks are still `fr`-sized via the `max` side of `minmax`) the actual items **stretch to fill the leftover space**.
The memorable framing: use `auto-fit` when you want existing items to grow and fill the row when there's extra space (the common "responsive card grid" ask). Use `auto-fill` when you specifically want to reserve consistent-width slots — e.g. a calendar grid or a swatch grid where you don't want items to stretch even if there's room, because uniform sizing matters more than filling space.

**Explicit vs implicit grid, and `grid-auto-rows`/`grid-auto-flow`.**
Rows/columns you define via `grid-template-columns`/`-rows` are the **explicit grid**; items that overflow it create new tracks in the **implicit grid**, sized by `grid-auto-rows`/`grid-auto-columns` (default `auto`). `grid-auto-flow: dense` lets the auto-placement algorithm backfill earlier empty cells with later items (useful for masonry-like item packing), at the cost of visually reordering items away from source order — call out that trade-off if you use it.

## Common traps
- Saying `auto-fill` and `auto-fit` always look the same — they're identical only when the container holds exactly enough items to fill it; the visible difference is specifically about leftover space.
- Not being able to state which one stretches items to fill extra space (`auto-fit`) vs which one reserves empty tracks (`auto-fill`).
- Forgetting `minmax()` is what makes the pattern responsive at all — a plain `repeat(auto-fit, 240px)` without `minmax` doesn't behave the same way.
- Confusing the explicit grid (tracks you defined) with the implicit grid (auto-generated tracks for overflow items).

## Model answers

**"What's the actual difference between `auto-fill` and `auto-fit`?"**
"They compute the same number of tracks that fit the container at the `minmax` minimum, and when the container is exactly full of items, they look identical. The difference shows up when there's leftover space: `auto-fill` keeps those extra tracks in the grid as empty, collapsed-to-minimum tracks — so your actual items don't stretch, you just get visible gaps. `auto-fit` collapses those empty tracks to zero width entirely, which lets the `fr` portion of the `minmax` take over and the existing items stretch to fill the row. So for a responsive card grid where I want cards to grow and fill extra space, I use `auto-fit`; if I specifically want fixed-width slots that don't stretch — like a calendar or a swatch palette — I'd use `auto-fill`."

**"How would you build a responsive card grid with no media queries?"**
"`grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));` — each card gets a minimum of 240px, the browser fits as many columns as that allows, and because I used `auto-fit`, if there's leftover space in the row the existing cards stretch via the `1fr` max to fill it rather than leaving a gap."

## Mini code example
```css
/* responsive card grid: existing cards STRETCH to fill leftover space */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

/* fixed-width swatch grid: leftover space becomes EMPTY tracks, swatches stay uniform */
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.5rem;
}

/* named areas: visual structure readable directly in CSS */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}
.nav { grid-area: nav; }
```

## Rapid-fire Q&A
1. **Q: When do `auto-fill` and `auto-fit` look identical?** A: When the container holds exactly enough items to fill all tracks — no leftover space.
2. **Q: Which one stretches items to fill leftover row space?** A: `auto-fit`.
3. **Q: Which one keeps empty tracks reserved, leaving visible gaps?** A: `auto-fill`.
4. **Q: What does `minmax(240px, 1fr)` guarantee?** A: The track never shrinks below 240px, but can grow to its `fr` share of remaining space.
5. **Q: What's the "implicit grid"?** A: Auto-generated tracks created for items overflowing the explicitly defined grid, sized via `grid-auto-rows`/`grid-auto-columns`.

## Gap log (mine, to re-drill)
- [ ] State the `auto-fill`/`auto-fit` difference specifically in terms of leftover space — not just "they're kind of the same."
- [ ] Know exactly which one stretches items (`auto-fit`) vs reserves empty tracks (`auto-fill`), with a concrete use case for each.
- [ ] Explain why `minmax()` is the component that makes the pattern responsive, not `repeat()` alone.
- [ ] Explicit vs implicit grid distinction, and the `grid-auto-flow: dense` trade-off (visual reordering away from source order).
