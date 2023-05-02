const cache = require("@actions/cache")
const fs = require('fs')

const path = '.cacheCommand'
const key = path
fs.writeFile(path, path, err => {
  if (err) {
    console.error(err);
  }
});
async function getCache() {
    const cacheId = await cache.restoreCache([path], key)
    if (!cacheId) {
        // Cache not restored
        await cache.saveCache([path], key)
    }
    console.log("hit: true")
}

getCache()
