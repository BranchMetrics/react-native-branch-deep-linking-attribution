import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

const { RNBranch, RNBranchEventEmitter } = NativeModules
const nativeEventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(RNBranchEventEmitter) : DeviceEventEmitter

import createBranchUniversalObject from './branchUniversalObject'

const INIT_SESSION_TTL = 5000

export const AddToWishlistEvent = "Add to Wishlist"
export const PurchasedEvent = "Purchased"
export const PurchaseInitiatedEvent = "Purchase Started"
export const RegisterViewEvent = "View"
export const ShareCompletedEvent = "Share Completed"
export const ShareInitiatedEvent = "Share Started"

class Branch {
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
    if (this._timeSinceLaunch() < INIT_SESSION_TTL) {
      RNBranch.redeemInitSessionResult().then((result) => {
        if (result) {
          listener(result)
        }
      })
    }

    const successSubscription = nativeEventEmitter.addListener(RNBranch.INIT_SESSION_SUCCESS, listener)
    const errorSubscription = nativeEventEmitter.addListener(RNBranch.INIT_SESSION_ERROR, listener)

    const unsubscribe = () => {
      successSubscription.remove()
      errorSubscription.remove()
    }

    return unsubscribe
  }

  _timeSinceLaunch() {
    return new Date().getTime() - this._launchTime
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
