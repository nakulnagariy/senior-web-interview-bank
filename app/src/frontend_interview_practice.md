# Frontend Interview Practice --- Questions, Answers & Reviews

**Focus:** Senior/Lead Frontend Engineering\
**Format:** Interview question → my answer → review/analysis → improved
spoken answer

> Note: The fourth question (HTML head, SEO and social previews) was
> asked, but I had not yet submitted my own answer. That section
> includes the question and the expected checklist, not a score or
> critique of an answer.

------------------------------------------------------------------------

## 1. Native HTML Validation vs JavaScript Validation

### Interview question

For a signup form, would you use native HTML validation or JavaScript
validation? Explain your approach.

### My answer --- summary

I suggested using HTML validation attributes such as `required`, `type`,
`pattern`, and `min`/`max` where possible, and using JavaScript for more
complex validation. I also considered using a validation library, email
regex validation, and dynamically restricting a date of birth based on
age requirements.

### Review and analysis

**Score: 6.5/10**

The overall direction was sensible: start with native browser validation
and add JavaScript only when the requirements need it. The answer needed
a clearer distinction between client-side user experience and
server-side security.

What was good: - Native HTML constraints reduce custom code. -
JavaScript is appropriate for cross-field, dynamic, asynchronous, and
business-rule validation. - A validation library can help when forms
become complex.

What was missing or needed correction: - Mention `autocomplete` and
`inputmode`; `inputmode` influences the mobile keyboard but does not
validate input. - Know the Constraint Validation API: `validity`,
`checkValidity()`, `reportValidity()`, and `setCustomValidity()`. Clear
a custom error with `setCustomValidity("")` when the input becomes
valid. - Use a proper `<label>` associated with the input. Connect
help/error text with `aria-describedby`; use `aria-invalid` when
appropriate and announce dynamic errors accessibly. - `min` and `max`
can apply to dates as well as numeric inputs. - Avoid an unnecessarily
complex email regex unless a specific business rule requires it. -
Client-side validation is for usability. The server must validate
independently because client-side checks can be bypassed. - Don't choose
a JavaScript library automatically. Choose one when complexity,
consistency, or maintainability justifies it.

### Improved spoken answer

I wouldn't immediately reach for a JavaScript validation library. I'd
start with native HTML validation because it gives us useful behavior
with very little code.

I'd use attributes such as `required`, `type`, `min`, `max`, and
`pattern` where they match the requirement. I'd also use labels, helpful
error messages, and accessible relationships between inputs and their
errors.

If I need cross-field rules, dynamic business logic, asynchronous
checks, or a more controlled validation experience, I'd add JavaScript
and use the Constraint Validation API where appropriate. A library is
useful when it simplifies a complex form, but it shouldn't be the
default for every form.

I'd avoid an overly strict email regex unless the product has a specific
rule that requires it. And regardless of the client-side approach, the
backend must validate the submitted data independently. Client
validation improves the experience; server validation protects data
integrity and security.

------------------------------------------------------------------------

## 2. Custom `<div role="dialog">` vs Native `<dialog>`

### Interview question

Would you build a modal using a custom `<div role="dialog">` or use the
native HTML `<dialog>` element?

### My answer --- summary

I preferred the native `<dialog>` element because it provides built-in
modal behavior and accessibility support, while a custom div requires
more manual work.

### Review and analysis

**Score: 7.5/10**

Choosing native `<dialog>` is a strong default, but don't claim it makes
the entire modal accessible automatically.

Key points: - `showModal()` opens a modal dialog in the top layer and
makes the rest of the document inert for interaction. - `show()` opens a
non-modal dialog. Know the distinction. - Native dialog behavior reduces
custom work, but you still need to manage the initial focus target,
focus restoration, accessible naming/description, content scrolling, and
application-specific dismissal behavior. - Use a heading and
`aria-labelledby` to give the dialog an accessible name; use
`aria-describedby` when a description is helpful. - Don't add
`aria-modal="true"` blindly to a native dialog opened with
`showModal()`; native semantics already convey modal behavior. -
Escape/cancel behavior can be handled through the dialog's `cancel`
event if product requirements need a different policy. - Backdrop-click
dismissal is a product decision, not an automatic accessibility
requirement. - Test with automated accessibility tools, keyboard
navigation, and a real screen reader.

### Improved spoken answer

I'd generally prefer the native `<dialog>` element for a true modal
because it gives us built-in browser behavior and reduces the amount of
accessibility behavior we have to recreate.

I'd open it with `showModal()`, not `show()`, because `showModal()`
gives us modal behavior and makes the rest of the page inert while the
dialog is open. I'd give it an accessible name using a heading and
`aria-labelledby`, and add a description if that helps users understand
the dialog.

But I wouldn't assume native dialog solves everything. I'd still choose
the right initial focus target, make sure focus returns to the element
that opened the dialog, and test keyboard behavior, Escape handling,
scrolling, and mobile layouts.

I'd validate it at three levels: automated checks with a tool such as
axe, manual keyboard testing, and screen-reader testing with NVDA or
VoiceOver. I'd use a custom dialog only if the native element couldn't
meet a specific product requirement without excessive workarounds.

My principle is to prefer native HTML semantics and behavior first,
while still verifying the complete user experience.

------------------------------------------------------------------------

## 3. Browser Rendering: HTML Response to First Pixels

### Interview question

Walk through what happens from the browser receiving an HTML response to
displaying the first pixels. Explain how scripts, CSS, and resource
loading affect the process.

### My answer --- summary

I explained that the browser parses HTML to build the DOM, discovers CSS
and scripts, builds the CSSOM, combines DOM and CSSOM into a render
tree, and then performs layout and paint. I also discussed `async`,
`defer`, resource preloading, and fonts.

### Review and analysis

**Score: approximately 7.5/10 for Senior; 6.5--7/10 for Lead**

The core pipeline was mostly right. The main omissions were compositing,
a more precise explanation of script behavior, and how you'd measure the
result.

Important corrections: - HTML parsing is incremental. The browser parses
the response into tokens and constructs the DOM as bytes arrive. - A
classic synchronous script can pause HTML parsing while it is
fetched/executed. - `defer` scripts download in parallel and execute
after parsing, in document order. - `async` scripts execute as soon as
they're ready and may interrupt parsing; ordering isn't guaranteed. -
External JavaScript modules are deferred by default. - CSS is
render-blocking in the sense that the browser needs applicable styles to
reliably construct and render the styled page. Avoid saying that no
pixels can ever be painted until every CSS resource has loaded. - The
main rendering stages are DOM + CSSOM → render tree → layout → paint →
compositing. - Layout calculates geometry; paint draws visual content;
compositing combines layers into the final frame. - A preload
scanner/speculative scanner can discover resources while the main parser
is blocked. - Preload and `fetchpriority` should be selective.
Over-prioritizing resources can compete with more important requests. -
Use DevTools Performance and Network, Lighthouse, and real-user
monitoring to measure changes. Track LCP, INP, CLS, and relevant loading
timings.

### Improved spoken answer

When the browser receives the HTML response, it parses the document
incrementally and builds the DOM. As it discovers resources, it starts
fetching CSS, JavaScript, images, and fonts.

A classic synchronous script can block HTML parsing. With `defer`,
scripts download in parallel and execute after parsing in document
order. With `async`, they execute as soon as they're ready, so their
execution order isn't guaranteed. External module scripts are deferred
by default.

The browser parses CSS into the CSSOM. It combines the DOM and CSSOM
into a render tree, then performs layout to calculate element positions
and sizes. It paints text, backgrounds, borders, and images, and finally
composites layers into the frame shown on screen.

The key is resource discovery and prioritization. If the LCP image is
discovered late, I would investigate whether it can be discovered
earlier or selectively preloaded. If a font is genuinely critical, I
would check whether it delays rendering or causes layout shifts. I
wouldn't preload everything, because that can create network contention.

I'd verify changes in Chrome DevTools' Network and Performance panels,
and use Lighthouse for repeatable lab measurements. Then I'd check field
data and Core Web Vitals to make sure the improvements are real for
users. The goal isn't simply to load more resources faster; it's to help
the browser discover and prioritize the right resources at the right
time.

------------------------------------------------------------------------

## 4. Shared Web Components Across React, Angular, and jQuery

### Interview question

Our company has three teams using React, Angular, and a legacy jQuery
app. We want a shared `<ds-button>` and `<ds-dropdown>` that work in all
of them. Someone suggests Web Components. Is that a good idea?

Cover: - Custom Elements, Shadow DOM, and `<template>`/`<slot>` - Shadow
DOM CSS encapsulation and theming - Attributes vs properties and
`CustomEvent` - One real downside, such as accessibility, forms, SSR, or
React interoperability - Recommendation, trade-off, and when you'd say
no

### My answer

> I think that's a good suggestion; otherwise each team has to build and
> manage its own component, which is three times the effort. With Web
> Components, a single team can deliver it and share it across the
> teams. The only trade-off is extra wrapper code or a polyfill you
> might need for the legacy jQuery app.
>
> Custom Elements let you define your own custom HTML tags and hook into
> their lifecycle.
>
> Shadow DOM provides an isolated DOM tree inside your component, so
> your styles won't leak and the app's styles don't affect the Web
> Component, or vice versa.
>
> Template and slot let you define reusable HTML markup and placeholders
> where the consumer can pass their text or icons.
>
> You pass data into the component using attributes for strings, or rich
> JavaScript properties for complex data like dropdown options. You send
> data out by dispatching standard JavaScript `CustomEvent`s.
>
> A real downside is React interoperability and form integration. Older
> versions of React don't handle custom-element events or properties
> natively, requiring wrappers, and Web Components traditionally require
> extra boilerplate to participate smoothly in native HTML forms.
>
> I would say no if the team lacks experience in the raw DOM API or the
> legacy app is stale and retiring in the next few weeks or months.

### Review and analysis

**Score: 8/10**

What was strong: - You opened with the business value: reuse and reduced
duplication. - You correctly explained the three Web Component building
blocks. - You distinguished attributes from properties. - You identified
React integration and forms as genuine trade-offs. - You gave a
condition under which you might avoid the approach.

What would improve the answer: - Explicitly explain theming. Expose CSS
custom properties and, where useful, internal elements through
`::part()`. - For events that must cross a Shadow DOM boundary, use
`CustomEvent` with `bubbles: true` and `composed: true` where
appropriate. - Don't lead with polyfills for modern browsers.
Integration ergonomics, events, properties, typings, forms, and
SSR/hydration are usually more meaningful concerns. - The strongest
reason to say no is heavy coupling to a specific framework's context,
state, forms, or SSR---not simply lack of raw DOM experience. - A button
is relatively simple; a custom dropdown is much more complex because of
accessibility, keyboard interaction, focus management, positioning, and
form behavior.

### Improved spoken answer

Yes, I think Web Components are a good fit because we have three
different frameworks and want one shared implementation. Otherwise, each
team could build and maintain its own button and dropdown, which means
duplicated effort and potentially inconsistent UX.

There are three main pieces. Custom Elements let us define our own HTML
elements and control their lifecycle. Shadow DOM gives the component an
isolated DOM and CSS scope, so styles inside don't leak out and
application styles don't accidentally break the component. And
`<template>` gives us reusable markup, while `<slot>` provides content
projection so consumers can provide things like text or icons.

For styling, Shadow DOM doesn't mean the component can't be themed. I'd
expose a controlled styling API using CSS custom properties and, where
necessary, `::part()`.

For data, attributes are good for simple string configuration, while
JavaScript properties are better for complex values like an array of
dropdown options. For events, the component can dispatch `CustomEvent`.
If the event needs to cross the Shadow DOM boundary, I'd typically use
`bubbles: true` and `composed: true`.

The main trade-off is framework integration. React, especially older
versions, can need wrappers for custom properties and events, and forms
and SSR can require additional work.

So I'd recommend Web Components for low-level shared primitives like a
button. I'd be more careful with a complex dropdown because
accessibility, focus management, keyboard interaction, and framework
integration become harder. I'd say no if the components are heavily
coupled to one framework or if the legacy application is being retired
soon.

Overall, I'd choose Web Components for cross-framework reuse, accepting
some integration complexity in exchange for one shared implementation.

------------------------------------------------------------------------

## 5. Performance Triage: Product Page With Poor Core Web Vitals

### Interview question

You join a project mid-sprint. An e-commerce product page scores 45 on
mobile Lighthouse. Field data shows LCP at 4.8 seconds, CLS at 0.3, and
poor INP. The page is server-rendered React, and the markup is full of
div soup. You have two days before a release freeze, and the head of
engineering asks: "What do you do first, and how will I know it worked?"

Cover: - Triage and tools - First three fixes for LCP, CLS, and INP -
What you'd refuse to do under time pressure - Before/after numbers, lab
vs field data, and regression prevention

### My answer

> To triage this under pressure, I'll debug with Chrome DevTools, the
> Performance tab, CPU throttling, and a Lighthouse report. For the
> real-user metrics, we can use the Chrome UX Report for a more
> realistic view.
>
> We urgently need to focus on three things.
>
> **LCP:** For above-the-fold hero images, we need to fetch them
> quickly. Add `fetchpriority="high"` and preload the image, and remove
> lazy loading because the hero is critical:
>
> `<link rel="preload" as="image" href="hero-image.jpg" fetchpriority="high">`
>
> **CLS:** Define the proper height and width for resources like images
> and videos so they reserve space before the content loads.
>
> **INP:** Defer non-critical scripts such as third-party analytics and
> marketing pixels using `defer` or `async`, and break up long React
> hydration tasks. This frees the main thread so clicks respond faster.
>
> I would refuse to do broad refactoring or anything related to SSR
> because it is risky and requires regression testing, which takes more
> time. Attempting it in two days could cause UI breakage before the
> release freeze.
>
> To prove it worked, show before-and-after Performance and Lighthouse
> reports. CrUX may take up to 28 days to reflect field data. We can add
> Lighthouse to the pipeline so performance regressions are caught
> before release.

### Review and analysis

**Score: 7.5/10**

What was strong: - You chose relevant tools: DevTools, Performance, CPU
throttling, Lighthouse, and CrUX. - The hero image fix is appropriate if
that image is confirmed to be the LCP element. - Reserving image/video
space is a good first CLS fix. - You correctly prioritized small changes
over a broad refactor close to release. - You included before/after
validation and CI regression checks.

What to improve: - Open the **Network** tab as well as Performance. For
LCP, inspect the request waterfall and determine whether the problem is
late discovery, network latency, image priority, decoding, or rendering
delay. - Confirm the actual LCP element before preloading. Preloading
the wrong resource can waste bandwidth. - For CLS, inspect actual
layout-shift events. Also check fonts, dynamically injected banners,
ads/iframes, and components that appear after hydration. - `async` and
`defer` change script loading/execution timing; they do not
automatically fix expensive hydration or event handlers. Use the trace
to find the real long task and reduce or split that work. - Don't say
you categorically refuse all SSR-related changes. Say you would avoid
broad SSR architecture changes, but allow a small, targeted hydration
fix if evidence shows it is necessary and it can be tested safely. -
Report concrete before/after values for LCP, CLS, INP, and Lighthouse
score. Distinguish repeatable lab tests from field data. - CrUX is
aggregated real-user data and may lag. If the company has RUM, use it
for more timely release monitoring. - A CI Lighthouse budget is useful,
but it should complement---not replace---field monitoring and
functional/accessibility regression tests.

### Improved spoken answer

First, I would not start changing code immediately. I have two days, so
I need to identify the highest-impact problems first.

I'd open Chrome DevTools Performance and Network tabs, run Lighthouse
under a consistent mobile profile, and use CPU and network throttling.
I'd also look at existing field data from CrUX or our RUM system.

For LCP, I'd identify the actual LCP element and inspect its request
waterfall. If it's the hero image and it is discovered late or
incorrectly lazy-loaded, I'd make it discoverable early, use
`fetchpriority="high"`, and preload it if the trace supports that. That
directly targets the 4.8-second LCP.

For CLS, I'd inspect the layout-shift events and find exactly what is
moving. I'd reserve space using explicit dimensions or aspect ratios for
images, videos, and dynamic content. I'd also check fonts, banners, and
anything injected after load. That targets the 0.3 CLS.

For INP, I'd look at the Performance trace for long main-thread tasks,
especially around React hydration and user interactions. I'd defer or
remove non-critical third-party scripts where possible. If hydration is
expensive, I'd reduce or split that work rather than assuming `async` or
`defer` fixes it.

With only two days, I would avoid a broad refactor, redesigning the
component architecture, or a risky SSR architecture change. I'd make
small, isolated changes where I can measure the expected benefit and
regression-test the affected flows.

To prove it worked, I'd report the before-and-after Lighthouse score,
LCP, CLS, and INP, plus the Performance trace showing the reduced
bottleneck. Lighthouse gives me immediate, repeatable lab validation.
CrUX or RUM tells me what real users experience, but field data takes
longer to accumulate.

Finally, I'd add performance budgets to CI for key routes and monitor
field metrics after release so the improvement doesn't regress.

------------------------------------------------------------------------

## 6. SEO, Social Preview, Localization, Viewport, and Structured Data

### Interview question

Marketing complains that product pages show a blank preview when shared
on Slack and LinkedIn. Search shows duplicate URLs for the same product,
such as `?color=red` and `?utm_source=…`. Hindi and English versions
rank in the wrong country. The mobile layout looks zoomed-out on some
phones.

Walk through what's likely wrong in the `<head>` and how you'd fix each
one.

Cover: - Shared previews: which tags control them - Duplicate URLs: the
tag that fixes them, and its limits; say whether it is a hint or
directive - Language and region targeting: the right attributes on
`<html>` and `<link>` - Mobile layout: viewport meta tag and one setting
never to use for accessibility reasons - Rich results: what structured
data is, which format you'd choose, and how to validate it - A rendering
trap: why some tags may not work on a client-rendered React page and
what you'd do about it

### My answer

**Not submitted yet.**

### Expected checklist for your answer

Use this as a self-check after you attempt the question:

-   **Social previews:** Open Graph tags such as `og:title`,
    `og:description`, `og:image`, and `og:url`; consider
    platform-specific metadata where relevant. Check that crawlers can
    fetch the page and image.
-   **Duplicate URLs:** Use `<link rel="canonical" href="…">` to
    indicate the preferred URL. Canonicalization is a **hint**, not a
    directive; search engines may choose another canonical. It does not
    replace sound URL handling, internal linking, redirects when
    appropriate, or controlling crawlable parameter variants.
-   **Language and region:** Set the correct `lang` attribute on
    `<html>`, such as `lang="hi"` or `lang="en"`. Use reciprocal
    `hreflang` annotations on `<link>` elements for language/region
    variants, such as `hreflang="en-IN"` and `hreflang="hi-IN"`, with
    valid self-referencing/cross-references as appropriate. `lang` helps
    identify document language; `hreflang` helps search engines
    understand alternate localized versions.
-   **Mobile viewport:** Typically use
    `<meta name="viewport" content="width=device-width, initial-scale=1">`.
    Don't disable or restrict user zoom with settings such as
    `user-scalable=no` or an overly restrictive `maximum-scale`, because
    that harms accessibility.
-   **Structured data:** Machine-readable data describing the
    page/entity, commonly using Schema.org vocabulary. JSON-LD is
    usually the preferred format. Choose types that accurately match the
    page (for example, `Product` and eligible `Offer` data) and validate
    with Google's Rich Results Test and Schema.org Validator. Valid
    markup does not guarantee a rich result.
-   **React rendering trap:** If metadata is added only after
    client-side JavaScript runs, crawlers and social-preview bots may
    miss it or see incomplete metadata. Social crawlers may not execute
    JavaScript consistently. Render critical metadata in the initial
    server response using SSR/SSG or the framework's server-side
    metadata facilities, and inspect the actual HTML response---not just
    the hydrated DOM.

### Answer status

This question is ready for practice. Submit a spoken-style answer, then
review it against the checklist and refine it into a concise Lead-level
response.

------------------------------------------------------------------------

## Overall interview habits to practice

1.  **Start with the decision and the reason.** Explain the user or
    business impact before listing implementation details.
2.  **Measure before prescribing.** Identify the cause with a trace,
    network waterfall, or concrete evidence before choosing a fix.
3.  **Name the trade-off.** Explain why your approach fits the context
    and when you would choose differently.
4.  **Be precise with platform behavior.** For example, a canonical URL
    is a hint, `inputmode` is not validation, and `defer` does not
    automatically fix expensive hydration.
5.  **Prove the result.** State which metrics or tests you will compare,
    distinguish lab from field results, and explain how you will prevent
    regressions.
6.  **Keep the spoken answer focused.** A strong Lead answer is usually
    a clear decision, a small number of high-impact details, the
    trade-off, and the validation plan---not an exhaustive list of APIs.
