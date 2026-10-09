# Semantic HTML and accessibility

> Seeded on 2026-10-09 from `gap-log.md` (HTML session of 2026-09-29). The original question wording and your spoken answers were not recorded then, so "My answer" holds only what the gap log noted. New sessions record everything verbatim.

### Q: Semantic HTML: how do you make a clickable `<div>` accessible, and why prefer a native element? (Q1)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: said `tabindex` alone was enough.

**Covered well**
- Knew a keyboard focus problem exists.

**Gaps (note)**
- `tabindex="0"` only makes the element focusable. It still has no role, no name semantics, and no Enter/Space activation.
- Missed that a native `<button>` gives role, name, state, focus, and keyboard activation for free.

**Complete answer**
"I wouldn't make a div clickable at all. I'd use a `<button>`. It is focusable, announced as a button, and activates on Enter and Space, with no extra code.

If I were forced to use a div, `tabindex` is only the first of five things I'd need. One: `tabindex="0"` so it takes focus. Two: `role="button"` so assistive tech announces it. Three: a keydown handler for Enter and a keyup handler for Space, because that is how native buttons behave. Four: visible `:focus-visible` styles. Five: an accessible name, plus `aria-disabled` or `aria-pressed` where they apply.

That is a lot of code to rebuild what the browser already does, and every piece is a place to get it wrong. So native element first, ARIA only when no native element exists."

```html
<!-- yes -->
<button type="button" class="card-action">Add to cart</button>

<!-- only if you truly cannot: -->
<div role="button" tabindex="0" onkeydown="/* Enter */" onkeyup="/* Space */">Add to cart</div>
```

**Likely follow-ups**
- Why is the first rule of ARIA "don't use ARIA"? — Because a native element already has the right role and behaviour; ARIA only changes what is announced, it adds no behaviour.

**History**
- 2026-09-29: first asked, Partial

### Q: `<a>` versus `<button>`: when do you use which? (Q2)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: missed the navigation-versus-action rule and the default `type` of a button in a form.

**Covered well**
- Not recorded.

**Gaps (note)**
- Link = navigation to a URL. Button = performs an action on the current page.
- A `<button>` inside a `<form>` defaults to `type="submit"`. A "cancel" or "toggle" button will submit the form unless you write `type="button"`.

**Complete answer**
"If it goes somewhere, it is a link with a real `href`. If it does something, it is a button. Links get middle-click, open in new tab, and copy-link for free, and crawlers follow them. Buttons are for actions like open a menu, save, or toggle.

One trap: inside a form a button is `type=submit` by default, so I always write `type="button"` for non-submit buttons. And I never use `<a href="#">` with a click handler as a button."

**Likely follow-ups**
- What about a button styled like a link? — Fine if it is an action; keep semantics, style with CSS.

**History**
- 2026-09-29: first asked, Partial

### Q: Form labels and touch targets: how do you label inputs properly? (Q3)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: relied on placeholder text; missed `<label for>`, accessible name and touch target size.

**Covered well**
- Not recorded.

**Gaps (note)**
- Placeholder is not a label: it disappears on input, often has poor contrast, and is not a reliable accessible name.
- Missed `<label for="id">` (or wrapping the input) and that clicking the label focuses the input.
- Missed touch target size.

**Complete answer**
"Every input gets a visible `<label for>` that matches the input `id`, or wraps it. That gives the field its accessible name, and clicking the label focuses the field, which also enlarges the tap area. Placeholders are only hints: they vanish as soon as you type, they usually fail contrast, and they are not a dependable name.

For touch targets, WCAG 2.2 AA asks for at least 24 by 24 CSS pixels (2.5.8), and platform guidance is around 44 to 48 pixels, so I size controls and spacing to that. Hint text goes in `aria-describedby`."

**Likely follow-ups**
- When is `aria-label` acceptable? — When there is no visible text, such as an icon-only button. Visible label beats it.

**History**
- 2026-09-29: first asked, Partial

### Q: Landmarks and heading structure; what does `<article>` mean? (Q3b)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: treated `<article>` as a layout wrapper.

**Covered well**
- Not recorded.

**Gaps (note)**
- `<article>` is self-contained content that makes sense on its own (a post, a card that could be syndicated). It is not a layout box.
- Landmarks (`header`, `nav`, `main`, `aside`, `footer`) and a logical heading hierarchy.

**Complete answer**
"Landmarks let screen reader users jump around the page: `header`, `nav`, `main` (exactly one), `aside`, `footer`. Headings give the outline: one `h1`, then `h2` and `h3` in order without skipping levels for styling reasons.

`<article>` is a self-contained piece of content, like a blog post or a product card, that would still make sense if lifted out of the page. `<section>` is a thematic group that normally has a heading. If it is only for layout, it should be a `<div>`."

**Likely follow-ups**
- When do `header` and `footer` count as landmarks? — Only when they are not nested inside `article`, `section`, `main`, etc. (verify against the HTML-AAM spec).

**History**
- 2026-09-29: first asked, Partial

### Q: Does semantic HTML improve SEO? (Q3c)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: over-claimed a ranking benefit.

**Covered well**
- Not recorded.

**Gaps (note)**
- No direct ranking boost from using semantic tags.
- Crawlability depends on real `<a href>` links, not click handlers.

**Complete answer**
"I'd be careful not to promise a ranking boost. Search engines don't rank higher for using `<nav>` instead of `<div>`. What semantics do is help crawlers and assistive tech understand structure. The real SEO wins are crawlable links (`<a href>`, not JS click handlers), a sensible heading structure, unique titles, and content that is rendered in HTML the crawler can see."

**Likely follow-ups**
- What breaks crawling in a SPA? — Links without `href`, content only after client-side fetch, blocked resources.

**History**
- 2026-09-29: first asked, Partial

### Q: Native `<dialog>` versus a custom modal; how do you build and test an accessible one? (Q5)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: described a classic focus trap, hedged on facts, answer sounded pasted.

**Covered well**
- Not recorded.

**Gaps (note)**
- `showModal()` makes the rest of the page inert; it is not a classic focus trap.
- Focus returns to the trigger on close (spec behaviour; say it confidently).
- `aria-modal` is only a hint; a custom dialog needs `inert` on the background.
- `cancel` event (can `preventDefault`) and `<form method="dialog">` with `returnValue`.
- Native does not give you scroll lock, backdrop click, or animation.
- When custom ARIA is right: no native equivalent (combobox, tabs, tree).
- Testing: say what each tool catches.

**Complete answer**
"I'd use native `<dialog>` and open it with `showModal()`. That puts it in the top layer, gives a `::backdrop`, makes the rest of the document inert so focus and screen readers can't reach behind it, closes on Esc, and returns focus to the element that opened it.

It does not do everything. There's no scroll lock, no click-on-backdrop to close, and no animation, so I add those myself. I listen for the `cancel` event if I need to confirm before closing, and use `<form method="dialog">` so a button closes the dialog and sets `returnValue`.

I'd only build a custom dialog when I can't use the native one. Then I need `role="dialog"`, `aria-modal`, an accessible name, `inert` on everything else, and focus management by hand. `aria-modal` alone only hints; it doesn't block anything.

For testing: axe in CI catches static problems like missing names. Playwright tests catch focus behaviour, such as focus moves in, Esc closes, focus returns. And I'd do a manual pass with NVDA or VoiceOver, because only that tells me what a user actually hears. I use custom ARIA widgets only where there's no native element, like combobox, tabs, or tree."

**Likely follow-ups**
- Why not just use `role="dialog"` on a div? — You'd re-implement inertness, focus return, and Esc yourself.

**History**
- 2026-09-29: first asked, Partial

### Q: Which accessibility problems can automated tools catch? (follow-up)

- **Asked:** 2026-09-29 · **Verdict:** Wrong · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: claimed Lighthouse catches click-on-div.

**Covered well**
- Not recorded.

**Gaps (note)**
- Lighthouse (axe-based) cannot tell that a `div` has a click handler pretending to be a button.

**Complete answer**
"Automated tools find roughly a third of issues, the rule-based ones: missing alt text, contrast, missing form labels, bad ARIA attributes. They can't see intent, so a click handler on a div is invisible to them.

So I layer it: `eslint-plugin-jsx-a11y` in the editor and CI to catch non-semantic clickable elements in code, axe in CI for rendered pages, Playwright for keyboard flows, and a manual keyboard and screen reader pass before release."

**Likely follow-ups**
- What share of WCAG issues can be automated? — Often quoted as 30 to 40 percent (verify the source before citing a number).

**History**
- 2026-09-29: first asked, Wrong
