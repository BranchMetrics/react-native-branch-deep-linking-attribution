var fs = require('fs')
var util = require('./util')
var xcode = require('xcode')

function removeBranchConfigFromProjects(projectName) {
  var xcodeprojName = './ios/' + projectName + '.xcodeproj'
  var projectPbxprojName = xcodeprojName + '/project.pbxproj'

  console.log('updating project ' + xcodeprojName)

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

removeBranchConfigFromProjects('TestProject')
