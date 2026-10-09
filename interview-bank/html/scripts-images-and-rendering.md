# Script loading, images and the rendering pipeline

> Seeded on 2026-10-09 from `gap-log.md` (HTML session of 2026-09-29). Original wording and spoken answers were not recorded then.

### Q: `async` versus `defer` versus module scripts, and what each does to DOMContentLoaded

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: described `async` as for "dependent" scripts.

**Covered well**
- Not recorded.

**Gaps (note)**
- `async` is for independent scripts. Execution order is not guaranteed.
- `DOMContentLoaded` waits for `defer` and module scripts, but NOT for `async`.
- Module specifics: strict mode, own scope, executed once per URL, fetched with CORS, deferred by default, `async` overrides that, `nomodule` fallback.
- Inline classic scripts ignore `defer` and `async`.
- Classic scripts wait for pending stylesheets before running, which hurts LCP.

**Complete answer**
"A plain script blocks the HTML parser while it downloads and runs.

`defer` downloads in parallel, runs after parsing finishes, in document order, and before `DOMContentLoaded`. That is my default for app code.

`async` downloads in parallel and runs as soon as it arrives, in any order, so it's for independent scripts like analytics. `DOMContentLoaded` does not wait for it.

`type="module"` is deferred by default, runs in strict mode in its own scope, is fetched with CORS, and runs once per URL even if included twice. Adding `async` to a module makes it run as soon as it's ready. `nomodule` marks a fallback for old browsers.

Two more traps: inline classic scripts ignore `defer` and `async`, and a classic script will not execute until earlier stylesheets have loaded, so heavy CSS can delay script and LCP."

```html
<script type="module" src="/app.js"></script>      <!-- deferred, strict -->
<script defer src="/legacy-bundle.js"></script>    <!-- ordered, after parse -->
<script async src="/analytics.js"></script>         <!-- independent -->
```

**Likely follow-ups**
- Where do you put script tags today? — In the head with `defer` or `type="module"`; bottom-of-body is outdated.

**History**
- 2026-09-29: first asked, Partial

### Q: How do you serve and preload images for performance? (Q3)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: described preload as an attribute, missed `fetchpriority` and the lazy-load rule for the LCP image.

**Covered well**
- Not recorded.

**Gaps (note)**
- Preload is `<link rel="preload" as="image" imagesrcset imagesizes>`, not an attribute.
- Use `fetchpriority="high"` on the hero image.
- NEVER lazy-load the LCP image.
- `sizes` defaults to `100vw`; the browser picks the candidate.
- `<picture>`: format switching (`type`) versus art direction (`media`); the inner `<img>` is required.
- Alt text.

**Complete answer**
"For the hero image, which is usually the LCP element, I do three things: serve the right size and a modern format with `srcset` and `sizes`, put `fetchpriority="high"` on it, and never use `loading="lazy"` on it. Lazy-loading the LCP image delays the exact thing we're measuring.

If the image is in the HTML markup, the preload scanner finds it already, so a preload tag adds nothing. Preload helps when the image is discovered late, such as a CSS background or injected by JS, and then it is a link tag with `as="image"`, plus `imagesrcset` and `imagesizes` for responsive images.

`srcset` gives the browser candidates and `sizes` tells it how wide the image will display. If `sizes` is missing it assumes `100vw`, so it may download too much. `<picture>` is for two cases: switching format with `type` (AVIF, WebP, JPEG) or art direction with `media`. The `<img>` inside is required and carries the alt text.

Below the fold, `loading="lazy"` plus width and height to prevent layout shift."

```html
<link rel="preload" as="image" imagesrcset="hero-800.avif 800w, hero-1600.avif 1600w" imagesizes="100vw">
<img src="hero-1600.avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w"
     sizes="100vw" width="1600" height="900" fetchpriority="high" alt="Product dashboard">
```

**Likely follow-ups**
- Is preload useful for an `<img>` in the markup? — Usually redundant; the preload scanner already finds it.

**History**
- 2026-09-29: first asked, Partial

### Q: What does the browser do between receiving HTML and showing pixels; how do you speed it up? (Q6)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: put scripts at the bottom, said CSS blocks parsing, skipped later pipeline stages and how to measure.

**Covered well**
- Not recorded.

**Gaps (note)**
- Scripts go in the head with `defer` or `module` now; bottom placement is outdated.
- CSS blocks rendering and later synchronous scripts; it does not block DOM parsing.
- Missed bytes → tokens → DOM, then layout, paint, composite; `transform` and `opacity` can run on the compositor only.
- The preload scanner can't see fonts or background images referenced inside CSS, or resources injected by JS.
- Must say how to measure: DevTools Performance, WebPageTest, web-vitals RUM.
- Preconnect, `font-display`, critical CSS, `<link media>`.
- Avoid unmeasured claims such as "massively reduces FCP".

**Complete answer**
"Bytes become characters, then tokens, then the DOM. CSS becomes the CSSOM. Together they make the render tree. Then layout computes geometry, paint draws it, and composite assembles layers on the GPU.

CSS is render-blocking: nothing paints until it's loaded. It also blocks synchronous scripts that come after it, because those scripts might read styles. It does not stop the parser building the DOM.

A separate preload scanner looks ahead in the HTML for resources. It cannot see what is hidden inside CSS, like fonts and background images, or what scripts inject later, so those start late.

To speed it up: `defer` scripts, inline a small critical CSS and load the rest with `media` tricks, `preconnect` to key origins, `font-display: swap` or optional, and animate only `transform` and `opacity` since they skip layout and paint.

And I measure before claiming anything: DevTools Performance panel and Lighthouse in the lab, WebPageTest for a repeatable trace, and the `web-vitals` library for field data from real users."

**Likely follow-ups**
- Why are `transform` and `opacity` cheap? — They can be handled by the compositor without layout or paint (verify per browser).

**History**
- 2026-09-29: first asked, Partial
