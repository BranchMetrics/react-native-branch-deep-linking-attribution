var fs = require('fs')

function getGroupKeyByName(project, groupName) {
  var objects = project.hash.project.objects['PBXGroup']
  for (var key in objects) {
    var name = objects[key].name
    if (name == groupName) return key
  }
  return null
}

function getTargetKeyByName(project, targetName) {
  var targets = project.pbxNativeTargetSection()
  for (var key in targets) {
    var name = targets[key].name
    if (name == targetName) return key
  }
  return null
}

function correctForPath(file, project, group) {
    var r_group_dir = new RegExp('^' + group + '[\\\\/]');

    if (project.pbxGroupByName(group).path)
        file.path = file.path.replace(r_group_dir, '');

    return file;
}

function findXcodeProjectName() {
  // look for a .xcodeproj directory under ios
  files = fs.readdirSync('./ios')
  if (!files) {
    console.error('Error reading ./ios subdirectory')
    return null
  }

  var regex = /^([^/]+)\.xcodeproj$/

  projectDir = files.find(function(filename) {
    if (!filename.match(regex)) {
      return false
    }

    stats = fs.statSync('./ios/' + filename)
    if (!stats) {
      console.error('could not get stats for ' + filename)
      return false
    }

    return stats.isDirectory()
  })

  if (!projectDir) return null

  var result = regex.exec(projectDir)
  return result[1]
}

function addBranchJsonToAndroidAssetsFolder() {
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

function ensureAndroidAssetsFolder(callback) {
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

module.exports = {
  addBranchJsonToAndroidAssetsFolder: addBranchJsonToAndroidAssetsFolder,
  correctForPath: correctForPath,
  findXcodeProjectName: findXcodeProjectName,
  getGroupKeyByName: getGroupKeyByName,
  getTargetKeyByName: getTargetKeyByName
}
