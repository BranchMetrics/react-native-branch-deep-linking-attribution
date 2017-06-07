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

module.exports = {
  correctForPath: correctForPath,
  findXcodeProjectName: findXcodeProjectName,
  getGroupKeyByName: getGroupKeyByName,
  getTargetKeyByName: getTargetKeyByName
}
