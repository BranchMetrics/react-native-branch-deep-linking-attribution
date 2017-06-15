var fs = require('fs')
var log = require('npmlog')
var xcode = require('xcode')

function addBranchConfigToXcodeProject() {
  var projectName = findXcodeProjectName()
  if (!projectName) {
    log.error('could not find an Xcode project')
    return
  }

  var xcodeprojName = './ios/' + projectName + '.xcodeproj'
  var projectPbxprojName = xcodeprojName + '/project.pbxproj'

  var project = xcode.project(projectPbxprojName)
  project.parse(function(error) {
    if (error) {
      log.error('Error loading ' + xcodeprojName)
      return
    }

    if (fs.existsSync('./branch.json')) {
      // path relative to group
      includePathInProject(project, projectName, '../branch.json')
    }

    if (fs.existsSync('./branch.debug.json')) {
      // path relative to group
      includePathInProject(project, projectName, '../branch.debug.json')
    }

    if (fs.writeFileSync(projectPbxprojName, project.writeSync()) <= 0) {
      log.error('error writing updated project')
      return
    }

    log.info('Added Branch configuration to project ' + xcodeprojName)
  })
}

function removeBranchConfigFromXcodeProject() {
  var projectName = findXcodeProjectName()
  if (!projectName) {
    log.error('could not find an Xcode project')
    return
  }

  var xcodeprojName = './ios/' + projectName + '.xcodeproj'
  var projectPbxprojName = xcodeprojName + '/project.pbxproj'

  var project = xcode.project(projectPbxprojName)
  project.parse(function(error) {
    if (error) {
      log.error('Error loading ' + xcodeprojName)
      return
    }

    // paths relative to group
    removePathFromProject(project, projectName, '../branch.json')
    removePathFromProject(project, projectName, '../branch.debug.json')

    if (fs.writeFileSync(projectPbxprojName, project.writeSync()) <= 0) {
      log.error('error writing updated project')
      return
    }

    log.info('Removed Branch configuration from project ' + xcodeprojName)
  })
}

function includePathInProject(project, groupName, path) {
  var groupKey = getGroupKeyByName(project, groupName)
  if (!groupKey) {
      log.error('Could not find key for group ' + groupName)
      return
  }

  // path relative to group
  var file = project.addFile(path, groupKey)
  if (!file) {
    // TODO: Can get here if the file is already in the project
    log.error('Failed to add file to project')
    return
  }

  file.uuid = project.generateUuid()
  file.target = getTargetKeyByName(project, groupName)
  correctForPath(file, project, groupName)

  project.addToPbxBuildFileSection(file)
  project.addToPbxResourcesBuildPhase(file)
}

function removePathFromProject(project, groupName, path) {
  var file = project.removeFile(path, {})
  if (!file) {
    log.warn('Did not find ' + path + ' in project')
    return
  }

  file.target = getTargetKeyByName(project, groupName)
  correctForPath(file, project, groupName)

  var groupKey = getGroupKeyByName(project, groupName)
  if (!groupKey) {
    log.error('Could not find key for group ' + groupName)
    return
  }

  project.removeFromPbxBuildFileSection(file)
  project.removeFromPbxResourcesBuildPhase(file)
  project.removeFromPbxGroup(file, groupKey)
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
