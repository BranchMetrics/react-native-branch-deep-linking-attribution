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

      return this._tryFunction(RNBranch.showShareSheet, shareOptions, linkProperties, controlParams)
    },
    // deprecated in favor of userCompletedAction(RegisterViewEvent)
    registerView() {
      return this._tryFunction(RNBranch.registerView)
    },
    generateShortUrl(linkProperties = {}, controlParams = {}) {
      return this._tryFunction(RNBranch.generateShortUrl, linkProperties, controlParams)
    },
    listOnSpotlight() {
      if (Platform.OS !== 'ios') return Promise.resolve()
      return this._tryFunction(RNBranch.listOnSpotlight)
    },
    userCompletedAction(event, state = {}) {
      return this._tryFunction(RNBranch.userCompletedActionOnUniversalObject, event, state)
    },
    release() {
      RNBranch.releaseUniversalObject(this.ident)
    },

    _tryFunction(func, ...args) {
      return func(this.ident, ...args).catch((error) => {
        if (error.code != 'RNBranch::Error::BUONotFound') {
          throw error
        }

        return RNBranch.createUniversalObject(branchUniversalObject).then((response) => {
          this.ident = response.ident
          return func(response.ident, ...args)
        })
      })
    }
  }
}
