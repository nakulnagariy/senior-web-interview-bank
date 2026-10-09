# CSS custom properties (variables) & theming

## Why interviewers ask this
Custom properties look like a simple find-and-replace tool until you ask what happens when you change one at runtime, or ask how theming actually gets implemented in a real design system. The L4 differentiator: knowing custom properties are **live, cascading, and inherited** (fundamentally different from Sass variables, which are compile-time), and being able to design an actual theming strategy around that.

## Key concepts

**Custom properties are runtime values, not compile-time substitution — this is the whole point.**
A Sass/SCSS variable (`$color`) is resolved at **build time**; it doesn't exist once CSS is generated — it's pure text substitution before the browser ever sees it. A CSS custom property (`--color`) is resolved by the **browser at render/paint time**, and critically, it can be **read and changed by JavaScript** (`element.style.setProperty('--color', 'red')`) or overridden by a different selector matching later in the cascade — enabling runtime theme switching without rebuilding any CSS.

**They cascade and inherit like any other CSS property.**
A custom property set on `:root` is available to every descendant via inheritance, exactly like `color` or `font-family`. A more specific ancestor can redefine the same custom property for its own subtree (e.g. `.dark-theme { --surface: #1a1a1a; }`), and anything inside that subtree reading `var(--surface)` picks up the overridden value — no JavaScript required for scoped theming, just normal CSS cascade/inheritance rules applied to a variable instead of a concrete property.

**`var(--name, fallback)` — the fallback is evaluated only if the property is unset/invalid, not if it's empty-but-defined.**
The second argument to `var()` is used when the custom property is not defined at all (or contains an invalid value for that context) — this matters when designing a theming API: if a component's internal default should apply unless a consumer explicitly sets the variable, `var(--consumer-color, var(--internal-default))` layering lets you chain fallbacks cleanly.

**Theming pattern: a semantic layer on top of a primitive layer.**
A mature custom-properties theming system typically has two tiers:
1. **Primitives** — raw values, rarely themed directly (`--blue-500: #3b82f6;`).
2. **Semantic tokens** — meaning-based names that reference primitives and actually get used in components (`--color-action-primary: var(--blue-500);`).
Switching a theme means redefining the semantic tier (often scoped to a `[data-theme="dark"]` attribute or class on a high-level ancestor), while components only ever reference semantic tokens — never primitives directly. This is what lets a dark-mode toggle be a single attribute flip instead of touching component CSS.

**Custom properties cross the Shadow DOM boundary (inherit through it) — this is their superpower for component theming.**
As covered in the Web Components notes: `--brand-color` set on a host page is visible inside a Shadow DOM subtree via normal CSS inheritance, even though most other styles are isolated by shadow boundaries. This is specifically why custom properties — not Sass variables, which don't exist at runtime at all — are the mechanism for theming encapsulated components.

**They're type-agnostic text until used — `@property` adds real typing.**
A bare custom property is essentially an untyped string substituted wherever `var()` is used — which is why you can't directly animate a custom property's value with a CSS transition by default (the browser doesn't know it's a color or a length, so it can't interpolate it). The newer `@property` rule lets you register a custom property with an explicit `syntax`, `inherits` behavior, and `initial-value`, which *does* enable smooth animation/transition of that custom property, because the browser now knows how to interpolate its typed value. (Verify current browser support before relying on `@property` animation as a cross-browser guarantee.)

## Common traps
- Treating custom properties as "just like Sass variables" — missing that they're live/runtime and JS-readable/writable, not compile-time substitution.
- Not knowing `var()`'s fallback only applies when the property is unset/invalid, not when logic elsewhere sets it to an empty string.
- Theming components by referencing primitives directly instead of going through a semantic token layer — makes a theme switch require touching every component.
- Assuming a bare custom property can be smoothly animated by a CSS transition without `@property` registering its type.
- Forgetting custom properties inherit through the Shadow DOM boundary when discussing Web Component theming.

## Model answers

**"How is a CSS custom property different from a Sass variable?"**
"A Sass variable is resolved at build time — it's text substitution before the browser ever sees the CSS, so it can't change at runtime and JavaScript can't read or write it. A CSS custom property is resolved by the browser at render time: it cascades and inherits like any other property, a more specific selector can override it for its own subtree, and JavaScript can read or set it directly with `setProperty`. That's what makes runtime theme switching — like a dark-mode toggle — possible without rebuilding any CSS; you're not limited to decisions made at build time."

**"How would you structure a theming system with custom properties?"**
"Two tiers: primitive tokens that are raw values like a specific blue, and semantic tokens that reference primitives by meaning — `--color-action-primary` pointing at `--blue-500`. Components only ever consume semantic tokens, never primitives directly. A theme switch becomes redefining the semantic tier under a scoping attribute like `[data-theme="dark"]` on a high-level ancestor — components don't change at all, because they were never coupled to the primitive values in the first place."

## Mini code example
```css
:root {
  /* primitives */
  --blue-500: #3b82f6;
  --gray-900: #111827;

  /* semantic tokens — components reference these, never the primitives directly */
  --color-action-primary: var(--blue-500);
  --color-surface: #ffffff;
  --color-text: var(--gray-900);
}

[data-theme="dark"] {
  /* redefine the semantic tier only — components don't change */
  --color-surface: var(--gray-900);
  --color-text: #f9fafb;
}

.card {
  background: var(--color-surface);
  color: var(--color-text);
}
```
```js
// runtime read/write — impossible with a build-time Sass variable
document.documentElement.setAttribute('data-theme', 'dark');
getComputedStyle(document.documentElement).getPropertyValue('--color-surface');
```

## Rapid-fire Q&A
1. **Q: Can JavaScript read and set a CSS custom property at runtime?** A: Yes — `getPropertyValue`/`setProperty`; a Sass variable can't, it's compile-time only.
2. **Q: When does `var(--x, fallback)`'s fallback apply?** A: Only when `--x` is unset or invalid — not when it's defined-but-empty via other logic.
3. **Q: What's the two-tier theming pattern called?** A: Primitive tokens + semantic tokens, with components consuming only the semantic layer.
4. **Q: Do custom properties inherit through a Shadow DOM boundary?** A: Yes — that's what makes them the mechanism for theming encapsulated Web Components.
5. **Q: Can a bare custom property be smoothly transitioned by default?** A: No — the browser doesn't know its type; `@property` registers a type to enable that.

## Gap log (mine, to re-drill)
- [ ] Lead with "runtime, cascading, JS-readable/writable" as the core difference from Sass variables — not just "variables for CSS."
- [ ] Know the `var()` fallback's precise trigger condition (unset/invalid only).
- [ ] Describe the primitive/semantic two-tier theming pattern with a concrete dark-mode example.
- [ ] Connect custom properties to Shadow DOM theming explicitly when Web Components come up.
- [ ] Mention `@property` as the typed-registration mechanism that enables animating a custom property.
