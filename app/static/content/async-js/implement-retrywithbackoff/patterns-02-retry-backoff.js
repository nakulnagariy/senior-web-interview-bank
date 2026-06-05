/**
 * Category: Patterns
 * Question: Retry transient failures with exponential backoff and jitter.
 *
 * Senior expectation:
 * - Retry only retryable failures (network, 5xx).
 * - Use capped retries and jitter to avoid thundering herd.
 */

function isRetryableStatus(status) {
  if (status == null) return true;
  return status >= 500;
}

async function retryWithBackoff(fn, maxRetries, baseDelayMs) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const shouldRetry = isRetryableStatus(status);
      if (!shouldRetry || attempt === maxRetries) throw err;

      const jitter = 0.5 + Math.random() * 0.5;
      const delay = baseDelayMs * (2 ** attempt) * jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/*
 * Trade-off:
 * - Improves reliability for flaky networks.
 * - Increases worst-case latency and load if retry policy is too aggressive.
 */
