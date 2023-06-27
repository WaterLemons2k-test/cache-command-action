import { setFailed, setOutput } from '@actions/core';
import { commandOptions } from './interfaces';

// replaceLF replace Line feed to an URL encoded character.
// https://www.eso.org/~ndelmott/url_encode.html
const replaceLF = (s: string) => {
  return s.replace(/\n/g, '%0A');
};

/**
 * Writing logs with a command
 * https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
 * @param command Command of the message
 * @param message The message that will replace Line feed
 * @param options optional command options. See commandOptions
 */
const logCommand = (command: string, message: string, options?: commandOptions) => {
  command = '::' + command + '::';
  if (options?.newLine) {
    command = '\n' + command;
  }

  console.log(command + replaceLF(message));
};

/**
 * Writes debug message to user log
 * https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#setting-a-debug-message
 * @param message debug message
 * @param options optional command options. See commandOptions
 */
export const debug = (message: string, options?: commandOptions) => {

  logCommand('debug', message, options);
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
 * @param options optional command options. See commandOptions
 */
export const startGroup = (name: string, options?: commandOptions) => {
  logCommand('group', name, options);
};

/**
 * End an output group.
 * @param options optional command options. See commandOptions
 */
export const endGroup = (options?: commandOptions) => {
  logCommand('endgroup', '', options);
};