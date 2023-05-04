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

// Write command to script.
async function commandToScript(command, script) {
  if (!command || !script) return;

  debug(`Starting to write command to script:
command: ${command}, script: ${script}`);

  await writeFile(script, command, err => {
    try {
      if (err) throw new Error(`Write command to script failed: ${err}`);
    } catch (err) {
      handleErr(err);
    }
  });
}

// Get script output and trim.
async function getScriptOutput(shell, script) {
  if (!shell || !script) return '';

  debug(`Starting to get script output:
shell: ${shell}, script: ${script}`);

  const { stdout } = await getExecOutput(shell + ' ' + script);
  const output = stdout.trim();
  if (!output) throw new Error('Command output is empty.');
  debug(`output: ${output}`);
  return output;
}

async function run() {
  try {
    startGroup('Starting to run command');

    const command = getInput('run', { required: true });
    // Script path to which JS writes the command
    const script = './run.sh';

    // Write command to Shell script
    await commandToScript(command, script);

    // Execute Shell script
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
  } catch (err) {
    handleErr(err);
  }
}

run();
