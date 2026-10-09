---
id: set-2
title: Set 2 — Bank & Fintech Scenarios
description: Money handling, consistency, idempotency, auth, security and Next.js in banking-style situations. Mid to senior.
---

### Q1 | MongoDB | Transactions
You transfer funds between two accounts stored as separate documents. What is the correct approach?

- A) Two separate `updateOne` calls, debiting first and then crediting the other account
- B) Two `updateOne` calls inside `Promise.all`, so they finish at nearly the same moment
- C) A multi-document transaction, so both updates commit or neither does
- D) Two `updateOne` calls with `w: 0`, so a failed write never blocks the transfer

**Answer:** C
**Explanation:** Without a transaction a crash between the two writes loses money. `withTransaction` also retries on `TransientTransactionError` and `UnknownTransactionCommitResult`.

### Q2 | MongoDB | Atomic guard
How do you prevent an overdraft on a single account document without a transaction?

- A) `updateOne({ _id, balance: { $gte: amt } }, { $inc: ... })`, then check `modifiedCount`
- B) Read the balance, compare it in application code, then write the new balance back
- C) Allow the debit and let a nightly cron job repair any negative balances found
- D) Lower the write concern so concurrent debits are queued by the primary instead

**Answer:** A
**Explanation:** The condition and the update are evaluated atomically on one document. The read-check-write pattern is a race.

### Q3 | MongoDB | Idempotency
A mobile client retries a payment request after a timeout. How do you avoid charging twice?

- A) Require an idempotency key under a unique index and return the stored result
- B) Tell mobile users not to retry, and show a message when the request times out
- C) Add a one-second `sleep` before processing so duplicate requests arrive together
- D) Call `findOne` for the payment first, then insert it only when nothing is found

**Answer:** A
**Explanation:** The unique index makes the check-and-insert atomic. `findOne` then `insert` has a race window.

### Q4 | MongoDB | Ledger design
Why do financial systems prefer an append-only ledger over a mutable balance field alone?

- A) It uses far less storage, because only the latest balance of each account is kept
- B) It removes the need for indexes, because every entry is read in insertion order
- C) MongoDB cannot update numeric fields atomically, so a balance field is not possible
- D) Each change is an immutable, auditable entry, so balances can be rebuilt

**Answer:** D
**Explanation:** Double-entry style ledgers keep history and make reconciliation possible. A cached balance may exist as a derived value.

### Q5 | MongoDB | Change streams
Which statement about change streams is correct?

- A) They run on standalone servers and poll the collection about once every second
- B) They need a replica set, and a resume token lets consumers continue after a disconnect
- C) They only report inserts, and updates or deletes must be detected by comparing snapshots
- D) They need a capped collection, and a missed event cannot be recovered after a disconnect

**Answer:** B
**Explanation:** Change streams are built on the oplog. They support inserts, updates, replaces, deletes and more, and `resumeAfter` lets a consumer continue without missing events (within oplog window).

### Q6 | MongoDB | Decimal128
With the Node driver, a `Decimal128` field is read back. What do you get?

- A) A `Decimal128` object; use `.toString()` and a decimal library for arithmetic
- B) A plain JavaScript number, with the decimal digits rounded to 15 places
- C) A BigInt holding the value scaled by 10^34, ready for integer arithmetic
- D) A string that the driver converts back to a number when you do arithmetic on it

**Answer:** A
**Explanation:** Converting to `Number` reintroduces binary rounding. Do arithmetic in the database (`$add`, `$multiply` on decimals) or with `decimal.js`.

### Q7 | MongoDB | Retryable writes
What does `retryWrites=true` in the connection string do?

- A) The driver retries every failed write forever until the server accepts it
- B) The driver replays the oplog on the client to rebuild any write that was lost
- C) The driver retries only reads, since writes are never safe to repeat
- D) The driver retries a supported write once after a transient error

**Answer:** D
**Explanation:** It needs a replica set. Operations like `updateMany` are not retryable, but single-document writes are.

### Q8 | MongoDB | Write conflicts
Two transactions try to update the same document at the same time. What happens to the second?

- A) It waits indefinitely until the first transaction commits, then applies its own update
- B) Both transactions succeed, and MongoDB merges the two updates field by field
- C) It fails fast with a `WriteConflict`, so the application should abort and retry
- D) The first transaction is rolled back so that the second one can finish first

**Answer:** C
**Explanation:** MongoDB uses optimistic concurrency for transactions. `withTransaction` handles the retry loop for you.

### Q9 | MongoDB | Schema validation
A collection uses `$jsonSchema` with `validationLevel: 'moderate'` and `validationAction: 'error'`. What is the effect?

- A) Every existing invalid document blocks all updates until the whole collection is fixed
- B) Valid documents are checked on write, but updates to already-invalid ones are not
- C) Validation is skipped entirely, and only newly inserted documents are ever checked
- D) Invalid documents are accepted but a warning is written to the log for each one

**Answer:** B
**Explanation:** `strict` validates all inserts and updates. `moderate` skips documents that were already invalid. `validationAction: 'warn'` logs instead of rejecting.

### Q10 | MongoDB | Time series
What is the main advantage of time series collections for market ticks or metrics?

- A) Support for server-side joins between measurements and a reference collection
- B) Documents are kept forever, because time series collections cannot expire data
- C) Efficient storage and queries for timestamped data, using bucketing
- D) They are required for sharding, since a normal collection cannot be sharded by time

**Answer:** C
**Explanation:** Documents are grouped into buckets by `metaField` and time. You can also set automatic expiry.

### Q11 | MongoDB | ObjectId
Which describes the structure of an `ObjectId`?

- A) Twelve fully random bytes generated by the server for each new document
- B) A version 4 UUID stored as a 16-byte binary value with a type prefix
- C) A 4-byte timestamp, a 5-byte random value and a 3-byte incrementing counter
- D) A 64-bit integer that increments by one on every insert in the collection

**Answer:** C
**Explanation:** The first 4 bytes make ids roughly time-ordered, which gives sort-by-`_id` ≈ sort-by-creation-time at second granularity.

### Q12 | MongoDB | $facet
When would you use `$facet`?

- A) Building a new index on the output of the previous aggregation stage
- B) Running several sub-pipelines on one input, such as a page plus a total count
- C) Joining another collection into each document by matching on a field
- D) Removing duplicate documents based on the values of one or more fields

**Answer:** B
**Explanation:** Results are returned as one document with an array per facet. Note the 16 MB output document limit.

### Q13 | MongoDB | Array queries
Given `{ items: [{ a: 1, b: 2 }, { a: 3, b: 1 }] }`, which query matches the document?

- A) `{ items: { $elemMatch: { a: 1, b: 1 } } }`
- B) Neither
- C) `{ 'items.a': 1, 'items.b': 1 }`
- D) Both

**Answer:** C
**Explanation:** Dot notation conditions may be satisfied by **different** array elements (`a:1` from the first, `b:1` from the second). `$elemMatch` requires one element to satisfy both and does not match.

### Q14 | MongoDB | Regex & indexes
Which regex can use an index on `name` efficiently?

- A) `/ali/`, because any substring can be found by walking the index in order
- B) `/ali$/`, because the index can be scanned backwards from the string end
- C) `/^ali/`, a case-sensitive pattern anchored to the start of the string
- D) `/ali/i`, because a case-insensitive pattern uses the same index range

**Answer:** C
**Explanation:** Only a case-sensitive left-anchored prefix can do a tight index range scan. Use a text index, Atlas Search or a collation for the others.

### Q15 | MongoDB | Read preference
A balance check reads with `secondaryPreferred` right after a debit. What is the risk?

- A) There is no risk, since secondaries always apply writes before acknowledging them
- B) Reads from a secondary are converted into writes on the primary after a short delay
- C) Secondaries are read-only for admin users, so the query returns an authorisation error
- D) Replication lag can return a stale balance, so critical reads should use the primary

**Answer:** D
**Explanation:** Secondaries apply operations asynchronously. Use `primary` for decisions that must see the latest state.

### Q16 | MongoDB | Mongoose populate
What does `populate()` actually do?

- A) It performs a server-side `$lookup` join inside the same query
- B) It creates indexes on the referenced collection the first time it is used
- C) It permanently embeds the related documents into the parent document
- D) It runs extra queries with `$in` on the ids and stitches the results in Node

**Answer:** D
**Explanation:** It is convenience, not a join. For heavy joins or filtering on the joined data, use `$lookup`.

### Q17 | MongoDB | Oplog
What does the "replication window" (oplog window) tell you?

- A) How long a single query may run before the server cancels it
- B) How much operation history the oplog holds before a member must resync
- C) The time-to-live of documents in the collection before they are removed
- D) The maximum duration of a multi-document transaction before it aborts

**Answer:** B
**Explanation:** The oplog is a capped collection. Size it for peak write rates and expected maintenance downtime.

### Q18 | MongoDB | Connections
A serverless function creates `new MongoClient()` on every invocation. What is the likely problem?

- A) There is no problem, because the driver shares a single global pool by default
- B) Connection storms: each client opens its own pool, so reuse one client
- C) Queries become slow only after one hour, when idle sockets are closed
- D) The driver blocks on DNS and cannot make parallel connections

**Answer:** B
**Explanation:** Cache the connected client in module scope (or a global). In long-running servers create a single client at startup.

### Q19 | MongoDB | Soft delete
You implement soft delete with `deletedAt`. What must you remember?

- A) Nothing special, because deleted documents are hidden by MongoDB automatically
- B) Soft delete is atomic across collections, so related documents hide at once
- C) `deletedAt` cannot be indexed, so soft delete is only suitable for small collections
- D) Filter `deletedAt: null` everywhere, handle unique indexes, and remember legal erasure

**Answer:** D
**Explanation:** Forgetting the filter leaks deleted data. GDPR-style erasure requires actually removing or anonymising data.

### Q20 | MongoDB | Aggregation memory
An aggregation fails with "Exceeded memory limit for $group". What is the right response?

- A) Increase the document size limit so the group fits in RAM
- B) Reduce data early with `$match` and `$project`, add indexes, or allow disk use
- C) Disable the pipeline cache so each stage gets a fresh memory budget
- D) Put `$out` as the first stage so intermediate results are written to disk

**Answer:** B
**Explanation:** Blocking stages such as `$group` and `$sort` have a RAM limit per stage (100 MB historically). Spilling to disk is slower, so shrink the input first.

### Q21 | Express | Idempotency
Where should idempotency-key handling live in an Express payment API?

- A) In the React client only, by disabling the button after the first click
- B) In a module-level variable that remembers recent keys inside one process
- C) In the `package.json` scripts, with a flag that blocks duplicate requests
- D) In middleware: look up the key, return the stored response, else process once

**Answer:** D
**Explanation:** Persist keys with an expiry in a shared store (Redis/DB). In-memory state breaks with multiple instances.

### Q22 | Express | Rate limiting
Why can a fixed-window rate limiter let through up to 2× the limit?

- A) Clock skew between servers always doubles the configured limit
- B) A client can burst at the end of one window and again at the start of the next
- C) The window start is randomised for each client, which hides the true limit
- D) Fixed windows do not count requests that are retried by the client

**Answer:** B
**Explanation:** Sliding-window or token-bucket algorithms smooth this out. Use a shared store (Redis) when running multiple instances.

### Q23 | Express | Status codes
A client exceeds its quota. Which response is best?

- A) 429 Too Many Requests with a `Retry-After` header
- B) 403 Forbidden without any hint about when to retry
- C) 500 Internal Server Error, since the quota is a server-side limit
- D) 200 OK with an error message in the JSON body

**Answer:** A
**Explanation:** 429 is the standard signal. `Retry-After` helps well-behaved clients back off.

### Q24 | Express | Logging
Which is the correct logging practice for a payments API?

- A) Log complete request bodies for debugging, and restrict who can read the logs
- B) Log only to the browser console, so nothing sensitive reaches the server
- C) Log structured events with a request id, and redact secrets such as card numbers
- D) Disable logging in production, since every log line is a compliance risk

**Answer:** C
**Explanation:** PCI DSS forbids storing sensitive authentication data (e.g. CVV) after authorisation and requires card numbers to be masked or protected.

### Q25 | Express | NoSQL injection
A login uses `User.findOne({ email: req.body.email, password: req.body.password })`. An attacker sends `{"email":"a@b.com","password":{"$gt":""}}`. What happens?

- A) The query is rejected, because MongoDB refuses operators inside user-supplied values
- B) `$gt` turns the password check into a condition that any non-empty password satisfies
- C) A syntax error is raised, so the login attempt fails with a 500 response
- D) The server returns 404, since no document matches an object-valued field

**Answer:** B
**Explanation:** Never put raw request objects into queries. Coerce to strings, validate with a schema, and compare password hashes with bcrypt/argon2.

### Q26 | Express | Webhook signatures
To verify a payment provider's HMAC webhook signature in Express, what do you need?

- A) The parsed JSON body, converted back to a string with `JSON.stringify`
- B) The raw request body bytes, a constant-time comparison, and a timestamp check
- C) Only the source IP address of the request, compared against an allowlist
- D) Nothing extra, because HTTPS already guarantees who sent the webhook

**Answer:** B
**Explanation:** Re-serialising JSON changes the bytes and breaks the signature. Verify before parsing.

### Q27 | Express | Webhook processing
How should a webhook endpoint behave?

- A) Do all processing before replying, even if that takes up to two minutes
- B) Verify the signature, store the event id, reply 2xx fast, then process later
- C) Reply with 500 on purpose, so the provider keeps retrying until you are ready
- D) Ignore duplicate events silently, without storing event ids anywhere

**Answer:** B
**Explanation:** Providers retry on timeouts, so you will see duplicates and out-of-order events. Handlers must be idempotent.

### Q28 | Express | Sessions
What should happen to a session identifier when a user logs in?

- A) Keep the pre-login identifier, so the user keeps their anonymous cart
- B) Put the identifier in the URL, so it survives a cookie being cleared
- C) Regenerate it with `req.session.regenerate`, to prevent session fixation
- D) Make the identifier predictable, so support staff can look it up easily

**Answer:** C
**Explanation:** If an attacker planted the pre-login id, keeping it would let them share the authenticated session.

### Q29 | Express | Pagination
For a transaction history with millions of rows and constantly inserted records, which pagination is more stable?

- A) Offset pagination, such as `?page=500&limit=20`, which stays stable under inserts
- B) Cursor (keyset) pagination, such as `?after=<lastId>`
- C) Random page numbers, which spread the load evenly across the collection
- D) Loading every row once and paginating the full list in the browser

**Answer:** B
**Explanation:** Offset pagination skips or repeats rows when data changes, and gets slower with depth.

### Q30 | Express | Content types
A client posts XML to a route that only accepts JSON. What status is most appropriate?

- A) 404 Not Found
- B) 415 Unsupported Media Type
- C) 406 Not Acceptable
- D) 301 Moved Permanently

**Answer:** B
**Explanation:** 415 states the payload format is not supported. 406 is for an unacceptable `Accept` header on the response side.

### Q31 | Express | Long-running work
A report takes 2 minutes to generate. Which API design is best?

- A) Keep the HTTP request open for the full two minutes and stream a progress bar
- B) Return 200 with an empty body, then send the report by email without a status endpoint
- C) Return `202 Accepted` with a job id, process it in a worker, and let the client poll
- D) Raise the server timeout to one hour so the request cannot expire

**Answer:** C
**Explanation:** Long requests tie up connections and hit proxy timeouts (e.g. 60 s on many load balancers).

### Q32 | Express | Optimistic locking over HTTP
How do `ETag` and `If-Match` help prevent lost updates?

- A) They compress the response body so repeated requests are smaller
- B) They authenticate the user by signing the request with a shared secret
- C) The client sends its ETag in `If-Match`; a changed resource gives `412`
- D) They limit how many requests a client can make in a time window

**Answer:** C
**Explanation:** It is optimistic concurrency exposed at the HTTP layer. `428 Precondition Required` can enforce that clients use it.

### Q33 | Express | Account enumeration
Which password-reset response avoids leaking whether an email is registered?

- A) "No account found with this email", so the user can fix a typo quickly
- B) "If that email exists, we sent a reset link", shown in every case with similar timing
- C) A 404 status for unknown emails and 200 for known ones, to help support staff
- D) Showing the account creation date, so the real owner can recognise the account

**Answer:** B
**Explanation:** Also rate-limit, and make timing similar (e.g. don't skip the slow work only for unknown users).

### Q34 | Express | Password hashing
What is a known limitation of bcrypt?

- A) It does not use a salt, so equal passwords produce equal hashes
- B) It only uses the first 72 bytes of the password
- C) Its cost cannot be tuned, so it cannot slow down as hardware improves
- D) It only supports ASCII characters in the password

**Answer:** B
**Explanation:** Long passphrases are truncated. Argon2id is the current OWASP first choice; bcrypt is acceptable with a sufficient cost factor and input limits.

### Q35 | Express | OAuth 2
Which OAuth 2 flow should a browser SPA use for user login?

- A) Authorization Code flow with PKCE
- B) Implicit flow
- C) Resource Owner Password Credentials
- D) Client Credentials

**Answer:** A
**Explanation:** The implicit flow is discouraged and password grant is removed in OAuth 2.1. Client Credentials is for machine-to-machine.

### Q36 | Express | Fingerprinting
What does `app.disable('x-powered-by')` (or Helmet) achieve?

- A) It makes responses faster, because one fewer header is serialised
- B) It hides the Express header, making fingerprinting slightly harder
- C) It disables CORS, so no browser can call the API from another site
- D) It turns on HTTPS-only mode for every route in the application

**Answer:** B
**Explanation:** It is minor hardening, not a substitute for patching or real access control.

### Q37 | Express | Health checks
What is the difference between liveness and readiness probes?

- A) Liveness asks if the process is alive; readiness asks if it can serve traffic now
- B) They are the same check, only named differently by different platforms
- C) Readiness restarts the pod, and liveness only removes it from the load balancer
- D) Liveness checks the database connection, and readiness checks only the process

**Answer:** A
**Explanation:** Putting heavy DB checks in liveness can cause restart loops when the database has an outage.

### Q38 | Express | res.locals
What is `res.locals` used for?

- A) Request-scoped data shared between middleware and views, cleared per request
- B) Storing cookies that the browser keeps between visits to the site
- C) Global configuration that stays available for the whole life of the app
- D) The list of allowed origins that CORS middleware reads on every request

**Answer:** A
**Explanation:** Unlike `app.locals`, which lives for the app's lifetime, `res.locals` is per request.

### Q39 | Express | Versioning
You must remove a field that mobile apps in the wild still read. What is the safest approach?

- A) Remove the field now, because apps update automatically from the store
- B) Rename the field silently, so old clients keep working by chance
- C) Add a `/v2`, keep `/v1` stable during a deprecation window, and track usage
- D) Return a 500 to old clients, so users are forced to update at once

**Answer:** C
**Explanation:** You do not control when clients upgrade. Adding optional fields is backwards compatible; removing or retyping is breaking.

### Q40 | Express | Security headers
What does `Strict-Transport-Security` (HSTS) tell the browser?

- A) To block inline scripts from running on any page of the domain
- B) To cache the page in the browser for the configured number of seconds
- C) Use only HTTPS for the domain for `max-age`, even if the user types `http://`
- D) To allow other sites to embed the page inside an iframe

**Answer:** C
**Explanation:** It prevents SSL-stripping downgrade attacks after the first secure visit. Preload lists protect the first visit too.

### Q41 | React | Layout effects
You need to measure an element's height and position a tooltip before the browser paints, avoiding flicker. Which hook?

- A) `useEffect`
- B) `useId`
- C) `useMemo`
- D) `useLayoutEffect`

**Answer:** D
**Explanation:** `useLayoutEffect` runs synchronously after DOM mutation and before paint. Overusing it blocks painting.

### Q42 | React | Memoization
Why does `React.memo(Child)` not help here?

```jsx
<Child>
  <span>Hi</span>
</Child>
```

- A) `memo` ignores the `children` prop, so changes to it never trigger a render
- B) `memo` only works for components that call hooks internally
- C) A `span` is not an allowed child for components wrapped with `memo`
- D) `children` is a new element on every render, so the shallow comparison fails

**Answer:** D
**Explanation:** JSX creates new objects each render. Hoist static elements, or restructure so the parent that re-renders is not above the memoised child.

### Q43 | React | State placement
Typing in a search box re-renders an expensive table. What is the cleanest fix?

- A) Move the input state into the input component so the table is unaffected
- B) Wrap every component in `useCallback` so none of them can ever re-render
- C) Call `forceUpdate` on the table after each keystroke to refresh it quickly
- D) Debounce the browser's keyboard events with a global event listener

**Answer:** A
**Explanation:** Re-rendering happens in the component that owns the state and all its children. Colocation avoids work without memoisation.

### Q44 | React | Portals
A modal is rendered with `createPortal` into `document.body`. A click inside the modal:

- A) It does not bubble to React ancestors, because the DOM node is in `document.body`
- B) It bubbles only to `document.body`, and never reaches React ancestors
- C) It bubbles through the React tree to the parent's `onClick`, not the DOM tree
- D) It is blocked by the portal until `stopPropagation` is called on it

**Answer:** C
**Explanation:** Synthetic events follow the component hierarchy. Call `stopPropagation` if that is unwanted.

### Q45 | React | Reconciliation
What happens to the input's text when `isAdmin` toggles?

```jsx
return isAdmin
  ? <div><input /></div>
  : <section><input /></section>;
```

- A) It is preserved, because React matches the two inputs by position
- B) React throws an error, because the root element type cannot change
- C) It becomes read-only until the next render of the component
- D) It is lost: the root type changed, so React remounts the subtree

**Answer:** D
**Explanation:** Same type at the same position preserves state. A different type destroys it.

### Q46 | React | Lazy initial state
What is the difference?

```jsx
useState(computeInitial());
useState(() => computeInitial());
```

- A) The first runs `computeInitial` on every render; the second only on mount
- B) There is no difference, because React ignores the argument after mount
- C) The second form never runs, since React only accepts plain values
- D) The first form is asynchronous, and the second form is synchronous

**Answer:** A
**Explanation:** Use the function form for expensive initialisation (parsing storage, building big arrays).

### Q47 | React | useId
What is `useId` for?

- A) Stable ids for accessibility attributes that match on server and client
- B) Generating database ids that are unique across all browser sessions
- C) Creating keys for list items so React can track them across renders
- D) Producing random numbers that stay stable between two re-renders

**Answer:** A
**Explanation:** `Math.random()` ids cause hydration mismatches. Do not use `useId` for list keys.

### Q48 | React | Redux Toolkit
Why can you write `state.balance += action.payload` inside a `createSlice` reducer?

- A) Redux allows direct mutation of state inside reducers, as long as they return it
- B) Reducers run on the server, where mutation does not affect the client
- C) State in RTK is a global variable, so mutation is visible to everything
- D) RTK uses Immer: you mutate a draft and Immer produces a new immutable state

**Answer:** D
**Explanation:** The result must still be pure. You must either mutate the draft or return a new value, not both.

### Q49 | React | Accessibility
Which is required for an accessible modal dialog?

- A) A `div` with an `onClick` handler and a very high `z-index`
- B) Dialog role, focus moved in and trapped, Esc to close, focus returned
- C) A fade-in animation and a dark overlay that covers the rest of the page
- D) A visible close icon that is reachable only with a mouse click

**Answer:** B
**Explanation:** The native `<dialog>` element handles much of this. Banks often need WCAG 2.1 AA compliance.

### Q50 | React | Server state
Why use React Query / SWR for API data instead of storing responses in Redux?

- A) They are smaller than Redux, so bundle size is the only real difference
- B) Server state is shared and stale; they add caching, refetching and invalidation
- C) They replace the backend by generating responses on the client
- D) They avoid HTTP by reading the database directly from the browser

**Answer:** B
**Explanation:** Keep client/UI state in `useState`/context/Redux, and server state in a query cache.

### Q51 | React | XSS
When is `dangerouslySetInnerHTML` acceptable?

- A) Always for rich text, because React escapes everything else already
- B) Never, because the prop exists only for legacy class components
- C) Only with trusted or sanitised HTML, since it bypasses React's escaping
- D) Only on mobile devices, where script injection is not possible

**Answer:** C
**Explanation:** React escapes text by default. Injecting unsanitised HTML from users or APIs opens stored XSS. Also validate `href` values (`javascript:` URLs).

### Q52 | React | Route protection
A React Router `<ProtectedRoute>` redirects unauthenticated users. Is this sufficient security?

- A) Yes, because users cannot open a route that the router has hidden
- B) Yes, provided the token is stored in `localStorage`
- C) No: it is only UX, and the server must enforce access on every request
- D) Yes, provided the route is not linked anywhere in the interface

**Answer:** C
**Explanation:** Never rely on client-side checks for authorisation.

### Q53 | React | Next.js · Middleware
What is Next.js `middleware.ts` best suited for?

- A) Heavy database transactions that need native Node.js drivers
- B) Rendering React components to HTML for each incoming request
- C) Bundling the CSS and JavaScript files before the build starts
- D) Light request-time logic such as redirects, rewrites and headers

**Answer:** D
**Explanation:** Do not rely on middleware alone for authorisation. Re-check in the data layer (Server Components, actions, route handlers).

### Q54 | React | Next.js · Route Handlers
How do you create a REST endpoint in the App Router?

- A) Only files inside the legacy `pages/api` directory can define endpoints
- B) Create `api.config.json` and list each path with its handler
- C) Export `GET`, `POST` and other verb functions from `app/api/orders/route.ts`
- D) Define a class named `Controller` and export it from the page file

**Answer:** C
**Explanation:** Route Handlers use the Web `Request`/`Response` APIs. A `page.tsx` and a `route.ts` cannot live in the same segment.

### Q55 | React | Next.js · Streaming
A dashboard page has a slow "recent activity" widget. How do you avoid blocking the rest of the page?

- A) Wrap the slow component in `<Suspense>` so the shell streams first
- B) Wait for all of the page's data before sending any HTML to the browser
- C) Fetch everything on the client, after the page has loaded
- D) Disable server-side rendering for the whole dashboard route

**Answer:** A
**Explanation:** Streaming sends HTML in chunks and improves time-to-first-byte and perceived performance.

### Q56 | React | Next.js · Static params
What does `generateStaticParams` do?

- A) It creates the API keys used by the route during the build
- B) It sets the cookies that a dynamic route will read at request time
- C) It tells Next.js which dynamic params to pre-render at build time
- D) It defines CSS variables for every page in that route segment

**Answer:** C
**Explanation:** Unlisted params can be rendered on demand and cached, unless `dynamicParams = false`.

### Q57 | React | Next.js · Images
Which is NOT a benefit of `next/image`?

- A) It encrypts the image content
- B) Lazy loading by default
- C) Reserving space to prevent layout shift when width/height are set
- D) Automatic resizing and modern formats

**Answer:** A
**Explanation:** Image optimisation is about performance, not security. Remote hosts must be allowed in config (`remotePatterns`).

### Q58 | React | Next.js · Env variables
A secret `API_KEY` is read in a Client Component via `process.env.API_KEY`. What is the result?

- A) It works securely, because Next.js encrypts the value inside the client bundle
- B) It is `undefined` in the browser; only `NEXT_PUBLIC_` variables are inlined
- C) It works, but only after the first request, when the server injects it
- D) Next.js throws a runtime error telling you to move the variable

**Answer:** B
**Explanation:** Keep secrets in Server Components, actions or route handlers. Anything with `NEXT_PUBLIC_` is visible to anyone.

### Q59 | React | Next.js · Async request APIs
In Next.js 15, how do you read cookies in a Server Component?

- A) `await cookies()`, because request APIs are now asynchronous
- B) `cookies()` called synchronously, as in earlier versions
- C) Read `window.cookies` directly inside the Server Component
- D) Read `document.cookie`, which is available during server rendering

**Answer:** A
**Explanation:** The async API lets Next.js know when it can prepare static parts earlier. A codemod helps migrate.

### Q60 | React | Next.js · Serialisation
What can you pass as props from a Server Component to a Client Component?

- A) Any JavaScript value, including class instances and plain functions
- B) Serialisable values and Server Actions, not arbitrary functions or classes
- C) Only strings, because props are sent as text over the wire
- D) Only numbers and booleans, since objects cannot cross the boundary

**Answer:** B
**Explanation:** Props cross the server-client boundary through the RSC payload. Don't pass database model instances or secrets.

### Q61 | Node.js | AsyncLocalStorage
What problem does `AsyncLocalStorage` solve in a Node API?

- A) Persisting files on disk so that they survive a process restart
- B) Carrying request-scoped context, like a request id, through async calls
- C) Storing data in the browser, using the same API as `localStorage`
- D) Sharing memory between worker threads without copying messages

**Answer:** B
**Explanation:** It is the Node equivalent of thread-local storage for async chains. Useful for structured logging and tracing.

### Q62 | Node.js | Concurrency
Node is single-threaded, yet this code has a race condition. Why?

```js
const bal = await getBalance(id);
if (bal >= amt) await setBalance(id, bal - amt);
```

- A) Node is multi-threaded, so two threads can run this function at once
- B) `await` yields to the event loop, so another request can read the balance
- C) `await` is synchronous, so no other code runs until it completes
- D) `getBalance` is cached, so both requests always see the same value

**Answer:** B
**Explanation:** Single thread does not mean atomic across async gaps. Do the check-and-update atomically in the database.

### Q63 | Node.js | Queues
A job queue gives **at-least-once** delivery. What must consumers be?

- A) Fast, because retries mean every job is processed twice at most
- B) Idempotent, since a job may be delivered and processed more than once
- C) Synchronous, so that a job finishes before the next one starts
- D) Stateful, so each consumer remembers which jobs it has seen forever

**Answer:** B
**Explanation:** Exactly-once is practically achieved as at-least-once plus idempotent processing (dedupe by job id).

### Q64 | Node.js | Distributed locks
Which Redis command pattern is the basis of a simple lock?

- A) `GET key`, followed by `SET key` if the value is missing
- B) `DEL key` from any client, so a stuck lock is always removed
- C) `SET key token NX PX 30000`, released only if the stored token matches
- D) `INCR key`, treating any value above zero as the lock being held

**Answer:** C
**Explanation:** NX makes acquisition atomic, PX adds an expiry so crashes don't deadlock, and the token ensures you only delete your own lock. Locks still don't give strong correctness under long pauses, so use fencing tokens for critical sections.

### Q65 | Node.js | Randomness
Which is appropriate for generating a password-reset token?

- A) `Math.random().toString(36)` repeated several times and joined together
- B) `Date.now()` combined with the user id and hashed once
- C) `crypto.randomBytes(32).toString('hex')`
- D) The user id, since it is already unique across the system

**Answer:** C
**Explanation:** `Math.random` is not cryptographically secure. Store only a hash of the token, and give it a short expiry and single use.

### Q66 | Node.js | timingSafeEqual
What happens with `crypto.timingSafeEqual(a, b)` when the buffers have different lengths?

- A) It returns false when the lengths differ, with no exception
- B) It pads the shorter buffer with zeros and then compares them
- C) It throws a `RangeError`, so compare lengths or hash both values first
- D) It returns true when the shorter buffer is a prefix of the longer

**Answer:** C
**Explanation:** Constant-time comparison avoids leaking where the first mismatch occurs. Hash both values to equal length first when they might differ.

### Q67 | Node.js | Number precision
What is printed?

```js
console.log(9007199254740993);
```

- A) 9007199254740993
- B) 9007199254740994
- C) 9007199254740992
- D) NaN

**Answer:** C
**Explanation:** Beyond `Number.MAX_SAFE_INTEGER` (2^53 − 1) integers lose precision. Use `BigInt` (`9007199254740993n`) or strings for large ids.

### Q68 | Node.js | Rounding
What does this print?

```js
console.log(Math.round(1.005 * 100) / 100);
```

- A) 1.01
- B) NaN
- C) 1.005
- D) 1

**Answer:** D
**Explanation:** `1.005 * 100` is `100.49999999999999` in floating point, so it rounds to 100. Do money math in integer minor units or with a decimal library.

### Q69 | Node.js | Intl
What does this output (approximately)?

```js
new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(1234567.891);
```

- A) ₹1,234,567.89
- B) ₹1.234.567,89
- C) 1234567.891 INR
- D) ₹12,34,567.89

**Answer:** D
**Explanation:** The `en-IN` locale uses lakh/crore grouping. Never hand-build currency formatting; use `Intl`.

### Q70 | Node.js | Dates
In a machine with a UTC−5 timezone, `new Date('2024-03-10').getDate()` returns:

- A) 10
- B) 9
- C) 11
- D) Invalid

**Answer:** B
**Explanation:** A date-only ISO string is parsed as UTC midnight, which is the evening of the 9th locally. Store timestamps in UTC and format at the edge.

### Q71 | Node.js | Resilience
Why add **jitter** to exponential backoff?

- A) To make every retry slower, so the failing service gets more time
- B) To get around rate limits by making requests look different
- C) To reduce memory use by limiting the number of pending retries
- D) To spread retries so clients do not all hit a recovering service at once

**Answer:** D
**Explanation:** Combine with a retry cap, and retry only idempotent operations or those with idempotency keys.

### Q72 | Node.js | Circuit breaker
What does a circuit breaker do?

- A) It stops the whole process after the first error, then restarts it
- B) After repeated failures it opens and fails fast, then half-opens to probe
- C) It encrypts traffic between services, so a failing call cannot leak data
- D) It balances load across instances using the number of recent errors

**Answer:** B
**Explanation:** Prevents cascading failures when a downstream (e.g. a payment gateway) is slow.

### Q73 | Node.js | EventEmitter
What happens when an `EventEmitter` emits `'error'` with no listener?

- A) The event is ignored, since an emitter without listeners does nothing
- B) It is only logged to stderr, and the emitter keeps working
- C) It is retried automatically up to three times before being dropped
- D) The error is thrown, and the process crashes if nothing catches it

**Answer:** D
**Explanation:** Always attach an `'error'` handler to streams, sockets and custom emitters.

### Q74 | Node.js | Logging
Why use a structured logger like `pino` rather than `console.log` strings?

- A) JSON logs can be searched and aggregated, and pino is built for speed
- B) They look nicer in a terminal because of colours and formatting
- C) The console is removed in production builds of Node.js
- D) They encrypt the log lines before writing them to disk

**Answer:** A
**Explanation:** Add redaction paths for secrets, correlation ids from `AsyncLocalStorage`, and ship logs to a central store.

### Q75 | Node.js | Secrets
Where should a production database password live?

- A) In the Git repository, in an encrypted file next to the source code
- B) In `package.json`, so it is installed together with the dependencies
- C) In a secrets manager, injected at runtime and never baked into the image
- D) In the front-end bundle, since the browser needs it to call the API

**Answer:** C
**Explanation:** Rotate secrets, scope them by least privilege, and keep `.env` out of images and version control.

### Q76 | Node.js | Prototype pollution
What is the risk of merging untrusted JSON into an object with a naive deep merge?

- A) A payload like `{"__proto__":{"admin":true}}` can pollute `Object.prototype`
- B) The merge becomes slow, but there is no security impact
- C) Only memory leaks occur, because prototypes are garbage-collected
- D) There is no risk in JavaScript, since JSON.parse blocks special keys

**Answer:** A
**Explanation:** Use maintained libraries, block `__proto__`/`constructor`/`prototype` keys, create maps with `Object.create(null)`, or use `Map`.

### Q77 | Node.js | ReDoS
Why can `/^(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')` hang a server?

- A) The string is too long for the regex engine to hold in memory
- B) `test` allocates a new match array on every call, exhausting the heap
- C) `test` is asynchronous, so the callback never fires for non-matches
- D) Catastrophic backtracking: nested quantifiers take exponential time

**Answer:** D
**Explanation:** Avoid nested quantifiers on user input, limit input length, use linear-time engines (RE2), or validate with parsers.

### Q78 | Node.js | TypeScript
What is the benefit of an exhaustive `never` check in a `switch` over a discriminated union?

- A) The generated JavaScript runs faster because the branch is removed
- B) It enables `any` inside the default branch of the switch
- C) The union type is removed, leaving only the last member
- D) The compiler errors when a new union member is left unhandled

**Answer:** D
**Explanation:** `default: const _x: never = value; throw new Error(...)` keeps handlers in sync with the type.

### Q79 | Node.js | TypeScript
What is the type of `R`?

```ts
async function load() { return { id: 1, name: 'x' }; }
type R = Awaited<ReturnType<typeof load>>;
```

- A) `{ id: number; name: string }`
- B) `Promise<{ id: number; name: string }>`
- C) `unknown`
- D) `() => Promise<...>`

**Answer:** A
**Explanation:** `ReturnType` yields the `Promise<...>`, and `Awaited` unwraps it. A handy way to derive types from functions.

### Q80 | Node.js | Testing
What is the main benefit of `mongodb-memory-server` in integration tests?

- A) It makes MongoDB itself faster when it runs in production
- B) It mocks every driver call, so no database engine ever starts
- C) It replaces Mongoose, so no schema or model code is required
- D) Tests run against a real MongoDB engine without a shared database

**Answer:** D
**Explanation:** Mocks can hide real query behaviour. Transactions need a replica-set mode, which the library supports.
