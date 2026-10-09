# Box model — content, padding, border, margin

## Why interviewers ask this
It's a fundamentals check disguised as a trivia question. The real signal isn't "can you name the four layers" — it's whether you default to `box-sizing: border-box` and can explain *why*, whether you know margin collapse rules (a constant source of real layout bugs), and whether you understand what `box-sizing` does and doesn't change.

## Key concepts

**The four layers, inside-out: content → padding → border → margin.**
`width`/`height` set the **content box** size. Padding adds space inside the border, border wraps that, margin is space *outside* the border that pushes other elements away — margin is never part of the element's own rendered box, it only affects layout spacing around it.

**`box-sizing: content-box` (default) vs `border-box` — this is the single most practical fact in the topic.**
- `content-box` (the CSS default): `width`/`height` apply to the **content box only**. Padding and border are added *on top*, so a `width: 200px` box with `padding: 20px` and `border: 2px` actually renders at 244px wide. This is the classic "why is my box bigger than I set it" bug.
- `border-box`: `width`/`height` apply to the box **including padding and border** — the content area shrinks to accommodate them, so a `width: 200px` box stays 200px no matter how much padding/border you add.
Virtually every real production codebase sets a global reset: `*, *::before, *::after { box-sizing: border-box; }` — because `border-box` makes sizing predictable and composable (you can set a percentage width and padding together without doing arithmetic). Know this is a near-universal default, and be ready to say why you'd still occasionally want `content-box` (rare — mostly legacy or a specific third-party component's assumptions).

**Margin collapse — the real layout gotcha.**
Adjacent vertical margins between **block-level siblings** collapse into a single margin equal to the *larger* of the two, not their sum — so two paragraphs each with `margin: 16px 0` sitting next to each other end up with 16px between them, not 32px. This also happens between a parent and its first/last child if nothing separates them (no border, padding, `overflow`, or established BFC). Common fixes/avoidances: give the parent `padding-top`/`overflow: hidden` (or any BFC-establishing property) to prevent collapsing with children, or just use `gap` in a flex/grid container instead of margins between siblings — `gap` never collapses, which is a real reason modern layouts prefer it over margin-based spacing.

**Margins don't collapse under flex/grid.**
This is a frequently-missed nuance: margin collapse is specifically a block-formatting-context (normal flow) behavior. Flex items and grid items do **not** collapse margins against each other — which is part of why `gap` became the preferred spacing mechanism once Flexbox/Grid were available; you get predictable spacing without needing to reason about collapse at all.

**Negative margins are a real, intentional tool — not just a bug.**
A negative margin can pull an element outside its normal box (overlapping a sibling, or extending past a parent's edge) — used deliberately for things like a card that bleeds slightly past its container, or classic centering/alignment tricks before Flexbox/Grid existed. State that it's a deliberate technique with real use cases, not purely an accident to avoid.

## Common traps
- Not knowing that the CSS default is `content-box`, not `border-box`.
- Saying margin collapse "sums" the two margins instead of taking the larger one.
- Missing that margin collapse doesn't apply inside flex/grid containers.
- Treating `box-sizing: border-box` as a performance optimization rather than a sizing-predictability one.
- Forgetting that margin is outside the border and contributes zero to the element's own rendered dimensions, only to surrounding layout space.

## Model answers

**"Why does your production CSS always set `box-sizing: border-box`?"**
"Because the CSS default, `content-box`, means padding and border are added on top of a declared `width`, so a 200px box with 20px padding and a 2px border actually renders wider than 200px — which makes composing width percentages with padding error-prone. `border-box` makes `width`/`height` include padding and border, so the box stays exactly the size you declared regardless of padding/border changes. It's a near-universal reset for that predictability, applied globally with `*, *::before, *::after { box-sizing: border-box; }`."

**"Why is there only 16px, not 32px, between my two paragraphs that each have `margin: 16px`?"**
"That's margin collapse — adjacent vertical margins between block-level siblings in normal flow collapse into a single margin equal to the larger of the two, not the sum. It's specifically a normal-flow/block-formatting-context behavior, so it doesn't happen between flex or grid items — which is one reason I'd reach for `gap` in a flex or grid container instead of margins between children: it sidesteps the whole collapse question and gives predictable spacing."

## Mini code example
```css
/* near-universal production reset */
*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 200px;        /* with border-box, stays 200px total including padding+border */
  padding: 20px;
  border: 2px solid #ddd;
}

/* margin collapse: these two paragraphs end up 16px apart, not 32px */
p { margin: 16px 0; }

/* gap sidesteps collapse entirely — predictable spacing in flex/grid */
.list { display: flex; flex-direction: column; gap: 16px; }
```

## Rapid-fire Q&A
1. **Q: What's the CSS default for `box-sizing`?** A: `content-box`.
2. **Q: With `border-box`, does adding padding change the element's declared width?** A: No — the content area shrinks to accommodate it, total width stays as declared.
3. **Q: Two block siblings have `margin-bottom: 10px` and `margin-top: 20px` — what's the gap between them?** A: 20px (the larger margin), not 30px.
4. **Q: Does margin collapse apply between flex items?** A: No — only in normal block flow.
5. **Q: Is a negative margin always a bug?** A: No — it's a deliberate technique for overlap/bleed effects.

## Gap log (mine, to re-drill)
- [ ] State the CSS default is `content-box`, and explain precisely why `border-box` is the near-universal production reset.
- [ ] Margin collapse = larger-of-two, not sum — and only in normal flow, not flex/grid.
- [ ] Prefer `gap` over sibling margins in flex/grid layouts, and explain why (no collapse ambiguity).
- [ ] Negative margins are a deliberate tool, not automatically a mistake.
