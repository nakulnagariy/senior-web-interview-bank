# Box model and margins

### Q: Explain the CSS box model. What does `box-sizing: border-box` change, and why do most teams set it globally? What is margin collapsing, and when does it happen?

- **Asked:** 2026-10-22 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
The box model has layers in order: content, padding, border, margin. `border-box` changes how the browser measures the total width and height: padding and border are included in the specified dimension. Example: 100px width with 10px padding and 5px border is 130px wide with `content-box`, but with `border-box` those are included and the content is squeezed. Set globally for three reasons: predictable responsive layout (a 25% sidebar and 75% content with `content-box` needs calculation, and 1px can break it), no mental math (a mock says a 400px card and it is 400px including padding and border), and consistency (form inputs, selects and buttons default to `border-box` in many browsers while divs and sections default to `content-box`, so a global reset levels it). Gave the global reset with `html { box-sizing: border-box }` and `*, *::before, *::after { box-sizing: inherit }`.

The second part of the question, margin collapsing, was not answered.

**Covered well**
- Layers of the box model in the correct order and the 130px worked example is correct (100 + 2×10 + 2×5).
- Clear reasons for the global reset: percentage layouts and matching design specs.
- The `inherit` reset pattern is the right senior form: it lets a component opt out locally by setting `box-sizing: content-box` on itself.

**Gaps (note)**
- **Margin collapsing was skipped entirely.** The question had two parts. An interviewer notes silent omission as not knowing it. Say "I'll cover margin collapsing next" or answer it. This is a classic L3 to L4 check question.
- The claim that form inputs default to `border-box` is partly wrong. In most browsers, buttons, selects, checkboxes and radios default to `border-box`, but text `<input>` and `<textarea>` default to `content-box` (verify in the browser UA stylesheet). So "many browsers" is vague and the example is shaky. Say what you know, or check DevTools.
- Margin is never inside `box-sizing`, even with `border-box`. Only content, padding and border are counted. Not stated.
- Did not say that with `border-box` the content size is `width − padding − border` and can't go below zero, so a large padding can make the box wider than the declared width.
- No mention of `outline` (not part of the box and takes no space), `box-shadow`, or `min-width` / `max-width` / `calc()` interaction with `box-sizing`.
- Missing: inline elements ignore `width`, `height` and vertical margin; `margin: auto` centering; logical properties (`margin-inline`); and `gap` as the modern alternative to margins between siblings, which sidesteps collapsing.
- Delivery: structured, with a clear list and reset code. Cut the "mental math elimination" phrase. Say "it matches the design spec" instead.

**Complete answer**
"Every element is a box with four layers from the inside out: content, padding, border and margin. Width and height by default set the content box. That is `box-sizing: content-box`, which is the CSS default. So a `width: 100px` box with 10px padding and a 5px border is 130px wide on screen.

With `box-sizing: border-box`, the declared width includes the content, padding and border. The same box stays 100px, and the content area shrinks to 70px. Margin is never included. It is outside the box either way.

Teams set it globally because it makes sizes match the design spec, and it makes percentage layouts safe. A 25% sidebar with padding and a border stays 25%. With `content-box` I would have to subtract the padding and border by hand, using `calc()`. I use the `inherit` pattern, so a third-party widget or one component can opt out locally:

```css
html { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
```

One edge case: with `border-box`, content can't be negative, so if padding and border are larger than the width, the box grows past the declared width.

**Margin collapsing:** adjacent vertical margins combine into one margin, the larger of the two, instead of adding up. It happens in normal block flow, only on the vertical axis (in the block direction, so it follows the writing mode), in three cases:
1. Adjacent siblings: a 20px bottom margin and a 30px top margin give a 30px gap, not 50px.
2. A parent and its first or last child, when nothing separates them: no padding, no border, no height, and no clearance. The child's margin 'escapes' through the parent. It is the classic 'my heading pushes the whole page down' bug.
3. An empty block: its own top and bottom margins collapse together.

It does not happen in flexbox or grid containers (flex and grid items never collapse), for floats, for absolutely positioned elements, for `inline-block`, or when the parent creates a new block formatting context, e.g. `overflow: auto` or `display: flow-root`. Negative margins: the most negative and the largest positive are added together.

In practice I avoid the problem by using one direction for spacing (margin-bottom only, or the lobotomized owl `* + *`), by using `gap` in flex and grid, and by using `display: flow-root` on a container to stop the escape."

```css
.card { display: flow-root; }          /* stops child margin from escaping */
.stack { display: flex; flex-direction: column; gap: 1rem; } /* no collapsing */
```

**Likely follow-ups**
- What if two margins are 20px and −10px? — They are added: 10px.
- Why does my child's `margin-top` move the parent? — The parent has no padding, border or new formatting context, so the margin collapses through it. Fix with `padding`, `border`, or `display: flow-root`.
- Do margins collapse in flexbox? — No, flex and grid items never collapse.
- What are logical properties? — `margin-inline`, `margin-block` etc. follow the writing mode instead of left, right, top, bottom.
- Does `box-sizing` affect `outline`? — No. Outline is outside the box and takes no space.
- When would you use `content-box`? — Inside a third-party component that expects it, or when you want width to mean only content.

**History**
- 2026-10-22: first asked, Partial (box-sizing answer good; margin collapsing not answered; form-input default claim doubtful). Re-ask margin collapsing in different words later.
