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
  _initSessionResult = null;
  _lastParams = null;
  _listeners = [];
  _patientInitSessionObservers = [];
  _debug = false;

  constructor(options = {}) {
    if (options.debug) this._debug = true

    // listen for initSession results and errors.
    nativeEventEmitter.addListener(INIT_SESSION_SUCCESS, this._onInitSessionResult)
    nativeEventEmitter.addListener(INIT_SESSION_ERROR, this._onInitSessionResult)

    this._initializeCache()
  }

  /*** RNBranch Deep Linking ***/
  async _initializeCache() {
    // void cache after TTL expires
    setTimeout(() => {
      this._initSessionResult = null
    }, INIT_SESSION_TTL)

    // retrieve the last initSession if it exists
    this._initSessionResult = await RNBranch.redeemInitSessionResult()
  }

  _onInitSessionResult = (result) => {
    // redeem the result so it can be cleared from the native cache
    RNBranch.redeemInitSessionResult()

    // Cache up to the TTL
    if (this._timeSinceLaunch() < INIT_SESSION_TTL) {
      this._initSessionResult = result
    }

    if (this._debug && !result) console.log('## Branch: received null result in _onInitSessionResult')

    this._patientInitSessionObservers.forEach((cb) => cb(result))
    this._listeners.forEach(cb => cb(result))

    this._lastParams = result && result.params || {}
    this._patientInitSessionObservers = []
  };

  getInitSession(cb) {
    if(this._initSessionResult) return cb(this._initSessionResult)
    this._patientInitSessionObservers.push(cb)
  }

  subscribe(listener) {
    if (this._initSessionResult) listener(this._initSessionResult)
    this._listeners.push(listener)
    const unsubscribe = () => {
      let index = this._listeners.indexOf(listener)
      this._listeners.splice(index, 1)
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
