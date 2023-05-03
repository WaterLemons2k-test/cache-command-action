const cache = require("@actions/cache")
const core = require("@actions/core")
const { exec } = require('child_process');
const fs = require('fs')

async function run() {
    try {
        const file = core.getInput('file');
        if (!file) throw new Error(`Input not supplied: file`);
        const command = core.getInput('run', { required: true });

          let output = '';
          core.info(`Starting to run command ${command}`)
          await exec(command, (error, stdout) => {
            if (error) {
              core.setFailed(`Run command failed: ${err}`);
              return;
            }
            // Convert multiple lines to one line
            output = stdout.replace(/\n/g, ' ');
          });
          console.log('output: ', output)
          core.setOutput('output', output)

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
