import { NativeModules, Platform } from 'react-native'
import BranchEvent from './BranchEvent'

const { RNBranch } = NativeModules

export default async function createBranchUniversalObject(identifier, options = {}) {
  if (typeof identifier !== 'string') throw new Error('react-native-branch: identifier must be a string')

  const branchUniversalObject = {
    canonicalIdentifier: identifier,
    ...options
  }

  if (branchUniversalObject.automaticallyListOnSpotlight !== undefined) {
    console.info('[Branch] automaticallyListOnSpotlight is deprecated. Please use locallyIndex instead.')
  }

  if (branchUniversalObject.price !== undefined) {
    console.info('[Branch] price is deprecated. Please use contentMetadata.price instead.')
  }

  if (branchUniversalObject.metadata !== undefined) {
    console.info('[Branch] metadata is deprecated. Please use contentMetadata.customMetadata instead.')
  }

  if (branchUniversalObject.contentIndexingMode !== undefined) {
    console.info('[Branch] contentIndexingMode is deprecated. Please use locallyIndex or publiclyIndex instead.')
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
      console.info('[Branch] registerView is deprecated. Please use logEvent(BranchEvent.ViewItem) instead.')
      return this._tryFunction(RNBranch.registerView)
    },
    generateShortUrl(linkProperties = {}, controlParams = {}) {
      return this._tryFunction(RNBranch.generateShortUrl, linkProperties, controlParams)
    },
    listOnSpotlight() {
      console.info('[Branch] listOnSpotlight is deprecated. Please use locallyIndex instead.')
      if (Platform.OS !== 'ios') return Promise.resolve()
      return this._tryFunction(RNBranch.listOnSpotlight)
    },
    userCompletedAction(event, state = {}) {
      console.info('[Branch] userCompletedAction is deprecated. Please use logEvent or the BranchEvent class instead.')
      return this._tryFunction(RNBranch.userCompletedActionOnUniversalObject, event, state)
    },
    logEvent(eventName, params = {}) {
      return new BranchEvent(eventName, this, params).logEvent()
    },
    release() {
      return RNBranch.releaseUniversalObject(this.ident)
    },

    /**
     * Used by exception handlers when RNBranch::Error::BUONotFound is caught.
     */
    _newIdent() {
      return RNBranch.createUniversalObject(branchUniversalObject).then(({ident}) => {
        this.ident = ident
        return ident
      })
    },

    _tryFunction(func, ...args) {
      return func(this.ident, ...args).catch((error) => {
        if (error.code != 'RNBranch::Error::BUONotFound') {
          throw error
        }
        return this._newIdent().then((ident) => {
          return func(ident, ...args)
        })
      })
    }
  }
}
