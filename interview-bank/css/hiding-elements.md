# Hiding elements

### Q: What's the difference between `display: none`, `visibility: hidden`, `opacity: 0` and the `hidden` attribute? For each one, say what happens to layout, to events, and to screen readers. When would you pick each?

- **Asked:** 2026-10-22 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Short version first: `display: none` frees the space. `visibility: hidden` hides the element but leaves the space, and it is "available for the screen reader". `opacity: 0` works like visibility but hides with opacity, also available for the screen reader. `hidden` is a native HTML attribute that works in all browsers.

Then in detail. `display: none`: the element is removed from the render tree, so no hover or click, and other elements can take its space. Use for closed modals, inactive mobile nav, accordions. `visibility: hidden`: the element stays in layout like an invisible man, keeping width and height. All pointer events are disabled. Good when you don't want layout shift, e.g. reserving space for an error message under a form field. `opacity: 0`: the element is fully painted, just 100% transparent. It keeps its space, all events still work (a transparent button or link still triggers), it is announced by screen readers and reachable by keyboard Tab, so a blind user tabs into an invisible button. Better used for animation and transitions, then paired with `display` or `visibility`. `hidden`: uses the user-agent stylesheet to apply `display: none` through an attribute selector, so author CSS can override it. Use it for semantic show/hide in plain JS or SSR. Add `[hidden] { display: none !important; }` to the reset.

**Covered well**
- `display: none` layout and events: removed from the render tree, space freed, no hover or click.
- `opacity: 0` is the strongest part: still painted, still clickable, still focusable, announced by screen readers, so the keyboard trap and invisible button risk. Good practical example.
- Pairing `opacity` with `visibility` or `display` for animations.
- `hidden` is a user-agent `display: none` that author CSS can override, and the `[hidden] { display: none !important; }` reset fix. Strong, senior detail.
- Real use cases for each one.

**Gaps (note)**
- **Wrong, then contradicted:** the opening said `visibility: hidden` is available to screen readers. It is not. `visibility: hidden` removes the element from the accessibility tree and from the tab order, just like `display: none`. You later said events are disabled, but never corrected the screen reader claim. An interviewer will notice the inconsistency and the wrong fact.
- Never said what `display: none` and `hidden` do for screen readers: both remove the element from the accessibility tree and from tab order. A complete answer covers layout, events, screen reader and focus for every option. A comparison table in your head helps.
- Missing: children of a `visibility: hidden` parent can opt back in with `visibility: visible`. Does not work for `display: none` or `opacity`.
- Missing: transitions. `display` was not animatable. Modern CSS can do it with `transition-behavior: allow-discrete` and `@starting-style` (verify browser support). `visibility` flips discretely but can be delayed to fit a fade. Say how you fade out and then really hide.
- Missing: `opacity: 0` creates a stacking context and animates cheaply on the compositor. To stop clicks use `pointer-events: none`, but that does not stop keyboard focus.
- Missing: the visually-hidden / `sr-only` pattern (hide visually but keep for screen readers), and `aria-hidden="true"` (hides from SR but leaves it focusable, a known a11y bug). Also `inert` for removing a subtree from interaction. These are what a senior pairs with this question.
- Missing: `hidden="until-found"` (content stays searchable by find-in-page and fragment links, expands on match; verify support).
- The error message example is weak: `visibility: hidden` also hides it from screen readers when it later appears unless you toggle it correctly. Better: reserve space with `min-height` and use a live region (`aria-live` or `role="alert"`) that is empty until needed.
- Delivery: a short summary followed by a long detail pass is good structure, but the summary should be correct. Tighten to one comparison, then the use cases.

**Complete answer**
"I compare them on four things: layout, pointer events, keyboard focus, and screen readers.

`display: none`: the element is not rendered at all. It takes no space, gets no events, cannot be focused, and is removed from the accessibility tree. I use it for things that are truly off: a closed modal, an inactive tab panel, mobile nav that is closed. The cost is that it cannot be animated directly, and toggling it triggers layout.

`visibility: hidden`: the box is still laid out, so the space is kept, but it is invisible, not clickable, not focusable, and removed from the accessibility tree. So I'm hiding it from everyone, and keeping the space. That is useful to avoid layout shift. A child can set `visibility: visible` to opt back in. For the transition, it flips at a discrete point, so I pair it with opacity for fade-out.

`opacity: 0`: the element is still fully painted, just transparent. Layout is kept, it still receives clicks, it is still focusable, and screen readers still read it. That is the dangerous one: a keyboard user tabs into something invisible. So I use it for animation, usually with `visibility` or `pointer-events: none` and `inert`, never as the final hidden state on its own. It is cheap to animate because it runs on the compositor, and it creates a stacking context.

`hidden` attribute: semantic. The browser's default stylesheet maps it to `display: none`, so it behaves the same, but my author CSS such as `display: flex` overrides it, so I add `[hidden] { display: none !important; }` to my reset. It is good for server-rendered state or simple JS toggles. `hidden="until-found"` keeps content searchable and expands it on find-in-page (verify support).

Two related tools: the visually-hidden pattern keeps content for screen readers only, like skip links and icon button labels. `aria-hidden="true"` hides from screen readers but does not stop focus, so never put it on a focusable element. For a fade-out, I use opacity plus a delayed `visibility` transition, or `transition-behavior: allow-discrete` with `@starting-style` for `display` (verify support)."

```css
[hidden] { display: none !important; }

.fade { opacity: 1; visibility: visible; transition: opacity .2s, visibility 0s; }
.fade.is-hidden {
  opacity: 0;
  visibility: hidden;          /* removed from a11y tree + tab order */
  transition: opacity .2s, visibility 0s .2s; /* hide after the fade */
}

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}
```

**Likely follow-ups**
- Which of these keep the element in the accessibility tree? — Only `opacity: 0` (and visually-hidden techniques); `display: none`, `visibility: hidden` and `hidden` remove it.
- How do you hide something visually but keep it for screen readers? — The `sr-only` clip pattern, not `display: none` or `visibility: hidden`.
- Why is `aria-hidden="true"` on a button a bug? — It is hidden from screen readers but still focusable, so a keyboard user lands on a silent control.
- How do you animate a dropdown out and then remove it? — Fade with opacity then flip `visibility` after the duration, or use `transition-behavior: allow-discrete` for `display` (verify support).
- Which one causes layout recalculation when toggled? — `display` does; `visibility` and `opacity` do not change layout.
- What does `inert` do? — Makes a subtree non-interactive and not focusable and hidden to assistive tech, without hiding it visually.

**History**
- 2026-10-22: first asked, Partial (visibility and screen reader claim wrong; display and hidden SR behaviour not stated; missing sr-only, aria-hidden, transitions)
