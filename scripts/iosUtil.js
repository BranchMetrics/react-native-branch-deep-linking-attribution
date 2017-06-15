var fs = require('fs')
var xcode = require('xcode')

function addBranchConfigToXcodeProject() {
  var projectName = util.findXcodeProjectName()
  if (!projectName) {
    console.error('could not find an Xcode project')
    return
  }

  // add to Xcode project files to be included in bundle
  var xcodeprojName = './ios/' + projectName + '.xcodeproj'
  var projectPbxprojName = xcodeprojName + '/project.pbxproj'

  var project = xcode.project(projectPbxprojName)
  project.parse(function(error) {
    if (error) {
      console.error('Error loading ' + xcodeprojName)
      return
    }

    var groupKey = util.getGroupKeyByName(project, projectName)
    if (!groupKey) {
      console.error('Could not find key for group ' + projectName)
      return
    }

    // path relative to group
    file = project.addFile('../branch.json', groupKey)
    if (!file) {
      // TODO: Can get here if the file is already in the project
      console.error('Failed to add file to project')
      return
    }

    file.uuid = project.generateUuid()
    file.target = util.getTargetKeyByName(project, projectName)
    util.correctForPath(file, project, projectName)

    project.addToPbxBuildFileSection(file)
    project.addToPbxResourcesBuildPhase(file)

    if (fs.writeFileSync(projectPbxprojName, project.writeSync()) <= 0) {
      console.error('error writing updated project')
      return
    }

    console.info('Added branch.json to project ' + xcodeprojName)
  })
}
function removeBranchConfigFromXcodeProject() {
  var projectName = util.findXcodeProjectName()
  if (!projectName) {
    console.error('could not find an Xcode project')
    return
  }

  var xcodeprojName = './ios/' + projectName + '.xcodeproj'
  var projectPbxprojName = xcodeprojName + '/project.pbxproj'

  var project = xcode.project(projectPbxprojName)
  project.parse(function(error) {
    if (error) {
      console.error('Error loading ' + xcodeprojName)
      return
    }

    var file = project.removeFile('../branch.json', {})
    if (!file) {
      console.warn('Did not find branch.json in project')
      return
    }

    file.target = util.getTargetKeyByName(project, projectName)
    util.correctForPath(file, project, projectName)

    var groupKey = util.getGroupKeyByName(project, projectName)
    if (!groupKey) {
      console.error('Could not find key for group ' + projectName)
      return
    }

    project.removeFromPbxBuildFileSection(file)
    project.removeFromPbxResourcesBuildPhase(file)
    project.removeFromPbxGroup(file, groupKey)

    if (fs.writeFileSync(projectPbxprojName, project.writeSync()) <= 0) {
      console.error('error writing updated project')
      return
    }

    console.info('Removed branch.json from project ' + xcodeprojName)
  })
}

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

  var regex = /^([^/]+)\.xcodeproj$/

  projectDir = files.find(function(filename) {
    if (!filename.match(regex)) {
      return false
    }

    stats = fs.statSync('./ios/' + filename)

    return stats.isDirectory()
  })

  if (!projectDir) return null

  var result = regex.exec(projectDir)
  return result[1]
}

module.exports = {
  addBranchConfigToXcodeProject: addBranchConfigToXcodeProject,
  removeBranchConfigFromXcodeProject: removeBranchConfigFromXcodeProject
}
