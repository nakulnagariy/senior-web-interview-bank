/**
 * Category: Combinators
 * Question: Add timeout to a fetch and avoid dangling in-flight requests.
 *
 * Senior expectation:
 * - Promise.race only decides winner; loser still continues unless canceled.
 * - Use AbortController to cancel the request when timeout wins.
 */

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/*
 * Trade-off:
 * - More robust than naive race.
 * - Requires API client support for AbortSignal.
 */
