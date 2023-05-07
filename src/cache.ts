import { restoreCache, saveCache } from '@actions/cache';
import { debug } from '@actions/core';

// getRestoreCache restore the cache if it exist.
const getRestoreCache = async(paths: string[], key: string) => {
  if (!paths || !key) throw new Error('No supplied paths and/or key.');

  debug(`Starting to restore cache:
  paths: ${paths}
  key: ${key}`);

  const cacheKey = await restoreCache(paths, key);

  // Cache restored
  debug(`cacheKey: ${cacheKey}`);
  console.log(`Cache restored from key: ${key}`);
  return cacheKey;
};

// getSaveCache save the cache.
const getSaveCache = async(paths: string[], key: string) => {
  if (!paths || !key) throw new Error('No supplied paths and/or key.');

  debug(`Starting to save cache:
  paths: ${paths}
  key: ${key}`);

  const cacheId = await saveCache(paths, key);

  // Cache saved
  debug(`cacheId: ${cacheId}`);
  console.log(`Cache saved with key: ${key}`);
  return cacheId;
};

// isCacheHit set hit to true if restore the cache,
// otherwize set hit to false.
export const isCacheHit = async(paths: string[], key: string) => {
  const cacheKey = await getRestoreCache(paths, key);
  if (!cacheKey) {
    await getSaveCache(paths, key);
    return false;
  }

  return true;
};