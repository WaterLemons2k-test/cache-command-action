import { isCacheHit } from './cache';
import { getCommandOutput } from './exec';
import { createFile } from './fs';
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
};

run().catch(err => failed(err));