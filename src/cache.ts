import { restoreCache, saveCache } from '@actions/cache';
import { setOutput, info, debug } from '@actions/core';

// restoreOrSaveCache restore the cache if the cache hits,
// otherwize save the cache.
export async function restoreOrSaveCache(paths: string[], key: string) {
  if (!paths || !key) throw new Error('restoreOrSaveCache: No supplied paths or key.');

  debug(`Starting to restore cache:
  paths: ${paths}
  key: ${key}`);

  const cacheKey = await restoreCache(paths, key);
  if (!cacheKey) {
    // Cache not restored
    debug('Cache not found, save');
    await saveCache(paths, key);
    info(`Cache saved with key: ${key}`);
    setOutput('hit', false);
    return;
  }

  // Cache restored
  debug('Cache restored');
  info(`Cache restored from key: ${key}`);
  setOutput('hit', true);
}
