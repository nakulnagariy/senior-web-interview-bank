# Pseudo-classes vs pseudo-elements

## Why interviewers ask this
Everyone knows the single-colon/double-colon mnemonic. The L4 bar is explaining *why* the distinction exists conceptually (state vs. generated content/sub-part), knowing specificity consequences, and being able to name less-common but genuinely useful members of each category rather than just `:hover` and `::before`.

## Key concepts

**Pseudo-classes select an element in a particular *state* or *position* — no new content, no new DOM.**
`:hover`, `:focus`, `:focus-visible`, `:checked`, `:disabled`, `:nth-child()`, `:first-of-type`, `:target`, `:empty` — all of these match an **existing** element based on user interaction, form state, structural position, or document state. They contribute specificity equivalent to a class (one unit).

**Pseudo-elements represent a *sub-part* of an element, or generate content that doesn't exist as a real DOM node.**
`::before`, `::after`, `::first-line`, `::first-letter`, `::selection`, `::placeholder`, `::marker` — these either style a part of an element the DOM doesn't expose as its own node (the first line of a paragraph, a list marker) or inject generated content (`::before`/`::after`, which require a `content` property to actually render anything, even if it's `content: ""`). Pseudo-elements contribute specificity equivalent to an element/type selector (lower than a pseudo-class).

**The `:`/`::` convention: CSS2 used single-colon for both; CSS3 introduced `::` for pseudo-elements to disambiguate them from pseudo-classes going forward.**
Browsers still accept single-colon for the original CSS2 pseudo-elements (`:before`, `:after`, `:first-line`, `:first-letter`) for backward compatibility, but newer pseudo-elements (`::selection`, `::placeholder`, `::marker`, `::part()`) only exist with double-colon — write `::before`/`::after` with double colons in new code, since that's the current, unambiguous standard.

**`::before`/`::after` need `content`, live inside the element's box, and can't be focused or carry real interactivity.**
They're generated boxes inside the element's own layout, not separate DOM nodes — can't be selected by JS via `querySelector`, can't receive focus, and are invisible to assistive tech by default (good for decorative content; bad if you accidentally put meaningful content only in a `content: "..."` value, since screen readers may or may not expose generated content depending on context — don't rely on it for anything a user needs to read reliably).

**Specificity-relevant nuance: `:not()`, `:is()`, `:has()` are pseudo-*classes* that take on their argument's specificity (see the Specificity notes for the full rule) — don't lump them in with pseudo-elements just because they look exotic.**

**Less-common but genuinely interview-worthy members:**
- `:focus-visible` — matches only when the browser's own heuristic decides focus should be visibly indicated (keyboard focus, not an incidental mouse-click focus) — the modern, correct replacement for unconditionally styling `:focus` with a visible ring that then also shows on mouse clicks.
- `:is()`/`:where()` — group multiple selectors without repeating a common suffix; `:is()` takes the max specificity of its arguments, `:where()` always contributes zero (see Specificity notes).
- `::marker` — styles a list item's bullet/number directly, without `list-style: none` + a hand-rolled `::before` bullet.
- `::placeholder` — styles input placeholder text (and is a real pseudo-element, not a pseudo-class, despite often being guessed as one).

## Common traps
- Saying pseudo-elements "create new DOM nodes" — they don't; they're generated rendering boxes, not real, scriptable DOM.
- Forgetting `::before`/`::after` need a `content` property to render at all.
- Guessing `::placeholder` is a pseudo-class because it "feels" like a state.
- Not knowing `:focus-visible` exists and why it's the better default over bare `:focus` for visible focus rings.
- Treating `:not()`/`:is()` as pseudo-elements because they look unusual — they're pseudo-classes with their own specificity rule.

## Model answers

**"What's the actual difference between a pseudo-class and a pseudo-element?"**
"A pseudo-class matches an existing element in a particular state or structural position — `:hover`, `:checked`, `:nth-child()` — no new content, no new node. A pseudo-element represents a sub-part of an element that isn't its own DOM node, or injects generated content — `::before`, `::first-line`, `::marker`. The double-colon syntax in CSS3 was introduced specifically to disambiguate the two going forward; browsers still accept the old single-colon form for the original handful of CSS2 pseudo-elements for backward compatibility, but I'd always write the double-colon form in new code."

**"Why use `:focus-visible` instead of `:focus`?"**
"`:focus` matches any focus, including an incidental mouse click, which means a visible focus ring shows up for mouse users too if you style `:focus` directly — often considered visual noise. `:focus-visible` only matches when the browser's own heuristic determines focus should be visibly indicated, typically keyboard navigation, so I get a visible ring for keyboard users without an unwanted ring on every mouse click."

## Mini code example
```css
/* pseudo-class: state-based, no new content */
button:focus-visible { outline: 2px solid dodgerblue; }
li:nth-child(odd) { background: #f6f6f6; }

/* pseudo-element: generated content, needs `content` to render */
.tooltip::before {
  content: "";
  display: block;
  width: 8px; height: 8px;
  background: black;
}

/* real pseudo-element, often mistaken for a pseudo-class */
input::placeholder { color: #999; font-style: italic; }

/* ::marker styles the bullet directly — no hand-rolled ::before bullet needed */
li::marker { color: dodgerblue; }
```

## Rapid-fire Q&A
1. **Q: Single colon or double colon for pseudo-elements in modern CSS?** A: Double (`::`) — single is only accepted for old CSS2 pseudo-elements, for backward compatibility.
2. **Q: Do `::before`/`::after` create real DOM nodes you can `querySelector`?** A: No — generated rendering boxes only.
3. **Q: Is `::placeholder` a pseudo-class or pseudo-element?** A: Pseudo-element.
4. **Q: Why prefer `:focus-visible` over `:focus` for a visible ring?** A: It skips showing the ring for incidental mouse-click focus, only for e.g. keyboard navigation.
5. **Q: What's required for `::before` to actually render anything?** A: A `content` property, even `content: ""`.

## Gap log (mine, to re-drill)
- [ ] State the conceptual split precisely: state/position (pseudo-class) vs sub-part/generated content (pseudo-element) — not just "colon count."
- [ ] `::before`/`::after` need `content` to render, and are not real scriptable DOM nodes.
- [ ] Know `:focus-visible` exists and why it's the better default than bare `:focus`.
- [ ] Don't misclassify `::placeholder`/`::marker` as pseudo-classes.
