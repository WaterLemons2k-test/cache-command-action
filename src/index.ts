import { isCacheFound } from './actions/cache';
import { getCommandOutput } from './actions/command';
import { createFile, deleteFile } from './file';
import {
  endGroup,
  error,
  getInput,
  setOutput,
  startGroup
} from '@actions/core';

const run = async () => {
  // Getting the output of the input command
  startGroup('Getting command output');
  const output = await getCommandOutput(getInput('run', { required: true }));
  setOutput('output', output);
  endGroup();

  // The cache file used as a placeholder
  const file = '.cacheFile';
  createFile(file);

  // Set the output hit depending on whether the cache is found or not
  setOutput('hit', await isCacheFound(file, output));

  // Delete the file after caching as it is no longer useful
  deleteFile(file);
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