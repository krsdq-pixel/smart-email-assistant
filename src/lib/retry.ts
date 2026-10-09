export async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let tries = 0;

  while (tries < retries) {
    try {
      return await fn();
    } catch (error) {
      tries += 1;
      if (tries >= retries) {
        throw error;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 200 * tries));
    }
  }

  throw new Error('Retryable operation failed');
}
