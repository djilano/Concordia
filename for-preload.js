const ConcordiaPreloader = {
  getScripts: function (cb) {
    console.log('GETTING CONCORDIA SCRIPTS')
    const fs = require('fs')
    const os = require('os')
    const path = require('path')

    const homeDir = os.homedir()
    const injectionDir = path.join(homeDir, 'Concordia')

    let settings = {}
    try {
      settings = require(path.join(injectionDir, 'settings.js'), 'utf-8')
    } catch (err) {}
    settings.version = '0.3.1'

    fs.readdir(injectionDir, (err, files) => {
      if (err) {
        return console.log(err)
      }
      files = files.sort((a, b) => (a > b ? 1 : -1))
      for (const file of files) {
        if (/\.js$/.test(file)) {
          fs.readFile(path.join(injectionDir, file), 'utf-8', (err, userJs) => {
            if (err) {
              return console.log(err)
            }
            cb(file, userJs)
          })
        } else if (/\.css$/.test(file)) {
          fs.readFile(
            path.join(injectionDir, file),
            'utf-8',
            (err, userCss) => {
              if (err) {
                return console.log(err)
              }
              cb(file, userCss)
            }
          )
        }
      }
    })
  },
}
