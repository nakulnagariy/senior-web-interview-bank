# Lazy loading & responsive images — preload, fetchpriority, sizes, picture

## Why interviewers ask this
Image loading is where a lot of candidates mix up two completely different APIs — the `preload` *link relation* and the `loading="lazy"` *attribute* — and commonly make the single most damaging mistake possible: lazy-loading the one image that matters most for LCP.

## Key concepts

**`preload` for an image is a `<link>` element, not an `<img>` attribute.**
The correct syntax is:
```html
<link rel="preload" as="image" href="/hero.jpg" imagesrcset="/hero-480.jpg 480w, /hero-960.jpg 960w" imagesizes="100vw" />
```
`imagesrcset`/`imagesizes` (not `srcset`/`sizes`) are the `<link>`-specific attribute names that mirror the `<img>` responsive-image attributes, so the preload can pick the same responsive candidate the actual `<img>` would. This is a genuinely common slip — reaching for a nonexistent `preload` attribute directly on `<img>` instead of a separate `<link rel=preload>` element in `<head>`.

**`fetchpriority="high"` on the hero/LCP image bumps its fetch priority explicitly.**
Browsers already heuristically prioritize some resources, but `fetchpriority="high"` on the `<img>` that is (or is likely to be) your LCP element tells the browser explicitly to fetch it earlier relative to other same-type resources competing for bandwidth — useful when the hero image isn't the very first thing in the markup, or when you want to make the priority explicit rather than relying on heuristics.

**Never lazy-load the LCP image.**
`loading="lazy"` defers fetching until the image is near the viewport — correct for below-the-fold images, actively harmful for the LCP element, since it *adds* a delay to the exact resource you're trying to make fast. This is a specific, concrete mistake interviewers listen for: if a candidate reflexively says "lazy-load all images for performance," that's a gap, not a win. The rule: lazy-load below-the-fold, eagerly load (and consider `fetchpriority="high"`) above-the-fold/LCP candidates.

**`sizes` defaults to `100vw`, and the browser does real selection work with it.**
If you omit `sizes` on a responsive `<img srcset>`, the browser defaults to assuming the image will render at `100vw` (full viewport width) — which is wrong for, say, a 3-column grid image, and causes the browser to pick a larger candidate than necessary. With `sizes` specified correctly (e.g. `sizes="(min-width: 768px) 33vw, 100vw"`), the browser's responsive-image selection algorithm picks the best `srcset` candidate using `sizes` + current viewport width + device pixel ratio — all before any layout has happened, which is why `sizes` has to be expressed as a size *hint*, not something computed from actual rendered layout.

**`<picture>`: format-switching vs art-direction are two different jobs, same element.**
- **Format switching** uses the `type` attribute on `<source>` — offer AVIF, fall back to WebP, fall back to JPEG, letting the browser pick the first type it supports. Same image content, different encodings.
- **Art direction** uses the `media` attribute on `<source>` — serve a genuinely different crop/composition per breakpoint (a tall portrait crop on mobile, a wide landscape crop on desktop), not just a resized version of the same image.
- Either way, `<picture>` **requires an inner `<img>`** as the fallback and the actual rendered/accessible element — the `<picture>` wrapper itself has no `alt`; the `alt` attribute belongs on that inner `<img>`.

## Common traps
- Writing `<img preload>` or similar — `preload` isn't an `<img>` attribute; it's a `<link rel="preload">`.
- Applying `loading="lazy"` to the hero/LCP image "for performance."
- Omitting `sizes` and assuming the browser "just picks the right size" — it defaults to 100vw, which is often wrong.
- Using `<picture>` with `type` when you actually needed `media` (or vice versa) — confusing format-switching with art-direction.
- Forgetting the inner `<img>` and its `alt` inside `<picture>`.

## Model answers

**"How would you optimize a hero image for LCP?"**
"First, make sure it's not lazy-loaded — `loading="lazy"` on the LCP element directly works against you. I'd add `fetchpriority="high"` so the browser fetches it ahead of competing same-priority resources, and serve it with a real `srcset` plus a correctly-computed `sizes` attribute so the browser doesn't default to assuming 100vw and downloading an oversized candidate. If I want the browser to start fetching it even before the parser reaches the `<img>` tag, I'd add a `<link rel=preload as=image>` with matching `imagesrcset`/`imagesizes` — and I'd use `<picture>` with `type`-based `source`s for AVIF/WebP/JPEG fallback if format support is a concern, keeping a real `<img>` with `alt` text as the fallback inside it."

**"What's the difference between the two uses of `<picture>`?"**
"`type` on a `<source>` is format switching — same image, different encodings, browser picks the first one it supports, usually for a performance win like AVIF over JPEG. `media` on a `<source>` is art direction — genuinely different image content per breakpoint, like a different crop for mobile versus desktop, not just a resize. Both still need a plain `<img>` inside as the actual rendered and accessible fallback."

## Mini code example
```html
<head>
  <!-- preload is a LINK, uses imagesrcset/imagesizes, mirrors the real <img> below -->
  <link
    rel="preload"
    as="image"
    imagesrcset="/hero-480.avif 480w, /hero-960.avif 960w, /hero-1600.avif 1600w"
    imagesizes="100vw"
  />
</head>
<body>
  <picture>
    <!-- format switching -->
    <source type="image/avif" srcset="/hero-480.avif 480w, /hero-960.avif 960w, /hero-1600.avif 1600w" />
    <source type="image/webp" srcset="/hero-480.webp 480w, /hero-960.webp 960w, /hero-1600.webp 1600w" />
    <img
      src="/hero-960.jpg"
      srcset="/hero-480.jpg 480w, /hero-960.jpg 960w, /hero-1600.jpg 1600w"
      sizes="100vw"
      alt="Product hero shot"
      fetchpriority="high"
      <!-- NOTE: no loading="lazy" here — this is the LCP candidate -->
    />
  </picture>

  <img src="/below-fold-thumb.jpg" loading="lazy" alt="Related item" />
</body>
```

## Rapid-fire Q&A
1. **Q: Is `preload` a valid attribute on `<img>`?** A: No — it's a `<link rel="preload" as="image">` element, using `imagesrcset`/`imagesizes`.
2. **Q: Should you ever put `loading="lazy"` on the LCP image?** A: No — never lazy-load the LCP candidate.
3. **Q: What does `sizes` default to if omitted?** A: `100vw`.
4. **Q: `type` vs `media` on `<picture><source>` — which is format switching?** A: `type`; `media` is art direction (different crop per breakpoint).
5. **Q: Where does `alt` go inside a `<picture>`?** A: On the inner `<img>` — `<picture>` itself has no `alt`.

## Gap log (mine, to re-drill)
- [ ] `preload` = `<link rel=preload as=image imagesrcset imagesizes>`, never an `<img>` attribute — say the exact syntax.
- [ ] `fetchpriority="high"` for the hero/LCP image, paired with never lazy-loading it.
- [ ] `sizes` defaults to `100vw` when omitted — name the consequence (oversized candidate picked).
- [ ] `<picture>` format-switching (`type`) vs art-direction (`media`) — don't conflate them.
- [ ] Inner `<img>` + its `alt` is required inside `<picture>` — not optional.
