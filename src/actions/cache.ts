import { createFile, deleteFile } from '../file';
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
    // Create a cache file to be used as a placeholder before saving cache
    createFile(file);
    const cacheId = await saveCache([file], output);

    if (cacheId !== -1) {
      console.log(`Cache saved with output: ${output}`);
    }

    // Delete the file after saving cache as it is no longer needed
    deleteFile(file);
    return false;
  }

  console.log(`Cache found from output: ${output}`);
  return true;
};