var androidUtil = require('./androidUtil')
var fs = require('fs')
var iosUtil = require('./iosUtil')

if (!fs.existsSync('./branch.json')) {
  return
}

androidUtil.addBranchJsonToAndroidAssetsFolder()
iosUtil.addBranchConfigToXcodeProject()
