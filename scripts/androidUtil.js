var fs = require('fs')

function addBranchConfigToAndroidAssetsFolder() {
  if (fs.existsSync('./branch.json')) {
    ensureAndroidAssetsFolder('main')
    addSymbolicLink('../../../../../branch.json', './android/app/src/main/assets/branch.json')
  }

  // branch.debug.json will be available as branch.json in debug builds
  if (fs.existsSync('./branch.debug.json')) {
    ensureAndroidAssetsFolder('debug')
    addSymbolicLink('../../../../../branch.debug.json', './android/app/src/debug/assets/branch.json')
  }

  console.log('Added Branch configuration to android project')
}

function addSymbolicLink(linkPath, path) {
  try {
    var stats = fs.lstatSync(path)
    if (stats && stats.isSymbolicLink()) {
      var dest = fs.readlinkSync(path)
      if (dest == linkPath) {
        console.warn(path + ' already present in Android app')
        return
      }

      console.error(path + ' is a link to ' + linkPath + '.')
      return
    }
    if (stats) {
      console.error(path + ' exists and is not a symbolic link.')
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

function ensureAndroidAssetsFolder(buildType) {
  ensureDirectory('./android/app/src/' + buildType + '/assets')
}

function ensureDirectory(path) {
  try {
    var stats = fs.statSync(path)

    if (!stats.isDirectory()) {
      throw(srcDir + ' exists and is not a directory.')
    }
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error

    var parent = dirname(path)
    if (parent !== path) ensureDirectory(parent)

    fs.mkdirSync(path, 0o777)
  }
}

function dirname(path) {
  if (!path.match(/\//)) return path

  return /^(.*)\/[^/]+$/.exec(path)[1]
}

function removeBranchConfigFromAndroidAssetsFolder() {
  var branchJsonPath = './android/app/src/main/assets/branch.json'
  try {
    var stats = fs.lstatSync(branchJsonPath)
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error
    // Not present. Quietly do nothing.
    return
  }

  if (!stats.isSymbolicLink()) {
    console.warn(branchJsonPath + ' is not a symbolic link. Not removing.')
    return
  }

  fs.unlink(branchJsonPath)
  console.log('removed branch.json from Android project.')
}

module.exports = {
  addBranchConfigToAndroidAssetsFolder: addBranchConfigToAndroidAssetsFolder,
  removeBranchConfigFromAndroidAssetsFolder: removeBranchConfigFromAndroidAssetsFolder
}
