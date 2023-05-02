const cache = require("@actions/cache")
const core = require("@actions/core")
const exec = require('@actions/exec');
const fs = require('fs')

const path = '.cacheCommandOutput'
const run = 'date'
let output;
  const options = {};
  options.listeners = {
    stdout: (data: Buffer) => {
      output = data.toString();
    }
  };

async function run() {
 
    await exec.exec(run, options);

    fs.writeFile(path, output, err => {
        if (err) {
            console.error(err);
        }
    });

    const cacheId = await cache.restoreCache([path], output)
    if (!cacheId) {
        // Cache not restored
        await cache.saveCache([path], output)
        core.setOutput("hit", false)
        return;
    }
    core.setOutput("hit", true)
    console.log("hit: true")
}

run()
