import { NativeModules } from 'react-native'
const { RNBranch } = NativeModules

export default class BranchEvent {
  name = null
  params = {}
  universalObjects = []

  constructor(name, params = {}, universalObjects = []) {
    this.name = name
    this.params = params
    if (Array.isArray(universalObjects)) {
      this.universalObjects = universalObjects
    }
    else {
      this.universalObjects = [universalObjects]
    }
  }

  async logEvent() {
    const idents = this.universalObjects.map((b) => b.ident)
    return await RNBranch.logEventWithUniversalObjects(idents, this.name, this.params)
  }
}
