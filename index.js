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
    if (cacheId) {
        console.log("hit: true")
        return;
    }
    await cache.saveCache([path], key)
}

getCache()
