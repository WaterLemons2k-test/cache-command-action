import { debug, setFailed, setOutput } from '@actions/core';

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