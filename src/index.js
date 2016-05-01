import { NativeModules, NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

// According to the React Native docs from 0.21, NativeAppEventEmitter is used for native iOS modules to emit events. DeviceEventEmitter is used for native Android modules.
// Both are technically supported on Android -- but I chose to follow the suggested route by the documentation to minimize the risk of this code breaking with a future release
// in case NativeAppEventEmitter ever got deprecated on Android
const nativeEventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter
const { RNBranch } = NativeModules

import createBranchUniversalObject from './branchUniversalObject'

const INIT_SESSION_SUCCESS = 'RNBranch.initSessionSuccess'
const INIT_SESSION_ERROR = 'RNBranch.initSessionError'

class Branch {

  _initSessionResult = null;
  _lastParams = null;
  _listeners = [];
  _patientInitSessionObservers = [];

  constructor() {
    // listen for initSession results and errors.
    nativeEventEmitter.addListener(INIT_SESSION_SUCCESS, this._onInitSessionResult)
    nativeEventEmitter.addListener(INIT_SESSION_ERROR, this._onInitSessionResult)

    this._processInitSession()
  }

  /*** RNBranch Deep Linking ***/
  async _processInitSession() {
    // retrieve the last initSession if it exists
    let result = await RNBranch.getInitSessionResult()
    if (result) this._onInitSessionResult(result)
  }

  _onInitSessionResult = (result) => {
    this._initSessionResult = result

    this._patientInitSessionObservers.forEach((cb) => cb(result))
    if (this._isValidResult(result)) this._listeners.forEach(cb => cb(result))

    this._lastParams = result.params
    this._patientInitSessionObservers = []
  };

  // filter null and duplicate results (as observed in android. further investigation required) [rt2zz]
  _isValidResult(result) {
    if (!result || !result.params) return false
    return (!this._lastParams || this._lastParams['~id'] !== result.params['~id'] || this._lastParams['+click_timestamp'] !== result.params['+click_timestamp'])
  }

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

  /*** RNBranch singleton methods ***/
  setDebug = RNBranch.setDebug
  getLatestReferringParams = RNBranch.getLatestReferringParams
  getFirstReferringParams = RNBranch.getFirstReferringParams
  setIdentity = (identity) => RNBranch.setIdentity(identity)
  logout = RNBranch.logout
  userCompletedAction = (event, state = {}) => RNBranch.userCompletedAction(event, state)
  getShortUrl = RNBranch.getShortUrl

  /*** BranchUniversalObject ***/
  createBranchUniversalObject = createBranchUniversalObject
}

export default new Branch()
