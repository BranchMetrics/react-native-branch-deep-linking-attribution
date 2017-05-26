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

    // path relative to project
    file = project.addFile('$(SRCROOT)/../../branch.json', projectName)
    if (!file) {
      console.error('Failed to add file to project')
      return
    }

    // doesn't work (assumes Resources group. either have to create it or find a different way.)
    // project.addToPbxResourcesBuildPhase(file)

    console.log('added file to project: ' + JSON.stringify(file))

    if (fs.writeFileSync(projectPbxprojName, project.writeSync()) <= 0) {
      console.error('error writing updated project')
      return
    }

    console.info('Added branch.json to project ' + xcodeprojName)
  })
}

addBranchConfigToProjects('TestProject')
