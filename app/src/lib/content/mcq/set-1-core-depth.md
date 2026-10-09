---
id: set-1
title: Set 1 — Core Depth
description: Indexes, aggregation, middleware, hooks, Next.js basics and event-loop internals. Mid-level.
---

### Q1 | MongoDB | Compound indexes
A compound index `{ a: 1, b: 1, c: 1 }` exists. Which query can **not** use it efficiently through an index prefix?

- A) `find({ a: 1 })`
- B) `find({ b: 2, c: 3 })`
- C) `find({ a: 1, b: 2 })`
- D) `find({ a: 1, b: 2, c: 3 })`

**Answer:** B
**Explanation:** A compound index can serve queries on a leftmost prefix (`a`, `a+b`, `a+b+c`). A query that skips `a` cannot seek into the index, so it falls back to a scan.

### Q2 | MongoDB | Multikey indexes
An index `{ a: 1, b: 1 }` exists. What happens when you insert `{ a: [1, 2], b: [3, 4] }`?

- A) It succeeds, and the index stores all four combinations of the array values as separate keys
- B) It succeeds after MongoDB flattens both arrays into a single combined array first
- C) It succeeds, but only the first array field is indexed and the second is ignored
- D) The insert fails, because two array fields cannot be indexed in one compound index

**Answer:** D
**Explanation:** At most one indexed field per document may be an array in a compound multikey index. Otherwise the cartesian product of entries would explode.

### Q3 | MongoDB | TTL indexes
You create a TTL index with `expireAfterSeconds: 60` on `createdAt`. A document is now 61 seconds old. What is true?

- A) It is deleted at exactly 60 seconds, since the TTL monitor evaluates every document on each read
- B) It is moved to a hidden archive collection and stays queryable for another 60 seconds
- C) TTL deletion runs synchronously inside the next write, so the document is already gone
- D) It may still be returned, because the TTL background task runs about once a minute and is not exact

**Answer:** D
**Explanation:** The TTL monitor runs roughly every 60 seconds, so expiry is approximate. The field must be a BSON date (or an array of dates), so C is false. Always filter expired data in queries if exactness matters.

### Q4 | MongoDB | Partial indexes
You have `createIndex({ email: 1 }, { partialFilterExpression: { status: 'active' } })`. Which query can use this index?

- A) `find({ email: 'a@b.com', status: 'active' })`
- B) `find({ email: 'a@b.com' })`
- C) `find({ status: 'inactive', email: 'a@b.com' })`
- D) Any query that sorts by `email`

**Answer:** A
**Explanation:** The planner only uses a partial index if the query predicate guarantees the filter expression. Query A could match inactive users that are not in the index.

### Q5 | MongoDB | Covered queries
Which condition is **required** for a query to be fully covered by an index?

- A) The collection must be capped and the query must use `$text` so documents never need fetching
- B) Every queried and returned field is in the index, and `_id` is excluded unless indexed
- C) The index must be unique and every queried field must be an array so it becomes multikey
- D) The query must use `hint()` together with `allowDiskUse` so the planner skips the FETCH stage

**Answer:** B
**Explanation:** A covered query is answered from the index alone with no document fetch (`totalDocsExamined: 0`). Multikey indexes on array fields cannot cover queries on those array fields.

### Q6 | MongoDB | Write concern
A bank records a payment with `w: 1`. The primary acknowledges, then crashes before replicating, and a secondary is elected. What can happen?

- A) The acknowledged write can be rolled back
- B) Nothing, since `w: 1` waits until every voting member has the write
- C) The write is replicated during the election automatically, so it is always preserved
- D) The new primary rejects all reads until the old primary rejoins the set

**Answer:** A
**Explanation:** `w: 1` only waits for the primary. Use `w: 'majority'` (with journaling) for data that must survive failover.

### Q7 | MongoDB | Read concern
What does `readConcern: 'majority'` guarantee?

- A) You read the newest write on the primary, even if it is not yet replicated and could be rolled back
- B) You read data acknowledged by a majority of replica set members, which will not be rolled back
- C) You read from every secondary and merge the answers, so replication lag is hidden completely
- D) You read from the geographically nearest node only, with no durability guarantee at all

**Answer:** B
**Explanation:** `local` may return data that is later rolled back. `majority` returns only majority-committed data, possibly slightly stale.

### Q8 | MongoDB | Aggregation
Given `{ _id: 1, tags: [] }`, what does `{ $unwind: '$tags' }` do to it?

- A) It outputs the document once with `tags` set to `null`, so no data is lost from the pipeline
- B) It throws an error, because `$unwind` cannot be applied to an empty array in any mode
- C) Drops the document, unless `preserveNullAndEmptyArrays: true` is set
- D) It outputs the document once with `tags: []` unchanged, so later stages still receive it

**Answer:** C
**Explanation:** `$unwind` emits one output document per array element. Zero elements means zero output documents unless you preserve empty arrays.

### Q9 | MongoDB | Aggregation optimisation
Why should `$match` be placed as early as possible in a pipeline?

- A) An initial `$match` can use indexes and shrinks the data flowing into later stages
- B) It is required by the syntax, because `$group` cannot appear before a `$match` stage
- C) `$match` is only allowed as the first stage, otherwise MongoDB raises an error
- D) It converts the whole aggregation into a plain `find()`, which always runs faster

**Answer:** A
**Explanation:** The optimiser can move some `$match` stages earlier automatically, but write them early anyway. Only a leading `$match`/`$sort` can use an index.

### Q10 | MongoDB | $lookup
A `$lookup` from `orders` to `customers` is slow on large data. What is the first thing to check?

- A) That `customers.foreignField` is indexed
- B) Add more fields to `orders` so MongoDB can resolve the join from the local documents alone
- C) Make `orders` a capped collection, which lets `$lookup` read it from memory only
- D) Replace the `$lookup` with `$unwind` on `customerId`, which performs the same join

**Answer:** A
**Explanation:** For each input document `$lookup` queries the foreign collection by `foreignField`. Without an index on it, each lookup is a collection scan.

### Q11 | MongoDB | Money
What is the safest way to store currency amounts in MongoDB?

- A) `Double`, e.g. `19.99`
- B) A `Date`
- C) A string such as `"19.99"` and parse it on read
- D) `Decimal128`, or integer minor units (cents)

**Answer:** D
**Explanation:** Binary floating point cannot represent values like 0.1 exactly (`0.1 + 0.2 !== 0.3`). Decimal128 or integer cents avoid rounding drift.

### Q12 | MongoDB | Atomic updates
Two requests increment a counter at the same time. Which is correct and race-free?

- A) Read the doc, add 1 in code, then `save()`
- B) `find()` then `updateOne({ count: oldValue + 1 })`
- C) `updateOne({ _id }, { $inc: { count: 1 } })`
- D) Lock the collection from the app

**Answer:** C
**Explanation:** Single-document updates are atomic. Read-modify-write in application code loses updates when two requests interleave.

### Q13 | MongoDB | Optimistic concurrency
How do you implement optimistic locking on an account document?

- A) Keep a cursor open on the account document so no other client can modify it meanwhile
- B) Filter on `{ _id, version }`, `$inc` the version, and retry when `matchedCount` is 0
- C) Use a `$where` clause that sleeps until no other writer is active on that document
- D) Set `w: 0` so concurrent writers are rejected before they can overwrite the document

**Answer:** B
**Explanation:** If another writer changed the document first, the version no longer matches and nothing is updated. Mongoose does this with `versionKey` / `optimisticConcurrency`.

### Q14 | MongoDB | Transactions
Which statement about multi-document transactions is correct?

- A) They work on a standalone mongod and are usually faster than single-document writes
- B) They require sharding, and there is no timeout, so they can stay open indefinitely
- C) They need a replica set, and they lock the entire database for the whole transaction
- D) They need a replica set or sharded cluster and abort after 60 seconds by default

**Answer:** D
**Explanation:** `transactionLifetimeLimitSeconds` defaults to 60. Prefer designing documents so that one write is enough.

### Q15 | MongoDB | Mongoose validation
In Mongoose, `Model.findOneAndUpdate(filter, { age: -5 })` with `min: 0` on `age` in the schema:

- A) It is rejected with a ValidationError, because schema minimums are always enforced on updates
- B) It throws a CastError, since negative numbers cannot be cast to the schema type
- C) It succeeds only after triggering the `pre('save')` hooks and re-running every validator
- D) Succeeds, since update validators are off by default; pass `{ runValidators: true }`

**Answer:** D
**Explanation:** Validators run on `save()`/`create()`. For update queries you must opt in with `runValidators`.

### Q16 | MongoDB | Mongoose middleware
You added a `schema.pre('save', hashPassword)` hook. A password change is done via `User.updateOne({_id}, { password: 'new' })`. Result?

- A) The hook runs, because Mongoose converts every update call into a document save internally
- B) Mongoose throws, since `updateOne` is not allowed on schemas that define a `pre('save')` hook
- C) The hook runs twice, once for the query and once when the document is written
- D) The hook does not run, so the password is stored unhashed

**Answer:** D
**Explanation:** `save` (document) middleware does not fire for query helpers like `updateOne`. Load the document and call `save()`, or add query middleware.

### Q17 | MongoDB | Pagination
Why is `skip(100000).limit(20)` a problem on a big collection?

- A) The server still walks past the skipped entries, so cost grows with the offset
- B) `skip` is deprecated and will be removed, so large offsets log a warning in new drivers
- C) It returns duplicate documents whenever the offset is above 10,000 entries
- D) It disables index usage for the whole query, forcing a full collection scan on each page

**Answer:** A
**Explanation:** Use keyset pagination: `find({ _id: { $gt: lastId } }).sort({ _id: 1 }).limit(20)`.

### Q18 | MongoDB | Schema patterns
A product has thousands of reviews, but the page shows the latest 10. Which pattern fits?

- A) Embed all reviews in the product document, since one big document is always the fastest read
- B) Create one collection per review so every review can have its own index
- C) Subset pattern: embed the latest 10 reviews, keep every review in a separate collection
- D) Store the reviews as one large serialised string field and parse it on the client

**Answer:** C
**Explanation:** Keeps the hot read small, avoids unbounded document growth (16 MB limit), and still allows full history queries.

### Q19 | MongoDB | explain()
A winning plan shows `IXSCAN` → `FETCH` → `SORT`. What does the `SORT` stage tell you?

- A) The sort is done in memory, because the index does not provide the order
- B) The sort was satisfied by the index order, so no extra sorting work was needed
- C) The query is fully covered, so documents were never fetched from the collection
- D) A text index was used to rank the results before the sort stage

**Answer:** A
**Explanation:** If the index order matches, there is no SORT stage. Extend the index so the sort field follows the equality fields (ESR rule).

### Q20 | MongoDB | Unique indexes
A unique index on `{ ssn: 1 }` rejects the second document that has **no** `ssn` field. Why, and what is the fix?

- A) Missing fields index as `null` and collide; use a partial unique index
- B) It is a MongoDB bug that is fixed by upgrading to the latest server version
- C) Unique indexes cannot be created on string fields, so integers must be used
- D) Setting `sparse: false` makes missing fields ignored and removes the duplicate error

**Answer:** A
**Explanation:** `{ unique: true, partialFilterExpression: { ssn: { $exists: true } } }` is the usual fix (or a sparse unique index).

### Q21 | Express | Middleware order
What happens here?

```js
app.use((err, req, res, next) => res.status(500).json({ error: err.message }));
app.get('/boom', () => { throw new Error('x'); });
```

- A) The handler returns 500 JSON, because Express runs error handlers before routes
- B) The server crashes with an unhandled exception, because no handler is registered after the route
- C) The handler is skipped because it is registered before the route, so the default handler runs
- D) A 404 JSON response is returned, because the route throws before it is matched

**Answer:** C
**Explanation:** Error-handling middleware must be registered **after** the routes that may throw.

### Q22 | Express | router.param
What is guaranteed about `router.param('id', fn)`?

- A) It runs for every route handler on the router, not only those that contain the parameter
- B) It runs only for POST requests that carry a body, and never for GET
- C) It runs once per request per parameter value, even if multiple matching routes use `:id`
- D) It replaces the route handlers, so the matching route is skipped entirely

**Answer:** C
**Explanation:** Param callbacks are local to the router, called once in a request-response cycle, and commonly used to preload a resource.

### Q23 | Express | Express 5
Which route is valid syntax in Express 5 (path-to-regexp v8) for matching any sub-path?

- A) `app.get('*', handler)`
- B) `app.get('/**', handler)`
- C) `app.get('/*splat', handler)`
- D) `app.get('/.*', handler)`

**Answer:** C
**Explanation:** Express 5 requires wildcards to be named (`/*splat`). Unnamed `*` throws on startup. Express 5 also forwards rejected promises from handlers to the error handler.

### Q24 | Express | HTTP semantics
Which pair of HTTP methods is defined as **idempotent**?

- A) POST and PATCH
- B) POST and DELETE
- C) PUT and DELETE
- D) PATCH and PUT, always

**Answer:** C
**Explanation:** Repeating a PUT or DELETE leaves the same server state. POST is not idempotent, and PATCH is not guaranteed to be.

### Q25 | Express | Status codes
A client registers with an email that already exists. Which response is most precise?

- A) 200 OK
- B) 400 Bad Request
- C) 409 Conflict
- D) 500 Internal Server Error

**Answer:** C
**Explanation:** The request is well-formed but conflicts with current state. Map the Mongo duplicate key error (code 11000) to 409.

### Q26 | Express | CSRF
Your SPA authenticates with a session cookie. Which combination best defends against CSRF?

- A) Only `HttpOnly` on the session cookie, since scripts cannot read the cookie value
- B) A wildcard CORS policy (`*`) so that only your own SPA is allowed to call the API
- C) Switching state-changing actions from POST to GET so browsers refuse cross-site calls
- D) `SameSite=Lax/Strict` cookies plus an anti-CSRF token on state-changing requests

**Answer:** D
**Explanation:** HttpOnly does not stop cross-site requests with cookies. SameSite plus tokens (or checking `Origin`) does. State changes via GET are a classic CSRF hole.

### Q27 | Express | JWT
How do you prevent the `alg: none` / algorithm-confusion attack when verifying JWTs?

- A) Trust the `alg` field in the token header so the server accepts whatever algorithm was used
- B) Pass an explicit allowlist, e.g. `jwt.verify(token, key, { algorithms: ['HS256'] })`
- C) Base64-decode the payload yourself and skip signature verification for performance
- D) Store the token in `localStorage`, which prevents tampering with the header

**Answer:** B
**Explanation:** Never let the token choose how it is verified. Pin the algorithm (and issuer/audience) on the server.

### Q28 | Express | Refresh tokens
What is the purpose of refresh-token **rotation with reuse detection**?

- A) It makes access tokens valid forever so users never need to sign in again
- B) It removes the need for HTTPS because rotated tokens cannot be intercepted
- C) Each use rotates the token, so a replayed stolen token exposes the theft
- D) It encrypts the JWT payload so a stolen token reveals nothing to the attacker

**Answer:** C
**Explanation:** If an already-used refresh token is presented again, either the attacker or the user holds a stale copy. Revoke the whole family and force a login.

### Q29 | Express | Path traversal
Why is this dangerous?

```js
app.get('/file', (req, res) => res.sendFile(req.query.name));
```

- A) An attacker can pass `../../etc/passwd`, or an absolute path, to read arbitrary files
- B) `sendFile` is asynchronous, so the response may be sent before the file is read
- C) Query strings are limited to eight characters, so long names are truncated unpredictably
- D) It blocks the event loop while the file is read, making every other request wait

**Answer:** A
**Explanation:** Use `res.sendFile(name, { root: SAFE_DIR })` and validate or allowlist `name`. Never pass user input as a path.

### Q30 | Express | Mass assignment
What is the vulnerability in `await User.create(req.body)`?

- A) There is no problem, because `create` ignores any field that the client sends
- B) It skips password hashing, so passwords are stored as plain text by default
- C) It is slow, because every field in the body is validated twice before saving
- D) Mass assignment: clients can send `{ "role": "admin" }` and set protected fields

**Answer:** D
**Explanation:** Pick/allowlist fields (or validate with a schema like zod/joi with `strict`) before writing.

### Q31 | Express | CORS
A browser app at `https://app.com` sends `fetch(url, { credentials: 'include' })` to `https://api.com`. Which response header value is **invalid**?

- A) `Access-Control-Allow-Origin: https://app.com`
- B) `Access-Control-Allow-Credentials: true`
- C) `Access-Control-Allow-Origin: *`
- D) `Vary: Origin`

**Answer:** C
**Explanation:** With credentials, the wildcard origin is rejected by the browser. Echo the specific allowed origin and add `Vary: Origin`.

### Q32 | Express | Body limits
By default, `express.json()` rejects a 1 MB body with which outcome?

- A) 200, with the body silently truncated to the first 100 kb
- B) 413 Payload Too Large (default limit is about 100 kb)
- C) 401 Unauthorized, because the body is larger than an anonymous client may send
- D) The server crashes with an out-of-memory error while reading the body

**Answer:** B
**Explanation:** Configure with `express.json({ limit: '1mb' })` only when needed. Small limits are a cheap DoS protection.

### Q33 | Express | Error middleware
You write `function handler(err, req, res) {...}` (3 params) and register it last. What happens?

- A) It works as an error handler, because Express detects it from the first parameter name `err`
- B) Express treats it as a normal middleware (arity 3), so it is never called for errors
- C) Express throws at startup, because the function signature is invalid
- D) It runs for every request twice, once as middleware and once as an error handler

**Answer:** B
**Explanation:** Express detects error handlers by `fn.length === 4`. Keep `next` even if unused.

### Q34 | Express | HTTP caching
Express sends a response with a weak `ETag`. The client repeats the request with `If-None-Match` and the content is unchanged. What is returned?

- A) 200 with the full body, because Express ignores conditional request headers
- B) 204 No Content, because the representation is identical
- C) 412 Precondition Failed, because `If-None-Match` is only valid for PUT
- D) 304 Not Modified with no body

**Answer:** D
**Explanation:** Express generates ETags for `res.send` by default and handles conditional requests via `req.fresh`. Saves bandwidth, not server work (unless you compute cheaply).

### Q35 | Express | SSE
Which headers are needed for a Server-Sent Events endpoint?

- A) `Content-Type: application/json` and `Content-Length` set to the size of the first message
- B) `Content-Type: text/plain` with `Transfer-Encoding: gzip` and no keep-alive
- C) `Content-Type: text/event-stream` with `Connection: close` after every message
- D) `Content-Type: text/event-stream`, `Cache-Control: no-cache`, connection kept open

**Answer:** D
**Explanation:** Write messages as `data: ...\n\n` and flush. Clean up on `req.on('close')`.

### Q36 | Express | Router
What does `express.Router({ mergeParams: true })` change?

- A) It merges two routers into one so that their route lists are combined
- B) It enables CORS for every route that is mounted on the child router
- C) The child router can read params from the parent path, such as `:userId`
- D) It parses query strings into nested objects for the child router only

**Answer:** C
**Explanation:** By default, a router mounted on a path with params does not see those params in `req.params`.

### Q37 | Express | Cookies
What does the `HttpOnly` cookie flag prevent?

- A) The cookie being sent over plain HTTP connections
- B) Cross-site request forgery, because the browser never attaches the cookie cross-site
- C) The cookie expiring when the browser tab is closed
- D) JavaScript on the page reading the cookie via `document.cookie`

**Answer:** D
**Explanation:** It limits the damage of XSS (token theft) but does not stop CSRF. `Secure` restricts to HTTPS and `SameSite` limits cross-site sending.

### Q38 | Express | Validation
Which approach is best for validating request input?

- A) Trust the client and cast the values later when they are used
- B) Validate at the edge with a schema library (zod, joi, ajv) and reject early
- C) Validate only in the React form, because the browser already checks the types
- D) Validate only with MongoDB schema validation and skip checks in Express

**Answer:** B
**Explanation:** Client validation is UX, not security. Server schemas also give typed, trimmed data to the rest of the code.

### Q39 | Express | Status codes
A valid JWT is sent, but the user's role is not allowed to delete invoices. Which status code?

- A) 401 Unauthorized
- B) 418
- C) 404 Not Found only
- D) 403 Forbidden

**Answer:** D
**Explanation:** 401 = not authenticated (or invalid credentials). 403 = authenticated but not permitted. Some APIs return 404 to hide the resource's existence.

### Q40 | Express | Streaming
What does `res.write(chunk)` return when the internal buffer is full, and what should you do?

- A) `true`: keep writing, because the buffer always grows automatically
- B) `false`: wait for the `'drain'` event before writing more
- C) A Promise that resolves when the data has been flushed to the client
- D) It throws `ERR_STREAM_FULL`, so the handler must catch it and retry

**Answer:** B
**Explanation:** Ignoring backpressure can balloon memory. Prefer `stream.pipeline(source, res)`.

### Q41 | React | Batching
In React 18 with `createRoot`, how many renders occur?

```jsx
setTimeout(() => {
  setA(1);
  setB(2);
}, 0);
```

- A) 2, because updates outside React event handlers are not batched in React 18
- B) 0, because updates inside timers are dropped when the component is not focused
- C) 1, because updates are batched automatically everywhere
- D) 3, because each setter and the timeout callback trigger their own render

**Answer:** C
**Explanation:** React 17 only batched inside React event handlers. React 18 batches updates in timeouts, promises and native handlers too.

### Q42 | React | Stale closures
What does this log after you click "inc" five times?

```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []);
```

- A) 5, 5, 5, because the interval always reads the latest state
- B) 1, 2, 3, because the log increments as the interval ticks
- C) 0, 0, 0 (the closure captured the first render's `count`)
- D) undefined, because state is not accessible inside intervals

**Answer:** C
**Explanation:** The effect ran once, so the callback sees `count` from render 1. Add `count` to the deps, or keep the latest value in a ref.

### Q43 | React | Referential equality
Why does this effect run on every render?

```jsx
const options = { page, size };
useEffect(() => { load(options); }, [options]);
```

- A) `useEffect` ignores the dependency array when it contains any object or function
- B) `page` is a string, so React cannot compare it between two renders
- C) `options` is a new object each render and deps are compared with `Object.is`
- D) Objects are not allowed as dependencies, so React re-runs the effect to be safe

**Answer:** C
**Explanation:** Depend on primitives (`[page, size]`), or memoize the object with `useMemo`.

### Q44 | React | Keys
A list of controlled `<input>`s uses `key={index}`. The user deletes the first row. What goes wrong?

- A) Nothing, because React removes the DOM node and the state that belong to the deleted row
- B) React throws an error, because index keys are not allowed in controlled inputs
- C) The list becomes read-only until all keys are replaced with numeric values again
- D) React reuses state by position, so remaining inputs can show wrong values

**Answer:** D
**Explanation:** Index keys tie identity to position. Use a stable id from the data.

### Q45 | React | useReducer
Which statement about `dispatch` from `useReducer` is true?

- A) Its identity is stable, so it can be skipped in dependency arrays
- B) Its identity changes every render, so it must be listed in every dependency array
- C) It is synchronous and updates state immediately, before the next line runs
- D) It can only be called inside effects, never inside event handlers

**Answer:** A
**Explanation:** The same is true for `setState` functions. `useReducer` suits state with multiple related transitions.

### Q46 | React | External stores
What problem does `useSyncExternalStore` solve?

- A) Routing on the server by subscribing to URL changes during streaming
- B) Subscribing to non-React stores without tearing in concurrent rendering
- C) Memoising expensive values by subscribing to dependency changes
- D) Fetching data on the server and caching it between two requests

**Answer:** B
**Explanation:** It guarantees a consistent snapshot during a render and supports a `getServerSnapshot` for SSR hydration.

### Q47 | React | Error boundaries
Which error is **not** caught by an error boundary?

- A) An error thrown while a child component renders, such as reading a property of undefined
- B) An error thrown in a class child's `componentDidMount` lifecycle method
- C) An error thrown inside a child component's constructor during mounting
- D) An error thrown inside an `onClick` handler or in a `setTimeout` callback

**Answer:** D
**Explanation:** Boundaries catch errors during rendering, lifecycle and constructors of the tree below. Handle event and async errors with try/catch (or set state to rethrow).

### Q48 | React | Strict Mode
In development with StrictMode, you see `console.log` twice per render. Why?

- A) React deliberately double-invokes renders to expose impure code
- B) A bug in React 18 that is fixed by upgrading to the latest minor version
- C) The component is mounted twice in production builds as well as development
- D) Hot module reloading re-runs each render once more after every save

**Answer:** A
**Explanation:** Render must be pure. Strict Mode double rendering is development-only.

### Q49 | React | Forms
What warning do you get from `<input value={name} />` without `onChange`?

- A) There is no warning, because React falls back to uncontrolled behaviour automatically
- B) A `value` without `onChange` makes the input read-only; use `defaultValue`
- C) A missing `key` warning, since inputs rendered from state need unique keys
- D) An invalid hook call warning, because inputs must be created inside a hook

**Answer:** B
**Explanation:** Controlled inputs need state plus handler. `defaultValue` + a `ref` makes it uncontrolled.

### Q50 | React | React 19
Which statement about React 19 is correct?

- A) Function components can take `ref` as a normal prop; `forwardRef` is rarely needed
- B) `forwardRef` is still required for every function component that accepts a ref
- C) Class components were removed, so all refs must now be written with hooks
- D) Hooks were removed in favour of a new compiler-only state model

**Answer:** A
**Explanation:** React 19 also adds `use`, Actions (`useActionState`, `useFormStatus`) and `useOptimistic`.

### Q51 | React | use()
What is special about the React 19 `use` API?

- A) It can only be called at the top level, like every other hook
- B) It can read a Promise (suspending) or Context, and may be called conditionally
- C) It replaces `useState` and works only inside Server Components
- D) It runs effects on the server only and cannot read context

**Answer:** B
**Explanation:** `use(promise)` integrates with Suspense. The promise should come from a cache or a Server Component, not be created during render.

### Q52 | React | useOptimistic
What does `useOptimistic` give you?

- A) Faster network requests, by sending optimistic hints to the server in parallel
- B) A temporary state shown instantly that reverts to the real state after the action
- C) Automatic retries of failed requests with exponential backoff
- D) Memoisation of expensive values between two server renders

**Answer:** B
**Explanation:** It is meant for UI like "like" buttons or chat messages that should look instant while the server confirms.

### Q53 | React | Hydration
Which code most likely causes a hydration mismatch?

- A) `<p>{items.length}</p>` where `items` come from the same props on both sides
- B) `<p>{new Date().toLocaleTimeString()}</p>` rendered on both server and client
- C) `<p>{props.title}</p>` where `title` is a constant string passed down
- D) `<ul>{list.map(...)}</ul>` rendering a deterministic list of items

**Answer:** B
**Explanation:** The server and the first client render must produce identical HTML. Time, randomness, `window`, and locale-dependent output differ. Render them in an effect, or use `suppressHydrationWarning` for harmless text.

### Q54 | React | Next.js · Server Components
In the Next.js App Router, which of these **cannot** be used in a Server Component?

- A) `useState` and `onClick` handlers
- B) `async/await` data fetching
- C) Direct database access
- D) Reading environment secrets

**Answer:** A
**Explanation:** Server Components have no state, effects or event handlers. Move interactivity into a small Client Component.

### Q55 | React | Next.js · 'use client'
What does adding `'use client'` at the top of a file do?

- A) Makes only that single component client-side, and its imports stay on the server
- B) Disables server-side rendering for the whole application
- C) Marks a boundary: the module and everything it imports become part of the client bundle
- D) Runs the file only in the browser, so it is never pre-rendered on the server

**Answer:** C
**Explanation:** Client Components are still pre-rendered on the server for the first load. Put the directive as deep in the tree as possible to keep bundles small.

### Q56 | React | Next.js · Fetch caching
In Next.js 15 App Router, what is the default caching behaviour of `fetch()` in a Server Component?

- A) Cached forever until the next deployment, with no way to opt out
- B) Cached only in production builds, and never in development
- C) Cached for one hour by default, then revalidated in the background
- D) Not cached by default; opt in with `force-cache` or `revalidate`

**Answer:** D
**Explanation:** Next.js 14 cached `fetch` by default; Next.js 15 reversed this. Always check the version-specific docs rather than relying on memorised defaults.

### Q57 | React | Next.js · Server Actions
Which statement about Server Actions (`'use server'` functions) is the most accurate?

- A) They are public POST endpoints, so each must validate input and check permissions
- B) They are private because they live inside the component file and cannot be called externally
- C) They are protected automatically by whatever login the site already uses
- D) They can only be invoked from Server Components, never from forms or client code

**Answer:** A
**Explanation:** Treat them like API routes. Never trust arguments, and re-check the user's permission inside the action.

### Q58 | React | Next.js · Revalidation
After an admin publishes a post, you need the blog list to update immediately for everyone. What do you call?

- A) Call `window.location.reload()` in the admin's browser once the post is published
- B) `revalidatePath('/blog')` or `revalidateTag('posts')` in a Server Action
- C) Ask every visitor's browser to run `router.refresh()` after the publish
- D) Restart the Next.js server so that the build cache is cleared

**Answer:** B
**Explanation:** On-demand revalidation invalidates cached data or routes. Time-based `revalidate` is for acceptable staleness.

### Q59 | React | Next.js · Special files
Which file gives a route segment an instant loading UI via Suspense?

- A) `page.tsx`
- B) `template.tsx`
- C) `error.tsx`
- D) `loading.tsx`

**Answer:** D
**Explanation:** `loading.tsx` wraps the segment in a Suspense boundary. `error.tsx` is an error boundary (must be a Client Component).

### Q60 | React | Next.js · Rendering
A product page needs per-request personalised pricing from cookies. Which rendering mode applies?

- A) Fully static rendering at build time, because cookies are read in the browser
- B) Dynamic rendering at request time, since reading `cookies()` opts the route into it
- C) ISR with a one-year revalidate period, so prices rarely change
- D) Client-only rendering is mandatory, because cookies cannot be read on the server

**Answer:** B
**Explanation:** Using request-time APIs makes the route dynamic. Keep static parts static and stream dynamic parts inside `Suspense`.

### Q61 | Node.js | Event loop
In which order does Node.js process the event loop phases?

- A) timers → pending callbacks → idle/prepare → poll → check → close callbacks
- B) poll → timers → pending callbacks → check → idle/prepare → close callbacks
- C) timers → poll → idle/prepare → pending callbacks → check → close callbacks
- D) check → timers → pending callbacks → poll → close callbacks → idle/prepare

**Answer:** A
**Explanation:** Microtasks (`process.nextTick`, then promises) run between callbacks, after each phase operation completes.

### Q62 | Node.js | Event loop output
What is the output?

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
```

- A) immediate, then timeout, every time
- B) timeout, then immediate, every time
- C) Either order, depending on system load
- D) Only one of them prints, depending on the thread pool

**Answer:** A
**Explanation:** Inside an I/O callback you are in the poll phase, so the check phase (`setImmediate`) comes before the next timers phase.

### Q63 | Node.js | Parallelism
You need to hash 500 large files without blocking requests. Which is the best tool?

- A) A `for` loop calling `crypto.createHash` synchronously on the main thread
- B) Wrapping each hash in `setTimeout(fn, 0)` so it runs in the background
- C) `Promise.all` over the synchronous hashing API so all files hash in parallel
- D) `worker_threads` (or a job queue) so CPU work runs off the event loop

**Answer:** D
**Explanation:** `setTimeout` and promises do not move CPU work off the main thread. `cluster` scales across cores, but one request can still block its worker.

### Q64 | Node.js | Streams
Why prefer `stream.pipeline()` over `a.pipe(b)`?

- A) It is always faster, because it skips internal buffering between streams
- B) It forwards errors from every stream, destroys them all, and cleans up properly
- C) It compresses the data automatically while piping between two streams
- D) `pipe` was removed in recent Node versions, so `pipeline` is the only option

**Answer:** B
**Explanation:** With `pipe`, an error in one stream does not close the others, which can leak file descriptors.

### Q65 | Node.js | Buffers
What is the key risk of `Buffer.allocUnsafe(n)`?

- A) It is asynchronous, so the buffer is not usable until a callback fires
- B) The memory is not zero-filled and may hold old data, so overwrite it first
- C) It throws an error for any size above 1 MB because of a pool limit
- D) It only works on Windows, where uninitialised memory is always zeroed

**Answer:** B
**Explanation:** `Buffer.alloc(n)` zero-fills and is the safe default. `allocUnsafe` trades safety for speed.

### Q66 | Node.js | Memory leaks
Which is a typical cause of a slowly growing heap in a long-running Node service?

- A) Declaring variables with `const` instead of `let` in module scope
- B) Using `async` functions, since each one allocates a permanent promise
- C) An unbounded in-memory cache or per-request listeners never removed
- D) Calling `console.log`, which retains every logged object forever

**Answer:** C
**Explanation:** Node warns with `MaxListenersExceededWarning` at more than 10 listeners per event. Use an LRU with a size/TTL bound, and take heap snapshots to find retainers.

### Q67 | Node.js | Errors
What should you do after an `uncaughtException` fires?

- A) Log it and keep serving, since the handler guarantees the process is healthy
- B) Call `process.nextTick` to retry the failed operation in a clean state
- C) Log, flush and exit so a supervisor restarts it, as state may be corrupt
- D) Ignore it, because uncaught exceptions are always recovered by the event loop

**Answer:** C
**Explanation:** The handler is a last resort for cleanup and logging, not a way to recover.

### Q68 | Node.js | Promises
What happens with an unhandled promise rejection in Node 15+ by default?

- A) A warning is printed and the process continues running normally
- B) The rejected promise is retried automatically three times
- C) The process throws and exits with a non-zero code by default
- D) Nothing happens unless a global `unhandledRejection` listener exists

**Answer:** C
**Explanation:** Add `.catch`/`try/catch`, and a global `unhandledRejection` listener for logging.

### Q69 | Node.js | Timeouts
Which approach correctly cancels a `fetch` after 3 seconds in modern Node?

- A) `setTimeout(() => fetch.cancel(), 3000)` called after starting the request
- B) `fetch(url, { timeout: 3000 })` using the built-in timeout option
- C) `fetch(url, { signal: AbortSignal.timeout(3000) })`
- D) `Promise.resolve(fetch(url)).timeout(3000)` using a promise helper

**Answer:** C
**Explanation:** `fetch` has no `timeout` option. `AbortSignal.timeout` rejects with a `TimeoutError` and aborts the request.

### Q70 | Node.js | ESM
In an ES module, `__dirname` is:

- A) Available as usual, because Node injects it into every module type
- B) Defined but always set to `undefined` in ES modules
- C) Not defined; use `import.meta.dirname` or derive it from `import.meta.url`
- D) Only available when the file is written in TypeScript

**Answer:** C
**Explanation:** `require`, `module`, `__filename` and `__dirname` are CommonJS wrappers' variables.

### Q71 | Node.js | Promise combinators
What is logged?

```js
Promise.race([
  new Promise((r) => setTimeout(() => r('a'), 50)),
  new Promise((_, rej) => setTimeout(() => rej(new Error('b')), 10))
]).then(console.log).catch((e) => console.log(e.message));
```

- A) a
- B) Nothing
- C) a then b
- D) b

**Answer:** D
**Explanation:** `race` settles with the first settled promise, resolved or rejected. The rejection at 10 ms wins.

### Q72 | Node.js | Async pitfalls
What is printed?

```js
let total = 0;
[1, 2, 3].forEach(async (n) => { await null; total += n; });
console.log(total);
```

- A) 6
- B) undefined
- C) 0
- D) NaN

**Answer:** C
**Explanation:** `forEach` ignores returned promises, so the log runs before the continuations. Use `for...of` with `await`, or `await Promise.all(arr.map(...))`.

### Q73 | Node.js | Closures
What is printed?

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
```

- A) 0 1 2
- B) undefined x3
- C) 2 2 2
- D) 3 3 3

**Answer:** D
**Explanation:** `var` is function-scoped, so all callbacks share one `i`, which is 3 by the time they run. `let` creates a new binding per iteration.

### Q74 | Node.js | TypeScript
Why is `unknown` safer than `any` for parsed JSON?

- A) They are identical, because both accept any value and allow any operation
- B) `any` is deprecated and will be removed from the next TypeScript release
- C) `unknown` is faster at runtime because the compiler skips type erasure
- D) `unknown` forces narrowing before use, while `any` turns checking off

**Answer:** D
**Explanation:** Pair `unknown` with runtime validation (zod, type guards). TypeScript types are erased at runtime and do not validate external data.

### Q75 | Node.js | TypeScript
What does `as const` do on `const roles = ['admin', 'user'] as const`?

- A) A readonly tuple of literal types, with no runtime effect
- B) Makes the array deeply frozen at runtime so it cannot be modified
- C) Converts the array into an enum with the same member names
- D) Converts the array into a `Set` of the literal strings

**Answer:** A
**Explanation:** Combined with `typeof roles[number]` it gives you a union type `'admin' | 'user'` from a single source of truth.

### Q76 | Node.js | Testing
Which is the best reason to use `supertest` in an Express project?

- A) To mock MongoDB so no real database is ever started during tests
- B) To bundle the application into a single deployable file
- C) To lint the Express routes and report unused middleware
- D) To call the app in-process with no open port, and assert on the response

**Answer:** D
**Explanation:** Use it for integration tests of routes + middleware, and unit tests for pure business logic.

### Q77 | Node.js | Shutdown
How do you shut down an HTTP server gracefully on `SIGTERM`?

- A) Call `process.exit(0)` immediately so the container stops as fast as possible
- B) Call `server.close()`, finish in-flight requests, close DB links, then exit
- C) Ignore the signal and let the orchestrator kill the process after its timeout
- D) Restart the database first so no new queries can reach the server

**Answer:** B
**Explanation:** Kubernetes and Docker send SIGTERM before SIGKILL. Immediate exit drops in-flight payments.

### Q78 | Node.js | Docker
Which Dockerfile practice makes signals reach your Node process correctly?

- A) `CMD npm start` (shell form), because npm always forwards signals to Node
- B) Run the app under `sleep infinity` so signals never reach it
- C) `CMD "node server.js"` as a plain string, which Docker always runs without a shell
- D) `CMD ["node", "server.js"]` (exec form, ideally with an init) and run as a non-root user

**Answer:** D
**Explanation:** Shell form runs through `/bin/sh -c` which may not forward SIGTERM. Node as PID 1 does not reap zombies, so use an init.

### Q79 | Node.js | Memory
What does `node --max-old-space-size=4096 app.js` do?

- A) Sets the V8 old-generation heap limit to about 4 GB
- B) Limits the number of open file descriptors to 4096
- C) Sets the maximum call stack size to 4096 frames
- D) Allocates 4 GB of Buffer memory outside the V8 heap

**Answer:** A
**Explanation:** Raising it only delays OOM if the app leaks. Fix the leak and size containers accordingly.

### Q80 | Node.js | npm
Why does CI use `npm ci` rather than `npm install`?

- A) It is faster only because it skips running the test suite
- B) It publishes the package to the registry after installing
- C) It upgrades every dependency to the newest semver-compatible version
- D) It installs exactly the lockfile versions, failing on any mismatch

**Answer:** D
**Explanation:** Reproducible builds. Consider `--ignore-scripts` plus audit tooling to reduce supply-chain risk.
