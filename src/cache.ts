import { restoreCache, saveCache } from '@actions/cache';
import { debug } from '@actions/core';

// isCacheHit set hit to true if restore the cache,
// otherwize set hit to false.
export const isCacheHit = async (paths: string, key: string) => {
  debug(`Is cache hit:
  paths: ${paths}
  key: ${key}`);

  const cacheKey = await restoreCache([paths], key);

  if (!cacheKey) {
    const cacheId = await saveCache([paths], key);

    if (cacheId !== -1) {
      console.log(`Cache saved with key: ${key}`);
    }
    return false;
  }

  console.log(`Cache restored from key: ${key}`);
  return true;
};