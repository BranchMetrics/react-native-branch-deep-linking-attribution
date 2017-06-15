var fs = require('fs')

function addBranchConfigToAndroidAssetsFolder() {
  // throws on failure
  ensureAndroidAssetsFolder()

  var branchJsonPath = './android/app/src/main/assets/branch.json'
  var branchJsonLinkPath = '../../../../../branch.json'
  try {
    var stats = fs.lstatSync(branchJsonPath)
    if (stats && stats.isSymbolicLink()) {
      var dest = fs.readlinkSync(branchJsonPath)
      if (dest == branchJsonLinkPath) {
        console.warn('branch.json already present in Android app')
        return
      }

      console.error(branchJsonPath + ' is a link to ' + branchJsonLinkPath + '.')
      return
    }
    if (stats) {
      console.error(branchJsonPath + ' exists and is not a symbolic link.')
      return
    }
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error

    // ./android/app/src/main/assets exists and is a directory.
    // ./android/app/src/main/assets/branch.json does not exist.
    // create the symlink
    fs.symlinkSync(branchJsonLinkPath, branchJsonPath)
    console.log('Added branch.json to Android project.')
  }
}

function ensureAndroidAssetsFolder() {
  var srcDir = './android/app/src/main'
  var assetsDir = srcDir + '/assets'

  try {
    var stats = fs.statSync(assetsDir)
    if (!stats.isDirectory()) {
      throw(assetsDir + ' exists and is not a directory.')
    }
  }
  catch (error) {
    if (error.code != 'ENOENT') throw error

    var stats = fs.statSync(srcDir)

    if (!stats.isDirectory()) {
      throw(srcDir + ' exists and is not a directory.')
    }

    fs.mkdirSync(assetsDir, 0o777)
  }
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
