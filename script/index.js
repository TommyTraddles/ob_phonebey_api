const path = require('path')
const os = require('os')

;(async () => {
  /**
   * ⛔️ SET `{ debug: true }`
   *
   * TO ONLY RETRIEVE 9 ELEMENTS
   * TO STORE THE JSON WITHIN THE `script` directory
   * TO VISUALIZE THE EXECUTION ON `chromium`
   */

  const setup = {
    debug: false,
  }

  const debugDir = setup.debug ? __dirname : os.tmpdir()
  const directory = path.join(debugDir, 'json')

  await require('./1-webscrap')({
    destineDir: directory,
    debug: setup.debug,
  })

  await require('./2-create-tables')

  await require('./3-seed-tables')({
    sourceDir: directory,
  })
})()
