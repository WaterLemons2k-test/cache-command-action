import { isCacheHit } from './cache';
import { endGroup, failed, startGroup } from './log';
import { getCommandOutput } from './exec';
import { writeFile } from './fs';
import { getInput, setOutput } from '@actions/core';

const run = async () => {
  const command = getInput('run', { required: true });

  // Script path in which JS will write the command
  const script = './run.sh';

  // Write command to script
  writeFile(script, command);

  startGroup('Starting to run command');
  // Get the output of command
  const output = await getCommandOutput(command);
  setOutput('output', output);
  endGroup();

  // Set output hit based on whether the cache hits or not
  setOutput('hit', await isCacheHit(script, output));
};

run().catch(err => failed(err));