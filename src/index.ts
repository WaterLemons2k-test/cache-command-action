import { isCacheFound } from './actions/cache';
import { getCommandOutput } from './actions/command';
import { getInput, setFailed, setOutput } from '@actions/core';

const run = async () => {
  // Getting the output of the input run
  const output = await getCommandOutput(getInput('run', { required: true }));
  setOutput('output', output);

  // Cache file used as a placeholder
  const file = '.cache-command-action-file';

  // Set the output hit depending on whether the cache is found or not
  setOutput('hit', await isCacheFound(file, output));
};

run().catch((err) => {
  // Ensure output hit is false
  setOutput('hit', false);
  setFailed(err.message);
});