const cache = require("@actions/cache")
const core = require("@actions/core")
const exec = require('@actions/exec');
const fs = require('fs')

async function run() {
    try {
        const file = core.getInput('file');
        if (!file) throw new Error(`Input not supplied: file`);
        const command = core.getInput('run', { required: true });

        // Write command to Shell script
        const script = './.cacheCommand.sh'
        await fs.writeFile(script, command, err => {
            if (err) {
                core.setFailed(`Write command to Shell script failed: ${err}`);
                process.exit();
            }
        });

          let output = '';
          core.startGroup('Starting to run command')
          await exec.exec('bash ' + script, [], {
            listeners: {stdout: (data) => {output += data.toString().replace(/\n/g, '');}
            }
          });
        
          if (!output) {
            throw new Error('Command output is empty.');
          }
        
          core.setOutput('output', output)
          core.endGroup();

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
      core.setOutput('output', '');
      core.setOutput('hit', false);
      core.setFailed(`${error.message}`);
    }
}

run()
