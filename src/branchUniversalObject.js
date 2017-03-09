import { NativeModules, Platform } from 'react-native'

const { RNBranch } = NativeModules

export default async function createBranchUniversalObject(identifier, options = {}) {
  if (typeof identifier !== 'string') throw new Error('react-native-branch: identifier must be a string')

  const branchUniversalObject = {
    contentIndexingMode: 'private',
    canonicalIdentifier: identifier,
    ...options
  }

  const { ident } = await RNBranch.createUniversalObject(branchUniversalObject)

  return {
    ident: ident,
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

      return RNBranch.showShareSheet(this.ident, shareOptions, linkProperties, controlParams)
    },
    registerView() {
      return RNBranch.registerView(this.ident)
    },
    async generateShortUrl(linkProperties = {}, controlParams = {}) {
      // try {
      return RNBranch.generateShortUrl(this.ident, linkProperties, controlParams)
      .catch (async (error) => {
        console.error("Error code = " + error.code)
        if (error.code != "RNBranch::Error::BUONotFound") {
          throw error
        }

        let { newIdent } = await RNBranch.createUniversalObject(branchUniversalObject)
        this.ident = newIdent
        console.info("Created new BUO with ident " + newIdent)
        return RNBranch.generateShortUrl(newIdent, linkProperties, controlParams)
      })
    },
    listOnSpotlight() {
      if (Platform.OS !== 'ios') return Promise.resolve()
      return RNBranch.listOnSpotlight(this.ident)
    },
    release() {
      RNBranch.releaseUniversalObject(this.ident)
    }
  }
}
