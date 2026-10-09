# SCSS — nesting, mixins, functions, `@extend`

## Why interviewers ask this
SCSS usage is common, but a lot of engineers use nesting and `@extend` without understanding their actual compiled-CSS cost, or without knowing when a mixin is the wrong tool compared to a CSS custom property. The L4 answer explains what SCSS features compile to and why that matters for output size and maintainability — not just "SCSS lets you nest selectors."

## Key concepts

**Nesting is a readability feature that compiles away completely — and it has a real specificity/output-size cost if overused.**
```scss
.card {
  &__title { font-weight: bold; }
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,.1); }
}
```
compiles to flat selectors (`.card__title`, `.card:hover`) — there's no runtime nesting concept in CSS itself (native CSS nesting now exists too, but SCSS nesting predates and compiles independently of it). The real interview point: deep nesting produces deep, overly-specific compiled selectors (`.page .sidebar .widget .title { }`), which both bloats output and makes the resulting CSS harder to override later — a style-architecture mistake that's easy to make because the *source* still looks clean even when the *compiled* selector is a specificity nightmare. Keep nesting shallow (rarely more than 2-3 levels) and prefer flat, class-based selectors for anything meant to be broadly reusable or overridable.

**Mixins (`@mixin`/`@include`) duplicate their body at every call site — they are a compile-time copy-paste, not a shared reference.**
```scss
@mixin truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.title { @include truncate; }
.subtitle { @include truncate; }
```
Every `@include truncate` call copies those three declarations into the compiled output at that location — ten call sites means ten copies in the final CSS. This is fine for small, frequently-varied utility patterns, but for something used dozens of times with no variation, a plain reusable **class** compiles to far less output (one rule, N class references) than a mixin (N full copies of the rule body). Mixins earn their keep specifically when you need **parameters** (a mixin that takes a color/size argument and generates different output per call) — that's something a shared class can't do.

**`@extend` tries to *share* a selector instead of duplicating — but it has real, sharp-edged gotchas.**
```scss
%button-base { padding: 0.5rem 1rem; border-radius: 4px; }
.btn-primary { @extend %button-base; background: blue; }
.btn-secondary { @extend %button-base; background: gray; }
```
compiles to the shared base rule having **both** selectors appended to it (`%button-base` as a placeholder never outputs on its own) — `.btn-primary, .btn-secondary { padding: ...; border-radius: ...; }`, which is more compact than two mixin copies. The real gotchas: `@extend` can produce **unexpected selector combinations** when extending something that's itself nested inside a media query or a complex selector (the extending selector gets grouped into every context the extended selector appears in, which can balloon output in surprising ways) — and it couples two rules together invisibly at the source level (reading `.btn-primary` alone doesn't show you it shares rules with `.btn-secondary` unless you go find the `%placeholder`). Most teams today prefer a shared utility **class** (apply two classes: `class="btn btn-primary"`) over `@extend`, specifically because it avoids both the surprising compiled output and the invisible coupling.

**Functions (`@function`) compute a value at compile time and return it — no visual output of their own.**
```scss
@function rem($px, $base: 16) { @return ($px / $base) * 1rem; }
.title { font-size: rem(24); } // → font-size: 1.5rem;
```
Unlike a mixin (which emits declarations/rules), a function returns a single value used *inside* a declaration — useful for unit conversion, color manipulation (`darken()`, `lighten()` — though native CSS `color-mix()` is increasingly replacing these build-time color functions with runtime equivalents), or any repeated calculation. Know the practical distinction: mixin = emits CSS; function = computes a value you plug into CSS you write yourself.

**The honest modern framing: a lot of SCSS's historical reasons to exist have been absorbed by native CSS.**
Native CSS now has nesting (`&`), custom properties (replacing a large chunk of what Sass variables were used for, with the added runtime superpower Sass variables never had), and `color-mix()`/relative color syntax encroaching on Sass color functions. The L4-level framing isn't "SCSS is obsolete" — it's knowing *which specific SCSS features still earn their place* (control-flow-like mixins with parameters, `@extend`'s compactness for truly shared static rules, build-time loops/maps for generating utility classes) versus which ones are now better served by a native CSS feature with runtime flexibility SCSS can't offer (theming via custom properties being the clearest example).

## Common traps
- Treating `@mixin` as "free" — not knowing it duplicates its body at every call site, unlike a class.
- Not knowing `@extend` groups selectors together rather than duplicating, and not knowing its real gotcha (surprising compiled selector combinations in complex contexts).
- Over-nesting until compiled selectors become deeply specific and hard to override.
- Confusing a mixin (emits CSS rules/declarations) with a function (returns a single value for use inside a declaration).
- Not being able to say which parts of SCSS are now redundant with native CSS (nesting, custom properties) versus which still add real value (parameterized mixins, `@extend`'s output compactness, build-time loops/maps).

## Model answers

**"Mixin or `@extend` for a shared button base style?"**
"If there's no parameter — every button variant needs the exact same base padding/radius — I'd actually reach for a plain shared class over either, since it compiles to one rule referenced by N class attributes, which is the most compact output. If I specifically want the Sass-level DRY-ness and I'm not worried about `@extend`'s selector-grouping surprises in nested/media-query contexts, `@extend` with a `%placeholder` is more compact than a mixin, since it groups selectors onto one shared rule instead of duplicating declarations. I'd reach for a mixin specifically when the shared pattern needs a parameter — a color or size argument that produces different output per call site — since that's something neither a shared class nor `@extend` can do."

**"Isn't SCSS nesting basically free since it's just a readability feature?"**
"At the source level, yes, it's purely for readability — it compiles away entirely. But it's not free in the compiled output: deep nesting produces deep, overly specific compiled selectors, which bloats the CSS and makes those rules harder to override later, even though the SCSS source still looks clean. I keep nesting shallow — two or three levels at most — and avoid nesting purely to mirror the HTML's visual hierarchy."

## Mini code example
```scss
// mixin: duplicates body at every call site — fine for small, varied patterns
@mixin focus-ring($color: dodgerblue) {
  outline: 2px solid $color;
  outline-offset: 2px;
}
.button { @include focus-ring; }
.link { @include focus-ring($color: crimson); }

// @extend: shares one compiled rule across selectors — fine for truly static shared styles
%card-base { border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.card { @extend %card-base; }
.panel { @extend %card-base; }

// function: computes a value, no CSS of its own
@function rem($px, $base: 16) { @return math.div($px, $base) * 1rem; }
.title { font-size: rem(24); }

// shallow nesting — BEM-style, avoids deep compiled specificity
.card {
  &__title { font-weight: 600; }
  &--highlighted { border-color: var(--color-action-primary); }
}
```

## Rapid-fire Q&A
1. **Q: Does a `@mixin` duplicate or share its declarations across call sites?** A: Duplicates — full copy at every `@include`.
2. **Q: Does `@extend` duplicate or share?** A: Shares — groups selectors onto one compiled rule.
3. **Q: When does a mixin earn its keep over a plain shared class?** A: When it needs a parameter that varies the output per call site.
4. **Q: What's a real gotcha with `@extend`?** A: Unexpected selector combinations when extending something nested in a complex selector or media query.
5. **Q: Does a Sass `@function` emit CSS rules?** A: No — it returns a single value used inside a declaration you write.

## Gap log (mine, to re-drill)
- [ ] State the mixin-duplicates vs extend-shares distinction precisely, with the compiled-output consequence for each.
- [ ] Name `@extend`'s real gotcha (selector-grouping surprises in nested/media-query contexts), not just "it's more DRY."
- [ ] Explain the specificity/output-size cost of deep SCSS nesting, not just "it's for readability."
- [ ] Be ready to say which SCSS features native CSS has now absorbed (nesting, custom properties) vs which still add real value.
