import { endGroup, error, getInput, setOutput, startGroup } from '@actions/core';
import { isCacheHit } from './actions/cache';
import { getCommandOutput } from './actions/command';
import { createFile, deleteFile } from './file';

const run = async () => {
  startGroup('Getting command output');
  // Getting the output of the input run command
  const output = await getCommandOutput(getInput('run', { required: true }));
  setOutput('output', output);
  endGroup();

  // The default path to be used as the cache path
  const path = '.cachePath';
  createFile(path);

  // Set output hit based on whether the cache hits or not
  setOutput('hit', await isCacheHit(path, output));

  // Delete path after cache because it is useless
  deleteFile(path);
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