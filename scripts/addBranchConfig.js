var fs = require('fs')
var util = require('./util')
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

// TODO: Get project name
addBranchConfigToProjects('TestProject')
