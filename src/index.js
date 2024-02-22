import { NativeModules, Platform } from 'react-native'

const { RNBranch } = NativeModules

import createBranchUniversalObject from './branchUniversalObject'
import BranchEvent from './BranchEvent'
import BranchSubscriber from './BranchSubscriber'

const packageFile = require('./../package.json')
export const VERSION = packageFile.version

class Branch {
  key = null;
  _checkCachedEvents = true;
  _debug = false;

  constructor(options = {}) {
    if (options.debug) this._debug = true

    console.info('Initializing react-native-branch v. ' + VERSION)
  }

  subscribe(options) {
    if (typeof options === 'function') {
      /*
       * Support for legacy API, passing a single callback function:
       * branch.subscribe(({params, error, uri}) => { ... }). This is
       * the same as the onOpenComplete callback.
       */
      options = {
        onOpenComplete: options,
      }
    }

    /*
     * You can specify checkCachedEvents in the subscribe options to control
     * this per subscriber.
     */
    if (!('checkCachedEvents' in options)) {
      options.checkCachedEvents = this._checkCachedEvents
    }
    this._checkCachedEvents = false

    const subscriber = new BranchSubscriber(options)
    subscriber.subscribe()

    return () => subscriber.unsubscribe()
  }

  skipCachedEvents() {
    /*** Sets to ignore cached events. ***/
    this._checkCachedEvents = false
  }

  /*** Tracking related methods ***/
  disableTracking = (disable) => RNBranch.disableTracking(disable)
  isTrackingDisabled = RNBranch.isTrackingDisabled

  /*** RNBranch singleton methods ***/
  setDebug = () => { throw 'setDebug() is not supported in the RN SDK. For other solutions, please see https://rnbranch.app.link/setDebug' }
  getLatestReferringParams = (synchronous = false) => RNBranch.getLatestReferringParams(synchronous)
  getFirstReferringParams = RNBranch.getFirstReferringParams
  lastAttributedTouchData =  (attributionWindow = {}) => RNBranch.lastAttributedTouchData(attributionWindow)
  setIdentity = (identity) => RNBranch.setIdentity(identity)
  setIdentityAsync = (identity) => RNBranch.setIdentityAsync(identity)
  setRequestMetadata = (key, value) => {
    console.info('[Branch] setRequestMetadata has limitations when called from JS.  Some network calls are made prior to the JS layer being available, those calls will not have the metadata.')
    return RNBranch.setRequestMetadataKey(key, value)
  }
  addFacebookPartnerParameter = (name, value) => {
    console.info('[Branch] addFacebookPartnerParameter has limitations when called from JS.  Some network calls are made prior to the JS layer being available, those calls will not have the partner parameters.')
    return RNBranch.addFacebookPartnerParameter(name, value)
  }
  addSnapPartnerParameter = (name, value) => {
    console.info('[Branch] addSnapPartnerParameter has limitations when called from JS.  Some network calls are made prior to the JS layer being available, those calls will not have the partner parameters.')
    return RNBranch.addSnapPartnerParameter(name, value)
  }
  clearPartnerParameters = RNBranch.clearPartnerParameters
  logout = RNBranch.logout
  getShortUrl = RNBranch.getShortUrl
  openURL = (url, options = {}) => {
    return Platform.select({
      android: () => RNBranch.openURL(url, options),
      ios: () => RNBranch.openURL(url)
    })()
  }
  handleATTAuthorizationStatus = (ATTAuthorizationStatus) => {
    if (Platform.OS != 'ios') return;
    let normalizedAttAuthorizationStatus = -1

    switch(ATTAuthorizationStatus) {
      case 'authorized':
        normalizedAttAuthorizationStatus = 3;
        break;
      case 'denied':
        normalizedAttAuthorizationStatus = 2;
        break;
      case 'undetermined':
        normalizedAttAuthorizationStatus = 0;
        break;
      case 'restricted':
        normalizedAttAuthorizationStatus = 1;
        break;
    }

    if (normalizedAttAuthorizationStatus < 0) {
      console.info('[Branch] handleATTAuthorizationStatus received an unrecognized value. Value must be one of; authorized, denied, undetermined, or restricted')
      return;
    }

    RNBranch.handleATTAuthorizationStatus(normalizedAttAuthorizationStatus)
  }

  /*** BranchUniversalObject ***/
  createBranchUniversalObject = createBranchUniversalObject

  /*** BranchQRCode ***/
  getBranchQRCode = (qrCodeSettings = {}, branchUniversalObject = {}, linkProperties = {}, controlParams = {}) => {
    return RNBranch.getBranchQRCode(qrCodeSettings, branchUniversalObject, linkProperties, controlParams);
  }

  /*** PreInstall Parameters ***/
  setPreInstallCampaign = (campaign) => RNBranch.setPreinstallCampaign(campaign)
  setPreInstallPartner = (partner) => RNBranch.setPreinstallPartner(partner)

  /*** DMA Consent Params ***/
  setDMAParamsForEEA = (eeaRegion, adPersonalizationConsent, adUserDataUsageConsent) => {
    RNBranch.setDMAParamsForEEA(eeaRegion, adPersonalizationConsent, adUserDataUsageConsent);
  }

}

export { Branch, BranchEvent, BranchSubscriber }
export default new Branch()
