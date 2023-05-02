const cache = require("@actions/cache")
const fs = require('fs')

const paths = ['hello']
const key = 'npm-foobar-d5ea0750'
fs.writeFile('hello', 'hello', err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
async function getCache() {
    const cacheId = await cache.restoreCache(paths, key)
    if (cacheId) {
        console.log("hit: true")
        return;
    }
    await cache.saveCache(paths, key)
}

getCache()