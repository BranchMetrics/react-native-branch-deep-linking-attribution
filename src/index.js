import { NativeModules, NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

// According to the React Native docs from 0.21, NativeAppEventEmitter is used for native iOS modules to emit events. DeviceEventEmitter is used for native Android modules.
// Both are technically supported on Android -- but I chose to follow the suggested route by the documentation to minimize the risk of this code breaking with a future release
// in case NativeAppEventEmitter ever got deprecated on Android
const nativeEventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter
const { RNBranch } = NativeModules

import createBranchUniversalObject from './branchUniversalObject'

const INIT_SESSION_SUCCESS = 'RNBranch.initSessionSuccess'
const INIT_SESSION_ERROR = 'RNBranch.initSessionError'
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
          this._dumpParams(result)
          listener(result)
        }
      })
    }

    nativeEventEmitter.addListener(INIT_SESSION_SUCCESS, listener)
    nativeEventEmitter.addListener(INIT_SESSION_ERROR, listener)

    const unsubscribe = () => {
      nativeEventEmitter.removeListener(INIT_SESSION_SUCCESS, listener)
      nativeEventEmitter.removeListener(INIT_SESSION_ERROR, listener)
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
