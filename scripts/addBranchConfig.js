const androidUtil = require('./androidUtil')
const fs = require('fs')
const log = require('npmlog')
const iosUtil = require('./iosUtil')

log.heading = 'react-native-branch'

// TODO: Should it be possible to use just branch.debug.json w/o branch.json?
// This seems like an unlikely configuration. Maybe the check should just be
// for branch.json, or if just branch.debug.json exists, a warning should be
// generated.
if (!fs.existsSync('./branch.json') && !fs.existsSync('./branch.debug.json')) {
  log.info('branch.json not found. See https://rnbranch.app.link/branch-json for more information.')
  return
}

androidUtil.addBranchConfigToAndroidAssetsFolder()
iosUtil.addBranchConfigToXcodeProject()
