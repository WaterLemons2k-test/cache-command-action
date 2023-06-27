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

  // Create the file to be used as the cache key
  const file = './run.sh';
  createFile(file);

  // Set output hit based on whether the cache hits or not
  setOutput('hit', await isCacheHit(file, output));
};

run().catch(err => failed(err));