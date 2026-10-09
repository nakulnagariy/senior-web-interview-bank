# Specificity — calculation, `!important` pitfalls

## Why interviewers ask this
Everyone can say "inline beats class beats element." L4 answers can actually *calculate* specificity for a real selector, know the handful of exceptions that trip people up (`:not()`, `:where()`, attribute selectors), and reason about why a codebase ends up needing `!important` in the first place — which is usually a process/architecture failure, not a CSS failure.

## Key concepts

**The specificity tuple: (inline, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements).**
Specificity is compared as a tuple, not summed into one number — a selector with one ID always beats any number of classes, no matter how many. Rank, highest to lowest:
1. Inline `style=""` attribute.
2. ID selectors (`#id`).
3. Classes, attribute selectors, and pseudo-**classes** (`.class`, `[type=text]`, `:hover`, `:nth-child()`).
4. Elements and pseudo-**elements** (`div`, `::before`).
The universal selector `*`, combinators (`>`, `+`, `~`, ` `), and `:where()` contribute **zero** specificity.

**The exceptions that actually get asked:**
- `:not()`, `:is()`, `:has()` — these take on the specificity of their **most specific argument**, not zero. `:not(.a, #b)` carries the specificity of `#b` (an ID), not of `:not()` itself.
- `:where()` — the one deliberate zero-specificity exception, designed specifically so you can write a selector with "override-friendly" specificity on purpose (common in CSS resets/libraries that want to be trivially overridable).
- Later rule of equal specificity wins by **source order** — specificity is compared first; if it's a tie, whichever rule is parsed later (or appears later / is loaded later) wins.

**`!important` doesn't change specificity — it changes which cascade *layer* wins, and it's close to an escape hatch of last resort.**
An `!important` declaration wins over any non-`!important` declaration regardless of specificity (one exception: a later `!important` from a browser/user stylesheet with higher origin priority can still beat it — origin + importance is its own cascade step above specificity). The real interview point: `!important` is a symptom of a specificity war, and reaching for it compounds the problem — the next person who needs to override your `!important` rule has to add their own `!important`, and now you're in an arms race. The sustainable fix is almost always lowering specificity elsewhere (flatter selectors, a consistent naming convention, or CSS Layers — see below) rather than reaching for `!important` to win locally.

**`@layer` (Cascade Layers) is the modern, structural answer to specificity wars.**
`@layer reset, base, components, utilities;` lets you declare an explicit **layer order** that is checked *before* specificity — a low-specificity selector in a later layer beats a high-specificity selector in an earlier layer. This is specifically designed to let a utility class reliably override a component style without an ID or `!important` war, as long as both are organized into layers with the right order. (Verify current browser support before asserting it's safe for your target matrix, but it's broadly supported in evergreen browsers.)

## Common traps
- Adding up specificity as a single number instead of comparing the tuple left-to-right.
- Saying `:not()` has zero specificity — it inherits its argument's specificity.
- Confusing `:where()` (deliberately zero) with `:not()`/`:is()` (not zero).
- Treating `!important` as a quick fix rather than naming it as a last resort with a real cost (future override arms race).
- Forgetting that equal specificity is broken by source order, not by "whichever selector looks more specific to a human."

## Model answers

**"Which wins: `.btn.btn-primary` or `#submit`?"**
"`#submit` — one ID always outranks any number of classes, because specificity is compared as a tuple (IDs, then classes, then elements), not summed. Two classes never add up to beat a single ID."

**"Your codebase is full of `!important`. How do you fix it?"**
"I'd treat the volume of `!important` as a symptom, not fix it tag by tag. Usually it means selectors crept up in specificity over time — nested IDs, over-qualified selectors — until the only way to override anything locally was `!important`, which then compounds for the next person. I'd flatten the offending selectors, standardize on a low-specificity naming convention like BEM so most rules sit at the same specificity tier, and where I need deliberate, structural override order — e.g. utilities always beating components — I'd reach for `@layer` instead of `!important`, since layer order is resolved before specificity and gives me that override guarantee without an arms race."

## Mini code example
```css
/* tuple comparison, not addition */
#submit { color: red; }              /* (1,0,0) ID */
.btn.btn-primary { color: blue; }     /* (0,2,0) two classes — loses to the ID regardless */

/* :not() inherits its argument's specificity — this is (0,1,0), a class, not zero */
li:not(.active) { opacity: 0.6; }

/* :where() is the deliberate zero-specificity exception */
:where(.card, .panel) h2 { margin: 0; } /* specificity contributed by :where() = 0 */

/* cascade layers resolve BEFORE specificity — utilities beat components by layer order alone */
@layer base, components, utilities;

@layer components {
  .button { background: gray; }       /* higher specificity selector in an EARLIER layer... */
}
@layer utilities {
  .bg-brand { background: blue; }     /* ...still loses to a lower-specificity rule in a LATER layer */
}
```

## Rapid-fire Q&A
1. **Q: Does `.a.b.c` (three classes) beat `#id`?** A: No — any single ID beats any number of classes.
2. **Q: What's the specificity contribution of `:not(.foo)`?** A: Equal to `.foo` — one class — not zero.
3. **Q: Which selector is designed to contribute zero specificity on purpose?** A: `:where()`.
4. **Q: Two selectors have identical specificity — what breaks the tie?** A: Source order; the later rule wins.
5. **Q: What resolves before specificity is even compared, letting you avoid `!important`?** A: Cascade layer order (`@layer`).

## Gap log (mine, to re-drill)
- [ ] Compare specificity as a tuple, left to right — never sum it into one number.
- [ ] `:not()`/`:is()`/`:has()` inherit their most-specific argument; `:where()` is the deliberate zero.
- [ ] Frame `!important` as a last-resort escape hatch with a real cost, not a quick fix — name the override arms-race explicitly.
- [ ] Offer `@layer` as the structural fix for a specificity war, and explain why it works (resolved before specificity).
