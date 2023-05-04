import { setOutput, setFailed, debug } from '@actions/core';

// handleErr sets all outputs when catching err, logs error and sets a failing exit code.
export function handleErr(err: unknown) {
  // If err not an Error, throw it.
  // https://stackoverflow.com/a/70993058
  if (!(err instanceof Error)) throw err;

  debug('Starting to handle error');
  setOutput('output', '');
  setOutput('hit', false);
  setFailed(err.message);
  throw err;
}
