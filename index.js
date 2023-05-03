const cache = require("@actions/cache")
const core = require("@actions/core")
const { spawn } = require('child_process');
const fs = require('fs')

async function run() {
    try {
        const file = core.getInput('file');
        if (!file) throw new Error(`Input not supplied: file`);
        const command = core.getInput('run', { required: true });
     
        // Write command to Shell script
        const script = './.cacheCommand.sh'
        await fs.writeFile(script, '#!/bin/bash\n' + command, err => {
            if (err) {
                core.setFailed(`Write command to Shell script failed: ${err}`);
                process.exit();
            }
        });

          let output = '';
          core.info(`Starting to run command ${command}`)
          await spawn('bash', [script]).stdout.on('data', (data) => {
            output = data.toString();
            core.setOutput('output', output)
          });

        await fs.writeFile(file, output, err => {
            if (err) {
                core.setFailed(`Write command output to ${file} failed: ${err}`);
                process.exit();
            }
        });

          const cacheId = await cache.restoreCache([file], output)
          if (!cacheId) {
            // Cache not restored
            await cache.saveCache([file], output)
            core.info(`Cache saved with the command output: ${output}`)
            core.setOutput("hit", false)
            return;
          }

          // Cache restored
          core.info(`Cache restored from the command output: ${output}`)
          core.setOutput("hit", true)
    } catch (error) {
      core.setOutput('hit', false)
      core.setFailed(`${error.message}`)
    }
}

run()
