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

      return this.tryFunction(RNBranch.showShareSheet, this.ident, shareOptions, linkProperties, controlParams)
    },
    registerView() {
      return this.tryFunction(RNBranch.registerView, this.ident)
    },
    generateShortUrl(linkProperties = {}, controlParams = {}) {
      return this.tryFunction(RNBranch.generateShortUrl, this.ident, linkProperties, controlParams)
    },
    listOnSpotlight() {
      if (Platform.OS !== 'ios') return Promise.resolve()
      return this.tryFunction(RNBranch.listOnSpotlight, this.ident)
    },
    release() {
      RNBranch.releaseUniversalObject(this.ident)
    },

    tryFunction(func, ident, ...args) {
      return func(ident, ...args).catch((error) => {
        console.error("Error code = " + error.code)
        if (error.code != "RNBranch::Error::BUONotFound") {
          throw error
          console.log("rethrew error")
        }

        return RNBranch.createUniversalObject(branchUniversalObject)
      })
      .then((response) => {
        console.info("Created new BUO with ident " + response.ident)
        this.ident = response.ident
        return func(response.ident, ...args)
      })
    }
  }
}
