# Script loading — async, defer, module

## Why interviewers ask this
Almost every candidate can define `async` and `defer`. Few can correctly state what `DOMContentLoaded` waits for, what happens to an *inline* script with those attributes, or how `type="module"` changes the rules. That gap is exactly where this question is aimed.

## Key concepts

**`async` = independent; `defer` = ordered, deferred.**
- `async`: fetched in parallel with parsing, **executes as soon as it's downloaded**, pausing parsing to do so — order relative to other scripts is not guaranteed. Use for scripts with no dependency on other scripts or the DOM (analytics, ads).
- `defer`: fetched in parallel with parsing, but execution is **held until the HTML document has finished parsing**, and multiple deferred scripts run in their source order. Use for scripts that need the DOM to exist or depend on each other.
- Neither blocks parsing while downloading — the difference is entirely about *when they're allowed to execute*.

**`DOMContentLoaded` waits for `defer`/`module` scripts, but not for `async`.**
`DOMContentLoaded` fires once the HTML is fully parsed **and** all deferred/module scripts have executed. It does **not** wait for `async` scripts — an async script can still be downloading (or can execute after `DOMContentLoaded` has already fired) because it's explicitly decoupled from the parse/ready lifecycle. This is the single most commonly-missed distinction in this topic.

**`type="module"` changes several defaults at once:**
- Modules run in **strict mode** automatically.
- Each module has its own **top-level scope** — no accidental globals leaking between modules.
- A given module URL is fetched and evaluated **only once** per page, even if referenced from multiple `<script type="module">` tags (the browser dedupes by URL).
- Module scripts require **CORS** when loaded cross-origin — a plain classic script doesn't.
- Module scripts are **deferred by default** (same ordering/timing behavior as `defer`), but adding the `async` attribute to a `type="module"` script **overrides that** and lets it execute as soon as it's ready, independent of document order — same relaxed semantics as classic `async`.
- `nomodule` on a classic script is the fallback path for browsers that don't support modules at all — module-aware browsers skip any script tagged `nomodule`.

**Inline scripts ignore `defer`/`async` entirely.**
`defer` and `async` only affect *fetching* an external resource. An inline `<script>` has nothing to fetch — it executes immediately, synchronously, in document order, exactly where it sits, regardless of whether you put `defer`/`async` on the tag. (A `type="module"` inline script is the one exception that changes timing, because module scripts as a class are deferred — but plain inline classic scripts with `async`/`defer` attributes: those attributes are simply ignored.)

**Classic scripts can still block on CSS — and that hurts LCP.**
A synchronous classic `<script>` (no `async`/`defer`) placed after a `<link rel="stylesheet">` has to wait for that stylesheet's CSSOM to finish building before it runs — because the script might call `getComputedStyle` or otherwise need layout info, the browser conservatively blocks it. So a page with a large render-blocking CSS file followed by a synchronous script pays double: parsing pauses for the script, and the script itself was already queued behind CSS. This directly delays First Contentful Paint / LCP. Takeaway: prefer `defer`/`module` and put scripts in `<head>` — "put scripts at the bottom of body" is outdated advice from before `defer` existed; with `defer`, head placement is fine and lets the browser discover+start fetching the script earlier.

## Common traps
- Saying `DOMContentLoaded` waits for `async` scripts too — it doesn't.
- Saying inline scripts "respect" `defer`/`async` attributes — they're simply ignored for inline (non-module) scripts.
- Forgetting that `async` on a `type="module"` script overrides the module's default deferred timing.
- Repeating "always put scripts at the bottom of body" as a blanket rule in 2026 — with `defer`/`module`, head placement is the better default.
- Not knowing modules require CORS cross-origin, where classic scripts don't.

## Model answers

**"What's the difference between `async` and `defer`?"**
"Both fetch in parallel with HTML parsing, so neither blocks downloading. The difference is execution timing: `async` executes the moment it finishes downloading, pausing parsing to do so, with no ordering guarantee relative to other scripts — good for independent scripts like analytics. `defer` holds execution until parsing is completely finished, and multiple deferred scripts run in source order — good for anything that touches the DOM or depends on another script. `DOMContentLoaded` waits for deferred scripts to finish but explicitly does not wait for async ones."

**"Does it matter where I put a script tag if it has `defer`?"**
"Not for blocking — `defer` means it won't block parsing regardless of position. But putting it in `<head>` with `defer` lets the browser discover and start the fetch earlier than if it's at the bottom of `<body>`, so head placement is actually the better default now. 'Scripts at the bottom of body' was the right advice before `defer` existed; it's outdated today."

**"If I put `defer` on an inline script, does it change when it runs?"**
"No — `defer`/`async` only control fetching an external file. An inline script has nothing to fetch, so the browser just ignores those attributes and runs it synchronously, right where it sits in the document."

## Mini code example
```html
<head>
  <!-- independent, no DOM dependency: analytics -->
  <script src="/analytics.js" async></script>

  <!-- depends on DOM + must run after dom-utils.js: defer + source order -->
  <script src="/dom-utils.js" defer></script>
  <script src="/app.js" defer></script>

  <!-- ES module: deferred-by-default timing, strict mode, own scope -->
  <script type="module" src="/main.mjs"></script>

  <!-- module + async OVERRIDES the default deferred timing -->
  <script type="module" src="/independent-widget.mjs" async></script>

  <!-- fallback for browsers with no module support -->
  <script nomodule src="/legacy-bundle.js"></script>

  <!-- ignored: this is inline, defer/async do nothing here, runs immediately -->
  <script defer>console.log('runs synchronously, right now');</script>
</head>
```

## Rapid-fire Q&A
1. **Q: Does `DOMContentLoaded` wait for an `async` script?** A: No — only for parsing completion and deferred/module scripts.
2. **Q: Do multiple `defer` scripts run in source order?** A: Yes.
3. **Q: Does `defer` on an inline `<script>` do anything?** A: No — ignored; inline scripts run immediately in document order.
4. **Q: What does `async` do to a `type="module"` script's default timing?** A: Overrides the default deferred behavior — it runs as soon as ready, unordered.
5. **Q: Why can a synchronous script after a stylesheet hurt LCP?** A: It's blocked until the CSSOM is built, compounding with the CSS's own render-blocking delay.

## Gap log (mine, to re-drill)
- [ ] `DOMContentLoaded` = waits for defer/module, **not** async — say this precisely, don't generalize "waits for scripts."
- [ ] Inline scripts ignore `defer`/`async` — don't claim otherwise.
- [ ] Module specifics as a set: strict mode, own scope, fetched once per URL, needs CORS cross-origin, deferred by default, `async` overrides that, `nomodule` fallback.
- [ ] Retire "scripts at bottom of body" as a blanket rule — explain why `defer` + head placement is better.
- [ ] Classic sync scripts block on pending CSSOM — connect this to LCP/FCP impact explicitly.
