import { setFailed, setOutput } from '@actions/core';

// debug setting a debug message.
// https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#setting-a-debug-message
export const debug = (message: string) => {
  console.log(`::debug::${message}`);
}

// failed sets all outputs to false when catching err,
// logs error and sets a failing exit code.
export const failed = (err: unknown) => {
  // If err not an Error, throw it.
  // https://stackoverflow.com/a/70993058
  if (!(err instanceof Error)) throw err;

  debug('Failed');
  setOutput('output', '');
  setOutput('hit', false);
  setFailed(err.message);
  throw err;
};