'use strict';

const { restoreCache, saveCache } = require('@actions/cache');
const { getInput, setFailed, setOutput, startGroup, endGroup, info, debug } = require('@actions/core');
const { getExecOutput } = require('@actions/exec');
const { writeFile } = require('fs');

// handleErr sets all outputs when catching err, logs error and sets a failing exit code.
function handleErr(err) {
  if (!err) return;

  debug('Starting to handle error')
  setOutput('stdout', '');
  setOutput('hit', false);
  setFailed(err.message);
  throw err;
}

async function run() {
  try {
    startGroup('Starting to run command');
    // Write command to Shell script
    const script = './run.sh';
    const command = getInput('run', { required: true });
    debug(`script: ${script}, command: ${command}`)
    await writeFile(script, command, err => {
      try {
        if (err) throw new Error(`Write command to Shell script failed: ${err}`);
      } catch (err) {
        handleErr(err);
      }
    });

    // Execute Shell script
    const shell = 'bash';
    debug(`shell: ${shell}`)
    const { stdout } = await getExecOutput(shell + ' ' + script);

    if (!stdout) throw new Error('Command stdout is empty.');

    setOutput('stdout', stdout);
    endGroup();

    startGroup('Starting to cache');
    const cache = await restoreCache([script], stdout);
    if (!cache) {
      // Cache not restored
      debug('Cache not restored, save cache')
      await saveCache([script], stdout);
      info(`Cache saved with the command stdout: ${stdout}`);
      setOutput('hit', false);
      return;
    }

    // Cache restored
    debug('Cache restored')
    info(`Cache restored from the command stdout: ${stdout}`);
    setOutput('hit', true);
    endGroup();
  } catch (err) {
    handleErr(err);
  }
}

run();
