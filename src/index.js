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

async function run() {
  try {
    startGroup('Starting to run command');

    const script = './run.sh';
    const command = getInput('run', { required: true });

    // Write command to Shell script
    commandToScript(command, script);

    // Execute Shell script
    const shell = 'bash';
    debug(`shell: ${shell}`);
    const { stdout } = await getExecOutput(shell + ' ' + script);
    const output = stdout.trim();
    debug(`output: ${output}`);

    if (!output) throw new Error('Command output is empty.');

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
