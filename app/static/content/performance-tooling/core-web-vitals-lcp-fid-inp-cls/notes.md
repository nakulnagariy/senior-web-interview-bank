# Core Web Vitals — LCP, INP, CLS (triage scenario)

## Why interviewers ask this
This is usually delivered as a scenario ("page has a 1.5MB hero image, janky layout, slow interactions — what do you do") specifically to see whether you triage like someone who's been paged for a real regression, or whether you jump straight to a memorized fix list. L4 answers diagnose *before* prescribing, and always separate lab data from field data.

## Key concepts

**Triage order: diagnose before fixing.**
Before proposing any fix, identify:
1. **Which element is the LCP element** (DevTools/PerformanceObserver tells you exactly which node was scored), and break down *why* it's slow across its four phases:
   - **TTFB** (time to first byte — server/network),
   - **Resource load delay** (time between TTFB and the browser actually starting to fetch the LCP resource — often blocked by other render-blocking work),
   - **Resource load time** (the fetch itself — this is where an oversized image shows up),
   - **Render delay** (time between the resource being ready and it actually being painted — can be blocked by main-thread work).
2. **Which elements are causing layout shift** (the Layout Instability API / DevTools attributes each shift to a specific element and cause).
3. **Which interactions are slow** (long tasks blocking the main thread during input).
Jumping to "I'd add `preload`" before identifying which phase is actually the bottleneck is exactly the mistake this scenario is designed to surface.

**The biggest real fix for an oversized hero image is the image itself, not `preload`.**
If the LCP resource is already a plain `<img>` sitting in the HTML markup, it's already discovered by the preload scanner early — adding `<link rel=preload>` for it is redundant (same gap as a loading/optimization question elsewhere: don't reach for preload on a resource that's already markup-visible and early-discovered). The actual fix for a 1.5MB hero is the image itself: resize it to the rendered dimensions, convert to a modern format (AVIF, falling back to WebP/JPEG), and serve a responsive `srcset` so smaller viewports don't download the largest variant. That's the fix with the biggest measurable LCP impact in this scenario — don't let "add preload" substitute for actually shrinking the asset.

**Confirm the LCP element before touching anything — and use the Network tab, not just Performance.**
Preloading or re-prioritizing the wrong resource wastes bandwidth and can actively compete with the real LCP resource. Open the **Network** panel alongside Performance and inspect the actual request waterfall for the confirmed LCP element to determine *which* phase is the bottleneck — late discovery, raw network latency, insufficient fetch priority, image decode cost, or render delay after the resource is ready — because each has a different fix (discovery → move it into markup/preload; latency → CDN/compression; priority → `fetchpriority`; decode → smaller/better-encoded image; render delay → main-thread contention).

**CLS sources beyond "images without dimensions" — and inspect the actual shift events, don't guess.**
Diagnose with the real Layout Instability data (DevTools "Layout Shift" entries / `PerformanceObserver` with `type: 'layout-shift'`) to see exactly which element moved and by how much, rather than assuming the cause. The textbook answer (images/iframes without explicit width/height) is necessary but incomplete. Also account for:
- **Web font swapping** — FOIT/FOUT causes a reflow when the real font loads and text reflows to different metrics (`font-display`, `size-adjust`, or matching fallback-font metrics reduce this).
- **Ads** — third-party content injected into a reserved slot that resizes after load.
- **Dynamically injected content** — banners, cookie notices, or anything inserted above existing content without reserving space first.
- **CSS `transform`-based animations** that are implemented incorrectly (animating layout-affecting properties, or animations that cause a late layout recalculation) can also register shifts if not scoped carefully — the general rule is: reserve space up front for anything that will load or resize later.

**INP: `defer`/`async` don't fix long main-thread tasks.**
Script-loading attributes control *when a script starts executing* — they do nothing about *how long it blocks the main thread once it's running*. If INP is bad because of long tasks, the actual fixes are:
- **Break up long tasks** — yield back to the main thread periodically (`setTimeout(fn, 0)` chunking, or the newer `scheduler.yield()`/`isInputPending()` APIs) so input can be processed between chunks.
- **Defer or lazy-load non-critical third-party scripts** until idle (`requestIdleCallback`, or load-on-interaction patterns) so they don't compete with the user's first interactions.
- **Reduce hydration cost** on SSR'd apps — hydrating a huge component tree synchronously is a classic long-task source.
**TBT (Total Blocking Time)** is the standard *lab* proxy that correlates with INP — a lab tool can't measure real interaction latency (there's no real user interacting), so it estimates blocking instead. Treat it as a correlated proxy, not a guaranteed stand-in — flag that the exact strength of correlation is something to verify rather than assert as a fixed relationship.

**Lab vs field data, and the actual thresholds.**
- **Lab data** (Lighthouse, DevTools, WebPageTest): one synthetic run, controlled conditions, reproducible, but not what real users experienced.
- **Field data** (RUM, CrUX): aggregated real-user measurements, reported as **p75** (the 75th percentile — not the average, specifically because a few very fast or very slow outliers shouldn't dominate the metric) over a population of real sessions.
- **"Good" thresholds (p75):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- **`web-vitals` JS library** gives you near-real-time RUM you control and can alert on quickly after a deploy. **CrUX** (Chrome UX Report) is Google's own aggregated field dataset, but it rolls over a **28-day window** — a regression you shipped today won't be visible in CrUX for weeks, so it's good for longitudinal/competitive tracking, bad for fast feedback on a specific release.

**Framing a performance pushback as risk, not refusal — and never a categorical "no."**
If someone asks for something that will hurt a Core Web Vital (an unoptimized hero image from marketing, a heavy third-party script from a vendor, or a time-pressured request to touch SSR/hydration before a release freeze), the L4 move isn't a flat "no" or silent compliance — and it also isn't refusing an entire *category* of change outright. Say precisely what you'd avoid and why: a broad SSR architecture change under time pressure is risky and hard to regression-test in two days — so avoid *that*. But a small, targeted hydration fix, backed by trace evidence and testable in isolation, is allowed if the evidence supports it. Name the specific risk (which metric, roughly how much it degrades, who's affected), propose a mitigation or scoped alternative, and report it upward with the trade-off made explicit — including a rollback plan if it ships anyway and regresses. That precision — "I'd avoid broad X, but allow scoped Y if evidence supports it" — is what separates a risk-based engineering call from a blanket refusal.

**Lighthouse-in-CI is a complement, not a replacement.**
A performance budget enforced in CI (e.g., failing a build if Lighthouse score or a specific metric regresses past a threshold) is a good guardrail, but it only covers lab performance. It should sit alongside — never replace — real field monitoring (RUM/CrUX) and functional/accessibility regression tests; a change can pass a Lighthouse budget and still regress real users or break a screen-reader flow.

## Common traps
- Proposing fixes before identifying which LCP phase (TTFB/load delay/load time/render delay) is actually the bottleneck.
- Reaching for `preload` on an image that's already in markup and already discovered early — missing the real fix (resize/format/srcset).
- Listing only "images without `width`/`height`" as a CLS cause and stopping there.
- Saying `defer`/`async` improve INP — they affect script *start* timing, not main-thread blocking duration.
- Treating TBT and INP as strictly equivalent rather than a lab/field correlated proxy pair.
- Quoting CrUX data as if it reflects a change shipped this week.

## Model answers

**"The site has a 1.5MB unoptimized hero image, some jank on load, and sluggish buttons. Where do you start?"**
"I'd diagnose before touching anything. First, confirm the LCP element in DevTools and break its timing into the four phases — TTFB, resource load delay, load time, render delay — to see where the 1.5MB image is actually costing time; most likely it's dominating load time. Separately, I'd check the Layout Instability data to see which elements are causing the jank — could be the image itself if it has no reserved dimensions, or could be a web font swap. And I'd profile the slow buttons for long tasks blocking the main thread. For the image specifically, the real fix is resizing it to its rendered dimensions, converting to AVIF with a WebP/JPEG fallback, and serving a responsive `srcset` — not adding `preload`, since it's already an in-markup `<img>` that's discovered early; preload would be redundant there. For the sluggish interactions, if it's long tasks, `defer`/`async` won't help — I'd look at breaking up the task or deferring non-critical third-party scripts until idle."

**"Lab tools say the page is fast, but field data says LCP is bad. Which do you trust?"**
"Field, for shipping decisions — lab data is one synthetic run under controlled conditions, which is great for reproducible debugging but doesn't reflect the actual device/network mix of real users. Field data reported at p75 captures that real-world variance. I'd use the `web-vitals` library for fast feedback right after a deploy, since CrUX is a 28-day rolling window and won't show a regression from this week's release for a while — good for long-term tracking, too slow for immediate rollback decisions."

## Mini code example
```js
// fast RUM feedback right after a deploy — not waiting on CrUX's 28-day window
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP((metric) => sendToAnalytics('LCP', metric.value, metric.rating)); // rating: good/needs-improvement/poor
onINP((metric) => sendToAnalytics('INP', metric.value, metric.rating));
onCLS((metric) => sendToAnalytics('CLS', metric.value, metric.rating));
```
```js
// breaking up a long task so input can be processed between chunks
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    if (i % 50 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0)); // yield to main thread
    }
  }
}
```

## Rapid-fire Q&A
1. **Q: What are the four phases of LCP timing breakdown?** A: TTFB, resource load delay, resource load time, render delay.
2. **Q: Is `preload` useful for an LCP image already present as an `<img>` in markup?** A: Generally redundant — it's already discovered early; the real fix is resizing/format/srcset.
3. **Q: Name two CLS causes besides missing image dimensions.** A: Web font swap (FOIT/FOUT) and late-injected content (ads, banners) without reserved space.
4. **Q: Does adding `defer` to a script improve INP if the problem is a long main-thread task?** A: No — `defer` only affects start timing, not task duration; you need to break up the task or defer non-critical work.
5. **Q: What percentile does field/RUM data typically report, and why not the average?** A: p75 — so a handful of extreme outliers don't dominate the metric.

## Gap log (mine, to re-drill)
- [ ] Diagnose first: name the LCP 4-phase breakdown, layout-shift culprits, and slow-interaction profiling before proposing any fix.
- [ ] Don't default to "add preload" for an already-in-markup LCP image — lead with resize/AVIF/srcset as the real fix (repeat pattern from image-loading topic).
- [ ] Confirm the actual LCP element and use the Network tab + Performance tab together before touching anything — name the specific sub-cause (discovery/latency/priority/decode/render-delay).
- [ ] CLS causes beyond images: fonts, ads, injected content, careless transform animations — and inspect real Layout Instability entries rather than guessing.
- [ ] INP fix set: break up long tasks, defer/idle-load third parties, reduce hydration cost — not `defer`/`async` on scripts.
- [ ] TBT is a lab *proxy* for INP, not identical to it — flag the correlation, don't overstate it.
- [ ] Lab vs field distinction + exact thresholds (LCP 2.5s / INP 200ms / CLS 0.1) + web-vitals RUM vs CrUX's 28-day lag.
- [ ] Frame pushback precisely: "avoid broad X under time pressure, allow scoped Y if evidence supports it" — never a categorical refusal of a whole change class.
- [ ] CI Lighthouse budgets complement, never replace, field monitoring and functional/accessibility regression tests.

## Real interview record — e-commerce product page performance triage (scored 7.5/10)
**Question asked:** "You join a project mid-sprint. An e-commerce product page scores 45 on mobile Lighthouse. Field data shows LCP at 4.8s, CLS at 0.3, and poor INP. The page is server-rendered React with div-soup markup. You have two days before a release freeze. What do you do first, and how will the head of engineering know it worked?"

**What scored well:** choosing the right tools (DevTools, Performance, CPU throttling, Lighthouse, CrUX), the hero-image LCP fix direction, reserving image/video space as a first CLS fix, prioritizing small changes over a broad refactor this close to release, and including before/after validation with CI regression checks.

**What was marked as missing** (now folded into Key Concepts above): opening the Network tab (not just Performance) to classify *which* LCP sub-cause is at play, confirming the actual LCP element before preloading anything, inspecting real layout-shift events instead of assuming cause, understanding that `async`/`defer` change *when* a script starts, not how long an expensive hydration task blocks the main thread, not refusing an entire category ("anything SSR-related") categorically, reporting concrete before/after numbers per metric, and treating CrUX/RUM and CI Lighthouse budgets as complementary layers, not substitutes for each other.

**Improved spoken answer (the L4 bar for this question):** "First, I wouldn't start changing code immediately — with two days, I need the highest-impact problems identified first. I'd open DevTools Performance and Network, run Lighthouse under a consistent mobile profile with throttling, and check existing field data from CrUX or RUM. For LCP, I'd identify the actual LCP element and inspect its request waterfall — if it's the hero image and it's discovered late or incorrectly lazy-loaded, I'd make it discoverable early, use `fetchpriority="high"`, and preload it only if the trace actually supports that. For CLS, I'd inspect the real layout-shift events to find exactly what's moving, then reserve space with explicit dimensions or aspect ratios for images, video, and dynamic content, and check fonts, banners, and anything injected after load. For INP, I'd look at the Performance trace for long main-thread tasks, especially around React hydration and interactions, defer or remove non-critical third-party scripts, and if hydration itself is expensive, reduce or split that work rather than assuming `async`/`defer` fixes it. With only two days, I'd avoid a broad refactor or a risky SSR architecture change — but I wouldn't rule out a small, targeted hydration fix if the trace shows it's necessary and it's testable in isolation. To prove it worked, I'd report concrete before/after Lighthouse score, LCP, CLS, and INP, distinguishing lab results from field data, since CrUX can take weeks to reflect a change. Finally, I'd add a performance budget to CI for key routes, as a complement to — not a replacement for — ongoing field monitoring and functional/accessibility regression tests."
