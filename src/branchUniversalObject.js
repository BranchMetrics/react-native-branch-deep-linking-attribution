import { NativeModules, Platform } from 'react-native'

const { RNBranch } = NativeModules

export default async function createBranchUniversalObject(identifier, options = {}) {
  if (typeof identifier !== 'string') throw new Error('react-native-branch: identifier must be a string')

  const branchUniversalObject = {
    contentIndexingMode: 'private',
    canonicalIdentifier: identifier,
    ...options
  }

  let { ident } = await RNBranch.createUniversalObject(branchUniversalObject)

  return {
    showShareSheet(shareOptions = {}, linkProperties = {}, controlParams = {}) {
      shareOptions = {
        title: options.title || '',
        text: options.contentDescription || '',
        ...shareOptions,
      }

      linkProperties = {
        feature: 'share',
        channel: 'RNApp',
        ...linkProperties,
      }

      return RNBranch.showShareSheet(ident, shareOptions, linkProperties, controlParams)
    },
    registerView() {
      return RNBranch.registerView(ident)
    },
    generateShortUrl(linkProperties = {}, controlParams = {}) {
      return RNBranch.generateShortUrl(ident, linkProperties, controlParams)
    },
    listOnSpotlight() {
      if (Platform.OS !== 'ios') return Promise.resolve()
      return RNBranch.listOnSpotlight(ident)
    },
    release() {
      RNBranch.releaseUniversalObject(ident)
    }
  }
}
