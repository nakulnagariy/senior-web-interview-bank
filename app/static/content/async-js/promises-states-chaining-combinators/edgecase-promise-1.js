/**
 * Interview Question
 * ------------------
 * A senior engineer writes code to run two independent API calls "in parallel":
 *
 * async function getDashboardData() {
 *   const user = await fetchUser();
 *   const stats = await fetchStats(); // is this parallel?
 *   return { user, stats };
 * }
 *
 * Explain why this is not parallel, and fix it without changing overall structure.
 */

/*
 * Why it is NOT parallel
 * ----------------------
 * await is sequential in this arrangement.
 * - fetchUser() starts first.
 * - Execution pauses until fetchUser resolves/rejects.
 * - Only then does fetchStats() start.
 *
 * If both calls take about 500ms each, this pattern takes about 1000ms total.
 */

/*
 * Correct idiomatic fix (parallel + fail-fast)
 * --------------------------------------------
 * Keep the same function structure, but start both promises before awaiting.
 */
async function getDashboardData() {
	const [user, stats] = await Promise.all([fetchUser(), fetchStats()]);
	return { user, stats };
}

/*
 * Trade-off: Promise.all is fail-fast
 * -----------------------------------
 * If either promise rejects, the whole await rejects immediately.
 * This is usually correct for "all-or-nothing" dashboard rendering.
 */

/*
 * Alternative when partial data is acceptable
 * -------------------------------------------
 * Use Promise.allSettled to receive both outcomes and decide what to render.
 */
async function getDashboardDataPartialOk() {
	const [userResult, statsResult] = await Promise.allSettled([
		fetchUser(),
		fetchStats(),
	]);

	const user = userResult.status === 'fulfilled' ? userResult.value : null;
	const stats = statsResult.status === 'fulfilled' ? statsResult.value : null;

	return {
		user,
		stats,
		errors: {
			user: userResult.status === 'rejected' ? userResult.reason : null,
			stats: statsResult.status === 'rejected' ? statsResult.reason : null,
		},
	};
}

/*
 * Important interview nuance
 * --------------------------
 * Do NOT parallelize blindly.
 * If one request depends on the result of the other, sequential await is intentional.
 */
