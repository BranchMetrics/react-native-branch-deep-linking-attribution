const androidUtil = require('./androidUtil')
const iosUtil = require('./iosUtil')

androidUtil.removeBranchConfigFromAndroidAssetsFolder()
iosUtil.removeBranchConfigFromXcodeProject()
