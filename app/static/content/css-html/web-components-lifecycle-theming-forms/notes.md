# Web Components — lifecycle, theming, forms

## Why interviewers ask this
Web Components sit at the intersection of "do you understand the platform underneath your framework" and "can you make a sober build-vs-buy call." The strong answer isn't "Web Components are great" — it's knowing exactly what they give you natively, what they cost you (shadow DOM boundary effects), and when the honest answer is "I wouldn't reach for this."

## Key concepts

**No polyfill needed in any current evergreen browser.**
Custom Elements, Shadow DOM, and HTML Templates have been baseline-supported across Chrome/Edge/Firefox/Safari for years now. Libraries like jQuery work against custom elements natively too, since a custom element is still a real DOM node once registered — jQuery selectors, `.on()`, `.html()` all just work against it like any other element. Don't volunteer "we'd need a polyfill" unless the project has a genuinely legacy browser requirement (verify before asserting a specific cutoff version).

**Theming crosses the shadow boundary through three specific doors, and only those.**
Shadow DOM isolates a component's internal styles from the page (and vice versa) — that's the point. But three mechanisms are explicitly designed to let a host page theme into a shadow tree:
- **CSS custom properties** (`--brand-color`) *do* pierce the shadow boundary — they inherit through it like any other inherited CSS value, so a component author exposes theming hooks as custom properties and the host page sets them.
- **`::part()`** lets the host page style specific internal elements the component author has explicitly tagged with `part="name"` — an opt-in styling API from inside the component.
- **`:host`** (and `:host()`/`:host-context()`) let the component style *itself* from the inside based on attributes or ancestor context.
Anything not exposed through one of those three doors is genuinely unreachable from outside — that's intentional encapsulation, not a bug to work around with `!important` hacks.

**Custom events need `bubbles: true, composed: true` to escape the shadow tree.**
A `CustomEvent` dispatched inside a shadow root does **not** reach listeners on the host page by default — shadow DOM retargets and can stop it at the boundary. You must explicitly set both `bubbles: true` (to bubble up through the component's own DOM) **and** `composed: true` (to cross the shadow boundary itself) when constructing the event, or the host page never sees it.

**Lifecycle callbacks + `observedAttributes`.**
A custom element class implements `connectedCallback()` (mounted into the DOM — do setup/render here, not the constructor), `disconnectedCallback()` (removed — cleanup listeners/timers here), and `attributeChangedCallback(name, oldValue, newValue)`, which only fires for attribute names returned by the static `observedAttributes` getter — attributes not listed there are silently not watched.

**Form participation: `formAssociated` + `ElementInternals`.**
By default a custom element is invisible to a surrounding `<form>` — it won't be included in `FormData`, won't participate in `:invalid`/`:valid`, won't get native validation messages. Setting the static `formAssociated = true` flag and using `this.attachInternals()` to get an `ElementInternals` object lets the element call `internals.setFormValue(value)` (so it shows up in form submission/`FormData`) and `internals.setValidity(...)` (so it participates in the Constraint Validation API like a native input). This is the mechanism that makes a custom `<my-rating-input>` behave like a real form field instead of a decorative widget the form doesn't know about.

**ID-based references don't cross the shadow boundary.**
`<label for="id">`, `aria-labelledby`, `aria-describedby`, and plain `document.getElementById` all resolve IDs *within the same DOM tree*. An ID inside a shadow root is invisible to `for`/`aria-*` attributes living in the light DOM (the host page), and vice versa. This is a real accessibility gotcha for custom form elements — you generally need `ElementInternals`' `ariaLabelledBy`/internal associations (or you manage the labeling relationship entirely inside the component) rather than relying on cross-boundary ID references.

**SSR needs Declarative Shadow DOM.**
Server-rendering a custom element's shadow content requires **Declarative Shadow DOM** — a `<template shadowrootmode="open">` block emitted directly in the server HTML so the shadow root exists in the initial markup before any JS runs, instead of being created imperatively in `connectedCallback`. Without it, SSR'd custom elements render empty/unstyled until hydration attaches the shadow root client-side — a real FOUC/SEO problem. (Treat exact browser support and framework-level support — e.g. how specific React versions handle this — as something to verify against current docs before stating a version number in an interview.)

**Framework interop — know the current landscape, flagged honestly.**
React's custom-element support historically had rough edges around passing non-string properties and listening for custom events (React only wired up attributes, not properties, for a long time). Newer React versions have improved native custom-element interop (properties and custom events) — state this as "has gotten better in recent versions" rather than citing a specific version number unless you've verified it against current docs. **Lit** is the common ergonomic wrapper around the raw Custom Elements/Shadow DOM APIs (reactive properties, templating, less boilerplate) — most teams building web components in anger reach for Lit rather than hand-rolling the base APIs.

**Passing data in and out: attributes vs properties vs events.**
Use **attributes** (strings only) for simple configuration a consumer can set declaratively in markup — `<ds-button variant="primary">`. Use **JavaScript properties** for anything richer — an array of dropdown options, an object, a callback — since HTML attributes can't carry non-string values. Data flows back out via `CustomEvent` dispatch, which the consumer listens for like any DOM event.

**When to say no.**
Prefer a native element first (`<select>`, the Popover API, `<dialog>`) over building a custom one — same principle as the semantic-HTML notes. And for Web Components as an *architectural* choice: they earn their keep in **cross-framework or cross-team reuse** (a design-system component consumed by a React app, an Angular app, and a vanilla page) or **long-lived component libraries** meant to outlive any one framework's version churn. They're the wrong choice for a single-framework app with no cross-team reuse story, an SSR/SEO-critical page without Declarative Shadow DOM support in your stack, or a component nobody will own/maintain long-term — the shadow-DOM styling/testing/debugging overhead isn't worth paying without one of those payoffs. The **strongest** reason to say no, stated precisely: heavy coupling to one framework's context, state management, forms, or SSR model — not simply "the team lacks raw DOM API experience" (that's a training problem, not an architectural disqualifier).

**Complexity scales hard with the component — a button is not a dropdown.**
A shared `<ds-button>` is a reasonable first Web Component: low interaction surface, simple styling contract. A shared `<ds-dropdown>` is a different order of difficulty — it drags in keyboard interaction (arrow keys, typeahead, Escape), focus management, positioning/collision detection, and native-form participation, all of which are harder to get right *and* harder to keep right across three different consuming frameworks. Recommend Web Components more confidently for simple primitives, and flag the added risk explicitly for complex, stateful ones — don't treat "it's a web component" as a complexity-flattening abstraction.

## Common traps
- Claiming you need a polyfill for Custom Elements/Shadow DOM in a modern browser matrix.
- Forgetting `composed: true` (only adding `bubbles: true`) and being surprised the host page never sees the event.
- Doing setup work in the constructor instead of `connectedCallback`.
- Assuming a custom element is automatically part of form submission without `formAssociated`/`ElementInternals`.
- Assuming `aria-labelledby`/`for` can reach across a shadow boundary.
- Citing a specific framework version's support level without flagging it needs verification.

## Model answers

**"Would you build a design-system button as a Web Component?"**
"It depends on the reuse story. If it's consumed only inside one React app, I'd keep it a React component — simpler styling, testing, and dev tooling, no shadow-DOM overhead. Web Components earn their keep specifically when the same component needs to work identically across multiple frameworks or teams, or needs to outlive a framework migration. In that case I'd reach for Lit rather than hand-rolling the raw Custom Elements API, expose theming through CSS custom properties and `::part()`, and if it needs to participate in a form, wire up `formAssociated` and `ElementInternals` so it behaves like a real input rather than a decorative widget."

**"How does theming work across a shadow boundary?"**
"Three specific doors, and only those: CSS custom properties inherit through the shadow boundary so the host page can set `--brand-color` and the component picks it up; `::part()` lets the host style elements the component author explicitly exposed with a `part` attribute; and `:host`/`:host-context()` let the component style itself based on outside context. Anything not exposed through one of those three is genuinely encapsulated — that's the isolation working as intended, not something to hack around."

## Mini code example
```js
class RatingInput extends HTMLElement {
  static formAssociated = true;
  static get observedAttributes() { return ['value']; }

  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `<button part="star">★</button>`;
    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      this.#internals.setFormValue('5');
      this.dispatchEvent(new CustomEvent('rating-change', {
        detail: { value: 5 },
        bubbles: true,
        composed: true // must cross the shadow boundary to reach the host page
      }));
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value') this.#internals.setFormValue(newVal);
  }
}
customElements.define('rating-input', RatingInput);
```
```css
/* host page theming — only these doors reach into the shadow tree */
rating-input { --star-color: goldenrod; }
rating-input::part(star) { color: var(--star-color); }
```

## Rapid-fire Q&A
1. **Q: Do you need a polyfill for Custom Elements today?** A: No, not in any evergreen browser.
2. **Q: What two flags does a custom event need to escape a shadow root?** A: `bubbles: true` and `composed: true`.
3. **Q: Which lifecycle callback should hold setup logic — constructor or `connectedCallback`?** A: `connectedCallback`.
4. **Q: How does a custom element participate in `FormData`?** A: `static formAssociated = true` + `ElementInternals.setFormValue()`.
5. **Q: Can `aria-labelledby` reference an ID inside a different element's shadow root?** A: No — ID references don't cross the shadow boundary.

## Gap log (mine, to re-drill)
- [ ] State "no polyfill needed" confidently; jQuery works natively against custom elements.
- [ ] Theming = CSS custom properties + `::part()` + `:host`, name all three doors.
- [ ] Always pair `bubbles: true` with `composed: true` for events crossing shadow boundary.
- [ ] Lifecycle + `observedAttributes` gating `attributeChangedCallback`.
- [ ] Forms: `formAssociated` + `ElementInternals` — a custom element is invisible to forms without it.
- [ ] ID refs (`for`, `aria-*`) don't cross shadow boundary — know the practical consequence.
- [ ] SSR needs Declarative Shadow DOM (`<template shadowrootmode>`) — flag framework-version specifics as "verify."
- [ ] Prefer native elements first; justify Web Components via cross-framework/cross-team reuse, not novelty.
- [ ] State attributes-for-strings vs properties-for-rich-data as the explicit data-in model, events as the data-out model.
- [ ] The strongest "say no" reason is framework coupling (context/state/forms/SSR), not "team lacks DOM experience."
- [ ] Don't flatten complexity — a button and a dropdown are very different risk levels as shared Web Components.

## Real interview record — shared `<ds-button>`/`<ds-dropdown>` across React, Angular, jQuery (scored 8/10)
**Question asked:** "Our company has three teams using React, Angular, and a legacy jQuery app. We want a shared `<ds-button>` and `<ds-dropdown>` that work in all of them. Someone suggests Web Components. Is that a good idea?"

**What scored well:** opening with the business case (one implementation vs three duplicated efforts), correctly explaining Custom Elements/Shadow DOM/template+slot, distinguishing attributes from properties, naming React interop and forms as real trade-offs, and giving a condition for saying no.

**What was marked as missing** (now folded into Key Concepts above): explicitly naming CSS custom properties + `::part()` for theming, pairing `composed: true` with `bubbles: true` for cross-boundary events, not leading with "we might need a polyfill" (integration ergonomics matter more than polyfills in a modern browser matrix), reframing the "say no" condition around framework coupling rather than team skill gaps, and flagging that a dropdown is meaningfully harder than a button.

**Improved spoken answer (the L4 bar for this question):** "Yes — with three different frameworks and a desire for one shared implementation, Web Components are a good fit; otherwise each team builds and maintains its own button and dropdown, duplicating effort and risking inconsistent UX. Custom Elements let us define our own elements and control their lifecycle; Shadow DOM gives isolated DOM and CSS scope so styles don't leak either direction; `<template>`/`<slot>` give reusable markup with content projection. For theming, Shadow DOM doesn't block styling — I'd expose CSS custom properties and, where needed, `::part()`. For data, attributes work for simple string config, properties for richer values like an options array; events go out via `CustomEvent`, with `bubbles: true` and `composed: true` when they need to cross the shadow boundary. The real trade-off is framework integration — older React especially can need wrappers for custom properties and events, and forms/SSR need extra work. I'd recommend Web Components confidently for a simple shared primitive like a button, and be more cautious with a complex dropdown, since accessibility, keyboard interaction, focus management, and positioning raise the difficulty regardless of the Web platform used. I'd say no if the components are heavily coupled to one framework's context, state, forms, or SSR model — not simply because a team hasn't used the raw DOM APIs before."
