const cache = require("@actions/cache")
const core = require("@actions/core")
const exec = require('@actions/exec');
const fs = require('fs')

async function run() {
  try {
    const file = core.getInput('file');
    const command = core.getInput('run', { required: true });

    if (!file) throw new Error(`Input not supplied: file`);

    await exec.exec(command, [], {
      listeners: {
        stdout: (data) => {const output = data.toString();}
      }
    });

    core.setOutput('output', output)

    await fs.writeFile(file, output, err => {
      try {
        if (err) throw new Error(`Write command output to ${file} failed: ${err}`);
      } catch (error) {
        core.setFailed(error.message)
        process.exit();
      }
    });

    const cacheId = await cache.restoreCache([file], output)
    if (!cacheId) {
      // Cache not restored
      await cache.saveCache([file], output)
      core.setOutput("hit", false)
      return;
    }

    core.setOutput("hit", true)
  } catch (error) {
    core.setOutput('output', '')
    core.setOutput('hit', false)
    core.setFailed(error.message)
  }
}

run()
