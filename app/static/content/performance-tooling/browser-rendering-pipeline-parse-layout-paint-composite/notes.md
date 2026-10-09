# Browser rendering pipeline — parse, layout, paint, composite

## Why interviewers ask this
Almost everyone can recite "parse, layout, paint" as a phrase. The L4 bar is explaining *why* each stage blocks or doesn't block the next one, what the preload scanner can and can't see, and — critically — being able to say how you'd *measure* a claim instead of asserting it.

## Key concepts

**Bytes → tokens → DOM; CSS bytes → CSSOM.**
The HTML parser turns bytes into tokens into DOM nodes incrementally, as they arrive — it doesn't wait for the whole document. CSS is parsed separately into the CSSOM. DOM + CSSOM combine into the **render tree** (visible nodes with their computed styles — `display:none` nodes are excluded).

**Where scripts belong, and the outdated advice to retire.**
"Put scripts at the bottom of `<body>`" was the old workaround for script tags blocking parsing. With `defer`/`type="module"`, that's obsolete: put scripts in `<head>` with `defer` so the browser discovers and starts fetching them as early as possible, without blocking parsing (see the Script Loading notes for the full `async`/`defer`/module breakdown — this is the same mechanism from the rendering-pipeline angle).

**CSS blocks rendering, and blocks *subsequent synchronous scripts* — but does not block DOM parsing itself.**
This is the precise distinction worth stating explicitly:
- The HTML parser keeps building the DOM while a stylesheet downloads — CSS does not pause DOM construction.
- CSS **does** block rendering — the browser won't paint anything until it has the CSSOM, because painting with incomplete styles would mean visible flashes of unstyled/wrongly-styled content.
- CSS **does** block a synchronous classic `<script>` that comes after it in the document, because that script might call something like `getComputedStyle()` which needs the CSSOM to be ready — so the browser conservatively holds it.
So: "CSS blocks parsing" is wrong; "CSS blocks rendering and can block scripts after it" is right.

**Layout → paint → composite, and the compositor-only shortcut.**
- **Layout (reflow):** compute exact geometry (position, size) for every render-tree node.
- **Paint:** fill in pixels for each node onto layers (text, colors, shadows, images).
- **Composite:** combine the painted layers into the final frame, accounting for stacking order, transforms, opacity.
`transform` and `opacity` changes can skip layout *and* paint entirely and go straight to a compositor-only recomposite — that's specifically why they're the recommended properties to animate (cheap, GPU-accelerated, no reflow). Animating `width`, `top`/`left`, or anything that affects geometry forces layout on every frame.

**The preload scanner's blind spots.**
The browser's speculative preload scanner looks ahead in the raw HTML to start fetching resources (scripts, `<link>` stylesheets, `<img>` tags) before the main parser even gets there — a real, meaningful performance optimization. But it only sees what's **in the HTML markup**. It cannot see:
- resources referenced only inside CSS (`background-image`, `@font-face` `src`) — those are only discovered once the CSSOM is actually parsed, which is later,
- resources injected by JavaScript (an `<img>` created and appended at runtime) — those don't exist in the markup at all until the script runs.
Both classes load measurably later than markup-declared resources — a real reason to prefer `<img>` in markup over JS-injected images for anything above the fold, and to consider `font-display`/preloading critical `@font-face` fonts explicitly.

**You must answer "how would you measure this."**
Any performance claim in this topic needs a concrete measurement method attached, or it's just an assertion:
- **Chrome DevTools Performance panel + Network panel together** — Performance shows the parse/layout/paint/composite time breakdown; Network shows the request waterfall (when a resource was discovered, queued, and downloaded) — you need both to diagnose a slow resource vs. a slow render.
- **Lighthouse** for repeatable lab measurements under a fixed, controlled profile.
- **`web-vitals` library / real-user monitoring (RUM)** for actual field data, plus checking Core Web Vitals (LCP, INP, CLS) to confirm a lab improvement actually helped real users.
Never say something like "this massively reduces FCP" without having measured it, or being ready to say exactly how you would.

**Preload and `fetchpriority` are selective tools, not something to apply broadly.**
The preload scanner/speculative parser can discover and start fetching resources even while the main parser is blocked on something else — genuinely useful. But preloading or raising priority on more than the handful of truly critical resources backfires: it creates contention on the network/priority queue, competing with the requests that actually matter (including, ironically, the real LCP resource). Be deliberate and selective — this is a common "I'd just preload more stuff" mistake to avoid.

**Supporting optimizations worth naming:**
- `<link rel="preconnect">` — open the connection (DNS+TCP+TLS) to a critical third-party origin early, before the resource request itself is even known.
- `font-display: swap` (or `optional`) — control whether text is invisible (`block`), shown in a fallback font immediately (`swap`), or skipped entirely if the webfont is slow (`optional`), while the real font loads.
- **Critical CSS** inlined in `<head>` for above-the-fold content, with the rest loaded non-blocking (`<link rel="stylesheet" media="print" onload="this.media='all'">`-style patterns, or a build-time critical-CSS extraction step).
- `<link media="...">` on a stylesheet lets the browser deprioritize it if the media query doesn't currently match (e.g. a print stylesheet doesn't block rendering of the screen view).

## Common traps
- Saying "CSS blocks parsing" instead of the precise "CSS blocks rendering and subsequent synchronous scripts, not DOM construction."
- Repeating "scripts belong at the bottom of body" without qualifying that `defer`/`module` make head placement better.
- Not knowing `transform`/`opacity` can skip layout and paint via the compositor.
- Asserting the preload scanner sees CSS-referenced or JS-injected resources — it doesn't.
- Making an unmeasured performance claim without naming how you'd verify it.

## Model answers

**"Walk me through what happens between receiving HTML and painting pixels."**
"The HTML parser tokenizes and builds the DOM incrementally as bytes arrive — it doesn't wait for the whole document. CSS is parsed in parallel into the CSSOM; DOM and CSSOM combine into a render tree of visible nodes with computed styles. From there: layout computes exact geometry for every node, paint fills in pixels per layer, and composite assembles the layers — accounting for transforms and stacking — into the final frame. The two blocking relationships worth calling out specifically: CSS blocks rendering (and any synchronous script after it that might query computed styles), but it does not block DOM construction itself; and `transform`/`opacity` changes can skip layout and paint entirely and go straight to a compositor-only recomposite, which is why those are the properties you animate for performance."

**"Why might an above-the-fold background image load late?"**
"If it's declared in CSS — `background-image` — the preload scanner can't see it, because the scanner only looks ahead in the raw HTML markup, not inside stylesheets. It's only discovered once the CSSOM is actually parsed, which happens later than markup-declared resources like an `<img>` tag. For anything critical above the fold, I'd either use a real `<img>` in markup, or explicitly preload the background image with `<link rel=preload as=image>`, and I'd verify the actual timing difference in the DevTools Performance panel or WebPageTest rather than assuming."

## Mini code example
```html
<head>
  <link rel="preconnect" href="https://fonts.example.com" />
  <link rel="preload" as="font" href="/fonts/brand.woff2" crossorigin />
  <style>
    @font-face { font-family: Brand; src: url(/fonts/brand.woff2); font-display: swap; }
    /* critical above-the-fold CSS inlined here */
  </style>
  <link rel="stylesheet" href="/non-critical.css" media="print" onload="this.media='all'" />
  <script src="/app.js" defer></script>
</head>
```
```css
/* compositor-only — animates without triggering layout or paint recalculation */
.card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  opacity: 0.95;
}
```

## Rapid-fire Q&A
1. **Q: Does CSS block DOM construction?** A: No — it blocks rendering and subsequent synchronous scripts, not parsing itself.
2. **Q: Which two CSS properties can skip layout and paint entirely?** A: `transform` and `opacity`.
3. **Q: Can the preload scanner see a `background-image` declared in a CSS file?** A: No — only markup-declared resources are visible to it until the CSSOM is parsed.
4. **Q: What tool gives you real-user field performance data, not a single synthetic run?** A: The `web-vitals` library (RUM).
5. **Q: Is "put scripts at the bottom of body" still the right default advice?** A: No — with `defer`/`module`, head placement with `defer` is better.

## Gap log (mine, to re-drill)
- [ ] Precise phrasing: "CSS blocks rendering and sync scripts after it, not DOM parsing."
- [ ] Full pipeline with the bytes→tokens→DOM step, not skipping straight to "layout/paint/composite."
- [ ] `transform`/`opacity` = compositor-only shortcut — name it unprompted when discussing animation perf.
- [ ] Preload scanner blind spots: CSS-referenced resources and JS-injected resources both load late.
- [ ] Always attach a measurement method (DevTools Performance + Network together, Lighthouse, web-vitals RUM) to any perf claim — never assert unmeasured numbers.
- [ ] Mention preconnect, font-display, critical CSS, `<link media>` as the supporting toolkit.
- [ ] Explicitly separate compositing from paint as its own stage — don't collapse the pipeline to "layout, paint" and skip it.
- [ ] Preload/`fetchpriority` are selective — don't imply "preload more things" as a general fix; name the network-contention downside unprompted.

## Real interview record — HTML response to first pixels (scored ~7.5/10 Senior, ~6.5-7/10 Lead)
**Question asked:** "Walk through what happens from the browser receiving an HTML response to displaying the first pixels. Explain how scripts, CSS, and resource loading affect the process."

**What scored well:** the core pipeline (DOM, CSSOM, render tree, layout, paint) and discussing `async`/`defer`, preloading, and fonts.

**What was marked as missing or imprecise** (now folded into Key Concepts above): HTML parsing being incremental (tokens→DOM as bytes arrive), compositing as its own distinct stage after paint, overstating CSS as fully blocking all pixels rather than "blocks rendering and reliable styled construction," external module scripts being deferred by default, the preload-scanner-can-work-while-parser-blocked nuance, selectivity of preload/`fetchpriority`, and naming concrete measurement tools (DevTools Performance+Network, Lighthouse, RUM) with specific metrics (LCP, INP, CLS).

**Improved spoken answer (the L4 bar for this question):** "When the browser receives the HTML response, it parses the document incrementally and builds the DOM as bytes arrive. As it discovers resources it starts fetching CSS, JavaScript, images, and fonts. A classic synchronous script can block HTML parsing; with `defer`, scripts download in parallel and execute after parsing, in document order; with `async`, they execute as soon as they're ready, so execution order isn't guaranteed; external module scripts are deferred by default. The browser parses CSS into the CSSOM, combines DOM and CSSOM into a render tree, performs layout to calculate positions and sizes, paints text/backgrounds/borders/images, and finally composites the layers into the frame shown on screen. The real lever is resource discovery and prioritization: if the LCP image is discovered late, I'd check whether it can be discovered earlier or selectively preloaded — not preload everything, since that creates network contention. I'd verify any change in DevTools' Network and Performance panels, use Lighthouse for repeatable lab measurement, and then check field data and Core Web Vitals to confirm the improvement is real for users. The goal isn't loading more resources faster in the abstract — it's helping the browser discover and prioritize the *right* resources at the right time."
