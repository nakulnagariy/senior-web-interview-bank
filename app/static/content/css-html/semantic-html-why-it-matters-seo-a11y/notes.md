# Semantic HTML & Forms — why it matters, SEO & a11y

## Why interviewers ask this
It's the cheapest way to separate candidates who've memorized tag names from candidates who've actually shipped accessible, crawlable UI. L4 answers explain *mechanism* (what the browser/AT/crawler actually does with the markup) and *trade-offs*, not just "use semantic tags, it's good practice."

## Key concepts

**Interactive elements need the full contract, not just a click handler.**
A `<div onclick>` gets you a click. It does not get you:
- a default `role` (AT announces nothing meaningful),
- keyboard operability (no Tab stop, no Enter/Space activation),
- state exposure (`aria-pressed`, `aria-expanded`, disabled behavior),
- visible focus by default.
Adding `tabindex="0"` alone only fixes the Tab-stop problem. You still owe it `role="button"`, a `keydown` handler for Enter **and** Space, and focus styling. A native `<button>` gives you all of that for free — name, role, state, keyboard, focus ring. Reach for a real `<button>`/`<a>` first; build custom ARIA widgets only when there's no native element that does the job (see Web Components notes for the same principle applied to custom elements).

**`<a>` vs `<button>` is navigation vs action.**
`<a href>` = changes location (new page, hash, or lets the user open-in-new-tab / copy-link / middle-click). `<button>` = performs an action in place, no URL change. A link styled to look like a button that actually submits a form or triggers JS is a predictability bug for keyboard/AT users (they expect `Enter` to navigate, not mutate state) and breaks "open in new tab." Inside a `<form>`, a bare `<button>` defaults to `type="submit"` — a very common accidental-submit bug when you add a "cancel" or "delete row" button inside a form without `type="button"`.

**Form labels: `<label for>`, not placeholder.**
Placeholder text disappears the moment the user types, isn't read reliably by all AT, and fails color-contrast requirements more often because it's styled as low-emphasis hint text. `<label for="id">` (or wrapping the input) gives a persistent, programmatically-associated accessible name, and it *enlarges the touch/click target* — tapping the label text focuses the input, which matters a lot on mobile forms.

**Landmarks and heading hierarchy.**
`header`, `nav`, `main`, `aside`, `footer` give screen-reader users a jump-list of the page (AT users navigate by landmark constantly — it's the equivalent of a sighted user visually scanning layout). Heading levels (`h1`→`h2`→`h3`) must nest without skipping, because AT also lets users jump by heading level; skipping levels breaks that mental outline. `<article>` means *self-contained, independently distributable content* (a blog post, a card that would still make sense syndicated on its own) — it is a content/semantic unit, not a layout container; don't reach for it just because something visually looks like a "card."

**SEO claims — don't oversell them.**
Semantic tags give **no direct ranking boost**. What they actually buy you: crawlability (a `<div onclick="navigate()">` is invisible to a crawler; a real `<a href="/path">` is a followable link crawlers can discover and index), and a cleaner document outline that correlates with — but doesn't cause — better content understanding. If you claim "semantic HTML improves SEO" in an interview, be ready to say *how*, specifically, or you sound like you're reciting a blog post.

**Forms, at L4 depth (validation, autofill, security).**
- `autocomplete` tokens (`email`, `new-password`, `current-password`, `bday`, `country`, `tel`, `cc-number`...) aren't optional polish — they're what lets browsers/password managers autofill correctly, which is a measurable conversion and accessibility win (motor-impaired users especially).
- `novalidate` on the `<form>` + your own JS validation is often the *right* call, not a hack: native validation bubbles are unstyleable, inconsistent across browsers, and inconsistent in timing. You trade native validation for consistent UX, but now you own accessible error messaging.
- `:invalid` fires too early (as soon as a field is empty/invalid, even before the user has interacted) — bad UX, red borders appear before the user has typed anything. `:user-invalid` (newer, verify current browser support before relying on it in an interview) only matches after the user has interacted and left the field, which matches what you actually want. Many teams still reimplement this with JS (`touched`/`blurred` state) for safety.
- On submit, focus the **first invalid field** and/or render an error summary at the top (one `role="alert"` region, not one `role="alert"` per field — multiple simultaneous alerts fight each other in screen readers' output queue).
- An async "is this email already taken?" check on blur is a classic **account-enumeration** security smell: it tells an attacker which emails are registered. If you need it, rate-limit it, consider a generic response, and don't reveal existence unauthenticated.
- **The Constraint Validation API** is the part most candidates skip: every validatable input exposes a `validity` object (`valueMissing`, `typeMismatch`, `patternMismatch`, `rangeUnderflow/Overflow`...), plus `checkValidity()` (returns a boolean, fires `invalid` if false), `reportValidity()` (same, but also shows the browser's native error UI), and `setCustomValidity("message")` for business-rule errors HTML attributes can't express (e.g. "passwords don't match"). Critically: once you set a custom error, you must clear it with `setCustomValidity("")` the moment the field becomes valid again, or the field stays permanently invalid even after the user fixes it.
- `inputmode` (e.g. `inputmode="numeric"`, `"email"`, `"decimal"`) changes which **mobile keyboard** is shown — it is a UX hint only and validates nothing; don't confuse it with `type`, which does carry real validation semantics (`type="email"`/`type="number"` actually constrain and type-check the value).
- `min`/`max` aren't numeric-only — they apply to `type="date"` (and `datetime-local`, `month`, `week`) too, which is how you'd natively restrict a date-of-birth field to an allowed range instead of hand-rolling age math.
- **Trust boundary:** client-side validation (native or JS) is a UX layer only — it can be bypassed entirely (disabled JS, direct API call, modified request). The server must independently re-validate everything; never treat client validation as a security control.
- Don't reach for a validation library by default. Native attributes + the Constraint Validation API cover most forms; add a library only when complexity, cross-field rules, or consistency needs genuinely justify it.

## Common traps
- Saying "ARIA fixes accessibility" — ARIA only *describes*; it adds zero behavior. `role="button"` doesn't give you keyboard handling, you still write it.
- Claiming semantic HTML is "better for SEO" with no mechanism behind the claim.
- Using `<article>` for layout cards that aren't independently meaningful content.
- Forgetting `type="button"` on non-submit buttons inside a `<form>`.
- Styling a `<div>` to look like an input/button instead of using the native element.
- Treating `placeholder` as a label substitute.
- Confusing `inputmode` (keyboard hint) with `type` (actual validation).
- Setting `setCustomValidity()` for a business-rule error and forgetting to clear it (`""`) once the field becomes valid — the field stays stuck invalid.
- Reaching for a JS validation library as the default instead of starting from native attributes + the Constraint Validation API.

## Model answers

**"Why not just use a styled `<div>` instead of `<button>`?"**
"Because a div gives me exactly one thing — a click target — and nothing else: no role announced to assistive tech, no keyboard focus, no Enter/Space activation, no pressed/disabled state semantics. If I build it myself I have to hand-wire `tabindex`, a `role`, a `keydown` handler for both Enter and Space, and visible focus styles — and I'll probably miss one of the state attributes along the way. A native `<button>` gives me all of that for free from the browser's accessibility tree, so I only reach for a custom widget when there's genuinely no native element that models the interaction."

**"Does marking up a page semantically help SEO?"**
"Not directly — there's no ranking boost just for using `<section>` over `<div>`. What it does is make the page crawlable and parseable: a real `<a href>` is a link a crawler can follow and index, where a `<div onclick>` is invisible to it. And a clean heading/landmark outline helps both crawlers and assistive tech build an accurate structural model of the page. So I'd frame it as 'indexability and accessibility,' not 'ranking.'"

**"How do you validate a signup form at a senior level?"**
"I'd set `novalidate` on the form and own validation in JS, because native bubble messages are inconsistent across browsers and I can't style them. I'd give every input a real `<label for>` and correct `autocomplete` tokens so password managers and mobile autofill work. On submit, I move focus to the first invalid field and surface a single error summary region rather than scattering multiple `role=alert` nodes. And if there's an async uniqueness check — like 'is this email taken' — I treat that as a security question first: that endpoint is an account-enumeration vector, so it needs rate limiting and a response that doesn't leak existence to an unauthenticated caller."

## Mini code example
```html
<!-- Accessible, non-enumerable-by-accident signup field -->
<form novalidate>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required />

  <label for="pwd">Password</label>
  <input id="pwd" name="pwd" type="password" autocomplete="new-password" required minlength="12" />

  <div role="alert" id="error-summary" hidden></div>

  <button type="submit">Create account</button>
  <button type="button" onclick="clearForm()">Cancel</button>
</form>
```

## Rapid-fire Q&A
1. **Q: Does `tabindex="0"` make a div accessible?** A: No — it only makes it focusable. You still need a role and keydown handling.
2. **Q: What's the default `type` of a `<button>` inside a `<form>`?** A: `submit`.
3. **Q: What does `<article>` semantically mean?** A: Self-contained content that would still make sense if syndicated/distributed on its own — not just "a card."
4. **Q: Why avoid an async "email already taken" check without safeguards?** A: It's an account-enumeration vector — rate-limit it and avoid leaking existence.
5. **Q: `:invalid` vs `:user-invalid` — what's the UX difference?** A: `:invalid` matches immediately (too eager); `:user-invalid` only after the user has interacted and left the field.

## Gap log (mine, to re-drill)
- [ ] Say the keyboard contract out loud every time: role + Enter/Space keydown + focus style, not just tabindex.
- [ ] Don't overstate SEO — "crawlability and indexability," never "ranking boost."
- [ ] `<article>` = standalone content unit, not "looks like a card."
- [ ] Forms: name the autocomplete tokens, justify `novalidate`, know `:invalid` vs `:user-invalid`, focus-first-invalid or single error summary.
- [ ] Flag async uniqueness checks as an account-enumeration risk unprompted.
- [ ] Name the Constraint Validation API explicitly: `validity`, `checkValidity()`, `reportValidity()`, `setCustomValidity()` — and remember to clear custom errors.
- [ ] Don't confuse `inputmode` (keyboard hint) with real validation (`type`, `pattern`).
- [ ] State the client/server trust boundary unprompted: client validation is UX, server validation is the real security control.

## Real interview record — Native HTML vs JS validation (scored 6.5/10)
**Question asked:** "For a signup form, would you use native HTML validation or JavaScript validation? Explain your approach."

**What scored well:** leading with native constraints first, reserving JS for cross-field/dynamic/async/business-rule validation, and knowing a library is optional, not default.

**What was marked missing** (now folded into Key Concepts above): `autocomplete`/`inputmode` distinction, the Constraint Validation API by name, `aria-describedby`/`aria-invalid` for accessible dynamic errors, `min`/`max` on dates (not just numbers), avoiding an overengineered email regex, and the explicit client-UX vs server-security trust boundary.

**Improved spoken answer (the L4 bar for this question):** "I wouldn't immediately reach for a JavaScript validation library. I'd start with native HTML validation because it gives useful behavior with very little code — `required`, `type`, `min`, `max`, `pattern` where they match the requirement, plus real labels and accessible error relationships. If I need cross-field rules, dynamic business logic, async checks, or a more controlled experience, I'd add JavaScript and use the Constraint Validation API where appropriate. A library earns its place when it simplifies a genuinely complex form — it isn't the default. I'd avoid an overly strict email regex unless there's a specific product rule requiring it. And regardless of the client-side approach, the backend validates independently — client-side validation is for usability, server-side validation protects data integrity and security."
