'use strict';

const { getInput, setFailed, setOutput, startGroup, endGroup, info, debug } = require('@actions/core');
const { writeFile } = require('fs');
const { getExecOutput } = require('@actions/exec');
const { restoreCache, saveCache } = require('@actions/cache');

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
  if (!command || !script) throw new Error('commandToScript: No supplied command or script.');

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
  if (!shell || !script) throw new Error('getScriptOutput: No supplied shell or script.');

  debug(`Starting to get script output:
shell: ${shell}, script: ${script}`);

  const { stdout } = await getExecOutput(shell + ' ' + script);
  const output = stdout.trim();
  if (!output) throw new Error('Command output is empty.');
  debug(`output: ${output}`);
  return output;
}

// restoreOrSaveCache restore the cache if the cache hits,
// otherwize save the cache.
async function restoreOrSaveCache(paths, key) {
  if (!paths || !key) throw new Error('restoreOrSaveCache: No supplied paths or key.');

  debug(`Starting to restore cache:
paths: ${paths}, key: ${key}`);

  const cacheKey = await restoreCache([paths], key);
  if (!cacheKey) {
    // Cache not restored
    debug('Cache not found, save');
    await saveCache([paths], key);
    info(`Cache saved with key: ${key}`);
    setOutput('hit', false);
    return;
  }

  // Cache restored
  debug('Cache restored');
  info(`Cache restored from key: ${key}`);
  setOutput('hit', true);
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

  // Write command output to cache
  await restoreOrSaveCache(script, output);
}

run().catch(err => handleErr(err));
