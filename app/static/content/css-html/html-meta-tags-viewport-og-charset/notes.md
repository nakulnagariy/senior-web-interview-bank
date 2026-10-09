# HTML meta tags — viewport, Open Graph, charset, canonical, hreflang, structured data

## Why interviewers ask this
This is the question that catches candidates who know individual meta tags in isolation but can't diagnose a *real* multi-symptom bug report — blank social previews, duplicate-URL indexing, wrong-country search ranking, and a zoomed-out mobile layout, all at once. It also tests whether you know which of these mechanisms are hard directives vs. soft hints, and whether you understand the CSR rendering trap that breaks several of them silently on a React app.

## Key concepts

**Social previews are controlled by Open Graph tags — and depend on the crawler being able to fetch the page.**
`og:title`, `og:description`, `og:image`, `og:url` (plus platform-specific variants where relevant, e.g. Twitter/X card tags) are what Slack, LinkedIn, and similar unfurl previews read. A blank preview usually means one of: the tags are missing, the `og:image` URL isn't publicly fetchable (behind auth, wrong CORS, 404), or — the big one on a React app — the tags were never in the HTML the crawler actually received (see the rendering trap below).

**Duplicate URLs: `<link rel="canonical">` is a hint, not a directive.**
`<link rel="canonical" href="https://example.com/product/123">` tells search engines your preferred URL among variants (`?color=red`, `?utm_source=...`, trailing slashes, etc.). Say this precisely in an interview: canonicalization is a **hint** — the search engine may still choose a different canonical if it disagrees. It does not replace sound URL architecture: clean internal linking to the canonical form, redirects where appropriate, and controlling which parameter variants are even crawlable (e.g. via robots rules or consistent query-param handling) all still matter. "I added a canonical tag" is not a complete answer to a duplicate-content problem.

**Language and region targeting: `lang` vs `hreflang` are two different jobs.**
- `lang` on `<html>` (e.g. `lang="hi"`, `lang="en"`) declares the **document's own language** — screen readers use it to pick pronunciation rules, browsers use it for things like translation prompts.
- `hreflang` on `<link rel="alternate">` tags declares **alternate localized versions of the same content** for search engines — e.g. `hreflang="en-IN"` and `hreflang="hi-IN"` pointing at the respective URLs, with reciprocal/self-referencing annotations (each language version should reference all variants, including itself). Get this wrong (missing reciprocal links, mismatched region codes) and search engines may serve the wrong language/region version to users — which is exactly the "Hindi and English versions rank in the wrong country" symptom in this scenario.

**Mobile viewport: get the meta tag right, and never disable zoom.**
`<meta name="viewport" content="width=device-width, initial-scale=1">` is the standard baseline — it tells the browser to size the layout viewport to the device width instead of defaulting to a desktop-width viewport that then gets shrunk ("zoomed out") to fit, which is exactly the symptom described (page "looks zoomed-out on some phones" usually means this tag is missing or malformed). The accessibility rule to state unprompted: **never** add `user-scalable=no` or an overly restrictive `maximum-scale` — disabling pinch-zoom is a direct, well-known accessibility harm for low-vision users, and it's a trap some candidates reach for "to prevent accidental zoom."

**Structured data: machine-readable page description, usually via Schema.org + JSON-LD.**
Structured data is markup that describes the page/entity in a machine-readable vocabulary (commonly **Schema.org**), most often embedded as a `<script type="application/ld+json">` block (JSON-LD is generally preferred over inline microdata for maintainability). For a product page you'd pick a `Product` type with nested `Offer` data (price, availability, currency) where eligible. Validate with Google's Rich Results Test and the Schema.org Validator. Say explicitly: **valid structured data does not guarantee a rich result** — it makes you *eligible*, search engines still decide whether to render one.

**The CSR rendering trap — the one that ties this whole scenario together.**
If any of the above (OG tags, canonical, hreflang, structured data) is injected into the DOM only *after* client-side JavaScript runs — the common default in a React SPA without SSR/SSG — then crawlers and especially social-preview bots that don't reliably execute JavaScript will see an incomplete or empty `<head>`. This is almost certainly why marketing sees blank Slack/LinkedIn previews on a CSR React app: the bot fetched the initial HTML, found no `og:` tags yet, and gave up before hydration ever ran. The fix: render critical metadata in the **initial server response** — SSR, SSG, or the framework's server-side metadata API (e.g. a meta-tags-in-`load`/server-rendered head mechanism) — and verify by inspecting the **actual raw HTTP response**, not the hydrated DOM in browser DevTools (DevTools shows you the post-hydration DOM, which will look fine even when the real server response was broken — curl the URL or use "View Source" / a crawler-simulation tool to see what a bot actually receives).

## Common traps
- Claiming a canonical tag *fixes* duplicate URLs — it's a hint search engines can override, not a guarantee.
- Confusing `lang` (this document's language) with `hreflang` (alternate localized versions of this content).
- Adding `user-scalable=no` or a restrictive `maximum-scale` "to prevent zoom issues" — this is an accessibility regression, not a fix.
- Saying structured data guarantees a rich result — it only makes you eligible.
- Debugging a missing social preview by looking at the hydrated DOM in DevTools instead of the raw server response a crawler actually receives.
- Not naming JSON-LD specifically when asked about structured data format (vs. older/less maintainable microdata).

## Model answers

**"Why would a React product page show a blank preview on Slack?"**
"Almost certainly the CSR rendering trap: if the Open Graph tags are injected by client-side JavaScript after the initial load, a social-preview bot that doesn't reliably execute JS only sees an empty or incomplete `<head>` in the raw HTML response. I'd verify by checking the actual server response — curling the URL or using 'View Source' — not the hydrated DOM in DevTools, since that looks fine post-hydration even when the real response is broken. The fix is rendering `og:title`, `og:description`, `og:image`, and `og:url` in the initial server-rendered response, via SSR, SSG, or the framework's server-side head/metadata mechanism."

**"How do you deal with duplicate URLs like `?color=red` and `?utm_source=...` for the same product?"**
"I'd add `<link rel="canonical">` pointing at the clean product URL, but I'd be precise that canonicalization is a hint, not a directive — search engines can still choose differently. I'd pair it with sound URL handling: consistent internal links pointing at the canonical form, redirects where appropriate, and controlling which parameter variants are even crawlable, rather than relying on the canonical tag alone to solve it."

**"The mobile layout looks zoomed out on some phones — what's wrong?"**
"Most likely the viewport meta tag is missing or malformed — I'd set `width=device-width, initial-scale=1` so the layout viewport matches the device width instead of defaulting to a wide desktop viewport that gets shrunk to fit. And regardless of the fix, I would not add `user-scalable=no` or an aggressive `maximum-scale` to 'solve' zoom issues — disabling pinch-zoom is a real accessibility harm for low-vision users, not an acceptable trade-off."

## Mini code example
```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- language of THIS document -->
  <html lang="en">

  <!-- alternate localized versions — reciprocal across all variants -->
  <link rel="alternate" hreflang="en-IN" href="https://example.com/en-in/product/123" />
  <link rel="alternate" hreflang="hi-IN" href="https://example.com/hi-in/product/123" />
  <link rel="alternate" hreflang="x-default" href="https://example.com/en-in/product/123" />

  <!-- canonical — a hint, not a directive -->
  <link rel="canonical" href="https://example.com/en-in/product/123" />

  <!-- Open Graph — MUST be present in the initial server response for an SPA -->
  <meta property="og:title" content="Wireless Headphones — Example Store" />
  <meta property="og:description" content="Noise-cancelling wireless headphones, 30-hour battery." />
  <meta property="og:image" content="https://example.com/images/headphones-og.jpg" />
  <meta property="og:url" content="https://example.com/en-in/product/123" />

  <!-- structured data: JSON-LD, eligibility only, not a guarantee -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wireless Headphones",
    "offers": {
      "@type": "Offer",
      "price": "99.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
</head>
```

## Rapid-fire Q&A
1. **Q: Is `<link rel="canonical">` a directive search engines must obey?** A: No — it's a hint; they may pick a different canonical.
2. **Q: What's the difference between `lang` and `hreflang`?** A: `lang` declares this document's own language; `hreflang` declares alternate localized versions of the same content for search engines.
3. **Q: What accessibility mistake do candidates make "fixing" mobile zoom issues?** A: Adding `user-scalable=no` or a restrictive `maximum-scale` — disables pinch-zoom, harms low-vision users.
4. **Q: Does valid JSON-LD structured data guarantee a rich search result?** A: No — it only makes the page eligible; the engine still decides.
5. **Q: Why do social-preview bots see a blank preview on a CSR React page, and how do you verify it?** A: The OG tags are only added after client JS runs, so the bot's raw HTML fetch sees nothing; verify with the actual server response (curl/View Source), not the hydrated DevTools DOM.

## Gap log (mine, to re-drill)
- [ ] State canonical-as-hint precisely, every time — never "the canonical tag fixes duplicate URLs."
- [ ] Don't conflate `lang` and `hreflang` — different jobs, both matter for this scenario's symptoms.
- [ ] Never suggest disabling zoom (`user-scalable=no`/restrictive `maximum-scale`) as a mobile layout fix — name the accessibility harm unprompted.
- [ ] Structured data = eligibility, not guarantee of a rich result; JSON-LD is the preferred format, know why.
- [ ] CSR rendering trap: metadata added after hydration is invisible to crawlers/social bots — verify via raw server response, not DevTools' hydrated DOM.
- [ ] This question hasn't been answered live yet — practice a full spoken run-through covering all five areas (previews, duplicate URLs, i18n, viewport, structured data) plus the rendering trap before the next mock panel.
