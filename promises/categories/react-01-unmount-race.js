/**
 * Category: React + Promises
 * Question: Component unmounts before async state update.
 *
 * Senior expectation:
 * - Mention post-unmount setState risk and stale-data races.
 * - Show cleanup with AbortController or take-latest guard.
 */

function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const controller = new AbortController();

    fetchUserData(userId, { signal: controller.signal })
      .then((data) => setUser(data))
      .catch((err) => {
        if (err?.name !== 'AbortError') setError(err);
      });

    return () => controller.abort();
  }, [userId]);

  if (error) return React.createElement('div', null, String(error));
  if (!user) return React.createElement('div', null, 'Loading...');
  return React.createElement('div', null, user.name);
}

/*
 * Trade-off:
 * - Safer lifecycle handling and fewer stale writes.
 * - Requires cancellation support in data layer.
 */
