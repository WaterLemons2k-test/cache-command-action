const { restoreCache, saveCache } = require("@actions/cache")
const { getInput, setFailed, setOutput, startGroup, endGroup, info } = require("@actions/core")
const { exec } = require('@actions/exec');
const { writeFile } = require('fs')

async function run() {
    try {
        startGroup('Starting to run command')
        // Write command to Shell script
        const command = getInput('run', { required: true });
        const script = './run.sh'
        await writeFile(script, command, err => {
            if (err) {
                setFailed(`Write command to Shell script failed: ${err}`);
                process.exit();
            }
        });

          let output = '';
          await exec('bash ' + script, [], {
            listeners: {
              stdout: (data) => {output += data.toString().trim();}
            }
          });
        
          if (!output) {
            throw new Error('Command output is empty.');
          }
        
          setOutput('output', output)
          endGroup();


          startGroup('Starting to cache')
          const cache = await restoreCache([script], output)
          if (!cache) {
            // Cache not restored
            await saveCache([script], output)
            info(`Cache saved with the command output: ${output}`)
            setOutput("hit", false)
            return;
          }

          // Cache restored
          info(`Cache restored from the command output: ${output}`)
          setOutput("hit", true)
          endGroup();
    } catch (err) {
      setOutput('output', '');
      setOutput('hit', false);
      setFailed(err.message);
      info(err.stack);
    }
}

run()
