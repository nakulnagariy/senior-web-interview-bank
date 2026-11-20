# Flexbox and grid

### Q: A flex container has three children. One has `flex: 1`, one has `flex: 0 0 200px`, one has no flex properties. What do the three values in the `flex` shorthand mean, and what does `flex: 1` expand to? How is the free space shared out? Why does a flex child with long text or a wide image sometimes overflow its container, and how do you fix it?

- **Asked:** 2026-10-27 · **Verdict:** Correct · **Status:** open

**My answer (as given)**
Structured as a written document with headings and formulas, not spoken. `flex` is a shorthand for `flex-grow` (share of positive free space relative to siblings), `flex-shrink` (how aggressively it shrinks when content overflows the main axis) and `flex-basis` (starting main size before growing or shrinking: px, %, em, `auto`, `content`). `flex: 1` expands to `1 1 0%`, with a note that "some browsers/spec versions evaluate this to 0 or 0px, but functionally it acts as a base size of zero".

Free space: child A is `1 1 0%`, B is `0 0 200px`, C defaults to `0 1 auto` so its basis is its content width (example 120px). Free space = container width minus the sum of the bases (0 + 200 + 120). Grow factors sum to 1, so A gets 100% of the free space; B stays 200px and C stays at its content width.

Overflow: "standard HTML block elements have a `min-width` of 0", but for flex items `min-width` defaults to `auto`, which creates an implicit minimum content size. The item will not shrink below its longest unbreakable word or fixed-width child (such as an `<img>`), ignoring `flex-shrink`. Fix: set `min-width: 0` on the flex child.

**Covered well**
- All three longhands defined correctly, including that grow is relative to siblings and shrink applies on overflow.
- `flex: 1` = `1 1 0%`, and the unspecified child defaulting to `0 1 auto`.
- The free-space calculation is right: subtract the bases, then distribute by grow ratio. A takes everything, B and C stay fixed.
- The `min-width: auto` trap is the key insight of the question, and the `min-width: 0` fix is correct. Many candidates miss this.
- Worked example with numbers makes the answer concrete.

**Gaps (note)**
- **Delivery (main problem):** this was a formatted, pasted-sounding document with headings, bullet steps and LaTeX formulas. It cannot be said out loud. The candidate is meant to answer as if speaking; an interviewer will hear a script, not understanding. Practise the same content in about 60 seconds of short sentences.
- **Hedging on a known fact:** "some browsers/spec versions evaluate this to 0 or 0px". The spec says `flex: 1` is `1 1 0%`. State it flat. (The `0%` vs `0px` difference only matters in edge cases with an indefinite container size; verify on MDN if asked.)
- **Imprecise claim:** "block elements have a `min-width` of 0". The initial value of `min-width` is `auto` for every element; for ordinary block boxes `auto` computes to `0`. Flex and grid items are the case where `auto` means the content-based minimum. Say it that way.
- **Missing other fixes for the overflow:** `overflow: hidden` (or `auto`) on the flex item also makes the automatic minimum 0; `overflow-wrap: anywhere` for long strings lets the min-content size shrink; `text-overflow: ellipsis` needs `min-width: 0` plus `overflow: hidden`. Naming just one fix sounds like a memorised trick.
- **Missing the column twin:** in `flex-direction: column` the same trap applies to height, so use `min-height: 0` (typical in a scrolling pane inside a flex column layout). In nested flex containers, the `min-width: 0` has to go on every item in the chain.
- **Missing the grid twin:** `1fr` is `minmax(auto, 1fr)`, so grid tracks have the same blow-out. Use `minmax(0, 1fr)`.
- **Missing shrink maths:** shrink is weighted by `flex-shrink × flex-basis`, not by the factor alone, so larger items give up more. The question's setup (B has shrink 0) was a chance to show what happens if the container is too small: C shrinks (down to its min-content) and B does not, and A is already at 0 basis.
- **Missing `flex-basis` rules:** `auto` means "look at `width`, else content size"; `flex-basis` wins over `width` when both are set (except `content`). Also the other shorthands: `flex: auto` = `1 1 auto`, `flex: none` = `0 0 auto`, and `flex: 1` versus `flex: 1 1 auto` give different results with different content sizes (equal widths versus content-proportional).
- **Not mentioned:** `gap` is subtracted from the free space as well; auto margins absorb free space before `justify-content` does.

**Complete answer**
"`flex` is shorthand for three things on the main axis. `flex-basis` is the starting size before any distribution. `flex-grow` says what share of the leftover space an item takes. `flex-shrink` says how it gives up space when there is not enough. `flex: 1` expands to `1 1 0%`: it can grow, it can shrink, and it starts from zero, so every item with `flex: 1` ends up with an equal share of the whole container. That is different from `flex: 1 1 auto`, where the items start from their content size and the extra space is added on top, so widths stay unequal.

In your example, A is `1 1 0%`, B is `0 0 200px`, and C is the default `0 1 auto`. I take the container width and subtract the bases: 0, 200, and C's content width, plus any `gap`. What is left is the free space. Only A has a grow factor, so A takes all of it. B is locked at 200px and C stays at its content width. If the container is too narrow instead, shrink applies: it is weighted by shrink factor times basis, so C shrinks and B does not.

Now the overflow. For a flex item, `min-width` defaults to `auto`, which means 'the minimum content size': the longest unbreakable word, or the image's natural width. For a normal block box, `auto` computes to zero, but in a flex or grid item it does not. So the item refuses to shrink below that size, whatever `flex-shrink` says, and it pushes out of the container. The fix is `min-width: 0` on the flex item. `overflow: hidden` or `auto` does the same thing, because a non-visible overflow makes the automatic minimum zero. For long strings I add `overflow-wrap: anywhere`. For ellipsis I need `min-width: 0`, `overflow: hidden` and `text-overflow: ellipsis` together. The same trap exists in a column flex layout for height, so `min-height: 0` on a scrolling pane. And in grid, `1fr` means `minmax(auto, 1fr)`, so I use `minmax(0, 1fr)`. If flex items are nested, every level in the chain needs it. I look for this first whenever someone says 'my layout is overflowing on long content'."

```css
.row { display: flex; gap: 1rem; }
.main  { flex: 1; min-width: 0; }          /* equal-share grow, allowed to shrink below content */
.side  { flex: 0 0 200px; }                /* fixed, never grows or shrinks */
.title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } /* in a min-width:0 parent */

.cols { display: grid; grid-template-columns: minmax(0, 1fr) 300px; } /* grid version of the fix */
.pane { display: flex; flex-direction: column; min-height: 0; }       /* column version */
```

**Likely follow-ups**
- What is the difference between `flex: 1` and `flex: auto`? — `1 1 0%` (equal shares of everything) versus `1 1 auto` (content size first, then share the leftover).
- Which wins, `width` or `flex-basis`? — `flex-basis`, unless it is `auto`, in which case `width` is used.
- How is shrink distributed? — Weighted by `flex-shrink × flex-basis`, then clamped by min and max sizes, and the algorithm repeats if something freezes.
- Why does `text-overflow: ellipsis` not work in my flex child? — The item's `min-width: auto` stops it from shrinking, so it never overflows its own box; add `min-width: 0` and `overflow: hidden`.
- How does grid have the same problem? — `1fr` is `minmax(auto, 1fr)`; use `minmax(0, 1fr)`.
- Why does a scrolling area inside a flex column not scroll? — Same trap on the cross axis of the layout: `min-height: auto`, so set `min-height: 0` and `overflow: auto`.

**History**
- 2026-10-27: first asked, Correct on content (basis/grow/shrink, `flex: 1`, free-space maths, `min-width: auto` trap and fix). Open because of delivery (pasted, formatted document, hedging on `0%`), the imprecise `min-width` claim, and missing alternatives (overflow, column and grid twins, shrink weighting).
