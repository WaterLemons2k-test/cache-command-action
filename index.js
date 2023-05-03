const { restoreCache, saveCache } = require("@actions/cache")
const { getInput, setFailed, setOutput, startGroup, endGroup, info } = require("@actions/core")
const { exec } = require('@actions/exec');
const { writeFile } = require('fs')

async function run() {
    try {
        const file = getInput('file');
        if (!file) throw new Error(`Input not supplied: file`);
        const command = getInput('run', { required: true });

        // Write command to Shell script
        const script = './.cacheCommand.sh'
        await writeFile(script, command, err => {
            if (err) {
                setFailed(`Write command to Shell script failed: ${err}`);
                process.exit();
            }
        });

          let output = '';
          startGroup('Starting to run command')
          await exec('bash ' + script, [], {
            listeners: {
              stdout: (data) => {output += data.toString().replace(/\n/g, '');}
            }
          });
        
          if (!output) {
            throw new Error('Command output is empty.');
          }
        
          setOutput('output', output)
          endGroup();

        await writeFile(file, output, err => {
            if (err) {
                setFailed(`Write command output to ${file} failed: ${err}`);
                process.exit();
            }
        });

          const cache = await restoreCache([file], output)
          if (!cache) {
            // Cache not restored
            await saveCache([file], output)
            info(`Cache saved with the command output: ${output}`)
            setOutput("hit", false)
            return;
          }

          // Cache restored
          info(`Cache restored from the command output: ${output}`)
          setOutput("hit", true)
    } catch (error) {
      setOutput('output', '');
      setOutput('hit', false);
      setFailed(`${error.message}`);
    }
}

run()
