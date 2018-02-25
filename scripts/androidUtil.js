const fs = require('fs')
const log = require('npmlog')
const path = require('path')

log.heading = 'react-native-branch'

function addBranchConfigToAndroidAssetsFolder() {
  if (fs.existsSync(path.join('.', 'branch.android.json'))) {
    ensureAndroidAssetsFolder('main')
    addSymbolicLink(path.join('..', '..', '..', '..', '..', 'branch.android.json'),
      path.join('.', 'android', 'app', 'src', 'main', 'assets', 'branch.json'))
  }
  else if (fs.existsSync(path.join('.', 'branch.json'))) {
    ensureAndroidAssetsFolder('main')
    addSymbolicLink(path.join('..', '..', '..', '..', '..', 'branch.json'),
      path.join('.', 'android', 'app', 'src', 'main', 'assets', 'branch.json'))
  }

  // branch[.android].debug.json will be available as branch.json in debug builds
  if (fs.existsSync(path.join('.', 'branch.android.debug.json'))) {
    ensureAndroidAssetsFolder('debug')
    addSymbolicLink(path.join('..', '..', '..', '..', '..', 'branch.android.debug.json'),
      path.join('.', 'android', 'app', 'src', 'debug', 'assets', 'branch.json'))
  }
  else if (fs.existsSync('./branch.debug.json')) {
    ensureAndroidAssetsFolder('debug')
    addSymbolicLink(path.join('..', '..', '..', '..', '..', 'branch.debug.json'),
      path.join('.', 'android', 'app', 'src', 'debug', 'assets', 'branch.json'))
  }

  log.info('Added Branch configuration to android project')
}

function addSymbolicLink(linkPath, path) {
  try {
    const stats = fs.lstatSync(path)
    if (stats && stats.isSymbolicLink()) {
      const dest = fs.readlinkSync(path)
      if (dest == linkPath) {
        log.warn(path + ' already present in Android app')
        return
      }

      log.error(path + ' is a link to ' + linkPath + '.')
      return
    }
    if (stats) {
      log.error(path + ' exists and is not a symbolic link.')
      return
    }
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error

    // ./android/app/src/main/assets exists and is a directory.
    // ./android/app/src/main/assets/branch.json does not exist.
    // create the symlink
    fs.symlinkSync(linkPath, path)
  }
}

function removeSymbolicLink(path) {
  try {
    const stats = fs.lstatSync(path)

    if (!stats.isSymbolicLink()) {
      log.warn(path + ' is not a symbolic link. Not removing.')
      return
    }
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error
    // Not present. Quietly do nothing.
    return
  }

  fs.unlinkSync(path)
}

function ensureAndroidAssetsFolder(buildType) {
  ensureDirectory(path.join('.', 'android', 'app', 'src', buildType, 'assets'))
}

function ensureDirectory(path) {
  try {
    const stats = fs.statSync(path)

    if (!stats.isDirectory()) {
      throw(srcDir + ' exists and is not a directory.')
    }
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error

    const parent = dirname(path)
    if (parent !== path) ensureDirectory(parent)

    fs.mkdirSync(path, 0o777)
  }
}

function dirname(path) {
  if (!path.search(path.sep)) return path

  const components = path.split(path.sep)
  components.splice(components.count - 1, 1)
  return components.join(path.sep)
}

function removeBranchConfigFromAndroidAssetsFolder() {
  removeSymbolicLink(path.join('.', 'android', 'app', 'src', 'main', 'assets', 'branch.json'))
  removeSymbolicLink(path.join('.', 'android', 'app', 'src', 'debug', 'assets', 'branch.json'))
  log.info('Removed Branch configuration from Android project')
}

function androidPackageName() {
  const path = path.join('.', 'android', 'app', 'src', 'main', 'AndroidManifest.xml')
  manifest = fs.readFileSync(path)
  const regex = /package=["']([A-Za-z\.0-9])["']/
  if (!manifest.match(regex)) throw 'package name not found in ' + path
  return regex.exec(manifest)[1]
}

function androidPackageDir() {
  return path.join('.', 'android', 'app', 'src', 'main', 'java', androidPackageName().replace(/\./, path.sep))
}

module.exports = {
  addBranchConfigToAndroidAssetsFolder: addBranchConfigToAndroidAssetsFolder,
  removeBranchConfigFromAndroidAssetsFolder: removeBranchConfigFromAndroidAssetsFolder
}
