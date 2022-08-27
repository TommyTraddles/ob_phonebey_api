const path = require('path')
const os = require('os')

;(async () => {
  // ⛔️ SET '{ tmp: false }` TO STORE THE JSON WITHIN THE `script` directory
  // ⛔️ SET `{ retrieveAll: false }` TO RETRIEVE ONLY 9 PHONES
  // ⛔️ SET `{ headless: false }` TO VISUALIZE THE EXECUTION ON `chromium`
  const setup = {
    tmp: false,
    retrieveAll: false,
    headless: true,
  }

  const tmp = setup.tmp
  const storeInTmp = tmp ? os.tmpdir() : __dirname
  const directory = path.join(storeInTmp, 'json')

  await require('./1-webscrap')({
    destineDir: directory,
    retrieveAll: setup.retrieveAll,
    headless: setup.headless,
  })

  await require('./2-create-tables')

  await require('./3-seed-tables')({
    sourceDir: directory,
  })
})()
