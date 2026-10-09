# Forms and web components

> Seeded on 2026-10-09 from `gap-log.md` (HTML session of 2026-09-29). Original wording and spoken answers were not recorded then.

### Q: Design an accessible, good-UX signup form (Q4)

- **Asked:** 2026-09-29 · **Verdict:** Correct · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log called it a strong answer; remaining gaps were details and delivery.

**Covered well**
- Strong overall structure.

**Gaps (note)**
- Name the `autocomplete` tokens: `email`, `new-password`, `bday`, `country`.
- `novalidate` and why: native validation bubbles are inconsistent and can't be styled.
- `:invalid` versus `:user-invalid` (verify browser support).
- On submit, focus the first invalid field or show an error summary instead of many `role="alert"` regions.
- Async "email already taken" checks leak which emails are registered (account enumeration).
- Delivery: it read like a written essay; practise spoken delivery.

**Complete answer**
"Each field has a visible `<label>`, the right `type` and `inputmode`, and an `autocomplete` token so the browser and password managers can help: `email`, `new-password`, `bday`, `country`.

I add `novalidate` and run my own validation, because native bubbles look different in every browser and can't be styled or announced consistently. I keep constraint attributes like `required` and `type=email` for semantics, and use `:user-invalid` to style an error only after the user interacted. `:invalid` fires immediately on page load, which is noisy (verify `:user-invalid` support before relying on it).

On submit, if there are errors I move focus to the first invalid field, or to an error summary at the top with links to each field. I wire each message with `aria-describedby` and set `aria-invalid`. I avoid many `role="alert"` messages firing at once because screen readers talk over each other.

One security note: an async 'this email is taken' check on blur tells attackers which emails have accounts. For signup I accept that tradeoff or move the check to submit with a generic message, and rate-limit it."

**Likely follow-ups**
- Why `novalidate`? — To control timing, styling, and announcements consistently.

**History**
- 2026-09-29: first asked, Correct (details and delivery left open)

### Q: Web Components: when would you use them and when not? (Q7)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: thought polyfills were needed, missed theming, events, forms and SSR.

**Covered well**
- Delivery improved in this answer: shorter spoken sentences.

**Gaps (note)**
- No polyfill needed in modern browsers; works with jQuery and any framework natively.
- Theming through CSS custom properties, `::part`, and `:host`.
- A `CustomEvent` needs `bubbles: true, composed: true` to cross the shadow boundary.
- Lifecycle callbacks and `observedAttributes`.
- Forms need `formAssociated` and `ElementInternals`.
- ID references (`for`, `aria-*`) do not cross shadow boundaries.
- SSR needs declarative shadow DOM (verify); React 19 custom element support (verify).
- Stronger "when I'd say no": single framework, SSR/SEO critical, no ownership.
- Mention Lit; prefer native `<select>` and `popover`.

**Complete answer**
"Custom elements, shadow DOM and templates are standard in all modern browsers, so no polyfill is needed, and they work in any framework or plain HTML.

I'd use them for a design system shared across several frameworks or teams, or for a widget embedded into pages I don't control, where style isolation matters.

Things to get right: style from outside through CSS custom properties, `::part()`, and `:host`. Events must be created with `bubbles` and `composed` to leave the shadow root. Reflect attributes with `observedAttributes` and `attributeChangedCallback`. For form participation use `formAssociated` and `ElementInternals`, otherwise the value isn't submitted. `for` and `aria-labelledby` references can't cross a shadow boundary, so labels and descriptions need care. SSR needs declarative shadow DOM, and the framework story, such as React 19's custom element support, should be verified for the version in use.

I'd say no when the whole app is one framework, when SEO and SSR are critical and tooling is immature, or when nobody owns the component library. Also don't rebuild what the platform gives you: use native `<select>` and the `popover` attribute. Lit is a good small helper if I do build them."

**Likely follow-ups**
- How would you style a third-party web component? — Through its documented custom properties and `::part`.

**History**
- 2026-09-29: first asked, Partial
