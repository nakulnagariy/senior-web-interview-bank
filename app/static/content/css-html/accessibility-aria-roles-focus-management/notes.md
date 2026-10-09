# Accessibility — ARIA roles & focus management (the `<dialog>` deep dive)

## Why interviewers ask this
Modals are the single UI pattern that most reliably exposes whether a candidate has actually built accessible components versus read about ARIA. There's a real, specific native API (`<dialog>`) with real, specific behavior and real gaps — a precise answer here signals production experience; a vague "I use ARIA and trap focus" answer doesn't.

## Key concepts

**`showModal()` makes the background `inert`, not a hand-rolled focus trap — and `show()` is a different method entirely.**
When you call `dialog.showModal()`, the browser renders the dialog in the top layer and makes everything outside it `inert`: it's unfocusable, unclickable, and hidden from the accessibility tree — the browser does this natively, you are not writing a `keydown`-based focus trap (listening for Tab and manually cycling focus). That's a meaningfully stronger guarantee than a custom focus trap, which has to intercept every edge case (Tab, Shift+Tab, click-through, scripting) by hand. `show()`, by contrast, opens a **non-modal** dialog — no inertness, no top-layer modal semantics, background stays interactive. Know and state the distinction unprompted; reaching for `show()` when you meant a modal is a real bug, not a style choice.

**Native `<dialog>` reduces the work, it doesn't eliminate it.**
Even with `showModal()`, you still own: choosing the right **initial focus target** (not always the first focusable element — sometimes it should be the heading or a specific field), focus **restoration** to the trigger (spec behavior, but verify your actual markup doesn't fight it), an accessible **name** and **description**, content scrolling behavior, and whatever app-specific dismissal policy the product wants. "I used native `<dialog>`" is not itself a complete accessibility answer — say what you still had to decide.

**Give the dialog a real accessible name and description.**
Use a heading inside the dialog plus `aria-labelledby` pointing at it for the accessible name; add `aria-describedby` pointing at supporting text when a description genuinely helps. Don't invent a disconnected `aria-label` string when a visible heading already exists — point to it instead, so sighted and AT users get the same name.

**Focus restore on close is spec behavior.**
When the dialog closes, focus returns to whatever element had focus before `showModal()` was called (typically the trigger button) — natively, by spec. State this confidently in an interview; don't hedge on it as "I think it does that" — it's a defined part of the `<dialog>` contract, not an implementation detail you have to add yourself.

**`aria-modal="true"` is a hint, not an enforcement mechanism — and don't add it to a native dialog that doesn't need it.**
If you build a *custom* modal (not the native element), adding `aria-modal="true"` only tells assistive tech "treat everything outside this as hidden" — it is advisory to AT, it does not actually make the rest of the page inert or unclickable to a sighted mouse user. For a custom implementation you must *also* apply `inert` (or manually manage `aria-hidden` + tabindex) on everything outside the dialog to get the real behavior `aria-modal` only hints at. The flip side, equally worth stating: don't blindly bolt `aria-modal="true"` onto a **native** `<dialog>` opened with `showModal()` — the native element's modal semantics are already conveyed to the accessibility tree; adding the attribute redundantly is a tell that you don't know which layer is already doing the work.

**Backdrop-click dismissal is a product decision, not an automatic accessibility requirement.**
Nothing about accessibility *requires* that clicking outside the dialog closes it — some products want that, some deliberately don't (to prevent accidental data loss on a form dialog). Don't present it as a checkbox every modal must have; treat it as a UX call you make deliberately, and wire it yourself either way since native `<dialog>` doesn't do it automatically.

**`cancel` event vs `<form method="dialog">`.**
- The `cancel` event fires when the user presses Escape. `event.preventDefault()` on it blocks the dialog from closing — useful for "are you sure you want to discard changes?" guards.
- `<form method="dialog">` lets a submit button close the dialog and set `dialog.returnValue` to that button's `value`, without you wiring a submit handler just to call `.close()`. Good for simple confirm/cancel dialogs; not a replacement for real form submission logic.

**What native `<dialog>` does *not* give you.**
- No scroll lock on the background by default (the page behind can sometimes still scroll depending on layout — test it; some teams add `overflow: hidden` on `<body>` manually).
- No backdrop-click-to-close — you wire that yourself (listen for a click on the `::backdrop` region or check `event.target === dialog`).
- No open/close animation — `<dialog>` toggles display abruptly; animating entry/exit (and the `::backdrop`) is on you, and `@starting-style`/`transition-behavior: allow-discrete` are the modern way to animate the display-none↔block jump (verify current browser support before asserting this works everywhere).

**When a custom ARIA widget is actually justified.**
Build custom (not native) only when there's genuinely no native element for the interaction pattern: `combobox` (autocomplete input + listbox), `tabs`, `tree` (file-explorer style nested selectable lists). For anything with a native equivalent — modal, button, select, details/summary, popover — prefer the native element and spend your engineering effort on styling it, not re-implementing its behavior.

**Testing — know which tool catches what.**
- **axe (axe-core / `jest-axe` / browser extension):** static rule checks — missing labels, contrast ratios, missing roles, invalid ARIA attribute combinations. It does **not** tell you if keyboard navigation actually works end-to-end.
- **Playwright/Cypress keyboard-focus tests:** scripted Tab/Enter/Escape sequences asserting the right element has focus at each step — catches real focus-trap and focus-restore regressions that axe can't see.
- **Manual screen reader pass (NVDA/VoiceOver/JAWS):** the only way to verify the thing is actually *announced* sensibly, not just structurally valid — axe can confirm a role exists and is spelled right, it can't confirm the experience makes sense read aloud.
- **Don't claim Lighthouse catches "click-only-works-on-div-not-keyboard"** — it doesn't do interaction testing. Catching that requires manual keyboard testing, `eslint-plugin-jsx-a11y` (`click-events-have-key-events`, `no-noninteractive-element-interactions`) at write time, and axe in CI for the static half.

## Common traps
- Describing a hand-rolled Tab-cycling focus trap as *the* way to do modals, without mentioning `<dialog>`/`showModal()` exists and does it natively.
- Treating `aria-modal` as if it enforces inertness by itself.
- Claiming any single tool (Lighthouse, axe) is sufficient a11y test coverage.
- Forgetting native `<dialog>` has no backdrop-click-close or scroll lock out of the box — claiming it "just works" fully.

## Model answers

**"How do you build an accessible modal?"**
"I start from native `<dialog>` and `showModal()` rather than a custom ARIA widget, because the browser makes the background `inert` for me — unfocusable, unclickable, hidden from the a11y tree — which is a stronger guarantee than a hand-rolled focus trap. Focus restore to the trigger on close is spec behavior, also free. What I still have to add myself: backdrop-click-to-close, scroll lock on the body if needed, and any open/close animation, since none of those are native `<dialog>` behavior. If I ever need a fully custom modal — say, for an animation requirement native `<dialog>` can't do cleanly — I'd add `aria-modal="true"` *and* actually apply `inert` to the rest of the page, since `aria-modal` alone is only a hint to assistive tech, not real enforcement."

**"How do you test that a modal is accessible?"**
"Three layers, because no single tool covers all of it. axe or `jest-axe` for the static rule-checking half — roles, labels, contrast. A Playwright test that scripts Tab/Shift+Tab/Escape and asserts focus lands where I expect, to catch focus-trap and focus-restore regressions. And at least one manual pass with a real screen reader — NVDA or VoiceOver — because that's the only way to know the experience is actually sensible when announced, not just structurally valid. Lighthouse doesn't do interaction testing, so I wouldn't rely on it to catch a keyboard-only bug."

## Mini code example
```html
<dialog id="confirm">
  <form method="dialog">
    <p>Discard unsaved changes?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Discard</button>
  </form>
</dialog>

<script>
  const dialog = document.getElementById('confirm');

  dialog.addEventListener('cancel', (e) => {
    // Escape pressed — block close if there's a stronger guard needed
    // e.preventDefault();
  });

  dialog.addEventListener('close', () => {
    console.log('closed with:', dialog.returnValue); // "cancel" | "confirm"
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close(); // backdrop click — not native, wired by hand
  });
</script>
```

## Rapid-fire Q&A
1. **Q: What does `showModal()` do to the rest of the page?** A: Makes it `inert` — unfocusable, unclickable, hidden from the a11y tree — natively.
2. **Q: Does `<dialog>` restore focus to the trigger on close?** A: Yes, by spec.
3. **Q: Does `aria-modal="true"` make the background actually unclickable?** A: No — it's a hint to AT only; you must add `inert` yourself for a custom modal.
4. **Q: Does native `<dialog>` lock body scroll or close on backdrop click by default?** A: No to both — you wire them yourself.
5. **Q: Which tool would catch a div that only responds to click, not Enter?** A: None automatically except a manual keyboard pass / targeted Playwright test — not Lighthouse, not axe alone.

## Gap log (mine, to re-drill)
- [ ] Lead with `showModal()` = native `inert`, not "I build a focus trap."
- [ ] State focus-restore-on-close confidently as spec behavior, no hedging.
- [ ] `aria-modal` is a hint; pair custom modals with real `inert`. Also: don't add it redundantly to a native dialog that already conveys modal semantics.
- [ ] Name all three test layers (axe, Playwright focus script, manual screen reader) — never claim one tool is enough.
- [ ] Don't claim Lighthouse catches keyboard-only interaction bugs.
- [ ] Say `show()` vs `showModal()` explicitly — non-modal vs modal — don't assume "dialog" always means modal.
- [ ] Even with native `<dialog>`, name what you still own: initial focus target, accessible name/description (`aria-labelledby`/`aria-describedby`), scrolling, dismissal policy.
- [ ] Backdrop-click-to-close is a product decision, not a required a11y checkbox — don't present it as mandatory.

## Real interview record — custom `div[role=dialog]` vs native `<dialog>` (scored 7.5/10)
**Question asked:** "Would you build a modal using a custom `<div role="dialog">` or use the native HTML `<dialog>` element?"

**What scored well:** choosing native `<dialog>` as the default and citing its built-in modal behavior and accessibility support.

**What was marked as missing** (now folded into Key Concepts above): the `show()` vs `showModal()` distinction, that native dialog reduces but doesn't eliminate the accessibility work (focus target, focus restoration, naming, scrolling, dismissal policy), using a heading + `aria-labelledby` for the accessible name, not bolting `aria-modal` onto a native dialog that already conveys modal semantics, and treating backdrop-click as a product decision rather than a required behavior.

**Improved spoken answer (the L4 bar for this question):** "I'd generally prefer the native `<dialog>` element for a true modal because it gives us built-in browser behavior and reduces the accessibility behavior we have to recreate. I'd open it with `showModal()`, not `show()`, because `showModal()` gives us real modal behavior and makes the rest of the page inert while it's open. I'd give it an accessible name using a heading and `aria-labelledby`, and add a description if that helps users understand the dialog. But I wouldn't assume native dialog solves everything — I'd still choose the right initial focus target, make sure focus returns to the triggering element, and test keyboard behavior, Escape handling, scrolling, and mobile layouts. I'd validate at three levels: automated checks with a tool like axe, manual keyboard testing, and screen-reader testing with NVDA or VoiceOver. I'd reach for a custom dialog only if the native element couldn't meet a specific product requirement without excessive workarounds — prefer native semantics first, then verify the full experience."
