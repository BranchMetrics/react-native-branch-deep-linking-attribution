// var addFileToProject = require('react-native/local-cli/link/ios/addFileToProject')
// var getGroup = require('react-native/local-cli/link/ios/getGroup')
var fs = require('fs')
var xcode = require('xcode')

function addBranchConfigToProjects(projectName) {
  if (!fs.existsSync('./branch.json')) {
    console.log('branch.json does not exist')
    return
  }

  console.log('branch.json found')

  // TODO: symlink into Android project

  // add to Xcode project files to be included in bundle
  var xcodeprojName = './ios/' + projectName + '.xcodeproj'
  var projectPbxprojName = xcodeprojName + '/project.pbxproj'

  console.log('updating project ' + xcodeprojName)

  var project = xcode.project(projectPbxprojName)
  project.parse(function(error) {
    if (error) {
      console.error('Error loading ' + xcodeprojName)
      return
    }

    var groupKey = getGroupKeyByName(project, projectName)
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
    file.target = getTargetKeyByName(project, projectName)
    correctForPath(file, project, projectName)

    project.addToPbxBuildFileSection(file)
    project.addToPbxResourcesBuildPhase(file)

    if (fs.writeFileSync(projectPbxprojName, project.writeSync()) <= 0) {
      console.error('error writing updated project')
      return
    }

    console.info('Added branch.json to project ' + xcodeprojName)
  })
}

function getGroupKeyByName(project, groupName) {
  var objects = project.hash.project.objects['PBXGroup']
  var groupKey = null
  for (var key in objects) {
    var name = objects[key].name
    if (name != groupName) continue
    groupKey = key
    break
  }
  return groupKey
}

function getTargetKeyByName(project, targetName) {
  var targets = project.pbxNativeTargetSection()
  var targetKey = null
  for (var key in targets) {
    var name = targets[key].name
    if (name != targetName) continue
    targetKey = key
    break
  }

  return targetKey
}

function correctForPath(file, project, group) {
    var r_group_dir = new RegExp('^' + group + '[\\\\/]');

    if (project.pbxGroupByName(group).path)
        file.path = file.path.replace(r_group_dir, '');

    return file;
}

// TODO: Get project name
addBranchConfigToProjects('TestProject')
