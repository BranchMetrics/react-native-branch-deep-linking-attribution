function getGroupKeyByName(project, groupName) {
  var objects = project.hash.project.objects['PBXGroup']
  for (var key in objects) {
    var name = objects[key].name
    if (name == groupName) return key
  }
  return null
}

function getTargetKeyByName(project, targetName) {
  var targets = project.pbxNativeTargetSection()
  for (var key in targets) {
    var name = targets[key].name
    if (name == targetName) return key
  }
  return null
}

function correctForPath(file, project, group) {
    var r_group_dir = new RegExp('^' + group + '[\\\\/]');

    if (project.pbxGroupByName(group).path)
        file.path = file.path.replace(r_group_dir, '');

    return file;
}

module.exports = {
  correctForPath: correctForPath,
  getGroupKeyByName: getGroupKeyByName,
  getTargetKeyByName: getTargetKeyByName
}
