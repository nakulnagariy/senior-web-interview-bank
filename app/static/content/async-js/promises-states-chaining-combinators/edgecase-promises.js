/**
 * Interview Question
 * ------------------
 * In a React application, a component makes an API call and updates state on resolution.
 * The component unmounts before the call resolves.
 *
 * useEffect(() => {
 *   fetchUserData(userId).then(data => setUser(data)); // problem
 * }, [userId]);
 *
 * Problems This Causes
 * --------------------
 * 1. State update after unmount:
 *    setUser runs when the component no longer exists. React ignores it, but it indicates
 *    lifecycle bugs and can hide resource leaks.
 *
 * 2. Race condition / stale data:
 *    If userId changes quickly, an older request can resolve after the latest request and
 *    overwrite UI with stale data.
 *
 * 3. Wasted network + CPU:
 *    Requests continue even when no longer needed (unmounted or replaced by newer request).
 *
 * 4. Weak error handling:
 *    Missing catch can lead to unhandled rejection noise and unstable behavior.
 *
 * 5. StrictMode amplification in development:
 *    Effect setup/cleanup can run multiple times in dev, exposing missing cleanup logic.
 */

/*
 * Solution 1: AbortController in useEffect cleanup (best default)
 * ---------------------------------------------------------------
 * - Cancels in-flight request on unmount or dependency change.
 * - Prevents stale updates and reduces wasted work.
 */
function UserProfileAbort({ userId }) {
	const [user, setUser] = React.useState(null);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		const controller = new AbortController();

		(async () => {
			try {
				const data = await fetchUserData(userId, { signal: controller.signal });
				setUser(data);
			} catch (err) {
				if (err?.name !== 'AbortError') {
					setError(err);
				}
			}
		})();

		return () => controller.abort();
	}, [userId]);

	if (error) return React.createElement('div', null, String(error));
	if (!user) return React.createElement('div', null, 'Loading...');
	return React.createElement('div', null, user.name);
}

/*
 * Trade-offs (Solution 1)
 * - Pros: true cancellation, less wasted network work, good default pattern.
 * - Cons: requires API layer/client to support AbortSignal wiring.
 */

/*
 * Solution 2: Request versioning (take-latest) with ref
 * ------------------------------------------------------
 * - Works even if transport layer cannot be cancelled.
 * - Only latest request is allowed to update state.
 */
function UserProfileTakeLatest({ userId }) {
	const [user, setUser] = React.useState(null);
	const [error, setError] = React.useState(null);
	const latestReqRef = React.useRef(0);

	React.useEffect(() => {
		const reqId = ++latestReqRef.current;

		fetchUserData(userId)
			.then((data) => {
				if (reqId === latestReqRef.current) {
					setUser(data);
				}
			})
			.catch((err) => {
				if (reqId === latestReqRef.current) {
					setError(err);
				}
			});
	}, [userId]);

	if (error) return React.createElement('div', null, String(error));
	if (!user) return React.createElement('div', null, 'Loading...');
	return React.createElement('div', null, user.name);
}

/*
 * Trade-offs (Solution 2)
 * - Pros: simple, library-agnostic, handles stale overwrite race.
 * - Cons: does NOT cancel actual network call; wasted work still happens.
 */

/*
 * Solution 3: Data-fetching architecture (React Query style)
 * ----------------------------------------------------------
 * - Move async lifecycle, cancellation, cache, retries, dedupe into a data layer.
 */
function useUserQuery(userId) {
	return ReactQuery.useQuery({
		queryKey: ['user', userId],
		queryFn: ({ signal }) => fetchUserData(userId, { signal }),
		staleTime: 30_000,
	});
}

function UserProfileDataLayer({ userId }) {
	const { data, error, isLoading } = useUserQuery(userId);

	if (isLoading) return React.createElement('div', null, 'Loading...');
	if (error) return React.createElement('div', null, String(error));
	return React.createElement('div', null, data.name);
}

/*
 * Trade-offs (Solution 3)
 * - Pros: most scalable architecture; standardized cancellation/cache/retries.
 * - Pros: reduces repeated effect bugs across many components.
 * - Cons: dependency and learning overhead; requires team conventions.
 */

/*
 * Interview Closing Line
 * ----------------------
 * "For a single component, I'd use AbortController cleanup.
 * If cancellation isn't available, I'd add take-latest guards.
 * At app scale, I'd move to a query/data layer for consistency and reliability."
 */