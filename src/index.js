import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

const { RNBranch, RNBranchEventEmitter } = NativeModules

import createBranchUniversalObject from './branchUniversalObject'

export const DEFAULT_INIT_SESSION_TTL = 5000

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
  initSessionTtl = DEFAULT_INIT_SESSION_TTL;

  _launchTime = new Date().getTime();
  _debug = false;

  constructor(options = {}) {
    if (options.debug) this._debug = true
  }

  subscribe(listener) {
    /*
     * If this is within the INIT_SESSION_TTL, get the cached value from the native layer (asynchronously).
     * If none, the listener is not called. If there is a cached value, it is passed to the listener.
     */
    if (this._timeSinceLaunch() < this.initSessionTtl) {
      RNBranch.redeemInitSessionResult().then((result) => {
        if (result) {
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

    const unsubscribe = () => {
      this._removeListener(listener)
    }

    return unsubscribe
  }

  _timeSinceLaunch() {
    return new Date().getTime() - this._launchTime
  }

  _addListener(listener) {
    this.nativeEventEmitter.addListener(RNBranch.INIT_SESSION_SUCCESS, listener)
    this.nativeEventEmitter.addListener(RNBranch.INIT_SESSION_ERROR, listener)
  }

  _removeListener(listener) {
    this.nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_SUCCESS, listener)
    this.nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_ERROR, listener)
  }

  /*** RNBranch singleton methods ***/
  setDebug = RNBranch.setDebug
  getLatestReferringParams = RNBranch.getLatestReferringParams
  getFirstReferringParams = RNBranch.getFirstReferringParams
  setIdentity = (identity) => RNBranch.setIdentity(identity)
  logout = RNBranch.logout
  userCompletedAction = (event, state = {}) => RNBranch.userCompletedAction(event, state)
  getShortUrl = RNBranch.getShortUrl

  /*** Referral Methods ***/
  redeemRewards = (amount, bucket) => RNBranch.redeemRewards(amount, bucket)
  loadRewards = RNBranch.loadRewards
  getCreditHistory = RNBranch.getCreditHistory

  /*** BranchUniversalObject ***/
  createBranchUniversalObject = createBranchUniversalObject
}

export { Branch }
export default new Branch()
