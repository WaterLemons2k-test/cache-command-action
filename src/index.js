'use strict';

const { restoreCache, saveCache } = require('@actions/cache');
const { getInput, setFailed, setOutput, startGroup, endGroup, info, debug } = require('@actions/core');
const { getExecOutput } = require('@actions/exec');
const { writeFile } = require('fs');

// handleErr sets all outputs when catching err, logs error and sets a failing exit code.
function handleErr(err) {
  if (!err) return;

  debug('Starting to handle error');
  setOutput('output', '');
  setOutput('hit', false);
  setFailed(err.message);
  throw err;
}

// commandToScript write command to script.
function commandToScript(command, script) {
  if (!command || !script) throw new Error('commandToScript: command or script not supplied.');

  debug(`Starting to write command to script:
command: ${command}, script: ${script}`);

  writeFile(script, command, err => {
    try {
      if (err) throw new Error(`Write command to script failed: ${err}`);
    } catch (err) {
      handleErr(err);
    }
  });
}

// getScriptOutput get the script output and trim.
async function getScriptOutput(shell, script) {
  if (!shell || !script) throw new Error('getScriptOutput: shell or script not supplied.');

  debug(`Starting to get script output:
shell: ${shell}, script: ${script}`);

  const { stdout } = await getExecOutput(shell + ' ' + script);
  const output = stdout.trim();
  if (!output) throw new Error('Command output is empty.');
  debug(`output: ${output}`);
  return output;
}

async function run() {
  startGroup('Starting to run command');

  const command = getInput('run', { required: true });
  // Script path in which JS will write the command
  const script = './run.sh';

  // Write command to script
  commandToScript(command, script);

  // Get the output of script
  const output = await getScriptOutput('bash', script);
  setOutput('output', output);
  endGroup();

  const cache = await restoreCache([script], output);
  if (!cache) {
    // Cache not restored
    debug('Cache not restored, save cache');
    await saveCache([script], output);
    info(`Cache saved with the command output: ${output}`);
    setOutput('hit', false);
    return;
  }

  // Cache restored
  debug('Cache restored');
  info(`Cache restored from the command output: ${output}`);
  setOutput('hit', true);
}

run().catch(err => handleErr(err));
