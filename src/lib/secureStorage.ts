import localforage from 'localforage';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'smart-email-assistant-v1';
const TEMP_KEY = `${STORAGE_KEY}:tmp`;

const store = localforage.createInstance({
  name: 'smart-email-assistant',
  storeName: 'app-state',
});

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function withRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await delay(250 * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Persistence failed');
}

function isCapacitorAvailable(): boolean {
  return Boolean(
    (window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.(),
  );
}

export async function readSecure<T>(key: string): Promise<T | null> {
  return withRetry(async () => {
    if (isCapacitorAvailable()) {
      const result = await Preferences.get({ key });
      if (!result.value) {
        return null;
      }

      try {
        return JSON.parse(result.value) as T;
      } catch {
        return null;
      }
    }

    const value = await store.getItem<string>(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  });
}

export async function writeSecure<T>(key: string, value: T): Promise<void> {
  await withRetry(async () => {
    const payload = JSON.stringify(value);

    if (isCapacitorAvailable()) {
      await Preferences.set({ key, value: payload });
      return;
    }

    await store.setItem(key, payload);
  });
}

export async function removeSecure(key: string): Promise<void> {
  await withRetry(async () => {
    if (isCapacitorAvailable()) {
      await Preferences.remove({ key });
      return;
    }

    await store.removeItem(key);
  });
}

export async function saveTransactional<T>(key: string, value: T): Promise<void> {
  await withRetry(async () => {
    await writeSecure(TEMP_KEY, value);
    await writeSecure(key, value);
    await removeSecure(TEMP_KEY);
  });
}

export async function readAppState<T>(key = STORAGE_KEY): Promise<T | null> {
  return readSecure<T>(key);
}

export async function writeAppState<T>(state: T, key = STORAGE_KEY): Promise<void> {
  await saveTransactional(key, state);
}
