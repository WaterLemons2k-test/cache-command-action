import { isCacheHit } from './cache';
import { failed } from './log';
import { getScriptOutput } from './exec';
import { writeFile } from './fs';
import { getInput, setOutput } from '@actions/core';

const run = async () => {
  const command = getInput('run', { required: true });

  // Script path in which JS will write the command
  const script = './run.sh';

  // Write command to script
  writeFile(script, command);

  // Get the output of script
  const shell = 'bash';
  const output = await getScriptOutput(shell, script);
  setOutput('output', output);

  // Set output hit based on whether the cache hits or not
  setOutput('hit', await isCacheHit(script, output));
};

run().catch(err => failed(err));