# Cascade and specificity

### Q: What is the CSS cascade? When two rules target the same element and set the same property, how does the browser decide which one wins?

- **Asked:** 2026-10-21 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
The cascade is the algorithm that resolves conflicts when multiple rules apply to the same element. It uses three criteria: origin/source, specificity, and source order. Origin: first the browser default styles (e.g. blue links), then author styles, then `!important`, which moves to the top of the priority list. Specificity: for conflicting rules from the same source, the more precise selector wins. Strongest to weakest: inline style, id, class/attribute/pseudo-class, element/pseudo-element. Source order: the browser reads CSS top to bottom, so the last rule overrides the earlier one.

**Covered well**
- The three core criteria in the right order: origin, specificity, source order.
- Specificity tiers are correct (inline, id, class/attribute/pseudo-class, element/pseudo-element).
- Source order as the final tiebreaker.

**Gaps (note)**
- Origin ordering was muddled. `!important` is not a fourth origin placed after author styles. It flips the order: important declarations from the user-agent beat important user, which beat important author, which beat all normal declarations. An interviewer checks this because it shows you know why a user's `!important` accessibility override can beat the site.
- Missing the **user** origin (user stylesheets, accessibility settings), plus **animations** and **transitions**, which sit in the same origin ladder. A running transition beats even author `!important`.
- Missing **cascade layers** (`@layer`). Layers are checked after origin/importance and before specificity, so a rule in a later layer beats a more specific rule in an earlier layer. This is the modern answer to specificity wars and is expected at lead level.
- Specificity was described as a ranking, not a calculation. It is a tuple (ids, classes/attributes/pseudo-classes, elements/pseudo-elements) compared left to right. Ten classes never beat one id. Not a base-10 number.
- Missing the special cases: `*` and combinators add nothing, `:where()` is always zero, `:is()` / `:not()` / `:has()` take their most specific argument.
- Inline styles are not a selector. They are element-attached styles that win over selector specificity (but lose to `!important` in a stylesheet).
- Did not connect the cascade to the next steps: inheritance and the defaulting keywords (`inherit`, `initial`, `unset`, `revert`, `revert-layer`), and the cascaded to computed to used value pipeline.
- No production angle: how to debug a losing rule (DevTools Styles pane shows struck-through rules) and how to avoid `!important` and specificity wars.
- Delivery: it read like written notes with a numbered list. Say it as a short narrative, with one concrete example.

**Complete answer**
"The cascade is how the browser picks one winning value when several declarations compete for the same property on the same element. It goes through a fixed sequence of tie-breakers, and it stops at the first one that decides.

First, **origin and importance**. There are three origins: the user agent's default styles, the user's own styles, and the author's styles, which is our CSS. For normal declarations, author beats user beats user agent. For `!important` declarations the order reverses: important user agent beats important user beats important author. That reversal is deliberate, so a user's accessibility override can beat the site. CSS animations and transitions have their own slots, and a running transition beats everything, even author `!important`.

Second, **cascade layers**. If I declare `@layer reset, base, components, utilities;`, a later layer beats an earlier one regardless of specificity. Unlayered author styles beat layered ones. For `!important` the layer order flips again. Layers are my main tool to stop specificity wars (verify exact `!important` layer order in the CSS Cascade Level 5 spec).

Third, **specificity**. It is not a single number. It is three counters compared left to right: ids, then classes, attributes and pseudo-classes, then elements and pseudo-elements. So `#a` (1,0,0) beats any number of classes. `*` and combinators add zero. `:where()` always counts zero, which makes it perfect for low-priority base styles. `:is()`, `:not()` and `:has()` take the specificity of their most specific argument. Inline `style=""` is separate: it beats any selector, but loses to an `!important` rule in a stylesheet.

Fourth, **source order**. If everything else is tied, the later declaration wins, across stylesheets too, in the order they load.

Then there are two follow-on steps. If no declaration applies at all, the property is inherited if it is an inherited property (like `color`, `font`), otherwise it takes the initial value. The keywords `inherit`, `initial`, `unset`, `revert` and `revert-layer` let me control that explicitly.

In practice, I avoid `!important`, keep selectors flat (one class, BEM or CSS Modules), use `@layer` to order third-party CSS, resets, components and utilities, and debug in DevTools: the Styles pane shows the losing rules struck through, and the Computed tab shows which rule supplied each value."

```css
@layer reset, components, utilities;

@layer components { .btn.primary { background: blue; } }  /* higher specificity */
@layer utilities  { .bg-red      { background: red;  } }  /* later layer wins */
/* <button class="btn primary bg-red"> is red */
```

**Likely follow-ups**
- What is the specificity of `#nav .item:hover a`? — (1,2,1): one id, two classes (`.item`, `:hover`), one element.
- How does `:where()` differ from `:is()`? — `:where()` always contributes zero specificity; `:is()` takes its most specific argument.
- Why do `!important` user styles beat author `!important`? — The importance reversal lets users and accessibility tools override site styles.
- What does `revert` do compared with `initial`? — `revert` rolls back to the previous origin (usually browser defaults); `initial` uses the property's spec initial value.
- How would you tame a legacy codebase full of `!important`? — Introduce `@layer`, put the legacy CSS in a low layer, new code in higher ones, and remove `!important` gradually.
- Is inheritance part of the cascade? — Adjacent: the cascade picks the cascaded value; inheritance and defaulting run when nothing was cascaded.

**History**
- 2026-10-21: first asked, Partial (origin/importance muddled, no layers, specificity described as ranking)
