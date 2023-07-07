import { restoreCache, saveCache } from '@actions/cache';

/**
 * Return true if found the cache, otherwize return false.
 * @param file The file to be found from the cache
 * @param output an explicit output for found the cache
 * @returns boolean
 */
export const isCacheFound = async (
  file: string,
  output: string
): Promise<boolean> => {
  const cacheOutput = await restoreCache(
    [file],
    output,
    [],
    { lookupOnly: true }
  );

  if (!cacheOutput) {
    const cacheId = await saveCache([file], output);

    if (cacheId !== -1) {
      console.log(`Cache saved with output: ${output}`);
    }
    return false;
  }

  console.log(`Cache found from output: ${output}`);
  return true;
};