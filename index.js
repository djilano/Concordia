const fs = require('fs')
const util = require('util')
const args = require('mri')(process.argv.slice(2))
const asar = require('asar')
const fse = require('fs-extra')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

;(async () => {
  const js = `mainWindow.webContents.on('dom-ready', () => {
    if (global.loadTimer) clearTimeout(global.loadTimer);
    global.loadTimer = setTimeout(() => {
      mainWindow.webContents.executeJavaScript(\`${fs.readFileSync(
        'for-injection.js'
      )}\`);
    }, 3000);
  });mainWindow.webContents.`
  const preloadJs = `${fs.readFileSync('for-preload.js')};
  contextBridge.exposeInMainWorld('ConcordiaPreloader', ConcordiaPreloader);global.ConcordiaPreloader = ConcordiaPreloader;global.DiscordNative =`

  const corePath = args.core || 'core.asar'
  const targetPath = 'tmp/app/mainScreen.js'
  const backupPath = `${targetPath}.backup`
  const targetPath2 = 'tmp/app/mainScreenPreload.js'
  const backupPath2 = `${targetPath2}.backup`

  await fse.remove('tmp').catch((err) => {
    console.log(err)
  })
  util.promisify(fs.copyFile)(corePath, 'core.asar.backup')
  asar.extractAll(corePath, 'tmp')

  if (args.revert) {
    const backup = await readFile(backupPath)
    await writeFile(targetPath, backup)
    const backup2 = await readFile(backupPath2)
    await writeFile(targetPath2, backup2)
    console.log('Reverting from backup...')
  } else if (args.inject) {
    const target = await readFile(targetPath, 'utf-8')
    if (target.includes("mainWindow.webContents.on('dom-ready', () => {")) {
      console.log('Maybe already injected.')
      return
    }
    let injected = target.replace('mainWindow.webContents.', js)
    // injected = injected.replace(
    //   'nodeIntegration: false',
    //   'nodeIntegration: true'
    // )

    const target2 = await readFile(targetPath2, 'utf-8')
    if (target2.includes('global.Concordia')) {
      console.log('Already injected')
      return
    }

    let injected2 = target2.replace('global.DiscordNative =', preloadJs)

    await writeFile(targetPath, injected)
    await writeFile(targetPath2, injected2)
    await writeFile(backupPath, target, { flag: 'wx' }).catch(() => {
      // File already exists
    })
    await writeFile(backupPath2, target2, { flag: 'wx' }).catch(() => {
      // File already exists
    })
    console.log('Injecting...')
  } else {
    console.log('Just extract core.asar and pack core.asar.')
  }

  asar.createPackage('tmp', corePath, (err) => {
    if (err) {
      console.log('Failed to create core.asar')
    }
  })
})()
