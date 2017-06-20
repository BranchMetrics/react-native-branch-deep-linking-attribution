const fs = require('fs')
const log = require('npmlog')
const xcode = require('xcode')

log.heading = 'react-native-branch'

function addBranchConfigToXcodeProject() {
  const projectName = findXcodeProjectName()
  if (!projectName) {
    log.error('could not find an Xcode project')
    return
  }

  const xcodeprojName = './ios/' + projectName + '.xcodeproj'
  const projectPbxprojName = xcodeprojName + '/project.pbxproj'

  const project = xcode.project(projectPbxprojName)
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
  const projectName = findXcodeProjectName()
  if (!projectName) {
    log.error('could not find an Xcode project')
    return
  }

  const xcodeprojName = './ios/' + projectName + '.xcodeproj'
  const projectPbxprojName = xcodeprojName + '/project.pbxproj'

  const project = xcode.project(projectPbxprojName)
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
  const groupKey = getGroupKeyByName(project, groupName)
  if (!groupKey) {
      log.error('Could not find key for group ' + groupName)
      return
  }

  // path relative to group
  const file = project.addFile(path, groupKey)
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
  const file = project.removeFile(path, {})
  if (!file) {
    log.warn('Did not find ' + path + ' in project')
    return
  }

  file.target = getTargetKeyByName(project, groupName)
  correctForPath(file, project, groupName)

  const groupKey = getGroupKeyByName(project, groupName)
  if (!groupKey) {
    log.error('Could not find key for group ' + groupName)
    return
  }

  project.removeFromPbxBuildFileSection(file)
  project.removeFromPbxResourcesBuildPhase(file)
  project.removeFromPbxGroup(file, groupKey)
}

function getGroupKeyByName(project, groupName) {
  const objects = project.hash.project.objects['PBXGroup']
  for (const key in objects) {
    const name = objects[key].name
    if (name == groupName) return key
  }
  return null
}

function getTargetKeyByName(project, targetName) {
  const targets = project.pbxNativeTargetSection()
  for (const key in targets) {
    const name = targets[key].name
    if (name == targetName) return key
  }
  return null
}

function correctForPath(file, project, group) {
    const r_group_dir = new RegExp('^' + group + '[\\\\/]');

    if (project.pbxGroupByName(group).path)
        file.path = file.path.replace(r_group_dir, '');

    return file;
}

function findXcodeProjectName() {
  // look for a .xcodeproj directory under ios
  files = fs.readdirSync('./ios')

  const regex = /^([^/]+)\.xcodeproj$/

  projectDir = files.find(function(filename) {
    if (!filename.match(regex)) {
      return false
    }

    stats = fs.statSync('./ios/' + filename)

    return stats.isDirectory()
  })

  if (!projectDir) return null

  const result = regex.exec(projectDir)
  return result[1]
}

module.exports = {
  addBranchConfigToXcodeProject: addBranchConfigToXcodeProject,
  removeBranchConfigFromXcodeProject: removeBranchConfigFromXcodeProject
}
