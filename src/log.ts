import { setFailed, setOutput } from '@actions/core';

// replaceLF replace Line feed to an URL encoded character.
// https://www.eso.org/~ndelmott/url_encode.html
const replaceLF = (s: string) => {
  return s.replace(/\n/g, '%0A');
}

// debug setting a debug message.
// https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#setting-a-debug-message
export const debug = (message: string) => {
  console.log(`::debug::${replaceLF(message)}`);
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