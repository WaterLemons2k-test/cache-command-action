const cache = require("@actions/cache")
const core = require("@actions/core")
const fs = require('fs')

const path = '.cacheCommand'
const key = path
fs.writeFile(path, path, err => {
  if (err) {
    console.error(err);
  }
});
async function run() {
    const cacheId = await cache.restoreCache([path], key)
    if (!cacheId) {
        // Cache not restored
        await cache.saveCache([path], key)
        core.setOutput("hit", false)
        return;
    }
    core.setOutput("hit", true)
    console.log("hit: true")
}

run()
