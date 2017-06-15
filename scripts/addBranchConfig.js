var androidUtil = require('./androidUtil')
var fs = require('fs')
var iosUtil = require('./iosUtil')

if (!fs.existsSync('./branch.json') && !fs.existsSync('./branch.debug.json')) {
  return
}

androidUtil.addBranchConfigToAndroidAssetsFolder()
iosUtil.addBranchConfigToXcodeProject()
