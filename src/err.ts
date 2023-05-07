import { debug, setFailed, setOutput } from '@actions/core';

// setErr sets all outputs when catching err, logs error and sets a failing exit code.
export const setErr = (err: unknown) => {
  // If err not an Error, throw it.
  // https://stackoverflow.com/a/70993058
  if (!(err instanceof Error)) throw err;

  debug('Setting error and outputs');
  setOutput('output', '');
  setOutput('hit', false);
  setFailed(err.message);
  throw err;
};
