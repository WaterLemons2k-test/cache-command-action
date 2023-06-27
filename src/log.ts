import { setFailed, setOutput } from '@actions/core';

// replaceLF replace Line feed to an URL encoded character.
// https://www.eso.org/~ndelmott/url_encode.html
const replaceLF = (s: string) => {
  return s.replace(/\n/g, '%0A');
};

/**
 * Writes debug message to user log
 * https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#setting-a-debug-message
 * @param message debug message
 */
export const debug = (message: string) => {
  console.log(`::debug::${replaceLF(message)}`);
};

/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param err add error
 */
export const failed = (err: unknown) => {
  // If err not an Error, throw it.
  // https://stackoverflow.com/a/70993058
  if (!(err instanceof Error)) throw err;

  debug('Failed');

  // Make sure outputs are empty or false.
  setOutput('output', '');
  setOutput('hit', false);

  setFailed(err.message);
  throw err;
};

/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
export const startGroup = (name: string) => {
  console.log(`::group::${replaceLF(name)}`);
};

/**
 * End an output group.
 */
export const endGroup = () => {
  console.log('::endgroup::');
};