import { isCacheFound } from './actions/cache';
import { getCommandOutput } from './actions/command';
import { error, getInput, setOutput } from '@actions/core';

const run = async () => {
  // Getting the output of the input run
  const output = await getCommandOutput(getInput('run', { required: true }));
  setOutput('output', output);

  // Cache file used as a placeholder
  const file = '.cacheFile';

  // Set the output hit depending on whether the cache is found or not
  setOutput('hit', await isCacheFound(file, output));
};

run().catch((err) => {
  // Make sure the outputs are null or false.
  setOutput('output', '');
  setOutput('hit', false);

  // If err not an Error, throw it.
  // https://stackoverflow.com/a/70993058
  if (!(err instanceof Error)) throw err;

  process.exitCode = 1;
  error(err.message);
});