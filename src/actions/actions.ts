import { fileCommand, prepareKeyValue } from './file-command';
import { logCommand } from './log-command';

/**
 * Writes debug message to user log
 * https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#setting-a-debug-message
 * @param message debug message
 * @param options optional command options. See commandOptions
 */
export const debug = (message: string) => {
  logCommand('debug', message);
};

/**
 * Adds an error message
 * @param message error message
 * @param options optional command options. See commandOptions
 */
export const error = (message: string) => {
  logCommand('error', message);
};

/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param err add error
 */
export const failed = (err: unknown) => {
  // Make sure the outputs are empty or false.
  setOutput('output', '');
  setOutput('hit', false);

  // If err not an Error, throw it.
  // https://stackoverflow.com/a/70993058
  if (!(err instanceof Error)) throw err;

  process.exitCode = 1;
  error(err.message);
};

/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 * @param options optional command options. See commandOptions
 */
export const startGroup = (name: string) => {
  logCommand('group', name);
};

/**
 * End an output group.
 * @param options optional command options. See commandOptions
 */
export const endGroup = () => {
  logCommand('endgroup', '');
};

/**
 * Gets the input of an input.
 * Returns an empty string if the value is not defined.
 * @param name name of the input to get
 * @returns 
 */
export const getInput = (name: string): string => {
  const value: string = process.env[`INPUT_${name.toLocaleUpperCase()}`] || '';

  return value.trim();
};

/**
 * Sets the value of an output.
 * https://github.com/actions/toolkit/issues/1218#issuecomment-1288890856
 * @param key keys of the output to set
 * @param value value to store. Non-string values will be converted to a string via JSON.stringify
 */
export const setOutput = (key: string, value: unknown) => {
  const filePath = process.env['GITHUB_OUTPUT'] || '';

  if (filePath) {
    fileCommand('OUTPUT', prepareKeyValue(key, value));
  }
};