# React Query / SWR: Caching & Stale-While-Revalidate

## What is React Query / SWR?
- React Query and SWR are data-fetching libraries for React that provide caching, background updates, and synchronization with the server.

## Caching
- Both libraries cache fetched data in memory.
- Cached data is reused for subsequent requests with the same key, reducing network calls and improving performance.
- Cache can be invalidated or refetched based on configuration or user actions.

## Stale-While-Revalidate (SWR)
- SWR is a caching strategy where stale (old) data is shown immediately while a new request is made in the background.
- The UI is always responsive: users see data instantly, and it updates when fresh data arrives.
- Reduces perceived latency and keeps data fresh.

## Key Features
- **Automatic background revalidation:** Data is refetched in the background on focus, interval, or network reconnect.
- **Deduplication:** Multiple components using the same key share the same cache and network request.
- **Configurable staleness:** Control how long data is considered fresh vs. stale.

## Example

```js
// SWR
const { data, error, isLoading } = useSWR('/api/user', fetcher);

// React Query
const { data, error, isLoading } = useQuery(['user', userId], fetchUser);
```

### Summary
- React Query and SWR provide powerful caching and data synchronization features for React applications.
- Caching reduces redundant network requests and improves performance.
- Stale-While-Revalidate keeps the UI responsive while ensuring data is fresh.
- Use these libraries to manage server state effectively and improve user experience in your React applications.
- Both libraries have similar concepts but different APIs and configurations, so choose based on your specific needs
- Consider the trade-offs of caching and revalidation strategies based on your application's requirements for freshness, performance, and user experience.
- Monitor cache performance and revalidation behavior in production to ensure it meets your application's needs and adjust configurations as necessary.
- React Query and SWR use caching and stale-while-revalidate to provide fast, up-to-date data.
- They improve UX by showing cached data instantly and updating in the background.