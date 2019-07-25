import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

const { RNBranch, RNBranchEventEmitter } = NativeModules

import createBranchUniversalObject from './branchUniversalObject'
import BranchEvent from './BranchEvent'

const packageFile = require('./../package.json')
export const VERSION = packageFile.version

export const AddToCartEvent = RNBranch.ADD_TO_CART_EVENT
export const AddToWishlistEvent = RNBranch.ADD_TO_WISHLIST_EVENT
export const PurchasedEvent = RNBranch.PURCHASED_EVENT
export const PurchaseInitiatedEvent = RNBranch.PURCHASE_INITIATED_EVENT
export const RegisterViewEvent = RNBranch.REGISTER_VIEW_EVENT
export const ShareCompletedEvent = RNBranch.SHARE_COMPLETED_EVENT
export const ShareInitiatedEvent = RNBranch.SHARE_INITIATED_EVENT

class Branch {
  nativeEventEmitter = Platform.select({
    android: DeviceEventEmitter,
    ios: new NativeEventEmitter(RNBranchEventEmitter)
  })

  key = null;
  _checkCachedEvents = true;
  _debug = false;

  constructor(options = {}) {
    if (options.debug) this._debug = true

    console.info('Initializing react-native-branch v. ' + VERSION)
  }

  subscribe(listener) {

    /*
     * If _checkCachedEvents flag is set, get the cached value from the native layer (asynchronously).
     * If none, the listener is not called. If there is a cached value, it is passed to the listener.
     */
    if (this._checkCachedEvents) {
      this._checkCachedEvents = false

      RNBranch.redeemInitSessionResult().then((result) => {
        if (result) {
          /*** Cached value is returned, so set it as cached. ***/
          if('params' in result && !!result['params']) {
            result['params']['+rn_cached_initial_event'] = true
          }

          listener(result)
        }

        /*
         * https://github.com/BranchMetrics/react-native-branch-deep-linking/issues/79
         *
         * By waiting until redeemInitSessionResult() returns, we roughly simulate a
         * synchronous call to the native layer.
         *
         * Note that this is equivalent to
         *
         * let result = await RNBranch.redeemInitSessionResult()
         * if (result) listener(result)
         * this._addListener(listener)
         *
         * But by using then(), the subscribe method does not have to be async.
         * This way, we don't add event listeners until the listener has received the
         * initial cached value, which essentially eliminates all possibility of
         * getting the same event twice.
         */
        this._addListener(listener)
      })
    }
    else {
      this._addListener(listener)
    }

    // Initialize the native Branch SDK from JS
    // -- Unsupportable on Android for the time being.
    // RNBranch.initializeBranch(this.key)

    const unsubscribe = () => {
      this._removeListener(listener)
    }

    return unsubscribe
  }

  skipCachedEvents() {
    /*** Sets to ignore cached events. ***/
    this._checkCachedEvents = false
  }

  _addListener(listener) {
    this.nativeEventEmitter.addListener(RNBranch.INIT_SESSION_SUCCESS, listener)
    this.nativeEventEmitter.addListener(RNBranch.INIT_SESSION_ERROR, listener)
  }

  _removeListener(listener) {
    this.nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_SUCCESS, listener)
    this.nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_ERROR, listener)
  }

  /*** Tracking related methods ***/
  disableTracking = (disable) => RNBranch.disableTracking(disable)
  isTrackingDisabled = RNBranch.isTrackingDisabled

  /*** RNBranch singleton methods ***/
  setDebug = () => { throw 'setDebug() is not supported in the RN SDK. For other solutions, please see https://rnbranch.app.link/setDebug' }
  getLatestReferringParams = (synchronous = false) => RNBranch.getLatestReferringParams(synchronous)
  getFirstReferringParams = RNBranch.getFirstReferringParams
  setIdentity = (identity) => RNBranch.setIdentity(identity)
  logout = RNBranch.logout
  userCompletedAction = (event, state = {}) => RNBranch.userCompletedAction(event, state)
  getShortUrl = RNBranch.getShortUrl
  sendCommerceEvent = (revenue, metadata) => {
    console.info('[Branch] sendCommerceEvent is deprecated. Please use the BranchEvent class instead.')
    return RNBranch.sendCommerceEvent('' + revenue, metadata)
  }
  openURL = (url, options = {}) => {
    return Platform.select({
      android: () => RNBranch.openURL(url, options),
      ios: () => RNBranch.openURL(url)
    })()
  }

  /*** Referral Methods ***/
  redeemRewards = (amount, bucket) => RNBranch.redeemRewards(amount, bucket)
  loadRewards = (bucket) => RNBranch.loadRewards(bucket)
  getCreditHistory = RNBranch.getCreditHistory

  /*** BranchUniversalObject ***/
  createBranchUniversalObject = createBranchUniversalObject
}

export { Branch, BranchEvent }
export default new Branch()
