const cache = require("@actions/cache")
const core = require("@actions/core")
const exec = require('@actions/exec');
const fs = require('fs')

async function run() {
    try {
        const file = core.getInput('file');
        if (!file) throw new Error(`Input not supplied: file`);
        const command = core.getInput('run', { required: true });

        try {
          let output = '';
          core.info(`Starting to run command ${command}`)
          await exec.exec(command, [], {
            listeners: {
              stdout: (data) => {output = data.toString();}
            }
          });
          core.setOutput('output', output)
        } catch (error) {
          core.setFailed(`Run command failed: ${error.message}`)
          return;
        }

        await fs.writeFile(file, output, err => {
            if (err) {
                core.setFailed(`Write command output to ${file} failed: ${err}`);
                process.exit();
            }
        });

        try {
          const cacheId = await cache.restoreCache([file], output)
          if (!cacheId) {
            // Cache not restored
            await cache.saveCache([file], output)
            core.setOutput("hit", false)
            return;
          }

          // Cache restored
          core.setOutput("hit", true)
        } catch (error) {
          core.setFailed(`Cache failed: ${error.message}`)
        }
    } catch (error) {
      core.setOutput('hit', false)
      core.setFailed(`${error.message}`)
    }
}

run()
