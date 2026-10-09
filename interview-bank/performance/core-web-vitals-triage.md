# Core Web Vitals: triage and fixes

> Seeded on 2026-10-09 from `gap-log.md` (HTML session of 2026-09-29). Original wording and spoken answers were not recorded then.

### Q: A page has a slow LCP, layout shifts and sluggish interactions. How do you approach it? (Q8)

- **Asked:** 2026-09-29 · **Verdict:** Partial · **Status:** open

**My answer (as given)**
Not recorded verbatim. Gap log: mostly correct, but jumped to fixes before diagnosing.

**Covered well**
- Most individual fixes were right.

**Gaps (note)**
- Triage means DIAGNOSE first: find the LCP element and its four parts (TTFB, resource load delay, resource load time, element render delay); find layout-shift culprits; find slow interactions.
- Missed the biggest LCP fix: resize, AVIF and `srcset` for the 1.5 MB hero image.
- Suggested preload for an image already in the markup. This is a repeat gap from Q3 and Q6.
- CLS also comes from fonts, ads, injected content; animate with `transform`.
- INP: `defer` and `async` do not fix long tasks. Yield to the main thread, idle third parties, reduce hydration. TBT is a lab proxy (verify).
- Lab versus field, p75 and thresholds: LCP 2.5 s, INP 200 ms, CLS 0.1.
- `web-vitals` RUM gives fast feedback; CrUX is a 28-day window.
- Frame refusals as risk-based, flag them, and report to the head with expectations and a rollback plan.

**Complete answer**
"I don't fix anything until I know what's wrong. First I split the problem by metric, using field data at the 75th percentile and the thresholds: LCP under 2.5 seconds, INP under 200 milliseconds, CLS under 0.1.

For LCP I identify the LCP element and break the time into four parts: server response (TTFB), resource load delay, resource load time, and element render delay. Each points to a different fix. If it's a 1.5 MB hero image, the biggest win is resizing it, serving AVIF or WebP, and `srcset` so phones get a small one, plus `fetchpriority="high"` and no lazy-loading. If it's in the markup, a preload is redundant. If TTFB is high, it's caching and the server, not the front end.

For CLS I find which elements shift using the Layout Shift regions in DevTools. Usual causes: images without dimensions, web fonts swapping, ads and injected banners, and animations that change layout. I fix with width and height or `aspect-ratio`, reserved space, font metric overrides, and animating `transform`.

For INP I record interactions and find the long tasks. `defer` and `async` don't help once the code runs. What helps is breaking up work and yielding to the main thread, moving third-party scripts to idle time, and cutting hydration cost. Total Blocking Time is a lab proxy for it (verify), not the real metric.

To get fast feedback I use the `web-vitals` library to send real-user numbers; CrUX is a 28-day rolling window, so it's too slow to confirm a fix. And when stakeholders ask for something risky, such as a late library swap, I say it is risk-based, flag it, and report to the head with the expected gain, the risk and a rollback plan."

**Likely follow-ups**
- Lab versus field data? — Lab is repeatable for debugging; field reflects real devices and networks and is what you're judged on.

**History**
- 2026-09-29: first asked, Partial
