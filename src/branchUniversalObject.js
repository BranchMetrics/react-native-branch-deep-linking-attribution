import { NativeModules, Platform } from 'react-native'
import BranchEvent from './BranchEvent'

const { RNBranch } = NativeModules

export default async function createBranchUniversalObject(identifier, options = {}) {
  if (typeof identifier !== 'string') throw new Error('react-native-branch: identifier must be a string')

  const contentMetadata = options.contentMetadata || {}

  if (contentMetadata.customMetadata) {
    for (const key in contentMetadata.customMetadata) {
      const valueType = typeof contentMetadata.customMetadata[key]
      if (valueType == 'string') continue
      console.warn('[Branch] customMetadata values must be strings. Value for property ' + key + ' has type ' + valueType + '.')
      // TODO: throw?
    }
  }

  const branchUniversalObject = {
    canonicalIdentifier: identifier,
    contentMetadata: contentMetadata,
    ...options
  }

  // For the benefit of NSDecimalNumber on iOS.
  const price = contentMetadata.price === undefined ? undefined : '' + contentMetadata.price
  branchUniversalObject.contentMetadata.price = price

  if (options.automaticallyListOnSpotlight !== undefined) {
    console.info('[Branch] automaticallyListOnSpotlight is deprecated. Please use locallyIndex instead.')
  }

  if (options.price !== undefined) {
    console.info('[Branch] price is deprecated. Please use contentMetadata.price instead.')
  }

  if (options.currency !== undefined) {
    console.info('[Branch] currency is deprecated. Please use contentMetadata.price instead.')
  }

  if (options.metadata !== undefined) {
    console.info('[Branch] metadata is deprecated. Please use contentMetadata.customMetadata instead.')
  }

  if (options.contentIndexingMode !== undefined) {
    console.info('[Branch] contentIndexingMode is deprecated. Please use locallyIndex or publiclyIndex instead.')
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
      if (event == RNBranch.REGISTER_VIEW_EVENT) {
        return this.logEvent(BranchEvent.ViewItem, { customData: state })
      }
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
