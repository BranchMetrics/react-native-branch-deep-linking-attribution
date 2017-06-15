var androidUtil = require('./androidUtil')
var fs = require('fs')
var iosUtil = require('./iosUtil')

// TODO: Should it be possible to use just branch.debug.json w/o branch.json?
// This seems like an unlikely configuration. Maybe the check should just be
// for branch.json, or if just branch.debug.json exists, a warning should be
// generated.
if (!fs.existsSync('./branch.json') && !fs.existsSync('./branch.debug.json')) {
  return
}

androidUtil.addBranchConfigToAndroidAssetsFolder()
iosUtil.addBranchConfigToXcodeProject()
