# Stacking context & `z-index` gotchas

## Why interviewers ask this
"Just raise the z-index" is the single most common real-world CSS bug fix that doesn't actually work, because `z-index` only matters *within* a stacking context — and most engineers have never been forced to articulate what creates one. This question separates people who've debugged a genuine z-index bug from people who've only ever gotten lucky with trial-and-error values.

## Key concepts

**`z-index` only compares elements within the *same* stacking context — it is never a global ranking.**
A `z-index: 9999` element can still render **behind** a `z-index: 1` element if they belong to different stacking contexts, because the comparison never happens directly between them — instead, each stacking context as a *whole* is ranked against its siblings, and only then do the elements inside get compared against their own siblings. This single fact explains almost every "I raised the z-index and nothing happened" bug.

**What actually creates a new stacking context (the list to actually know):**
- The root element (`<html>`).
- `position: relative/absolute` **with** a `z-index` value other than `auto`.
- `position: fixed` or `sticky` (creates one unconditionally, no `z-index` needed).
- `opacity` less than 1.
- `transform`, `filter`, `backdrop-filter`, `perspective`, `clip-path`, `mask`, or `will-change` set to a value other than `none`/initial (several of these are easy to forget — a `transform` alone, with no positioning or z-index at all, creates a new stacking context).
- `isolation: isolate` — a property that exists for **exactly one purpose**: force a new stacking context without any other side effect, specifically to contain z-index/blending without reaching for a `transform` hack.
- `flex`/`grid` items with a `z-index` other than `auto` (even without explicit positioning).
- A few others (mix-blend-mode other than `normal`, CSS containment, `contain: layout`) that are lower-frequency interview material but worth name-dropping if you want to signal depth.

**Within one stacking context, the paint order (back to front) follows a specific algorithm — know the shape of it.**
Roughly: the context's own background/border, then descendants with negative `z-index` (lowest first), then non-positioned/`static` flow content, then positioned descendants with `z-index: auto` or `0`, then positioned descendants with positive `z-index` (highest last/on top). You don't need the full spec memorized, but you should be able to say *why* a `position: relative` element with no `z-index` set can still render on top of unpositioned sibling content — positioned content outranks static flow content even at the same implicit stacking level.

**Debugging a real z-index bug: find the ancestor stacking contexts, don't just raise the number.**
The actual fix for "my dropdown is appearing behind this other element" is almost never "increase z-index further" — it's identifying whether the dropdown's trigger (or some ancestor) is trapped inside a stacking context with a lower rank than the thing it needs to appear above, and either: lifting the dropdown's rendering out of that ancestor (e.g. via a portal, rendering it at the body level — common in React/Vue component libraries specifically to dodge this problem), or raising the *ancestor* stacking context's rank, not just the dropdown's own z-index, since the ancestor context as a whole is what gets compared against its siblings.

**`isolation: isolate` is the clean, side-effect-free tool for this — prefer it over an incidental `transform: translateZ(0)` hack.**
A common older workaround for "force a new stacking context" was applying a no-op `transform` just for its side effect of creating a stacking context — which also silently affects things like how the element composites, how `filter`/`backdrop-filter` on it behaves, and subpixel rendering. `isolation: isolate` does the one thing you actually wanted — new stacking context, nothing else — and should be the default reach for this specific need now that it's broadly supported.

## Common traps
- "Just increase the z-index" as a debugging strategy without checking whether the conflicting elements even share a stacking context.
- Not knowing `position: fixed`/`sticky` create a stacking context unconditionally, with no `z-index` needed.
- Forgetting `opacity < 1` and `transform`/`filter` create stacking contexts — a very common "why is this behind something, I never touched z-index" bug source.
- Not knowing `isolation: isolate` exists and reaching for a `transform` hack instead.
- Assuming z-index is a single global ranking across the whole page.

## Model answers

**"I set `z-index: 9999` on my dropdown and it's still rendering behind another element. Why?"**
"Z-index only ranks elements within the same stacking context — it's never a global comparison. If the dropdown or one of its ancestors is trapped inside a stacking context that itself ranks below the other element's stacking context, no z-index value on the dropdown will fix it, because the comparison happens at the stacking-context level first. I'd walk up the ancestor chain looking for anything that creates a new context — `position` with a non-auto z-index, `opacity < 1`, a `transform`/`filter`, `fixed`/`sticky` positioning — and either lift the dropdown out of that ancestor (render it at the body level, which is exactly why many component libraries portal their dropdowns/modals) or raise the ancestor context's own rank, since raising the dropdown's own z-index inside a low-ranked context changes nothing relative to content outside that context."

**"How do you force a new stacking context without any other side effects?"**
"`isolation: isolate`. It exists for exactly this purpose — before it was available, people used a throwaway `transform: translateZ(0)` to get the stacking-context side effect of `transform`, but that also silently changes compositing and how filters/subpixel rendering behave on that element. `isolation: isolate` does the one thing you actually want and nothing else."

## Mini code example
```css
/* classic trap: z-index: 9999 does nothing here */
.dropdown-trigger-wrapper {
  opacity: 0.99; /* ANY opacity < 1 creates a new stacking context — easy to miss */
}
.dropdown {
  position: absolute;
  z-index: 9999; /* only ranks within the wrapper's stacking context, not globally */
}

/* fix option 1: remove the accidental context-creating property */
.dropdown-trigger-wrapper { opacity: 1; }

/* fix option 2: force a clean, side-effect-free new context at the right level */
.app-root { isolation: isolate; }

/* fix option 3 (common in component libraries): portal the dropdown out entirely */
/* ReactDOM.createPortal(<Dropdown />, document.body) */
```

## Rapid-fire Q&A
1. **Q: Is `z-index` ever a global ranking across the whole page?** A: No — only within the same stacking context.
2. **Q: Does `position: fixed` need a `z-index` value to create a stacking context?** A: No — it creates one unconditionally.
3. **Q: Name two non-`position`-related properties that create a new stacking context.** A: `opacity < 1`, and `transform`/`filter` (any non-`none` value).
4. **Q: What's the side-effect-free way to force a new stacking context?** A: `isolation: isolate`.
5. **Q: What's usually the real fix for a z-index bug — raising the number, or something else?** A: Finding and fixing/raising the relevant ancestor stacking context (or portaling the element out), not just raising the element's own z-index.

## Gap log (mine, to re-drill)
- [ ] State unprompted: z-index only compares within the same stacking context, never globally.
- [ ] Recite the actual list of stacking-context triggers (position+z-index, fixed/sticky, opacity<1, transform/filter/etc., isolation) — not just "position with z-index."
- [ ] Debug a z-index bug by walking the ancestor chain for context-creating properties, not by raising the number further.
- [ ] Know `isolation: isolate` exists and why it's cleaner than a `transform` hack.
