---
id: set-4
title: Set 4 — Architecture, Security & Production
description: Replication, sharding, distributed patterns, web security, Next.js rendering, SQL/ACID and ops. Hard.
---

### Q1 | MongoDB | Replica sets
A replica set has 4 voting members. How many members can fail while a primary can still be elected?

- A) 1
- B) 0
- C) 2
- D) 3

**Answer:** A
**Explanation:** A majority of 4 voting members is 3, so only 1 may be down. This is why odd numbers (3, 5) are recommended: 5 members tolerate 2 failures.

### Q2 | MongoDB | Member roles
You want a replica member for analytics that never becomes primary and is invisible to applications. Which configuration?

- A) A hidden member with priority 0
- B) An arbiter, which votes in elections but holds no data to query
- C) A delayed member with five votes so it can never be elected
- D) A secondary with priority 10 and its read preference set to nearest

**Answer:** A
**Explanation:** Hidden members are not exposed to drivers' read routing and, with priority 0, cannot be elected. They are ideal for reports and backups.

### Q3 | MongoDB | Consistency
Which feature lets a client read its own writes across different replica set members?

- A) Capped collections with tailable cursors
- B) Wildcard indexes on the user's documents
- C) Causally consistent sessions
- D) TTL indexes that expire stale reads

**Answer:** C
**Explanation:** Causal consistency tracks operation time within a session, and uses `majority` reads and writes to guarantee read-your-writes and monotonic reads.

### Q4 | MongoDB | Backups
For a large production cluster that needs point-in-time recovery, which approach fits best?

- A) A nightly `mongodump` run, kept for thirty days
- B) Copying the data files while the database keeps running
- C) A weekly CSV export of every collection, stored in object storage
- D) Snapshots plus continuous oplog capture, or a managed continuous backup

**Answer:** D
**Explanation:** Dumps are slow to restore and only restore to the dump time. PITR replays the oplog up to a chosen timestamp.

### Q5 | MongoDB | Encryption
In Client-Side Field Level Encryption (CSFLE), who can see plaintext of an encrypted field?

- A) Only clients that hold the keys; the server stores ciphertext
- B) The MongoDB server, because it decrypts fields while processing queries
- C) Any database administrator with the `root` role
- D) Anyone with network access to the cluster, if TLS is disabled

**Answer:** A
**Explanation:** Data is encrypted before it leaves the driver. Combine with TLS in transit and encryption at rest for defence in depth.

### Q6 | MongoDB | Access control
Which is the best practice for an application's database user?

- A) The built-in `root` role, to avoid permission errors in production
- B) One shared admin account used by every service in the company
- C) A dedicated user holding only `readWrite` on the specific database
- D) No authentication, since the cluster sits inside a private VPC

**Answer:** C
**Explanation:** Least privilege limits the blast radius of injection or credential theft. Use separate users per service.

### Q7 | MongoDB | Migrations
You must rename a field used by running services without downtime. What is the safest pattern?

- A) Rename the field in the database and deploy the new code at the same moment
- B) Restart the database after the rename so every client reloads its schema
- C) Drop the collection and restore it from the new schema while traffic is paused
- D) Expand and contract: write both, backfill, switch reads, remove old field

**Answer:** D
**Explanation:** Rolling deployments mean old and new code run together. A `schemaVersion` field helps readers handle both shapes.

### Q8 | MongoDB | Multi-tenancy
In a shared-collection multi-tenant design, what is essential?

- A) A `tenantId` that is checked only in the user interface
- B) One shared index for all tenants, with no tenant field in it
- C) `tenantId` on every document, in every filter, and leading each index
- D) A single shared admin user that is scoped by the application per tenant

**Answer:** C
**Explanation:** Missing a filter leaks data across tenants, so enforce it centrally (middleware or a repository layer). Database-per-tenant isolates better but costs more.

### Q9 | MongoDB | Data lifecycle
You need to keep only the newest 1 GB of log documents in insertion order. Which structure fits?

- A) A view
- B) A sharded collection
- C) A capped collection
- D) A unique index

**Answer:** C
**Explanation:** Capped collections have a fixed size and overwrite the oldest data. You cannot delete individual documents or grow them.

### Q10 | MongoDB | Text search
Which limitation applies to MongoDB's built-in `$text` search?

- A) It cannot search strings that contain accents or capital letters
- B) It supports fuzzy joins between two collections
- C) A collection can have only one text index
- D) It requires the collection to be sharded before it can be used

**Answer:** C
**Explanation:** For ranking, fuzzy matching, autocomplete or facets, use Atlas Search or a dedicated search engine.

### Q11 | MongoDB | Geospatial
Which is required to run `$near` queries on GeoJSON points?

- A) A `2dsphere` index
- B) A TTL index
- C) A hashed index
- D) A wildcard index

**Answer:** A
**Explanation:** `$near` requires a geospatial index; `$geoWithin` does not strictly require one but is faster with it.

### Q12 | MongoDB | Sharded uniqueness
Which rule applies to unique indexes on a sharded collection?

- A) The unique index must be prefixed by the shard key
- B) They are unsupported
- C) They are enforced across shards automatically for any field
- D) They only work with hashed keys

**Answer:** A
**Explanation:** Each shard can only enforce uniqueness locally. Global uniqueness on other fields needs a separate mapping collection or application logic.

### Q13 | MongoDB | Default durability
Since MongoDB 5.0, what is the implicit default write concern for most deployments?

- A) `w: 'majority'`, acknowledged by most voting members
- B) `w: 1`, acknowledged by the primary only
- C) `w: 0`, with no acknowledgement at all
- D) `w: 3`, acknowledged by three members

**Answer:** A
**Explanation:** The default became `majority` (unless arbiters make that unsafe). Always set it explicitly for critical data so behaviour doesn't depend on version.

### Q14 | MongoDB | Outbox pattern
How does the outbox pattern make "update DB + publish event" reliable?

- A) It publishes the event first, then updates the database if the publish succeeds
- B) It saves the event in the same transaction, then a relay publishes it later
- C) It ignores publish failures, because the database is the source of truth
- D) It uses `w: 0` writes, so the database never blocks the publisher

**Answer:** B
**Explanation:** A crash can't leave state changed but the event lost, because both are committed atomically. The relay delivers at-least-once, so consumers must be idempotent.

### Q15 | MongoDB | Materialised views
What is the key difference between `$merge` and `$out`?

- A) `$merge` can upsert into an existing collection; `$out` replaces it
- B) There is no difference, because both stages replace the target collection
- C) `$out` merges into existing documents, while `$merge` replaces the collection
- D) `$merge` only reads from another collection and never writes

**Answer:** A
**Explanation:** `$merge` supports incremental refresh of pre-aggregated summaries. `$out` swaps in the complete result.

### Q16 | MongoDB | Hot documents
A single `stats` document receives thousands of `$inc` updates per second and becomes a bottleneck. What helps?

- A) Make the stats document bigger so it can absorb more concurrent writes
- B) Spread updates across several counter documents and sum them on read
- C) Lower the write concern to zero so the updates are never queued
- D) Add a secondary index on the counter field so updates are found faster

**Answer:** B
**Explanation:** Writes to one document serialise. Splitting the hot key distributes contention.

### Q17 | MongoDB | Mongoose sessions
Inside a Mongoose transaction, one `Model.create()` call omits `{ session }`. What happens?

- A) It runs outside the transaction and is not rolled back if the transaction aborts
- B) It joins the transaction anyway, because Mongoose tracks the active session
- C) It throws an error, because every operation must carry a session
- D) It blocks until the transaction finishes, then runs normally

**Answer:** A
**Explanation:** Every operation must receive the session explicitly. Forgetting one silently breaks atomicity.

### Q18 | MongoDB | Discriminators
What do Mongoose discriminators provide?

- A) Field-level encryption for the sub-schemas of a single model
- B) Automatic sharding of models by the discriminator value
- C) Schema inheritance within one collection, using a `__t` type key
- D) Index hints that are added to every query of a model

**Answer:** C
**Explanation:** They are useful for models sharing most fields (e.g. `CardPayment`, `BankTransfer`) that you query together.

### Q19 | MongoDB | CAP
In CAP terms, how does a MongoDB replica set behave during a network partition by default?

- A) It stays available on both sides and accepts writes everywhere
- B) Both sides elect a primary and reconcile the writes later
- C) It corrupts data on the minority side until the partition heals
- D) The side without a majority cannot elect a primary and stops writes

**Answer:** D
**Explanation:** Only the partition holding a majority can have a primary. Clients on the minority side may still read stale data from secondaries.

### Q20 | MongoDB | Time and ordering
You rely on `_id` ObjectId ordering to decide which of two transfers happened first across multiple servers. What is the weakness?

- A) Nothing is wrong, since ObjectId order is always the true causal order
- B) Client clocks are unsynchronised, so id order is not causal order
- C) ObjectIds are random, so they cannot be sorted at all
- D) ObjectIds are stored as strings, so they sort alphabetically

**Answer:** B
**Explanation:** Use an explicit sequence, a server-assigned timestamp, or a ledger entry number where ordering matters.

### Q21 | Express | IDOR / BOLA
`GET /invoices/:id` returns the invoice for any valid id once the user is logged in. What is the vulnerability?

- A) IDOR: the server must verify the invoice belongs to the caller
- B) SQL injection, because the id is placed directly into the query
- C) Cross-site request forgery, because the request needs no token
- D) Clickjacking, because the response can be framed by another site

**Answer:** A
**Explanation:** Unpredictable ids don't fix it. Enforce ownership checks (or tenant scoping) in a query like `findOne({ _id, ownerId: user.id })`.

### Q22 | Express | SSRF
An endpoint fetches a URL supplied by the user to generate a preview. What is the primary risk?

- A) Slow responses, because the server waits on the remote site
- B) Cross-site scripting, because the preview is shown to other users
- C) SSRF: attackers make your server call internal or metadata endpoints
- D) Cookie theft, because the fetch forwards the user's cookies

**Answer:** C
**Explanation:** Mitigate with an allowlist of hosts, resolving and blocking private/link-local ranges after DNS resolution, disabling redirects, and network egress rules.

### Q23 | Express | CSP
Which policy blocks inline scripts and third-party script origins?

- A) `X-Frame-Options: DENY`, which stops the page being framed
- B) `Content-Security-Policy: script-src 'self'`
- C) `Referrer-Policy: no-referrer`, which hides the page URL
- D) `Access-Control-Allow-Origin: *`, which allows every origin

**Answer:** B
**Explanation:** CSP limits where scripts can load from and is a strong XSS mitigation. Use nonces or hashes for necessary inline scripts.

### Q24 | Express | Token revocation
JWT access tokens are stateless. How do you limit damage from a stolen one?

- A) Make them last a year, so the user is not asked to log in again
- B) Store more user data inside them, so the server needs fewer lookups
- C) Keep them short-lived, rotate refresh tokens, and add a denylist
- D) Remove the signature, so tokens cannot be forged with a leaked key

**Answer:** C
**Explanation:** Short expiry bounds exposure. A revocation check trades some statelessness for control.

### Q25 | Express | BFF
What is the main security benefit of the Backend-for-Frontend pattern for a SPA?

- A) Faster bundles, because the SPA no longer ships any authentication code
- B) Tokens stay on the server; the browser holds only an HttpOnly cookie
- C) HTTPS becomes optional, since the BFF talks to the APIs
- D) CORS is removed in every deployment, because the BFF is a proxy

**Answer:** B
**Explanation:** The BFF performs the OAuth flow and calls APIs on behalf of the user, so XSS cannot steal long-lived tokens.

### Q26 | Express | mTLS
What does mutual TLS add for service-to-service calls?

- A) Compression of the payload between two services
- B) Both sides present certificates, so each authenticates the other
- C) Caching of upstream responses at the sidecar proxy
- D) Load balancing across all instances of the called service

**Answer:** B
**Explanation:** It is common in zero-trust and service meshes. Certificate rotation must be automated.

### Q27 | Express | CORS misconfig
Which CORS setup is a serious vulnerability?

- A) Allowing only a fixed list of trusted origins for the API
- B) Sending `Vary: Origin` so that caches key responses by origin
- C) Restricting the allowed methods to GET for cross-site calls
- D) Reflecting any `Origin` back together with `Allow-Credentials: true`

**Answer:** D
**Explanation:** Any malicious site could then make authenticated requests and read the responses. Use an exact allowlist.

### Q28 | Express | Uploads
Which approach is best for large user file uploads?

- A) Issue pre-signed URLs so clients upload straight to object storage
- B) Buffer every upload in Express memory before writing it anywhere
- C) Accept files straight into the `public/` folder of the server
- D) Trust the file extension and the MIME type sent by the client

**Answer:** A
**Explanation:** It removes load from your servers. Restrict content type and size in the signed policy and scan before use.

### Q29 | Express | Open redirect
A login accepts `?returnTo=` and redirects there after success. What is the risk and fix?

- A) There is no risk, because the redirect happens after login
- B) Phishing redirects; allow only relative paths or allowlisted hosts
- C) Cookies leak to the target site automatically on every redirect
- D) The server crashes when the target URL is malformed

**Answer:** B
**Explanation:** Validate the parsed URL, reject protocol-relative `//evil.com` and backslash tricks.

### Q30 | Express | Credential stuffing
Which defence best counters credential stuffing (reused leaked passwords)?

- A) Longer cookie lifetimes, so users log in less often
- B) Detailed error messages, so real users can fix their typing
- C) MFA, breached-password checks, rate limits and bot detection
- D) Shorter password limits, so hashing stays fast for the server

**Answer:** C
**Explanation:** Because attackers use valid credentials from other sites, per-account lockout alone is not enough.

### Q31 | Express | GraphQL
Why limit query depth and complexity on a GraphQL endpoint?

- A) To reduce typing, since long queries are tiring to write
- B) Deep or aliased queries force costly resolver work, enabling DoS
- C) GraphQL has no cost, so limits are only a style preference
- D) To hide the schema, because depth reveals the type names

**Answer:** B
**Explanation:** Add depth/cost limits, persisted queries, pagination limits, and disable introspection when needed in production.

### Q32 | Express | WebSockets
Cookies authenticate your WebSocket connection. Which attack should you defend against at handshake time?

- A) SQL injection through the first message sent after the handshake
- B) Cross-site WebSocket hijacking, stopped by validating `Origin`
- C) Zip slip, when a client sends an archive over the socket
- D) Prototype pollution through the JSON messages on the socket

**Answer:** B
**Explanation:** The browser attaches cookies to cross-site WebSocket handshakes. Check `Origin` and prefer token-based auth for the connection.

### Q33 | Express | Distributed transactions
Two microservices must update their own databases as one business operation, with no two-phase commit available. What pattern is typical?

- A) Hope that both calls succeed, then fix mismatches by hand
- B) Shared database credentials, so one service can update both databases
- C) A cron job that cleans up inconsistent rows once per day
- D) A saga: a series of local transactions with compensating actions on failure

**Answer:** D
**Explanation:** Sagas can be orchestrated (central coordinator) or choreographed (events). Steps and compensations must be idempotent.

### Q34 | Express | Contracts
What is the main advantage of a spec-first API with OpenAPI?

- A) Fewer endpoints, since the spec limits how many routes exist
- B) It removes the need for tests, because the spec is enforced by the framework
- C) It encrypts the payloads that match the schema
- D) One source of truth for validation, docs, mocks, client SDKs and contract tests

**Answer:** D
**Explanation:** Validating requests and responses against the spec catches drift between services and consumers.

### Q35 | Express | Releases
Which deployment strategy lets you send 5% of traffic to a new version and roll back quickly?

- A) Big-bang
- B) Recreate
- C) Manual FTP upload
- D) Canary release

**Answer:** D
**Explanation:** Combine with metrics-based automatic rollback. Blue/green switches all traffic between two environments at once.

### Q36 | Express | Tracing
How is a request followed across services?

- A) Propagate W3C trace context (`traceparent`) and export spans
- B) By matching timestamps in logs from different services by hand
- C) By tagging every request with the user's IP address
- D) By restarting each service and watching which one logs first

**Answer:** A
**Explanation:** Every outgoing call should carry the same trace id so logs, metrics and traces correlate.

### Q37 | Express | Audit trail
Which feature is essential in an audit log for financial actions?

- A) Records that administrators can edit when a mistake is found
- B) Unlimited retention of everything in the console output
- C) Only error messages, so the log stays small and easy to read
- D) Append-only entries of who, what, when and before/after state

**Answer:** D
**Explanation:** Store separately with restricted access, consider hash-chaining or WORM storage, and align retention with regulations.

### Q38 | Express | Card data
How should a web app avoid handling raw card numbers (PCI scope)?

- A) Store the card numbers encrypted in your own database
- B) Email the numbers to the finance team for manual processing
- C) Log card numbers during development, so failures can be debugged
- D) Use hosted fields or tokenisation so card data never reaches you

**Answer:** D
**Explanation:** Tokenisation drastically reduces PCI DSS scope. Your system keeps only tokens and the last four digits.

### Q39 | Express | Idempotent delete
`DELETE /orders/42` is called twice; the second returns 404. Is that acceptable for idempotency?

- A) No, the second call must also return 200 to be idempotent
- B) No, DELETE is never idempotent because it changes data
- C) Yes, because idempotency concerns final state, not the response
- D) Only if the database is empty when the second call arrives

**Answer:** C
**Explanation:** After both calls order 42 doesn't exist. Some APIs return 204 both times for client convenience.

### Q40 | Express | Defence in depth
Which statement best reflects secure API design?

- A) Authenticate at several layers, validate in each service, fail closed
- B) Rely on the API gateway for all security, since services are internal
- C) Trust internal network traffic, because attackers stay outside the VPC
- D) Hide the endpoints by obscurity, so attackers cannot find them

**Answer:** A
**Explanation:** Assume any layer can be bypassed or misconfigured. Zero trust means internal calls are verified too.

### Q41 | React | URL state
Search filters and pagination in a dashboard should live in:

- A) A global variable that every component imports directly
- B) `localStorage` only, so the filters survive across devices
- C) The URL query string, so views are shareable and back-button friendly
- D) Cookies, so that the server can render the same filters

**Answer:** C
**Explanation:** Put ephemeral UI state (open dropdown) in component state, and navigational state in the URL.

### Q42 | React | Error strategy
Which setup gives the best resilience for a large SPA?

- A) One `try/catch` in `index.js` that wraps the whole application
- B) Reload the page on any error, so users always get a fresh state
- C) Ignore errors in production, since users rarely notice them
- D) Error boundaries per route and widget with reporting and fallbacks

**Answer:** D
**Explanation:** A failure in one widget shouldn't blank the entire page. Boundaries don't catch event-handler errors, so handle those separately.

### Q43 | React | Lazy
What is required to use `React.lazy` correctly?

- A) A dynamic `import()` of a default export, rendered inside `<Suspense>`
- B) A named export with no wrapper around the lazy component
- C) A class component that implements `componentDidCatch`
- D) Server rendering only, because lazy components do not run on the client

**Answer:** A
**Explanation:** For named exports, re-export as default or map it in the import promise. Add an error boundary for chunk load failures.

### Q44 | React | Web vitals
Which Core Web Vital replaced FID and measures overall interaction responsiveness?

- A) LCP
- B) CLS
- C) INP
- D) TTFB

**Answer:** C
**Explanation:** Interaction to Next Paint observes latency of interactions through the page's life. LCP is loading, CLS is visual stability.

### Q45 | React | Forms
Why do libraries like React Hook Form often perform better on large forms?

- A) They use class components, which render faster than function components
- B) They store the form data on the server after every key press
- C) They skip validation, so each keystroke costs less
- D) Uncontrolled inputs and refs, so typing does not re-render the form

**Answer:** D
**Explanation:** Controlled inputs re-render on every change. Subscribe only to the fields you need.

### Q46 | React | Accessibility
How should an async "Payment submitted" status be announced to screen readers?

- A) Change its colour only, so sighted users notice the update
- B) Add a `title` attribute to the element that shows the message
- C) Set `tabindex="-1"` on the body so screen readers refocus
- D) Render it in an `aria-live="polite"` region, or use `role="status"`

**Answer:** D
**Explanation:** Live regions announce dynamic updates without moving focus. Use `assertive` or `role="alert"` for urgent errors.

### Q47 | React | Testing
Which React Testing Library approach is most robust?

- A) Query by role, label and text, and assert on visible behaviour
- B) Query by CSS class name and assert on the component's internal state
- C) Take a snapshot of every component, and review the diff on change
- D) Call hooks directly in tests, so the logic is tested in isolation

**Answer:** A
**Explanation:** Tests tied to implementation break on refactors. `getByRole` also encourages accessible markup.

### Q48 | React | Token storage
For a SPA calling APIs directly, what is a reasonable token strategy?

- A) Keep a long-lived token in `localStorage`, so it survives reloads
- B) Store the token in a global `window` property, to simplify debugging
- C) Put the token in the URL, so links work across tabs
- D) Access token in memory, refresh token in a Secure HttpOnly cookie

**Answer:** D
**Explanation:** In-memory tokens vanish on XSS reload, and HttpOnly cookies can't be read by scripts. A BFF is even safer.

### Q49 | React | Micro-frontends
What is a real trade-off of Module Federation micro-frontends?

- A) There are no trade-offs, since each team deploys on its own
- B) Independent deploys, at the cost of shared versions and UX drift
- C) They need no network, because modules are bundled at build time
- D) They always shrink the total bundle size of the application

**Answer:** B
**Explanation:** Use them for organisational scale, not for a small team. Contracts and shared design systems become critical.

### Q50 | React | Component APIs
What is the advantage of the compound component pattern (`<Tabs><Tabs.List/><Tabs.Panel/></Tabs>`)?

- A) Fewer files, since all the parts live in a single component
- B) It avoids JSX, because the structure is defined by props
- C) Faster hydration, because the parts are rendered by the server
- D) A declarative API where parts share implicit state through context

**Answer:** D
**Explanation:** It's common in design systems and headless libraries. Document the required structure and guard against misuse.

### Q51 | React | Search UX
A search box fires a request per keystroke and old responses overwrite newer ones. What combination fixes it?

- A) Remove the input and show a static list instead
- B) Debounce input and cancel stale requests with `AbortController`
- C) Fire the request from `setInterval` every few hundred milliseconds
- D) Fetch inside the render body so the data always matches the input

**Answer:** B
**Explanation:** Debounce cuts the number of requests; cancellation guarantees the latest query wins.

### Q52 | React | Offline/PWA
Which service worker strategy suits static app-shell files that rarely change, when offline use matters?

- A) Network-only
- B) Cache-only for APIs
- C) No caching
- D) Cache-first (precache)

**Answer:** D
**Explanation:** Precache versioned assets at install. Use network-first or stale-while-revalidate for data that must be fresh.

### Q53 | React | Next.js · Rendering choice
Which rendering approach fits a marketing page that changes twice a month, and a per-user account dashboard?

- A) SSR for both pages, so every request is rendered fresh
- B) Client-only rendering for both, to keep the server simple
- C) Static or ISR for the marketing page, and dynamic rendering for the dashboard
- D) Dynamic rendering for marketing, and static for the personal dashboard

**Answer:** C
**Explanation:** Choose per route by freshness and personalisation needs. Static content is fastest and cheapest to serve.

### Q54 | React | Next.js · Server Actions
Which hook handles pending state and returned validation errors for a form bound to a Server Action?

- A) `useActionState`, plus `useFormStatus` for child submit buttons
- B) `useReducer` alone, since actions are just reducers
- C) `useId`, which tracks pending state of the form
- D) `useDebugValue`, which reports validation errors to the form

**Answer:** A
**Explanation:** Forms using actions work before hydration (progressive enhancement). Always validate on the server.

### Q55 | React | Next.js · Auth placement
Where should authorisation checks live in the App Router?

- A) Only in `layout.tsx`, because it wraps every page in the segment
- B) Close to the data, in a data access layer and Server Actions
- C) Only in `middleware`, because it runs before every request
- D) In Client Components only, where the user's session is visible

**Answer:** B
**Explanation:** Partial rendering means a layout check can be skipped on client navigation. Middleware is a coarse first gate, not the only one.

### Q56 | React | Next.js · Modals via routes
Which feature shows a photo modal on soft navigation but a full page on direct URL load?

- A) Rewrites defined in `next.config.js` for the photo path
- B) Intercepting routes combined with parallel routes
- C) Redirects from the photo path to the gallery path
- D) A static export of every photo page at build time

**Answer:** B
**Explanation:** Intercepting routes `(.)photo/[id]` and a `@modal` slot let one URL have two presentations.

### Q57 | React | Next.js · Metadata
How do you set per-page title and Open Graph tags from fetched data in the App Router?

- A) Set `document.title` in an effect after the page mounts
- B) Export an async `generateMetadata` function from the page
- C) Render `<head>` tags inside a Client Component
- D) Edit `next.config.js` with a rule for each page

**Answer:** B
**Explanation:** Metadata is rendered on the server for crawlers. Fetches are memoised with the page's own data fetching.

### Q58 | React | Next.js · ISR
With `export const revalidate = 60`, what does the first visitor after 60 seconds see?

- A) A blocking fresh render with a loading spinner shown meanwhile
- B) The stale cached page, while a fresh one is built in the background
- C) A 404 page, until the next build regenerates the route
- D) An error page, because the cache entry has expired

**Answer:** B
**Explanation:** Stale-while-revalidate: the next visitor gets the regenerated page. Use on-demand revalidation for immediate updates.

### Q59 | React | Next.js · Runtimes
Why might a route using `fs` or a native database driver fail with `runtime = 'edge'`?

- A) The Edge runtime is slower, so heavy modules time out
- B) Edge supports a subset of Web APIs, not the full Node.js API
- C) The Edge runtime lacks HTTPS, so database drivers cannot connect
- D) The Edge runtime requires CommonJS, and these packages are ES modules

**Answer:** B
**Explanation:** Use the Node.js runtime for database drivers and file access. Edge suits light, latency-sensitive logic.

### Q60 | React | Next.js · Self-hosting
You self-host Next.js on several instances with ISR. What problem can appear?

- A) Nothing, since ISR always shares its cache between instances
- B) ISR stops working on Linux hosts that run more than one instance
- C) Each instance has its own disk cache, so users may see different versions
- D) Only the images break, because they use a different cache

**Answer:** C
**Explanation:** Configure a custom `cacheHandler` (e.g. Redis) or a platform that handles shared caching.

### Q61 | Node.js | Scaling
In Kubernetes, what is the typical way to use multiple CPU cores with Node.js?

- A) Run one huge pod that uses `cluster` for all of the cores
- B) Disable the scheduler, so Node can use every core directly
- C) Run several single-process replicas and scale horizontally
- D) Use only one core, and make the process faster instead

**Answer:** C
**Explanation:** The orchestrator handles restarts, health and load balancing. Cluster is mostly for bare VMs.

### Q62 | Node.js | Kafka
What does Kafka guarantee about message ordering?

- A) Global ordering across every partition of the topic
- B) No ordering at all, even within a partition
- C) Ordering across all consumer groups of the topic
- D) Ordering within a single partition only

**Answer:** D
**Explanation:** Use a key (e.g. account id) so all events for one entity land in the same partition.

### Q63 | Node.js | Cache stampede
When a hot cache key expires, thousands of requests hit the database simultaneously. How do you mitigate it?

- A) Remove the cache, so every request goes to the database
- B) Add more database replicas to absorb the burst
- C) Use a shorter TTL on every key, so entries refresh more often
- D) Request coalescing, stale-while-revalidate, or jittered TTLs

**Answer:** D
**Explanation:** Only one request should rebuild the value while others wait or serve stale data.

### Q64 | Node.js | RED metrics
What do the RED metrics measure for a service?

- A) Rate, Errors, Duration
- B) Reads, Errors, Deletes
- C) Retries, Exceptions, Downtime
- D) Requests, Events, Data

**Answer:** A
**Explanation:** RED covers request rate, error rate and latency distribution. USE (Utilisation, Saturation, Errors) applies to resources.

### Q65 | Node.js | Injection
What is the safer alternative to `exec(`convert ${filename} out.png`)` for running a CLI tool?

- A) `execFile('convert', [filename, 'out.png'])`, which does not invoke a shell
- B) `eval` with a template string, so the command is parsed in JavaScript
- C) Escaping `;` with `replace`, then still using `exec`
- D) Running the whole process as root, so injected commands are blocked

**Answer:** A
**Explanation:** Arguments are passed directly, so shell metacharacters are not interpreted. Still validate the filename and beware of tools that treat arguments starting with `-` as options.

### Q66 | Node.js | Supply chain
What is a dependency confusion attack?

- A) Two versions of the same lockfile merged together by a CI job
- B) Publishing a public package with a private package's name
- C) A circular import between two internal packages of a monorepo
- D) A conflict between the type definitions of two packages

**Answer:** B
**Explanation:** Use scoped packages, registry scoping, and lockfiles. Review install scripts and use provenance and audit tooling.

### Q67 | Node.js | Zero downtime
Which combination enables zero-downtime rolling deployments?

- A) Kill all pods first and start the new ones afterwards
- B) Disable health checks so traffic is never removed from a pod
- C) Readiness probes, graceful SIGTERM shutdown and a preStop delay
- D) Restart the process on every request so it always runs new code

**Answer:** C
**Explanation:** Traffic must stop being routed to a pod before it exits, and in-flight requests must finish.

### Q68 | Node.js | Docker
What does a multi-stage Docker build help with?

- A) Run two applications inside one container to share resources
- B) Make the CPU faster while the dependencies are being compiled
- C) Build with dev tools in one stage, copy only the output into the final image
- D) Encrypt every layer of the image automatically at build time

**Answer:** C
**Explanation:** Smaller images mean a smaller attack surface and quicker pulls.

### Q69 | Node.js | gRPC
Which statement describes gRPC?

- A) JSON over HTTP/1.1 only, with typed contracts added by the client
- B) Protocol Buffers over HTTP/2 with typed contracts and streaming
- C) A database wire protocol used by drivers
- D) A browser-only API for talking to web workers

**Answer:** B
**Explanation:** It is efficient for service-to-service calls. Browsers need gRPC-Web or a gateway.

### Q70 | Node.js | TypeScript paths
You set `paths: { "@/*": ["src/*"] }` in tsconfig, compile with `tsc`, and run the output. Imports like `@/db` fail at runtime. Why?

- A) `tsc` has a bug that drops path aliases in production builds
- B) `tsc` checks the aliases but does not rewrite them in emitted JS
- C) Node forbids the `@` character in module specifiers
- D) The `paths` option is deprecated and ignored by the compiler

**Answer:** B
**Explanation:** Use a bundler, a runtime resolver (`tsx`, `tsconfig-paths`), or a rewriting step.

### Q71 | Node.js | NodeNext
With `"module": "NodeNext"` and ESM, how must relative imports be written in TypeScript?

- A) `import x from './util.js'`, the extension of the emitted file
- B) `import x from './util'`, because Node adds the extension
- C) `import x from './util.ts'`, because that is the source file
- D) `import x from util`, because bare names resolve locally

**Answer:** A
**Explanation:** Node ESM requires explicit extensions, and TypeScript doesn't rewrite them, so you write `.js` even in `.ts` sources.

### Q72 | Node.js | SQL & ACID
Which anomaly can still occur under the SQL `READ COMMITTED` isolation level?

- A) Dirty reads
- B) Lost durability
- C) Non-repeatable reads
- D) Syntax errors

**Answer:** C
**Explanation:** Another transaction can commit between two reads in your transaction, changing the result. `REPEATABLE READ` and `SERIALIZABLE` increase protection.

### Q73 | Node.js | SQL & ACID
In which situation is a relational database usually a better fit than MongoDB?

- A) Documents whose shape varies a lot from record to record
- B) Storing high-volume application logs without any joins
- C) Quick prototyping, where the schema is expected to keep changing
- D) Strongly relational data with multi-row constraints, like double-entry accounting

**Answer:** D
**Explanation:** MongoDB supports transactions, but SQL's constraints, joins and mature tooling are natural for ledger-like workloads. Many banks use both.

### Q74 | Node.js | N+1
What is the N+1 query problem?

- A) Creating N+1 indexes on a collection, one for each field
- B) A TypeScript error about array lengths
- C) One query for the list, then one extra query per item
- D) A connection leak caused by not closing a cursor

**Answer:** C
**Explanation:** Fix with joins, `$in` batching, DataLoader, or populate with a single batched query.

### Q75 | Node.js | CAP
Which statement is the correct reading of the CAP theorem?

- A) Under a partition you must choose consistency or availability
- B) You can pick any two of the three properties at all times
- C) Partitions cannot happen in a well-designed system
- D) Consistency always wins over availability in distributed systems

**Answer:** A
**Explanation:** Partition tolerance isn't optional in distributed systems. Without a partition you can have both, though latency trade-offs still exist.

### Q76 | Node.js | Timing
Which API is correct for measuring elapsed duration in a service?

- A) A difference of two `Date.now()` calls
- B) `performance.now()` or `process.hrtime.bigint()`, both monotonic
- C) `new Date().getTime()` captured once at startup
- D) A `setTimeout` that fires when the work should be finished

**Answer:** B
**Explanation:** Wall-clock time can jump backwards (NTP, DST). Monotonic clocks only move forward.

### Q77 | Node.js | Cryptography
What goes wrong if you reuse the same (key, IV/nonce) pair for two AES-GCM encryptions?

- A) It destroys confidentiality and authenticity, enabling forgery
- B) Nothing, because the key is secret and the nonce is public anyway
- C) The output becomes longer, but remains secure
- D) Encryption becomes slower, because the nonce must be looked up

**Answer:** A
**Explanation:** Generate a fresh random 96-bit nonce per message (or use a counter), and store it with the ciphertext.

### Q78 | Node.js | Cancellation
A client disconnects while your handler runs a heavy query. How do you avoid wasted work?

- A) Nothing can be done once the handler has started its query
- B) Increase the timeouts so the work can finish for nobody
- C) Disable keep-alive so the connection closes sooner
- D) Listen for `req.on('close')` and abort with `AbortController`

**Answer:** D
**Explanation:** Pass the abort signal into HTTP clients and database calls where they support it.

### Q79 | Node.js | 12-factor
Which is part of the 12-factor app approach?

- A) Config hard-coded for each environment inside the source
- B) Manual deploys, so changes are reviewed by a person
- C) Local disk as the primary storage for user uploads
- D) Config in env vars, stateless processes, and logs to stdout

**Answer:** D
**Explanation:** It makes services portable, scalable and easy to run in containers.

### Q80 | Node.js | Worker threads
When should you use `SharedArrayBuffer` and `Atomics` between worker threads?

- A) For hot numeric data where message copying is too costly
- B) For all messaging between workers, since it is always faster
- C) To share database connections between workers safely
- D) To avoid garbage collection by keeping all objects in shared memory

**Answer:** A
**Explanation:** Normally use `postMessage` (copies or transfers). Shared memory introduces race conditions, so use `Atomics` for coordination.
