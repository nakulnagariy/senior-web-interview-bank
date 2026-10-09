---
id: set-3
title: Set 3 — Performance & Internals
description: Output prediction, query plans, event-loop and rendering internals, Next.js caching. Hard.
---

### Q1 | MongoDB | explain()
An `explain("executionStats")` shows `IXSCAN`, `totalKeysExamined: 50000`, `totalDocsExamined: 50000`, `nReturned: 10`. What does it indicate?

- A) The query is covered, so no documents had to be fetched from the collection
- B) The index is used, but it is not selective enough for this query
- C) A collection scan occurred, because the plan shows a full scan of every document
- D) The result was served from the plan cache, so no documents were examined

**Answer:** B
**Explanation:** An index scan that examines 50,000 keys to return 10 documents means the index only narrows the data a little. Reorder or extend the index so the most selective fields lead.

### Q2 | MongoDB | ESR rule
For `find({ status: 'A', qty: { $lt: 30 } }).sort({ date: 1 })`, which index follows the ESR (Equality, Sort, Range) guideline?

- A) `{ qty: 1, status: 1, date: 1 }`
- B) `{ status: 1, qty: 1, date: 1 }`
- C) `{ date: 1, status: 1, qty: 1 }`
- D) `{ status: 1, date: 1, qty: 1 }`

**Answer:** D
**Explanation:** Equality first (`status`), then the sort key (`date`) so the index delivers sorted output, then the range (`qty`).

### Q3 | MongoDB | Write cost
A collection has 12 indexes and insert throughput is falling. What is the most likely cause?

- A) The documents are too small, so the storage engine wastes space on padding
- B) Each insert must update every index on the collection
- C) The `_id` index becomes slow once more than ten secondary indexes exist
- D) Replica sets are disabled, so inserts cannot be batched

**Answer:** B
**Explanation:** Every index adds write work and memory. Drop unused indexes (check `$indexStats`), and use hidden indexes to test the impact first.

### Q4 | MongoDB | WiredTiger cache
By default, how large is the WiredTiger internal cache?

- A) Exactly 10% of the total RAM installed on the machine
- B) All free RAM at startup, shrinking as the OS needs memory
- C) A fixed 1 GB, regardless of how much memory the host has
- D) The larger of 50% of (RAM − 1 GB) or 256 MB

**Answer:** D
**Explanation:** MongoDB also relies on the OS filesystem cache for compressed data, so do not give it all the memory on the machine.

### Q5 | MongoDB | $or
For `find({ $or: [{ a: 1 }, { b: 2 }] })`, when can MongoDB avoid a collection scan?

- A) Never, because `$or` always forces a collection scan
- B) When only the first clause is indexed, since the planner skips the rest
- C) When a text index exists on either of the two fields
- D) When every clause of the `$or` is supported by an index

**Answer:** D
**Explanation:** If any clause needs a collection scan, the whole `$or` does. Each clause may use a different index.

### Q6 | MongoDB | Negation
Why are `$ne` and `$nin` often slow even with an index on the field?

- A) They are deprecated and always fall back to a collection scan
- B) They disable the query planner for the rest of the pipeline
- C) They match most of the index, so the scan is nearly complete
- D) They run only on secondaries, where indexes are not maintained

**Answer:** C
**Explanation:** Negations are not selective. Prefer positive conditions (`$in` on the allowed set) where possible.

### Q7 | MongoDB | Collation
An index was created with collation `{ locale: 'en', strength: 2 }` (case-insensitive). A query without a collation:

- A) It uses the index for string comparisons, since the strength setting is ignored
- B) It returns an error asking you to supply the same collation
- C) It is automatically given the index's collation by the server
- D) It cannot use the index for string comparison, because the collations differ

**Answer:** D
**Explanation:** The query's collation must match the index collation. Set it on the collection or pass it per query.

### Q8 | MongoDB | Sharding
A collection is sharded on `{ createdAt: 1 }` (ranged) and receives constant inserts. What happens?

- A) Writes are spread perfectly evenly across all shards
- B) Writes are rejected, since a ranged key must not be a date
- C) All new inserts hit the highest-range shard, creating a hot shard
- D) Only reads slow down, while writes remain evenly distributed

**Answer:** C
**Explanation:** Monotonically increasing keys concentrate writes. Use a hashed key or a compound key with a well-distributed prefix.

### Q9 | MongoDB | Sharding
A query on a sharded collection does not include the shard key. How is it executed?

- A) Scatter-gather: `mongos` queries all shards and merges the results
- B) It fails with an error that asks for the shard key to be included
- C) It goes to the primary shard only, which holds the full collection
- D) It is answered from a cache kept on `mongos`

**Answer:** A
**Explanation:** Targeted queries include the shard key (or its prefix). Scatter-gather scales poorly as shard count grows.

### Q10 | MongoDB | Aggregation
What does MongoDB do for `$sort` immediately followed by `$limit: 5`?

- A) They coalesce into a top-k sort that keeps only 5 documents in memory
- B) The server sorts every document first, then slices off the first five
- C) The sort is ignored, because `$limit` already decides the output order
- D) It requires `allowDiskUse`, since sorting and limiting cannot share memory

**Answer:** A
**Explanation:** Top-k sorting greatly reduces memory use compared with a full in-memory sort.

### Q11 | MongoDB | Aggregation limits
Which pipeline is most likely to fail with "document exceeds maximum size"?

- A) `$group` by customer id, using `$sum` on the amount field
- B) `$match` on a status field, followed by a `$count` stage
- C) `$group` with `_id: null` and `$push: '$$ROOT'` over millions of rows
- D) `$project` that keeps only three small fields of each document

**Answer:** C
**Explanation:** `$push` builds an array inside one output document, which is limited to 16 MB. Group more finely or avoid collecting everything.

### Q12 | MongoDB | bulkWrite
What does `ordered: false` change in `bulkWrite`?

- A) Operations run in random order, and the first error cancels the whole batch
- B) It wraps the batch in a transaction, so a single failure rolls everything back
- C) It disables write concern for the batch, so no acknowledgement is returned
- D) The server may run operations in any order and continues after individual errors

**Answer:** D
**Explanation:** `ordered: true` stops at the first error. Unordered batches can be faster, and are fine when operations are independent.

### Q13 | MongoDB | Counting
Which is the fastest way to get the approximate total document count of a huge collection?

- A) `countDocuments({})`
- B) `aggregate([{ $group: { _id: null, c: { $sum: 1 } } }])`
- C) `find().toArray().length`
- D) `estimatedDocumentCount()`

**Answer:** D
**Explanation:** It reads collection metadata and cannot take a filter. `countDocuments` actually scans (using an index where possible) for exactness.

### Q14 | MongoDB | Mongoose lean
What is the result?

```js
const user = await User.findOne({ email }).lean();
await user.save();
```

- A) `TypeError: user.save is not a function`, since lean returns plain objects
- B) It saves normally, because lean documents keep their change tracking
- C) It saves, but skips validation because virtuals are removed
- D) It returns null, because lean documents cannot be updated

**Answer:** A
**Explanation:** Lean documents have no methods, getters, virtuals or change tracking. Use them for read-only responses.

### Q15 | MongoDB | Mongoose connection
A query runs before `mongoose.connect()` has finished. What does Mongoose do by default?

- A) It buffers the command, then times out after about 10 seconds
- B) It fails instantly with a connection error
- C) It switches to an in-memory database until the connection is ready
- D) It retries forever until the connection succeeds

**Answer:** A
**Explanation:** The `bufferCommands` option controls this. Await the connection before starting the server so errors surface early.

### Q16 | MongoDB | Mongoose indexes
Why do many teams disable `autoIndex` in production?

- A) Indexes are not supported in production, only in development
- B) It deletes data that violates the schema, so it is unsafe to leave on
- C) Index builds at startup can be costly, so teams run explicit migrations
- D) It breaks validators because indexes are rebuilt before validation

**Answer:** C
**Explanation:** With many app instances starting together, accidental index builds can hurt performance. Call `syncIndexes()` deliberately.

### Q17 | MongoDB | Hidden indexes
What is the purpose of hiding an index (`db.c.hideIndex(...)`)?

- A) To encrypt the index so that only the application user can read it
- B) To make the index unique for a limited test period
- C) To move the index to another shard until it is needed again
- D) To test the effect of dropping it without actually dropping it

**Answer:** D
**Explanation:** The planner ignores a hidden index, but it is still maintained, so you can unhide it instantly if performance regresses.

### Q18 | MongoDB | Profiler
How do you log operations slower than 100 ms?

- A) `db.setLogLevel(100)` on the database object
- B) `db.enableSlow(100)` on the collection object
- C) `db.explain(100)` before running the query
- D) `db.setProfilingLevel(1, { slowms: 100 })`

**Answer:** D
**Explanation:** Level 1 profiles only slow operations into `system.profile`. Use level 2 sparingly, because it profiles everything.

### Q19 | MongoDB | Working set
Reads are fast at first, then become slow as the data grows, and disk I/O spikes. What is the likely reason?

- A) The CPU is too fast for the disk, so reads are queued
- B) There are too few documents, so the cache is never warmed
- C) The working set of hot data and indexes no longer fits in RAM
- D) The oplog is disabled, so reads cannot use the cache

**Answer:** C
**Explanation:** Keep indexes in memory, trim index count, use projections, and scale up or shard when needed.

### Q20 | MongoDB | Index strategy
You can create `{ a: 1 }` and `{ a: 1, b: 1 }`. Which statement is true?

- A) Both are always needed, because a compound index cannot serve queries on `a` alone
- B) `{ a: 1, b: 1 }` is useless for queries on `a`, so keep the single-field index
- C) `{ a: 1 }` is usually redundant, since the compound index already covers that prefix
- D) The compound index is always faster for `a` alone, so drop `{ a: 1 }` for that reason

**Answer:** C
**Explanation:** Prefix indexes waste space and write time. A compound index may be slightly larger for `a`-only queries, but is normally fine.

### Q21 | Express | Middleware flow
What is the console output for `GET /`?

```js
app.use((req, res, next) => { console.log('a'); next(); console.log('b'); });
app.use((req, res, next) => { console.log('c'); res.send('ok'); console.log('d'); });
```

- A) a b c d
- B) a c b d
- C) a c d b
- D) a c

**Answer:** C
**Explanation:** `next()` synchronously invokes the next middleware, which runs to completion (`c`, send, `d`) before control returns and `b` logs.

### Q22 | Express | Keep-alive
Users see occasional 502 errors from a load balancer with a 60 s idle timeout in front of your Node server. What is a classic cause?

- A) Express is too old and closes every connection after the first response
- B) Node's 5 s `keepAliveTimeout` is shorter than the balancer's idle timeout
- C) JSON bodies are too large, so the balancer drops the connection
- D) CORS is misconfigured, so the balancer rejects preflight requests

**Answer:** B
**Explanation:** Node closes idle connections after 5 s while the LB still reuses them, producing resets. Set `server.keepAliveTimeout` above the LB timeout (and `headersTimeout` above that).

### Q23 | Express | Query parsing
A request is `/search?tag=a&tag=b`. What is `req.query.tag` and what could go wrong?

- A) `'b'`, with no problem, since the last value wins
- B) `['a', 'b']`, so code calling `.toLowerCase()` would throw
- C) `'a,b'`, a comma-joined string that is safe to use directly
- D) `undefined`, because repeated keys are dropped

**Answer:** B
**Explanation:** Repeated parameters become arrays (HTTP parameter pollution). Validate types with a schema. Express 5 defaults to the `simple` query parser, which no longer builds nested objects like `a[b]=c`.

### Q24 | Express | Event loop
A handler does `JSON.parse(await readBody())` on 80 MB payloads. What is the main risk?

- A) Memory is freed automatically, so there is no real cost
- B) `JSON.parse` is asynchronous, so other requests continue normally
- C) Parsing is synchronous CPU work that blocks every other request
- D) Express truncates the body to its default limit before parsing

**Answer:** C
**Explanation:** Limit body sizes, use streaming parsers (NDJSON), or offload to a worker thread.

### Q25 | Express | Compression
Where is gzip/brotli compression best done for a high-traffic Express app?

- A) In every route handler, so each route controls its own compression
- B) At the reverse proxy or CDN, so Node's event loop stays free
- C) Never, because compressed responses are slower to produce
- D) In the database, so documents are stored already compressed

**Answer:** B
**Explanation:** The `compression` middleware is fine for small apps, but compressing on the proxy offloads CPU work from Node.

### Q26 | Express | Static assets
How should content-hashed assets (`app.4f3a.js`) be served?

- A) `Cache-Control: public, max-age=31536000, immutable`
- B) `Cache-Control: no-store`, so users always get the latest file
- C) `Cache-Control: max-age=0`, so every request is revalidated
- D) No caching headers at all, so browsers decide for themselves

**Answer:** A
**Explanation:** The URL changes when the content changes, so it can be cached forever. HTML entry points should be revalidated.

### Q27 | Express | Sessions
`express-session` with the default `MemoryStore` runs behind PM2 in cluster mode (4 workers). What happens?

- A) It works fine, because workers share the same memory
- B) Each worker has its own memory, so sessions go missing across workers
- C) Cookies stop working once more than one worker is running
- D) Sessions expire instantly, because workers have different clocks

**Answer:** B
**Explanation:** Use a shared store (Redis, MongoDB) or stateless tokens in production.

### Q28 | Express | Redirects
Which status preserves the HTTP method and body on a redirect (e.g. POST stays POST) and is permanent?

- A) 301
- B) 303
- C) 302
- D) 308

**Answer:** D
**Explanation:** 307 (temporary) and 308 (permanent) preserve the method. `res.redirect()` defaults to 302.

### Q29 | Express | Cookies
A cross-site embedded widget needs a cookie. Which attribute combination is required?

- A) `SameSite=Strict`
- B) `SameSite=Lax; HttpOnly` only
- C) `SameSite=None; Secure`
- D) `Domain=*`

**Answer:** C
**Explanation:** Browsers reject `SameSite=None` cookies that are not `Secure`. Third-party cookies are also being restricted by browsers.

### Q30 | Express | Preflight
How can you reduce repeated `OPTIONS` preflight requests from browsers?

- A) Use `Cache-Control: no-cache` on the API responses
- B) Send `Access-Control-Max-Age` so browsers cache preflights
- C) Disable CORS and rely on the browser's same-origin rules
- D) Allow every header with `*`, so no preflight is needed

**Answer:** B
**Explanation:** Browsers cap the value (e.g. Chrome at 2 hours). Simple requests need no preflight at all.

### Q31 | Express | Headers sent
Why does this throw "Cannot set headers after they are sent"?

```js
app.get('/u', (req, res) => {
  if (!req.query.id) res.status(400).json({ error: 'id' });
  res.json({ ok: true });
});
```

- A) `json` is asynchronous, so it runs twice for each call
- B) The 400 status is invalid for a missing parameter
- C) There is no `return`, so both responses execute for a missing id
- D) The handler is missing a `next` call after the first response

**Answer:** C
**Explanation:** Use `return res.status(400).json(...)`. A response can only be sent once.

### Q32 | Express | Proxy trust
Your app is directly reachable from the internet and sets `trust proxy: true`. What is the rate-limiting risk?

- A) None, since the setting only affects logs
- B) Clients can spoof `X-Forwarded-For`, so `req.ip` can be forged
- C) The proxy blocks forged headers before they reach Express
- D) HTTPS breaks, because the protocol is read from the same header

**Answer:** B
**Explanation:** Trust only the number of hops or subnets you actually control, e.g. `app.set('trust proxy', 1)`.

### Q33 | Express | Graceful close
After `server.close(cb)` is called, when does `cb` fire?

- A) Immediately, because the callback fires when the listener is closed
- B) Never, unless the process receives a second signal
- C) After 30 seconds, which is the default connection timeout
- D) After all connections end, so keep-alive connections can delay it

**Answer:** D
**Explanation:** Close idle connections (`server.closeIdleConnections()`), and enforce a hard shutdown timeout.

### Q34 | Express | Error leakage
Which is the safest production error response?

- A) A generic message with an error id, details logged server-side
- B) `res.status(500).send(err.stack)`, so developers can debug quickly
- C) The raw MongoDB error, so the client knows which field failed
- D) The failing query text, so support can reproduce the problem

**Answer:** A
**Explanation:** Stack traces and driver errors reveal internals useful to attackers.

### Q35 | Express | Router stack
A large app registers 400 routes in one flat list. What performance effect does that have?

- A) There is no effect at all, since routing is a constant-time lookup
- B) Express caches every route after the first request
- C) Routes match in order, so grouping by prefix with routers saves work
- D) Routes are matched in parallel, so the count does not matter

**Answer:** C
**Explanation:** Express walks the stack linearly. Put hot routes first and mount sub-routers by path prefix.

### Q36 | Express | Timeouts
Which setting helps defend against slow clients that hold connections open (Slowloris-style)?

- A) Raising both timeouts to infinity, so slow clients can finish
- B) Sensible `headersTimeout` and `requestTimeout`, plus proxy limits
- C) Disabling keep-alive in the operating system
- D) Sending larger responses, so the connection is used longer

**Answer:** B
**Explanation:** Short timeouts free sockets held by clients that trickle data. Proxies such as Nginx or an ALB add further protection.

### Q37 | Express | Large JSON
An endpoint returns 200 MB of JSON built with `res.json(bigArray)`. What is the main issue?

- A) The JSON is invalid, because browsers reject payloads above 100 MB
- B) Express rejects any response bigger than its default limit
- C) `JSON.stringify` blocks the loop and buffers everything; stream instead
- D) The browser cannot read JSON, so the data must be sent as text

**Answer:** C
**Explanation:** Streaming keeps memory flat and lets the client start processing early.

### Q38 | Express | Statelessness
Which design allows scaling the API horizontally with no sticky sessions?

- A) Store the current user in a module-level variable for each instance
- B) Pin each user to one pod through sticky routing
- C) Use larger servers, so a single instance can handle all users
- D) Keep state in shared stores or signed tokens, not in process memory

**Answer:** D
**Explanation:** Any instance must be able to serve any request. In-process caches should be safe to lose.

### Q39 | Express | Retry safety
A load balancer retries a failed `POST /payments` on another instance. How is a double charge prevented?

- A) It is idempotent through an atomically stored idempotency key
- B) It cannot be prevented, because retries are invisible to the app
- C) Disable the balancer retries and ask clients to retry manually
- D) Switch the endpoint to GET, which is always safe to retry

**Answer:** A
**Explanation:** Network-layer retries are invisible to the app. Idempotency keys make retries safe.

### Q40 | Express | Observability
Which metric best reveals that 1% of users have a terrible experience while the average looks fine?

- A) Mean response time, since it summarises every request
- B) Average CPU use across the whole fleet of servers
- C) p99 latency, which shows the tail percentiles
- D) The total request count per minute for the service

**Answer:** C
**Explanation:** Averages hide tail latency. Track p50/p95/p99 and error rates per route.

### Q41 | React | Effect order
What is the console order on first mount?

```jsx
function Child() { useEffect(() => console.log('child effect')); return null; }
function Parent() {
  useEffect(() => console.log('parent effect'));
  console.log('parent render');
  return <Child />;
}
```

- A) parent effect, child effect, parent render
- B) parent render, parent effect, child effect
- C) child effect, parent render, parent effect
- D) parent render, child effect, parent effect

**Answer:** D
**Explanation:** Render goes top-down, effects run bottom-up (children before parents).

### Q42 | React | Update queue
What is the final value of `count` after one click (starting at 0)?

```jsx
setCount(count + 1);
setCount((c) => c + 1);
setCount(5);
```

- A) 1
- B) 2
- C) 7
- D) 5

**Answer:** D
**Explanation:** The queue is processed in order: set to 1, then 1 + 1 = 2, then replaced with 5. The last plain value wins.

### Q43 | React | Memo guarantees
Which statement about `useMemo` is correct?

- A) A performance hint: React may discard cached values at any time
- B) It guarantees the value is never recomputed during the component's life
- C) It runs after paint, so the value is always one render behind
- D) It memoises across components, so siblings can share the cached value

**Answer:** A
**Explanation:** Treat it as an optimisation. If code breaks without the memo, the logic is wrong.

### Q44 | React | Context splitting
A context holds `{ state, dispatch }` in one value. Components that only dispatch re-render on every state change. How do you fix it?

- A) Use `useRef` for the state, so consumers never re-render
- B) Split state and dispatch into two contexts, since dispatch is stable
- C) Wrap every consumer in `React.memo` so context changes are ignored
- D) Convert the consumers to class components, which skip context updates

**Answer:** B
**Explanation:** Consumers re-render when the value they subscribe to changes. A separate dispatch context never changes.

### Q45 | React | Deferred value
How does `useDeferredValue(query)` differ from `useTransition`?

- A) They are identical, and differ only in naming
- B) `useTransition` works only on the server during streaming
- C) Deferred value: one you receive; transition: an update you control
- D) `useDeferredValue` blocks rendering until the value is ready

**Answer:** C
**Explanation:** Both keep input responsive by lowering priority of heavy rendering. Use the deferred value when you don't own the setter.

### Q46 | React | Suspense pitfalls
Why does this create an infinite loading loop?

```jsx
function Profile({ id }) {
  const user = use(fetch(`/api/u/${id}`).then((r) => r.json()));
  return <h1>{user.name}</h1>;
}
```

- A) `use` cannot take promises, it only accepts context values
- B) `fetch` is synchronous here, so the component blocks before it renders
- C) A new promise is created on each render, so it suspends again
- D) JSX forbids calling `use` inside a returned expression

**Answer:** C
**Explanation:** The promise must be stable: create it in a Server Component, cache it, or use a data library.

### Q47 | React | Purity
Why is calling analytics `track('view')` directly in the render body a bug?

- A) Render can run several times or be discarded, so events may repeat
- B) It is slow, because analytics calls always take longer than a render
- C) Analytics calls need `await`, which is not allowed in render
- D) Hooks forbid calling plain functions during rendering

**Answer:** A
**Explanation:** Put side effects in event handlers or `useEffect` (with cleanup/idempotence).

### Q48 | React | flushSync
When is `flushSync` appropriate?

- A) For every state update, to keep the UI in sync at all times
- B) To fetch data before the next render starts, avoiding extra renders
- C) In rare cases needing an immediate DOM update, like scrolling to a new item
- D) For server-side rendering of the first page of the app

**Answer:** C
**Explanation:** It opts out of batching and hurts performance. Use sparingly.

### Q49 | React | Async effects
What is wrong with `useEffect(async () => { await load(); }, [])`?

- A) Nothing is wrong, since React awaits the callback
- B) Hooks cannot contain `await` anywhere in their body
- C) The effect runs twice, because async functions double-invoke
- D) The callback returns a Promise instead of a cleanup function

**Answer:** D
**Explanation:** Define an inner async function and call it, or use a data library. Handle cancellation in cleanup.

### Q50 | React | Event delegation
Since React 17, where does React attach its event listeners?

- A) The root container where the app is mounted
- B) Each individual DOM node that has an event handler
- C) The `document` object, as in React 16
- D) The `window` object, so all events are global

**Answer:** A
**Explanation:** This change made it easier to run multiple React versions on one page and to mix with other libraries.

### Q51 | React | Ref callbacks
What can a ref callback return in React 19?

- A) A Promise that resolves once the element is mounted
- B) Nothing, since ref callbacks must not return a value
- C) A boolean telling React whether to keep the ref attached
- D) A cleanup function, called when the element is removed

**Answer:** D
**Explanation:** Previously React called the callback with `null` on unmount. With a cleanup function this no longer happens.

### Q52 | React | Compiler
What does the React Compiler do?

- A) It compiles JSX to PHP, so components can run on any server
- B) It removes the need for state, by tracking values automatically
- C) It memoises components and values at build time, given pure code
- D) It runs only on the server, to pre-compute output for the client

**Answer:** C
**Explanation:** It reduces the need for manual `useMemo`/`useCallback`. Impure render code can make it skip components.

### Q53 | React | Transitions
During a transition update, the user types in an input. What does React do?

- A) It interrupts the transition and handles the urgent input update first
- B) It waits until the transition has finished before accepting input
- C) It cancels the typing, so only the transition is applied
- D) It crashes with an error about concurrent updates

**Answer:** A
**Explanation:** Transitions are low-priority, interruptible renders.

### Q54 | React | Lists
Which is a safe key for items that can be reordered and have an `id` from the database?

- A) The item's stable `id` from the database
- B) A fresh `Math.random()` value generated on every render
- C) The item's current position in the array
- D) A `Date.now()` timestamp taken during render

**Answer:** A
**Explanation:** Random keys force a remount every render. Index keys misattribute state when the order changes.

### Q55 | React | Context default
What does `useContext(MyCtx)` return when there is no provider above?

- A) Always `undefined`, regardless of the default value given
- B) An error is thrown whenever a provider is missing
- C) Always `null`, so consumers must check before use
- D) The default value passed to `createContext(default)`

**Answer:** D
**Explanation:** Many libraries check for a missing provider by making the default `undefined` and throwing a helpful error in a custom hook.

### Q56 | React | Next.js · Cache layers
Several Server Components fetch the same `GET /api/user` during one render pass. Which mechanism de-duplicates the calls?

- A) Router Cache
- B) Full Route Cache
- C) Request Memoization
- D) Browser cache

**Answer:** C
**Explanation:** React/Next memoise identical GET `fetch` calls within a single server render. It is separate from the persistent Data Cache.

### Q57 | React | Next.js · Router cache
Since Next.js 15, what changed about the client Router Cache for page segments?

- A) The cache is permanent for the whole session and never refreshes
- B) Page segments are not reused from the Router Cache by default
- C) The Router Cache was removed completely in version 15
- D) It caches only images, not page segments

**Answer:** B
**Explanation:** Layouts and loading states can still be reused. You can opt back in with `experimental.staleTimes`.

### Q58 | React | Next.js · Hydration errors
What is a common cause of a hydration error with plain markup?

- A) Putting a `<p>` element inside a `<div>` wrapper element
- B) Using CSS modules for the class names of the elements
- C) Invalid nesting such as `<div>` inside `<p>`, which browsers rewrite
- D) Having two components return the same element type

**Answer:** C
**Explanation:** The browser auto-closes `<p>` before a block element, leaving a structure React doesn't expect. Same for `<a>` in `<a>` and tables.

### Q59 | React | Next.js · Dynamic import
Where can `next/dynamic` with `ssr: false` be used?

- A) Anywhere in the app, including inside Server Components
- B) Inside Client Components, for browser-only code that touches `window`
- C) Only inside the `middleware.ts` file of the project
- D) Only inside API route handlers in the `app` directory

**Answer:** B
**Explanation:** It lazy-loads the component in a separate chunk. In Server Components, `ssr: false` is not allowed.

### Q60 | React | Next.js · Server-only code
How do you ensure a module with database access is never bundled into client code?

- A) Add a comment at the top of the file saying it is server-only
- B) Name the file `server.js` so the bundler leaves it out
- C) `import 'server-only'` at the top, so client imports fail the build
- D) Use `NEXT_PUBLIC_` environment variables for the connection string

**Answer:** C
**Explanation:** It is a guard rail for accidental imports through Client Components.

### Q61 | Node.js | Ordering
What is the output order?

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3)).then(() => console.log(4));
process.nextTick(() => console.log(5));
queueMicrotask(() => console.log(6));
console.log(7);
```

- A) 1 7 2 5 3 6 4
- B) 1 7 3 4 5 6 2
- C) 1 5 3 6 4 7 2
- D) 1 7 5 3 6 4 2

**Answer:** D
**Explanation:** Sync: 1, 7. Then the nextTick queue (5), then microtasks in order (3, 6, then 4 which was queued by 3), then the timer (2).

### Q62 | Node.js | Async ordering
What is printed?

```js
async function f() { console.log('a'); await null; console.log('b'); }
f();
console.log('c');
```

- A) a b c
- B) c a b
- C) a c b
- D) b a c

**Answer:** C
**Explanation:** The async function runs synchronously until the first `await`; the rest becomes a microtask.

### Q63 | Node.js | Sequential vs parallel
Three independent calls each take about 100 ms. Approximately how long do these take?

```js
for (const id of ids) await call(id);                 // X
await Promise.all(ids.map((id) => call(id)));         // Y
```

- A) X ≈ 100 ms, Y ≈ 300 ms
- B) Both ≈ 100 ms
- C) Both ≈ 300 ms
- D) X ≈ 300 ms, Y ≈ 100 ms

**Answer:** D
**Explanation:** Awaiting inside the loop serialises the work. `Promise.all` starts them together (watch out for overloading downstream services).

### Q64 | Node.js | libuv
What is the default size of the libuv thread pool, and what uses it?

- A) 1, used only for the `fs` module
- B) Equal to the number of CPU cores, used for all JavaScript
- C) 16, used only for network sockets
- D) 4, used by `fs`, `crypto`, `zlib` and `dns.lookup`

**Answer:** D
**Explanation:** Network I/O uses the OS (epoll/kqueue/IOCP), not the pool. Tune with `UV_THREADPOOL_SIZE` when many crypto or fs operations queue up.

### Q65 | Node.js | JS gotcha
What is the result?

```js
console.log(['1', '2', '3'].map(parseInt));
```

- A) [1, 2, 3]
- B) [1, 2, NaN]
- C) [1, NaN, NaN]
- D) [NaN, NaN, NaN]

**Answer:** C
**Explanation:** `map` passes `(value, index)`, so `parseInt('2', 1)` and `parseInt('3', 2)` use invalid radixes and return `NaN`.

### Q66 | Node.js | Event-loop lag
Which API measures event loop delay to detect blocking?

- A) `process.hrtime` on its own, without any timers
- B) `os.loadavg()`, which reports the system load average
- C) `fs.watch`, watching the event loop's worker file
- D) `perf_hooks.monitorEventLoopDelay()`

**Answer:** D
**Explanation:** It records a histogram (mean, p99, max). Alert if p99 delay rises.

### Q67 | Node.js | Profiling
A service has high CPU and slow responses. What is the best first step?

- A) Add more servers first, then measure the response times later on
- B) Rewrite the service in a faster language straight away, before measuring
- C) Increase the heap size until the response times start to drop
- D) Take a CPU profile or flame graph to find the hot function

**Answer:** D
**Explanation:** Measure first. Flame graphs show where time is actually spent, e.g. regex, JSON or synchronous crypto.

### Q68 | Node.js | Leak hunting
How do you find what is leaking memory in a running Node service?

- A) Take heap snapshots over time and compare retained objects
- B) Restart the service daily so the memory is always fresh
- C) Call `gc()` constantly until the heap stops growing
- D) Disable logging, because log objects are the usual cause

**Answer:** A
**Explanation:** Look at objects growing between snapshots and follow their retainer paths.

### Q69 | Node.js | WeakMap
Why use a `WeakMap` for metadata keyed by objects?

- A) It keeps entries in insertion order, which a normal Map does not
- B) It allows string keys that are removed after a time-to-live
- C) Entries vanish when the key object is garbage-collected
- D) It is faster than Map in every case, so it is the default choice

**Answer:** C
**Explanation:** A normal `Map` holds a strong reference to every key, which can create leaks.

### Q70 | Node.js | Large files
What is a good way to process a 5 GB log file line by line?

- A) `readline` over `fs.createReadStream()`, using `for await`
- B) `fs.readFileSync().split('\n')`, which loads the file once
- C) `Promise.all` over every character in the file
- D) `require()` the log file as if it were a module

**Answer:** A
**Explanation:** Streaming keeps memory bounded and handles backpressure.

### Q71 | Node.js | Connections
A service makes thousands of HTTPS calls per second to one upstream and shows many sockets in TIME_WAIT and high latency. What helps?

- A) Creating a new agent for every request, so sockets are never shared
- B) Reducing the timeout to 1 ms, so connections close quickly
- C) A shared keep-alive agent, so TCP and TLS handshakes are reused
- D) Using `http` instead of `https` so the handshake is skipped

**Answer:** C
**Explanation:** Handshakes are expensive. Pools also cap concurrency to protect the upstream.

### Q72 | Node.js | child_process
What is the difference between `exec` and `spawn`?

- A) `exec` buffers output (about 1 MB) in a shell; `spawn` streams it
- B) There is no difference apart from the name of the function
- C) `spawn` is synchronous, while `exec` is asynchronous
- D) `exec` streams output as it arrives, while `spawn` buffers it all

**Answer:** A
**Explanation:** Use `spawn` for large or long-running output. Never pass unsanitised input to `exec` (command injection).

### Q73 | Node.js | process.exit
Why can `process.exit()` right after `console.log` or a pending write lose data?

- A) It never loses data, since Node always flushes before exiting
- B) It flushes everything, including data buffered in streams
- C) It waits forever for all timers, even ones that never fire
- D) It exits immediately without waiting for pending async I/O

**Answer:** D
**Explanation:** Prefer setting `process.exitCode` and letting the loop drain, or flush explicitly before exit.

### Q74 | Node.js | Modules
`a.js` requires `b.js`, and `b.js` requires `a.js` at the top, before `a.js` sets `module.exports`. What does `b.js` receive?

- A) The final exports of `a`, as if the module had finished loading
- B) `null`, because the module is still loading
- C) A partially filled, initially empty `exports` object
- D) A thrown error that reports the circular dependency

**Answer:** C
**Explanation:** CommonJS returns the exports as they exist at the time of the circular require. Restructure, or require lazily.

### Q75 | Node.js | `this`
In a CommonJS module, what does this log?

```js
const o = { n: 1, f() { return [1].map(() => this.n); }, g: () => this.n };
console.log(o.f(), o.g());
```

- A) [ 1 ] 1
- B) [ 1 ] undefined
- C) [ undefined ] undefined
- D) TypeError

**Answer:** B
**Explanation:** Arrow functions capture `this` lexically. In `f`, it is `o`; in `g`, it is the module-level `this`, which is `module.exports` (`{}`), so `.n` is `undefined`.

### Q76 | Node.js | TypeScript
What is the type of `X`?

```ts
type X = string extends 'a' ? 1 : 2;
```

- A) 1
- B) `never`
- C) 2
- D) `1 | 2`

**Answer:** C
**Explanation:** `string` is not assignable to the literal `'a'`, so the false branch is taken.

### Q77 | Node.js | TypeScript
What does `noUncheckedIndexedAccess` change?

- A) Arrays become immutable, so index assignment is a compile error
- B) Indexed access like `arr[i]` returns `T | undefined`
- C) Disables `any` for every function parameter in the project
- D) Makes imports faster by skipping type resolution

**Answer:** B
**Explanation:** It catches out-of-bounds access bugs that normal strict mode misses.

### Q78 | Node.js | Testing
A test suite passes locally but fails randomly in CI. What is the most likely class of cause?

- A) The wrong Node binary is installed on the CI runners
- B) The tests are too short, so they finish before the app starts
- C) Timers, ordering assumptions, shared rows or unawaited promises
- D) TypeScript compiles differently on CI than on a laptop

**Answer:** C
**Explanation:** Isolate state per test, use fake timers or explicit waits, and await all async work.

### Q79 | Node.js | Fake timers
You test a retry with a 30-second backoff. What is the practical approach?

- A) Wait 30 seconds in the test, so the real backoff elapses
- B) Lower the timeout in the production code so the test runs faster
- C) Skip the test, since backoff logic cannot be tested reliably
- D) Use fake timers and advance them, flushing pending promises

**Answer:** D
**Explanation:** Fake timers make time deterministic. Advance async timers so promise continuations run.

### Q80 | Node.js | Reliability
Which practice best prevents one slow dependency from exhausting your service?

- A) Unlimited retries, so every request is eventually served
- B) Increasing the heap, so more pending requests fit in memory
- C) Per-call timeouts, bounded concurrency and circuit breakers
- D) Bigger log files, so a slow dependency can be diagnosed later

**Answer:** C
**Explanation:** Without timeouts, requests pile up and consume sockets and memory until the whole service stalls.
