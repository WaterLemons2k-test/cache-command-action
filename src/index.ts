import { isCacheHit } from './cache';
import { getCommandOutput } from './command';
import { createFile, deleteFile } from './file';
import { endGroup, failed, startGroup } from './log';
import { getInput, setOutput } from '@actions/core';

const run = async () => {
  startGroup('Starting to run command');
  // Get the output of the input run command
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

run().catch(err => failed(err));