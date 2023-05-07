import { isCacheHit } from './cache';
import { setErr } from './err';
import { getScriptOutput } from './exec';
import { writeFileWithCallback } from './fs';
import { endGroup, getInput, setOutput, startGroup } from '@actions/core';

const run = async() => {
  startGroup('Starting to run command');

  const command = getInput('run', { required: true });
  // Script path in which JS will write the command
  const script = './run.sh';

  // Write command to script
  writeFileWithCallback(script, command);

  // Get the output of script
  const shell = 'bash';
  const output = await getScriptOutput(shell, script);
  setOutput('output', output);

  endGroup();

  // Use script as paths
  const paths = [script];

  // Set output hit based on whether the cache hits or not
  setOutput('hit', await isCacheHit(paths, output));
};

run().catch(err => setErr(err));
