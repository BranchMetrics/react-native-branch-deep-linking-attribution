const androidUtil = require('./androidUtil')
const fs = require('fs')
const log = require('npmlog')
const path = require('path')
const iosUtil = require('./iosUtil')

log.heading = 'react-native-branch'

let exists = false
const files = [
  'branch.json',
  'branch.android.json',
  'branch.android.debug.json',
  'branch.debug.json',
  'branch.ios.json',
  'branch.ios.debug.json'
]

files.forEach(function(file) {
  exists = exists || fs.existsSync(path.join('.', file))
})

if (!exists) {
  log.info('branch.json not found. See https://rnbranch.app.link/branch-json for more information.')
  return
}

androidUtil.addBranchConfigToAndroidAssetsFolder()
iosUtil.addBranchConfigToXcodeProject()
